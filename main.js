var http = require('http');
var url = require('url');

var app = http.createServer(function(request, response) {

  var _url = request.url;

  var pathname = url.parse(_url, true).pathname;
  var queryData = url.parse(_url, true).query;

  if (pathname === '/') {
    response.writeHead(200);
    response.end(
      "Hello World again"
    )
  }


})

app.listen(3000);
