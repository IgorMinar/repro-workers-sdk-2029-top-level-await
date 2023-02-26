# Repro for top-level await issues in wrangler, workerd, and esbuild

This repo contains a reproduction of failing esbuild program deployed to workerd.

Related issues:

- https://github.com/cloudflare/workers-sdk/issues/2029
- https://github.com/cloudflare/workers-sdk/issues/2716
- https://github.com/cloudflare/workerd/issues/210
- https://github.com/cloudflare/workerd/issues/389
- https://github.com/cloudflare/workerd/issues/390

Note that `npm-patches/wrangler/esbuild-target.patch` is applied to wrangler via a `postinstall` hook to workaround cloudflare/workers-sdk#2716.

## Repro steps

```
git clone git@github.com:IgorMinar/repro-workers-sdk-2029-top-level-await.git
cd repro-workers-sdk-2029-top-level-await
npm install
npm start
# now press 'b' to make a request via a browser
```

## Expected behavior

The browser displays: `"hello world";`

## Actual behavior

The browser displays: `Error: The script will never generate a response.`

And the following error is displayed in the terminal:

```
workerd/io/worker.c++:2461: info: console warning; description = A hanging Promise was canceled. This happens when the worker runtime is waiting for a Promise from JavaScript to resolve, but has detected that the Promise cannot possibly ever resolve because all code and events related to the Promise's I/O context have already finished.
workerd/io/worker.c++:1674: info: uncaught exception; source = Uncaught (in response); exception = Error: The script will never generate a response.
A hanging Promise was canceled. This happens when the worker runtime is waiting for a Promise from JavaScript to resolve, but has detected that the Promise cannot possibly ever resolve because all code and events related to the Promise's I/O context have already finished.
✘ [ERROR] Uncaught (in response) Error: The script will never generate a response.
```

## Workaround

The issue can be worked around by not using top-level await and instead invoking esbuild initialization from within a request context. See the following diff for a working version of this code:

https://github.com/IgorMinar/repro-workers-sdk-2029-top-level-await/compare/esbuild-broken...esbuild-fixed
