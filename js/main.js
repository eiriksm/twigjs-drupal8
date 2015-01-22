/*global Drupal, domready */
'use strict';
var baseUrl = window.location.protocol + '//' + window.location.hostname + window.location.port + Drupal.url('');
var Twig = require('twig/twig');
var twig = Twig.twig;
require('twigjs-passthrough')(Twig);
require('twigjs-without')(Twig);
require('twigjs-trans')(Twig);

var getNodes = require('./getNodes');

// Templates should ideally be fetched when needed, but this is POC, right?
var fs = require('fs');
var nodeTemplate = fs.readFileSync(__dirname + '/../templates/node.html.twig');
var twiggedNode = twig({
  data: nodeTemplate.toString()
});
var renderNode = require('./renderNode')(twiggedNode);
var attachListeners = require('./attachListeners');
var getNodeAndReturn, getNodesAndReturn;

function getNode(nid, skipHistory) {
  getNodes(nid, function gotNode(err, node) {
    if (err) {
      throw new Error(err);
    }
    node.page = true;
    var output = renderNode(node);
    document.getElementById('content-area').innerHTML = output;
    var title = node.title[0].value;
    var url = baseUrl + 'node/' + nid;
    if (!skipHistory) {
      window.history.pushState({url: url, node: true, nid: nid}, title, url);
    }
    attachListeners(getNodesAndReturn, getNodeAndReturn);
  });
}

getNodesAndReturn = function(e, skipHistory) {
  // Get nodes with 0 parameter equals list.
  getNodes(null, function gotNodes(err, nodes) {
    if (err) {
      console.error(err);
      return;
    }
    var output = [];
    for (var i = 0, len = nodes.length; i < len; i++) {
      output.push(renderNode(nodes[i]));
    }
    document.getElementById('content-area').innerHTML = output.join('');
    var title = 'Front page';
    var url = baseUrl + 'node';
    if (!skipHistory) {
      window.history.pushState({url: url, list: true}, title, url);
    }
    attachListeners(getNodesAndReturn, getNodeAndReturn);
  });
  return false;
};

getNodeAndReturn = function() {
  // Hacking together a parameter for requesting the node.
  var url = this.getAttribute('href');
  var nid = url.substr(url.lastIndexOf('/') + 1);
  getNode(nid);
  return false;
};

// Attach all listeners on dom ready.
domready(function() {
  attachListeners(getNodesAndReturn, getNodeAndReturn);
  window.onpopstate = function(e) {
    if (e.state && e.state.node && e.state.nid) {
      getNode(e.state.nid, true);
      return;
    }
    if (e.state && e.state.list) {
      getNodesAndReturn(null, true);
    }
  };
});
