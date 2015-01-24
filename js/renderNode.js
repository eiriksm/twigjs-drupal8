'use strict';
var m = require('moment');

module.exports = function(twiggedNode, baseUrl) {
  return function(node) {
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
    node.date = m(parseInt(node.created[0].value, 10) * 1000).format('ddd, MM/DD/YYYY - HH:mm');
    return twiggedNode.render(node);
  };
};
