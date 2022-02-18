/* eslint-disable require-jsdoc */
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const request = require('request');
const cors = require('cors');

const videoJson1 = [{
  'src': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
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

app.get('/ssp', cors({credentials: true, origin: 'https://imasdk.googleapis.com'}), function(req, res) {
  makeXandrCall(req.query.url).then((response) => {
    res.type('application/xml');
    res.send(response);
  }).catch((error) => {
    res.send(error);
  });
});

app.get('/xandr', cors({credentials: true, origin: 'https://imasdk.googleapis.com'}), function(req, res) {
  console.log(req.query);
  const url = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostpodbumper&cmsid=496&vid=short_onecue&correlator=';
//         'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpostonly&cmsid=496&vid=short_onecue&correlator='; 
//         'https://secure.adnxs.com/ssptv?id=21641293' + '&referrer=' + req.query.referrer + '&vwidth=' + 920 + '&vheight=' + 780 + '&ua=' + req.query.ua;
  makeXandrCall(url).then((response) => {
    res.type('application/xml');
    res.send(response);
  }).catch((error) => {
    res.send(error);
  });
});


app.get('/getvideo', cors({'origin': '*',
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
