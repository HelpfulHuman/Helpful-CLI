require('dotenv').load({ silent: true });
const path = require('path');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');

const env = {
  API_HOST: process.env.API_HOST,
  NODE_ENV: (process.env.NODE_ENV || 'development')
};

module.exports = {
  moduleName: '{{ projectNamePascal }}',
  sourceMap: (process.env.NODE_ENV !== 'production'),
  entry: '{{ "client" if projectType == "app" else "src" }}/index.js',
  {% if projectType == 'lib' -%}
  targets: [
    { dest: 'dist/{{ projectName }}.cjs.js', format: 'cjs' },
    { dest: 'dist/{{ projectName }}.umd.js', format: 'umd' },
    { dest: 'dist/{{ projectName }}.es.js', format: 'es' },
  ],
  {%- else -%}
  dest: 'public/{{ projectType }}.js',
  format: 'iife',
  {%- endif %}
  plugins: [
    {intro () {
      return `window.process = {env:${JSON.stringify(env)}};`
    }},
    replace({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV)
    }),
    resolve({
      main: true,
      jsnext: true,
    }),
    commonjs({
      include: ['./node_modules/**'],
      namedExports: {
        {% if frontend == 'react' -%}
        'react': ['Component', 'PropTypes', 'Children', 'createElement'],
        'react-dom': ['render'],
        {%- endif %}
      }
    }),
    json(),
    buble({
      objectAssign: 'Object.assign'
    })
  ]
};
