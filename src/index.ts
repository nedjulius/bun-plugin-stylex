import type { BunPlugin, OnLoadArgs, OnLoadResult, PluginBuilder } from "bun";
import path from 'node:path';
import { promises } from 'node:fs';
import { transformAsync, type PluginItem } from '@babel/core';
import stylexBabelPlugin from '@stylexjs/babel-plugin';
import flowSyntaxPlugin from '@babel/plugin-syntax-flow';
import hermesParserPlugin from 'babel-plugin-syntax-hermes-parser';
import typescriptSyntaxPlugin from '@babel/plugin-syntax-typescript';
import jsxSyntaxPlugin from '@babel/plugin-syntax-jsx';
import type { Options, Rule } from '@stylexjs/babel-plugin';

const { readFile } = promises;

const PACKAGE_NAME = 'bun-plugin-stylex';

const IS_DEV_ENV =
  process.env.NODE_ENV === 'development' ||
  process.env.BABEL_ENV === 'development';

const STYLEX_PLUGIN_ONLOAD_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

export type PluginOptions = Partial<Options> & {
  stylexImports?: string[],
  babelConfig?: {
    plugins?: PluginItem[],
    presets?: PluginItem[],
  },
  useCSSLayers?: boolean,
};

export default function stylexPlugin({
  dev = IS_DEV_ENV,
  unstable_moduleResolution = { type: 'commonJS', rootDir: process.cwd() },
  stylexImports = ['@stylexjs/stylex'],
  babelConfig: { plugins = [], presets = [] } = {},
  useCSSLayers = false,
  ...options
}: PluginOptions = {}): [BunPlugin, () => Promise<string | undefined>] {
  const stylexRules: { [key: string]: Rule } = {};

  async function generateCSS() {
    const rules: Array<Rule> = Object.values(stylexRules).flat();

    if (rules.length === 0 || dev) {
      return;
    }

    return stylexBabelPlugin.processStylexRules(
      rules,
      useCSSLayers,
    );
  }

  const plugin = {
    name: PACKAGE_NAME,
    async setup(build: PluginBuilder) {
      build.onLoad(
        { filter: STYLEX_PLUGIN_ONLOAD_FILTER },
        async (args: OnLoadArgs): Promise<OnLoadResult> => {
          const currFilePath = args.path;
          const inputCode = await readFile(currFilePath, 'utf8');
          console.log(currFilePath, 'file path')

          if (
            !stylexImports.some((importName) => inputCode.includes(importName))
          ) {
            // avoid transform if file doesn't have stylex imports
            // esbuild proceeds to the next callback
            return;
          }

          const transformResult = await transformAsync(inputCode, {
            babelrc: false,
            filename: currFilePath,
            presets,
            plugins: [
              ...plugins,
              ...getFlowOrTypeScriptBabelSyntaxPlugins(currFilePath),
              jsxSyntaxPlugin,
              stylexBabelPlugin.withOptions({
                treeshakeCompensation: true,
                ...options,
                dev,
                unstable_moduleResolution,
              }),
            ],
          });

          const loader = getLoader(currFilePath);

          if (transformResult === null) {
            console.warn('StyleX: transformAsync returned null');
            return { contents: inputCode, loader };
          }

          const { code, metadata } = transformResult;

          if (code === null) {
            console.warn('StyleX: transformAsync returned null code');
            return { contents: inputCode, loader };
          }

          if (!dev && metadata && (metadata as any).stylex) {
            stylexRules[args.path] = (metadata as any).stylex;
          }

          return {
            contents: code ?? inputCode,
            loader,
          };
        },
      );
    },
  };

  return [plugin, generateCSS];
}

function getLoader(fileName: string) {
  if (fileName.endsWith('.tsx')) {
    return 'tsx';
  }

  if (fileName.endsWith('.jsx')) {
    return 'jsx';
  }

  if (fileName.endsWith('ts')) {
    return 'ts';
  }

  return 'js';
}

function getFlowOrTypeScriptBabelSyntaxPlugins(fileName: string) {
  if (/\.jsx?/.test(path.extname(fileName))) {
    return [flowSyntaxPlugin, hermesParserPlugin];
  }

  return [[typescriptSyntaxPlugin, { isTSX: true }]];
}
