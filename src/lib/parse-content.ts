/**
 * Wrapper around @lossless-group/lfm's parseMarkdown that ensures citation
 * processing works regardless of the installed LFM version.
 *
 * LFM >= 0.2 includes remark-citations natively. LFM 0.1.x does not, so this
 * module polyfills the same logic: sequential indexing of footnoteReference
 * nodes, structured parsing of footnoteDefinition nodes, and removal of
 * definitions from the tree.
 *
 * Usage:
 *   import { parseContent } from '../lib/parse-content';
 *   const { tree, citations } = await parseContent(markdownString);
 */

import { parseMarkdown } from '@lossless-group/lfm';

export interface Citation {
  identifier: string;
  hex: string;
  index: number;
  title?: string;
  url?: string;
  source?: string;
  publishedDate?: string;
  updatedDate?: string;
  raw: string;
  parsed: boolean;
}

const TITLE_URL_RE = /\[([^\]]+)\]\(([^)]+)\)/;
const PUBLISHED_RE = /Published:\s*([\d-]+)/;

function extractText(children: any[]): string {
  if (!children) return '';
  return children.map((c: any) => {
    if (c.type === 'text') return c.value;
    if (c.type === 'link') return `[${extractText(c.children)}](${c.url})`;
    if (c.children) return extractText(c.children);
    return '';
  }).join('');
}

function collectRefs(node: any, refOrder: string[]) {
  if (node.type === 'footnoteReference' && !refOrder.includes(node.identifier)) {
    refOrder.push(node.identifier);
  }
  if (node.children) for (const c of node.children) collectRefs(c, refOrder);
}

function enrichRefs(node: any, indexMap: Map<string, number>) {
  if (node.type === 'footnoteReference') {
    const idx = indexMap.get(node.identifier);
    if (idx !== undefined) {
      if (!node.data) node.data = {};
      node.data.citationIndex = idx;
      node.data.citationHex = node.identifier;
    }
  }
  if (node.children) for (const c of node.children) enrichRefs(c, indexMap);
}

function collectDefs(node: any, indexMap: Map<string, number>, citationList: Citation[]) {
  if (node.type === 'footnoteDefinition') {
    const id = node.identifier;
    const idx = indexMap.get(id);
    if (idx !== undefined) {
      const raw = extractText(node.children);
      const titleMatch = raw.match(TITLE_URL_RE);
      const pubMatch = raw.match(PUBLISHED_RE);
      let source: string | undefined;
      if (titleMatch?.[2]) {
        try { source = new URL(titleMatch[2]).hostname.replace(/^www\./, ''); } catch {}
      }
      citationList.push({
        identifier: id, hex: id, index: idx, raw,
        title: titleMatch?.[1], url: titleMatch?.[2], source,
        publishedDate: pubMatch?.[1],
        parsed: !!titleMatch,
      });
    }
  }
  if (node.children) for (const c of node.children) collectDefs(c, indexMap, citationList);
}

function removeDefs(node: any) {
  if (node.children) {
    node.children = node.children.filter((c: any) => c.type !== 'footnoteDefinition');
    for (const c of node.children) removeDefs(c);
  }
}

/**
 * Post-parse callout fix: LFM 0.1.x's remarkCallouts regex fails when the
 * callout marker and body text are merged into a single text node with \n.
 * This walks the tree and transforms any surviving blockquotes that contain
 * [!type] syntax into containerDirective nodes.
 */
const CALLOUT_RE = /^\[!(\w+)\]\s*(.*)?$/m;

function fixCallouts(node: any) {
  if (!node.children) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === 'blockquote') {
      const transformed = tryTransformCallout(child);
      if (transformed) {
        node.children[i] = transformed;
        continue;
      }
    }
    fixCallouts(child);
  }
}

function tryTransformCallout(blockquote: any): any | null {
  const firstChild = blockquote.children?.[0];
  if (!firstChild || firstChild.type !== 'paragraph') return null;
  const firstInline = firstChild.children?.[0];
  if (!firstInline || firstInline.type !== 'text') return null;

  // Match against just the first line of the text node
  const firstLine = firstInline.value.split('\n')[0];
  const match = firstLine.match(CALLOUT_RE);
  if (!match) return null;

  const calloutType = match[1].toLowerCase();
  const title = match[2]?.trim() || undefined;

  // Remainder of the first text node after the [!type] line
  const restOfText = firstInline.value.slice(firstLine.length);
  const remainingInline = firstChild.children.slice(1);
  const remainingBlocks = blockquote.children.slice(1);

  const calloutChildren: any[] = [];

  // Build body from leftover text + remaining inlines
  if (restOfText.length > 1 || remainingInline.length > 0) {
    const bodyInlines: any[] = [];
    if (restOfText.length > 1) {
      // Strip leading \n
      bodyInlines.push({ type: 'text', value: restOfText.replace(/^\n/, '') });
    }
    bodyInlines.push(...remainingInline);
    if (bodyInlines.length > 0) {
      calloutChildren.push({ type: 'paragraph', children: bodyInlines });
    }
  }

  calloutChildren.push(...remainingBlocks);

  return {
    type: 'containerDirective',
    name: 'callout',
    attributes: {
      type: calloutType,
      ...(title ? { title } : {}),
    },
    children: calloutChildren,
    data: {
      hName: 'div',
      hProperties: { class: `callout callout-${calloutType}` },
    },
  };
}

/**
 * Parse markdown content and return an enriched MDAST tree with citations.
 * Works with any LFM version — polyfills citation and callout processing if needed.
 */
export async function parseContent(markdown: string): Promise<{ tree: any; citations: Citation[] }> {
  const tree = await parseMarkdown(markdown);

  // Fix callouts that remarkCallouts missed (multiline text node bug in 0.1.x)
  fixCallouts(tree);

  // If remark-citations already ran (LFM >= 0.2), use its output
  const existing = (tree as any).data?.citations?.ordered;
  if (existing && existing.length > 0) {
    return { tree, citations: existing };
  }

  // Polyfill: replicate remark-citations logic for LFM 0.1.x
  const refOrder: string[] = [];
  collectRefs(tree, refOrder);

  const indexMap = new Map<string, number>();
  refOrder.forEach((id, i) => indexMap.set(id, i + 1));

  enrichRefs(tree, indexMap);

  const citationList: Citation[] = [];
  collectDefs(tree, indexMap, citationList);
  removeDefs(tree);

  const citations = citationList.sort((a, b) => a.index - b.index);
  return { tree, citations };
}
