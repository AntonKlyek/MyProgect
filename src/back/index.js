'use strict';

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const _ = require('lodash');
const qs = require('qs');
const cheerio = require('cheerio');

const {ORIGIN, CONTENT_PORT} = require('../config');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const css = `
<style>
    #myChart {
        display: none
    }

    #calc {
        font-family: sans-serif;
        font-size: 14px;
        color: black;
    }
</style>
`;

app.get('/', function(req, res) {
    axios.get(ORIGIN).then(response => {
        let $ = cheerio.load(response.data);

        const head = $('head').html();
        const center = $('#center_news').html();

        const html = `<html>${head}${css}<body>${center}</body></html>`;

        res.send(html);
    });
});

app.all(/.*/, function(req, res) {
    const {url, method} = req;

    if (_.endsWith(url, '.png')) {
        res.send('');
        return;
    }

    if (_.endsWith(url, '/FusionCharts.js')) {
        res.send('');
        return;
    }

    axios({
        url: ORIGIN + url,
        method,
        data: qs.stringify(req.body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response => {
        if (response.headers['content-type']) {
            res.header('Content-Type', response.headers['content-type']);
        }

        res.send(response.data);
    });
});

app.listen(CONTENT_PORT, function() {
    console.log('Server running at:', CONTENT_PORT);
});
