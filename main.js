/*
 * @author N.Gárate
 * created 12.04.2017
 * last updated 01.05.2019
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const app = express();

const autObject = getAutObject();
const proObject = getProObject();

app.use(bodyParser.urlencoded({extended: false}));

/* Serve static files */
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
    res.sendFile(path.join(__dirname, req.params[0]));
});

app.get('/aut', function (req, res) {
    console.log('GET AUT');
    
    res = secureHeaders(res);
    res.json(getAutList());
});

app.get('/pro', function (req, res) {
    console.log('GET PRO');
    const proList = getProList(req.query.aut);

    res = secureHeaders(res);
    res.json(proList);
});

app.get('/mun', function (req, res) {
    console.log('GET MUN');
    const munList = getMunList(req.query.pro);

    res = secureHeaders(res);
    res.json(munList);
});

function secureHeaders(res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type, application/x-www-form-encoded");
    return res;
}

app.post('/final', function (req, res) {
    console.log(req.body);
    res.send("incorrect");
});

const port = 3000;
app.listen(port);

require('dns').lookup(require('os').hostname(), function (err, add) {
    console.log('Listening at ' + add + ':' + port);
});

function getAutList() {
    return Object.keys(autObject);
}

function getProList(data) {
    return autObject[data];
}

function getMunList(data) {
   return proObject[data];
}

function getAutObject() {
    const obj = {};
    const aut = getObjectFromArray(getJSONFromXLS('aut.xlsx'), 0, 1);
    
    for(const [ aIndex,, name ] of getJSONFromXLS('pro.xlsx')) {
        const autName = aut[aIndex];
        if (!obj[autName]) obj[autName] = [];
        obj[autName].push(name);
    }
    return obj;
}

function getProObject() {
    const obj = {};
    const pro = getObjectFromArray(getJSONFromXLS('pro.xlsx'), 1, 2);
    
    for(const [ pIndex, name ] of getJSONFromXLS('mun.xlsx')) {
        const proName = pro[pIndex];
        if (!obj[proName]) obj[proName] = [];
        obj[proName].push(name);
    }
    return obj;
}

function getObjectFromArray(array, keyIndex, valueIndex) {
    const o = {};
    for (const a of array) {
        const key = a[keyIndex];
        const value = a[valueIndex];
        o[key] = value;
    }
    return o;
}

function getJSONFromXLS(file) {
    const book = XLSX.readFile(file).Sheets['uno'];
    return XLSX.utils.sheet_to_json(book, {header: 1});
}