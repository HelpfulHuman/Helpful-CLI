# {{ projectNameClean }}

#### Technologies Used
{% if deps.jsDev.indexOf('rollup') !== -1 -%}
  * Rollup + Buble for compiling ES2015 code down to ES5
{%- endif %}
{% if deps.jsDev.indexOf('stylus') !== -1 -%}
  * Stylus + HelpfulUI for writing clean, modular CSS.
{%- endif %}
{% if deps.js.indexOf('express') !== -1 %}
  * Express for back-end route handling.
{% endif %}

{% if tags.projectType != 'lib' -%}
  ## Set Up

  {% if tags.javascript -%}
    Install dependencies with `npm install`, then launch dev mode with `npm run dev:start`.
  {%- endif %}
{%- endif %}