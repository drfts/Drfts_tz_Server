var fs = require('fs');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var express = require('express');
var port = 4000;

var app = express();

app.use(bodyParser());
app.use(express.static('expressServer'));
app.use(express.json());

var dbConnection = mysql.createConnection({
  host: '0.0.0.0',
  user: 'Drfts',
  password: 'drfts1234',
  database: 'drfts_tz'
});

app.get('/index/comment', function(request, response) {
  var sql = "SELECT * FROM DrftsTeaser";
  dbConnection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("/index/comment 페이지에서 comment 테이블 select 완료");
    for (var i in result) {
      console.log("하....제발..");
      console.log(JSON.stringify(result[i]));
    }
    response.send(result);
  });
});

app.get('/index', function (request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.get('/backIndex', function (request, response) {
  response.send(data);
})

//서버에서 app.post()는 클라이언트 단에서 post로 보낸 값을 처리해주기 위함이다.
app.post('/index', function (request, response) {
  var comment = request.param('comment');// request.body.comment;request객체를 사용해서, 보낸 comment를 받는다.
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();

  if (month < 10) {
    month = "0" + month;
  } else {
    month = month;
  }
  date = year.toString() + month.toString() + day.toString();

  var sql = "INSERT INTO DrftsTeaser(comment, day) VALUES(?, ?);";
  dbConnection.query(sql, [comment, date], function (err, result) {
    if (err) {//20180518이 날짜 형식임
      console.log(err);
      return;
    }

    //userId값은 테이블 총 rows를 뽑아서 하면 되는데, 일단 지금은 필요치 않으니 안뽑을꺼야.
    var responseData = { 'result': 'ok', 'comment': request.body.comment, 'day': date };
    console.log("comment 테이블 insert 완료");
    console.log(responseData);
    response.json(responseData);
  });
});

app.listen(port, function () {
  console.log("서버에 접속되었습니댜.");
});