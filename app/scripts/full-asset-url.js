var host = location.host;

function fullAssetUrl(asset) {
  return 'http://' + host + '/videos/' + asset.url;
}

module.exports = fullAssetUrl;
