var _ = require('lodash');
var request = require('request');
var toBuffer = require('stream-with-known-length-to-buffer');

var alertError = require('./alert-error');
var fullAssetUrl = require('./full-asset-url');
var getAsset = require('./get-asset');

var video = document.querySelector('video');
var mediaSource;

getWithMediaSource();

function getWithMediaSource() {
  getAsset()
    .then(function(asset) {
      console.log(asset);
      mediaSource = new MediaSource();
      video.src = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener('sourceopen', sourceOpen.bind(null, asset));
    })
    .catch(alertError);
}

function sourceOpen(asset) {
  var assetUrl = fullAssetUrl(asset);
  request.get(assetUrl)
    .on('response', function(response) {
      var length = response.headers['content-length'];
      var sourceBuffer = mediaSource.addSourceBuffer(asset.type);
      sourceBuffer.addEventListener('updateend', onEnd);
      toBuffer(response, length, function(err, buffer) {
        if(err) {
          alert(err.message);
        }
        else {
          sourceBuffer.appendBuffer(buffer);
        }
      });
    });
}

function onEnd() {
  console.log('end');
  mediaSource.endOfStream();
  video.play();
}
