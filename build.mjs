import dts from 'bun-plugin-dts';

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  minify: false,
  target: 'node',
  external: [
    '@babel/core',
    '@babel/plugin-syntax-flow',
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-syntax-typescript',
    '@stylexjs/shared',
    '@stylexjs/babel-plugin',
    'babel-plugin-syntax-hermes-parser',
  ],
  plugins: [dts({})],
});
