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

const videoJson1 = [{
  'src': 'https://d8c1da9d356baba4ecb40074dc4758c5.egress.mediapackage-vod.us-east-1.amazonaws.com/out/v1/2b08b86bcab54e9abdf685e816721e01/c60e5984a5a849c8828f58163dc8d020/50e4f858475a488a9b650313a8cc118b/index.m3u8',
  'contentproducerId': 1002,
  'publisherId': 1007,
  'videoId': 5010,
  'poster': 'https://d1pwmephoxhygn.cloudfront.net/VideoElephant/6cf22cd5-7529-4be7-80cb-b63f4c9a3fac/assets/Thumbnails/5d9d74f35c82b316cf46b3ba2e38a377.0000001.jpg',
  'sequence': 0,
  'title': 'By Blender Foundation',
}];

const videoJson2 = [
  {
    'contentproducer': 1006,
    'poster': 'https://d1w6a77c28m7kb.cloudfront.net/VideoElephant/8643a095-125d-443f-9392-3b259464ec0b/assets/Thumbnails/0b0db05fda42f994405b61f928eb7088.0000001.jpg',
    'publisherId': 1001,
    'sequence': 0,
    'title': 'Looking At The Raiders Offense So Far',
    'url': 'https://e5cba4e52d6bf5f8702184a62757f919.egress.mediapackage-vod.us-east-1.amazonaws.com/out/v1/6dcb504f92e64742b03719fd0cb98108/49b8085a215e423eaa7eb6b85dbf26cf/a9530afc08b0424cbc71e8465ea0322c/index.m3u8',
    'videoId': 1017
   },
   
   {
    'contentproducer': 1006,
    'poster': 'https://d1w6a77c28m7kb.cloudfront.net/VideoElephant/57c72ac9-a6ab-4636-af18-f25d64d1d039/assets/Thumbnails/536b4a8918a17b6673929674989ad4fa.0000001.jpg',
    'publisherId': 1001,
    'sequence': 1,
    'title': 'Synching Up Bears Passing Game in Week 8',
    'url': 'https://e5cba4e52d6bf5f8702184a62757f919.egress.mediapackage-vod.us-east-1.amazonaws.com/out/v1/93b0c1af3bbf4a00884fc6a121646c51/49b8085a215e423eaa7eb6b85dbf26cf/a9530afc08b0424cbc71e8465ea0322c/index.m3u8',
    'videoId': 1018
   }
];

const videoJson3 = [
  {
    'src': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'contentproducerId': 1002,
    'publisherId': 1007,
    'videoId': 5078,
    'poster': 'https://d1pwmephoxhygn.cloudfront.net/VideoElephant/6cf22cd5-7529-4be7-80cb-b63f4c9a3fac/assets/Thumbnails/5d9d74f35c82b316cf46b3ba2e38a377.0000001.jpg',
    'sequence': 0,
    'title': 'By Blender Foundation',
  },
  {
    'src': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'contentproducerId': 1002,
    'publisherId': 1007,
    'videoId': 5079,
    'poster': 'https://d1pwmephoxhygn.cloudfront.net/VideoElephant/6ae008fc-146e-4908-baf4-ac3eaf65a457/assets/Thumbnails/2338767f5611cfd7780dad4ab9264bbb.0000001.jpg',
    'sequence': 1,
    'title': 'By Blender Foundation',
  },
  {
    'src': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'contentproducerId': 1002,
    'publisherId': 1007,
    'videoId': 5080,
    'poster': 'https://d1pwmephoxhygn.cloudfront.net/VideoElephant/ac064fe9-e5c2-480d-a09f-e53cf9e9c067/assets/Thumbnails/0170c9175e1326322af9f165bbb06e21.0000001.jpg',
    'sequence': 2,
    'title': 'By Blender Foundation',
  },
];

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
  console.log('makecallurl', url);
  console.log('makecallua', encodeURI(ua));
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
    // 'https://09nfgyvbtl.execute-api.us-east-1.amazonaws.com/prod/ads?'
    // QA
    _chanceBidUrl = 'https://9qzlw9n4q2.execute-api.us-east-1.amazonaws.com/qa/ads?' +
      'videoId=' +
      req.videoId +
      '&pubtenant=' +
      req.pubtenant +
      '&prdtenant=' + 
      req.prdtenant +
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
      resolve();
