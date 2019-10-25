var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'weather'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});

exports.getCity =  function (req, res) {
  var fs = require('fs');
  var obj = JSON.parse(fs.readFileSync('./city.list.json', 'utf8'));
  res.send({
    "status":200,
    "cities":obj
  })
}
exports.getWeather =  function (req, res) {
  const http = require('http');
  var cityId = req.query.id;
  var apiKey = '950a5a058bb4d2ded34f3f411996aeb2';
  console.log(cityId);

//   http.get('http://api.openweathermap.org/data/2.5/forecast?id=' + cityId + '&APPID=' + apiKey, (resp) => {
//     let data = '';

//   // A chunk of data has been recieved.
//   resp.on('data', (chunk) => {
//     data += chunk;
//   });

//   // The whole response has been received. Print out the result.
//   resp.on('end', () => {
//     console.log(JSON.parse(data).explanation);
//   });
// })
var url = 'http://api.openweathermap.org/data/2.5/forecast?id=' + cityId + '&APPID=' + apiKey;
var request = require('request');
request(url, function (error, response, body) {
    // if (!error && response.statusCode == 200) {
        // console.log(response) // Print the google web page.
    //  }
    res.send({
      "status":200,
      "temp":body
    })
})
}
exports.login = function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        "status":400,
        "failed":"error ocurred"
      })
    }else{
      // console.log('The solution is: ', results);
      if(results.length >0){
        if(results[0].password == password){
          res.send({
            "status":200,
            "success":"login sucessfull"
              });
        }
        else{
          res.send({
            "status":204,
            "success":"Email and password does not match"
              });
        }
      }
      else{
        res.send({
          "status":204,
          "success":"Email does not exits"
            });
      }
    }
    });
  }