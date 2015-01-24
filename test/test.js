'use strict';
require('should');

describe('renderNode', function() {
  it('Should expose the expected type', function() {
    var r = require('../js/renderNode');
    r.should.be.instanceOf(Function);
    var mockRender = {
      render: function(n) {
        return {
          node: n
        };
      }
    };
    var created = Date.now() / 1000;
    var node = {
      created: [
        {
          value: created
        }
      ],
      title: [
        {
          value: 'test'
        }
      ],
      _links: {
        self: {
          href: 'testHref'
        }
      },
      body: [
        {
          value: ''
        }
      ]
    };
    var rendered = r(mockRender, '')(node);
    rendered.node.content.body.should.equal('');
    node._links['rest/relation/node/article/field_image'] = [
      {
        href: 'test'
      }
    ];
    var r2 = r(mockRender, '')(node);
    r2.node.content.field_image.indexOf('<img src="test">').should.be.above(0);
  });
});
