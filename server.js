/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const request = require('request');
const cors = require('cors');
let _chanceBidUrl = '';

const videoJson1 = [{
  'src': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'contentproducerId': 1002,
  'publisherId': 1007,
  'videoId': 5009,
  'poster': 'https://d1pwmephoxhygn.cloudfront.net/VideoElephant/6cf22cd5-7529-4be7-80cb-b63f4c9a3fac/assets/Thumbnails/5d9d74f35c82b316cf46b3ba2e38a377.0000001.jpg',
  'title': 'By Blender Foundation',
}];

const videoJson2 = [
  {
    'src': 'https://d8c1da9d356baba4ecb40074dc4758c5.egress.mediapackage-vod.us-east-1.amazonaws.com/out/v1/2b08b86bcab54e9abdf685e816721e01/c60e5984a5a849c8828f58163dc8d020/50e4f858475a488a9b650313a8cc118b/index.m3u8',
    'contentproducerId': 1002,
    'publisherId': 1007,
    'videoId': 5010,
    'poster': 'https://d1pwmephoxhygn.cloudfront.net/VideoElephant/6cf22cd5-7529-4be7-80cb-b63f4c9a3fac/assets/Thumbnails/5d9d74f35c82b316cf46b3ba2e38a377.0000001.jpg',
    'sequence': 0,
    'title': 'By Blender Foundation',
  },
  {
    'src': 'https://d8c1da9d356baba4ecb40074dc4758c5.egress.mediapackage-vod.us-east-1.amazonaws.com/out/v1/ab7533ed21a2476abadb3afa93955314/c60e5984a5a849c8828f58163dc8d020/50e4f858475a488a9b650313a8cc118b/index.m3u8',
    'contentproducerId': 1002,
    'publisherId': 1007,
    'videoId': 5011,
    'poster': 'https://d1pwmephoxhygn.cloudfront.net/VideoElephant/6ae008fc-146e-4908-baf4-ac3eaf65a457/assets/Thumbnails/2338767f5611cfd7780dad4ab9264bbb.0000001.jpg',
    'sequence': 1,
    'title': 'By Blender Foundation',
  },
  {
    'src': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'contentproducerId': 1002,
    'publisherId': 1007,
    'videoId': 5012,
    'poster': 'https://d1pwmephoxhygn.cloudfront.net/VideoElephant/ac064fe9-e5c2-480d-a09f-e53cf9e9c067/assets/Thumbnails/0170c9175e1326322af9f165bbb06e21.0000001.jpg',
    'sequence': 2,
    'title': 'By Blender Foundation',
  },
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

app.get('/xandrgetUID', function(req, res) {
  console.log(req.query);
  res.send(req.query);
});

function makeXandrCall(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) reject(err);
      resolve(body);
    });
  });
}

function chanceBid() {
  console.log('chancebid');
  return new Promise((resolve, reject) => {
    if (Math.random() < 0.1) {
      _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/simid&description_url=https%3A%2F%2Fdevelopers.google.com%2Finteractive-media-ads&tfcd=0&npa=0&sz=640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
      console.log('10% probability of getting true', 'surveyPreroll', _chanceBidUrl);
      resolve();
    } else if (Math.random() < 0.2) {
      _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinearvpaid2js&correlator=';
      console.log('20% probability of getting true', 'vpaidlinear', _chanceBidUrl);
      resolve();
    } else if (Math.round() < 0.3) {
      _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostoptimizedpodbumper&cmsid=496&vid=short_onecue&correlator=';
      console.log('30% probability of getting true', 'vpaidnonlinear', _chanceBidUrl);
      resolve();
    } else if (Math.random() < 0.4) {
      _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dredirectlinear&correlator=';
      console.log('40% probability of getting true', 'redirect', _chanceBidUrl);
    } else if (Math.random() < 0.5) {
      _chanceBidUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=';
      console.log('50% probability of getting true', 'vmap1', _chanceBidUrl);
      resolve();
    } else if (Math.random() < 0.8) {
      _chanceBidUrl = 'https://secure.adnxs.com/ssptv?id=21641293' + '&referrer=' + req.referrer + '&vwidth=' + 920 + '&vheight=' + 780 + '&ua=' + req.ua;
      console.log('80% probability of getting true', 'preroll xandr', _chanceBidUrl);
      resolve();
    } else if (Math.random() < 0.9) {
      _chanceBidUrl = 'https://publisherfenwickdemo.s3.amazonaws.com/ads/MidandPost.xml';
      console.log('90% probability of getting true', 'vmap2', _chanceBidUrl);
      resolve();
    }
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

app.get('/ads', cors({credentials: true, origin: 'https://imasdk.googleapis.com'}), function(req, res) {
  _chanceBidUrl = '';
  console.log('request received', _chanceBidUrl);
  chanceBid().then(() => {
    console.log('then', _chanceBidUrl);
    makeXandrCall(_chanceBidUrl).then((response) => {
      res.type('application/xml');
      res.send(response);
    }).catch((error) => {
      res.send(error);
    });
  });
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
  if (Number(req.query.playlistId) === 45678) {
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
