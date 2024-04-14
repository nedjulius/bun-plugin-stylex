import path from 'node:path';
import { describe, it, expect } from 'bun:test';
import createStylexPlugin from '../dist';

async function build(options: object = {}) {
  const [stylexPlugin, generateCSS] = createStylexPlugin({
    dev: false,
    useCSSLayers: true,
    ...options,
  });

  const res = await Bun.build({
    entrypoints: [path.resolve(__dirname, '__fixtures__/index.ts')],
    external: ['@stylexjs/stylex'],
    minify: false,
    plugins: [stylexPlugin],
  });
  const css = await generateCSS();

  return { output: res.outputs[0] && (await res.outputs[0].text()), css };
}

describe('bun-plugin-stylex', () => {
  it('should generate css and transpile code', async () => {
    const { output, css } = await build();

    expect(output).toMatchSnapshot();
    expect(css).toMatchSnapshot();
  });

  it('should not generate css for dev mode', async () => {
    const { output, css } = await build({ dev: true });

    expect(output).toMatchSnapshot();
    expect(css).toBeUndefined();
  });
});
