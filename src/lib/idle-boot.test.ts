import { describe, expect, it, vi } from 'vitest';
import { isDeferredChromeAllowed, scheduleIdle, type IdleHost } from './idle-boot';

function timeoutHost(): IdleHost & { cancelled: number[] } {
  const cancelled: number[] = [];
  return {
    cancelled,
    setTimeout: (handler, timeout) => {
      void timeout;
      handler();
      return 11;
    },
    clearTimeout: (id) => {
      cancelled.push(id);
    },
  };
}

describe('scheduleIdle', () => {
  it('uses requestIdleCallback when the host exposes it', () => {
    const cancel = vi.fn();
    const ric = vi.fn((cb: () => void) => {
      cb();
      return 7;
    });
    const task = vi.fn();

    const stop = scheduleIdle(task, {
      requestIdleCallback: ric,
      cancelIdleCallback: cancel,
      setTimeout: () => 0,
      clearTimeout: () => undefined,
    });

    expect(ric).toHaveBeenCalledOnce();
    expect(task).toHaveBeenCalledOnce();
    stop();
    expect(cancel).toHaveBeenCalledWith(7);
  });

  it('falls back to a short timeout and can cancel it', () => {
    const host = timeoutHost();
    const task = vi.fn();
    /* replace setTimeout so the task does not run until we say so */
    let queued: (() => void) | undefined;
    host.setTimeout = (handler) => {
      queued = handler;
      return 11;
    };

    const stop = scheduleIdle(task, host);
    expect(task).not.toHaveBeenCalled();
    expect(queued).toBeTypeOf('function');
    stop();
    expect(host.cancelled).toEqual([11]);
    expect(task).not.toHaveBeenCalled();
  });

  it('blocks deferred chrome on prerender crawlers', () => {
    expect(isDeferredChromeAllowed({ webdriver: true })).toBe(false);
    expect(isDeferredChromeAllowed({ webdriver: false })).toBe(true);
    expect(isDeferredChromeAllowed({})).toBe(true);
  });

  it('runs the timeout fallback when idle callback is missing', () => {
    const host = timeoutHost();
    const task = vi.fn();
    scheduleIdle(task, host);
    expect(task).toHaveBeenCalledOnce();
  });
});
