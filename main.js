/* 
 * @author N.Gárate
 * created 12.04.2017
 */

'use strict';
var express = require( 'express' );
var XLSX = require('xlsx');
var app = express();

var workbook = XLSX.readFile('17codmun.xlsx');

var worksheet = workbook.Sheets['DIC17'];
    
var json = XLSX.utils.sheet_to_json(worksheet, {header : 1});


var aut = false; //true para autonomia y false para provincia
var cod = '07';

var send = [ ];

function num(cod, aut) 
{
    for(var i in json) 
    {
        var arr = json[i];
        i++;
        
        if( aut && arr[0] === cod )
        {
            send.push(arr[2]);
        }
        else if( !aut && arr[1] === cod )
        {
            send.push(arr[2]);
        }
        else 
        {
            continue;
        }
    }
};

num(cod, aut);

send = JSON.stringify(send);

console.log(send);


var port = 3000;
app.listen(port);
console.log('Listening at http://localhost:' + port);