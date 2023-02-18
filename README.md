# Repro for top-level await issues in wrangler and workerd

The root cause turned out to be missing support for setTimeout(fn, 0) in workerd:
https://github.com/cloudflare/workerd/issues/389.

Related issues:

- https://github.com/cloudflare/workers-sdk/issues/2029
- https://github.com/cloudflare/workers-sdk/issues/2716
- https://github.com/cloudflare/workerd/issues/210

Note that `npm-patches/wrangler/esbuild-target.patch` is applied to wrangler via a `postinstall` hook to workaround cloudflare/workers-sdk#2716.

## Repro steps

```
git clone git@github.com:IgorMinar/repro-workers-sdk-2029-top-level-await.git
cd repro-workers-sdk-2029-top-level-await
npm install
npm start
```

## Expected behavior

The dev server starts and responds to http requests and console.log looks as follows:

```
1.   scheduling microtasks works just fine
2.   awaiting microtasks works just fine as well
3.   scheduling tasks from a global scope expression...
3a.  works just fine
4.   if I wrap the same task into a promise...
4+.  and schedule it...
4+a.  it works just fine
5.   and only once the promise is awaited...
> executing a scheduled task #1 <
> executing a scheduled task #2 <
5a.  everything still works!
```

## Actual behavior

console.log contains exceptions as follows:

```
1.   scheduling microtasks works just fine
2.   awaiting microtasks works just fine as well
3.   scheduling tasks from a global scope expression...
3b.  throws an exception:
    Error: Some functionality, such as asynchronous I/O, timeouts, and generating random values, can only be performed while handling a request.
    at index.js:8:3
4.   if I wrap the same task into a promise...
4+.  and schedule it...
4+b.  we once again throw an exception but this time it gets trapped in a promise as expected:
    Error: Some functionality, such as asynchronous I/O, timeouts, and generating random values, can only be performed while handling a request.
    at index.js:19:5
    at new Promise (<anonymous>)
    at index.js:16:16
5.   and only once the promise is awaited...
5b.  the exception is propagated:
    Error: Some functionality, such as asynchronous I/O, timeouts, and generating random values, can only be performed while handling a request.
    at index.js:19:5
    at new Promise (<anonymous>)
    at index.js:16:16
```
