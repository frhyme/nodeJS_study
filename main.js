`
NOT IMPLEMENTED
- using DOM for efficient code
- read post from DB
- extract templte html for removing duplicate code
`

var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

var app = http.createServer(function(request, response) {

  var _url = request.url;

  var pathname = url.parse(_url, true).pathname;
  var queryData = url.parse(_url, true).query;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      // redirect to index
      response.writeHead(302, {Location: `/index.html`})
      response.end();
    } else {
      // queryData.id exists
      var title = queryData.id;

      fs.readFile(`data/${title}`, 'utf-8', function(err, description){
        var body = `<h2>${title}</h2>${description}`

        response.writeHead(200);
        response.end(
          `
          <!doctype html>
          <html>
          <head>
            <title></title>
            <meta charset="utf-8">
          </head>
          <body>
            ${body}
          </body>
          </html>
          `
        )
      })

    }
  } else if (pathname === '/index.html') {
    fs.readdir('./data', function(error, files) {
      var elem_list = '<ul>';

      files.forEach(function(each_file) {
        console.log(each_file);
        elem_list += `<li><a href="/?id=${each_file}">${each_file}</a></li>`
      })
      elem_list += '</ul>';

      response.writeHead(200);
      response.end(
        `
        <!doctype html>
        <html>
        <head>
          <title></title>
          <meta charset="utf-8">
        </head>
        <body>
          <a href="/create">create</a>
          ${elem_list}
        </body>
        </html>
        `
      );
    });
  } else if (pathname === '/create') {
    console.log('This is create');
    response.writeHead(200);
    response.end(
      `
      <!doctype html>
      <html>
      <head>
        <title></title>
        <meta charset="utf-8">
      </head>
      <body>
        <form action="/create_process" method="POST">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description">
            </textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      </body>
      </html>
      `
    );
  } else if (pathname === '/update') {
    if (queryData.id === undefined) {
      response.writeHead(200);
      response.end(
        'Thiis Update but queryData.id is undefined'
      );
    } else {
      fs.readFile(`./data/${queryData.id}`, 'utf-8', function(err, decription){
        var title = queryData.id;

        response.writeHead(200);
        response.end(

        );
      });
    }

  } else if (pathname === '/create_process') {
    var body = '';

    console.log('pathname: /create_process');
    request.on('data', function (data) {
      body = body + data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        request.connection.destroy();
      }
    })

    request.on('end', function () {
      console.log(' Data Transmission Completed');
      // qs의 역할 정리 필요함
      var data_path = 'data/';
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;

      fs.writeFile(data_path + title, description, 'utf8', function(err) {
        // /로 redirect
        response.writeHead(302, {Location: `/`})
        response.end();
      })
    })
  } else {
    response.writeHead(404);
    response.end('Not Found at all');
  }


})

// 2022.04.11 - sng_hn.lee
// pm2 start main.js --watch
app.listen(3000);
