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

const jsons = {
    aut: getJSONFromXLS('aut.xlsx').map(a => a[1]),
    pro: getJSONFromXLS('pro.xlsx'),
    mun: getJSONFromXLS('mun.xlsx')
};

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
            res.json(aut());
            break;
        case "aut":
            res.json(getPro(data));
            break;
        case "pro":
            res.json(mun(data));
            break;
        case "form":
            res.json(data);
            break;
    }
});

app.post('/final', textParser, function (req, res) {
    console.log(req.body);
    res.send(JSON.stringify("incorrect"));
});

const port = 3000;
app.listen(port);

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('Listening at ' + add + ':' + port);
});

function aut() {
    return jsons.aut;
}

function pro(data) {
    const pro = [];
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
            pro.push(arr[2]);
        }
    }
    return pro;
}

function mun(data) {
    const muns = [];

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
            muns.push(arr[1]);
        }
    }
    return muns;
}

function getJSONFromXls(file) {
    const book = XLSX.readFile(file).Sheets['uno'];
    return XLSX.utils.sheet_to_json(autBook, {header: 1});
}
