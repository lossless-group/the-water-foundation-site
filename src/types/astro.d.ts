// Type definitions for Astro global object
declare namespace App {
  interface Locals {
    // Add any local types here if needed
  }
}

// Extend the global Astro interface
declare global {
  interface AstroGlobal extends Record<string, any> {
    props: Record<string, any>;
    request: Request;
    url: URL;
    redirect: (url: string | URL) => Response | Promise<Response>;
    response: ResponseInit & {
      status?: number;
      statusText?: string;
      headers?: HeadersInit;
    };
  }

  const Astro: Readonly<AstroGlobal>;
}

export {};
