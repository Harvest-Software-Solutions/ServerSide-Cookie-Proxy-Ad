    /* eslint-disable no-unused-vars */
    /* eslint-disable prefer-const */
    /* eslint-disable max-len */
    /* eslint-disable require-jsdoc */
    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 3000;
    const request = require('request');
    const cors = require('cors');
    const timeout = require('connect-timeout');
    const NodeCache = require( 'node-cache' );


    const _cachce = new NodeCache({stdTTL: 145, useClones: false, deleteOnExpire: true, checkperiod: 145});

    let _chanceBidUrl = '';

    app.get('/xandrgetUID', timeout(30000), cors({origin: '*'}), function(req, res) {
    console.log('xandrgetUID', req.query);
    let obj = {adnxs_uid: req.query.adnxs_uid, referrer: req.query.referrer, sessionId: req.query.sessionId};
    let success = _cachce.set(req.query.sessionId, obj, 145);
    res.send(req.query);
    });

    app.get('/getAllxandrUIDs', cors({origin: '*'}), function(req, res) {
    let allKeys = _cachce.keys();
    console.log( allKeys );
    res.send(allKeys);
    });

    app.get('/getxandrUID', timeout(30000), cors({origin: '*'}), function(req, res) {
    let value = _cachce.get( req.query.sessionId );
    if ( value == undefined ) {
        // handle miss!
        res.setHeader('Content-Type', 'text/plain');
        res.send({adnxs_uid: 'no value'});
    }
    console.log('getxandrUID', value);
    res.send(value);
    });

    function makeCall(req) {
        //PROD TAG
        //'https://09nfgyvbtl.execute-api.us-east-1.amazonaws.com/prod/ads?' 
       let url = 'https://9qzlw9n4q2.execute-api.us-east-1.amazonaws.com/qa/ads?' +
        'videoId=' +
        req.videoId +
        '&prdtenant=' +
         req.prdtenant +
        '&pubtenant=' +
        req.pubtenant +
        '&pubIp=' +
        req.pubIp +
        '&deviceType=' +
        req.deviceType +
        '&referrer=' +
        req.referrer +
        '&playlistId=' +
        req.playlistId +
        '&ua=' +
        encodeURI(req.ua);
    const options = {
        url: url,
        headers: {
        'User-Agent': encodeURI(req.ua),
        },
    };
    return new Promise((resolve, reject) => {
        console.log('making ad request url is ',url);
        request(options, (err, res, body) => {
        if (err) reject(err);
        resolve(body);
        });
    });
    }

    app.get('/ads', timeout(30000), cors({credentials: true, origin: 'https://imasdk.googleapis.com'}), function(req, res) 
    {
        console.log('received request',req.query);
        makeCall(req.query).then((response) => {
                console.log('received response',response);
            res.type('application/xml');
            res.send(response);
            }).catch((error) => {
            res.send(error);
            });
    });

    app.get('/', function(req, res) {
    res.send('EXPRESS SERVER');
    });

    app.use(function(err, req, res, next) {
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.status(err.status || 500);
    res.send({error: err.message});
    });

    app.use(function(req, res) {
    res.status(404);
    res.send({error: 'Sorry, can\'t find that'});
    });

    app.listen(PORT, () => console.log(`Server listening in port ${PORT}`));
   
