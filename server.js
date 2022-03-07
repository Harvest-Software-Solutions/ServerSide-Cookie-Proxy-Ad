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

    function makeCall(url, ua) {
    const options = {
        url: url,
        headers: {
        'User-Agent': encodeURI(ua),
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
        if (err) reject(err);
        resolve(body);
        });
    });
    }

    function chanceBid(req) {
    console.log('chancebid');
    return new Promise((resolve, reject) => {
            let cachebuster = Math.round(new Date().getTime() / 1000);
            _chanceBidUrl = 'https://vid.springserve.com/vast/274751?w=640&h=360&cb=' + cachebuster + '&url=' + req.referrer + '&us_privacy=1--';
resolve();
            //         // 'https://09nfgyvbtl.execute-api.us-east-1.amazonaws.com/prod/ads?'
//         if (Math.random() < 0.1) {
//         _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/simid&description_url=https%3A%2F%2Fdevelopers.google.com%2Finteractive-media-ads&tfcd=0&npa=0&sz=640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
//         console.log('10% probability of getting true', 'surveyPreroll');
//         resolve();
//         } else if (Math.random() < 0.2) {
//         _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinearvpaid2js&correlator=';
//         console.log('20% probability of getting true', 'vpaidlinear');
//         resolve();
//         } else if (Math.random() < 0.3) {
//         _chanceBidUrl = 'https://9qzlw9n4q2.execute-api.us-east-1.amazonaws.com/qa/ads?' +
//         'videoId=' +
//         req.videoId +
//         '&pubtenant=' +
//         req.pubtenant +
//         '&pubIp=' +
//         req.pubIp +
//         '&deviceType=' +
//         req.deviceType +
//         '&referrer=' +
//         req.referrer +
//         '&playlistId=' +
//         req.playlistId +
//         '&ua=' +
//         encodeURI(req.ua);
//         console.log('30% probability of getting true', 'CMC');
//         resolve();
//         } else if (Math.round() < 0.4) {
//         _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostoptimizedpodbumper&cmsid=496&vid=short_onecue&correlator=';
//         console.log('40% probability of getting true', 'vpaidnonlinear');
//         resolve();
//         } else if (Math.random() < 0.5) {
//         _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=';
//         console.log('50% probability of getting true', 'vmap1');
//         resolve();
//         } else if ((Math.random() < 0.6)) {
//         _chanceBidUrl = 'https://secure.adnxs.com/ssptv?id=21641293' + '&referrer=' + req.referrer + '&vwidth=' + 920 + '&vheight=' + 780 + '&ua=' + req.ua;;
//         console.log('60% probability of getting true', 'XANDR');
//         resolve();
//         } else if ((Math.random() < 0.7)) {
//         _chanceBidUrl = 'https://secure.adnxs.com/ssptv?id=21641293' + '&referrer=' + req.referrer + '&vwidth=' + 920 + '&vheight=' + 780 + '&ua=' + req.ua;
//         encodeURI(req.ua);
//         console.log('70% probability of getting true', 'XANDR');
//         resolve();
//         } else if (Math.random() < 0.8) {
//         _chanceBidUrl = 'https://9qzlw9n4q2.execute-api.us-east-1.amazonaws.com/qa/ads?' +
//         'videoId=' +
//         req.videoId +
//         '&pubtenant=' +
//         req.pubtenant +
//         '&pubIp=' +
//         req.pubIp +
//         '&deviceType=' +
//         req.deviceType +
//         '&referrer=' +
//         req.referrer +
//         '&playlistId=' +
//         req.playlistId +
//         '&ua=' +
//         encodeURI(req.ua);
//         console.log('80% probability of getting true', 'CMC');
//         resolve();
//         } else if (Math.random() < 0.9) {
//         _chanceBidUrl = 'https://secure.adnxs.com/ssptv?id=21641293' + '&referrer=' + req.referrer + '&vwidth=' + 920 + '&vheight=' + 780 + '&ua=' + req.ua;
// //             'https://publisherfenwickdemo.s3.amazonaws.com/ads/MidandPost.xml';
//         console.log('90% probability of getting true', 'XANDR');
//         resolve();
//         }
    });
    }

    app.get('/ssp', cors({credentials: true, origin: 'https://imasdk.googleapis.com'}), function(req, res) {
    makeXandrCall(req.query.url).then((response) => {
        res.type('application/xml');
        res.send(response);
    }).catch((error) => {
        res.send(error);
    });
    });

    app.get('/ads', timeout(30000), cors({credentials: true, origin: 'https://imasdk.googleapis.com'}), function(req, res) {
    chanceBid(req.query).then(() => {
        makeCall(_chanceBidUrl, req.query.ua).then((response) => {
        console.log('URL',_chanceBidUrl);
            console.log(response);
        res.type('application/xml');
        res.send(response);
        }).catch((error) => {
        res.send(error);
        });
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
