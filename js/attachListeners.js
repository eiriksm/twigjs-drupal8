'use strict';

module.exports = function attachListeners(list, single) {
  document.querySelector('#logo').onclick = list;
  document.querySelector('#site-name').querySelector('a').onclick = list;
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
