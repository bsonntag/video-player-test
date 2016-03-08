var _ = require('lodash');
var request = require('request');
//var toBuffer = require('stream-with-known-length-to-buffer');
var toBlobUrl = require('stream-to-blob-url');

var video = document.querySelector('video');
var assets = [
  { url: 'test2.webm', type: 'video/webm; codecs="vp8, vorbis"' },
  { url: 'test2.mp4', type: 'video/mp4' },
];

getVideo();

function getVideo() {
  var asset = _(assets)
    .filter(isTypeSupported)
    .head();

  if(asset) {
    request.get('http://10.0.17.198:3000/' + asset.url)
      .on('response', function(response) {
        console.log('response');
        var mimeType = response.headers['content-type'];
        var length = response.headers['content-length'];
        toBlobUrl(response, asset.url, function(err, url) {
          if(err) {
            console.log(err);
          }
          else {
            video.src = url;
          }
        });
      });
  }
}

function isTypeSupported(asset) {
  if (MediaSource.isTypeSupported(asset.type)) {
    console.log('mime type ' + asset.type + ' poopable');
    return true;
  }
  else {
    console.log('mime type ' + asset.type + ' not poopable');
    return false;
  }
}

function getWithMediaSource() {
  var mimeCodec = 'video/webm; codecs="vp9, opus"';
  var mediaSource = new MediaSource();

  if (MediaSource.isTypeSupported(mimeCodec)) {
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', sourceOpen);
  }
  else {
    console.error('Unsupported MIME type or codec: ', mimeCodec);
  }
}

function sourceOpen() {
  var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
  fetch(assetURL, addBuffer);

  function addBuffer(buffer) {
    sourceBuffer.addEventListener('updateend', onEnd);
    sourceBuffer.appendBuffer(buffer);
  }
}

function onEnd() {
  console.log('end');
  mediaSource.endOfStream();
  video.play();
}

function fetch(url, cb) {
  var xhr = new XMLHttpRequest;
  xhr.open('get', url);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    cb(xhr.response);
  };
  xhr.send();
};
