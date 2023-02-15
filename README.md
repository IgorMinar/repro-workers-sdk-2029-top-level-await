# Repro for top-level await issues in wrangler and workerd

Related issues:
- https://github.com/cloudflare/workers-sdk/issues/2029
- https://github.com/cloudflare/workerd/issues/210

Note that `npm-patches/wrangler/esbuild-target.patch` is applied to wrangler via a `postinstall` hook to workaround cloudflare/workers-sdk#2029.

## Repro steps
```
git clone git@github.com:IgorMinar/repro-workers-sdk-2029-top-level-await.git
cd repro-workers-sdk-2029-top-level-await
npm install
npm start
```

## Expected behavior
The dev server starts and responds to http requests

## Actual behavior
Throws the following exception:
```
Uncaught Error: Some functionality, such as asynchronous I/O, timeouts,
and generating random values, can only be performed while handling a request.
```