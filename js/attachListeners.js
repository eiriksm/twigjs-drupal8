'use strict';

module.exports = function attachListeners(list, single) {
  var listLinks = document.querySelectorAll('#logo a')
  if (listLinks && listLinks.length) {
    for (var a = 0, length = listLinks.length; a < length; a++) {
      listLinks[a].onclick = list;
    }
  }
  var titles = document.querySelectorAll('.node__title a');
  if (titles && titles.length) {
    for (var i = 0, len = titles.length; i < len; i++) {
      titles[i].onclick = single;
    }
  }
  var readmoreLinks = document.querySelectorAll('.readmore-link');
  if (readmoreLinks && readmoreLinks.length) {
    for (var j = 0, l = readmoreLinks.length; j < l; j++) {
      readmoreLinks[j].querySelector('a').onclick = single;
    }
  }
};
