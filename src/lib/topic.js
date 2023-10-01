// main.js 정리하기
var template = require('./template.js');
var db = require('./db');
var url = require('url');
var qs = require('querystring');

exports.home = function(request, response){
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
}

exports.page = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error2;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
           console.log(topic);
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>
            ${description}
            <p> by ${topic[0].name}</p>
            `,
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
exports.create = function(request, response){
db.query(`SELECT * FROM topic`, function(error, topics){
    db.query(`SELECT * FROM author`, function(error2, authors){
      console.log(authors);

      // template.js에 옮겨서 사용
      /*
      var tag = '';
      var i = 0;
      while(i < authors.length){
        tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
        i++;
      }
      */

      var title = 'Create';
      var list = template.list(topics);
      var html = template.HTML(title, list,
      ` 
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          ${template.authorSelect(authors)}
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
  });
}

exports.create_process = function(request, response){
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
      [post.title, post.description, post.author],
      function(error, result){
        if(error){
          throw error;
        }
        response.writeHead(302, {Location: `/?id=${result.insertId}`}); // 파일 생성 후 리다이렉션
        response.end();
      }
    )
  });
}

exports.update = function(request, response){
db.query(`SELECT * FROM topic`, function(error, topics){
    //fs.readdir('./data', function(error, filelist){
    if(error){
      throw error;
    }  
    db.query(`SELECT * FROM topic WHERE id=${queryData.id}`, function(error2, topic){  
      if(error2){
        throw error2;
      }
        db.query(`SELECT * FROM author`, function(error2, authors){
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
                ${template.authorSelect(authors, topic[0].author_id)}
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
        //fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          //var title = queryData.id;
      });
    });
}

exports.update_process = function(request, response){
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
}

exports.delete_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        //var id = post.id;
        //var filteredId = path.parse(id).base;
        db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/`});
          response.end();
        });
        /*
        fs.unlink(`data/${filteredId}`, function(error){ // 파일이 삭제됨.
          response.writeHead(302, {Location: `/`});
          response.end();
        })
        */
    });
}