import svelte from 'rollup-plugin-svelte';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

export default [
  {
    input: 'src/*',
    output: [
      // {
      //   file: pkg.main,
      //   format: 'cjs', // commonJS
      //   sourcemap: true,
      //   exports: 'named'
      // },
      // {
      //   file: pkg.module,
      //   format: 'esm', // ES Modules
      //   sourcemap: true,
      // },
      {
        file: pkg.main,
        format: 'cjs', // commonJS
        sourcemap: true,
        exports: 'named'
      },
      {
        file: pkg.module,
        format: 'esm', // ES Modules
        sourcemap: true,
      },
    ],
    plugins: [
      svelte({
        include: 'src/**/*',
      }),
      peerDepsExternal(),
      resolve({
        browser: true,
      }),
      commonjs({
        exclude: 'node_modules',
        ignoreGlobal: true,
      }),
      typescript({
        typescript: require('typescript'),
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          exclude: ['**/*.stories.*'],
        },
      }),
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
  // {
  //   input: 'src/Router.svelte',
  //   output: [
  //     {
  //       file: pkg.main,
  //       format: 'cjs', // commonJS
  //       sourcemap: true,
  //       exports: 'named'
  //     },
  //     {
  //       file: pkg.module,
  //       format: 'esm', // ES Modules
  //       sourcemap: true,
  //     },
  //   ],
  //   plugins: [
  //     svelte({
  //       include: 'src/**/*',
  //     }),
  //     peerDepsExternal(),
  //     resolve({
  //       browser: true,
  //     }),
  //     commonjs({
  //       exclude: 'node_modules',
  //       ignoreGlobal: true,
  //     }),
  //     typescript({
  //       typescript: require('typescript'),
  //       useTsconfigDeclarationDir: true,
  //       tsconfigOverride: {
  //         exclude: ['**/*.stories.*'],
  //       },
  //     }),
  //   ],
  //   external: [
  //     ...Object.keys(pkg.dependencies || {}),
  //     ...Object.keys(pkg.peerDependencies || {}),
  //   ],
  // }
];