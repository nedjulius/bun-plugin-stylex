# bun-plugin-stylex

## Installation

```
bun add -d bun-plugin-stylex
```

## Usage

Due to the current limitations of `Bun` the consumer must generate and write the `CSS` output manually.

```ts
import path from 'node:path';
import createStylexPlugin from 'bun-plugin-stylex';

const [stylexPlugin, generateCSS] = createStylexPlugin();

await Bun.build({
  entrypoints: [path.resolve(__dirname, './src/index.ts')],
  plugins: [stylexPlugin],
  outdir: 'dist',
});

const generatedCSS = await generateCSS();

if (generatedCSS) {
  await Bun.write(path.resolve(__dirname, 'dist/styles.css'), generatedCSS);
}
```

## Options

#### `stylexImports?: string[]`

#### `babelConfig?: { plugins?: PluginItem[], presets?: PluginItem[] }`

#### `useCSSLayers?: boolean`
