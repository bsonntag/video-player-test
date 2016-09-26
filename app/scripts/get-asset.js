var _ = require('lodash');

var assets = [
  { url: 'test2.mp4', type: 'video/mp4' },
  { url: 'test2.mp4', type: 'video/mp4; codecs="h264, mp3"' },
  { url: 'test.webm', type: 'video/webm' },
  { url: 'test.webm', type: 'video/webm; codecs="vp9, opus"' },
];

function getAsset() {
  return new Promise(function(resolve, reject) {
    var asset = _(assets)
      .filter(isTypeSupported)
      .head();

    if(asset) {
      resolve(asset);
    }
    else {
      reject(new Error('No asset for browser'));
    }
  });
}

function isTypeSupported(asset) {
  if(MediaSource.isTypeSupported(asset.type)) {
    console.log('mime type ' + asset.type + ' poopable');
    return true;
  }
  else {
    console.log('mime type ' + asset.type + ' not poopable');
    return false;
  }
}

module.exports = getAsset;
