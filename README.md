> :warning: **IN DEVELOPMENT:** You may encounter some issues when using this plugin for production builds

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

const [stylexPlugin, generateCSS] = createStylexPlugin({
  // plugin options
  dev: false,
});

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

[See an example app that uses `bun-plugin-stylex` and React](https://github.com/nedjulius/bun-plugin-stylex-example)

## Options

#### `stylexImports?: string[]`

#### `babelConfig?: { plugins?: PluginItem[], presets?: PluginItem[] }`

#### `useCSSLayers?: boolean`
