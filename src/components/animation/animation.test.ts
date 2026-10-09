import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './animation.js';
import { TpAnimation } from './animation.js';

class IntersectionObserverMock {
  public observe = vi.fn();
  public disconnect = vi.fn();

  public constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {}
}

describe('<tp-animation>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function createAnimation(): TpAnimation {
    document.body.innerHTML = `
      <tp-animation in="fadeIn" out="fadeOut">
        <div class="content">Hello</div>
      </tp-animation>
    `;

    const element = document.querySelector('tp-animation');

    if (!(element instanceof TpAnimation)) {
      throw new Error('Expected <tp-animation> instance.');
    }

    return element;
  }

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-animation');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpAnimation);
  });

  it('injects CSS once', () => {
    const first = createAnimation();
    const second = document.createElement('tp-animation');
    second.innerHTML = '<div>World</div>';
    document.body.append(second);

    expect(document.head.querySelectorAll('#tp-animation-styles')).toHaveLength(1);
    expect(first).toBeInstanceOf(TpAnimation);
  });

  it('uses load as default trigger', () => {
    const element = createAnimation();

    expect(element.trigger).toBe('load');
  });

  it('reflects in/out properties', () => {
    const element = createAnimation();

    element.in = 'zoomIn';
    element.out = 'zoomOut';

    expect(element.getAttribute('in')).toBe('zoomIn');
    expect(element.getAttribute('out')).toBe('zoomOut');
  });

  it('reflects target property', () => {
    const element = createAnimation();

    element.target = '.content';

    expect(element.getAttribute('target')).toBe('.content');
    expect(element.target).toBe('.content');
  });

  it('reflects once property', () => {
    const element = createAnimation();

    expect(element.once).toBe(false);

    element.once = true;
    expect(element.hasAttribute('once')).toBe(true);

    element.once = false;
    expect(element.hasAttribute('once')).toBe(false);
  });

  it('reflects rootMargin and threshold properties', () => {
    const element = createAnimation();

    element.rootMargin = '0px 0px -10% 0px';
    element.threshold = '0.25,0.5';

    expect(element.getAttribute('root-margin')).toBe('0px 0px -10% 0px');
    expect(element.rootMargin).toBe('0px 0px -10% 0px');
    expect(element.getAttribute('threshold')).toBe('0.25,0.5');
    expect(element.threshold).toBe('0.25,0.5');
  });

  it('marks first child as target by default', () => {
    const element = createAnimation();
    const target = element.querySelector('.content');

    expect(target?.hasAttribute('data-tp-animation-target')).toBe(true);
  });

  it('uses explicit target selector when provided', () => {
    document.body.innerHTML = `
      <tp-animation in="fadeIn" target=".target">
        <div class="other">Other</div>
        <div class="target">Target</div>
      </tp-animation>
    `;

    const element = document.querySelector('tp-animation');

    if (!(element instanceof TpAnimation)) {
      throw new Error('Expected <tp-animation> instance.');
    }

    const target = element.querySelector('.target');
    const other = element.querySelector('.other');

    expect(target?.hasAttribute('data-tp-animation-target')).toBe(true);
    expect(other?.hasAttribute('data-tp-animation-target')).toBe(false);
  });

  it('binds click trigger', () => {
    const element = createAnimation();
    element.trigger = 'click';

    const playSpy = vi.spyOn(element, 'playIn').mockResolvedValue();
    const target = element.querySelector('.content');

    target?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it('makes a non-native click target keyboard accessible', () => {
    const element = createAnimation();
    element.trigger = 'click';

    const playSpy = vi.spyOn(element, 'playIn').mockResolvedValue();
    const target = element.querySelector('.content') as HTMLElement;

    expect(target.getAttribute('role')).toBe('button');
    expect(target.tabIndex).toBe(0);

    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    target.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    expect(playSpy).toHaveBeenCalledTimes(2);
  });

  it('preserves native button semantics for a click target', () => {
    document.body.innerHTML = `
      <tp-animation in="fadeIn" trigger="click">
        <button type="button">Animate</button>
      </tp-animation>
    `;
    const target = document.querySelector('button');

    expect(target?.hasAttribute('role')).toBe(false);
    expect(target?.hasAttribute('tabindex')).toBe(false);
  });

  it('restores synthesized semantics when the trigger changes', () => {
    const element = createAnimation();
    element.trigger = 'click';
    const target = element.querySelector('.content') as HTMLElement;

    element.trigger = 'manual';

    expect(target.hasAttribute('role')).toBe(false);
    expect(target.hasAttribute('tabindex')).toBe(false);
  });

  it('binds hover trigger', () => {
    const element = createAnimation();
    element.trigger = 'hover';

    const playSpy = vi.spyOn(element, 'playIn').mockResolvedValue();
    const target = element.querySelector('.content');

    target?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it('mirrors hover activation on focus', () => {
    const element = createAnimation();
    element.trigger = 'hover';

    const playSpy = vi.spyOn(element, 'playIn').mockResolvedValue();
    const target = element.querySelector('.content');

    expect((target as HTMLElement | null)?.tabIndex).toBe(0);
    target?.dispatchEvent(new FocusEvent('focus'));

    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it('blocks repeated auto trigger when once is present', () => {
    const element = createAnimation();
    element.trigger = 'click';
    element.once = true;

    const playSpy = vi.spyOn(element, 'playIn').mockResolvedValue();
    const target = element.querySelector('.content');

    target?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    target?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it('supports intersection trigger', () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

    const element = createAnimation();
    element.trigger = 'intersection';

    expect(element.trigger).toBe('intersection');
  });

  it('binds intersection observer when trigger is intersection', () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

    const element = createAnimation();
    element.trigger = 'intersection';

    const observer =
      (
        element as unknown as {
          intersectionObserver: IntersectionObserverMock | null;
        }
      ).intersectionObserver;

    expect(observer).not.toBeNull();
    expect(observer?.observe).toHaveBeenCalledTimes(1);
  });

  it('passes rootMargin and threshold to IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

    const element = createAnimation();
    element.rootMargin = '0px 0px -10% 0px';
    element.threshold = '0.25,0.5';
    element.trigger = 'intersection';

    const observer =
      (
        element as unknown as {
          intersectionObserver: IntersectionObserverMock | null;
        }
      ).intersectionObserver;

    expect(observer?.options).toEqual({
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: [0.25, 0.5],
    });
  });

  it('plays in when intersection becomes visible', () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

    const element = createAnimation();
    const playSpy = vi.spyOn(element, 'playIn').mockResolvedValue();

    element.trigger = 'intersection';

    const observer =
      (
        element as unknown as {
          intersectionObserver: IntersectionObserverMock | null;
        }
      ).intersectionObserver;

    if (observer === null) {
      throw new Error('Expected intersection observer.');
    }

    observer.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      observer as unknown as IntersectionObserver,
    );

    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it('does not play in when intersection is not visible', () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

    const element = createAnimation();
    const playSpy = vi.spyOn(element, 'playIn').mockResolvedValue();

    element.trigger = 'intersection';

    const observer =
      (
        element as unknown as {
          intersectionObserver: IntersectionObserverMock | null;
        }
      ).intersectionObserver;

    if (observer === null) {
      throw new Error('Expected intersection observer.');
    }

    observer.callback(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      observer as unknown as IntersectionObserver,
    );

    expect(playSpy).not.toHaveBeenCalled();
  });

  it('plays only once in intersection mode when once is present', () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

    const element = createAnimation();
    element.once = true;

    const playSpy = vi.spyOn(element, 'playIn').mockResolvedValue();

    element.trigger = 'intersection';

    const observer =
      (
        element as unknown as {
          intersectionObserver: IntersectionObserverMock | null;
        }
      ).intersectionObserver;

    if (observer === null) {
      throw new Error('Expected intersection observer.');
    }

    observer.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      observer as unknown as IntersectionObserver,
    );

    observer.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      observer as unknown as IntersectionObserver,
    );

    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it('disconnects intersection observer when once is present and animation has played', () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

    const element = createAnimation();
    element.once = true;

    element.trigger = 'intersection';

    const observer =
      (
        element as unknown as {
          intersectionObserver: IntersectionObserverMock | null;
        }
      ).intersectionObserver;

    if (observer === null) {
      throw new Error('Expected intersection observer.');
    }

    observer.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      observer as unknown as IntersectionObserver,
    );

    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });

  it('play() delegates to playIn()', async () => {
    const element = createAnimation();
    const spy = vi.spyOn(element, 'playIn').mockResolvedValue();

    await element.play();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('restart() delegates to playIn()', async () => {
    const element = createAnimation();
    const spy = vi.spyOn(element, 'playIn').mockResolvedValue();

    await element.restart();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('turns requested reduced motion into an immediate state change', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    const element = createAnimation();
    element.duration = '2s';
    element.delay = '1s';
    element.iterations = 'infinite';
    const target = element.querySelector('.content') as HTMLElement;
    const animation = {
      cancel: vi.fn(),
      finished: Promise.resolve(),
      pause: vi.fn(),
    } as unknown as Animation;
    const animate = vi.fn().mockReturnValue(animation);
    Object.defineProperty(target, 'animate', { value: animate });
    vi.spyOn(
      element as unknown as {
        extractKeyframesFromCssAnimationName: (target: HTMLElement) => Keyframe[];
      },
      'extractKeyframesFromCssAnimationName',
    ).mockReturnValue([{ opacity: 0 }, { opacity: 1 }]);

    await element.playIn();

    expect(animate).toHaveBeenCalledWith(expect.any(Array), expect.objectContaining({
      delay: 0,
      duration: 0,
      iterations: 1,
    }));
  });

  it('paused reflects boolean attribute', () => {
    const element = createAnimation();

    element.paused = true;
    expect(element.hasAttribute('paused')).toBe(true);

    element.paused = false;
    expect(element.hasAttribute('paused')).toBe(false);
  });

  it('cancel emits tp-animation-cancel when animation exists', () => {
    const element = createAnimation();
    const cancelSpy = vi.fn();

    element.addEventListener('tp-animation-cancel', cancelSpy);

    const fakeAnimation = {
      cancel: vi.fn(),
    } as unknown as Animation;

    (
      element as unknown as {
        animation: Animation | null;
      }
    ).animation = fakeAnimation;

    element.cancel();

    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });

  it('extracts CSS keyframes and restores temporary inline styles', async () => {
    const element = createAnimation();
    const target = element.querySelector('.content') as HTMLElement;
    target.style.animation = 'original 1s';
    target.style.transition = 'opacity 1s';
    target.style.animationDelay = '25ms';
    target.style.animationPlayState = 'running';
    const computedStyle = vi.spyOn(window, 'getComputedStyle').mockImplementation(
      () => ({ animationName: 'fadeIn', filter: 'none', opacity: '0.5', transform: 'none' }) as CSSStyleDeclaration,
    );
    const animation = { cancel: vi.fn(), finished: Promise.resolve(), pause: vi.fn() } as unknown as Animation;
    const animate = vi.fn().mockReturnValue(animation);
    Object.defineProperty(target, 'animate', { configurable: true, value: animate });

    await element.playIn();

    expect(computedStyle).toHaveBeenCalledTimes(6);
    expect(animate.mock.calls[0]?.[0]).toHaveLength(5);
    expect(target.style.animation).toBe('original 1s');
    expect(target.style.transition).toBe('opacity 1s');
    expect(target.style.animationDelay).toBe('25ms');
    expect(target.style.animationPlayState).toBe('running');
  });

  it('parses supported timing and iteration values with safe fallbacks', () => {
    const internals = createAnimation() as unknown as {
      parseIterations: (value: string) => number;
      parseTimeToMs: (value: string) => number;
    };
    expect(internals.parseTimeToMs('250ms')).toBe(250);
    expect(internals.parseTimeToMs('1.5s')).toBe(1500);
    expect(internals.parseTimeToMs('invalid')).toBe(1000);
    expect(internals.parseIterations('infinite')).toBe(Number.POSITIVE_INFINITY);
    expect(internals.parseIterations('3')).toBe(3);
    expect(internals.parseIterations('0')).toBe(1);
    expect(internals.parseIterations('invalid')).toBe(1);
  });
});
