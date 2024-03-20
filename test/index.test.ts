import path from "node:path";
import { describe, it, expect } from "bun:test";
import createStylexPlugin from "../src";

async function build() {
  const [stylexPlugin, generateCSS] = createStylexPlugin();

  const output = await Bun.build({
    entrypoints: [path.resolve(__dirname, "fixtures/index.ts")],
    external: ["@stylexjs/stylex"],
    minify: false,
    plugins: [stylexPlugin],
  });
  const css = await generateCSS();

  return { output, css };
}

describe("bun-plugin-stylex", () => {
  it("base", async () => {
    const { output, css } = await build();

    expect(output).toMatchSnapshot();
    expect(css).toMatchSnapshot();
  });
});
