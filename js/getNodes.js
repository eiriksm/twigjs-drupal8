/*global Drupal */

function getNodes(nid, callback) {
  'use strict';
  var url = 'node/' + nid;
  if (!nid) {
    // This is the URL defined in the view that comes with the theme.
    url = 'rest-test';
  }
  // Assemble url and append query parameter so the browser will not mistake it
  // for the actual page it already has loaded.
  url = Drupal.url('') + url + '?json';
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var data;
    try {
      data = JSON.parse(this.responseText);
    }
    catch (err) {
      callback(err);
    }
    callback(null, data);
  };

  xhr.open('GET', url);
  xhr.setRequestHeader('Accept', 'application/hal+json');
  xhr.send();
}

module.exports = getNodes;
