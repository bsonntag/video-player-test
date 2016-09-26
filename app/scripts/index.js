var _ = require('lodash');
var request = require('request');
var toBlobUrl = require('stream-to-blob-url');

var alertError = require('./alert-error');
var fullAssetUrl = require('./full-asset-url');
var getAsset = require('./get-asset');

var video = document.querySelector('video');

getVideo();

function getVideo() {
  getAsset()
    .then(fullAssetUrl)
    .then(downloadAsset)
    .catch(alertError);
}

function downloadAsset(assetUrl) {
  request.get(assetUrl)
    .on('response', setVideoSrc.bind(null, assetUrl));
}

function setVideoSrc(assetUrl, response) {
  if(response.statusCode === 200) {
    var mimeType = response.headers['content-type'];
    var length = response.headers['content-length'];
    toBlobUrl(response, assetUrl, function(err, url) {
      if(err) {
        console.log(err);
      }
      else {
        video.src = url;
      }
    });
  }
}
