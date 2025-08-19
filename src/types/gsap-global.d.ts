// Type definitions for GSAP and ScrollTrigger
declare namespace gsap {
  interface TweenVars {
    [key: string]: any;
    delay?: number;
    duration?: number;
    ease?: string | gsap.EaseFunction;
    onComplete?: gsap.Callback;
    onStart?: gsap.Callback;
    onUpdate?: gsap.Callback;
    x?: number | string;
    y?: number | string;
    scale?: number;
    opacity?: number;
    transformOrigin?: string;
  }

  interface Callback {
    (): void;
  }

  interface EaseFunction {
    (amount: number): number;
  }

  interface Tween {
    kill(): void;
    pause(): void;
    play(): void;
    progress(value?: number): number | this;
    restart(includeDelay?: boolean, suppressEvents?: boolean): this;
    resume(): this;
    reverse(): this;
    seek(time: number, suppressEvents?: boolean): this;
    time(value?: number, suppressEvents?: boolean): number | this;
    totalTime(value?: number, suppressEvents?: boolean): number | this;
  }

  interface TimelineVars {
    [key: string]: any;
    delay?: number;
    onComplete?: Callback;
    onStart?: Callback;
    onUpdate?: Callback;
    scrollTrigger?: ScrollTrigger.Vars;
    autoRemoveChildren?: boolean;
    defaults?: TweenVars;
  }

  interface Timeline extends Tween {
    to(target: any, vars: TweenVars): this;
    from(target: any, vars: TweenVars): this;
    fromTo(target: any, fromVars: TweenVars, toVars: TweenVars): this;
    set(target: any, vars: TweenVars): this;
  }

  interface Core {
    to(target: any, duration: number, vars: TweenVars): Tween;
    from(target: any, duration: number, vars: TweenVars): Tween;
    fromTo(target: any, duration: number, fromVars: TweenVars, toVars: TweenVars): Tween;
    set(target: any, vars: TweenVars): Tween;
    timeline(vars?: TimelineVars): Timeline;
    registerPlugin(plugin: any): void;
  }

  interface ScrollTrigger {
    static create(vars: ScrollTrigger.Vars): ScrollTrigger.Instance;
    static getAll(): ScrollTrigger.Instance[];
    static refresh(): void;
    static update(): void;
    static clearMatchMedia(): void;
    static config(vars: ScrollTrigger.StaticVars): void;
    static register(plugin: any): void;
    static registerPersistence(plugin: any): void;
    static sort(): void;
    static updateAll(): void;
    static getById(id: string): ScrollTrigger.Instance | null;
    static isInViewport(element: Element | string, percent?: number): boolean;
    static maxScroll(element: Element | string, horizontal?: boolean): number;
    static positionInViewport(element: Element | string, viewport?: Element): { x: number; y: number };
    static scrollRounded(roundingIncrement: number): void;
    static setScrollRounded(roundingIncrement: number): void;
  }

  namespace ScrollTrigger {
    interface Vars {
      trigger?: Element | string;
      start?: string | number | (() => string | number);
      end?: string | number | (() => string | number);
      scrub?: boolean | number;
      snap?: any;
      onEnter?: Callback;
      onLeave?: Callback;
      onEnterBack?: Callback;
      onLeaveBack?: Callback;
      onUpdate?: (self: Instance) => void;
      onToggle?: (self: Instance) => void;
      onRefresh?: (self: Instance) => void;
      onScrubComplete?: (self: Instance) => void;
      onSnapComplete?: (self: Instance) => void;
      onRefreshInit?: (self: Instance) => void;
      onKill?: (self: Instance) => void;
      markers?: boolean | object;
      id?: string;
    }

    interface StaticVars {
      limitCallbacks?: boolean;
      autoRefreshEvents?: string;
    }

    interface Instance {
      animation?: any;
      direction: number;
      end: number;
      isActive: boolean;
      progress: number;
      scroller: Element;
      start: number;
      trigger: Element;
      vars: Vars;
      disable: (refresh?: boolean) => void;
      enable: (refresh?: boolean) => void;
      getVelocity: () => number;
      getScroll: () => number;
      isInViewport: (percent?: number) => boolean;
      kill: () => void;
      refresh: () => void;
      revert: () => void;
      tween: Tween;
      tweenTo: (position: any) => Tween;
      update: () => void;
    }
  }
}

declare const gsap: gsap.Core;

declare module 'gsap' {
  export = gsap;
  export as namespace gsap;
}

declare module 'gsap/ScrollTrigger' {
  export = gsap.ScrollTrigger;
  export as namespace ScrollTrigger;
}

declare global {
  interface Window {
    gsap: typeof gsap;
    ScrollTrigger: typeof gsap.ScrollTrigger;
  }
}
