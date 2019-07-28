const express = require('express');

var app = express();
var router = express.Router();

app.get('/',function(req, res){
    res.send('Hello first route');
});

app.listen(1300, function() {
    console.log('Im listening');
});