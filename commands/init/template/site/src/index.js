{% if deps.js.indexOf('jquery') !== -1 -%}
import jQuery from 'jquery';

jQuery(function ($) {
  console.log('Ready!');
});
{%- endif %}