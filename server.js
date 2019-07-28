const express = require('express');
const mysql = require('mysql');

var app = express();
var router = express.Router();

//first route
app.get('/',function(req, res){
    res.send('Hello first route');
});

//Creating connection to mysql
var sqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'blank',
    database: 'inventory'
});

//Connecting to mysql
sqlConnection.connect((err)=>{
      if(!err){
        console.log('Success!');
      }
      else{
          console.log('Failed error: '+JSON.stringify(err,undefined,2));
      }
});

//Return inventory in JSON format
app.get('/inventory',function(req, res){
    sqlConnection.query('SELECT*FROM items', function(err, rs){
        if(!err){
            res.send(rs);
        }
        else{
            console.log(err);
        }
    });
});

//Get data and show to selectData page
app.get('/selectData', function(req, res, next){
     sqlConnection.query('SELECT*FROM items', function(err, rs){
         res.render('selectData.ejs', {fruits: rs});
     });
});



//listen to port:1300
app.listen(1300,function(){
    console.log('Iam listening');
});

module.exports = router;