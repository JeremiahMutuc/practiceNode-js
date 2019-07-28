const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');


var app = express();
var router = express.Router();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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



//Return all inventory in JSON format
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



//Return an inventory in JSON format
app.get('/inventory/:id',function(req, res){
    sqlConnection.query('SELECT*FROM items WHERE id = ?', [req.params.id], function(err, rs){
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
         res.render('selectData.ejs', {inventory: rs});
     });
});



//Render forms.ejs for adding a data
app.get('/forms', function(req, res, next){
     res.render('forms.ejs');
});

//Post data added from forms.ejs
app.post('/forms', function(req, res, next){
    sqlConnection.query('INSERT INTO items SET ?', req.body, function(err, rs){
        
            if(!err){
                res.send('All data successfully added... <a href="http://localhost:1300/selectData">see inventory here...</a>');
            }
            else{
                console.log(err);
            }
       
    });
});


//Delete a specific id row
app.get('/delete', function(req, res, next){
    sqlConnection.query('DELETE FROM items WHERE id = ?', req.query.id, function(err, rs){
        res.redirect('/selectData');
    });
});



//listen to port:1300
app.listen(1300,function(){
    console.log('I am listening');
});

module.exports = router;