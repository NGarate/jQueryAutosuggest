/* 
 * @author N.Gárate
 * created 12.04.2017
 */
'use strict';

var express = require( 'express' );
var bodyParser = require('body-parser');
var XLSX = require('xlsx');
var app = express();

var textParser = bodyParser.urlencoded({ extended: false });

var send = [ ];

var autBook = XLSX.readFile('aut.xlsx').Sheets['uno'];
var proBook = XLSX.readFile('pro.xlsx').Sheets['uno'];
var munBook = XLSX.readFile('mun.xlsx').Sheets['uno'];

var jsonAut = XLSX.utils.sheet_to_json(autBook, {header : 1});
var jsonPro = XLSX.utils.sheet_to_json(proBook, {header : 1});
var jsonMun = XLSX.utils.sheet_to_json(munBook, {header : 1});

var port = 3000;
app.listen(port);
console.log('Listening at http://localhost:' + port);

app.post('/', textParser, function(req, res, next) 
{
    console.log( 'POST request from: ' + req.rawHeaders[9] );
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type, application/x-www-form-encoded");
    
    var type = req.body.type;
    var data = req.body.data;
 
    switch(type)
    {
        case "ini":
            aut();
            res.send(JSON.stringify(send));
            break;
        case "aut":
            pro(data);
            res.send(JSON.stringify(send));
            break;
        case "pro":
            mun(data);
            res.send(JSON.stringify(send));
            break;
        case "form":
            res.send(JSON.stringify(data));
            break;
    }
});


function aut()
{
    send = [ ];
    for(var i in jsonAut) 
    {
        var arr = jsonAut[i];
        i++;
        send.push(arr[1]);
    }
}

function pro( data ) 
{
    send = [ ];
    var cod;
    for(var i in jsonAut) 
    {
        var arr = jsonAut[i];
        i++;
        if( arr[1] === data )
        {
            cod = arr[0];
        }
    }
    
    for(var i in jsonPro) 
    {
        var arr = jsonPro[i];
        i++;
        
        if( arr[0] === cod )
        {
            send.push(arr[2]);
        }
    }
};

function mun( data ) 
{
    send = [ ];
    var cod;
    for(var i in jsonPro) 
    {
        var arr = jsonPro[i];
        i++;
        if( arr[2] === data )
        {
            cod = arr[1];
        }
    }
    
    for(var i in jsonMun) 
    {
        var arr = jsonMun[i];
        i++;
        
        if( arr[0] === cod )
        {
            send.push(arr[1]);
        } 
    }
};
