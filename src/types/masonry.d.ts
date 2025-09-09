// Type definitions for masonry-layout
declare module 'masonry-layout' {
  interface MasonryOptions {
    itemSelector?: string;
    columnWidth?: number | string | Element;
    gutter?: number | string;
    percentPosition?: boolean;
    horizontalOrder?: boolean;
  }

  class Masonry {
    constructor(element: Element | string, options?: MasonryOptions);
    layout(): void;
    layoutItems(items: Element[], isStill?: boolean): void;
    stamp(elements: Element | Element[]): void;
    unstamp(elements: Element | Element[]): void;
    appended(elements: Element | Element[]): void;
    prepended(elements: Element | Element[]): void;
    addItems(elements: Element | Element[]): void;
    remove(elements: Element | Element[]): void;
    reloadItems(): void;
    reload(): void;
    destroy(): void;
    getItemElements(): Element[];
    on(eventName: string, listener: (...args: any[]) => void): void;
    off(eventName: string, listener: (...args: any[]) => void): void;
    once(eventName: string, listener: (...args: any[]) => void): void;
  }

  export = Masonry;
}
