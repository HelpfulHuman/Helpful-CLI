const config = require('./config');
const express = require('express');
const json = require('body-parser').json;
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

/**
 * Create our Express application instance.
 */
const app = express();

/**
 * Set up our standard middleware.
 */
app.use(express.static(path.resolve(__dirname + '/../public')));
app.use(cors(), json(), morgan('combined'));

/**
 * Define your routes here.
 */
{% if tags.frontend -%}
app.use(function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});
{%- endif %}

/**
 * Start up our server
 */
const server = app.listen(config.port, function () {
  console.log('Server is listening on port', server.address().port);
});