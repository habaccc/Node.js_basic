// 저자 목록 보기 기능 구현
var template = require('./template.js');
var db = require('./db');
var qs = require('querystring');
var url = require('url');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        db.query(`SELECT * FROM author`, function(error2, authors){
            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
            `
            ${template.authorTable(authors)}
            <style>
                table{
                    border-collapse:collapse;
                }
                td{
                    border:1px solid black;
                }
            </style>
            <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit" value="create">
                </p>
            </form>
            `,
            ``       
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = function(request, response){
    var body ='';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){ 
      var post = qs.parse(body);
      db.query(`
        INSERT INTO author (name, profile) 
        VALUES(?, ?)`,
        [post.name, post.profile],
        function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/author`}); 
          response.end();
        }
      )
    });
  }

  exports.update = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        db.query(`SELECT * FROM author`, function(error2, authors){
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(error3, author){
                var title = 'author';
                var list = template.list(topics);
                var html = template.HTML(title, list,
                `
                ${template.authorTable(authors)}
                <style>
                    table{
                        border-collapse:collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                <form action="/author/update_process" method="post">
                    <p>
                        <input type="hidden" name="id" value="${queryData.id}">
                    </p>    
                    <p>
                        <input type="text" name="name" value="${sanitizeHtml(author[0].name)}" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="description">${sanitizeHtml(author[0].profile)}</textarea>
                    </p>
                    <p>
                        <input type="submit" value="update">
                    </p>
                </form>
                `,
                ``       
                );
                response.writeHead(200);
                response.end(html);
            });

        });
    });
}

exports.update_process = function(request, response){
    var body ='';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){ 
      var post = qs.parse(body);
      db.query(`
        UPDATE author SET name=?, profile=? WHERE id=?`, 
        [post.name, post.profile, post.id],
        function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/author`}); 
          response.end();
        }
      )
    });
  }

  exports.delete_process = function(request, response){
    var body ='';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){ 
      var post = qs.parse(body);
      db.query(
        `DELETE FROM topic WHERE author_id=?`,
        [post.id],
        function(error1, result1){
          if(error1){
            throw error1;
          } // 삭제 같이 민감한 작업은 throw를 통해서 다음 작업이 이뤄지지 않게 해야함. 작업에 실패했을 때 이전으로 돌릴 수 있음.
              db.query(
                `DELETE FROM author WHERE id=?`,
                [post.id],
                function(error2, result2){
                  if(error2){
                    throw error2;
                  }
                  response.writeHead(302, {Location: `/author`}); 
                  response.end();
            }
          )
        }
      );
      
    });
  }