//     if (Math.random() < 0.1) {
//       _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/simid&description_url=https%3A%2F%2Fdevelopers.google.com%2Finteractive-media-ads&tfcd=0&npa=0&sz=640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
//       console.log('10% probability of getting true', 'surveyPreroll', _chanceBidUrl);
//       resolve();
//     } else if (Math.random() < 0.2) {
//       _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinearvpaid2js&correlator=';
//       console.log('20% probability of getting true', 'vpaidlinear', _chanceBidUrl);
//       resolve();
//     } else if (Math.random() < 0.3) {
// //       https://09nfgyvbtl.execute-api.us-east-1.amazonaws.com/prod/ads?
//       _chanceBidUrl = 'https://9qzlw9n4q2.execute-api.us-east-1.amazonaws.com/qa/ads?' +
//       'videoId=' +
//       req.videoId +
//       '&pubtenant=' +
//       req.pubtenant +
//       '&pubIp=' +
//       req.pubIp +
//       '&deviceType=' +
//       req.deviceType +
//       '&referrer=' +
//       req.referrer +
//       '&playlistId=' +
//       req.playlistId +
//       '&ua=' +
//       encodeURI(req.ua);
//       // 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dredirectlinear&correlator=';
//       console.log('30% probability of getting true', 'AWS', _chanceBidUrl);
//       resolve();
//     } else if (Math.round() < 0.4) {
//       _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostoptimizedpodbumper&cmsid=496&vid=short_onecue&correlator=';
//       console.log('40% probability of getting true', 'vpaidnonlinear', _chanceBidUrl);
//       resolve();
//     } else if (Math.random() < 0.5) {
//       _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=';
//       console.log('50% probability of getting true', 'vmap1', _chanceBidUrl);
//       resolve();
//     } else if ((Math.random() < 0.6)) {
//       _chanceBidUrl = 'https://publisherfenwickdemo.s3.amazonaws.com/ads/SkiingCampaign.xml';
//       console.log('60% probability of getting true', 'preroll skiingcampaign', _chanceBidUrl);
//       resolve();
//     } else if ((Math.random() < 0.7)) {
//       _chanceBidUrl = 'https://09nfgyvbtl.execute-api.us-east-1.amazonaws.com/prod/ads?' +
//       'videoId=' +
//       req.videoId +
//       '&pubtenant=' +
//       req.pubtenant +
//       '&pubIp=' +
//       req.pubIp +
//       '&deviceType=' +
//       req.deviceType +
//       '&referrer=' +
//       req.referrer +
//       '&playlistId=' +
//       req.playlistId +
//       '&ua=' +
//       encodeURI(req.ua);
//       console.log('70% probability of getting true', 'AWS', _chanceBidUrl);
//       resolve();
//     } else if (Math.random() < 0.8) {
//       _chanceBidUrl = 'https://secure.adnxs.com/ssptv?id=21641293' + '&referrer=' + req.referrer + '&vwidth=' + 920 + '&vheight=' + 780 + '&ua=' + req.ua;
//       console.log('80% probability of getting true', 'preroll xandr', _chanceBidUrl);
//       resolve();
//     } else if (Math.random() < 0.9) {
//       _chanceBidUrl = 'https://publisherfenwickdemo.s3.amazonaws.com/ads/MidandPost.xml';
//       console.log('90% probability of getting true', 'vmap2', _chanceBidUrl);
//       resolve();
//     }
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
  _chanceBidUrl = '';
  console.log('request received', _chanceBidUrl, req.query);
  chanceBid(req.query).then(() => {
    console.log('then', _chanceBidUrl);
    makeCall(_chanceBidUrl, req.query.ua).then((response) => {
      console.log(response);
      res.type('application/xml');
      res.send(response);
    }).catch((error) => {
      res.send(error);
    });
  });
  // const _newUrl = 'https://09nfgyvbtl.execute-api.us-east-1.amazonaws.com/prod/ads?' +
  // 'videoId=' +
  // req.query.videoId +
  // '&prdtenant=' +
  // req.query.prdtenant +
  // '&pubtenant=' +
  // req.query.pubtenant +
  // '&pubIp=' +
  // req.query.pubIp +
  // '&deviceType=' +
  // req.query.deviceType +
  // '&referrer=' +
  // req.query.referrer +
  // '&playlistId=' +
  // req.query.playlistId +
  // '&ua=' +
  // encodeURI(req.query.ua);

  // makeCall(_newUrl, req.query.ua).then((response) => {
  //   console.log('******start response text********');
  //   console.log(response);
  //   console.log('******end response text********');
  //   res.type('application/xml');
  //   res.send(response);
  // }).catch((error) => {
  //   res.send(error);
  // });
});


app.get('/getvideo', cors({
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
}), function(req, res) {
  console.log(req.query);
  if (Number(req.query.videoId) === 5009) {
    res.json(videoJson1);
  } else res.json({data: 'record not found'});
});

app.get('/getplaylistvideos', cors({
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
}), function(req, res) {
  console.log(req.query);
  if (Number(req.query.playlistId) === 1645514871) {
    res.json(videoJson2);
  } else if (Number(req.query.playlistId) === 45679) {
    res.json(videoJson3);
  } else res.json({data: 'record not found'});
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
