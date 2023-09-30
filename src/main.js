var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js'); // template.js의 모듈을 이용함.
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql'); // mysql 모듈을 가져옴
var db = mysql.createConnection({ // mysql 연결
  host:'127.0.0.1',
  user:'root',
  password:'288604',
  database:'opentutorials',
  port:'3306',
});
db.connect();

// template이라는 객체를 만듦.
/*var template = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}
*/

// 중복된 코드들을 function을 사용해서 정리해줌.
/*
function templateHTML(title, list, body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}
*/
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
         /* fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
           
          var list = templateList(filelist);
          var template = templateHTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(template);
          */

          // 이전에 있던 위의 코드는 이름을 통해서 사용했는 데 template객체를 사용함.
          /*
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        }); */
        db.query(`SELECT * FROM topic`, function(error, topics){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } else { // 상세보기
        /*
        fs.readdir('./data', function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
        */
        db.query(`SELECT * FROM topic`, function(error, topics){
          if(error){
            throw error2;
          }
          db.query(`SELECT * FROM topic WHERE id=${queryData.id}`, function(error2, topic){
            if(error2){
              throw error2;
            }
             console.log(topic[0].title);
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              ` <a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>`
            );
            response.writeHead(200);
            response.end(html);
          })
        });
      }
    } else if(pathname === '/create'){
      db.query(`SELECT * FROM topic`, function(error, topics){
        var title = 'Create';
        var list = template.list(topics);
        var html = template.HTML(title, list,
        ` <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
  } else if(pathname === '/create_process'){
    var body ='';
    request.on('data', function(data){
        body = body + data; // 콜백(data)가 실행될 때마다 data를 넣어줌.
    });
    request.on('end', function(){ // 더 이상 들어올 data가 없으면 end의 콜백이 실행됨.
      var post = qs.parse(body);
      // data 디렉토리에 html에서 입력받은 정보로 파일을 생성함. (신기하다)
      /*
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.writeHead(302, {Location: `/?id=${title}`}); // 파일 생성 후 리다이렉션
        response.end();
      })
      */

      db.query(`
        INSERT INTO topic (title, description, created, author_id) 
        VALUES(?, ?, NOW(), ?)`,
        [post.title, post.description, 1],
        function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/?id=${result.insertId}`}); // 파일 생성 후 리다이렉션
          response.end();
        }
      )
    });
  } else if(pathname === '/update'){
    db.query(`SELECT * FROM topic`, function(error, topics){
    //fs.readdir('./data', function(error, filelist){
    if(error){
      throw error;
    }  
    db.query(`SELECT * FROM topic WHERE id=${queryData.id}`, function(error2, topic){  
      if(error2){
        throw error2;
      }
      //fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        //var title = queryData.id;
        var list = template.list(topics);
        var html = template.HTML(topic[0].title, list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
            <p>
              <textarea name="description" placeholder="description">${topic[0].description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if(pathname === '/update_process'){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          /*
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
          */
          
          db.query(`UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?`, [post.title, post.description, post.id], function(error, result){
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
          })
      });
  } else if(pathname === '/delete_process'){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(error){ // 파일이 삭제됨.
          response.writeHead(302, {Location: `/`});
          response.end();
        })
    });
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);