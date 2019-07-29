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
    database: 'inventory',
    multipleStatements: true
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



//Get an inventory in JSON format
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


//Delete an inventory in JSON format using Postman
app.delete('/inventory/:id',function(req, res){
    sqlConnection.query('DELETE FROM items WHERE id = ?', [req.params.id], function(err, rs){
        if(!err){
            res.send('Deleted Successfully');
        }
        else{
            console.log(err);
        }
    });
});


//Post an inventory in JSON format using Postman
app.post('/inventory',function(req, res){
    var sql = 'SET @id = ?;SET @name = ?;SET @qty = ?;SET @amount = ?;CALL inventoryAddorUpdate(@id,@name,@qty,@amount);'; 
    sqlConnection.query(sql, [req.body.id, req.body.name, req.body.qty, req.body.amount], function(err, rs){
        if(!err){
            res.send(rs);
        }
        else{
            console.log(err);
        }
    });
});


//Put an inventory in JSON format using Postman
app.put('/inventory',function(req, res){
    var sql = 'SET @id = ?;SET @name = ?;SET @qty = ?;SET @amount = ?;CALL inventoryAddorUpdate(@id,@name,@qty,@amount);'; 
    sqlConnection.query(sql, [req.body.id, req.body.name, req.body.qty, req.body.amount], function(err, rs){
        if(!err){
            res.send('Updated Successfully');
        }
        else{
            console.log(err);
        }
    });
});





//Get data and show to selectData page
app.get('/selectData', function(req, res){
     sqlConnection.query('SELECT*FROM items', function(err, rs){
         res.render('selectData.ejs', {inventory: rs});
     });
});



//Render forms.ejs for adding a data
app.get('/forms', function(req, res){
     res.render('forms.ejs', { inventory : {} });
});

//Post data added from forms.ejs
app.post('/forms', function(req, res){
    sqlConnection.query('INSERT INTO items SET ?', req.body, function(err, rs){
        
            if(!err){
                res.redirect('/selectData');
            }
            else{
                console.log(err);
            }
       
    });
});


//Delete a specific id row
app.get('/delete', function(req, res){
    sqlConnection.query('DELETE FROM items WHERE id = ?', req.query.id, function(err, rs){
        res.redirect('/selectData');
    });
});



//Select a specific id row to be updated
app.get('/update', function(req, res){
    sqlConnection.query('SELECT*FROM items WHERE  id = ?',req.query.id, function(err, rs){
         res.render('forms.ejs', {inventory : rs[0] });
    });
});


//Update and post
app.post('/update', function(req, res){
    sqlConnection.query('UPDATE items SET ? WHERE id = ?', [req.body, req.query.id], function(err, rs){
        res.redirect('/selectData');
    });
});





//listen to port:1300
app.listen(1300,function(){
    console.log('I am listening');
});

module.exports = router;