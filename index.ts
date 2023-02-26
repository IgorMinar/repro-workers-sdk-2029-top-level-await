// needed to polyfill:
// - `performance.now` https://github.com/cloudflare/workerd/issues/390
// - `setTimeout(fn, 0)` https://github.com/cloudflare/workerd/issues/389
import "./workerd-polyfills";

import * as esbuild from "esbuild-wasm";
import esbuildWasm from "./node_modules/esbuild-wasm/esbuild.wasm";

await esbuild.initialize({
  wasmModule: esbuildWasm,
  worker: false,
});

export default {
  async fetch() {
    const transformResult = await esbuild.transform(
      '"hello world"'
    );

    return new Response(transformResult.code, {
      headers: { "Content-Type": "application/javascript" },
    });
  },
};
