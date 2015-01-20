/*global Drupal, domready */
'use strict';
var baseUrl = window.location.protocol + '//' + window.location.hostname + window.location.port + Drupal.url('');
var Twig = require('twig/twig');
var twig = Twig.twig;
var m = require('moment');
require('twigjs-passthrough')(Twig);
require('twigjs-without')(Twig);
require('twigjs-trans')(Twig);

// Templates should ideally be fetched when needed, but this is POC, right?
var fs = require('fs');
var nodeTemplate = fs.readFileSync(__dirname + '/../templates/node.html.twig');
var twiggedNode = twig({
  data: nodeTemplate.toString()
});

function getNodesAndReturn() {
  // Get nodes with 0 parameter equals list.
  getNodes();
  return false;
}

function getNodeAndReturn() {
  // Hacking together a parameter for requesting the node.
  var url = this.getAttribute('href');
  var nid = url.substr(url.lastIndexOf('/') + 1);
  getNodes(nid);
  return false;
}

function attachListeners() {
  document.querySelector('#logo').onclick = getNodesAndReturn;
  document.querySelector('#site-name').querySelector('a').onclick = getNodesAndReturn;
  var titles = document.querySelectorAll('.node__title a');
  if (titles && titles.length) {
    for (var i = 0, len = titles.length; i < len; i++) {
      titles[i].onclick = getNodeAndReturn;
    }
  }
  var readmoreLinks = document.querySelectorAll('.readmore-link');
  if (readmoreLinks && readmoreLinks.length) {
    for (var j = 0, l = readmoreLinks.length; j < l; j++) {
      readmoreLinks[j].querySelector('a').onclick = getNodeAndReturn;
    }
  }
}

function getNodes(nid) {
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
    var nodes = JSON.parse(this.responseText);
    var output = [];
    // Ugly hack to make the single node response look like the others.
    // @todo, split this into seperate functions.
    if (nid) {
      nodes = [
        nodes
      ];
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
      var node = nodes[i];
      node.label = node.title[0].value;
      // Brute force the REST response to include a couple of properties
      // that the node template wants.
      node.display_submitted = true;
      node.url = node._links.self.href;
      node.author_name = 'Anonymous (not verified)';
      node.content = {
        links: 'test',
        field_image: node._links[baseUrl + 'rest/relation/node/article/field_image'] ? '<div class="field field-node--field-image field-name-field-image field-type-image field-label-hidden"><div class="field-items"><div class="field-item"><img src="' + node._links[baseUrl + 'rest/relation/node/article/field_image'][0].href + '"></div></div></div>' : '',
        body: node.body[0].value.split("\n").join("<br>")
      };
      node.content_attributes = '';
      if (nid) {
        node.page = true;
      }
      node.date = m(parseInt(node.created[0].value, 10) * 1000).format('ddd, MM/DD/YYYY - HH:mm');
      output.push(twiggedNode.render(node));
    }
    document.getElementById('content-area').innerHTML = output.join('');
    attachListeners();
    // Push new state.
    var title = nodes[0].title[0].value;
    // Remove appended query parameter.
    var displayUrl = url.replace('?json', '');
    if (!nid) {
      title = 'Front page';
      displayUrl = Drupal.url('') + 'node';
    }
    window.history.pushState({}, title, displayUrl);
  };

  xhr.open('GET', url);
  xhr.setRequestHeader('Accept', 'application/hal+json');
  xhr.send();
}

// Attach all listeners on dom ready.
domready(attachListeners);
