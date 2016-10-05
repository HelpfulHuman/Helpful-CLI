require('dotenv').load({ silent: true });
const http = require('http');

const server = http
  .createServer(function (req, res) {
    res.send('Hello World');
  })
  .listen(process.env.PORT || 5000, function () {
    console.log('Server is now listening on port', server.address().port);
  });