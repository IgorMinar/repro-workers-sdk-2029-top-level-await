/**
 * workerd polyfill for performance.now API
 * https://github.com/cloudflare/workerd/issues/390
 */
globalThis.performance ||= {};
globalThis.performance.now ||= function now() {
	return Date.now();
};

/**
 * workerd polyfill for setTimeout(fn, 0) API
 * https://github.com/cloudflare/workerd/issues/389
 */
const originalSetTimeout = globalThis.setTimeout;
const originalClearTimeout = globalThis.clearTimeout;

// hack to minimize possibility of possible timer ID collisions
var setTimeoutCounter = Number.MAX_SAFE_INTEGER - 1_000_000;
var pendingTimers = new Set();

globalThis.setTimeout = function setTimeout(callback, delay, ...args) {
	if (delay > 0) {
		return originalSetTimeout(callback, delay, ...args);
	}

	var timerId = setTimeoutCounter++;
	pendingTimers.add(timerId);

	queueMicrotask(() => {
		if (pendingTimers.has(timerId)) {
			pendingTimers.delete(timerId);
			callback();
		}
	});

	return timerId;
};

globalThis.clearTimeout = function clearTimeout(timerId) {
	if (pendingTimers.has(timerId)) {
		pendingTimers.delete(timerId);
	}
	return originalClearTimeout(timerId);
};
