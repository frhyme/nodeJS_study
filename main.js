`
NOT IMPLEMENTED
- using DOM for efficient code
- read post from DB
- extract templte html for removing duplicate code
- ADD delete
- add chart.js with DB
`

var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

var template = require('./lib/template.js');

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
            <a href="/update?id=${title}">update</a>
            <a href="/delete?id=${title}">delete</a>
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
            <textarea name="description" placeholder="description"></textarea>
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
        'This Update but queryData.id is undefined'
      );
    } else {
      fs.readFile(`./data/${queryData.id}`, 'utf-8', function(err, description){
        var title = queryData.id;

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
            <form action="/update_process" method="POST">
              <input type="hidden" name="id" value="${title}"></input>
              <p>
                <input type="text" name="title" placeholder="title", value="${title}">
              </p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
          </body>
          </html>
          `
        );
      });
    }

  } else if (pathname === '/delete') {
    if (queryData.id === undefined) {
      response.writeHead(302, {Location: `/index.html`})
      response.end();
    } else {
      fs.unlink(`data/${queryData.id}`, function(err){
        response.writeHead(302, {Location: `/`});
        response.end();
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
  } else if (pathname === '/update_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        request.connection.destroy();
      }
    });

    request.on('end', function () {
      console.log('= Update Data Transmision Completed');
      var post = qs.parse(body);

      var id = post.id;
      var new_id = post.title;
      var title = post.title;
      var description = post.description;

      fs.rename(`data/${id}`, `data/${new_id}`, function(err) {
        fs.writeFile(`data/${new_id}`, description, 'utf8', function(err) {
          console.log(`to ${new_id}`);
          response.writeHead(302, {Location: `/?id=${new_id}`});
          response.end();
        })
      });
    });
  } else {
    response.writeHead(404);
    response.end('Not Found at all');
  }


})

// 2022.04.11 - sng_hn.lee
// pm2 start main.js --watch
app.listen(3000);
