/*
 * @author N.Gárate
 * created 12.04.2017
 * update 27.04.2018
 */
'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const app = express();

const textParser = bodyParser.urlencoded({extended: false});

let send = [];


/* Excel con los datos de las autonomias, provincias y municipio de españa */
const autBook = XLSX.readFile('aut.xlsx').Sheets['uno'];
const proBook = XLSX.readFile('pro.xlsx').Sheets['uno'];
const munBook = XLSX.readFile('mun.xlsx').Sheets['uno'];

const jsonAut = XLSX.utils.sheet_to_json(autBook, {header: 1});
const jsonPro = XLSX.utils.sheet_to_json(proBook, {header: 1});
const jsonMun = XLSX.utils.sheet_to_json(munBook, {header: 1});

const port = 3000;
app.listen(port);

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('Listening at ' + add + ':' + port);
});

/* Web server de los archivos estaticos */
app.use('/img', express.static(path.join(__dirname, '/public/img')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));
app.use('/css', express.static(path.join(__dirname, '/public/css')));

app.get('/', function (req, res) {
    res.header("Access-Control-Allow-Headers", "Content-Type, application/x-www-form-encoded");
    const options =
        {
            root: __dirname + '/public/',
            dotfiles: 'deny',
            headers:
                {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
        };

    res.sendFile('home.html', options);
});

app.get(/^(.+)$/, function (req, res) {
    console.log('static file request : ' + req.params);
    res.sendFile(__dirname + req.params[0]);
});

/* respuestas a las peticiones post en / */
app.post('/search', textParser, function (req, res) {
    console.log('POST request received');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type, application/x-www-form-encoded");

    const type = req.body.type;
    const data = req.body.data;

    console.log(req.body);

    switch (type) {
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

app.post('/final', textParser, function (req, res) {
    console.log(req.body);
    res.send(JSON.stringify("Gracias"));
});

function aut() {
    send = [];
    for (let i in jsonAut) {
        const arr = jsonAut[i];
        i++;
        send.push(arr[1]);
    }
}

function pro(data) {
    send = [];
    let cod;
    for (let i in jsonAut) {
        const arr = jsonAut[i];
        i++;
        if (arr[1] === data) {
            cod = arr[0];
        }
    }

    for (let i in jsonPro) {
        const arr = jsonPro[i];
        i++;

        if (arr[0] === cod) {
            send.push(arr[2]);
        }
    }
}

function mun(data) {
    send = [];
    let cod;
    for (let i in jsonPro) {
        const arr = jsonPro[i];
        i++;
        if (arr[2] === data) {
            cod = arr[1];
        }
    }

    for (let i in jsonMun) {
        const arr = jsonMun[i];
        i++;

        if (arr[0] === cod) {
            send.push(arr[1]);
        }
    }
}
