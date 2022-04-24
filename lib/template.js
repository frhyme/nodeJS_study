/*
2022.04.24 - sng_hn.lee - Init
*/

module.exports = {
  template_with_body: function (body) {
    return `
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
  }
}
