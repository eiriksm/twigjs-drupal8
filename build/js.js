(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
/*global Drupal */

var cache = {};

function getNodes(nid, callback) {
  'use strict';
  var url = 'node/' + nid;
  if (!nid) {
    // This is the URL defined in the view that comes with the theme.
    url = 'rest-test';
  }
  // Assemble url and append query parameter so the browser will not mistake it
  // for the actual page it already has loaded.
  url = Drupal.url('') + url + '?_format=hal_json';
  // Cheat with speed and use cache.
  if (cache[url]) {
    callback(null, cache[url]);
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var data;
    try {
      data = JSON.parse(this.responseText);
    }
    catch (err) {
      callback(err);
      return;
    }
    // Remember this.
    cache[url] = data;
    callback(null, data);
  };

  xhr.open('GET', url);
  xhr.setRequestHeader('Accept', 'application/hal+json');
  xhr.send();
}

module.exports = getNodes;

},{}],3:[function(require,module,exports){
(function (Buffer){
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

var nodeTemplate = Buffer("eyMKLyoqCiAqIEBmaWxlCiAqLwojfQo8YXJ0aWNsZXt7IGF0dHJpYnV0ZXMuYWRkQ2xhc3MoY2xhc3NlcykgfX0+CgogIDxoZWFkZXI+CiAgICB7eyB0aXRsZV9wcmVmaXggfX0KICAgIHslIGlmIG5vdCBwYWdlICV9CiAgICAgIDxoMiBjbGFzcz0ibm9kZV9fdGl0bGUiPgogICAgICAgIDxhIGhyZWY9Int7IHVybCB9fSIgcmVsPSJib29rbWFyayI+e3sgbGFiZWwgfX08L2E+CiAgICAgIDwvaDI+CiAgICB7JSBlbHNlICV9CiAgICAgIDxoMiBjbGFzcz0ibm9kZV9fdGl0bGUiPgogICAgICAgIHt7IGxhYmVsIH19CiAgICAgIDwvaDI+CiAgICB7JSBlbmRpZiAlfQogICAge3sgdGl0bGVfc3VmZml4IH19CgogICAgeyUgaWYgZGlzcGxheV9zdWJtaXR0ZWQgJX0KICAgICAgPGRpdiBjbGFzcz0ibm9kZV9fbWV0YSI+CiAgICAgICAge3sgYXV0aG9yX3BpY3R1cmUgfX0KICAgICAgICA8c3Bhbnt7IGF1dGhvcl9hdHRyaWJ1dGVzIH19PgogICAgICAgICAgeyUgdHJhbnMgJX1TdWJtaXR0ZWQgYnkge3sgYXV0aG9yX25hbWUgfX0gb24ge3sgZGF0ZSB9fXslIGVuZHRyYW5zICV9CiAgICAgICAgPC9zcGFuPgogICAgICAgIHt7IG1ldGFkYXRhIH19CiAgICAgIDwvZGl2PgogICAgeyUgZW5kaWYgJX0KICA8L2hlYWRlcj4KCiAgeyUgaWYgcGFnZSAlfQogIDxkaXYgY2xhc3M9Im5vZGVfX2NvbnRlbnQgY2xlYXJmaXgiIHt7IGNvbnRlbnRfYXR0cmlidXRlcy5hZGRDbGFzcygnbm9kZV9fY29udGVudCcsICdjbGVhcmZpeCcpIH19PgogICAge3sgY29udGVudHx3aXRob3V0KCdjb21tZW50JywgJ2xpbmtzJykgfX0KICA8L2Rpdj4KICB7JSBlbmRpZiAlfQoKICB7JSBpZiBub3QgcGFnZSAlfQogIDxkaXYgY2xhc3M9InJlYWRtb3JlLWxpbmsiPgogICAgPGEgaHJlZj0ie3sgdXJsIH19IiByZWw9ImJvb2ttYXJrIj57JSB0cmFucyAlfVJlYWQgbW9yZXslIGVuZHRyYW5zICV9PC9hPgogIDwvZGl2PgogIHslIGVuZGlmICV9CgogIHt7IGNvbnRlbnQuY29tbWVudCB9fQoKPC9hcnRpY2xlPgo=","base64");
var twiggedNode = twig({
  data: nodeTemplate.toString()
});
var renderNode = require('./renderNode')(twiggedNode, baseUrl);
var attachListeners = require('./attachListeners');
var getNodeAndReturn, getNodesAndReturn;

var state;

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
      state = {url: url, node: true, nid: nid};
      window.history.pushState(state, title, url);
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
      state = {url: url, list: true};
      window.history.pushState(state, title, url);
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
      return;
    }
    // Fallback is to just reuse a global state object.
    if (state && state.node && state.nid) {
      getNode(state.nid, true);
      return;
    }
    if (state && state.list) {
      getNodesAndReturn(null, true);
    }
  };
});

}).call(this,require("buffer").Buffer)

},{"./attachListeners":1,"./getNodes":2,"./renderNode":4,"buffer":6,"twig/twig":13,"twigjs-passthrough":14,"twigjs-trans":15,"twigjs-without":16}],4:[function(require,module,exports){
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

},{"moment":12}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  this.length = 0
  this.parent = undefined

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":7,"ieee754":8,"is-array":9}],7:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],8:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],9:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],10:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":11}],11:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],12:[function(require,module,exports){
//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function isFunction (sth) {
        // https://github.com/moment/moment/issues/2325
        return typeof sth === 'function' &&
            Object.prototype.toString.call(sth) === '[object Function]';
    }


    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    config._f = isoDates[i][0];
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    // match[6] should be 'T' or space
                    config._f += (match[6] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear, janX = createUTCDate(year, 0, 1 + week1Jan), d = janX.getUTCDay(), dayOfYear;
        if (d < firstDayOfWeek) {
            d += 7;
        }

        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (typeof this._isDSTShifted !== 'undefined') {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        this._weekdaysParse = this._weekdaysParse || [];

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toObject     = toObject;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.6';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],13:[function(require,module,exports){
/**
 * Twig.js 0.8.2
 *
 * @copyright 2011-2015 John Roepke and the Twig.js Contributors
 * @license   Available under the BSD 2-Clause License
 * @link      https://github.com/justjohn/twig.js
 */

var Twig = (function (Twig) {

    Twig.VERSION = "0.8.2";

    return Twig;
})(Twig || {});
//     Twig.js
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

var Twig = (function (Twig) {
    "use strict";
    // ## twig.core.js
    //
    // This file handles template level tokenizing, compiling and parsing.

    Twig.trace = false;
    Twig.debug = false;

    // Default caching to true for the improved performance it offers
    Twig.cache = true;

    Twig.placeholders = {
        parent: "{{|PARENT|}}"
    };

    /**
     * Fallback for Array.indexOf for IE8 et al
     */
    Twig.indexOf = function (arr, searchElement /*, fromIndex */ ) {
        if (Array.prototype.hasOwnProperty("indexOf")) {
            return arr.indexOf(searchElement);
        }
        if (arr === void 0 || arr === null) {
            throw new TypeError();
        }
        var t = Object(arr);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            // console.log("indexOf not found1 ", JSON.stringify(searchElement), JSON.stringify(arr));
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        if (arr == searchElement) {
            return 0;
        }
        // console.log("indexOf not found2 ", JSON.stringify(searchElement), JSON.stringify(arr));

        return -1;
    }

    Twig.forEach = function (arr, callback, thisArg) {
        if (Array.prototype.forEach ) {
            return arr.forEach(callback, thisArg);
        }

        var T, k;

        if ( arr == null ) {
          throw new TypeError( " this is null or not defined" );
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(arr);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ( {}.toString.call(callback) != "[object Function]" ) {
          throw new TypeError( callback + " is not a function" );
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if ( thisArg ) {
          T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while( k < len ) {

          var kValue;

          // a. Let Pk be ToString(k).
          //   This is implicit for LHS operands of the in operator
          // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
          //   This step can be combined with c
          // c. If kPresent is true, then
          if ( k in O ) {

            // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
            kValue = O[ k ];

            // ii. Call the Call internal method of callback with T as the this value and
            // argument list containing kValue, k, and O.
            callback.call( T, kValue, k, O );
          }
          // d. Increase k by 1.
          k++;
        }
        // 8. return undefined
    };

    Twig.merge = function(target, source, onlyChanged) {
        Twig.forEach(Object.keys(source), function (key) {
            if (onlyChanged && !(key in target)) {
                return;
            }

            target[key] = source[key]
        });

        return target;
    };

    /**
     * Exception thrown by twig.js.
     */
    Twig.Error = function(message) {
       this.message = message;
       this.name = "TwigException";
       this.type = "TwigException";
    };

    /**
     * Get the string representation of a Twig error.
     */
    Twig.Error.prototype.toString = function() {
        var output = this.name + ": " + this.message;

        return output;
    };

    /**
     * Wrapper for logging to the console.
     */
    Twig.log = {
        trace: function() {if (Twig.trace && console) {console.log(Array.prototype.slice.call(arguments));}},
        debug: function() {if (Twig.debug && console) {console.log(Array.prototype.slice.call(arguments));}}
    };

    if (typeof console !== "undefined") {
        if (typeof console.error !== "undefined") {
            Twig.log.error = function() {
                console.error.apply(console, arguments);
            }
        } else if (typeof console.log !== "undefined") {
            Twig.log.error = function() {
                console.log.apply(console, arguments);
            }
        }
    } else {
        Twig.log.error = function(){};
    }

    /**
     * Wrapper for child context objects in Twig.
     *
     * @param {Object} context Values to initialize the context with.
     */
    Twig.ChildContext = function(context) {
        var ChildContext = function ChildContext() {};
        ChildContext.prototype = context;
        return new ChildContext();
    };

    /**
     * Container for methods related to handling high level template tokens
     *      (for example: {{ expression }}, {% logic %}, {# comment #}, raw data)
     */
    Twig.token = {};

    /**
     * Token types.
     */
    Twig.token.type = {
        output:  'output',
        logic:   'logic',
        comment: 'comment',
        raw:     'raw'
    };

    /**
     * Token syntax definitions.
     */
    Twig.token.definitions = [
        {
            type: Twig.token.type.raw,
            open: '{% raw %}',
            close: '{% endraw %}'
        },
        // *Output type tokens*
        //
        // These typically take the form `{{ expression }}`.
        {
            type: Twig.token.type.output,
            open: '{{',
            close: '}}'
        },
        // *Logic type tokens*
        //
        // These typically take a form like `{% if expression %}` or `{% endif %}`
        {
            type: Twig.token.type.logic,
            open: '{%',
            close: '%}'
        },
        // *Comment type tokens*
        //
        // These take the form `{# anything #}`
        {
            type: Twig.token.type.comment,
            open: '{#',
            close: '#}'
        }
    ];


    /**
     * What characters start "strings" in token definitions. We need this to ignore token close
     * strings inside an expression.
     */
    Twig.token.strings = ['"', "'"];

    Twig.token.findStart = function (template) {
        var output = {
                position: null,
                def: null
            },
            i,
            token_template,
            first_key_position;

        for (i=0;i<Twig.token.definitions.length;i++) {
            token_template = Twig.token.definitions[i];
            first_key_position = template.indexOf(token_template.open);

            Twig.log.trace("Twig.token.findStart: ", "Searching for ", token_template.open, " found at ", first_key_position);

            // Does this token occur before any other types?
            if (first_key_position >= 0 && (output.position === null || first_key_position < output.position)) {
                output.position = first_key_position;
                output.def = token_template;
            }
        }

        return output;
    };

    Twig.token.findEnd = function (template, token_def, start) {
        var end = null,
            found = false,
            offset = 0,

            // String position variables
            str_pos = null,
            str_found = null,
            pos = null,
            end_offset = null,
            this_str_pos = null,
            end_str_pos = null,

            // For loop variables
            i,
            l;

        while (!found) {
            str_pos = null;
            str_found = null;
            pos = template.indexOf(token_def.close, offset);

            if (pos >= 0) {
                end = pos;
                found = true;
            } else {
                // throw an exception
                throw new Twig.Error("Unable to find closing bracket '" + token_def.close +
                                "'" + " opened near template position " + start);
            }

            // Ignore quotes within comments; just look for the next comment close sequence,
            // regardless of what comes before it. https://github.com/justjohn/twig.js/issues/95
            if (token_def.type === Twig.token.type.comment) {
              break;
            }

            l = Twig.token.strings.length;
            for (i = 0; i < l; i += 1) {
                this_str_pos = template.indexOf(Twig.token.strings[i], offset);

                if (this_str_pos > 0 && this_str_pos < pos &&
                        (str_pos === null || this_str_pos < str_pos)) {
                    str_pos = this_str_pos;
                    str_found = Twig.token.strings[i];
                }
            }

            // We found a string before the end of the token, now find the string's end and set the search offset to it
            if (str_pos !== null) {
                end_offset = str_pos + 1;
                end = null;
                found = false;
                while (true) {
                    end_str_pos = template.indexOf(str_found, end_offset);
                    if (end_str_pos < 0) {
                        throw "Unclosed string in template";
                    }
                    // Ignore escaped quotes
                    if (template.substr(end_str_pos - 1, 1) !== "\\") {
                        offset = end_str_pos + 1;
                        break;
                    } else {
                        end_offset = end_str_pos + 1;
                    }
                }
            }
        }
        return end;
    };

    /**
     * Convert a template into high-level tokens.
     */
    Twig.tokenize = function (template) {
        var tokens = [],
            // An offset for reporting errors locations in the template.
            error_offset = 0,

            // The start and type of the first token found in the template.
            found_token = null,
            // The end position of the matched token.
            end = null;

        while (template.length > 0) {
            // Find the first occurance of any token type in the template
            found_token = Twig.token.findStart(template);

            Twig.log.trace("Twig.tokenize: ", "Found token: ", found_token);

            if (found_token.position !== null) {
                // Add a raw type token for anything before the start of the token
                if (found_token.position > 0) {
                    tokens.push({
                        type: Twig.token.type.raw,
                        value: template.substring(0, found_token.position)
                    });
                }
                template = template.substr(found_token.position + found_token.def.open.length);
                error_offset += found_token.position + found_token.def.open.length;

                // Find the end of the token
                end = Twig.token.findEnd(template, found_token.def, error_offset);

                Twig.log.trace("Twig.tokenize: ", "Token ends at ", end);

                tokens.push({
                    type:  found_token.def.type,
                    value: template.substring(0, end).trim()
                });

                if ( found_token.def.type === "logic" && template.substr( end + found_token.def.close.length, 1 ) === "\n" ) {
                    // Newlines directly after logic tokens are ignored
                    end += 1;
                }

                template = template.substr(end + found_token.def.close.length);

                // Increment the position in the template
                error_offset += end + found_token.def.close.length;

            } else {
                // No more tokens -> add the rest of the template as a raw-type token
                tokens.push({
                    type: Twig.token.type.raw,
                    value: template
                });
                template = '';
            }
        }

        return tokens;
    };


    Twig.compile = function (tokens) {
        try {

            // Output and intermediate stacks
            var output = [],
                stack = [],
                // The tokens between open and close tags
                intermediate_output = [],

                token = null,
                logic_token = null,
                unclosed_token = null,
                // Temporary previous token.
                prev_token = null,
                // The previous token's template
                prev_template = null,
                // The output token
                tok_output = null,

                // Logic Token values
                type = null,
                open = null,
                next = null;

            while (tokens.length > 0) {
                token = tokens.shift();
                Twig.log.trace("Compiling token ", token);
                switch (token.type) {
                    case Twig.token.type.raw:
                        if (stack.length > 0) {
                            intermediate_output.push(token);
                        } else {
                            output.push(token);
                        }
                        break;

                    case Twig.token.type.logic:
                        // Compile the logic token
                        logic_token = Twig.logic.compile.apply(this, [token]);

                        type = logic_token.type;
                        open = Twig.logic.handler[type].open;
                        next = Twig.logic.handler[type].next;

                        Twig.log.trace("Twig.compile: ", "Compiled logic token to ", logic_token,
                                                         " next is: ", next, " open is : ", open);

                        // Not a standalone token, check logic stack to see if this is expected
                        if (open !== undefined && !open) {
                            prev_token = stack.pop();
                            prev_template = Twig.logic.handler[prev_token.type];

                            if (Twig.indexOf(prev_template.next, type) < 0) {
                                throw new Error(type + " not expected after a " + prev_token.type);
                            }

                            prev_token.output = prev_token.output || [];

                            prev_token.output = prev_token.output.concat(intermediate_output);
                            intermediate_output = [];

                            tok_output = {
                                type: Twig.token.type.logic,
                                token: prev_token
                            };
                            if (stack.length > 0) {
                                intermediate_output.push(tok_output);
                            } else {
                                output.push(tok_output);
                            }
                        }

                        // This token requires additional tokens to complete the logic structure.
                        if (next !== undefined && next.length > 0) {
                            Twig.log.trace("Twig.compile: ", "Pushing ", logic_token, " to logic stack.");

                            if (stack.length > 0) {
                                // Put any currently held output into the output list of the logic operator
                                // currently at the head of the stack before we push a new one on.
                                prev_token = stack.pop();
                                prev_token.output = prev_token.output || [];
                                prev_token.output = prev_token.output.concat(intermediate_output);
                                stack.push(prev_token);
                                intermediate_output = [];
                            }

                            // Push the new logic token onto the logic stack
                            stack.push(logic_token);

                        } else if (open !== undefined && open) {
                            tok_output = {
                                type: Twig.token.type.logic,
                                token: logic_token
                            };
                            // Standalone token (like {% set ... %}
                            if (stack.length > 0) {
                                intermediate_output.push(tok_output);
                            } else {
                                output.push(tok_output);
                            }
                        }
                        break;

                    // Do nothing, comments should be ignored
                    case Twig.token.type.comment:
                        break;

                    case Twig.token.type.output:
                        Twig.expression.compile.apply(this, [token]);
                        if (stack.length > 0) {
                            intermediate_output.push(token);
                        } else {
                            output.push(token);
                        }
                        break;
                }

                Twig.log.trace("Twig.compile: ", " Output: ", output,
                                                 " Logic Stack: ", stack,
                                                 " Pending Output: ", intermediate_output );
            }

            // Verify that there are no logic tokens left in the stack.
            if (stack.length > 0) {
                unclosed_token = stack.pop();
                throw new Error("Unable to find an end tag for " + unclosed_token.type +
                                ", expecting one of " + unclosed_token.next);
            }
            return output;
        } catch (ex) {
            Twig.log.error("Error compiling twig template " + this.id + ": ");
            if (ex.stack) {
                Twig.log.error(ex.stack);
            } else {
                Twig.log.error(ex.toString());
            }

            if (this.options.rethrow) throw ex;
        }
    };

    /**
     * Parse a compiled template.
     *
     * @param {Array} tokens The compiled tokens.
     * @param {Object} context The render context.
     *
     * @return {string} The parsed template.
     */
    Twig.parse = function (tokens, context) {
        try {
            var output = [],
                // Track logic chains
                chain = true,
                that = this;

            Twig.forEach(tokens, function parseToken(token) {
                Twig.log.debug("Twig.parse: ", "Parsing token: ", token);

                switch (token.type) {
                    case Twig.token.type.raw:
                        output.push(Twig.filters.raw(token.value));
                        break;

                    case Twig.token.type.logic:
                        var logic_token = token.token,
                            logic = Twig.logic.parse.apply(that, [logic_token, context, chain]);

                        if (logic.chain !== undefined) {
                            chain = logic.chain;
                        }
                        if (logic.context !== undefined) {
                            context = logic.context;
                        }
                        if (logic.output !== undefined) {
                            output.push(logic.output);
                        }
                        break;

                    case Twig.token.type.comment:
                        // Do nothing, comments should be ignored
                        break;

                    case Twig.token.type.output:
                        Twig.log.debug("Twig.parse: ", "Output token: ", token.stack);
                        // Parse the given expression in the given context
                        output.push(Twig.expression.parse.apply(that, [token.stack, context]));
                        break;
                }
            });
            return Twig.output.apply(this, [output]);
        } catch (ex) {
            Twig.log.error("Error parsing twig template " + this.id + ": ");
            if (ex.stack) {
                Twig.log.error(ex.stack);
            } else {
                Twig.log.error(ex.toString());
            }

            if (this.options.rethrow) throw ex;

            if (Twig.debug) {
                return ex.toString();
            }
        }
    };

    /**
     * Tokenize and compile a string template.
     *
     * @param {string} data The template.
     *
     * @return {Array} The compiled tokens.
     */
    Twig.prepare = function(data) {
        var tokens, raw_tokens;

        // Tokenize
        Twig.log.debug("Twig.prepare: ", "Tokenizing ", data);
        raw_tokens = Twig.tokenize.apply(this, [data]);

        // Compile
        Twig.log.debug("Twig.prepare: ", "Compiling ", raw_tokens);
        tokens = Twig.compile.apply(this, [raw_tokens]);

        Twig.log.debug("Twig.prepare: ", "Compiled ", tokens);

        return tokens;
    };

    /**
     * Join the output token's stack and escape it if needed
     *
     * @param {Array} Output token's stack
     *
     * @return {string|String} Autoescaped output
     */
    Twig.output = function(output) {
        if (!this.options.autoescape) {
            return output.join("");
        }

        // [].map would be better but it's not supported by IE8-
        var escaped_output = [];
        Twig.forEach(output, function (str) {
            if (str && !str.twig_markup) {
                str = Twig.filters.escape(str);
            }
            escaped_output.push(str);
        });
        return Twig.Markup(escaped_output.join(""));
    }

    // Namespace for template storage and retrieval
    Twig.Templates = {
        registry: {}
    };

    /**
     * Is this id valid for a twig template?
     *
     * @param {string} id The ID to check.
     *
     * @throws {Twig.Error} If the ID is invalid or used.
     * @return {boolean} True if the ID is valid.
     */
    Twig.validateId = function(id) {
        if (id === "prototype") {
            throw new Twig.Error(id + " is not a valid twig identifier");
        } else if (Twig.Templates.registry.hasOwnProperty(id)) {
            throw new Twig.Error("There is already a template with the ID " + id);
        }
        return true;
    }

    /**
     * Save a template object to the store.
     *
     * @param {Twig.Template} template   The twig.js template to store.
     */
    Twig.Templates.save = function(template) {
        if (template.id === undefined) {
            throw new Twig.Error("Unable to save template with no id");
        }
        Twig.Templates.registry[template.id] = template;
    };

    /**
     * Load a previously saved template from the store.
     *
     * @param {string} id   The ID of the template to load.
     *
     * @return {Twig.Template} A twig.js template stored with the provided ID.
     */
    Twig.Templates.load = function(id) {
        if (!Twig.Templates.registry.hasOwnProperty(id)) {
            return null;
        }
        return Twig.Templates.registry[id];
    };

    /**
     * Load a template from a remote location using AJAX and saves in with the given ID.
     *
     * Available parameters:
     *
     *      async:       Should the HTTP request be performed asynchronously.
     *                      Defaults to true.
     *      method:      What method should be used to load the template
     *                      (fs or ajax)
     *      precompiled: Has the template already been compiled.
     *
     * @param {string} location  The remote URL to load as a template.
     * @param {Object} params The template parameters.
     * @param {function} callback  A callback triggered when the template finishes loading.
     * @param {function} error_callback  A callback triggered if an error occurs loading the template.
     *
     *
     */
    Twig.Templates.loadRemote = function(location, params, callback, error_callback) {
        var id          = params.id,
            method      = params.method,
            async       = params.async,
            precompiled = params.precompiled,
            template    = null;

        // Default to async
        if (async === undefined) async = true;

        // Default to the URL so the template is cached.
        if (id === undefined) {
            id = location;
        }
        params.id = id;

        // Check for existing template
        if (Twig.cache && Twig.Templates.registry.hasOwnProperty(id)) {
            // A template is already saved with the given id.
            if (callback) {
                callback(Twig.Templates.registry[id]);
            }
            return Twig.Templates.registry[id];
        }

        if (method == 'ajax') {
            if (typeof XMLHttpRequest == "undefined") {
                throw new Twig.Error("Unsupported platform: Unable to do remote requests " +
                                     "because there is no XMLHTTPRequest implementation");
            }

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                var data = null;

                if(xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        Twig.log.debug("Got template ", xmlhttp.responseText);

                        if (precompiled === true) {
                            data = JSON.parse(xmlhttp.responseText);
                        } else {
                            data = xmlhttp.responseText;
                        }

                        params.url = location;
                        params.data = data;

                        template = new Twig.Template(params);

                        if (callback) {
                            callback(template);
                        }
                    } else {
                        if (error_callback) {
                            error_callback(xmlhttp);
                        }
                    }
                }
            };
            xmlhttp.open("GET", location, async);
            xmlhttp.send();

        } else { // if method = 'fs'
            // Create local scope
            (function() {
                var fs = require('fs'),
                    path = require('path'),
                    data = null,
                    loadTemplateFn = function(err, data) {
                        if (err) {
                            if (error_callback) {
                                error_callback(err);
                            }
                            return;
                        }

                        if (precompiled === true) {
                            data = JSON.parse(data);
                        }

                        params.data = data;
                        params.path = location;

                        // template is in data
                        template = new Twig.Template(params);

                        if (callback) {
                            callback(template);
                        }
                    };

                if (async === true) {
                    fs.stat(location, function (err, stats) {
                        if (err || !stats.isFile())
                            throw new Twig.Error("Unable to find template file " + location);

                        fs.readFile(location, 'utf8', loadTemplateFn);
                    });
                } else {
                    if (!fs.statSync(location).isFile())
                        throw new Twig.Error("Unable to find template file " + location);

                    data = fs.readFileSync(location, 'utf8');
                    loadTemplateFn(undefined, data);
                }
            })();
        }
        if (async === false) {
            return template;
        } else {
            // placeholder for now, should eventually return a deferred object.
            return true;
        }
    };

    // Determine object type
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    /**
     * Create a new twig.js template.
     *
     * Parameters: {
     *      data:   The template, either pre-compiled tokens or a string template
     *      id:     The name of this template
     *      blocks: Any pre-existing block from a child template
     * }
     *
     * @param {Object} params The template parameters.
     */
    Twig.Template = function ( params ) {
        var data = params.data,
            id = params.id,
            blocks = params.blocks,
            macros = params.macros || {},
            base = params.base,
            path = params.path,
            url = params.url,
            // parser options
            options = params.options;

        // # What is stored in a Twig.Template
        //
        // The Twig Template hold several chucks of data.
        //
        //     {
        //          id:     The token ID (if any)
        //          tokens: The list of tokens that makes up this template.
        //          blocks: The list of block this template contains.
        //          base:   The base template (if any)
        //            options:  {
        //                Compiler/parser options
        //
        //                strict_variables: true/false
        //                    Should missing variable/keys emit an error message. If false, they default to null.
        //            }
        //     }
        //

        this.id     = id;
        this.base   = base;
        this.path   = path;
        this.url    = url;
        this.macros = macros;
        this.options = options;

        this.reset(blocks);

        if (is('String', data)) {
            this.tokens = Twig.prepare.apply(this, [data]);
        } else {
            this.tokens = data;
        }

        if (id !== undefined) {
            Twig.Templates.save(this);
        }
    };

    Twig.Template.prototype.reset = function(blocks) {
        Twig.log.debug("Twig.Template.reset", "Reseting template " + this.id);
        this.blocks = {};
        this.importedBlocks = [];
        this.child = {
            blocks: blocks || {}
        };
        this.extend = null;
    };

    Twig.Template.prototype.render = function (context, params) {
        params = params || {};

        var output,
            url;

        this.context = context || {};

        // Clear any previous state
        this.reset();
        if (params.blocks) {
            this.blocks = params.blocks;
        }
        if (params.macros) {
            this.macros = params.macros;
        }

        output = Twig.parse.apply(this, [this.tokens, this.context]);

        // Does this template extend another
        if (this.extend) {
            var ext_template;

            // check if the template is provided inline
            if ( this.options.allowInlineIncludes ) {
                ext_template = Twig.Templates.load(this.extend);
                if ( ext_template ) {
                    ext_template.options = this.options;
                }
            }

            // check for the template file via include
            if (!ext_template) {
                url = relativePath(this, this.extend);

                ext_template = Twig.Templates.loadRemote(url, {
                    method: this.url?'ajax':'fs',
                    base: this.base,
                    async:  false,
                    id:     url,
                    options: this.options
                });
            }

            this.parent = ext_template;

            return this.parent.render(this.context, {
                blocks: this.blocks
            });
        }

        if (params.output == 'blocks') {
            return this.blocks;
        } else if (params.output == 'macros') {
            return this.macros;
        } else {
            return output;
        }
    };

    Twig.Template.prototype.importFile = function(file) {
        var url, sub_template;
        if ( !this.url && !this.path && this.options.allowInlineIncludes ) {
            sub_template = Twig.Templates.load(file);
            sub_template.options = this.options;
            if ( sub_template ) {
                return sub_template;
            }

            throw new Twig.Error("Didn't find the inline template by id");
        }

        url = relativePath(this, file);

        // Load blocks from an external file
        sub_template = Twig.Templates.loadRemote(url, {
            method: this.url?'ajax':'fs',
            base: this.base,
            async: false,
            options: this.options,
            id: url
        });

        return sub_template;
    };

    Twig.Template.prototype.importBlocks = function(file, override) {
        var sub_template = this.importFile(file),
            context = this.context,
            that = this,
            key;

        override = override || false;

        sub_template.render(context);

        // Mixin blocks
        Twig.forEach(Object.keys(sub_template.blocks), function(key) {
            if (override || that.blocks[key] === undefined) {
                that.blocks[key] = sub_template.blocks[key];
                that.importedBlocks.push(key);
            }
        });
    };

    Twig.Template.prototype.compile = function(options) {
        // compile the template into raw JS
        return Twig.compiler.compile(this, options);
    };

    /**
     * Create safe output
     *
     * @param {string} Content safe to output
     *
     * @return {String} Content wrapped into a String
     */

    Twig.Markup = function(content) {
        if (typeof content === 'string' && content.length > 0) {
            content = new String(content);
            content.twig_markup = true;
        }
        return content;
    }

    /**
     * Generate the relative canonical version of a url based on the given base path and file path.
     *
     * @param {string} template The Twig.Template.
     * @param {string} file The file path, relative to the base path.
     *
     * @return {string} The canonical version of the path.
     */
    function relativePath(template, file) {
        var base,
            base_path,
            sep_chr = "/",
            new_path = [],
            val;

        if (template.url) {
            if (typeof template.base !== 'undefined') {
                base = template.base + ((template.base.charAt(template.base.length-1) === '/') ? '' : '/');
            } else {
                base = template.url;
            }
        } else if (template.path) {
            // Get the system-specific path separator
            var path = require("path"),
                sep = path.sep || sep_chr,
                relative = new RegExp("^\\.{1,2}" + sep.replace("\\", "\\\\"));
            file = file.replace(/\//g, sep);

            if (template.base !== undefined && file.match(relative) == null) {
                file = file.replace(template.base, '');
                base = template.base + sep;
            } else {
                base = template.path;
            }

            base = base.replace(sep+sep, sep);
            sep_chr = sep;
        } else {
            throw new Twig.Error("Cannot extend an inline template.");
        }

        base_path = base.split(sep_chr);

        // Remove file from url
        base_path.pop();
        base_path = base_path.concat(file.split(sep_chr));

        while (base_path.length > 0) {
            val = base_path.shift();
            if (val == ".") {
                // Ignore
            } else if (val == ".." && new_path.length > 0 && new_path[new_path.length-1] != "..") {
                new_path.pop();
            } else {
                new_path.push(val);
            }
        }

        return new_path.join(sep_chr);
    }

    return Twig;

}) (Twig || { });

// The following methods are from MDN and are available under a
// [MIT License](http://www.opensource.org/licenses/mit-license.php) or are
// [Public Domain](https://developer.mozilla.org/Project:Copyrights).
//
// See:
// * [Object.keys - MDN](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys)

// ## twig.fills.js
//
// This file contains fills for backwards compatability.
(function() {
    "use strict";
    // Handle methods that don't yet exist in every browser

    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g,'');
        }
    };

    if(!Object.keys) Object.keys = function(o){
        if (o !== Object(o)) {
            throw new TypeError('Object.keys called on non-object');
        }
        var ret = [], p;
        for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) ret.push(p);
        return ret;
    }

})();
// ## twig.lib.js
//
// This file contains 3rd party libraries used within twig.
//
// Copies of the licenses for the code included here can be found in the
// LICENSES.md file.
//

var Twig = (function(Twig) {

    // Namespace for libraries
    Twig.lib = { };

    /**
    sprintf() for JavaScript 0.7-beta1
    http://www.diveintojavascript.com/projects/javascript-sprintf
    **/
    var sprintf = (function() {
            function get_type(variable) {
                    return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
            }
            function str_repeat(input, multiplier) {
                    for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
                    return output.join('');
            }

            var str_format = function() {
                    if (!str_format.cache.hasOwnProperty(arguments[0])) {
                            str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
                    }
                    return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
            };

            str_format.format = function(parse_tree, argv) {
                    var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
                    for (i = 0; i < tree_length; i++) {
                            node_type = get_type(parse_tree[i]);
                            if (node_type === 'string') {
                                    output.push(parse_tree[i]);
                            }
                            else if (node_type === 'array') {
                                    match = parse_tree[i]; // convenience purposes only
                                    if (match[2]) { // keyword argument
                                            arg = argv[cursor];
                                            for (k = 0; k < match[2].length; k++) {
                                                    if (!arg.hasOwnProperty(match[2][k])) {
                                                            throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
                                                    }
                                                    arg = arg[match[2][k]];
                                            }
                                    }
                                    else if (match[1]) { // positional argument (explicit)
                                            arg = argv[match[1]];
                                    }
                                    else { // positional argument (implicit)
                                            arg = argv[cursor++];
                                    }

                                    if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
                                            throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
                                    }
                                    switch (match[8]) {
                                            case 'b': arg = arg.toString(2); break;
                                            case 'c': arg = String.fromCharCode(arg); break;
                                            case 'd': arg = parseInt(arg, 10); break;
                                            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
                                            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
                                            case 'o': arg = arg.toString(8); break;
                                            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
                                            case 'u': arg = Math.abs(arg); break;
                                            case 'x': arg = arg.toString(16); break;
                                            case 'X': arg = arg.toString(16).toUpperCase(); break;
                                    }

                                    var sign = '';
                                    if (/[def]/.test(match[8])) {
                                        if (match[3]) {
                                            sign = arg >= 0 ? '+' : '-';
                                        } else {
                                            sign = arg >= 0 ? '' : '-';
                                        }
                                        arg = Math.abs(arg);
                                    }

                                    pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                                    pad_length = match[6] - String(arg).length - sign.length;
                                    pad = match[6] ? str_repeat(pad_character, pad_length) : '';

                                    if (match[5]) {
                                        // trailing padding
                                        output.push(sign);
                                        output.push(arg);
                                        output.push(pad);
                                    } else if ('0' == pad_character) {
                                        // leading zero padding
                                        output.push(sign);
                                        output.push(pad);
                                        output.push(arg);
                                    } else {
                                        // leading padding
                                        output.push(pad);
                                        output.push(sign);
                                        output.push(arg);
                                    }
                            }
                    }
                    return output.join('');
            };

            str_format.cache = {};

            str_format.parse = function(fmt) {
                    var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
                    while (_fmt) {
                            if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
                                    parse_tree.push(match[0]);
                            }
                            else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
                                    parse_tree.push('%');
                            }
                            else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
                                    if (match[2]) {
                                            arg_names |= 1;
                                            var field_list = [], replacement_field = match[2], field_match = [];
                                            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                                    field_list.push(field_match[1]);
                                                    while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                                                            if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                                                    field_list.push(field_match[1]);
                                                            }
                                                            else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                                                                    field_list.push(field_match[1]);
                                                            }
                                                            else {
                                                                    throw('[sprintf] huh?');
                                                            }
                                                    }
                                            }
                                            else {
                                                    throw('[sprintf] huh?');
                                            }
                                            match[2] = field_list;
                                    }
                                    else {
                                            arg_names |= 2;
                                    }
                                    if (arg_names === 3) {
                                            throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
                                    }
                                    parse_tree.push(match);
                            }
                            else {
                                    throw('[sprintf] huh?');
                            }
                            _fmt = _fmt.substring(match[0].length);
                    }
                    return parse_tree;
            };

            return str_format;
    })();

    var vsprintf = function(fmt, argv) {
        argv.unshift(fmt);
        return sprintf.apply(null, argv);
    };

    // Expose to Twig
    Twig.lib.sprintf = sprintf;
    Twig.lib.vsprintf = vsprintf;


    /**
     * jPaq - A fully customizable JavaScript/JScript library
     * http://jpaq.org/
     *
     * Copyright (c) 2011 Christopher West
     * Licensed under the MIT license.
     * http://jpaq.org/license/
     *
     * Version: 1.0.6.0000W
     * Revised: April 6, 2011
     */
    ; (function() {
        var shortDays = "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",");
        var fullDays = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(",");
        var shortMonths = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",");
        var fullMonths = "January,February,March,April,May,June,July,August,September,October,November,December".split(",");
        function getOrdinalFor(intNum) {
                return (((intNum = Math.abs(intNum) % 100) % 10 == 1 && intNum != 11) ? "st"
                        : (intNum % 10 == 2 && intNum != 12) ? "nd" : (intNum % 10 == 3
                        && intNum != 13) ? "rd" : "th");
        }
        function getISO8601Year(aDate) {
                var d = new Date(aDate.getFullYear() + 1, 0, 4);
                if((d - aDate) / 86400000 < 7 && (aDate.getDay() + 6) % 7 < (d.getDay() + 6) % 7)
                        return d.getFullYear();
                if(aDate.getMonth() > 0 || aDate.getDate() >= 4)
                        return aDate.getFullYear();
                return aDate.getFullYear() - (((aDate.getDay() + 6) % 7 - aDate.getDate() > 2) ? 1 : 0);
        }
        function getISO8601Week(aDate) {
                // Get a day during the first week of the year.
                var d = new Date(getISO8601Year(aDate), 0, 4);
                // Get the first monday of the year.
                d.setDate(d.getDate() - (d.getDay() + 6) % 7);
                return parseInt((aDate - d) / 604800000) + 1;
        }
        Twig.lib.formatDate = function(date, format) {
            /// <summary>
            ///   Gets a string for this date, formatted according to the given format
            ///   string.
            /// </summary>
            /// <param name="format" type="String">
            ///   The format of the output date string.  The format string works in a
            ///   nearly identical way to the PHP date function which is highlighted here:
            ///   http://php.net/manual/en/function.date.php.
            ///   The only difference is the fact that "u" signifies milliseconds
            ///   instead of microseconds.  The following characters are recognized in
            ///   the format parameter string:
            ///     d - Day of the month, 2 digits with leading zeros
            ///     D - A textual representation of a day, three letters
            ///     j - Day of the month without leading zeros
            ///     l (lowercase 'L') - A full textual representation of the day of the week
            ///     N - ISO-8601 numeric representation of the day of the week (starting from 1)
            ///     S - English ordinal suffix for the day of the month, 2 characters st,
            ///         nd, rd or th. Works well with j.
            ///     w - Numeric representation of the day of the week (starting from 0)
            ///     z - The day of the year (starting from 0)
            ///     W - ISO-8601 week number of year, weeks starting on Monday
            ///     F - A full textual representation of a month, such as January or March
            ///     m - Numeric representation of a month, with leading zeros
            ///     M - A short textual representation of a month, three letters
            ///     n - Numeric representation of a month, without leading zeros
            ///     t - Number of days in the given month
            ///     L - Whether it's a leap year
            ///     o - ISO-8601 year number. This has the same value as Y, except that if
            ///         the ISO week number (W) belongs to the previous or next year, that
            ///         year is used instead.
            ///     Y - A full numeric representation of a year, 4 digits
            ///     y - A two digit representation of a year
            ///     a - Lowercase Ante meridiem and Post meridiem
            ///     A - Uppercase Ante meridiem and Post meridiem
            ///     B - Swatch Internet time
            ///     g - 12-hour format of an hour without leading zeros
            ///     G - 24-hour format of an hour without leading zeros
            ///     h - 12-hour format of an hour with leading zeros
            ///     H - 24-hour format of an hour with leading zeros
            ///     i - Minutes with leading zeros
            ///     s - Seconds, with leading zeros
            ///     u - Milliseconds
            ///     U - Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
            /// </param>
            /// <returns type="String">
            ///   Returns the string for this date, formatted according to the given
            ///   format string.
            /// </returns>
            // If the format was not passed, use the default toString method.
            if(typeof format !== "string" || /^\s*$/.test(format))
                    return date + "";
            var jan1st = new Date(date.getFullYear(), 0, 1);
            var me = date;
            return format.replace(/[dDjlNSwzWFmMntLoYyaABgGhHisuU]/g, function(option) {
                switch(option) {
                    // Day of the month, 2 digits with leading zeros
                    case "d": return ("0" + me.getDate()).replace(/^.+(..)$/, "$1");
                    // A textual representation of a day, three letters
                    case "D": return shortDays[me.getDay()];
                    // Day of the month without leading zeros
                    case "j": return me.getDate();
                    // A full textual representation of the day of the week
                    case "l": return fullDays[me.getDay()];
                    // ISO-8601 numeric representation of the day of the week
                    case "N": return (me.getDay() + 6) % 7 + 1;
                    // English ordinal suffix for the day of the month, 2 characters
                    case "S": return getOrdinalFor(me.getDate());
                    // Numeric representation of the day of the week
                    case "w": return me.getDay();
                    // The day of the year (starting from 0)
                    case "z": return Math.ceil((jan1st - me) / 86400000);
                    // ISO-8601 week number of year, weeks starting on Monday
                    case "W": return ("0" + getISO8601Week(me)).replace(/^.(..)$/, "$1");
                    // A full textual representation of a month, such as January or March
                    case "F": return fullMonths[me.getMonth()];
                    // Numeric representation of a month, with leading zeros
                    case "m": return ("0" + (me.getMonth() + 1)).replace(/^.+(..)$/, "$1");
                    // A short textual representation of a month, three letters
                    case "M": return shortMonths[me.getMonth()];
                    // Numeric representation of a month, without leading zeros
                    case "n": return me.getMonth() + 1;
                    // Number of days in the given month
                    case "t": return new Date(me.getFullYear(), me.getMonth() + 1, -1).getDate();
                    // Whether it's a leap year
                    case "L": return new Date(me.getFullYear(), 1, 29).getDate() == 29 ? 1 : 0;
                    // ISO-8601 year number. This has the same value as Y, except that if the
                    // ISO week number (W) belongs to the previous or next year, that year is
                    // used instead.
                    case "o": return getISO8601Year(me);
                    // A full numeric representation of a year, 4 digits
                    case "Y": return me.getFullYear();
                    // A two digit representation of a year
                    case "y": return (me.getFullYear() + "").replace(/^.+(..)$/, "$1");
                    // Lowercase Ante meridiem and Post meridiem
                    case "a": return me.getHours() < 12 ? "am" : "pm";
                    // Uppercase Ante meridiem and Post meridiem
                    case "A": return me.getHours() < 12 ? "AM" : "PM";
                    // Swatch Internet time
                    case "B": return Math.floor((((me.getUTCHours() + 1) % 24) + me.getUTCMinutes() / 60 + me.getUTCSeconds() / 3600) * 1000 / 24);
                    // 12-hour format of an hour without leading zeros
                    case "g": return me.getHours() % 12 != 0 ? me.getHours() % 12 : 12;
                    // 24-hour format of an hour without leading zeros
                    case "G": return me.getHours();
                    // 12-hour format of an hour with leading zeros
                    case "h": return ("0" + (me.getHours() % 12 != 0 ? me.getHours() % 12 : 12)).replace(/^.+(..)$/, "$1");
                    // 24-hour format of an hour with leading zeros
                    case "H": return ("0" + me.getHours()).replace(/^.+(..)$/, "$1");
                    // Minutes with leading zeros
                    case "i": return ("0" + me.getMinutes()).replace(/^.+(..)$/, "$1");
                    // Seconds, with leading zeros
                    case "s": return ("0" + me.getSeconds()).replace(/^.+(..)$/, "$1");
                    // Milliseconds
                    case "u": return me.getMilliseconds();
                    // Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
                    case "U": return me.getTime() / 1000;
                }
            });
        };
    })();

    Twig.lib.strip_tags = function(input, allowed) {
        // Strips HTML and PHP tags from a string
        //
        // version: 1109.2015
        // discuss at: http://phpjs.org/functions/strip_tags
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Luke Godfrey
        // +      input by: Pul
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Onno Marsman
        // +      input by: Alex
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Marc Palau
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Eric Nagel
        // +      input by: Bobby Drake
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Tomasz Wesolowski
        // +      input by: Evertjan Garretsen
        // +    revised by: Rafał Kukawski (http://blog.kukawski.pl/)
        // *     example 1: strip_tags('<p>Kevin</p> <b>van</b> <i>Zonneveld</i>', '<i><b>');
        // *     returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
        // *     example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
        // *     returns 2: '<p>Kevin van Zonneveld</p>'
        // *     example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
        // *     returns 3: '<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>'
        // *     example 4: strip_tags('1 < 5 5 > 1');
        // *     returns 4: '1 < 5 5 > 1'
        // *     example 5: strip_tags('1 <br/> 1');
        // *     returns 5: '1  1'
        // *     example 6: strip_tags('1 <br/> 1', '<br>');
        // *     returns 6: '1  1'
        // *     example 7: strip_tags('1 <br/> 1', '<br><br/>');
        // *     returns 7: '1 <br/> 1'
        allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
        });
    }

    Twig.lib.parseISO8601Date = function (s){
        // Taken from http://n8v.enteuxis.org/2010/12/parsing-iso-8601-dates-in-javascript/
        // parenthese matches:
        // year month day    hours minutes seconds  
        // dotmilliseconds 
        // tzstring plusminus hours minutes
        var re = /(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(\.\d+)?(Z|([+-])(\d\d):(\d\d))/;

        var d = [];
        d = s.match(re);

        // "2010-12-07T11:00:00.000-09:00" parses to:
        //  ["2010-12-07T11:00:00.000-09:00", "2010", "12", "07", "11",
        //     "00", "00", ".000", "-09:00", "-", "09", "00"]
        // "2010-12-07T11:00:00.000Z" parses to:
        //  ["2010-12-07T11:00:00.000Z",      "2010", "12", "07", "11", 
        //     "00", "00", ".000", "Z", undefined, undefined, undefined]

        if (! d) {
            throw "Couldn't parse ISO 8601 date string '" + s + "'";
        }

        // parse strings, leading zeros into proper ints
        var a = [1,2,3,4,5,6,10,11];
        for (var i in a) {
            d[a[i]] = parseInt(d[a[i]], 10);
        }
        d[7] = parseFloat(d[7]);

        // Date.UTC(year, month[, date[, hrs[, min[, sec[, ms]]]]])
        // note that month is 0-11, not 1-12
        // see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/UTC
        var ms = Date.UTC(d[1], d[2] - 1, d[3], d[4], d[5], d[6]);

        // if there are milliseconds, add them
        if (d[7] > 0) {  
            ms += Math.round(d[7] * 1000);
        }

        // if there's a timezone, calculate it
        if (d[8] != "Z" && d[10]) {
            var offset = d[10] * 60 * 60 * 1000;
            if (d[11]) {
                offset += d[11] * 60 * 1000;
            }
            if (d[9] == "-") {
                ms -= offset;
            }
            else {
                ms += offset;
            }
        }

        return new Date(ms);
    };

    Twig.lib.strtotime = function (text, now) {
        //  discuss at: http://phpjs.org/functions/strtotime/
        //     version: 1109.2016
        // original by: Caio Ariede (http://caioariede.com)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Caio Ariede (http://caioariede.com)
        // improved by: A. Matías Quezada (http://amatiasq.com)
        // improved by: preuter
        // improved by: Brett Zamir (http://brett-zamir.me)
        // improved by: Mirko Faber
        //    input by: David
        // bugfixed by: Wagner B. Soares
        // bugfixed by: Artur Tchernychev
        //        note: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
        //   example 1: strtotime('+1 day', 1129633200);
        //   returns 1: 1129719600
        //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
        //   returns 2: 1130425202
        //   example 3: strtotime('last month', 1129633200);
        //   returns 3: 1127041200
        //   example 4: strtotime('2009-05-04 08:30:00 GMT');
        //   returns 4: 1241425800

        var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

        if (!text) {
            return fail;
        }

        // Unecessary spaces
        text = text.replace(/^\s+|\s+$/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/[\t\r\n]/g, '')
            .toLowerCase();

        // in contrast to php, js Date.parse function interprets:
        // dates given as yyyy-mm-dd as in timezone: UTC,
        // dates with "." or "-" as MDY instead of DMY
        // dates with two-digit years differently
        // etc...etc...
        // ...therefore we manually parse lots of common date formats
        match = text.match(
            /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

        if (match && match[2] === match[4]) {
            if (match[1] > 1901) {
                switch (match[2]) {
                case '-':
                    {
                        // YYYY-M-D
                        if (match[3] > 12 || match[5] > 31) {
                            return fail;
                        }

                        return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                case '.':
                    {
                        // YYYY.M.D is not parsed by strtotime()
                        return fail;
                    }
                case '/':
                    {
                        // YYYY/M/D
                        if (match[3] > 12 || match[5] > 31) {
                            return fail;
                        }

                        return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                }
            } else if (match[5] > 1901) {
                switch (match[2]) {
                case '-':
                    {
                        // D-M-YYYY
                        if (match[3] > 12 || match[1] > 31) {
                            return fail;
                        }

                        return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                case '.':
                    {
                        // D.M.YYYY
                        if (match[3] > 12 || match[1] > 31) {
                            return fail;
                        }

                        return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                case '/':
                    {
                        // M/D/YYYY
                        if (match[1] > 12 || match[3] > 31) {
                            return fail;
                        }

                        return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                }
            } else {
                switch (match[2]) {
                case '-':
                    {
                        // YY-M-D
                        if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
                            return fail;
                        }

                        year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
                        return new Date(year, parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                case '.':
                    {
                        // D.M.YY or H.MM.SS
                        if (match[5] >= 70) {
                            // D.M.YY
                            if (match[3] > 12 || match[1] > 31) {
                                return fail;
                            }

                            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                        }
                        if (match[5] < 60 && !match[6]) {
                            // H.MM.SS
                            if (match[1] > 23 || match[3] > 59) {
                                return fail;
                            }

                            today = new Date();
                            return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                                match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
                        }

                        // invalid format, cannot be parsed
                        return fail;
                    }
                case '/':
                    {
                        // M/D/YY
                        if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
                            return fail;
                        }

                        year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
                        return new Date(year, parseInt(match[1], 10) - 1, match[3],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                case ':':
                    {
                        // HH:MM:SS
                        if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                            return fail;
                        }

                        today = new Date();
                        return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                            match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
                    }
                }
            }
        }

        // other formats and "now" should be parsed by Date.parse()
        if (text === 'now') {
            return now === null || isNaN(now) ? new Date()
                .getTime() / 1000 | 0 : now | 0;
        }
        if (!isNaN(parsed = Date.parse(text))) {
            return parsed / 1000 | 0;
        }

        date = now ? new Date(now * 1000) : new Date();
        days = {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,
            'thu': 4,
            'fri': 5,
            'sat': 6
        };
        ranges = {
            'yea': 'FullYear',
            'mon': 'Month',
            'day': 'Date',
            'hou': 'Hours',
            'min': 'Minutes',
            'sec': 'Seconds'
        };

        function lastNext(type, range, modifier) {
            var diff, day = days[range];

            if (typeof day !== 'undefined') {
                diff = day - date.getDay();

                if (diff === 0) {
                    diff = 7 * modifier;
                } else if (diff > 0 && type === 'last') {
                    diff -= 7;
                } else if (diff < 0 && type === 'next') {
                    diff += 7;
                }

                date.setDate(date.getDate() + diff);
            }
        }

        function process(val) {
            var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
                type = splt[0],
                range = splt[1].substring(0, 3),
                typeIsNumber = /\d+/.test(type),
                ago = splt[2] === 'ago',
                num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

            if (typeIsNumber) {
                num *= parseInt(type, 10);
            }

            if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
                return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
            }

            if (range === 'wee') {
                return date.setDate(date.getDate() + (num * 7));
            }

            if (type === 'next' || type === 'last') {
                lastNext(type, range, num);
            } else if (!typeIsNumber) {
                return false;
            }

            return true;
        }

        times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
            '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
            '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
        regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

        match = text.match(new RegExp(regex, 'gi'));
        if (!match) {
            return fail;
        }

        for (i = 0, len = match.length; i < len; i++) {
            if (!process(match[i])) {
                return fail;
            }
        }

        // ECMAScript 5 only
        // if (!match.every(process))
        //    return false;

        return (date.getTime() / 1000);
    };

    Twig.lib.is = function(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    };

    // shallow-copy an object
    Twig.lib.copy = function(src) {
        var target = {},
            key;
        for (key in src)
            target[key] = src[key];

        return target;
    };

    Twig.lib.replaceAll = function(string, search, replace) {
        return string.split(search).join(replace);
    };

    // chunk an array (arr) into arrays of (size) items, returns an array of arrays, or an empty array on invalid input
    Twig.lib.chunkArray = function (arr, size) {
        var returnVal = [],
            x = 0,
            len = arr.length;

        if (size < 1 || !Twig.lib.is("Array", arr)) {
            return [];
        }

        while (x < len) {
            returnVal.push(arr.slice(x, x += size));
        }

        return returnVal;
    };

    Twig.lib.round = function round(value, precision, mode) {
        //  discuss at: http://phpjs.org/functions/round/
        // original by: Philip Peterson
        //  revised by: Onno Marsman
        //  revised by: T.Wild
        //  revised by: Rafał Kukawski (http://blog.kukawski.pl/)
        //    input by: Greenseed
        //    input by: meo
        //    input by: William
        //    input by: Josep Sanz (http://www.ws3.es/)
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        //        note: Great work. Ideas for improvement:
        //        note: - code more compliant with developer guidelines
        //        note: - for implementing PHP constant arguments look at
        //        note: the pathinfo() function, it offers the greatest
        //        note: flexibility & compatibility possible
        //   example 1: round(1241757, -3);
        //   returns 1: 1242000
        //   example 2: round(3.6);
        //   returns 2: 4
        //   example 3: round(2.835, 2);
        //   returns 3: 2.84
        //   example 4: round(1.1749999999999, 2);
        //   returns 4: 1.17
        //   example 5: round(58551.799999999996, 2);
        //   returns 5: 58551.8

        var m, f, isHalf, sgn; // helper variables
        precision |= 0; // making sure precision is integer
        m = Math.pow(10, precision);
        value *= m;
        sgn = (value > 0) | -(value < 0); // sign of the number
        isHalf = value % 1 === 0.5 * sgn;
        f = Math.floor(value);

        if (isHalf) {
            switch (mode) {
                case 'PHP_ROUND_HALF_DOWN':
                    value = f + (sgn < 0); // rounds .5 toward zero
                    break;
                case 'PHP_ROUND_HALF_EVEN':
                    value = f + (f % 2 * sgn); // rouds .5 towards the next even integer
                    break;
                case 'PHP_ROUND_HALF_ODD':
                    value = f + !(f % 2); // rounds .5 towards the next odd integer
                    break;
                default:
                    value = f + (sgn > 0); // rounds .5 away from zero
            }
        }

        return (isHalf ? value : Math.round(value)) / m;
    }

    return Twig;

})(Twig || { });
//     Twig.js
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.logic.js
//
// This file handles tokenizing, compiling and parsing logic tokens. {% ... %}
var Twig = (function (Twig) {
    "use strict";

    /**
     * Namespace for logic handling.
     */
    Twig.logic = {};

    /**
     * Logic token types.
     */
    Twig.logic.type = {
        if_:       'Twig.logic.type.if',
        endif:     'Twig.logic.type.endif',
        for_:      'Twig.logic.type.for',
        endfor:    'Twig.logic.type.endfor',
        else_:     'Twig.logic.type.else',
        elseif:    'Twig.logic.type.elseif',
        set:       'Twig.logic.type.set',
        setcapture:'Twig.logic.type.setcapture',
        endset:    'Twig.logic.type.endset',
        filter:    'Twig.logic.type.filter',
        endfilter: 'Twig.logic.type.endfilter',
        block:     'Twig.logic.type.block',
        endblock:  'Twig.logic.type.endblock',
        extends_:  'Twig.logic.type.extends',
        use:       'Twig.logic.type.use',
        include:   'Twig.logic.type.include',
        spaceless: 'Twig.logic.type.spaceless',
        endspaceless: 'Twig.logic.type.endspaceless',
        macro:     'Twig.logic.type.macro',
        endmacro:  'Twig.logic.type.endmacro',
        import_:   'Twig.logic.type.import',
        from:      'Twig.logic.type.from',
        embed:     'Twig.logic.type.embed',
        endembed:  'Twig.logic.type.endembed'
    };


    // Regular expressions for handling logic tokens.
    //
    // Properties:
    //
    //      type:  The type of expression this matches
    //
    //      regex: A regular expression that matches the format of the token
    //
    //      next:  What logic tokens (if any) pop this token off the logic stack. If empty, the
    //             logic token is assumed to not require an end tag and isn't push onto the stack.
    //
    //      open:  Does this tag open a logic expression or is it standalone. For example,
    //             {% endif %} cannot exist without an opening {% if ... %} tag, so open = false.
    //
    //  Functions:
    //
    //      compile: A function that handles compiling the token into an output token ready for
    //               parsing with the parse function.
    //
    //      parse:   A function that parses the compiled token into output (HTML / whatever the
    //               template represents).
    Twig.logic.definitions = [
        {
            /**
             * If type logic tokens.
             *
             *  Format: {% if expression %}
             */
            type: Twig.logic.type.if_,
            regex: /^if\s+([\s\S]+)$/,
            next: [
                Twig.logic.type.else_,
                Twig.logic.type.elseif,
                Twig.logic.type.endif
            ],
            open: true,
            compile: function (token) {
                var expression = token.match[1];
                // Compile the expression.
                token.stack = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var output = '',
                    // Parse the expression
                    result = Twig.expression.parse.apply(this, [token.stack, context]);

                // Start a new logic chain
                chain = true;

                if (result) {
                    chain = false;
                    // parse if output
                    output = Twig.parse.apply(this, [token.output, context]);
                }
                return {
                    chain: chain,
                    output: output
                };
            }
        },
        {
            /**
             * Else if type logic tokens.
             *
             *  Format: {% elseif expression %}
             */
            type: Twig.logic.type.elseif,
            regex: /^elseif\s+([^\s].*)$/,
            next: [
                Twig.logic.type.else_,
                Twig.logic.type.elseif,
                Twig.logic.type.endif
            ],
            open: false,
            compile: function (token) {
                var expression = token.match[1];
                // Compile the expression.
                token.stack = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var output = '';

                if (chain && Twig.expression.parse.apply(this, [token.stack, context]) === true) {
                    chain = false;
                    // parse if output
                    output = Twig.parse.apply(this, [token.output, context]);
                }

                return {
                    chain: chain,
                    output: output
                };
            }
        },
        {
            /**
             * Else if type logic tokens.
             *
             *  Format: {% elseif expression %}
             */
            type: Twig.logic.type.else_,
            regex: /^else$/,
            next: [
                Twig.logic.type.endif,
                Twig.logic.type.endfor
            ],
            open: false,
            parse: function (token, context, chain) {
                var output = '';
                if (chain) {
                    output = Twig.parse.apply(this, [token.output, context]);
                }
                return {
                    chain: chain,
                    output: output
                };
            }
        },
        {
            /**
             * End if type logic tokens.
             *
             *  Format: {% endif %}
             */
            type: Twig.logic.type.endif,
            regex: /^endif$/,
            next: [ ],
            open: false
        },
        {
            /**
             * For type logic tokens.
             *
             *  Format: {% for expression %}
             */
            type: Twig.logic.type.for_,
            regex: /^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+([^\s].*?)(?:\s+if\s+([^\s].*))?$/,
            next: [
                Twig.logic.type.else_,
                Twig.logic.type.endfor
            ],
            open: true,
            compile: function (token) {
                var key_value = token.match[1],
                    expression = token.match[2],
                    conditional = token.match[3],
                    kv_split = null;

                token.key_var = null;
                token.value_var = null;

                if (key_value.indexOf(",") >= 0) {
                    kv_split = key_value.split(',');
                    if (kv_split.length === 2) {
                        token.key_var = kv_split[0].trim();
                        token.value_var = kv_split[1].trim();
                    } else {
                        throw new Twig.Error("Invalid expression in for loop: " + key_value);
                    }
                } else {
                    token.value_var = key_value;
                }

                // Valid expressions for a for loop
                //   for item     in expression
                //   for key,item in expression

                // Compile the expression.
                token.expression = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;

                // Compile the conditional (if available)
                if (conditional) {
                    token.conditional = Twig.expression.compile.apply(this, [{
                        type:  Twig.expression.type.expression,
                        value: conditional
                    }]).stack;
                }

                delete token.match;
                return token;
            },
            parse: function (token, context, continue_chain) {
                // Parse expression
                var result = Twig.expression.parse.apply(this, [token.expression, context]),
                    output = [],
                    len,
                    index = 0,
                    keyset,
                    that = this,
                    conditional = token.conditional,
                    buildLoop = function(index, len) {
                        var isConditional = conditional !== undefined;
                        return {
                            index: index+1,
                            index0: index,
                            revindex: isConditional?undefined:len-index,
                            revindex0: isConditional?undefined:len-index-1,
                            first: (index === 0),
                            last: isConditional?undefined:(index === len-1),
                            length: isConditional?undefined:len,
                            parent: context
                        };
                    },
                    // run once for each iteration of the loop
                    loop = function(key, value) {
                        var inner_context = Twig.ChildContext(context);

                        inner_context[token.value_var] = value;

                        if (token.key_var) {
                            inner_context[token.key_var] = key;
                        }

                        // Loop object
                        inner_context.loop = buildLoop(index, len);

                        if (conditional === undefined ||
                            Twig.expression.parse.apply(that, [conditional, inner_context]))
                        {
                            output.push(Twig.parse.apply(that, [token.output, inner_context]));
                            index += 1;
                        }

                        // Delete loop-related variables from the context
                        delete inner_context['loop'];
                        delete inner_context[token.value_var];
                        delete inner_context[token.key_var];

                        // Merge in values that exist in context but have changed
                        // in inner_context.
                        Twig.merge(context, inner_context, true);
                    };


                if (result instanceof Array) {
                    len = result.length;
                    Twig.forEach(result, function (value) {
                        var key = index;

                        loop(key, value);
                    });
                } else if (result instanceof Object) {
                    if (result._keys !== undefined) {
                        keyset = result._keys;
                    } else {
                        keyset = Object.keys(result);
                    }
					len = keyset.length;
                    Twig.forEach(keyset, function(key) {
                        // Ignore the _keys property, it's internal to twig.js
                        if (key === "_keys") return;

                        loop(key,  result[key]);
                    });
                }

                // Only allow else statements if no output was generated
                continue_chain = (output.length === 0);

                return {
                    chain: continue_chain,
                    output: Twig.output.apply(this, [output])
                };
            }
        },
        {
            /**
             * End if type logic tokens.
             *
             *  Format: {% endif %}
             */
            type: Twig.logic.type.endfor,
            regex: /^endfor$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Set type logic tokens.
             *
             *  Format: {% set key = expression %}
             */
            type: Twig.logic.type.set,
            regex: /^set\s+([a-zA-Z0-9_,\s]+)\s*=\s*([\s\S]+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var key = token.match[1].trim(),
                    expression = token.match[2],
                    // Compile the expression.
                    expression_stack  = Twig.expression.compile.apply(this, [{
                        type:  Twig.expression.type.expression,
                        value: expression
                    }]).stack;

                token.key = key;
                token.expression = expression_stack;

                delete token.match;
                return token;
            },
            parse: function (token, context, continue_chain) {
                var value = Twig.expression.parse.apply(this, [token.expression, context]),
                    key = token.key;

                context[key] = value;

                return {
                    chain: continue_chain,
                    context: context
                };
            }
        },
        {
            /**
             * Set capture type logic tokens.
             *
             *  Format: {% set key %}
             */
            type: Twig.logic.type.setcapture,
            regex: /^set\s+([a-zA-Z0-9_,\s]+)$/,
            next: [
                Twig.logic.type.endset
            ],
            open: true,
            compile: function (token) {
                var key = token.match[1].trim();

                token.key = key;

                delete token.match;
                return token;
            },
            parse: function (token, context, continue_chain) {

                var value = Twig.parse.apply(this, [token.output, context]),
                    key = token.key;

                // set on both the global and local context
                this.context[key] = value;
                context[key] = value;

                return {
                    chain: continue_chain,
                    context: context
                };
            }
        },
        {
            /**
             * End set type block logic tokens.
             *
             *  Format: {% endset %}
             */
            type: Twig.logic.type.endset,
            regex: /^endset$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Filter logic tokens.
             *
             *  Format: {% filter upper %} or {% filter lower|escape %}
             */
            type: Twig.logic.type.filter,
            regex: /^filter\s+(.+)$/,
            next: [
                Twig.logic.type.endfilter
            ],
            open: true,
            compile: function (token) {
                var expression = "|" + token.match[1].trim();
                // Compile the expression.
                token.stack = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var unfiltered = Twig.parse.apply(this, [token.output, context]),
                    stack = [{
                        type: Twig.expression.type.string,
                        value: unfiltered
                    }].concat(token.stack);

                var output = Twig.expression.parse.apply(this, [stack, context]);

                return {
                    chain: chain,
                    output: output
                };
            }
        },
        {
            /**
             * End filter logic tokens.
             *
             *  Format: {% endfilter %}
             */
            type: Twig.logic.type.endfilter,
            regex: /^endfilter$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% block title %}
             */
            type: Twig.logic.type.block,
            regex: /^block\s+([a-zA-Z0-9_]+)$/,
            next: [
                Twig.logic.type.endblock
            ],
            open: true,
            compile: function (token) {
                token.block = token.match[1].trim();
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var block_output = "",
                    output = "",
                    isImported = this.importedBlocks.indexOf(token.block) > -1,
                    hasParent = this.blocks[token.block] && this.blocks[token.block].indexOf(Twig.placeholders.parent) > -1;

                // Don't override previous blocks unless they're imported with "use"
                // Loops should be exempted as well.
                if (this.blocks[token.block] === undefined || isImported || hasParent || context.loop) {
                    block_output = Twig.expression.parse.apply(this, [{
                        type: Twig.expression.type.string,
                        value: Twig.parse.apply(this, [token.output, context])
                    }, context]);

                    if (isImported) {
                        // once the block is overridden, remove it from the list of imported blocks
                        this.importedBlocks.splice(this.importedBlocks.indexOf(token.block), 1);
                    }

                    if (hasParent) {
                        this.blocks[token.block] = Twig.Markup(this.blocks[token.block].replace(Twig.placeholders.parent, block_output));
                    } else {
                        this.blocks[token.block] = block_output;
                    }
                }

                // Check if a child block has been set from a template extending this one.
                if (this.child.blocks[token.block]) {
                    output = this.child.blocks[token.block];
                } else {
                    output = this.blocks[token.block];
                }

                return {
                    chain: chain,
                    output: output
                };
            }
        },
        {
            /**
             * End block logic tokens.
             *
             *  Format: {% endblock %}
             */
            type: Twig.logic.type.endblock,
            regex: /^endblock(?:\s+([a-zA-Z0-9_]+))?$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% extends "template.twig" %}
             */
            type: Twig.logic.type.extends_,
            regex: /^extends\s+(.+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var expression = token.match[1].trim();
                delete token.match;

                token.stack   = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;

                return token;
            },
            parse: function (token, context, chain) {
                // Resolve filename
                var file = Twig.expression.parse.apply(this, [token.stack, context]);

                // Set parent template
                this.extend = file;

                return {
                    chain: chain,
                    output: ''
                };
            }
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% use "template.twig" %}
             */
            type: Twig.logic.type.use,
            regex: /^use\s+(.+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var expression = token.match[1].trim();
                delete token.match;

                token.stack = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;

                return token;
            },
            parse: function (token, context, chain) {
                // Resolve filename
                var file = Twig.expression.parse.apply(this, [token.stack, context]);

                // Import blocks
                this.importBlocks(file);

                return {
                    chain: chain,
                    output: ''
                };
            }
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% includes "template.twig" [with {some: 'values'} only] %}
             */
            type: Twig.logic.type.include,
            regex: /^include\s+(ignore missing\s+)?(.+?)\s*(?:with\s+([\S\s]+?))?\s*(only)?$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var match = token.match,
                    includeMissing = match[1] !== undefined,
                    expression = match[2].trim(),
                    withContext = match[3],
                    only = ((match[4] !== undefined) && match[4].length);

                delete token.match;

                token.only = only;
                token.includeMissing = includeMissing;

                token.stack = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;

                if (withContext !== undefined) {
                    token.withStack = Twig.expression.compile.apply(this, [{
                        type:  Twig.expression.type.expression,
                        value: withContext.trim()
                    }]).stack;
                }

                return token;
            },
            parse: function (token, context, chain) {
                // Resolve filename
                var innerContext = {},
                    withContext,
                    i,
                    template;

                if (!token.only) {
                    innerContext = Twig.ChildContext(context);
                }

                if (token.withStack !== undefined) {
                    withContext = Twig.expression.parse.apply(this, [token.withStack, context]);

                    for (i in withContext) {
                        if (withContext.hasOwnProperty(i))
                            innerContext[i] = withContext[i];
                    }
                }

                var file = Twig.expression.parse.apply(this, [token.stack, innerContext]);

                if (file instanceof Twig.Template) {
                    template = file;
                } else {
                    // Import file
                    template = this.importFile(file);
                }

                return {
                    chain: chain,
                    output: template.render(innerContext)
                };
            }
        },
        {
            type: Twig.logic.type.spaceless,
            regex: /^spaceless$/,
            next: [
                Twig.logic.type.endspaceless
            ],
            open: true,

            // Parse the html and return it without any spaces between tags
            parse: function (token, context, chain) {
                var // Parse the output without any filter
                    unfiltered = Twig.parse.apply(this, [token.output, context]),
                    // A regular expression to find closing and opening tags with spaces between them
                    rBetweenTagSpaces = />\s+</g,
                    // Replace all space between closing and opening html tags
                    output = unfiltered.replace(rBetweenTagSpaces,'><').trim();

                return {
                    chain: chain,
                    output: output
                };
            }
        },

        // Add the {% endspaceless %} token
        {
            type: Twig.logic.type.endspaceless,
            regex: /^endspaceless$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Macro logic tokens.
             *
             * Format: {% maro input(name, value, type, size) %}
             *
             */
            type: Twig.logic.type.macro,
            regex: /^macro\s+([a-zA-Z0-9_]+)\s*\(\s*((?:[a-zA-Z0-9_]+(?:,\s*)?)*)\s*\)$/,
            next: [
                Twig.logic.type.endmacro
            ],
            open: true,
            compile: function (token) {
                var macroName = token.match[1],
                    parameters = token.match[2].split(/[\s,]+/);

                //TODO: Clean up duplicate check
                for (var i=0; i<parameters.length; i++) {
                    for (var j=0; j<parameters.length; j++){
                        if (parameters[i] === parameters[j] && i !== j) {
                            throw new Twig.Error("Duplicate arguments for parameter: "+ parameters[i]);
                        }
                    }
                }

                token.macroName = macroName;
                token.parameters = parameters;

                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var template = this;
                this.macros[token.macroName] = function() {
                    // Pass global context and other macros
                    var macroContext = {
                        _self: template.macros
                    }
                    // Add parameters from context to macroContext
                    for (var i=0; i<token.parameters.length; i++) {
                        var prop = token.parameters[i];
                        if(typeof arguments[i] !== 'undefined') {
                            macroContext[prop] = arguments[i];
                        } else {
                            macroContext[prop] = undefined;
                        }
                    }
                    // Render
                    return Twig.parse.apply(template, [token.output, macroContext])
                };

                return {
                    chain: chain,
                    output: ''
                };

            }
        },
        {
            /**
             * End macro logic tokens.
             *
             * Format: {% endmacro %}
             */
             type: Twig.logic.type.endmacro,
             regex: /^endmacro$/,
             next: [ ],
             open: false
        },
        {
            /*
            * import logic tokens.
            *
            * Format: {% import "template.twig" as form %}
            */
            type: Twig.logic.type.import_,
            regex: /^import\s+(.+)\s+as\s+([a-zA-Z0-9_]+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var expression = token.match[1].trim(),
                    contextName = token.match[2].trim();
                delete token.match;

                token.expression = expression;
                token.contextName = contextName;

                token.stack = Twig.expression.compile.apply(this, [{
                    type: Twig.expression.type.expression,
                    value: expression
                }]).stack;

                return token;
            },
            parse: function (token, context, chain) {
                if (token.expression !== "_self") {
                    var file = Twig.expression.parse.apply(this, [token.stack, context]);
                    var template = this.importFile(file || token.expression);
                    context[token.contextName] = template.render({}, {output: 'macros'});
                }
                else {
                    context[token.contextName] = this.macros;
                }

                return {
                    chain: chain,
                    output: ''
                }

            }
        },
        {
            /*
            * from logic tokens.
            *
            * Format: {% from "template.twig" import func as form %}
            */
            type: Twig.logic.type.from,
            regex: /^from\s+(.+)\s+import\s+([a-zA-Z0-9_, ]+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var expression = token.match[1].trim(),
                    macroExpressions = token.match[2].trim().split(/[ ,]+/),
                    macroNames = {};

                for (var i=0; i<macroExpressions.length; i++) {
                    var res = macroExpressions[i];

                    // match function as variable
                    var macroMatch = res.match(/^([a-zA-Z0-9_]+)\s+(.+)\s+as\s+([a-zA-Z0-9_]+)$/);
                    if (macroMatch) {
                        macroNames[macroMatch[1].trim()] = macroMatch[2].trim();
                    }
                    else if (res.match(/^([a-zA-Z0-9_]+)$/)) {
                        macroNames[res] = res;
                    }
                    else {
                        // ignore import
                    }

                }

                delete token.match;

                token.expression = expression;
                token.macroNames = macroNames;

                token.stack = Twig.expression.compile.apply(this, [{
                    type: Twig.expression.type.expression,
                    value: expression
                }]).stack;

                return token;
            },
            parse: function (token, context, chain) {
                var macros;

                if (token.expression !== "_self") {
                    var file = Twig.expression.parse.apply(this, [token.stack, context]);
                    var template = this.importFile(file || token.expression);
                    macros = template.render({}, {output: 'macros'});
                }
                else {
                    macros = this.macros;
                }

                for (var macroName in token.macroNames) {
                    if (macros.hasOwnProperty(macroName)) {
                        context[token.macroNames[macroName]] = macros[macroName];
                    }
                }

                return {
                    chain: chain,
                    output: ''
                }

            }
        },
        {
            /**
             * The embed tag combines the behaviour of include and extends.
             * It allows you to include another template's contents, just like include does.
             *
             *  Format: {% embed "template.twig" [with {some: 'values'} only] %}
             */
            type: Twig.logic.type.embed,
            regex: /^embed\s+(ignore missing\s+)?(.+?)\s*(?:with\s+(.+?))?\s*(only)?$/,
            next: [
                Twig.logic.type.endembed
            ],
            open: true,
            compile: function (token) {
                var match = token.match,
                    includeMissing = match[1] !== undefined,
                    expression = match[2].trim(),
                    withContext = match[3],
                    only = ((match[4] !== undefined) && match[4].length);

                delete token.match;

                token.only = only;
                token.includeMissing = includeMissing;

                token.stack = Twig.expression.compile.apply(this, [{
                    type:  Twig.expression.type.expression,
                    value: expression
                }]).stack;

                if (withContext !== undefined) {
                    token.withStack = Twig.expression.compile.apply(this, [{
                        type:  Twig.expression.type.expression,
                        value: withContext.trim()
                    }]).stack;
                }

                return token;
            },
            parse: function (token, context, chain) {
                // Resolve filename
                var innerContext = {},
                    withContext,
                    i,
                    template;

                if (!token.only) {
                    for (i in context) {
                        if (context.hasOwnProperty(i))
                            innerContext[i] = context[i];
                    }
                }

                if (token.withStack !== undefined) {
                    withContext = Twig.expression.parse.apply(this, [token.withStack, context]);

                    for (i in withContext) {
                        if (withContext.hasOwnProperty(i))
                            innerContext[i] = withContext[i];
                    }
                }

                var file = Twig.expression.parse.apply(this, [token.stack, innerContext]);

                if (file instanceof Twig.Template) {
                    template = file;
                } else {
                    // Import file
                    template = this.importFile(file);
                }

                // reset previous blocks
                this.blocks = {};

                // parse tokens. output will be not used
                var output = Twig.parse.apply(this, [token.output, innerContext]);

                // render tempalte with blocks defined in embed block
                return {
                    chain: chain,
                    output: template.render(innerContext, {'blocks':this.blocks})
                };
            }
        },
        /* Add the {% endembed %} token
         *
         */
        {
            type: Twig.logic.type.endembed,
            regex: /^endembed$/,
            next: [ ],
            open: false
        }

    ];


    /**
     * Registry for logic handlers.
     */
    Twig.logic.handler = {};

    /**
     * Define a new token type, available at Twig.logic.type.{type}
     */
    Twig.logic.extendType = function (type, value) {
        value = value || ("Twig.logic.type" + type);
        Twig.logic.type[type] = value;
    };

    /**
     * Extend the logic parsing functionality with a new token definition.
     *
     * // Define a new tag
     * Twig.logic.extend({
     *     type: Twig.logic.type.{type},
     *     // The pattern to match for this token
     *     regex: ...,
     *     // What token types can follow this token, leave blank if any.
     *     next: [ ... ]
     *     // Create and return compiled version of the token
     *     compile: function(token) { ... }
     *     // Parse the compiled token with the context provided by the render call
     *     //   and whether this token chain is complete.
     *     parse: function(token, context, chain) { ... }
     * });
     *
     * @param {Object} definition The new logic expression.
     */
    Twig.logic.extend = function (definition) {

        if (!definition.type) {
            throw new Twig.Error("Unable to extend logic definition. No type provided for " + definition);
        }
        if (Twig.logic.type[definition.type]) {
            throw new Twig.Error("Unable to extend logic definitions. Type " +
                                 definition.type + " is already defined.");
        } else {
            Twig.logic.extendType(definition.type);
        }
        Twig.logic.handler[definition.type] = definition;
    };

    // Extend with built-in expressions
    while (Twig.logic.definitions.length > 0) {
        Twig.logic.extend(Twig.logic.definitions.shift());
    }

    /**
     * Compile a logic token into an object ready for parsing.
     *
     * @param {Object} raw_token An uncompiled logic token.
     *
     * @return {Object} A compiled logic token, ready for parsing.
     */
    Twig.logic.compile = function (raw_token) {
        var expression = raw_token.value.trim(),
            token = Twig.logic.tokenize.apply(this, [expression]),
            token_template = Twig.logic.handler[token.type];

        // Check if the token needs compiling
        if (token_template.compile) {
            token = token_template.compile.apply(this, [token]);
            Twig.log.trace("Twig.logic.compile: ", "Compiled logic token to ", token);
        }

        return token;
    };

    /**
     * Tokenize logic expressions. This function matches token expressions against regular
     * expressions provided in token definitions provided with Twig.logic.extend.
     *
     * @param {string} expression the logic token expression to tokenize
     *                (i.e. what's between {% and %})
     *
     * @return {Object} The matched token with type set to the token type and match to the regex match.
     */
    Twig.logic.tokenize = function (expression) {
        var token = {},
            token_template_type = null,
            token_type = null,
            token_regex = null,
            regex_array = null,
            regex = null,
            match = null;

        // Ignore whitespace around expressions.
        expression = expression.trim();

        for (token_template_type in Twig.logic.handler) {
            if (Twig.logic.handler.hasOwnProperty(token_template_type)) {
                // Get the type and regex for this template type
                token_type = Twig.logic.handler[token_template_type].type;
                token_regex = Twig.logic.handler[token_template_type].regex;

                // Handle multiple regular expressions per type.
                regex_array = [];
                if (token_regex instanceof Array) {
                    regex_array = token_regex;
                } else {
                    regex_array.push(token_regex);
                }

                // Check regular expressions in the order they were specified in the definition.
                while (regex_array.length > 0) {
                    regex = regex_array.shift();
                    match = regex.exec(expression.trim());
                    if (match !== null) {
                        token.type  = token_type;
                        token.match = match;
                        Twig.log.trace("Twig.logic.tokenize: ", "Matched a ", token_type, " regular expression of ", match);
                        return token;
                    }
                }
            }
        }

        // No regex matches
        throw new Twig.Error("Unable to parse '" + expression.trim() + "'");
    };

    /**
     * Parse a logic token within a given context.
     *
     * What are logic chains?
     *      Logic chains represent a series of tokens that are connected,
     *          for example:
     *          {% if ... %} {% else %} {% endif %}
     *
     *      The chain parameter is used to signify if a chain is open of closed.
     *      open:
     *          More tokens in this chain should be parsed.
     *      closed:
     *          This token chain has completed parsing and any additional
     *          tokens (else, elseif, etc...) should be ignored.
     *
     * @param {Object} token The compiled token.
     * @param {Object} context The render context.
     * @param {boolean} chain Is this an open logic chain. If false, that means a
     *                        chain is closed and no further cases should be parsed.
     */
    Twig.logic.parse = function (token, context, chain) {
        var output = '',
            token_template;

        context = context || { };

        Twig.log.debug("Twig.logic.parse: ", "Parsing logic token ", token);

        token_template = Twig.logic.handler[token.type];

        if (token_template.parse) {
            output = token_template.parse.apply(this, [token, context, chain]);
        }
        return output;
    };

    return Twig;

})(Twig || { });
//     Twig.js
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.expression.js
//
// This file handles tokenizing, compiling and parsing expressions.
var Twig = (function (Twig) {
    "use strict";

    /**
     * Namespace for expression handling.
     */
    Twig.expression = { };

    /**
     * Reserved word that can't be used as variable names.
     */
    Twig.expression.reservedWords = [
        "true", "false", "null", "TRUE", "FALSE", "NULL", "_context"
    ];

    /**
     * The type of tokens used in expressions.
     */
    Twig.expression.type = {
        comma:      'Twig.expression.type.comma',
        operator: {
            unary:  'Twig.expression.type.operator.unary',
            binary: 'Twig.expression.type.operator.binary'
        },
        string:     'Twig.expression.type.string',
        bool:       'Twig.expression.type.bool',
        array: {
            start:  'Twig.expression.type.array.start',
            end:    'Twig.expression.type.array.end'
        },
        object: {
            start:  'Twig.expression.type.object.start',
            end:    'Twig.expression.type.object.end'
        },
        parameter: {
            start:  'Twig.expression.type.parameter.start',
            end:    'Twig.expression.type.parameter.end'
        },
        key: {
            period:   'Twig.expression.type.key.period',
            brackets: 'Twig.expression.type.key.brackets'
        },
        filter:     'Twig.expression.type.filter',
        _function:  'Twig.expression.type._function',
        variable:   'Twig.expression.type.variable',
        number:     'Twig.expression.type.number',
        _null:     'Twig.expression.type.null',
        context:    'Twig.expression.type.context',
        test:       'Twig.expression.type.test'
    };

    Twig.expression.set = {
        // What can follow an expression (in general)
        operations: [
            Twig.expression.type.filter,
            Twig.expression.type.operator.unary,
            Twig.expression.type.operator.binary,
            Twig.expression.type.array.end,
            Twig.expression.type.object.end,
            Twig.expression.type.parameter.end,
            Twig.expression.type.comma,
            Twig.expression.type.test
        ],
        expressions: [
            Twig.expression.type._function,
            Twig.expression.type.bool,
            Twig.expression.type.string,
            Twig.expression.type.variable,
            Twig.expression.type.number,
            Twig.expression.type._null,
            Twig.expression.type.context,
            Twig.expression.type.parameter.start,
            Twig.expression.type.array.start,
            Twig.expression.type.object.start
        ]
    };

    // Most expressions allow a '.' or '[' after them, so we provide a convenience set
    Twig.expression.set.operations_extended = Twig.expression.set.operations.concat([
                    Twig.expression.type.key.period,
                    Twig.expression.type.key.brackets]);

    // Some commonly used compile and parse functions.
    Twig.expression.fn = {
        compile: {
            push: function(token, stack, output) {
                output.push(token);
            },
            push_both: function(token, stack, output) {
                output.push(token);
                stack.push(token);
            }
        },
        parse: {
            push: function(token, stack, context) {
                stack.push(token);
            },
            push_value: function(token, stack, context) {
                stack.push(token.value);
            }
        }
    };

    // The regular expressions and compile/parse logic used to match tokens in expressions.
    //
    // Properties:
    //
    //      type:  The type of expression this matches
    //
    //      regex: One or more regular expressions that matche the format of the token.
    //
    //      next:  Valid tokens that can occur next in the expression.
    //
    // Functions:
    //
    //      compile: A function that compiles the raw regular expression match into a token.
    //
    //      parse:   A function that parses the compiled token into output.
    //
    Twig.expression.definitions = [
        {
            type: Twig.expression.type.test,
            regex: /^is\s+(not)?\s*([a-zA-Z_][a-zA-Z0-9_]*)/,
            next: Twig.expression.set.operations.concat([Twig.expression.type.parameter.start]),
            compile: function(token, stack, output) {
                token.filter   = token.match[2];
                token.modifier = token.match[1];
                delete token.match;
                delete token.value;
                output.push(token);
            },
            parse: function(token, stack, context) {
                var value = stack.pop(),
                    params = token.params && Twig.expression.parse.apply(this, [token.params, context]),
                    result = Twig.test(token.filter, value, params);

                if (token.modifier == 'not') {
                    stack.push(!result);
                } else {
                    stack.push(result);
                }
            }
        },
        {
            type: Twig.expression.type.comma,
            // Match a comma
            regex: /^,/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.array.end, Twig.expression.type.object.end]),
            compile: function(token, stack, output) {
                var i = stack.length - 1,
                    stack_token;

                delete token.match;
                delete token.value;

                // pop tokens off the stack until the start of the object
                for(;i >= 0; i--) {
                    stack_token = stack.pop();
                    if (stack_token.type === Twig.expression.type.object.start
                            || stack_token.type === Twig.expression.type.parameter.start
                            || stack_token.type === Twig.expression.type.array.start) {
                        stack.push(stack_token);
                        break;
                    }
                    output.push(stack_token);
                }
                output.push(token);
            }
        },
        {
            type: Twig.expression.type.operator.binary,
            // Match any of +, *, /, -, %, ~, <, <=, >, >=, !=, ==, **, ?, :, and, or, not
            regex: /(^[\+\-~%\?\:]|^[!=]==?|^[!<>]=?|^\*\*?|^\/\/?|^and\s+|^or\s+|^in\s+|^not in\s+|^\.\.)/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.operator.unary]),
            compile: function(token, stack, output) {
                delete token.match;

                token.value = token.value.trim();
                var value = token.value,
                    operator = Twig.expression.operator.lookup(value, token);

                Twig.log.trace("Twig.expression.compile: ", "Operator: ", operator, " from ", value);

                while (stack.length > 0 &&
                       (stack[stack.length-1].type == Twig.expression.type.operator.unary || stack[stack.length-1].type == Twig.expression.type.operator.binary) &&
                            (
                                (operator.associativity === Twig.expression.operator.leftToRight &&
                                 operator.precidence    >= stack[stack.length-1].precidence) ||

                                (operator.associativity === Twig.expression.operator.rightToLeft &&
                                 operator.precidence    >  stack[stack.length-1].precidence)
                            )
                       ) {
                     var temp = stack.pop();
                     output.push(temp);
                }

                if (value === ":") {
                    // Check if this is a ternary or object key being set
                    if (stack[stack.length - 1] && stack[stack.length-1].value === "?") {
                        // Continue as normal for a ternary
                    } else {
                        // This is not a ternary so we push the token to the output where it can be handled
                        //   when the assocated object is closed.
                        var key_token = output.pop();

                        if (key_token.type === Twig.expression.type.string ||
                                key_token.type === Twig.expression.type.variable ||
                                key_token.type === Twig.expression.type.number) {
                            token.key = key_token.value;

                        } else {
                            throw new Twig.Error("Unexpected value before ':' of " + key_token.type + " = " + key_token.value);
                        }

                        output.push(token);
                        return;
                    }
                } else {
                    stack.push(operator);
                }
            },
            parse: function(token, stack, context) {
                if (token.key) {
                    // handle ternary ':' operator
                    stack.push(token);
                } else {
                    Twig.expression.operator.parse(token.value, stack);
                }
            }
        },
        {
            type: Twig.expression.type.operator.unary,
            // Match any of not
            regex: /(^not\s+)/,
            next: Twig.expression.set.expressions,
            compile: function(token, stack, output) {
                delete token.match;

                token.value = token.value.trim();
                var value = token.value,
                    operator = Twig.expression.operator.lookup(value, token);

                Twig.log.trace("Twig.expression.compile: ", "Operator: ", operator, " from ", value);

                while (stack.length > 0 &&
                       (stack[stack.length-1].type == Twig.expression.type.operator.unary || stack[stack.length-1].type == Twig.expression.type.operator.binary) &&
                            (
                                (operator.associativity === Twig.expression.operator.leftToRight &&
                                 operator.precidence    >= stack[stack.length-1].precidence) ||

                                (operator.associativity === Twig.expression.operator.rightToLeft &&
                                 operator.precidence    >  stack[stack.length-1].precidence)
                            )
                       ) {
                     var temp = stack.pop();
                     output.push(temp);
                }

                stack.push(operator);
            },
            parse: function(token, stack, context) {
                Twig.expression.operator.parse(token.value, stack);
            }
        },
        {
            /**
             * Match a string. This is anything between a pair of single or double quotes.
             */
            type: Twig.expression.type.string,
            // See: http://blog.stevenlevithan.com/archives/match-quoted-string
            regex: /^(["'])(?:(?=(\\?))\2[\s\S])*?\1/,
            next: Twig.expression.set.operations,
            compile: function(token, stack, output) {
                var value = token.value;
                delete token.match

                // Remove the quotes from the string
                if (value.substring(0, 1) === '"') {
                    value = value.replace('\\"', '"');
                } else {
                    value = value.replace("\\'", "'");
                }
                token.value = value.substring(1, value.length-1).replace( /\\n/g, "\n" ).replace( /\\r/g, "\r" );
                Twig.log.trace("Twig.expression.compile: ", "String value: ", token.value);
                output.push(token);
            },
            parse: Twig.expression.fn.parse.push_value
        },
        {
            /**
             * Match a parameter set start.
             */
            type: Twig.expression.type.parameter.start,
            regex: /^\(/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.parameter.end]),
            compile: Twig.expression.fn.compile.push_both,
            parse: Twig.expression.fn.parse.push
        },
        {
            /**
             * Match a parameter set end.
             */
            type: Twig.expression.type.parameter.end,
            regex: /^\)/,
            next: Twig.expression.set.operations_extended,
            compile: function(token, stack, output) {
                var stack_token,
                    end_token = token;

                stack_token = stack.pop();
                while(stack.length > 0 && stack_token.type != Twig.expression.type.parameter.start) {
                    output.push(stack_token);
                    stack_token = stack.pop();
                }

                // Move contents of parens into preceding filter
                var param_stack = [];
                while(token.type !== Twig.expression.type.parameter.start) {
                    // Add token to arguments stack
                    param_stack.unshift(token);
                    token = output.pop();
                }
                param_stack.unshift(token);

                var is_expression = false;

                // Get the token preceding the parameters
                token = output[output.length-1];

                if (token === undefined ||
                    (token.type !== Twig.expression.type._function &&
                    token.type !== Twig.expression.type.filter &&
                    token.type !== Twig.expression.type.test &&
                    token.type !== Twig.expression.type.key.brackets &&
                    token.type !== Twig.expression.type.key.period)) {

                    end_token.expression = true;

                    // remove start and end token from stack
                    param_stack.pop();
                    param_stack.shift();

                    end_token.params = param_stack;

                    output.push(end_token);

                } else {
                    end_token.expression = false;
                    token.params = param_stack;
                }
            },
            parse: function(token, stack, context) {
                var new_array = [],
                    array_ended = false,
                    value = null;

                if (token.expression) {
                    value = Twig.expression.parse.apply(this, [token.params, context])
                    stack.push(value);

                } else {

                    while (stack.length > 0) {
                        value = stack.pop();
                        // Push values into the array until the start of the array
                        if (value && value.type && value.type == Twig.expression.type.parameter.start) {
                            array_ended = true;
                            break;
                        }
                        new_array.unshift(value);
                    }

                    if (!array_ended) {
                        throw new Twig.Error("Expected end of parameter set.");
                    }

                    stack.push(new_array);
                }
            }
        },
        {
            /**
             * Match an array start.
             */
            type: Twig.expression.type.array.start,
            regex: /^\[/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.array.end]),
            compile: Twig.expression.fn.compile.push_both,
            parse: Twig.expression.fn.parse.push
        },
        {
            /**
             * Match an array end.
             */
            type: Twig.expression.type.array.end,
            regex: /^\]/,
            next: Twig.expression.set.operations_extended,
            compile: function(token, stack, output) {
                var i = stack.length - 1,
                    stack_token;
                // pop tokens off the stack until the start of the object
                for(;i >= 0; i--) {
                    stack_token = stack.pop();
                    if (stack_token.type === Twig.expression.type.array.start) {
                        break;
                    }
                    output.push(stack_token);
                }
                output.push(token);
            },
            parse: function(token, stack, context) {
                var new_array = [],
                    array_ended = false,
                    value = null;

                while (stack.length > 0) {
                    value = stack.pop();
                    // Push values into the array until the start of the array
                    if (value.type && value.type == Twig.expression.type.array.start) {
                        array_ended = true;
                        break;
                    }
                    new_array.unshift(value);
                }
                if (!array_ended) {
                    throw new Twig.Error("Expected end of array.");
                }

                stack.push(new_array);
            }
        },
        // Token that represents the start of a hash map '}'
        //
        // Hash maps take the form:
        //    { "key": 'value', "another_key": item }
        //
        // Keys must be quoted (either single or double) and values can be any expression.
        {
            type: Twig.expression.type.object.start,
            regex: /^\{/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.object.end]),
            compile: Twig.expression.fn.compile.push_both,
            parse: Twig.expression.fn.parse.push
        },

        // Token that represents the end of a Hash Map '}'
        //
        // This is where the logic for building the internal
        // representation of a hash map is defined.
        {
            type: Twig.expression.type.object.end,
            regex: /^\}/,
            next: Twig.expression.set.operations_extended,
            compile: function(token, stack, output) {
                var i = stack.length-1,
                    stack_token;

                // pop tokens off the stack until the start of the object
                for(;i >= 0; i--) {
                    stack_token = stack.pop();
                    if (stack_token && stack_token.type === Twig.expression.type.object.start) {
                        break;
                    }
                    output.push(stack_token);
                }
                output.push(token);
            },
            parse: function(end_token, stack, context) {
                var new_object = {},
                    object_ended = false,
                    token = null,
                    token_key = null,
                    has_value = false,
                    value = null;

                while (stack.length > 0) {
                    token = stack.pop();
                    // Push values into the array until the start of the object
                    if (token && token.type && token.type === Twig.expression.type.object.start) {
                        object_ended = true;
                        break;
                    }
                    if (token && token.type && (token.type === Twig.expression.type.operator.binary || token.type === Twig.expression.type.operator.unary) && token.key) {
                        if (!has_value) {
                            throw new Twig.Error("Missing value for key '" + token.key + "' in object definition.");
                        }
                        new_object[token.key] = value;

                        // Preserve the order that elements are added to the map
                        // This is necessary since JavaScript objects don't
                        // guarantee the order of keys
                        if (new_object._keys === undefined) new_object._keys = [];
                        new_object._keys.unshift(token.key);

                        // reset value check
                        value = null;
                        has_value = false;

                    } else {
                        has_value = true;
                        value = token;
                    }
                }
                if (!object_ended) {
                    throw new Twig.Error("Unexpected end of object.");
                }

                stack.push(new_object);
            }
        },

        // Token representing a filter
        //
        // Filters can follow any expression and take the form:
        //    expression|filter(optional, args)
        //
        // Filter parsing is done in the Twig.filters namespace.
        {
            type: Twig.expression.type.filter,
            // match a | then a letter or _, then any number of letters, numbers, _ or -
            regex: /^\|\s?([a-zA-Z_][a-zA-Z0-9_\-]*)/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: function(token, stack, output) {
                token.value = token.match[1];
                output.push(token);
            },
            parse: function(token, stack, context) {
                var input = stack.pop(),
                    params = token.params && Twig.expression.parse.apply(this, [token.params, context]);

                stack.push(Twig.filter.apply(this, [token.value, input, params]));
            }
        },
        {
            type: Twig.expression.type._function,
            // match any letter or _, then any number of letters, numbers, _ or - followed by (
            regex: /^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/,
            next: Twig.expression.type.parameter.start,
            transform: function(match, tokens) {
                return '(';
            },
            compile: function(token, stack, output) {
                var fn = token.match[1];
                token.fn = fn;
                // cleanup token
                delete token.match;
                delete token.value;

                output.push(token);
            },
            parse: function(token, stack, context) {
                var params = token.params && Twig.expression.parse.apply(this, [token.params, context]),
                    fn     = token.fn,
                    value;

                if (Twig.functions[fn]) {
                    // Get the function from the built-in functions
                    value = Twig.functions[fn].apply(this, params);

                } else if (typeof context[fn] == 'function') {
                    // Get the function from the user/context defined functions
                    value = context[fn].apply(context, params);

                } else {
                    throw new Twig.Error(fn + ' function does not exist and is not defined in the context');
                }

                stack.push(value);
            }
        },

        // Token representing a variable.
        //
        // Variables can contain letters, numbers, underscores and
        // dashes, but must start with a letter or underscore.
        //
        // Variables are retrieved from the render context and take
        // the value of 'undefined' if the given variable doesn't
        // exist in the context.
        {
            type: Twig.expression.type.variable,
            // match any letter or _, then any number of letters, numbers, _ or -
            regex: /^[a-zA-Z_][a-zA-Z0-9_]*/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: Twig.expression.fn.compile.push,
            validate: function(match, tokens) {
                return (Twig.indexOf(Twig.expression.reservedWords, match[0]) < 0);
            },
            parse: function(token, stack, context) {
                // Get the variable from the context
                var value = Twig.expression.resolve(context[token.value], context);
                stack.push(value);
            }
        },
        {
            type: Twig.expression.type.key.period,
            regex: /^\.([a-zA-Z0-9_]+)/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: function(token, stack, output) {
                token.key = token.match[1];
                delete token.match;
                delete token.value;

                output.push(token);
            },
            parse: function(token, stack, context) {
                var params = token.params && Twig.expression.parse.apply(this, [token.params, context]),
                    key = token.key,
                    object = stack.pop(),
                    value;

                if (object === null || object === undefined) {
                    if (this.options.strict_variables) {
                        throw new Twig.Error("Can't access a key " + key + " on an null or undefined object.");
                    } else {
                        return null;
                    }
                }

                var capitalize = function(value) {return value.substr(0, 1).toUpperCase() + value.substr(1);};

                // Get the variable from the context
                if (typeof object === 'object' && key in object) {
                    value = object[key];
                } else if (object["get"+capitalize(key)] !== undefined) {
                    value = object["get"+capitalize(key)];
                } else if (object["is"+capitalize(key)] !== undefined) {
                    value = object["is"+capitalize(key)];
                } else {
                    value = null;
                }
                stack.push(Twig.expression.resolve(value, object, params));
            }
        },
        {
            type: Twig.expression.type.key.brackets,
            regex: /^\[([^\]]*)\]/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: function(token, stack, output) {
                var match = token.match[1];
                delete token.value;
                delete token.match;

                // The expression stack for the key
                token.stack = Twig.expression.compile({
                    value: match
                }).stack;

                output.push(token);
            },
            parse: function(token, stack, context) {
                // Evaluate key
                var params = token.params && Twig.expression.parse.apply(this, [token.params, context]),
                    key = Twig.expression.parse.apply(this, [token.stack, context]),
                    object = stack.pop(),
                    value;

                if (object === null || object === undefined) {
                    if (this.options.strict_variables) {
                        throw new Twig.Error("Can't access a key " + key + " on an null or undefined object.");
                    } else {
                        return null;
                    }
                }

                // Get the variable from the context
                if (typeof object === 'object' && key in object) {
                    value = object[key];
                } else {
                    value = null;
                }
                stack.push(Twig.expression.resolve(value, object, params));
            }
        },
        {
            /**
             * Match a null value.
             */
            type: Twig.expression.type._null,
            // match a number
            regex: /^(null|NULL|none|NONE)/,
            next: Twig.expression.set.operations,
            compile: function(token, stack, output) {
                delete token.match;
                token.value = null;
                output.push(token);
            },
            parse: Twig.expression.fn.parse.push_value
        },
        {
            /**
             * Match the context
             */
            type: Twig.expression.type.context,
            regex: /^_context/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: Twig.expression.fn.compile.push,
            parse: function(token, stack, context) {
                stack.push(context);
            }
        },
        {
            /**
             * Match a number (integer or decimal)
             */
            type: Twig.expression.type.number,
            // match a number
            regex: /^\-?\d+(\.\d+)?/,
            next: Twig.expression.set.operations,
            compile: function(token, stack, output) {
                token.value = Number(token.value);
                output.push(token);
            },
            parse: Twig.expression.fn.parse.push_value
        },
        {
            /**
             * Match a boolean
             */
            type: Twig.expression.type.bool,
            regex: /^(true|TRUE|false|FALSE)/,
            next: Twig.expression.set.operations,
            compile: function(token, stack, output) {
                token.value = (token.match[0].toLowerCase( ) === "true");
                delete token.match;
                output.push(token);
            },
            parse: Twig.expression.fn.parse.push_value
        }
    ];

    /**
     * Resolve a context value.
     *
     * If the value is a function, it is executed with a context parameter.
     *
     * @param {string} key The context object key.
     * @param {Object} context The render context.
     */
    Twig.expression.resolve = function(value, context, params) {
        if (typeof value == 'function') {
            return value.apply(context, params || []);
        } else {
            return value;
        }
    };

    /**
     * Registry for logic handlers.
     */
    Twig.expression.handler = {};

    /**
     * Define a new expression type, available at Twig.logic.type.{type}
     *
     * @param {string} type The name of the new type.
     */
    Twig.expression.extendType = function (type) {
        Twig.expression.type[type] = "Twig.expression.type." + type;
    };

    /**
     * Extend the expression parsing functionality with a new definition.
     *
     * Token definitions follow this format:
     *  {
     *      type:     One of Twig.expression.type.[type], either pre-defined or added using
     *                    Twig.expression.extendType
     *
     *      next:     Array of types from Twig.expression.type that can follow this token,
     *
     *      regex:    A regex or array of regex's that should match the token.
     *
     *      compile: function(token, stack, output) called when this token is being compiled.
     *                   Should return an object with stack and output set.
     *
     *      parse:   function(token, stack, context) called when this token is being parsed.
     *                   Should return an object with stack and context set.
     *  }
     *
     * @param {Object} definition A token definition.
     */
    Twig.expression.extend = function (definition) {
        if (!definition.type) {
            throw new Twig.Error("Unable to extend logic definition. No type provided for " + definition);
        }
        Twig.expression.handler[definition.type] = definition;
    };

    // Extend with built-in expressions
    while (Twig.expression.definitions.length > 0) {
        Twig.expression.extend(Twig.expression.definitions.shift());
    }

    /**
     * Break an expression into tokens defined in Twig.expression.definitions.
     *
     * @param {string} expression The string to tokenize.
     *
     * @return {Array} An array of tokens.
     */
    Twig.expression.tokenize = function (expression) {
        var tokens = [],
            // Keep an offset of the location in the expression for error messages.
            exp_offset = 0,
            // The valid next tokens of the previous token
            next = null,
            // Match information
            type, regex, regex_array,
            // The possible next token for the match
            token_next,
            // Has a match been found from the definitions
            match_found, invalid_matches = [], match_function;

        match_function = function () {
            var match = Array.prototype.slice.apply(arguments),
                string = match.pop(),
                offset = match.pop();

            Twig.log.trace("Twig.expression.tokenize",
                           "Matched a ", type, " regular expression of ", match);

            if (next && Twig.indexOf(next, type) < 0) {
                invalid_matches.push(
                    type + " cannot follow a " + tokens[tokens.length - 1].type +
                           " at template:" + exp_offset + " near '" + match[0].substring(0, 20) +
                           "...'"
                );
                // Not a match, don't change the expression
                return match[0];
            }

            // Validate the token if a validation function is provided
            if (Twig.expression.handler[type].validate &&
                    !Twig.expression.handler[type].validate(match, tokens)) {
                return match[0];
            }

            invalid_matches = [];

            tokens.push({
                type:  type,
                value: match[0],
                match: match
            });

            match_found = true;
            next = token_next;
            exp_offset += match[0].length;

            // Does the token need to return output back to the expression string
            // e.g. a function match of cycle( might return the '(' back to the expression
            // This allows look-ahead to differentiate between token types (e.g. functions and variable names)
            if (Twig.expression.handler[type].transform) {
                return Twig.expression.handler[type].transform(match, tokens);
            }
            return '';
        };

        Twig.log.debug("Twig.expression.tokenize", "Tokenizing expression ", expression);

        while (expression.length > 0) {
            expression = expression.trim();
            for (type in Twig.expression.handler) {
                if (Twig.expression.handler.hasOwnProperty(type)) {
                    token_next = Twig.expression.handler[type].next;
                    regex = Twig.expression.handler[type].regex;
                    // Twig.log.trace("Checking type ", type, " on ", expression);
                    if (regex instanceof Array) {
                        regex_array = regex;
                    } else {
                        regex_array = [regex];
                    }

                    match_found = false;
                    while (regex_array.length > 0) {
                        regex = regex_array.pop();
                        expression = expression.replace(regex, match_function);
                    }
                    // An expression token has been matched. Break the for loop and start trying to
                    //  match the next template (if expression isn't empty.)
                    if (match_found) {
                        break;
                    }
                }
            }
            if (!match_found) {
                if (invalid_matches.length > 0) {
                    throw new Twig.Error(invalid_matches.join(" OR "));
                } else {
                    throw new Twig.Error("Unable to parse '" + expression + "' at template position" + exp_offset);
                }
            }
        }

        Twig.log.trace("Twig.expression.tokenize", "Tokenized to ", tokens);
        return tokens;
    };

    /**
     * Compile an expression token.
     *
     * @param {Object} raw_token The uncompiled token.
     *
     * @return {Object} The compiled token.
     */
    Twig.expression.compile = function (raw_token) {
        var expression = raw_token.value,
            // Tokenize expression
            tokens = Twig.expression.tokenize(expression),
            token = null,
            output = [],
            stack = [],
            token_template = null;

        Twig.log.trace("Twig.expression.compile: ", "Compiling ", expression);

        // Push tokens into RPN stack using the Sunting-yard algorithm
        // See http://en.wikipedia.org/wiki/Shunting_yard_algorithm

        while (tokens.length > 0) {
            token = tokens.shift();
            token_template = Twig.expression.handler[token.type];

            Twig.log.trace("Twig.expression.compile: ", "Compiling ", token);

            // Compile the template
            token_template.compile && token_template.compile(token, stack, output);

            Twig.log.trace("Twig.expression.compile: ", "Stack is", stack);
            Twig.log.trace("Twig.expression.compile: ", "Output is", output);
        }

        while(stack.length > 0) {
            output.push(stack.pop());
        }

        Twig.log.trace("Twig.expression.compile: ", "Final output is", output);

        raw_token.stack = output;
        delete raw_token.value;

        return raw_token;
    };


    /**
     * Parse an RPN expression stack within a context.
     *
     * @param {Array} tokens An array of compiled expression tokens.
     * @param {Object} context The render context to parse the tokens with.
     *
     * @return {Object} The result of parsing all the tokens. The result
     *                  can be anything, String, Array, Object, etc... based on
     *                  the given expression.
     */
    Twig.expression.parse = function (tokens, context) {
        var that = this;

        // If the token isn't an array, make it one.
        if (!(tokens instanceof Array)) {
            tokens = [tokens];
        }

        // The output stack
        var stack = [],
            token_template = null;

        Twig.forEach(tokens, function (token) {
            token_template = Twig.expression.handler[token.type];

            token_template.parse && token_template.parse.apply(that, [token, stack, context]);
        });

        // Pop the final value off the stack
        return stack.pop();
    };

    return Twig;

})( Twig || { } );
//     Twig.js
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.expression.operator.js
//
// This file handles operator lookups and parsing.
var Twig = (function (Twig) {
    "use strict";

    /**
     * Operator associativity constants.
     */
    Twig.expression.operator = {
        leftToRight: 'leftToRight',
        rightToLeft: 'rightToLeft'
    };

    var containment = function(a, b) {
        if (b.indexOf !== undefined) {
            // String
            return a === b || a !== '' && b.indexOf(a) > -1;

        } else {
            var el;
            for (el in b) {
                if (b.hasOwnProperty(el) && b[el] === a) {
                    return true;
                }
            }
            return false;
        }
    };

    /**
     * Get the precidence and associativity of an operator. These follow the order that C/C++ use.
     * See http://en.wikipedia.org/wiki/Operators_in_C_and_C++ for the table of values.
     */
    Twig.expression.operator.lookup = function (operator, token) {
        switch (operator) {
            case "..":
            case 'not in':
            case 'in':
                token.precidence = 20;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case ',':
                token.precidence = 18;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            // Ternary
            case '?':
            case ':':
                token.precidence = 16;
                token.associativity = Twig.expression.operator.rightToLeft;
                break;

            case 'or':
                token.precidence = 14;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'and':
                token.precidence = 13;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '==':
            case '!=':
                token.precidence = 9;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '<':
            case '<=':
            case '>':
            case '>=':
                token.precidence = 8;
                token.associativity = Twig.expression.operator.leftToRight;
                break;


            case '~': // String concatination
            case '+':
            case '-':
                token.precidence = 6;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '//':
            case '**':
            case '*':
            case '/':
            case '%':
                token.precidence = 5;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'not':
                token.precidence = 3;
                token.associativity = Twig.expression.operator.rightToLeft;
                break;

            default:
                throw new Twig.Error(operator + " is an unknown operator.");
        }
        token.operator = operator;
        return token;
    };

    /**
     * Handle operations on the RPN stack.
     *
     * Returns the updated stack.
     */
    Twig.expression.operator.parse = function (operator, stack) {
        Twig.log.trace("Twig.expression.operator.parse: ", "Handling ", operator);
        var a, b, c;
        switch (operator) {
            case ':':
                // Ignore
                break;

            case '?':
                c = stack.pop(); // false expr
                b = stack.pop(); // true expr
                a = stack.pop(); // conditional
                if (a) {
                    stack.push(b);
                } else {
                    stack.push(c);
                }
                break;

            case '+':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a + b);
                break;

            case '-':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a - b);
                break;

            case '*':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a * b);
                break;

            case '/':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a / b);
                break;

            case '//':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(parseInt(a / b));
                break;

            case '%':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a % b);
                break;

            case '~':
                b = stack.pop();
                a = stack.pop();
                stack.push( (a != null ? a.toString() : "")
                          + (b != null ? b.toString() : "") );
                break;

            case 'not':
            case '!':
                stack.push(!stack.pop());
                break;

            case '<':
                b = stack.pop();
                a = stack.pop();
                stack.push(a < b);
                break;

            case '<=':
                b = stack.pop();
                a = stack.pop();
                stack.push(a <= b);
                break;

            case '>':
                b = stack.pop();
                a = stack.pop();
                stack.push(a > b);
                break;

            case '>=':
                b = stack.pop();
                a = stack.pop();
                stack.push(a >= b);
                break;

            case '===':
                b = stack.pop();
                a = stack.pop();
                stack.push(a === b);
                break;

            case '==':
                b = stack.pop();
                a = stack.pop();
                stack.push(a == b);
                break;

            case '!==':
                b = stack.pop();
                a = stack.pop();
                stack.push(a !== b);
                break;

            case '!=':
                b = stack.pop();
                a = stack.pop();
                stack.push(a != b);
                break;

            case 'or':
                b = stack.pop();
                a = stack.pop();
                stack.push(a || b);
                break;

            case 'and':
                b = stack.pop();
                a = stack.pop();
                stack.push(a && b);
                break;

            case '**':
                b = stack.pop();
                a = stack.pop();
                stack.push(Math.pow(a, b));
                break;


            case 'not in':
                b = stack.pop();
                a = stack.pop();
                stack.push( !containment(a, b) );
                break;

            case 'in':
                b = stack.pop();
                a = stack.pop();
                stack.push( containment(a, b) );
                break;

            case '..':
                b = stack.pop();
                a = stack.pop();
                stack.push( Twig.functions.range(a, b) );
                break;

            default:
                throw new Twig.Error(operator + " is an unknown operator.");
        }
    };

    return Twig;

})( Twig || { } );
//     Twig.js
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.filters.js
//
// This file handles parsing filters.
var Twig = (function (Twig) {

    // Determine object type
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    Twig.filters = {
        // String Filters
        upper:  function(value) {
            if ( typeof value !== "string" ) {
               return value;
            }

            return value.toUpperCase();
        },
        lower: function(value) {
            if ( typeof value !== "string" ) {
               return value;
            }

            return value.toLowerCase();
        },
        capitalize: function(value) {
            if ( typeof value !== "string" ) {
                 return value;
            }

            return value.substr(0, 1).toUpperCase() + value.toLowerCase().substr(1);
        },
        title: function(value) {
            if ( typeof value !== "string" ) {
               return value;
            }

            return value.toLowerCase().replace( /(^|\s)([a-z])/g , function(m, p1, p2){
                return p1 + p2.toUpperCase();
            });
        },
        length: function(value) {
            if (Twig.lib.is("Array", value) || typeof value === "string") {
                return value.length;
            } else if (Twig.lib.is("Object", value)) {
                if (value._keys === undefined) {
                    return Object.keys(value).length;
                } else {
                    return value._keys.length;
                }
            } else {
                return 0;
            }
        },

        // Array/Object Filters
        reverse: function(value) {
            if (is("Array", value)) {
                return value.reverse();
            } else if (is("String", value)) {
                return value.split("").reverse().join("");
            } else if (value instanceof Object) {
                var keys = value._keys || Object.keys(value).reverse();
                value._keys = keys;
                return value;
            }
        },
        sort: function(value) {
            if (is("Array", value)) {
                return value.sort();
            } else if (value instanceof Object) {
                // Sorting objects isn't obvious since the order of
                // returned keys isn't guaranteedin JavaScript.
                // Because of this we use a "hidden" key called _keys to
                // store the keys in the order we want to return them.

                delete value._keys;
                var keys = Object.keys(value),
                    sorted_keys = keys.sort(function(a, b) {
                        return value[a] > value[b];
                    });
                value._keys = sorted_keys;
                return value;
            }
        },
        keys: function(value) {
            if (value === undefined || value === null){
                return;
           }

            var keyset = value._keys || Object.keys(value),
                output = [];

            Twig.forEach(keyset, function(key) {
                if (key === "_keys") return; // Ignore the _keys property
                if (value.hasOwnProperty(key)) {
                    output.push(key);
                }
            });
            return output;
        },
        url_encode: function(value) {
            if (value === undefined || value === null){
                return;
            }

            return encodeURIComponent(value);
        },
        join: function(value, params) {
            if (value === undefined || value === null){
                return;
            }

            var join_str = "",
                output = [],
                keyset = null;

            if (params && params[0]) {
                join_str = params[0];
            }
            if (value instanceof Array) {
                output = value;
            } else {
                keyset = value._keys || Object.keys(value);
                Twig.forEach(keyset, function(key) {
                    if (key === "_keys") return; // Ignore the _keys property
                    if (value.hasOwnProperty(key)) {
                        output.push(value[key]);
                    }
                });
            }
            return output.join(join_str);
        },
        "default": function(value, params) {
            if (params === undefined || params.length !== 1) {
                throw new Twig.Error("default filter expects one argument");
            }
            if (value === undefined || value === null || value === '' ) {
                return params[0];
            } else {
                return value;
            }
        },
        json_encode: function(value) {
            if (value && value.hasOwnProperty( "_keys" ) ) {
                delete value._keys;
            }
            if(value === undefined || value === null) {
                return "null";
            }
            return JSON.stringify(value);
        },
        merge: function(value, params) {
            var obj = [],
                arr_index = 0,
                keyset = [];

            // Check to see if all the objects being merged are arrays
            if (!(value instanceof Array)) {
                // Create obj as an Object
                obj = { };
            } else {
                Twig.forEach(params, function(param) {
                    if (!(param instanceof Array)) {
                        obj = { };
                    }
                });
            }
            if (!(obj instanceof Array)) {
                obj._keys = [];
            }

            if (value instanceof Array) {
                Twig.forEach(value, function(val) {
                    if (obj._keys) obj._keys.push(arr_index);
                    obj[arr_index] = val;
                    arr_index++;
                });
            } else {
                keyset = value._keys || Object.keys(value);
                Twig.forEach(keyset, function(key) {
                    obj[key] = value[key];
                    obj._keys.push(key);

                    // Handle edge case where a number index in an object is greater than
                    //   the array counter. In such a case, the array counter is increased
                    //   one past the index.
                    //
                    // Example {{ ["a", "b"]|merge({"4":"value"}, ["c", "d"])
                    // Without this, d would have an index of "4" and overwrite the value
                    //   of "value"
                    var int_key = parseInt(key, 10);
                    if (!isNaN(int_key) && int_key >= arr_index) {
                        arr_index = int_key + 1;
                    }
                });
            }

            // mixin the merge arrays
            Twig.forEach(params, function(param) {
                if (param instanceof Array) {
                    Twig.forEach(param, function(val) {
                        if (obj._keys) obj._keys.push(arr_index);
                        obj[arr_index] = val;
                        arr_index++;
                    });
                } else {
                    keyset = param._keys || Object.keys(param);
                    Twig.forEach(keyset, function(key) {
                        if (!obj[key]) obj._keys.push(key);
                        obj[key] = param[key];

                        var int_key = parseInt(key, 10);
                        if (!isNaN(int_key) && int_key >= arr_index) {
                            arr_index = int_key + 1;
                        }
                    });
                }
            });
            if (params.length === 0) {
                throw new Twig.Error("Filter merge expects at least one parameter");
            }

            return obj;
        },
        date: function(value, params) {
            if (value === undefined||value === null){
                return;
            }

            var date = Twig.functions.date(value);
            return Twig.lib.formatDate(date, params[0]);
        },

        date_modify: function(value, params) {
            if (value === undefined || value === null) {
                return;
            }
            if (params === undefined || params.length !== 1) {
                throw new Twig.Error("date_modify filter expects 1 argument");
            }

            var modifyText = params[0], time;

            if (Twig.lib.is("Date", value)) {
                time = Twig.lib.strtotime(modifyText, value.getTime() / 1000);
            }
            if (Twig.lib.is("String", value)) {
                time = Twig.lib.strtotime(modifyText, Twig.lib.strtotime(value));
            }
            if (Twig.lib.is("Number", value)) {
                time = Twig.lib.strtotime(modifyText, value);
            }

            return new Date(time * 1000);
        },

        replace: function(value, params) {
            if (value === undefined||value === null){
                return;
            }

            var pairs = params[0],
                tag;
            for (tag in pairs) {
                if (pairs.hasOwnProperty(tag) && tag !== "_keys") {
                    value = Twig.lib.replaceAll(value, tag, pairs[tag]);
                }
            }
            return value;
        },

        format: function(value, params) {
            if (value === undefined || value === null){
                return;
            }

            return Twig.lib.vsprintf(value, params);
        },

        striptags: function(value) {
            if (value === undefined || value === null){
                return;
            }

            return Twig.lib.strip_tags(value);
        },

        escape: function(value) {
            if (value === undefined|| value === null){
                return;
            }
            var raw_value = value.toString().replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;");
            return Twig.Markup(raw_value);
        },

        /* Alias of escape */
        "e": function(value) {
            return Twig.filters.escape(value);
        },

        nl2br: function(value) {
            if (value === undefined || value === null){
                return;
            }
            var linebreak_tag = "BACKSLASH_n_replace",
                br = "<br />" + linebreak_tag;

            value = Twig.filters.escape(value)
                        .replace(/\r\n/g, br)
                        .replace(/\r/g, br)
                        .replace(/\n/g, br);

            return Twig.lib.replaceAll(value, linebreak_tag, "\n");
        },

        /**
         * Adapted from: http://phpjs.org/functions/number_format:481
         */
        number_format: function(value, params) {
            var number = value,
                decimals = (params && params[0]) ? params[0] : undefined,
                dec      = (params && params[1] !== undefined) ? params[1] : ".",
                sep      = (params && params[2] !== undefined) ? params[2] : ",";

            number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                s = '',
                toFixedFix = function (n, prec) {
                    var k = Math.pow(10, prec);
                    return '' + Math.round(n * k) / k;
                };
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0');
            }
            return s.join(dec);
        },

        trim: function(value, params) {
            if (value === undefined|| value === null){
                return;
            }

            var str = Twig.filters.escape( '' + value ),
                whitespace;
            if ( params && params[0] ) {
                whitespace = '' + params[0];
            } else {
                whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
            }
            for (var i = 0; i < str.length; i++) {
                if (whitespace.indexOf(str.charAt(i)) === -1) {
                    str = str.substring(i);
                    break;
                }
            }
            for (i = str.length - 1; i >= 0; i--) {
                if (whitespace.indexOf(str.charAt(i)) === -1) {
                    str = str.substring(0, i + 1);
                    break;
                }
            }
            return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
        },

        truncate: function (value, params) {
            var length = 30,
                preserve = false,
                separator = '...';

            value =  value + '';
            if (params) {
                if (params[0]) {
                    length = params[0];
                }
                if (params[1]) {
                    preserve = params[1];
                }
                if (params[2]) {
                    separator = params[2];
                }
            }

            if (value.length > length) {

                if (preserve) {
                    length = value.indexOf(' ', length);
                    if (length === -1) {
                        return value;
                    }
                }

                value =  value.substr(0, length) + separator;
            }

            return value;
        },

        slice: function(value, params) {
            if (value === undefined || value === null) {
                return;
            }
            if (params === undefined || params.length < 1) {
                throw new Twig.Error("slice filter expects at least 1 argument");
            }

            // default to start of string
            var start = params[0] || 0;
            // default to length of string
            var length = params.length > 1 ? params[1] : value.length;
            // handle negative start values
            var startIndex = start >= 0 ? start : Math.max( value.length + start, 0 );

            if (Twig.lib.is("Array", value)) {
                var output = [];
                for (var i = startIndex; i < startIndex + length && i < value.length; i++) {
                    output.push(value[i]);
                }
                return output;
            } else if (Twig.lib.is("String", value)) {
                return value.substr(startIndex, length);
            } else {
                throw new Twig.Error("slice filter expects value to be an array or string");
            }
        },

        abs: function(value) {
            if (value === undefined || value === null) {
                return;
            }

            return Math.abs(value);
        },

        first: function(value) {
            if (value instanceof Array) {
                return value[0];
            } else if (value instanceof Object) {
                if ('_keys' in value) {
                    return value[value._keys[0]];
                }
            } else if ( typeof value === "string" ) {
                return value.substr(0, 1);
            }

            return;
        },

        split: function(value, params) {
            if (value === undefined || value === null) {
                return;
            }
            if (params === undefined || params.length < 1 || params.length > 2) {
                throw new Twig.Error("split filter expects 1 or 2 argument");
            }
            if (Twig.lib.is("String", value)) {
                var delimiter = params[0],
                    limit = params[1],
                    split = value.split(delimiter);

                if (limit === undefined) {

                    return split;

                } else if (limit < 0) {

                    return value.split(delimiter, split.length + limit);

                } else {

                    var limitedSplit = [];

                    if (delimiter == '') {
                        // empty delimiter
                        // "aabbcc"|split('', 2)
                        //     -> ['aa', 'bb', 'cc']

                        while(split.length > 0) {
                            var temp = "";
                            for (var i=0; i<limit && split.length > 0; i++) {
                                temp += split.shift();
                            }
                            limitedSplit.push(temp);
                        }

                    } else {
                        // non-empty delimiter
                        // "one,two,three,four,five"|split(',', 3)
                        //     -> ['one', 'two', 'three,four,five']

                        for (var i=0; i<limit-1 && split.length > 0; i++) {
                            limitedSplit.push(split.shift());
                        }

                        if (split.length > 0) {
                            limitedSplit.push(split.join(delimiter));
                        }
                    }

                    return limitedSplit;
                }

            } else {
                throw new Twig.Error("split filter expects value to be a string");
            }
        },
        last: function(value) {
            if (Twig.lib.is('Object', value)) {
                var keys;

                if (value._keys === undefined) {
                    keys = Object.keys(value);
                } else {
                    keys = value._keys;
                }

                return value[keys[keys.length - 1]];
            }

            // string|array
            return value[value.length - 1];
        },
        raw: function(value) {
            return Twig.Markup(value);
        },
        batch: function(items, params) {
            var size = params.shift(),
                fill = params.shift(),
                result,
                last,
                missing;

            if (!Twig.lib.is("Array", items)) {
                throw new Twig.Error("batch filter expects items to be an array");
            }

            if (!Twig.lib.is("Number", size)) {
                throw new Twig.Error("batch filter expects size to be a number");
            }

            size = Math.ceil(size);

            result = Twig.lib.chunkArray(items, size);

            if (fill && items.length % size != 0) {
                last = result.pop();
                missing = size - last.length;

                while (missing--) {
                    last.push(fill);
                }

                result.push(last);
            }

            return result;
        },
        round: function(value, params) {
            params = params || [];

            var precision = params.length > 0 ? params[0] : 0,
                method = params.length > 1 ? params[1] : "common";

            value = parseFloat(value);

            if(precision && !Twig.lib.is("Number", precision)) {
                throw new Twig.Error("round filter expects precision to be a number");
            }

            if (method === "common") {
                return Twig.lib.round(value, precision);
            }

            if(!Twig.lib.is("Function", Math[method])) {
                throw new Twig.Error("round filter expects method to be 'floor', 'ceil', or 'common'");
            }

            return Math[method](value * Math.pow(10, precision)) / Math.pow(10, precision);
        }
    };

    Twig.filter = function(filter, value, params) {
        if (!Twig.filters[filter]) {
            throw "Unable to find filter " + filter;
        }
        return Twig.filters[filter].apply(this, [value, params]);
    };

    Twig.filter.extend = function(filter, definition) {
        Twig.filters[filter] = definition;
    };

    return Twig;

})(Twig || { });
//     Twig.js
//                   2012 Hadrien Lanneau
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.functions.js
//
// This file handles parsing filters.
var Twig = (function (Twig) {

    // Determine object type
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    Twig.functions = {
        //  attribute, block, constant, date, dump, parent, random,.

        // Range function from http://phpjs.org/functions/range:499
        // Used under an MIT License
        range: function (low, high, step) {
            // http://kevin.vanzonneveld.net
            // +   original by: Waldo Malqui Silva
            // *     example 1: range ( 0, 12 );
            // *     returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            // *     example 2: range( 0, 100, 10 );
            // *     returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
            // *     example 3: range( 'a', 'i' );
            // *     returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
            // *     example 4: range( 'c', 'a' );
            // *     returns 4: ['c', 'b', 'a']
            var matrix = [];
            var inival, endval, plus;
            var walker = step || 1;
            var chars = false;

            if (!isNaN(low) && !isNaN(high)) {
                inival = parseInt(low, 10);
                endval = parseInt(high, 10);
            } else if (isNaN(low) && isNaN(high)) {
                chars = true;
                inival = low.charCodeAt(0);
                endval = high.charCodeAt(0);
            } else {
                inival = (isNaN(low) ? 0 : low);
                endval = (isNaN(high) ? 0 : high);
            }

            plus = ((inival > endval) ? false : true);
            if (plus) {
                while (inival <= endval) {
                    matrix.push(((chars) ? String.fromCharCode(inival) : inival));
                    inival += walker;
                }
            } else {
                while (inival >= endval) {
                    matrix.push(((chars) ? String.fromCharCode(inival) : inival));
                    inival -= walker;
                }
            }

            return matrix;
        },
        cycle: function(arr, i) {
            var pos = i % arr.length;
            return arr[pos];
        },
        dump: function() {
            var EOL = '\n',
            	indentChar = '  ',
            	indentTimes = 0,
            	out = '',
				args = Array.prototype.slice.call(arguments),
				indent = function(times) {
                	var ind	 = '';
                    while (times > 0) {
                        times--;
                        ind += indentChar;
                    }
                    return ind;
                },
				displayVar = function(variable) {
                    out += indent(indentTimes);
                    if (typeof(variable) === 'object') {
                        dumpVar(variable);
                    } else if (typeof(variable) === 'function') {
                        out += 'function()' + EOL;
                    } else if (typeof(variable) === 'string') {
                        out += 'string(' + variable.length + ') "' + variable + '"' + EOL;
                    } else if (typeof(variable) === 'number') {
                        out += 'number(' + variable + ')' + EOL;
                    } else if (typeof(variable) === 'boolean') {
                        out += 'bool(' + variable + ')' + EOL;
                    }
                },
             	dumpVar = function(variable) {
					var	i;
	                if (variable === null) {
	                    out += 'NULL' + EOL;
	                } else if (variable === undefined) {
	                    out += 'undefined' + EOL;
	                } else if (typeof variable === 'object') {
	                    out += indent(indentTimes) + typeof(variable);
	                    indentTimes++;
	                    out += '(' + (function(obj) {
	                        var size = 0, key;
	                        for (key in obj) {
	                            if (obj.hasOwnProperty(key)) {
	                                size++;
	                            }
	                        }
	                        return size;
	                    })(variable) + ') {' + EOL;
	                    for (i in variable) {
	                        out += indent(indentTimes) + '[' + i + ']=> ' + EOL;
	                        displayVar(variable[i]);
	                    }
	                    indentTimes--;
	                    out += indent(indentTimes) + '}' + EOL;
	                } else {
	                    displayVar(variable);
	                }
	            };

			// handle no argument case by dumping the entire render context
			if (args.length == 0) args.push(this.context);

			Twig.forEach(args, function(variable) {
				dumpVar(variable);
			});

            return out;
        },
        date: function(date, time) {
            var dateObj;
            if (date === undefined) {
                dateObj = new Date();
            } else if (Twig.lib.is("Date", date)) {
                dateObj = date;
            } else if (Twig.lib.is("String", date)) {
                dateObj = new Date(Twig.lib.strtotime(date) * 1000);
            } else if (Twig.lib.is("Number", date)) {
                // timestamp
                dateObj = new Date(date * 1000);
            } else {
                throw new Twig.Error("Unable to parse date " + date);
            }
            return dateObj;
        },
        block: function(block) {
            return this.blocks[block];
        },
        parent: function() {
            // Add a placeholder
            return Twig.placeholders.parent;
        },
        attribute: function(object, method, params) {
            if (object instanceof Object) {
                if (object.hasOwnProperty(method)) {
                    if (typeof object[method] === "function") {
                        return object[method].apply(undefined, params);
                    }
                    else {
                        return object[method];
                    }
                }
            }
            // Array will return element 0-index
            return object[method] || undefined;
        },
        template_from_string: function(template) {
            if (template === undefined) {
                template = '';
            }
            return new Twig.Template({
                options: this.options,
                data: template
            });
        },
        random: function(value) {
            var LIMIT_INT31 = 0x80000000;

            function getRandomNumber(n) {
                var random = Math.floor(Math.random() * LIMIT_INT31);
                var limits = [0, n];
                var min = Math.min.apply(null, limits),
                    max = Math.max.apply(null, limits);
                return min + Math.floor((max - min + 1) * random / LIMIT_INT31);
            }

            if(Twig.lib.is("Number", value)) {
                return getRandomNumber(value);
            }

            if(Twig.lib.is("String", value)) {
                return value.charAt(getRandomNumber(value.length-1));
            }

            if(Twig.lib.is("Array", value)) {
                return value[getRandomNumber(value.length-1)];
            }

            if(Twig.lib.is("Object", value)) {
                var keys = Object.keys(value);
                return value[keys[getRandomNumber(keys.length-1)]];
            }

            return getRandomNumber(LIMIT_INT31-1);
        }
    };

    Twig._function = function(_function, value, params) {
        if (!Twig.functions[_function]) {
            throw "Unable to find function " + _function;
        }
        return Twig.functions[_function](value, params);
    };

    Twig._function.extend = function(_function, definition) {
        Twig.functions[_function] = definition;
    };

    return Twig;

})(Twig || { });
//     Twig.js
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.tests.js
//
// This file handles expression tests. (is empty, is not defined, etc...)
var Twig = (function (Twig) {
    "use strict";
    Twig.tests = {
        empty: function(value) {
            if (value === null || value === undefined) return true;
            // Handler numbers
            if (typeof value === "number") return false; // numbers are never "empty"
            // Handle strings and arrays
            if (value.length && value.length > 0) return false;
            // Handle objects
            for (var key in value) {
                if (value.hasOwnProperty(key)) return false;
            }
            return true;
        },
        odd: function(value) {
            return value % 2 === 1;
        },
        even: function(value) {
            return value % 2 === 0;
        },
        divisibleby: function(value, params) {
            return value % params[0] === 0;
        },
        defined: function(value) {
            return value !== undefined;
        },
        none: function(value) {
            return value === null;
        },
        'null': function(value) {
            return this.none(value); // Alias of none
        },
        sameas: function(value, params) {
            return value === params[0];
        },
        iterable: function(value) {
            return value && (Twig.lib.is("Array", value) || Twig.lib.is("Object", value));
        }
        /*
        constant ?
         */
    };

    Twig.test = function(test, value, params) {
        if (!Twig.tests[test]) {
            throw "Test " + test + " is not defined.";
        }
        return Twig.tests[test](value, params);
    };

    Twig.test.extend = function(test, definition) {
        Twig.tests[test] = definition;
    };

    return Twig;
})( Twig || { } );
//     Twig.js
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.exports.js
//
// This file provides extension points and other hooks into the twig functionality.

var Twig = (function (Twig) {
    "use strict";
    Twig.exports = {
        VERSION: Twig.VERSION
    };

    /**
     * Create and compile a twig.js template.
     *
     * @param {Object} param Paramteres for creating a Twig template.
     *
     * @return {Twig.Template} A Twig template ready for rendering.
     */
    Twig.exports.twig = function twig(params) {
        'use strict';
        var id = params.id,
            options = {
                strict_variables: params.strict_variables || false,
                // TODO: turn autoscape on in the next major version
                autoescape: params.autoescape != null && params.autoescape || false,
                allowInlineIncludes: params.allowInlineIncludes || false,
                rethrow: params.rethrow || false
            };

        if (id) {
            Twig.validateId(id);
        }

        if (params.debug !== undefined) {
            Twig.debug = params.debug;
        }
        if (params.trace !== undefined) {
            Twig.trace = params.trace;
        }

        if (params.data !== undefined) {
            return new Twig.Template({
                data: params.data,
                module: params.module,
                id:   id,
                options: options
            });

        } else if (params.ref !== undefined) {
            if (params.id !== undefined) {
                throw new Twig.Error("Both ref and id cannot be set on a twig.js template.");
            }
            return Twig.Templates.load(params.ref);

        } else if (params.href !== undefined) {
            return Twig.Templates.loadRemote(params.href, {
                id: id,
                method: 'ajax',
                base: params.base,
                module: params.module,
                precompiled: params.precompiled,
                async: params.async,
                options: options

            }, params.load, params.error);

        } else if (params.path !== undefined) {
            return Twig.Templates.loadRemote(params.path, {
                id: id,
                method: 'fs',
                base: params.base,
                module: params.module,
                precompiled: params.precompiled,
                async: params.async,
                options: options

            }, params.load, params.error);
        }
    };

    // Extend Twig with a new filter.
    Twig.exports.extendFilter = function(filter, definition) {
        Twig.filter.extend(filter, definition);
    };

    // Extend Twig with a new function.
    Twig.exports.extendFunction = function(fn, definition) {
        Twig._function.extend(fn, definition);
    };

    // Extend Twig with a new test.
    Twig.exports.extendTest = function(test, definition) {
        Twig.test.extend(test, definition);
    };

    // Extend Twig with a new definition.
    Twig.exports.extendTag = function(definition) {
        Twig.logic.extend(definition);
    };

    // Provide an environment for extending Twig core.
    // Calls fn with the internal Twig object.
    Twig.exports.extend = function(fn) {
        fn(Twig);
    };


    /**
     * Provide an extension for use with express 2.
     *
     * @param {string} markup The template markup.
     * @param {array} options The express options.
     *
     * @return {string} The rendered template.
     */
    Twig.exports.compile = function(markup, options) {
        var id = options.filename,
            path = options.filename,
            template;

        // Try to load the template from the cache
        template = new Twig.Template({
            data: markup,
            path: path,
            id: id,
            options: options.settings['twig options']
        }); // Twig.Templates.load(id) ||

        return function(context) {
            return template.render(context);
        };
    };

    /**
     * Provide an extension for use with express 3.
     *
     * @param {string} path The location of the template file on disk.
     * @param {Object|Function} The options or callback.
     * @param {Function} fn callback.
     */

    Twig.exports.renderFile = function(path, options, fn) {
        // handle callback in options
        if ('function' == typeof options) {
            fn = options;
            options = {};
        }

        options = options || {};

        var params = {
                path: path,
                base: options.settings['views'],
                load: function(template) {
                    // render and return template
                    fn(null, template.render(options));
                }
            };

        // mixin any options provided to the express app.
        var view_options = options.settings['twig options'];

        if (view_options) {
            for (var option in view_options) if (view_options.hasOwnProperty(option)) {
                params[option] = view_options[option];
            }
        }

        Twig.exports.twig(params);
    };

    // Express 3 handler
    Twig.exports.__express = Twig.exports.renderFile;

    /**
     * Shoud Twig.js cache templates.
     * Disable during development to see changes to templates without
     * reloading, and disable in production to improve performance.
     *
     * @param {boolean} cache
     */
    Twig.exports.cache = function(cache) {
        Twig.cache = cache;
    }

    return Twig;
}) (Twig || { });

//     Twig.js
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.compiler.js
//
// This file handles compiling templates into JS
var Twig = (function (Twig) {
    /**
     * Namespace for compilation.
     */
    Twig.compiler = {
        module: {}
    };

    // Compile a Twig Template to output.
    Twig.compiler.compile = function(template, options) {
        // Get tokens
        var tokens = JSON.stringify(template.tokens)
            , id = template.id
            , output;

        if (options.module) {
            if (Twig.compiler.module[options.module] === undefined) {
                throw new Twig.Error("Unable to find module type " + options.module);
            }
            output = Twig.compiler.module[options.module](id, tokens, options.twig);
        } else {
            output = Twig.compiler.wrap(id, tokens);
        }
        return output;
    };

    Twig.compiler.module = {
        amd: function(id, tokens, pathToTwig) {
            return 'define(["' + pathToTwig + '"], function (Twig) {\n\tvar twig, templates;\ntwig = Twig.twig;\ntemplates = ' + Twig.compiler.wrap(id, tokens) + '\n\treturn templates;\n});';
        }
        , node: function(id, tokens) {
            return 'var twig = require("twig").twig;\n'
                + 'exports.template = ' + Twig.compiler.wrap(id, tokens)
        }
        , cjs2: function(id, tokens, pathToTwig) {
            return 'module.declare([{ twig: "' + pathToTwig + '" }], function (require, exports, module) {\n'
                        + '\tvar twig = require("twig").twig;\n'
                        + '\texports.template = ' + Twig.compiler.wrap(id, tokens)
                    + '\n});'
        }
    };

    Twig.compiler.wrap = function(id, tokens) {
        return 'twig({id:"'+id.replace('"', '\\"')+'", data:'+tokens+', precompiled: true});\n';
    };

    return Twig;
})(Twig || {});
//     Twig.js
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.module.js
// Provide a CommonJS/AMD/Node module export.

if (typeof module !== 'undefined' && module.declare) {
    // Provide a CommonJS Modules/2.0 draft 8 module
    module.declare([], function(require, exports, module) {
        // Add exports from the Twig exports
        for (key in Twig.exports) {
            if (Twig.exports.hasOwnProperty(key)) {
                exports[key] = Twig.exports[key];
            }
        }
    });
} else if (typeof define == 'function' && define.amd) {
    define(function() {
        return Twig.exports;
    });
} else if (typeof module !== 'undefined' && module.exports) {
    // Provide a CommonJS Modules/1.1 module
    module.exports = Twig.exports;
} else {
    // Export for browser use
    window.twig = Twig.exports.twig;
    window.Twig = Twig.exports;
}


},{"fs":5,"path":10}],14:[function(require,module,exports){
module.exports = function(T) {
  T.extendFilter('passthrough', function(value) {
    return value;
  });
};

},{}],15:[function(require,module,exports){
module.exports = function(T) {
  T.extend(function(Twig) {
    // Make trans tag available.
    Twig.exports.extendTag({
      type: 'trans',
      regex: /^trans$/,
      // Should be followed by endtrans.
      next: [ 'endtrans' ],
      open: true,

      // The following is based on this wiki page: https://github.com/justjohn/twig.js/wiki/Extending-twig.js-With-Custom-Tags
      // runs on matched tokens when the template is loaded. (once per template)
      compile: function (token) {
        return token;
      },

      // Runs when the template is rendered
      parse: function (token, context, chain) {
        var output = Twig.parse.apply(this, [token.output, context]);

        return {
          chain: false,
          output: output
        };
      }
    });

    // Export endtrans tag.
    Twig.exports.extendTag({
      type: 'endtrans',
      open: false,
      regex: /^endtrans$/,
      next: []
    });
  });
};

},{}],16:[function(require,module,exports){
module.exports = function(T) {
  T.extendFilter('without', function(value, args) {
    var output = '';
    for (var i = 0, len = args.length; i < len; i++) {
      delete value[args[i]];
    }
    for (var prop in value) {
      output += value[prop];
    }
    return output;
  });
};

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hdHRhY2hMaXN0ZW5lcnMuanMiLCJqcy9nZXROb2Rlcy5qcyIsImpzL21haW4uanMiLCJqcy9yZW5kZXJOb2RlLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pcy1hcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL21vbWVudC9tb21lbnQuanMiLCJub2RlX21vZHVsZXMvdHdpZy90d2lnLmpzIiwibm9kZV9tb2R1bGVzL3R3aWdqcy1wYXNzdGhyb3VnaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90d2lnanMtdHJhbnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdHdpZ2pzLXdpdGhvdXQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3hnREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzNUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaExpc3RlbmVycyhsaXN0LCBzaW5nbGUpIHtcbiAgdmFyIGxpc3RMaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNsb2dvIGEnKVxuICBpZiAobGlzdExpbmtzICYmIGxpc3RMaW5rcy5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBhID0gMCwgbGVuZ3RoID0gbGlzdExpbmtzLmxlbmd0aDsgYSA8IGxlbmd0aDsgYSsrKSB7XG4gICAgICBsaXN0TGlua3NbYV0ub25jbGljayA9IGxpc3Q7XG4gICAgfVxuICB9XG4gIHZhciB0aXRsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm9kZV9fdGl0bGUgYScpO1xuICBpZiAodGl0bGVzICYmIHRpdGxlcy5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGl0bGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0aXRsZXNbaV0ub25jbGljayA9IHNpbmdsZTtcbiAgICB9XG4gIH1cbiAgdmFyIHJlYWRtb3JlTGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVhZG1vcmUtbGluaycpO1xuICBpZiAocmVhZG1vcmVMaW5rcyAmJiByZWFkbW9yZUxpbmtzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGogPSAwLCBsID0gcmVhZG1vcmVMaW5rcy5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgIHJlYWRtb3JlTGlua3Nbal0ucXVlcnlTZWxlY3RvcignYScpLm9uY2xpY2sgPSBzaW5nbGU7XG4gICAgfVxuICB9XG59O1xuIiwiLypnbG9iYWwgRHJ1cGFsICovXG5cbnZhciBjYWNoZSA9IHt9O1xuXG5mdW5jdGlvbiBnZXROb2RlcyhuaWQsIGNhbGxiYWNrKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIHVybCA9ICdub2RlLycgKyBuaWQ7XG4gIGlmICghbmlkKSB7XG4gICAgLy8gVGhpcyBpcyB0aGUgVVJMIGRlZmluZWQgaW4gdGhlIHZpZXcgdGhhdCBjb21lcyB3aXRoIHRoZSB0aGVtZS5cbiAgICB1cmwgPSAncmVzdC10ZXN0JztcbiAgfVxuICAvLyBBc3NlbWJsZSB1cmwgYW5kIGFwcGVuZCBxdWVyeSBwYXJhbWV0ZXIgc28gdGhlIGJyb3dzZXIgd2lsbCBub3QgbWlzdGFrZSBpdFxuICAvLyBmb3IgdGhlIGFjdHVhbCBwYWdlIGl0IGFscmVhZHkgaGFzIGxvYWRlZC5cbiAgdXJsID0gRHJ1cGFsLnVybCgnJykgKyB1cmwgKyAnP19mb3JtYXQ9aGFsX2pzb24nO1xuICAvLyBDaGVhdCB3aXRoIHNwZWVkIGFuZCB1c2UgY2FjaGUuXG4gIGlmIChjYWNoZVt1cmxdKSB7XG4gICAgY2FsbGJhY2sobnVsbCwgY2FjaGVbdXJsXSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRhO1xuICAgIHRyeSB7XG4gICAgICBkYXRhID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFJlbWVtYmVyIHRoaXMuXG4gICAgY2FjaGVbdXJsXSA9IGRhdGE7XG4gICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XG4gIH07XG5cbiAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vaGFsK2pzb24nKTtcbiAgeGhyLnNlbmQoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROb2RlcztcbiIsIi8qZ2xvYmFsIERydXBhbCwgZG9tcmVhZHkgKi9cbid1c2Ugc3RyaWN0JztcbnZhciBiYXNlVXJsID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSArIHdpbmRvdy5sb2NhdGlvbi5wb3J0ICsgRHJ1cGFsLnVybCgnJyk7XG52YXIgVHdpZyA9IHJlcXVpcmUoJ3R3aWcvdHdpZycpO1xudmFyIHR3aWcgPSBUd2lnLnR3aWc7XG5yZXF1aXJlKCd0d2lnanMtcGFzc3Rocm91Z2gnKShUd2lnKTtcbnJlcXVpcmUoJ3R3aWdqcy13aXRob3V0JykoVHdpZyk7XG5yZXF1aXJlKCd0d2lnanMtdHJhbnMnKShUd2lnKTtcblxudmFyIGdldE5vZGVzID0gcmVxdWlyZSgnLi9nZXROb2RlcycpO1xuXG4vLyBUZW1wbGF0ZXMgc2hvdWxkIGlkZWFsbHkgYmUgZmV0Y2hlZCB3aGVuIG5lZWRlZCwgYnV0IHRoaXMgaXMgUE9DLCByaWdodD9cblxudmFyIG5vZGVUZW1wbGF0ZSA9IEJ1ZmZlcihcImV5TUtMeW9xQ2lBcUlFQm1hV3hsQ2lBcUx3b2pmUW84WVhKMGFXTnNaWHQ3SUdGMGRISnBZblYwWlhNdVlXUmtRMnhoYzNNb1kyeGhjM05sY3lrZ2ZYMCtDZ29nSUR4b1pXRmtaWEkrQ2lBZ0lDQjdleUIwYVhSc1pWOXdjbVZtYVhnZ2ZYMEtJQ0FnSUhzbElHbG1JRzV2ZENCd1lXZGxJQ1Y5Q2lBZ0lDQWdJRHhvTWlCamJHRnpjejBpYm05a1pWOWZkR2wwYkdVaVBnb2dJQ0FnSUNBZ0lEeGhJR2h5WldZOUludDdJSFZ5YkNCOWZTSWdjbVZzUFNKaWIyOXJiV0Z5YXlJK2Uzc2diR0ZpWld3Z2ZYMDhMMkUrQ2lBZ0lDQWdJRHd2YURJK0NpQWdJQ0I3SlNCbGJITmxJQ1Y5Q2lBZ0lDQWdJRHhvTWlCamJHRnpjejBpYm05a1pWOWZkR2wwYkdVaVBnb2dJQ0FnSUNBZ0lIdDdJR3hoWW1Wc0lIMTlDaUFnSUNBZ0lEd3ZhREkrQ2lBZ0lDQjdKU0JsYm1ScFppQWxmUW9nSUNBZ2Uzc2dkR2wwYkdWZmMzVm1abWw0SUgxOUNnb2dJQ0FnZXlVZ2FXWWdaR2x6Y0d4aGVWOXpkV0p0YVhSMFpXUWdKWDBLSUNBZ0lDQWdQR1JwZGlCamJHRnpjejBpYm05a1pWOWZiV1YwWVNJK0NpQWdJQ0FnSUNBZ2Uzc2dZWFYwYUc5eVgzQnBZM1IxY21VZ2ZYMEtJQ0FnSUNBZ0lDQThjM0JoYm50N0lHRjFkR2h2Y2w5aGRIUnlhV0oxZEdWeklIMTlQZ29nSUNBZ0lDQWdJQ0FnZXlVZ2RISmhibk1nSlgxVGRXSnRhWFIwWldRZ1lua2dlM3NnWVhWMGFHOXlYMjVoYldVZ2ZYMGdiMjRnZTNzZ1pHRjBaU0I5ZlhzbElHVnVaSFJ5WVc1eklDVjlDaUFnSUNBZ0lDQWdQQzl6Y0dGdVBnb2dJQ0FnSUNBZ0lIdDdJRzFsZEdGa1lYUmhJSDE5Q2lBZ0lDQWdJRHd2WkdsMlBnb2dJQ0FnZXlVZ1pXNWthV1lnSlgwS0lDQThMMmhsWVdSbGNqNEtDaUFnZXlVZ2FXWWdjR0ZuWlNBbGZRb2dJRHhrYVhZZ1kyeGhjM005SW01dlpHVmZYMk52Ym5SbGJuUWdZMnhsWVhKbWFYZ2lJSHQ3SUdOdmJuUmxiblJmWVhSMGNtbGlkWFJsY3k1aFpHUkRiR0Z6Y3lnbmJtOWtaVjlmWTI5dWRHVnVkQ2NzSUNkamJHVmhjbVpwZUNjcElIMTlQZ29nSUNBZ2Uzc2dZMjl1ZEdWdWRIeDNhWFJvYjNWMEtDZGpiMjF0Wlc1MEp5d2dKMnhwYm10ekp5a2dmWDBLSUNBOEwyUnBkajRLSUNCN0pTQmxibVJwWmlBbGZRb0tJQ0I3SlNCcFppQnViM1FnY0dGblpTQWxmUW9nSUR4a2FYWWdZMnhoYzNNOUluSmxZV1J0YjNKbExXeHBibXNpUGdvZ0lDQWdQR0VnYUhKbFpqMGllM3NnZFhKc0lIMTlJaUJ5Wld3OUltSnZiMnR0WVhKcklqNTdKU0IwY21GdWN5QWxmVkpsWVdRZ2JXOXlaWHNsSUdWdVpIUnlZVzV6SUNWOVBDOWhQZ29nSUR3dlpHbDJQZ29nSUhzbElHVnVaR2xtSUNWOUNnb2dJSHQ3SUdOdmJuUmxiblF1WTI5dGJXVnVkQ0I5ZlFvS1BDOWhjblJwWTJ4bFBnbz1cIixcImJhc2U2NFwiKTtcbnZhciB0d2lnZ2VkTm9kZSA9IHR3aWcoe1xuICBkYXRhOiBub2RlVGVtcGxhdGUudG9TdHJpbmcoKVxufSk7XG52YXIgcmVuZGVyTm9kZSA9IHJlcXVpcmUoJy4vcmVuZGVyTm9kZScpKHR3aWdnZWROb2RlLCBiYXNlVXJsKTtcbnZhciBhdHRhY2hMaXN0ZW5lcnMgPSByZXF1aXJlKCcuL2F0dGFjaExpc3RlbmVycycpO1xudmFyIGdldE5vZGVBbmRSZXR1cm4sIGdldE5vZGVzQW5kUmV0dXJuO1xuXG52YXIgc3RhdGU7XG5cbmZ1bmN0aW9uIGdldE5vZGUobmlkLCBza2lwSGlzdG9yeSkge1xuICBnZXROb2RlcyhuaWQsIGZ1bmN0aW9uIGdvdE5vZGUoZXJyLCBub2RlKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgfVxuICAgIG5vZGUucGFnZSA9IHRydWU7XG4gICAgdmFyIG91dHB1dCA9IHJlbmRlck5vZGUobm9kZSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQtYXJlYScpLmlubmVySFRNTCA9IG91dHB1dDtcbiAgICB2YXIgdGl0bGUgPSBub2RlLnRpdGxlWzBdLnZhbHVlO1xuICAgIHZhciB1cmwgPSBiYXNlVXJsICsgJ25vZGUvJyArIG5pZDtcbiAgICBpZiAoIXNraXBIaXN0b3J5KSB7XG4gICAgICBzdGF0ZSA9IHt1cmw6IHVybCwgbm9kZTogdHJ1ZSwgbmlkOiBuaWR9O1xuICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHN0YXRlLCB0aXRsZSwgdXJsKTtcbiAgICB9XG4gICAgYXR0YWNoTGlzdGVuZXJzKGdldE5vZGVzQW5kUmV0dXJuLCBnZXROb2RlQW5kUmV0dXJuKTtcbiAgfSk7XG59XG5cbmdldE5vZGVzQW5kUmV0dXJuID0gZnVuY3Rpb24oZSwgc2tpcEhpc3RvcnkpIHtcbiAgLy8gR2V0IG5vZGVzIHdpdGggMCBwYXJhbWV0ZXIgZXF1YWxzIGxpc3QuXG4gIGdldE5vZGVzKG51bGwsIGZ1bmN0aW9uIGdvdE5vZGVzKGVyciwgbm9kZXMpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbm9kZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG91dHB1dC5wdXNoKHJlbmRlck5vZGUobm9kZXNbaV0pKTtcbiAgICB9XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQtYXJlYScpLmlubmVySFRNTCA9IG91dHB1dC5qb2luKCcnKTtcbiAgICB2YXIgdGl0bGUgPSAnRnJvbnQgcGFnZSc7XG4gICAgdmFyIHVybCA9IGJhc2VVcmwgKyAnbm9kZSc7XG4gICAgaWYgKCFza2lwSGlzdG9yeSkge1xuICAgICAgc3RhdGUgPSB7dXJsOiB1cmwsIGxpc3Q6IHRydWV9O1xuICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHN0YXRlLCB0aXRsZSwgdXJsKTtcbiAgICB9XG4gICAgYXR0YWNoTGlzdGVuZXJzKGdldE5vZGVzQW5kUmV0dXJuLCBnZXROb2RlQW5kUmV0dXJuKTtcbiAgfSk7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmdldE5vZGVBbmRSZXR1cm4gPSBmdW5jdGlvbigpIHtcbiAgLy8gSGFja2luZyB0b2dldGhlciBhIHBhcmFtZXRlciBmb3IgcmVxdWVzdGluZyB0aGUgbm9kZS5cbiAgdmFyIHVybCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gIHZhciBuaWQgPSB1cmwuc3Vic3RyKHVybC5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gIGdldE5vZGUobmlkKTtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gQXR0YWNoIGFsbCBsaXN0ZW5lcnMgb24gZG9tIHJlYWR5LlxuZG9tcmVhZHkoZnVuY3Rpb24oKSB7XG4gIGF0dGFjaExpc3RlbmVycyhnZXROb2Rlc0FuZFJldHVybiwgZ2V0Tm9kZUFuZFJldHVybik7XG4gIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24oZSkge1xuICAgIGlmIChlLnN0YXRlICYmIGUuc3RhdGUubm9kZSAmJiBlLnN0YXRlLm5pZCkge1xuICAgICAgZ2V0Tm9kZShlLnN0YXRlLm5pZCwgdHJ1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChlLnN0YXRlICYmIGUuc3RhdGUubGlzdCkge1xuICAgICAgZ2V0Tm9kZXNBbmRSZXR1cm4obnVsbCwgdHJ1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIEZhbGxiYWNrIGlzIHRvIGp1c3QgcmV1c2UgYSBnbG9iYWwgc3RhdGUgb2JqZWN0LlxuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5ub2RlICYmIHN0YXRlLm5pZCkge1xuICAgICAgZ2V0Tm9kZShzdGF0ZS5uaWQsIHRydWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUubGlzdCkge1xuICAgICAgZ2V0Tm9kZXNBbmRSZXR1cm4obnVsbCwgdHJ1ZSk7XG4gICAgfVxuICB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgbSA9IHJlcXVpcmUoJ21vbWVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHR3aWdnZWROb2RlLCBiYXNlVXJsKSB7XG4gIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgbm9kZS5sYWJlbCA9IG5vZGUudGl0bGVbMF0udmFsdWU7XG4gICAgLy8gQnJ1dGUgZm9yY2UgdGhlIFJFU1QgcmVzcG9uc2UgdG8gaW5jbHVkZSBhIGNvdXBsZSBvZiBwcm9wZXJ0aWVzXG4gICAgLy8gdGhhdCB0aGUgbm9kZSB0ZW1wbGF0ZSB3YW50cy5cbiAgICBub2RlLmRpc3BsYXlfc3VibWl0dGVkID0gdHJ1ZTtcbiAgICBub2RlLnVybCA9IG5vZGUuX2xpbmtzLnNlbGYuaHJlZjtcbiAgICBub2RlLmF1dGhvcl9uYW1lID0gJ0Fub255bW91cyAobm90IHZlcmlmaWVkKSc7XG4gICAgbm9kZS5jb250ZW50ID0ge1xuICAgICAgbGlua3M6ICd0ZXN0JyxcbiAgICAgIGZpZWxkX2ltYWdlOiBub2RlLl9saW5rc1tiYXNlVXJsICsgJ3Jlc3QvcmVsYXRpb24vbm9kZS9hcnRpY2xlL2ZpZWxkX2ltYWdlJ10gPyAnPGRpdiBjbGFzcz1cImZpZWxkIGZpZWxkLW5vZGUtLWZpZWxkLWltYWdlIGZpZWxkLW5hbWUtZmllbGQtaW1hZ2UgZmllbGQtdHlwZS1pbWFnZSBmaWVsZC1sYWJlbC1oaWRkZW5cIj48ZGl2IGNsYXNzPVwiZmllbGQtaXRlbXNcIj48ZGl2IGNsYXNzPVwiZmllbGQtaXRlbVwiPjxpbWcgc3JjPVwiJyArIG5vZGUuX2xpbmtzW2Jhc2VVcmwgKyAncmVzdC9yZWxhdGlvbi9ub2RlL2FydGljbGUvZmllbGRfaW1hZ2UnXVswXS5ocmVmICsgJ1wiPjwvZGl2PjwvZGl2PjwvZGl2PicgOiAnJyxcbiAgICAgIGJvZHk6IG5vZGUuYm9keVswXS52YWx1ZS5zcGxpdChcIlxcblwiKS5qb2luKFwiPGJyPlwiKVxuICAgIH07XG4gICAgbm9kZS5jb250ZW50X2F0dHJpYnV0ZXMgPSAnJztcbiAgICBub2RlLmRhdGUgPSBtKHBhcnNlSW50KG5vZGUuY3JlYXRlZFswXS52YWx1ZSwgMTApICogMTAwMCkuZm9ybWF0KCdkZGQsIE1NL0REL1lZWVkgLSBISDptbScpO1xuICAgIHJldHVybiB0d2lnZ2VkTm9kZS5yZW5kZXIobm9kZSk7XG4gIH07XG59O1xuIixudWxsLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzLWFycmF5JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbnZhciByb290UGFyZW50ID0ge31cblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogRHVlIHRvIHZhcmlvdXMgYnJvd3NlciBidWdzLCBzb21ldGltZXMgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiB3aWxsIGJlIHVzZWQgZXZlblxuICogd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0eXBlZCBhcnJheXMuXG4gKlxuICogTm90ZTpcbiAqXG4gKiAgIC0gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLFxuICogICAgIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4LlxuICpcbiAqICAgLSBTYWZhcmkgNS03IGxhY2tzIHN1cHBvcnQgZm9yIGNoYW5naW5nIHRoZSBgT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvcmAgcHJvcGVydHlcbiAqICAgICBvbiBvYmplY3RzLlxuICpcbiAqICAgLSBDaHJvbWUgOS0xMCBpcyBtaXNzaW5nIHRoZSBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uLlxuICpcbiAqICAgLSBJRTEwIGhhcyBhIGJyb2tlbiBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYXJyYXlzIG9mXG4gKiAgICAgaW5jb3JyZWN0IGxlbmd0aCBpbiBzb21lIHNpdHVhdGlvbnMuXG5cbiAqIFdlIGRldGVjdCB0aGVzZSBidWdneSBicm93c2VycyBhbmQgc2V0IGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGAgdG8gYGZhbHNlYCBzbyB0aGV5XG4gKiBnZXQgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggaXMgc2xvd2VyIGJ1dCBiZWhhdmVzIGNvcnJlY3RseS5cbiAqL1xuQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgPSBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVCAhPT0gdW5kZWZpbmVkXG4gID8gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgOiB0eXBlZEFycmF5U3VwcG9ydCgpXG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgZnVuY3Rpb24gQmFyICgpIHt9XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICBhcnIuY29uc3RydWN0b3IgPSBCYXJcbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MiAmJiAvLyB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZFxuICAgICAgICBhcnIuY29uc3RydWN0b3IgPT09IEJhciAmJiAvLyBjb25zdHJ1Y3RvciBjYW4gYmUgc2V0XG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKGFyZykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIC8vIEF2b2lkIGdvaW5nIHRocm91Z2ggYW4gQXJndW1lbnRzQWRhcHRvclRyYW1wb2xpbmUgaW4gdGhlIGNvbW1vbiBjYXNlLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkgcmV0dXJuIG5ldyBCdWZmZXIoYXJnLCBhcmd1bWVudHNbMV0pXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoYXJnKVxuICB9XG5cbiAgdGhpcy5sZW5ndGggPSAwXG4gIHRoaXMucGFyZW50ID0gdW5kZWZpbmVkXG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBmcm9tTnVtYmVyKHRoaXMsIGFyZylcbiAgfVxuXG4gIC8vIFNsaWdodGx5IGxlc3MgY29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHRoaXMsIGFyZywgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiAndXRmOCcpXG4gIH1cblxuICAvLyBVbnVzdWFsLlxuICByZXR1cm4gZnJvbU9iamVjdCh0aGlzLCBhcmcpXG59XG5cbmZ1bmN0aW9uIGZyb21OdW1iZXIgKHRoYXQsIGxlbmd0aCkge1xuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGxlbmd0aCkgfCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAodGhhdCwgc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgLy8gQXNzdW1wdGlvbjogYnl0ZUxlbmd0aCgpIHJldHVybiB2YWx1ZSBpcyBhbHdheXMgPCBrTWF4TGVuZ3RoLlxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcblxuICB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iamVjdCkge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iamVjdCkpIHJldHVybiBmcm9tQnVmZmVyKHRoYXQsIG9iamVjdClcblxuICBpZiAoaXNBcnJheShvYmplY3QpKSByZXR1cm4gZnJvbUFycmF5KHRoYXQsIG9iamVjdClcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHN0YXJ0IHdpdGggbnVtYmVyLCBidWZmZXIsIGFycmF5IG9yIHN0cmluZycpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChvYmplY3QuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBmcm9tVHlwZWRBcnJheSh0aGF0LCBvYmplY3QpXG4gICAgfVxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCBvYmplY3QpXG4gICAgfVxuICB9XG5cbiAgaWYgKG9iamVjdC5sZW5ndGgpIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iamVjdClcblxuICByZXR1cm4gZnJvbUpzb25PYmplY3QodGhhdCwgb2JqZWN0KVxufVxuXG5mdW5jdGlvbiBmcm9tQnVmZmVyICh0aGF0LCBidWZmZXIpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYnVmZmVyLmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGgpXG4gIGJ1ZmZlci5jb3B5KHRoYXQsIDAsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5ICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLy8gRHVwbGljYXRlIG9mIGZyb21BcnJheSgpIHRvIGtlZXAgZnJvbUFycmF5KCkgbW9ub21vcnBoaWMuXG5mdW5jdGlvbiBmcm9tVHlwZWRBcnJheSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgLy8gVHJ1bmNhdGluZyB0aGUgZWxlbWVudHMgaXMgcHJvYmFibHkgbm90IHdoYXQgcGVvcGxlIGV4cGVjdCBmcm9tIHR5cGVkXG4gIC8vIGFycmF5cyB3aXRoIEJZVEVTX1BFUl9FTEVNRU5UID4gMSBidXQgaXQncyBjb21wYXRpYmxlIHdpdGggdGhlIGJlaGF2aW9yXG4gIC8vIG9mIHRoZSBvbGQgQnVmZmVyIGNvbnN0cnVjdG9yLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSkge1xuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBhcnJheS5ieXRlTGVuZ3RoXG4gICAgdGhhdCA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShhcnJheSkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tVHlwZWRBcnJheSh0aGF0LCBuZXcgVWludDhBcnJheShhcnJheSkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbi8vIERlc2VyaWFsaXplIHsgdHlwZTogJ0J1ZmZlcicsIGRhdGE6IFsxLDIsMywuLi5dIH0gaW50byBhIEJ1ZmZlciBvYmplY3QuXG4vLyBSZXR1cm5zIGEgemVyby1sZW5ndGggYnVmZmVyIGZvciBpbnB1dHMgdGhhdCBkb24ndCBjb25mb3JtIHRvIHRoZSBzcGVjLlxuZnVuY3Rpb24gZnJvbUpzb25PYmplY3QgKHRoYXQsIG9iamVjdCkge1xuICB2YXIgYXJyYXlcbiAgdmFyIGxlbmd0aCA9IDBcblxuICBpZiAob2JqZWN0LnR5cGUgPT09ICdCdWZmZXInICYmIGlzQXJyYXkob2JqZWN0LmRhdGEpKSB7XG4gICAgYXJyYXkgPSBvYmplY3QuZGF0YVxuICAgIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgfVxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxufVxuXG5mdW5jdGlvbiBhbGxvY2F0ZSAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdC5sZW5ndGggPSBsZW5ndGhcbiAgICB0aGF0Ll9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBmcm9tUG9vbCA9IGxlbmd0aCAhPT0gMCAmJiBsZW5ndGggPD0gQnVmZmVyLnBvb2xTaXplID4+PiAxXG4gIGlmIChmcm9tUG9vbCkgdGhhdC5wYXJlbnQgPSByb290UGFyZW50XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IGtNYXhMZW5ndGhgIGhlcmUgYmVjYXVzZSB0aGF0IGZhaWxzIHdoZW5cbiAgLy8gbGVuZ3RoIGlzIE5hTiAod2hpY2ggaXMgb3RoZXJ3aXNlIGNvZXJjZWQgdG8gemVyby4pXG4gIGlmIChsZW5ndGggPj0ga01heExlbmd0aCgpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gYWxsb2NhdGUgQnVmZmVyIGxhcmdlciB0aGFuIG1heGltdW0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3NpemU6IDB4JyArIGtNYXhMZW5ndGgoKS50b1N0cmluZygxNikgKyAnIGJ5dGVzJylcbiAgfVxuICByZXR1cm4gbGVuZ3RoIHwgMFxufVxuXG5mdW5jdGlvbiBTbG93QnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU2xvd0J1ZmZlcikpIHJldHVybiBuZXcgU2xvd0J1ZmZlcihzdWJqZWN0LCBlbmNvZGluZylcblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZylcbiAgZGVsZXRlIGJ1Zi5wYXJlbnRcbiAgcmV0dXJuIGJ1ZlxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYSkgfHwgIUJ1ZmZlci5pc0J1ZmZlcihiKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyBtdXN0IGJlIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgdmFyIGkgPSAwXG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSBicmVha1xuXG4gICAgKytpXG4gIH1cblxuICBpZiAoaSAhPT0gbGVuKSB7XG4gICAgeCA9IGFbaV1cbiAgICB5ID0gYltpXVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdsaXN0IGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycy4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykgc3RyaW5nID0gJycgKyBzdHJpbmdcblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAobGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIC8vIERlcHJlY2F0ZWRcbiAgICAgIGNhc2UgJ3Jhdyc6XG4gICAgICBjYXNlICdyYXdzJzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbi8vIHByZS1zZXQgZm9yIHZhbHVlcyB0aGF0IG1heSBleGlzdCBpbiB0aGUgZnV0dXJlXG5CdWZmZXIucHJvdG90eXBlLmxlbmd0aCA9IHVuZGVmaW5lZFxuQnVmZmVyLnByb3RvdHlwZS5wYXJlbnQgPSB1bmRlZmluZWRcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIHN0YXJ0ID0gc3RhcnQgfCAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA9PT0gSW5maW5pdHkgPyB0aGlzLmxlbmd0aCA6IGVuZCB8IDBcblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoZW5kIDw9IHN0YXJ0KSByZXR1cm4gJydcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBiaW5hcnlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkubWF0Y2goLy57Mn0vZykuam9pbignICcpXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIDBcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCkge1xuICBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIGJ5dGVPZmZzZXQgPj49IDBcblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVybiAtMVxuICBpZiAoYnl0ZU9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuIC0xXG5cbiAgLy8gTmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBNYXRoLm1heCh0aGlzLmxlbmd0aCArIGJ5dGVPZmZzZXQsIDApXG5cbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHJldHVybiAtMSAvLyBzcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZyBhbHdheXMgZmFpbHNcbiAgICByZXR1cm4gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mLmNhbGwodGhpcywgdmFsLCBieXRlT2Zmc2V0KVxuICB9XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIHJldHVybiBhcnJheUluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0KVxuICB9XG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHRoaXMsIHZhbCwgYnl0ZU9mZnNldClcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZih0aGlzLCBbIHZhbCBdLCBieXRlT2Zmc2V0KVxuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCkge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKHZhciBpID0gMDsgYnl0ZU9mZnNldCArIGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhcnJbYnl0ZU9mZnNldCArIGldID09PSB2YWxbZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXhdKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsLmxlbmd0aCkgcmV0dXJuIGJ5dGVPZmZzZXQgKyBmb3VuZEluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG4vLyBgZ2V0YCBpcyBkZXByZWNhdGVkXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCBpcyBkZXByZWNhdGVkXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuZnVuY3Rpb24gaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAoc3RyTGVuICUgMiAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihwYXJzZWQpKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoIHwgMFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdhdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICB2YXIgcmVzID0gW11cblxuICB2YXIgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgdmFyIGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIHZhciBjb2RlUG9pbnQgPSBudWxsXG4gICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRikgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKSA/IDNcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4QkYpID8gMlxuICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICB2YXIgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG52YXIgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIHZhciBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBiaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSArIDFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIHZhciBuZXdCdWZcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgbmV3QnVmID0gQnVmZmVyLl9hdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH1cblxuICBpZiAobmV3QnVmLmxlbmd0aCkgbmV3QnVmLnBhcmVudCA9IHRoaXMucGFyZW50IHx8IHRoaXNcblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICB2YXIgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2J1ZmZlciBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndmFsdWUgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignaW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCksIDApXG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCksIDApXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSAwXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSB2YWx1ZSA8IDAgPyAxIDogMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IHZhbHVlIDwgMCA/IDEgOiAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3ZhbHVlIGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignaW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiB3cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcbiAgdmFyIGlcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHN0YXJ0IDwgdGFyZ2V0U3RhcnQgJiYgdGFyZ2V0U3RhcnQgPCBlbmQpIHtcbiAgICAvLyBkZXNjZW5kaW5nIGNvcHkgZnJvbSBlbmRcbiAgICBmb3IgKGkgPSBsZW4gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSBpZiAobGVuIDwgMTAwMCB8fCAhQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBhc2NlbmRpbmcgY29weSBmcm9tIHN0YXJ0XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuX3NldCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksIHRhcmdldFN0YXJ0KVxuICB9XG5cbiAgcmV0dXJuIGxlblxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uIGZpbGwgKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIHRoaXNbaV0gPSB2YWx1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSB1dGY4VG9CeXRlcyh2YWx1ZS50b1N0cmluZygpKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICB0aGlzW2ldID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiB0b0FycmF5QnVmZmVyICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICB9XG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiBfYXVnbWVudCAoYXJyKSB7XG4gIGFyci5jb25zdHJ1Y3RvciA9IEJ1ZmZlclxuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgc2V0IG1ldGhvZCBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZFxuICBhcnIuZ2V0ID0gQlAuZ2V0XG4gIGFyci5zZXQgPSBCUC5zZXRcblxuICBhcnIud3JpdGUgPSBCUC53cml0ZVxuICBhcnIudG9TdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9KU09OID0gQlAudG9KU09OXG4gIGFyci5lcXVhbHMgPSBCUC5lcXVhbHNcbiAgYXJyLmNvbXBhcmUgPSBCUC5jb21wYXJlXG4gIGFyci5pbmRleE9mID0gQlAuaW5kZXhPZlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50TEUgPSBCUC5yZWFkVUludExFXG4gIGFyci5yZWFkVUludEJFID0gQlAucmVhZFVJbnRCRVxuICBhcnIucmVhZFVJbnQ4ID0gQlAucmVhZFVJbnQ4XG4gIGFyci5yZWFkVUludDE2TEUgPSBCUC5yZWFkVUludDE2TEVcbiAgYXJyLnJlYWRVSW50MTZCRSA9IEJQLnJlYWRVSW50MTZCRVxuICBhcnIucmVhZFVJbnQzMkxFID0gQlAucmVhZFVJbnQzMkxFXG4gIGFyci5yZWFkVUludDMyQkUgPSBCUC5yZWFkVUludDMyQkVcbiAgYXJyLnJlYWRJbnRMRSA9IEJQLnJlYWRJbnRMRVxuICBhcnIucmVhZEludEJFID0gQlAucmVhZEludEJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludExFID0gQlAud3JpdGVVSW50TEVcbiAgYXJyLndyaXRlVUludEJFID0gQlAud3JpdGVVSW50QkVcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludExFID0gQlAud3JpdGVJbnRMRVxuICBhcnIud3JpdGVJbnRCRSA9IEJQLndyaXRlSW50QkVcbiAgYXJyLndyaXRlSW50OCA9IEJQLndyaXRlSW50OFxuICBhcnIud3JpdGVJbnQxNkxFID0gQlAud3JpdGVJbnQxNkxFXG4gIGFyci53cml0ZUludDE2QkUgPSBCUC53cml0ZUludDE2QkVcbiAgYXJyLndyaXRlSW50MzJMRSA9IEJQLndyaXRlSW50MzJMRVxuICBhcnIud3JpdGVJbnQzMkJFID0gQlAud3JpdGVJbnQzMkJFXG4gIGFyci53cml0ZUZsb2F0TEUgPSBCUC53cml0ZUZsb2F0TEVcbiAgYXJyLndyaXRlRmxvYXRCRSA9IEJQLndyaXRlRmxvYXRCRVxuICBhcnIud3JpdGVEb3VibGVMRSA9IEJQLndyaXRlRG91YmxlTEVcbiAgYXJyLndyaXRlRG91YmxlQkUgPSBCUC53cml0ZURvdWJsZUJFXG4gIGFyci5maWxsID0gQlAuZmlsbFxuICBhcnIuaW5zcGVjdCA9IEJQLmluc3BlY3RcbiAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCUC50b0FycmF5QnVmZmVyXG5cbiAgcmV0dXJuIGFyclxufVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSBsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwIHwgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG4iLCJ2YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXHR2YXIgUExVU19VUkxfU0FGRSA9ICctJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSF9VUkxfU0FGRSA9ICdfJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMgfHxcblx0XHQgICAgY29kZSA9PT0gUExVU19VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0ggfHxcblx0XHQgICAgY29kZSA9PT0gU0xBU0hfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0ZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gKHRoaXMuYmFzZTY0anMgPSB7fSkgOiBleHBvcnRzKSlcbiIsImV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwiXG4vKipcbiAqIGlzQXJyYXlcbiAqL1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbi8qKlxuICogdG9TdHJpbmdcbiAqL1xuXG52YXIgc3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYHZhbGBcbiAqIGlzIGFuIGFycmF5LlxuICpcbiAqIGV4YW1wbGU6XG4gKlxuICogICAgICAgIGlzQXJyYXkoW10pO1xuICogICAgICAgIC8vID4gdHJ1ZVxuICogICAgICAgIGlzQXJyYXkoYXJndW1lbnRzKTtcbiAqICAgICAgICAvLyA+IGZhbHNlXG4gKiAgICAgICAgaXNBcnJheSgnJyk7XG4gKiAgICAgICAgLy8gPiBmYWxzZVxuICpcbiAqIEBwYXJhbSB7bWl4ZWR9IHZhbFxuICogQHJldHVybiB7Ym9vbH1cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXkgfHwgZnVuY3Rpb24gKHZhbCkge1xuICByZXR1cm4gISEgdmFsICYmICdbb2JqZWN0IEFycmF5XScgPT0gc3RyLmNhbGwodmFsKTtcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTcGxpdCBhIGZpbGVuYW1lIGludG8gW3Jvb3QsIGRpciwgYmFzZW5hbWUsIGV4dF0sIHVuaXggdmVyc2lvblxuLy8gJ3Jvb3QnIGlzIGp1c3QgYSBzbGFzaCwgb3Igbm90aGluZy5cbnZhciBzcGxpdFBhdGhSZSA9XG4gICAgL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG52YXIgc3BsaXRQYXRoID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xufTtcblxuLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZXNvbHZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSAnJyxcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgIHZhciBwYXRoID0gKGkgPj0gMCkgPyBhcmd1bWVudHNbaV0gOiBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKSxcbiAgICAgIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFpc0Fic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgcGF0aCA9ICcuJztcbiAgfVxuICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgcGF0aCArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gKGlzQWJzb2x1dGUgPyAnLycgOiAnJykgKyBwYXRoO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUoZmlsdGVyKHBhdGhzLCBmdW5jdGlvbihwLCBpbmRleCkge1xuICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfVxuICAgIHJldHVybiBwO1xuICB9KS5qb2luKCcvJykpO1xufTtcblxuXG4vLyBwYXRoLnJlbGF0aXZlKGZyb20sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZWxhdGl2ZSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBleHBvcnRzLnJlc29sdmUoZnJvbSkuc3Vic3RyKDEpO1xuICB0byA9IGV4cG9ydHMucmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufTtcblxuZXhwb3J0cy5zZXAgPSAnLyc7XG5leHBvcnRzLmRlbGltaXRlciA9ICc6JztcblxuZXhwb3J0cy5kaXJuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgcmVzdWx0ID0gc3BsaXRQYXRoKHBhdGgpLFxuICAgICAgcm9vdCA9IHJlc3VsdFswXSxcbiAgICAgIGRpciA9IHJlc3VsdFsxXTtcblxuICBpZiAoIXJvb3QgJiYgIWRpcikge1xuICAgIC8vIE5vIGRpcm5hbWUgd2hhdHNvZXZlclxuICAgIHJldHVybiAnLic7XG4gIH1cblxuICBpZiAoZGlyKSB7XG4gICAgLy8gSXQgaGFzIGEgZGlybmFtZSwgc3RyaXAgdHJhaWxpbmcgc2xhc2hcbiAgICBkaXIgPSBkaXIuc3Vic3RyKDAsIGRpci5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHJldHVybiByb290ICsgZGlyO1xufTtcblxuXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24ocGF0aCwgZXh0KSB7XG4gIHZhciBmID0gc3BsaXRQYXRoKHBhdGgpWzJdO1xuICAvLyBUT0RPOiBtYWtlIHRoaXMgY29tcGFyaXNvbiBjYXNlLWluc2Vuc2l0aXZlIG9uIHdpbmRvd3M/XG4gIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIGY7XG59O1xuXG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aChwYXRoKVszXTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLy8hIG1vbWVudC5qc1xuLy8hIHZlcnNpb24gOiAyLjEwLjZcbi8vISBhdXRob3JzIDogVGltIFdvb2QsIElza3JlbiBDaGVybmV2LCBNb21lbnQuanMgY29udHJpYnV0b3JzXG4vLyEgbGljZW5zZSA6IE1JVFxuLy8hIG1vbWVudGpzLmNvbVxuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAgIGdsb2JhbC5tb21lbnQgPSBmYWN0b3J5KClcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgaG9va0NhbGxiYWNrO1xuXG4gICAgZnVuY3Rpb24gdXRpbHNfaG9va3NfX2hvb2tzICgpIHtcbiAgICAgICAgcmV0dXJuIGhvb2tDYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgaXMgZG9uZSB0byByZWdpc3RlciB0aGUgbWV0aG9kIGNhbGxlZCB3aXRoIG1vbWVudCgpXG4gICAgLy8gd2l0aG91dCBjcmVhdGluZyBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG4gICAgZnVuY3Rpb24gc2V0SG9va0NhbGxiYWNrIChjYWxsYmFjaykge1xuICAgICAgICBob29rQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FycmF5KGlucHV0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF0ZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgaW5zdGFuY2VvZiBEYXRlIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IERhdGVdJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXAoYXJyLCBmbikge1xuICAgICAgICB2YXIgcmVzID0gW10sIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGZuKGFycltpXSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzT3duUHJvcChhLCBiKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSwgYik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBiKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChiLCBpKSkge1xuICAgICAgICAgICAgICAgIGFbaV0gPSBiW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgICAgIGEudG9TdHJpbmcgPSBiLnRvU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3ZhbHVlT2YnKSkge1xuICAgICAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlX3V0Y19fY3JlYXRlVVRDIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgdHJ1ZSkudXRjKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdFBhcnNpbmdGbGFncygpIHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byBkZWVwIGNsb25lIHRoaXMgb2JqZWN0LlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW1wdHkgICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICB1bnVzZWRUb2tlbnMgICAgOiBbXSxcbiAgICAgICAgICAgIHVudXNlZElucHV0ICAgICA6IFtdLFxuICAgICAgICAgICAgb3ZlcmZsb3cgICAgICAgIDogLTIsXG4gICAgICAgICAgICBjaGFyc0xlZnRPdmVyICAgOiAwLFxuICAgICAgICAgICAgbnVsbElucHV0ICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBpbnZhbGlkTW9udGggICAgOiBudWxsLFxuICAgICAgICAgICAgaW52YWxpZEZvcm1hdCAgIDogZmFsc2UsXG4gICAgICAgICAgICB1c2VySW52YWxpZGF0ZWQgOiBmYWxzZSxcbiAgICAgICAgICAgIGlzbyAgICAgICAgICAgICA6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGFyc2luZ0ZsYWdzKG0pIHtcbiAgICAgICAgaWYgKG0uX3BmID09IG51bGwpIHtcbiAgICAgICAgICAgIG0uX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtLl9wZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZF9faXNWYWxpZChtKSB7XG4gICAgICAgIGlmIChtLl9pc1ZhbGlkID09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBmbGFncyA9IGdldFBhcnNpbmdGbGFncyhtKTtcbiAgICAgICAgICAgIG0uX2lzVmFsaWQgPSAhaXNOYU4obS5fZC5nZXRUaW1lKCkpICYmXG4gICAgICAgICAgICAgICAgZmxhZ3Mub3ZlcmZsb3cgPCAwICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLmVtcHR5ICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLmludmFsaWRNb250aCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5pbnZhbGlkV2Vla2RheSAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5udWxsSW5wdXQgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZEZvcm1hdCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy51c2VySW52YWxpZGF0ZWQ7XG5cbiAgICAgICAgICAgIGlmIChtLl9zdHJpY3QpIHtcbiAgICAgICAgICAgICAgICBtLl9pc1ZhbGlkID0gbS5faXNWYWxpZCAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFncy5jaGFyc0xlZnRPdmVyID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLnVudXNlZFRva2Vucy5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MuYmlnSG91ciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtLl9pc1ZhbGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkX19jcmVhdGVJbnZhbGlkIChmbGFncykge1xuICAgICAgICB2YXIgbSA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyhOYU4pO1xuICAgICAgICBpZiAoZmxhZ3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZXh0ZW5kKGdldFBhcnNpbmdGbGFncyhtKSwgZmxhZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLnVzZXJJbnZhbGlkYXRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICB2YXIgbW9tZW50UHJvcGVydGllcyA9IHV0aWxzX2hvb2tzX19ob29rcy5tb21lbnRQcm9wZXJ0aWVzID0gW107XG5cbiAgICBmdW5jdGlvbiBjb3B5Q29uZmlnKHRvLCBmcm9tKSB7XG4gICAgICAgIHZhciBpLCBwcm9wLCB2YWw7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pc0FNb21lbnRPYmplY3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faXNBTW9tZW50T2JqZWN0ID0gZnJvbS5faXNBTW9tZW50T2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pID0gZnJvbS5faTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2YgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fZiA9IGZyb20uX2Y7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9sICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2wgPSBmcm9tLl9sO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fc3RyaWN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3N0cmljdCA9IGZyb20uX3N0cmljdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3R6bSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl90em0gPSBmcm9tLl90em07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pc1VUQyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pc1VUQyA9IGZyb20uX2lzVVRDO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fb2Zmc2V0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX29mZnNldCA9IGZyb20uX29mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3BmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3BmID0gZ2V0UGFyc2luZ0ZsYWdzKGZyb20pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fbG9jYWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2xvY2FsZSA9IGZyb20uX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoaSBpbiBtb21lbnRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IG1vbWVudFByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICAgICAgdmFsID0gZnJvbVtwcm9wXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9bcHJvcF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cblxuICAgIHZhciB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG5cbiAgICAvLyBNb21lbnQgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE1vbWVudChjb25maWcpIHtcbiAgICAgICAgY29weUNvbmZpZyh0aGlzLCBjb25maWcpO1xuICAgICAgICB0aGlzLl9kID0gbmV3IERhdGUoY29uZmlnLl9kICE9IG51bGwgPyBjb25maWcuX2QuZ2V0VGltZSgpIDogTmFOKTtcbiAgICAgICAgLy8gUHJldmVudCBpbmZpbml0ZSBsb29wIGluIGNhc2UgdXBkYXRlT2Zmc2V0IGNyZWF0ZXMgbmV3IG1vbWVudFxuICAgICAgICAvLyBvYmplY3RzLlxuICAgICAgICBpZiAodXBkYXRlSW5Qcm9ncmVzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTW9tZW50IChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIE1vbWVudCB8fCAob2JqICE9IG51bGwgJiYgb2JqLl9pc0FNb21lbnRPYmplY3QgIT0gbnVsbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzRmxvb3IgKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSW50KGFyZ3VtZW50Rm9yQ29lcmNpb24pIHtcbiAgICAgICAgdmFyIGNvZXJjZWROdW1iZXIgPSArYXJndW1lbnRGb3JDb2VyY2lvbixcbiAgICAgICAgICAgIHZhbHVlID0gMDtcblxuICAgICAgICBpZiAoY29lcmNlZE51bWJlciAhPT0gMCAmJiBpc0Zpbml0ZShjb2VyY2VkTnVtYmVyKSkge1xuICAgICAgICAgICAgdmFsdWUgPSBhYnNGbG9vcihjb2VyY2VkTnVtYmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wYXJlQXJyYXlzKGFycmF5MSwgYXJyYXkyLCBkb250Q29udmVydCkge1xuICAgICAgICB2YXIgbGVuID0gTWF0aC5taW4oYXJyYXkxLmxlbmd0aCwgYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBsZW5ndGhEaWZmID0gTWF0aC5hYnMoYXJyYXkxLmxlbmd0aCAtIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgZGlmZnMgPSAwLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKGRvbnRDb252ZXJ0ICYmIGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB8fFxuICAgICAgICAgICAgICAgICghZG9udENvbnZlcnQgJiYgdG9JbnQoYXJyYXkxW2ldKSAhPT0gdG9JbnQoYXJyYXkyW2ldKSkpIHtcbiAgICAgICAgICAgICAgICBkaWZmcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWZmcyArIGxlbmd0aERpZmY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gTG9jYWxlKCkge1xuICAgIH1cblxuICAgIHZhciBsb2NhbGVzID0ge307XG4gICAgdmFyIGdsb2JhbExvY2FsZTtcblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZUxvY2FsZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleSA/IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ18nLCAnLScpIDoga2V5O1xuICAgIH1cblxuICAgIC8vIHBpY2sgdGhlIGxvY2FsZSBmcm9tIHRoZSBhcnJheVxuICAgIC8vIHRyeSBbJ2VuLWF1JywgJ2VuLWdiJ10gYXMgJ2VuLWF1JywgJ2VuLWdiJywgJ2VuJywgYXMgaW4gbW92ZSB0aHJvdWdoIHRoZSBsaXN0IHRyeWluZyBlYWNoXG4gICAgLy8gc3Vic3RyaW5nIGZyb20gbW9zdCBzcGVjaWZpYyB0byBsZWFzdCwgYnV0IG1vdmUgdG8gdGhlIG5leHQgYXJyYXkgaXRlbSBpZiBpdCdzIGEgbW9yZSBzcGVjaWZpYyB2YXJpYW50IHRoYW4gdGhlIGN1cnJlbnQgcm9vdFxuICAgIGZ1bmN0aW9uIGNob29zZUxvY2FsZShuYW1lcykge1xuICAgICAgICB2YXIgaSA9IDAsIGosIG5leHQsIGxvY2FsZSwgc3BsaXQ7XG5cbiAgICAgICAgd2hpbGUgKGkgPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNwbGl0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2ldKS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgaiA9IHNwbGl0Lmxlbmd0aDtcbiAgICAgICAgICAgIG5leHQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaSArIDFdKTtcbiAgICAgICAgICAgIG5leHQgPSBuZXh0ID8gbmV4dC5zcGxpdCgnLScpIDogbnVsbDtcbiAgICAgICAgICAgIHdoaWxlIChqID4gMCkge1xuICAgICAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoc3BsaXQuc2xpY2UoMCwgaikuam9pbignLScpKTtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQubGVuZ3RoID49IGogJiYgY29tcGFyZUFycmF5cyhzcGxpdCwgbmV4dCwgdHJ1ZSkgPj0gaiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGUgbmV4dCBhcnJheSBpdGVtIGlzIGJldHRlciB0aGFuIGEgc2hhbGxvd2VyIHN1YnN0cmluZyBvZiB0aGlzIG9uZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRMb2NhbGUobmFtZSkge1xuICAgICAgICB2YXIgb2xkTG9jYWxlID0gbnVsbDtcbiAgICAgICAgLy8gVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVnaXN0ZXIgYW5kIGxvYWQgYWxsIHRoZSBsb2NhbGVzIGluIE5vZGVcbiAgICAgICAgaWYgKCFsb2NhbGVzW25hbWVdICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgbW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9sZExvY2FsZSA9IGdsb2JhbExvY2FsZS5fYWJicjtcbiAgICAgICAgICAgICAgICByZXF1aXJlKCcuL2xvY2FsZS8nICsgbmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBkZWZpbmVMb2NhbGUgY3VycmVudGx5IGFsc28gc2V0cyB0aGUgZ2xvYmFsIGxvY2FsZSwgd2VcbiAgICAgICAgICAgICAgICAvLyB3YW50IHRvIHVuZG8gdGhhdCBmb3IgbGF6eSBsb2FkZWQgbG9jYWxlc1xuICAgICAgICAgICAgICAgIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUob2xkTG9jYWxlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBsb2FkIGxvY2FsZSBhbmQgdGhlbiBzZXQgdGhlIGdsb2JhbCBsb2NhbGUuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnQgZ2xvYmFsXG4gICAgLy8gbG9jYWxlIGtleS5cbiAgICBmdW5jdGlvbiBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlIChrZXksIHZhbHVlcykge1xuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZXMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkZWZpbmVMb2NhbGUoa2V5LCB2YWx1ZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIG1vbWVudC5kdXJhdGlvbi5fbG9jYWxlID0gbW9tZW50Ll9sb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgICAgIGdsb2JhbExvY2FsZSA9IGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlLl9hYmJyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmluZUxvY2FsZSAobmFtZSwgdmFsdWVzKSB7XG4gICAgICAgIGlmICh2YWx1ZXMgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlcy5hYmJyID0gbmFtZTtcbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0gPSBsb2NhbGVzW25hbWVdIHx8IG5ldyBMb2NhbGUoKTtcbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0uc2V0KHZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAgICAgbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZShuYW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB1c2VmdWwgZm9yIHRlc3RpbmdcbiAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIGxvY2FsZSBkYXRhXG4gICAgZnVuY3Rpb24gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZSAoa2V5KSB7XG4gICAgICAgIHZhciBsb2NhbGU7XG5cbiAgICAgICAgaWYgKGtleSAmJiBrZXkuX2xvY2FsZSAmJiBrZXkuX2xvY2FsZS5fYWJicikge1xuICAgICAgICAgICAga2V5ID0ga2V5Ll9sb2NhbGUuX2FiYnI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbExvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAgICAvL3Nob3J0LWNpcmN1aXQgZXZlcnl0aGluZyBlbHNlXG4gICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKGtleSk7XG4gICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleSA9IFtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNob29zZUxvY2FsZShrZXkpO1xuICAgIH1cblxuICAgIHZhciBhbGlhc2VzID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRVbml0QWxpYXMgKHVuaXQsIHNob3J0aGFuZCkge1xuICAgICAgICB2YXIgbG93ZXJDYXNlID0gdW5pdC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBhbGlhc2VzW2xvd2VyQ2FzZV0gPSBhbGlhc2VzW2xvd2VyQ2FzZSArICdzJ10gPSBhbGlhc2VzW3Nob3J0aGFuZF0gPSB1bml0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdW5pdHMgPT09ICdzdHJpbmcnID8gYWxpYXNlc1t1bml0c10gfHwgYWxpYXNlc1t1bml0cy50b0xvd2VyQ2FzZSgpXSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVPYmplY3RVbml0cyhpbnB1dE9iamVjdCkge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0ge30sXG4gICAgICAgICAgICBub3JtYWxpemVkUHJvcCxcbiAgICAgICAgICAgIHByb3A7XG5cbiAgICAgICAgZm9yIChwcm9wIGluIGlucHV0T2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChpbnB1dE9iamVjdCwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcCA9IG5vcm1hbGl6ZVVuaXRzKHByb3ApO1xuICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkUHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkSW5wdXRbbm9ybWFsaXplZFByb3BdID0gaW5wdXRPYmplY3RbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRJbnB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlR2V0U2V0ICh1bml0LCBrZWVwVGltZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGdldF9zZXRfX3NldCh0aGlzLCB1bml0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCBrZWVwVGltZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRfc2V0X19nZXQodGhpcywgdW5pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0X3NldF9fZ2V0IChtb20sIHVuaXQpIHtcbiAgICAgICAgcmV0dXJuIG1vbS5fZFsnZ2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldF9zZXRfX3NldCAobW9tLCB1bml0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXQgKHVuaXRzLCB2YWx1ZSkge1xuICAgICAgICB2YXIgdW5pdDtcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGZvciAodW5pdCBpbiB1bml0cykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHVuaXQsIHVuaXRzW3VuaXRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW3VuaXRzXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gemVyb0ZpbGwobnVtYmVyLCB0YXJnZXRMZW5ndGgsIGZvcmNlU2lnbikge1xuICAgICAgICB2YXIgYWJzTnVtYmVyID0gJycgKyBNYXRoLmFicyhudW1iZXIpLFxuICAgICAgICAgICAgemVyb3NUb0ZpbGwgPSB0YXJnZXRMZW5ndGggLSBhYnNOdW1iZXIubGVuZ3RoLFxuICAgICAgICAgICAgc2lnbiA9IG51bWJlciA+PSAwO1xuICAgICAgICByZXR1cm4gKHNpZ24gPyAoZm9yY2VTaWduID8gJysnIDogJycpIDogJy0nKSArXG4gICAgICAgICAgICBNYXRoLnBvdygxMCwgTWF0aC5tYXgoMCwgemVyb3NUb0ZpbGwpKS50b1N0cmluZygpLnN1YnN0cigxKSArIGFic051bWJlcjtcbiAgICB9XG5cbiAgICB2YXIgZm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhNb3xNTT9NP00/fERvfERERG98REQ/RD9EP3xkZGQ/ZD98ZG8/fHdbb3x3XT98V1tvfFddP3xRfFlZWVlZWXxZWVlZWXxZWVlZfFlZfGdnKGdnZz8pP3xHRyhHR0c/KT98ZXxFfGF8QXxoaD98SEg/fG1tP3xzcz98U3sxLDl9fHh8WHx6ej98Wlo/fC4pL2c7XG5cbiAgICB2YXIgbG9jYWxGb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KExUU3xMVHxMTD9MP0w/fGx7MSw0fSkvZztcblxuICAgIHZhciBmb3JtYXRGdW5jdGlvbnMgPSB7fTtcblxuICAgIHZhciBmb3JtYXRUb2tlbkZ1bmN0aW9ucyA9IHt9O1xuXG4gICAgLy8gdG9rZW46ICAgICdNJ1xuICAgIC8vIHBhZGRlZDogICBbJ01NJywgMl1cbiAgICAvLyBvcmRpbmFsOiAgJ01vJ1xuICAgIC8vIGNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7IHRoaXMubW9udGgoKSArIDEgfVxuICAgIGZ1bmN0aW9uIGFkZEZvcm1hdFRva2VuICh0b2tlbiwgcGFkZGVkLCBvcmRpbmFsLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZnVuYyA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tjYWxsYmFja10oKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYWRkZWQpIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3BhZGRlZFswXV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHplcm9GaWxsKGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgcGFkZGVkWzFdLCBwYWRkZWRbMl0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3JkaW5hbCkge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbb3JkaW5hbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm9yZGluYWwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCB0b2tlbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQubWF0Y2goL1xcW1tcXHNcXFNdLykpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXFxcL2csICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgICAgIHZhciBhcnJheSA9IGZvcm1hdC5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSwgaSwgbGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGFycmF5W2ldIGluc3RhbmNlb2YgRnVuY3Rpb24gPyBhcnJheVtpXS5jYWxsKG1vbSwgZm9ybWF0KSA6IGFycmF5W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBmb3JtYXQgZGF0ZSB1c2luZyBuYXRpdmUgZGF0ZSBvYmplY3RcbiAgICBmdW5jdGlvbiBmb3JtYXRNb21lbnQobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBtLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbS5sb2NhbGVEYXRhKCkpO1xuICAgICAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSA9IGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdIHx8IG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpO1xuXG4gICAgICAgIHJldHVybiBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XShtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHBhbmRGb3JtYXQoZm9ybWF0LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGkgPSA1O1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2VucyhpbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5sb25nRGF0ZUZvcm1hdChpbnB1dCkgfHwgaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPj0gMCAmJiBsb2NhbEZvcm1hdHRpbmdUb2tlbnMudGVzdChmb3JtYXQpKSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShsb2NhbEZvcm1hdHRpbmdUb2tlbnMsIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2Vucyk7XG4gICAgICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgfVxuXG4gICAgdmFyIG1hdGNoMSAgICAgICAgID0gL1xcZC87ICAgICAgICAgICAgLy8gICAgICAgMCAtIDlcbiAgICB2YXIgbWF0Y2gyICAgICAgICAgPSAvXFxkXFxkLzsgICAgICAgICAgLy8gICAgICAwMCAtIDk5XG4gICAgdmFyIG1hdGNoMyAgICAgICAgID0gL1xcZHszfS87ICAgICAgICAgLy8gICAgIDAwMCAtIDk5OVxuICAgIHZhciBtYXRjaDQgICAgICAgICA9IC9cXGR7NH0vOyAgICAgICAgIC8vICAgIDAwMDAgLSA5OTk5XG4gICAgdmFyIG1hdGNoNiAgICAgICAgID0gL1srLV0/XFxkezZ9LzsgICAgLy8gLTk5OTk5OSAtIDk5OTk5OVxuICAgIHZhciBtYXRjaDF0bzIgICAgICA9IC9cXGRcXGQ/LzsgICAgICAgICAvLyAgICAgICAwIC0gOTlcbiAgICB2YXIgbWF0Y2gxdG8zICAgICAgPSAvXFxkezEsM30vOyAgICAgICAvLyAgICAgICAwIC0gOTk5XG4gICAgdmFyIG1hdGNoMXRvNCAgICAgID0gL1xcZHsxLDR9LzsgICAgICAgLy8gICAgICAgMCAtIDk5OTlcbiAgICB2YXIgbWF0Y2gxdG82ICAgICAgPSAvWystXT9cXGR7MSw2fS87ICAvLyAtOTk5OTk5IC0gOTk5OTk5XG5cbiAgICB2YXIgbWF0Y2hVbnNpZ25lZCAgPSAvXFxkKy87ICAgICAgICAgICAvLyAgICAgICAwIC0gaW5mXG4gICAgdmFyIG1hdGNoU2lnbmVkICAgID0gL1srLV0/XFxkKy87ICAgICAgLy8gICAgLWluZiAtIGluZlxuXG4gICAgdmFyIG1hdGNoT2Zmc2V0ICAgID0gL1p8WystXVxcZFxcZDo/XFxkXFxkL2dpOyAvLyArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcblxuICAgIHZhciBtYXRjaFRpbWVzdGFtcCA9IC9bKy1dP1xcZCsoXFwuXFxkezEsM30pPy87IC8vIDEyMzQ1Njc4OSAxMjM0NTY3ODkuMTIzXG5cbiAgICAvLyBhbnkgd29yZCAob3IgdHdvKSBjaGFyYWN0ZXJzIG9yIG51bWJlcnMgaW5jbHVkaW5nIHR3by90aHJlZSB3b3JkIG1vbnRoIGluIGFyYWJpYy5cbiAgICB2YXIgbWF0Y2hXb3JkID0gL1swLTldKlsnYS16XFx1MDBBMC1cXHUwNUZGXFx1MDcwMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSt8W1xcdTA2MDAtXFx1MDZGRlxcL10rKFxccyo/W1xcdTA2MDAtXFx1MDZGRl0rKXsxLDJ9L2k7XG5cbiAgICB2YXIgcmVnZXhlcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbiAoc3RoKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8yMzI1XG4gICAgICAgIHJldHVybiB0eXBlb2Ygc3RoID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3RoKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGFkZFJlZ2V4VG9rZW4gKHRva2VuLCByZWdleCwgc3RyaWN0UmVnZXgpIHtcbiAgICAgICAgcmVnZXhlc1t0b2tlbl0gPSBpc0Z1bmN0aW9uKHJlZ2V4KSA/IHJlZ2V4IDogZnVuY3Rpb24gKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gKGlzU3RyaWN0ICYmIHN0cmljdFJlZ2V4KSA/IHN0cmljdFJlZ2V4IDogcmVnZXg7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGFyc2VSZWdleEZvclRva2VuICh0b2tlbiwgY29uZmlnKSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcChyZWdleGVzLCB0b2tlbikpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHVuZXNjYXBlRm9ybWF0KHRva2VuKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVnZXhlc1t0b2tlbl0oY29uZmlnLl9zdHJpY3QsIGNvbmZpZy5fbG9jYWxlKTtcbiAgICB9XG5cbiAgICAvLyBDb2RlIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNTYxNDkzL2lzLXRoZXJlLWEtcmVnZXhwLWVzY2FwZS1mdW5jdGlvbi1pbi1qYXZhc2NyaXB0XG4gICAgZnVuY3Rpb24gdW5lc2NhcGVGb3JtYXQocykge1xuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKCdcXFxcJywgJycpLnJlcGxhY2UoL1xcXFwoXFxbKXxcXFxcKFxcXSl8XFxbKFteXFxdXFxbXSopXFxdfFxcXFwoLikvZywgZnVuY3Rpb24gKG1hdGNoZWQsIHAxLCBwMiwgcDMsIHA0KSB7XG4gICAgICAgICAgICByZXR1cm4gcDEgfHwgcDIgfHwgcDMgfHwgcDQ7XG4gICAgICAgIH0pLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICAgIH1cblxuICAgIHZhciB0b2tlbnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGFkZFBhcnNlVG9rZW4gKHRva2VuLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgaSwgZnVuYyA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAodHlwZW9mIHRva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdG9rZW4gPSBbdG9rZW5dO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBmdW5jID0gZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2NhbGxiYWNrXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2VuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b2tlbnNbdG9rZW5baV1dID0gZnVuYztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFdlZWtQYXJzZVRva2VuICh0b2tlbiwgY2FsbGJhY2spIHtcbiAgICAgICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgY2FsbGJhY2soaW5wdXQsIGNvbmZpZy5fdywgY29uZmlnLCB0b2tlbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBpbnB1dCwgY29uZmlnKSB7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsICYmIGhhc093blByb3AodG9rZW5zLCB0b2tlbikpIHtcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbl0oaW5wdXQsIGNvbmZpZy5fYSwgY29uZmlnLCB0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgWUVBUiA9IDA7XG4gICAgdmFyIE1PTlRIID0gMTtcbiAgICB2YXIgREFURSA9IDI7XG4gICAgdmFyIEhPVVIgPSAzO1xuICAgIHZhciBNSU5VVEUgPSA0O1xuICAgIHZhciBTRUNPTkQgPSA1O1xuICAgIHZhciBNSUxMSVNFQ09ORCA9IDY7XG5cbiAgICBmdW5jdGlvbiBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGggKyAxLCAwKSkuZ2V0VVRDRGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNJywgWydNTScsIDJdLCAnTW8nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbnRoKCkgKyAxO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ01NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRoc1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignTU1NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRocyh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtb250aCcsICdNJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdNJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTScsICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTScsICBtYXRjaFdvcmQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTU0nLCBtYXRjaFdvcmQpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ00nLCAnTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNT05USF0gPSB0b0ludChpbnB1dCkgLSAxO1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ01NTScsICdNTU1NJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgdmFyIG1vbnRoID0gY29uZmlnLl9sb2NhbGUubW9udGhzUGFyc2UoaW5wdXQsIHRva2VuLCBjb25maWcuX3N0cmljdCk7XG4gICAgICAgIC8vIGlmIHdlIGRpZG4ndCBmaW5kIGEgbW9udGggbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkLlxuICAgICAgICBpZiAobW9udGggIT0gbnVsbCkge1xuICAgICAgICAgICAgYXJyYXlbTU9OVEhdID0gbW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkTW9udGggPSBpbnB1dDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNb250aHMgPSAnSmFudWFyeV9GZWJydWFyeV9NYXJjaF9BcHJpbF9NYXlfSnVuZV9KdWx5X0F1Z3VzdF9TZXB0ZW1iZXJfT2N0b2Jlcl9Ob3ZlbWJlcl9EZWNlbWJlcicuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHMgKG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1ttLm1vbnRoKCldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQgPSAnSmFuX0ZlYl9NYXJfQXByX01heV9KdW5fSnVsX0F1Z19TZXBfT2N0X05vdl9EZWMnLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzU2hvcnQgKG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1Nob3J0W20ubW9udGgoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzUGFyc2UgKG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgbW9tID0gY3JlYXRlX3V0Y19fY3JlYXRlVVRDKFsyMDAwLCBpXSk7XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzdHJpY3QgJiYgIXRoaXMuX21vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKSArICd8XicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NTScgJiYgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NJyAmJiB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc3RyaWN0ICYmIHRoaXMuX21vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gc2V0TW9udGggKG1vbSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGRheU9mTW9udGg7XG5cbiAgICAgICAgLy8gVE9ETzogTW92ZSB0aGlzIG91dCBvZiBoZXJlIVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFsdWUgPSBtb20ubG9jYWxlRGF0YSgpLm1vbnRoc1BhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgIC8vIFRPRE86IEFub3RoZXIgc2lsZW50IGZhaWx1cmU/XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb207XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkYXlPZk1vbnRoID0gTWF0aC5taW4obW9tLmRhdGUoKSwgZGF5c0luTW9udGgobW9tLnllYXIoKSwgdmFsdWUpKTtcbiAgICAgICAgbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArICdNb250aCddKHZhbHVlLCBkYXlPZk1vbnRoKTtcbiAgICAgICAgcmV0dXJuIG1vbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRNb250aCAodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHNldE1vbnRoKHRoaXMsIHZhbHVlKTtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRfc2V0X19nZXQodGhpcywgJ01vbnRoJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXlzSW5Nb250aCAoKSB7XG4gICAgICAgIHJldHVybiBkYXlzSW5Nb250aCh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja092ZXJmbG93IChtKSB7XG4gICAgICAgIHZhciBvdmVyZmxvdztcbiAgICAgICAgdmFyIGEgPSBtLl9hO1xuXG4gICAgICAgIGlmIChhICYmIGdldFBhcnNpbmdGbGFncyhtKS5vdmVyZmxvdyA9PT0gLTIpIHtcbiAgICAgICAgICAgIG92ZXJmbG93ID1cbiAgICAgICAgICAgICAgICBhW01PTlRIXSAgICAgICA8IDAgfHwgYVtNT05USF0gICAgICAgPiAxMSAgPyBNT05USCA6XG4gICAgICAgICAgICAgICAgYVtEQVRFXSAgICAgICAgPCAxIHx8IGFbREFURV0gICAgICAgID4gZGF5c0luTW9udGgoYVtZRUFSXSwgYVtNT05USF0pID8gREFURSA6XG4gICAgICAgICAgICAgICAgYVtIT1VSXSAgICAgICAgPCAwIHx8IGFbSE9VUl0gICAgICAgID4gMjQgfHwgKGFbSE9VUl0gPT09IDI0ICYmIChhW01JTlVURV0gIT09IDAgfHwgYVtTRUNPTkRdICE9PSAwIHx8IGFbTUlMTElTRUNPTkRdICE9PSAwKSkgPyBIT1VSIDpcbiAgICAgICAgICAgICAgICBhW01JTlVURV0gICAgICA8IDAgfHwgYVtNSU5VVEVdICAgICAgPiA1OSAgPyBNSU5VVEUgOlxuICAgICAgICAgICAgICAgIGFbU0VDT05EXSAgICAgIDwgMCB8fCBhW1NFQ09ORF0gICAgICA+IDU5ICA/IFNFQ09ORCA6XG4gICAgICAgICAgICAgICAgYVtNSUxMSVNFQ09ORF0gPCAwIHx8IGFbTUlMTElTRUNPTkRdID4gOTk5ID8gTUlMTElTRUNPTkQgOlxuICAgICAgICAgICAgICAgIC0xO1xuXG4gICAgICAgICAgICBpZiAoZ2V0UGFyc2luZ0ZsYWdzKG0pLl9vdmVyZmxvd0RheU9mWWVhciAmJiAob3ZlcmZsb3cgPCBZRUFSIHx8IG92ZXJmbG93ID4gREFURSkpIHtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IERBVEU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhtKS5vdmVyZmxvdyA9IG92ZXJmbG93O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Fybihtc2cpIHtcbiAgICAgICAgaWYgKHV0aWxzX2hvb2tzX19ob29rcy5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPT09IGZhbHNlICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRGVwcmVjYXRpb24gd2FybmluZzogJyArIG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXByZWNhdGUobXNnLCBmbikge1xuICAgICAgICB2YXIgZmlyc3RUaW1lID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgICAgICB3YXJuKG1zZyArICdcXG4nICsgKG5ldyBFcnJvcigpKS5zdGFjayk7XG4gICAgICAgICAgICAgICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSwgZm4pO1xuICAgIH1cblxuICAgIHZhciBkZXByZWNhdGlvbnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCBtc2cpIHtcbiAgICAgICAgaWYgKCFkZXByZWNhdGlvbnNbbmFtZV0pIHtcbiAgICAgICAgICAgIHdhcm4obXNnKTtcbiAgICAgICAgICAgIGRlcHJlY2F0aW9uc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1dGlsc19ob29rc19faG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID0gZmFsc2U7XG5cbiAgICB2YXIgZnJvbV9zdHJpbmdfX2lzb1JlZ2V4ID0gL15cXHMqKD86WystXVxcZHs2fXxcXGR7NH0pLSg/OihcXGRcXGQtXFxkXFxkKXwoV1xcZFxcZCQpfChXXFxkXFxkLVxcZCl8KFxcZFxcZFxcZCkpKChUfCApKFxcZFxcZCg6XFxkXFxkKDpcXGRcXGQoXFwuXFxkKyk/KT8pPyk/KFtcXCtcXC1dXFxkXFxkKD86Oj9cXGRcXGQpP3xcXHMqWik/KT8kLztcblxuICAgIHZhciBpc29EYXRlcyA9IFtcbiAgICAgICAgWydZWVlZWVktTU0tREQnLCAvWystXVxcZHs2fS1cXGR7Mn0tXFxkezJ9L10sXG4gICAgICAgIFsnWVlZWS1NTS1ERCcsIC9cXGR7NH0tXFxkezJ9LVxcZHsyfS9dLFxuICAgICAgICBbJ0dHR0ctW1ddV1ctRScsIC9cXGR7NH0tV1xcZHsyfS1cXGQvXSxcbiAgICAgICAgWydHR0dHLVtXXVdXJywgL1xcZHs0fS1XXFxkezJ9L10sXG4gICAgICAgIFsnWVlZWS1EREQnLCAvXFxkezR9LVxcZHszfS9dXG4gICAgXTtcblxuICAgIC8vIGlzbyB0aW1lIGZvcm1hdHMgYW5kIHJlZ2V4ZXNcbiAgICB2YXIgaXNvVGltZXMgPSBbXG4gICAgICAgIFsnSEg6bW06c3MuU1NTUycsIC8oVHwgKVxcZFxcZDpcXGRcXGQ6XFxkXFxkXFwuXFxkKy9dLFxuICAgICAgICBbJ0hIOm1tOnNzJywgLyhUfCApXFxkXFxkOlxcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgWydISDptbScsIC8oVHwgKVxcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgWydISCcsIC8oVHwgKVxcZFxcZC9dXG4gICAgXTtcblxuICAgIHZhciBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKFxcLT9cXGQrKS9pO1xuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXRcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tSVNPKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgbCxcbiAgICAgICAgICAgIHN0cmluZyA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIG1hdGNoID0gZnJvbV9zdHJpbmdfX2lzb1JlZ2V4LmV4ZWMoc3RyaW5nKTtcblxuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmlzbyA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvRGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzb0RhdGVzW2ldWzFdLmV4ZWMoc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2YgPSBpc29EYXRlc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb1RpbWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29UaW1lc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hbNl0gc2hvdWxkIGJlICdUJyBvciBzcGFjZVxuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2YgKz0gKG1hdGNoWzZdIHx8ICcgJykgKyBpc29UaW1lc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0cmluZy5tYXRjaChtYXRjaE9mZnNldCkpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2YgKz0gJ1onO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdCBvciBmYWxsYmFja1xuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKSB7XG4gICAgICAgIHZhciBtYXRjaGVkID0gYXNwTmV0SnNvblJlZ2V4LmV4ZWMoY29uZmlnLl9pKTtcblxuICAgICAgICBpZiAobWF0Y2hlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK21hdGNoZWRbMV0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnRnJvbUlTTyhjb25maWcpO1xuICAgICAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50IGNvbnN0cnVjdGlvbiBmYWxscyBiYWNrIHRvIGpzIERhdGUuIFRoaXMgaXMgJyArXG4gICAgICAgICdkaXNjb3VyYWdlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHVwY29taW5nIG1ham9yICcgK1xuICAgICAgICAncmVsZWFzZS4gUGxlYXNlIHJlZmVyIHRvICcgK1xuICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MDcgZm9yIG1vcmUgaW5mby4nLFxuICAgICAgICBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShjb25maWcuX2kgKyAoY29uZmlnLl91c2VVVEMgPyAnIFVUQycgOiAnJykpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZURhdGUgKHksIG0sIGQsIGgsIE0sIHMsIG1zKSB7XG4gICAgICAgIC8vY2FuJ3QganVzdCBhcHBseSgpIHRvIGNyZWF0ZSBhIGRhdGU6XG4gICAgICAgIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODEzNDgvaW5zdGFudGlhdGluZy1hLWphdmFzY3JpcHQtb2JqZWN0LWJ5LWNhbGxpbmctcHJvdG90eXBlLWNvbnN0cnVjdG9yLWFwcGx5XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpO1xuXG4gICAgICAgIC8vdGhlIGRhdGUgY29uc3RydWN0b3IgZG9lc24ndCBhY2NlcHQgeWVhcnMgPCAxOTcwXG4gICAgICAgIGlmICh5IDwgMTk3MCkge1xuICAgICAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVVVENEYXRlICh5KSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMuYXBwbHkobnVsbCwgYXJndW1lbnRzKSk7XG4gICAgICAgIGlmICh5IDwgMTk3MCkge1xuICAgICAgICAgICAgZGF0ZS5zZXRVVENGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZJywgICA0XSwgICAgICAgMCwgJ3llYXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVlZJywgIDVdLCAgICAgICAwLCAneWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVlZJywgNiwgdHJ1ZV0sIDAsICd5ZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3llYXInLCAneScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignWScsICAgICAgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVknLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVlZWScsIG1hdGNoMXRvNiwgbWF0Y2g2KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydZWVlZWScsICdZWVlZWVknXSwgWUVBUik7XG4gICAgYWRkUGFyc2VUb2tlbignWVlZWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbWUVBUl0gPSBpbnB1dC5sZW5ndGggPT09IDIgPyB1dGlsc19ob29rc19faG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpIDogdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1lZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9IHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICBmdW5jdGlvbiBkYXlzSW5ZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIoeWVhcikgPyAzNjYgOiAzNjU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMZWFwWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiAoeWVhciAlIDQgPT09IDAgJiYgeWVhciAlIDEwMCAhPT0gMCkgfHwgeWVhciAlIDQwMCA9PT0gMDtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlVHdvRGlnaXRZZWFyID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0b0ludChpbnB1dCkgKyAodG9JbnQoaW5wdXQpID4gNjggPyAxOTAwIDogMjAwMCk7XG4gICAgfTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRZZWFyID0gbWFrZUdldFNldCgnRnVsbFllYXInLCBmYWxzZSk7XG5cbiAgICBmdW5jdGlvbiBnZXRJc0xlYXBZZWFyICgpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIodGhpcy55ZWFyKCkpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCd3JywgWyd3dycsIDJdLCAnd28nLCAnd2VlaycpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdXJywgWydXVycsIDJdLCAnV28nLCAnaXNvV2VlaycpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrJywgJ3cnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWsnLCAnVycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigndycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3d3JywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1cnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdXVycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsndycsICd3dycsICdXJywgJ1dXJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuLnN1YnN0cigwLCAxKV0gPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyBmaXJzdERheU9mV2VlayAgICAgICAwID0gc3VuLCA2ID0gc2F0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgdGhlIGRheSBvZiB0aGUgd2VlayB0aGF0IHN0YXJ0cyB0aGUgd2Vla1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICh1c3VhbGx5IHN1bmRheSBvciBtb25kYXkpXG4gICAgLy8gZmlyc3REYXlPZldlZWtPZlllYXIgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBmaXJzdCB3ZWVrIGlzIHRoZSB3ZWVrIHRoYXQgY29udGFpbnMgdGhlIGZpcnN0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgb2YgdGhpcyBkYXkgb2YgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAoZWcuIElTTyB3ZWVrcyB1c2UgdGh1cnNkYXkgKDQpKVxuICAgIGZ1bmN0aW9uIHdlZWtPZlllYXIobW9tLCBmaXJzdERheU9mV2VlaywgZmlyc3REYXlPZldlZWtPZlllYXIpIHtcbiAgICAgICAgdmFyIGVuZCA9IGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIC0gZmlyc3REYXlPZldlZWssXG4gICAgICAgICAgICBkYXlzVG9EYXlPZldlZWsgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIG1vbS5kYXkoKSxcbiAgICAgICAgICAgIGFkanVzdGVkTW9tZW50O1xuXG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA+IGVuZCkge1xuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrIC09IDc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF5c1RvRGF5T2ZXZWVrIDwgZW5kIC0gNykge1xuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrICs9IDc7XG4gICAgICAgIH1cblxuICAgICAgICBhZGp1c3RlZE1vbWVudCA9IGxvY2FsX19jcmVhdGVMb2NhbChtb20pLmFkZChkYXlzVG9EYXlPZldlZWssICdkJyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3ZWVrOiBNYXRoLmNlaWwoYWRqdXN0ZWRNb21lbnQuZGF5T2ZZZWFyKCkgLyA3KSxcbiAgICAgICAgICAgIHllYXI6IGFkanVzdGVkTW9tZW50LnllYXIoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIExPQ0FMRVNcblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWsgKG1vbSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihtb20sIHRoaXMuX3dlZWsuZG93LCB0aGlzLl93ZWVrLmRveSkud2VlaztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWsgPSB7XG4gICAgICAgIGRvdyA6IDAsIC8vIFN1bmRheSBpcyB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgICAgICBkb3kgOiA2ICAvLyBUaGUgd2VlayB0aGF0IGNvbnRhaW5zIEphbiAxc3QgaXMgdGhlIGZpcnN0IHdlZWsgb2YgdGhlIHllYXIuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZXZWVrICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZZZWFyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG95O1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFdlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gdGhpcy5sb2NhbGVEYXRhKCkud2Vlayh0aGlzKTtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT1dlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS53ZWVrO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0RERCcsIFsnRERERCcsIDNdLCAnREREbycsICdkYXlPZlllYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF5T2ZZZWFyJywgJ0RERCcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignREREJywgIG1hdGNoMXRvMyk7XG4gICAgYWRkUmVnZXhUb2tlbignRERERCcsIG1hdGNoMyk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ0RERCcsICdEREREJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIC8vaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JU09fd2Vla19kYXRlI0NhbGN1bGF0aW5nX2FfZGF0ZV9naXZlbl90aGVfeWVhci4yQ193ZWVrX251bWJlcl9hbmRfd2Vla2RheVxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrcyh5ZWFyLCB3ZWVrLCB3ZWVrZGF5LCBmaXJzdERheU9mV2Vla09mWWVhciwgZmlyc3REYXlPZldlZWspIHtcbiAgICAgICAgdmFyIHdlZWsxSmFuID0gNiArIGZpcnN0RGF5T2ZXZWVrIC0gZmlyc3REYXlPZldlZWtPZlllYXIsIGphblggPSBjcmVhdGVVVENEYXRlKHllYXIsIDAsIDEgKyB3ZWVrMUphbiksIGQgPSBqYW5YLmdldFVUQ0RheSgpLCBkYXlPZlllYXI7XG4gICAgICAgIGlmIChkIDwgZmlyc3REYXlPZldlZWspIHtcbiAgICAgICAgICAgIGQgKz0gNztcbiAgICAgICAgfVxuXG4gICAgICAgIHdlZWtkYXkgPSB3ZWVrZGF5ICE9IG51bGwgPyAxICogd2Vla2RheSA6IGZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgICAgIGRheU9mWWVhciA9IDEgKyB3ZWVrMUphbiArIDcgKiAod2VlayAtIDEpIC0gZCArIHdlZWtkYXk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXI6IGRheU9mWWVhciA+IDAgPyB5ZWFyIDogeWVhciAtIDEsXG4gICAgICAgICAgICBkYXlPZlllYXI6IGRheU9mWWVhciA+IDAgPyAgZGF5T2ZZZWFyIDogZGF5c0luWWVhcih5ZWFyIC0gMSkgKyBkYXlPZlllYXJcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXREYXlPZlllYXIgKGlucHV0KSB7XG4gICAgICAgIHZhciBkYXlPZlllYXIgPSBNYXRoLnJvdW5kKCh0aGlzLmNsb25lKCkuc3RhcnRPZignZGF5JykgLSB0aGlzLmNsb25lKCkuc3RhcnRPZigneWVhcicpKSAvIDg2NGU1KSArIDE7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gZGF5T2ZZZWFyIDogdGhpcy5hZGQoKGlucHV0IC0gZGF5T2ZZZWFyKSwgJ2QnKTtcbiAgICB9XG5cbiAgICAvLyBQaWNrIHRoZSBmaXJzdCBkZWZpbmVkIG9mIHR3byBvciB0aHJlZSBhcmd1bWVudHMuXG4gICAgZnVuY3Rpb24gZGVmYXVsdHMoYSwgYiwgYykge1xuICAgICAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYiAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDKSB7XG4gICAgICAgICAgICByZXR1cm4gW25vdy5nZXRVVENGdWxsWWVhcigpLCBub3cuZ2V0VVRDTW9udGgoKSwgbm93LmdldFVUQ0RhdGUoKV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtub3cuZ2V0RnVsbFllYXIoKSwgbm93LmdldE1vbnRoKCksIG5vdy5nZXREYXRlKCldO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gYXJyYXkgdG8gYSBkYXRlLlxuICAgIC8vIHRoZSBhcnJheSBzaG91bGQgbWlycm9yIHRoZSBwYXJhbWV0ZXJzIGJlbG93XG4gICAgLy8gbm90ZTogYWxsIHZhbHVlcyBwYXN0IHRoZSB5ZWFyIGFyZSBvcHRpb25hbCBhbmQgd2lsbCBkZWZhdWx0IHRvIHRoZSBsb3dlc3QgcG9zc2libGUgdmFsdWUuXG4gICAgLy8gW3llYXIsIG1vbnRoLCBkYXkgLCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmRdXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUFycmF5IChjb25maWcpIHtcbiAgICAgICAgdmFyIGksIGRhdGUsIGlucHV0ID0gW10sIGN1cnJlbnREYXRlLCB5ZWFyVG9Vc2U7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZyk7XG5cbiAgICAgICAgLy9jb21wdXRlIGRheSBvZiB0aGUgeWVhciBmcm9tIHdlZWtzIGFuZCB3ZWVrZGF5c1xuICAgICAgICBpZiAoY29uZmlnLl93ICYmIGNvbmZpZy5fYVtEQVRFXSA9PSBudWxsICYmIGNvbmZpZy5fYVtNT05USF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmIHRoZSBkYXkgb2YgdGhlIHllYXIgaXMgc2V0LCBmaWd1cmUgb3V0IHdoYXQgaXQgaXNcbiAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyKSB7XG4gICAgICAgICAgICB5ZWFyVG9Vc2UgPSBkZWZhdWx0cyhjb25maWcuX2FbWUVBUl0sIGN1cnJlbnREYXRlW1lFQVJdKTtcblxuICAgICAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyID4gZGF5c0luWWVhcih5ZWFyVG9Vc2UpKSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuX292ZXJmbG93RGF5T2ZZZWFyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0ZSA9IGNyZWF0ZVVUQ0RhdGUoeWVhclRvVXNlLCAwLCBjb25maWcuX2RheU9mWWVhcik7XG4gICAgICAgICAgICBjb25maWcuX2FbTU9OVEhdID0gZGF0ZS5nZXRVVENNb250aCgpO1xuICAgICAgICAgICAgY29uZmlnLl9hW0RBVEVdID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZWZhdWx0IHRvIGN1cnJlbnQgZGF0ZS5cbiAgICAgICAgLy8gKiBpZiBubyB5ZWFyLCBtb250aCwgZGF5IG9mIG1vbnRoIGFyZSBnaXZlbiwgZGVmYXVsdCB0byB0b2RheVxuICAgICAgICAvLyAqIGlmIGRheSBvZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBtb250aCBhbmQgeWVhclxuICAgICAgICAvLyAqIGlmIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG9ubHkgeWVhclxuICAgICAgICAvLyAqIGlmIHllYXIgaXMgZ2l2ZW4sIGRvbid0IGRlZmF1bHQgYW55dGhpbmdcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDMgJiYgY29uZmlnLl9hW2ldID09IG51bGw7ICsraSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSBjdXJyZW50RGF0ZVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFplcm8gb3V0IHdoYXRldmVyIHdhcyBub3QgZGVmYXVsdGVkLCBpbmNsdWRpbmcgdGltZVxuICAgICAgICBmb3IgKDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSAoY29uZmlnLl9hW2ldID09IG51bGwpID8gKGkgPT09IDIgPyAxIDogMCkgOiBjb25maWcuX2FbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBmb3IgMjQ6MDA6MDAuMDAwXG4gICAgICAgIGlmIChjb25maWcuX2FbSE9VUl0gPT09IDI0ICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW01JTlVURV0gPT09IDAgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbU0VDT05EXSA9PT0gMCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtNSUxMSVNFQ09ORF0gPT09IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5fbmV4dERheSA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9kID0gKGNvbmZpZy5fdXNlVVRDID8gY3JlYXRlVVRDRGF0ZSA6IGNyZWF0ZURhdGUpLmFwcGx5KG51bGwsIGlucHV0KTtcbiAgICAgICAgLy8gQXBwbHkgdGltZXpvbmUgb2Zmc2V0IGZyb20gaW5wdXQuIFRoZSBhY3R1YWwgdXRjT2Zmc2V0IGNhbiBiZSBjaGFuZ2VkXG4gICAgICAgIC8vIHdpdGggcGFyc2Vab25lLlxuICAgICAgICBpZiAoY29uZmlnLl90em0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSAtIGNvbmZpZy5fdHptKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcuX25leHREYXkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDI0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZykge1xuICAgICAgICB2YXIgdywgd2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95LCB0ZW1wO1xuXG4gICAgICAgIHcgPSBjb25maWcuX3c7XG4gICAgICAgIGlmICh3LkdHICE9IG51bGwgfHwgdy5XICE9IG51bGwgfHwgdy5FICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRvdyA9IDE7XG4gICAgICAgICAgICBkb3kgPSA0O1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBXZSBuZWVkIHRvIHRha2UgdGhlIGN1cnJlbnQgaXNvV2Vla1llYXIsIGJ1dCB0aGF0IGRlcGVuZHMgb25cbiAgICAgICAgICAgIC8vIGhvdyB3ZSBpbnRlcnByZXQgbm93IChsb2NhbCwgdXRjLCBmaXhlZCBvZmZzZXQpLiBTbyBjcmVhdGVcbiAgICAgICAgICAgIC8vIGEgbm93IHZlcnNpb24gb2YgY3VycmVudCBjb25maWcgKHRha2UgbG9jYWwvdXRjL29mZnNldCBmbGFncywgYW5kXG4gICAgICAgICAgICAvLyBjcmVhdGUgbm93KS5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5HRywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKGxvY2FsX19jcmVhdGVMb2NhbCgpLCAxLCA0KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LlcsIDEpO1xuICAgICAgICAgICAgd2Vla2RheSA9IGRlZmF1bHRzKHcuRSwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb3cgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3c7XG4gICAgICAgICAgICBkb3kgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3k7XG5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5nZywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKGxvY2FsX19jcmVhdGVMb2NhbCgpLCBkb3csIGRveSkueWVhcik7XG4gICAgICAgICAgICB3ZWVrID0gZGVmYXVsdHMody53LCAxKTtcblxuICAgICAgICAgICAgaWYgKHcuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gd2Vla2RheSAtLSBsb3cgZGF5IG51bWJlcnMgYXJlIGNvbnNpZGVyZWQgbmV4dCB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IHcuZDtcbiAgICAgICAgICAgICAgICBpZiAod2Vla2RheSA8IGRvdykge1xuICAgICAgICAgICAgICAgICAgICArK3dlZWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh3LmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGxvY2FsIHdlZWtkYXkgLS0gY291bnRpbmcgc3RhcnRzIGZyb20gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmUgKyBkb3c7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSBkb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcCA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG95LCBkb3cpO1xuXG4gICAgICAgIGNvbmZpZy5fYVtZRUFSXSA9IHRlbXAueWVhcjtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0ZW1wLmRheU9mWWVhcjtcbiAgICB9XG5cbiAgICB1dGlsc19ob29rc19faG9va3MuSVNPXzg2MDEgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGZvcm1hdCBzdHJpbmdcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZykge1xuICAgICAgICAvLyBUT0RPOiBNb3ZlIHRoaXMgdG8gYW5vdGhlciBwYXJ0IG9mIHRoZSBjcmVhdGlvbiBmbG93IHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwc1xuICAgICAgICBpZiAoY29uZmlnLl9mID09PSB1dGlsc19ob29rc19faG9va3MuSVNPXzg2MDEpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21JU08oY29uZmlnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5fYSA9IFtdO1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5lbXB0eSA9IHRydWU7XG5cbiAgICAgICAgLy8gVGhpcyBhcnJheSBpcyB1c2VkIHRvIG1ha2UgYSBEYXRlLCBlaXRoZXIgd2l0aCBgbmV3IERhdGVgIG9yIGBEYXRlLlVUQ2BcbiAgICAgICAgdmFyIHN0cmluZyA9ICcnICsgY29uZmlnLl9pLFxuICAgICAgICAgICAgaSwgcGFyc2VkSW5wdXQsIHRva2VucywgdG9rZW4sIHNraXBwZWQsXG4gICAgICAgICAgICBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCA9IDA7XG5cbiAgICAgICAgdG9rZW5zID0gZXhwYW5kRm9ybWF0KGNvbmZpZy5fZiwgY29uZmlnLl9sb2NhbGUpLm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpIHx8IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgcGFyc2VkSW5wdXQgPSAoc3RyaW5nLm1hdGNoKGdldFBhcnNlUmVnZXhGb3JUb2tlbih0b2tlbiwgY29uZmlnKSkgfHwgW10pWzBdO1xuICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgc2tpcHBlZCA9IHN0cmluZy5zdWJzdHIoMCwgc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpKTtcbiAgICAgICAgICAgICAgICBpZiAoc2tpcHBlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZElucHV0LnB1c2goc2tpcHBlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5zbGljZShzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkgKyBwYXJzZWRJbnB1dC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggKz0gcGFyc2VkSW5wdXQubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG9uJ3QgcGFyc2UgaWYgaXQncyBub3QgYSBrbm93biB0b2tlblxuICAgICAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5lbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgcGFyc2VkSW5wdXQsIGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb25maWcuX3N0cmljdCAmJiAhcGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgcmVtYWluaW5nIHVucGFyc2VkIGlucHV0IGxlbmd0aCB0byB0aGUgc3RyaW5nXG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmNoYXJzTGVmdE92ZXIgPSBzdHJpbmdMZW5ndGggLSB0b3RhbFBhcnNlZElucHV0TGVuZ3RoO1xuICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZElucHV0LnB1c2goc3RyaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNsZWFyIF8xMmggZmxhZyBpZiBob3VyIGlzIDw9IDEyXG4gICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID09PSB0cnVlICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdIDw9IDEyICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID4gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBoYW5kbGUgbWVyaWRpZW1cbiAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gbWVyaWRpZW1GaXhXcmFwKGNvbmZpZy5fbG9jYWxlLCBjb25maWcuX2FbSE9VUl0sIGNvbmZpZy5fbWVyaWRpZW0pO1xuXG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgICAgICBjaGVja092ZXJmbG93KGNvbmZpZyk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbUZpeFdyYXAgKGxvY2FsZSwgaG91ciwgbWVyaWRpZW0pIHtcbiAgICAgICAgdmFyIGlzUG07XG5cbiAgICAgICAgaWYgKG1lcmlkaWVtID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIG5vdGhpbmcgdG8gZG9cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUubWVyaWRpZW1Ib3VyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUubWVyaWRpZW1Ib3VyKGhvdXIsIG1lcmlkaWVtKTtcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbGUuaXNQTSAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBGYWxsYmFja1xuICAgICAgICAgICAgaXNQbSA9IGxvY2FsZS5pc1BNKG1lcmlkaWVtKTtcbiAgICAgICAgICAgIGlmIChpc1BtICYmIGhvdXIgPCAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzUG0gJiYgaG91ciA9PT0gMTIpIHtcbiAgICAgICAgICAgICAgICBob3VyID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBub3Qgc3VwcG9zZWQgdG8gaGFwcGVuXG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmdBbmRBcnJheShjb25maWcpIHtcbiAgICAgICAgdmFyIHRlbXBDb25maWcsXG4gICAgICAgICAgICBiZXN0TW9tZW50LFxuXG4gICAgICAgICAgICBzY29yZVRvQmVhdCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRGb3JtYXQgPSB0cnVlO1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoTmFOKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb25maWcuX2YubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSA9IDA7XG4gICAgICAgICAgICB0ZW1wQ29uZmlnID0gY29weUNvbmZpZyh7fSwgY29uZmlnKTtcbiAgICAgICAgICAgIGlmIChjb25maWcuX3VzZVVUQyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGVtcENvbmZpZy5fdXNlVVRDID0gY29uZmlnLl91c2VVVEM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZW1wQ29uZmlnLl9mID0gY29uZmlnLl9mW2ldO1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdCh0ZW1wQ29uZmlnKTtcblxuICAgICAgICAgICAgaWYgKCF2YWxpZF9faXNWYWxpZCh0ZW1wQ29uZmlnKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhbnkgaW5wdXQgdGhhdCB3YXMgbm90IHBhcnNlZCBhZGQgYSBwZW5hbHR5IGZvciB0aGF0IGZvcm1hdFxuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS5jaGFyc0xlZnRPdmVyO1xuXG4gICAgICAgICAgICAvL29yIHRva2Vuc1xuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS51bnVzZWRUb2tlbnMubGVuZ3RoICogMTA7XG5cbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS5zY29yZSA9IGN1cnJlbnRTY29yZTtcblxuICAgICAgICAgICAgaWYgKHNjb3JlVG9CZWF0ID09IG51bGwgfHwgY3VycmVudFNjb3JlIDwgc2NvcmVUb0JlYXQpIHtcbiAgICAgICAgICAgICAgICBzY29yZVRvQmVhdCA9IGN1cnJlbnRTY29yZTtcbiAgICAgICAgICAgICAgICBiZXN0TW9tZW50ID0gdGVtcENvbmZpZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4dGVuZChjb25maWcsIGJlc3RNb21lbnQgfHwgdGVtcENvbmZpZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbU9iamVjdChjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSBub3JtYWxpemVPYmplY3RVbml0cyhjb25maWcuX2kpO1xuICAgICAgICBjb25maWcuX2EgPSBbaS55ZWFyLCBpLm1vbnRoLCBpLmRheSB8fCBpLmRhdGUsIGkuaG91ciwgaS5taW51dGUsIGkuc2Vjb25kLCBpLm1pbGxpc2Vjb25kXTtcblxuICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVGcm9tQ29uZmlnIChjb25maWcpIHtcbiAgICAgICAgdmFyIHJlcyA9IG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhwcmVwYXJlQ29uZmlnKGNvbmZpZykpKTtcbiAgICAgICAgaWYgKHJlcy5fbmV4dERheSkge1xuICAgICAgICAgICAgLy8gQWRkaW5nIGlzIHNtYXJ0IGVub3VnaCBhcm91bmQgRFNUXG4gICAgICAgICAgICByZXMuYWRkKDEsICdkJyk7XG4gICAgICAgICAgICByZXMuX25leHREYXkgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXBhcmVDb25maWcgKGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBmb3JtYXQgPSBjb25maWcuX2Y7XG5cbiAgICAgICAgY29uZmlnLl9sb2NhbGUgPSBjb25maWcuX2xvY2FsZSB8fCBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKGNvbmZpZy5fbCk7XG5cbiAgICAgICAgaWYgKGlucHV0ID09PSBudWxsIHx8IChmb3JtYXQgPT09IHVuZGVmaW5lZCAmJiBpbnB1dCA9PT0gJycpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsaWRfX2NyZWF0ZUludmFsaWQoe251bGxJbnB1dDogdHJ1ZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faSA9IGlucHV0ID0gY29uZmlnLl9sb2NhbGUucHJlcGFyc2UoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTW9tZW50KGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhpbnB1dCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoZm9ybWF0KSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0KSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gaW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWdGcm9tSW5wdXQoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUlucHV0KGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2k7XG4gICAgICAgIGlmIChpbnB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCtpbnB1dCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZyhjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2EgPSBtYXAoaW5wdXQuc2xpY2UoMCksIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQob2JqLCAxMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tT2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKGlucHV0KSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIGZyb20gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxvY2FsT3JVVEMgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBpc1VUQykge1xuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGlmICh0eXBlb2YobG9jYWxlKSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBzdHJpY3QgPSBsb2NhbGU7XG4gICAgICAgICAgICBsb2NhbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb2JqZWN0IGNvbnN0cnVjdGlvbiBtdXN0IGJlIGRvbmUgdGhpcyB3YXkuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDIzXG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX3VzZVVUQyA9IGMuX2lzVVRDID0gaXNVVEM7XG4gICAgICAgIGMuX2wgPSBsb2NhbGU7XG4gICAgICAgIGMuX2kgPSBpbnB1dDtcbiAgICAgICAgYy5fZiA9IGZvcm1hdDtcbiAgICAgICAgYy5fc3RyaWN0ID0gc3RyaWN0O1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVGcm9tQ29uZmlnKGMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsX19jcmVhdGVMb2NhbCAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsT3JVVEMoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIGZhbHNlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvdG90eXBlTWluID0gZGVwcmVjYXRlKFxuICAgICAgICAgJ21vbWVudCgpLm1pbiBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1pbiBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OCcsXG4gICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgdmFyIG90aGVyID0gbG9jYWxfX2NyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgcmV0dXJuIG90aGVyIDwgdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgIH1cbiAgICAgKTtcblxuICAgIHZhciBwcm90b3R5cGVNYXggPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQoKS5tYXggaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5tYXggaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE1NDgnLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBsb2NhbF9fY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBvdGhlciA+IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gUGljayBhIG1vbWVudCBtIGZyb20gbW9tZW50cyBzbyB0aGF0IG1bZm5dKG90aGVyKSBpcyB0cnVlIGZvciBhbGxcbiAgICAvLyBvdGhlci4gVGhpcyByZWxpZXMgb24gdGhlIGZ1bmN0aW9uIGZuIHRvIGJlIHRyYW5zaXRpdmUuXG4gICAgLy9cbiAgICAvLyBtb21lbnRzIHNob3VsZCBlaXRoZXIgYmUgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMgb3IgYW4gYXJyYXksIHdob3NlXG4gICAgLy8gZmlyc3QgZWxlbWVudCBpcyBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cy5cbiAgICBmdW5jdGlvbiBwaWNrQnkoZm4sIG1vbWVudHMpIHtcbiAgICAgICAgdmFyIHJlcywgaTtcbiAgICAgICAgaWYgKG1vbWVudHMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkobW9tZW50c1swXSkpIHtcbiAgICAgICAgICAgIG1vbWVudHMgPSBtb21lbnRzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbW9tZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXMgPSBtb21lbnRzWzBdO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbW9tZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKCFtb21lbnRzW2ldLmlzVmFsaWQoKSB8fCBtb21lbnRzW2ldW2ZuXShyZXMpKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gbW9tZW50c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSBbXS5zb3J0IGluc3RlYWQ/XG4gICAgZnVuY3Rpb24gbWluICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgcmV0dXJuIHBpY2tCeSgnaXNCZWZvcmUnLCBhcmdzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXggKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0FmdGVyJywgYXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRHVyYXRpb24gKGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSBub3JtYWxpemVPYmplY3RVbml0cyhkdXJhdGlvbiksXG4gICAgICAgICAgICB5ZWFycyA9IG5vcm1hbGl6ZWRJbnB1dC55ZWFyIHx8IDAsXG4gICAgICAgICAgICBxdWFydGVycyA9IG5vcm1hbGl6ZWRJbnB1dC5xdWFydGVyIHx8IDAsXG4gICAgICAgICAgICBtb250aHMgPSBub3JtYWxpemVkSW5wdXQubW9udGggfHwgMCxcbiAgICAgICAgICAgIHdlZWtzID0gbm9ybWFsaXplZElucHV0LndlZWsgfHwgMCxcbiAgICAgICAgICAgIGRheXMgPSBub3JtYWxpemVkSW5wdXQuZGF5IHx8IDAsXG4gICAgICAgICAgICBob3VycyA9IG5vcm1hbGl6ZWRJbnB1dC5ob3VyIHx8IDAsXG4gICAgICAgICAgICBtaW51dGVzID0gbm9ybWFsaXplZElucHV0Lm1pbnV0ZSB8fCAwLFxuICAgICAgICAgICAgc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQgfHwgMCxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5taWxsaXNlY29uZCB8fCAwO1xuXG4gICAgICAgIC8vIHJlcHJlc2VudGF0aW9uIGZvciBkYXRlQWRkUmVtb3ZlXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9ICttaWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgc2Vjb25kcyAqIDFlMyArIC8vIDEwMDBcbiAgICAgICAgICAgIG1pbnV0ZXMgKiA2ZTQgKyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGhvdXJzICogMzZlNTsgLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgLy8gQmVjYXVzZSBvZiBkYXRlQWRkUmVtb3ZlIHRyZWF0cyAyNCBob3VycyBhcyBkaWZmZXJlbnQgZnJvbSBhXG4gICAgICAgIC8vIGRheSB3aGVuIHdvcmtpbmcgYXJvdW5kIERTVCwgd2UgbmVlZCB0byBzdG9yZSB0aGVtIHNlcGFyYXRlbHlcbiAgICAgICAgdGhpcy5fZGF5cyA9ICtkYXlzICtcbiAgICAgICAgICAgIHdlZWtzICogNztcbiAgICAgICAgLy8gSXQgaXMgaW1wb3NzaWJsZSB0cmFuc2xhdGUgbW9udGhzIGludG8gZGF5cyB3aXRob3V0IGtub3dpbmdcbiAgICAgICAgLy8gd2hpY2ggbW9udGhzIHlvdSBhcmUgYXJlIHRhbGtpbmcgYWJvdXQsIHNvIHdlIGhhdmUgdG8gc3RvcmVcbiAgICAgICAgLy8gaXQgc2VwYXJhdGVseS5cbiAgICAgICAgdGhpcy5fbW9udGhzID0gK21vbnRocyArXG4gICAgICAgICAgICBxdWFydGVycyAqIDMgK1xuICAgICAgICAgICAgeWVhcnMgKiAxMjtcblxuICAgICAgICB0aGlzLl9kYXRhID0ge307XG5cbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZSgpO1xuXG4gICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRHVyYXRpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRHVyYXRpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb2Zmc2V0ICh0b2tlbiwgc2VwYXJhdG9yKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKHRva2VuLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy51dGNPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBzaWduID0gJysnO1xuICAgICAgICAgICAgaWYgKG9mZnNldCA8IDApIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSAtb2Zmc2V0O1xuICAgICAgICAgICAgICAgIHNpZ24gPSAnLSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2lnbiArIHplcm9GaWxsKH5+KG9mZnNldCAvIDYwKSwgMikgKyBzZXBhcmF0b3IgKyB6ZXJvRmlsbCh+fihvZmZzZXQpICUgNjAsIDIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvZmZzZXQoJ1onLCAnOicpO1xuICAgIG9mZnNldCgnWlonLCAnJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdaJywgIG1hdGNoT2Zmc2V0KTtcbiAgICBhZGRSZWdleFRva2VuKCdaWicsIG1hdGNoT2Zmc2V0KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnWicsICdaWiddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl91c2VVVEMgPSB0cnVlO1xuICAgICAgICBjb25maWcuX3R6bSA9IG9mZnNldEZyb21TdHJpbmcoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gdGltZXpvbmUgY2h1bmtlclxuICAgIC8vICcrMTA6MDAnID4gWycxMCcsICAnMDAnXVxuICAgIC8vICctMTUzMCcgID4gWyctMTUnLCAnMzAnXVxuICAgIHZhciBjaHVua09mZnNldCA9IC8oW1xcK1xcLV18XFxkXFxkKS9naTtcblxuICAgIGZ1bmN0aW9uIG9mZnNldEZyb21TdHJpbmcoc3RyaW5nKSB7XG4gICAgICAgIHZhciBtYXRjaGVzID0gKChzdHJpbmcgfHwgJycpLm1hdGNoKG1hdGNoT2Zmc2V0KSB8fCBbXSk7XG4gICAgICAgIHZhciBjaHVuayAgID0gbWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdIHx8IFtdO1xuICAgICAgICB2YXIgcGFydHMgICA9IChjaHVuayArICcnKS5tYXRjaChjaHVua09mZnNldCkgfHwgWyctJywgMCwgMF07XG4gICAgICAgIHZhciBtaW51dGVzID0gKyhwYXJ0c1sxXSAqIDYwKSArIHRvSW50KHBhcnRzWzJdKTtcblxuICAgICAgICByZXR1cm4gcGFydHNbMF0gPT09ICcrJyA/IG1pbnV0ZXMgOiAtbWludXRlcztcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBtb21lbnQgZnJvbSBpbnB1dCwgdGhhdCBpcyBsb2NhbC91dGMvem9uZSBlcXVpdmFsZW50IHRvIG1vZGVsLlxuICAgIGZ1bmN0aW9uIGNsb25lV2l0aE9mZnNldChpbnB1dCwgbW9kZWwpIHtcbiAgICAgICAgdmFyIHJlcywgZGlmZjtcbiAgICAgICAgaWYgKG1vZGVsLl9pc1VUQykge1xuICAgICAgICAgICAgcmVzID0gbW9kZWwuY2xvbmUoKTtcbiAgICAgICAgICAgIGRpZmYgPSAoaXNNb21lbnQoaW5wdXQpIHx8IGlzRGF0ZShpbnB1dCkgPyAraW5wdXQgOiArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KSkgLSAoK3Jlcyk7XG4gICAgICAgICAgICAvLyBVc2UgbG93LWxldmVsIGFwaSwgYmVjYXVzZSB0aGlzIGZuIGlzIGxvdy1sZXZlbCBhcGkuXG4gICAgICAgICAgICByZXMuX2Quc2V0VGltZSgrcmVzLl9kICsgZGlmZik7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHJlcywgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpLmxvY2FsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXRlT2Zmc2V0IChtKSB7XG4gICAgICAgIC8vIE9uIEZpcmVmb3guMjQgRGF0ZSNnZXRUaW1lem9uZU9mZnNldCByZXR1cm5zIGEgZmxvYXRpbmcgcG9pbnQuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L3B1bGwvMTg3MVxuICAgICAgICByZXR1cm4gLU1hdGgucm91bmQobS5fZC5nZXRUaW1lem9uZU9mZnNldCgpIC8gMTUpICogMTU7XG4gICAgfVxuXG4gICAgLy8gSE9PS1NcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXIgYSBtb21lbnQgaXMgbXV0YXRlZC5cbiAgICAvLyBJdCBpcyBpbnRlbmRlZCB0byBrZWVwIHRoZSBvZmZzZXQgaW4gc3luYyB3aXRoIHRoZSB0aW1lem9uZS5cbiAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0ID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICAvLyBrZWVwTG9jYWxUaW1lID0gdHJ1ZSBtZWFucyBvbmx5IGNoYW5nZSB0aGUgdGltZXpvbmUsIHdpdGhvdXRcbiAgICAvLyBhZmZlY3RpbmcgdGhlIGxvY2FsIGhvdXIuIFNvIDU6MzE6MjYgKzAzMDAgLS1bdXRjT2Zmc2V0KDIsIHRydWUpXS0tPlxuICAgIC8vIDU6MzE6MjYgKzAyMDAgSXQgaXMgcG9zc2libGUgdGhhdCA1OjMxOjI2IGRvZXNuJ3QgZXhpc3Qgd2l0aCBvZmZzZXRcbiAgICAvLyArMDIwMCwgc28gd2UgYWRqdXN0IHRoZSB0aW1lIGFzIG5lZWRlZCwgdG8gYmUgdmFsaWQuXG4gICAgLy9cbiAgICAvLyBLZWVwaW5nIHRoZSB0aW1lIGFjdHVhbGx5IGFkZHMvc3VidHJhY3RzIChvbmUgaG91cilcbiAgICAvLyBmcm9tIHRoZSBhY3R1YWwgcmVwcmVzZW50ZWQgdGltZS4gVGhhdCBpcyB3aHkgd2UgY2FsbCB1cGRhdGVPZmZzZXRcbiAgICAvLyBhIHNlY29uZCB0aW1lLiBJbiBjYXNlIGl0IHdhbnRzIHVzIHRvIGNoYW5nZSB0aGUgb2Zmc2V0IGFnYWluXG4gICAgLy8gX2NoYW5nZUluUHJvZ3Jlc3MgPT0gdHJ1ZSBjYXNlLCB0aGVuIHdlIGhhdmUgdG8gYWRqdXN0LCBiZWNhdXNlXG4gICAgLy8gdGhlcmUgaXMgbm8gc3VjaCB0aW1lIGluIHRoZSBnaXZlbiB0aW1lem9uZS5cbiAgICBmdW5jdGlvbiBnZXRTZXRPZmZzZXQgKGlucHV0LCBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLl9vZmZzZXQgfHwgMCxcbiAgICAgICAgICAgIGxvY2FsQWRqdXN0O1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG9mZnNldEZyb21TdHJpbmcoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0KSA8IDE2KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dCAqIDYwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc1VUQyAmJiBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxBZGp1c3QgPSBnZXREYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gaW5wdXQ7XG4gICAgICAgICAgICB0aGlzLl9pc1VUQyA9IHRydWU7XG4gICAgICAgICAgICBpZiAobG9jYWxBZGp1c3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkKGxvY2FsQWRqdXN0LCAnbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9mZnNldCAhPT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWtlZXBMb2NhbFRpbWUgfHwgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICBhZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0KHRoaXMsIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24oaW5wdXQgLSBvZmZzZXQsICdtJyksIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/IG9mZnNldCA6IGdldERhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRab25lIChpbnB1dCwga2VlcExvY2FsVGltZSkge1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IC1pbnB1dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoaW5wdXQsIGtlZXBMb2NhbFRpbWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAtdGhpcy51dGNPZmZzZXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvVVRDIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnV0Y09mZnNldCgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb0xvY2FsIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc1VUQykge1xuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoMCwga2VlcExvY2FsVGltZSk7XG4gICAgICAgICAgICB0aGlzLl9pc1VUQyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3VidHJhY3QoZ2V0RGF0ZU9mZnNldCh0aGlzKSwgJ20nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb1BhcnNlZE9mZnNldCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl90em0pIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KHRoaXMuX3R6bSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuX2kgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldChvZmZzZXRGcm9tU3RyaW5nKHRoaXMuX2kpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNBbGlnbmVkSG91ck9mZnNldCAoaW5wdXQpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dCA/IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCkudXRjT2Zmc2V0KCkgOiAwO1xuXG4gICAgICAgIHJldHVybiAodGhpcy51dGNPZmZzZXQoKSAtIGlucHV0KSAlIDYwID09PSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoMCkudXRjT2Zmc2V0KCkgfHxcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoNSkudXRjT2Zmc2V0KClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQgKCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2lzRFNUU2hpZnRlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc0RTVFNoaWZ0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGNvcHlDb25maWcoYywgdGhpcyk7XG4gICAgICAgIGMgPSBwcmVwYXJlQ29uZmlnKGMpO1xuXG4gICAgICAgIGlmIChjLl9hKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBjLl9pc1VUQyA/IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyhjLl9hKSA6IGxvY2FsX19jcmVhdGVMb2NhbChjLl9hKTtcbiAgICAgICAgICAgIHRoaXMuX2lzRFNUU2hpZnRlZCA9IHRoaXMuaXNWYWxpZCgpICYmXG4gICAgICAgICAgICAgICAgY29tcGFyZUFycmF5cyhjLl9hLCBvdGhlci50b0FycmF5KCkpID4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2lzRFNUU2hpZnRlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRFNUU2hpZnRlZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0xvY2FsICgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLl9pc1VUQztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1V0Y09mZnNldCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1V0YyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyAmJiB0aGlzLl9vZmZzZXQgPT09IDA7XG4gICAgfVxuXG4gICAgdmFyIGFzcE5ldFJlZ2V4ID0gLyhcXC0pPyg/OihcXGQqKVxcLik/KFxcZCspXFw6KFxcZCspKD86XFw6KFxcZCspXFwuPyhcXGR7M30pPyk/LztcblxuICAgIC8vIGZyb20gaHR0cDovL2RvY3MuY2xvc3VyZS1saWJyYXJ5Lmdvb2dsZWNvZGUuY29tL2dpdC9jbG9zdXJlX2dvb2dfZGF0ZV9kYXRlLmpzLnNvdXJjZS5odG1sXG4gICAgLy8gc29tZXdoYXQgbW9yZSBpbiBsaW5lIHdpdGggNC40LjMuMiAyMDA0IHNwZWMsIGJ1dCBhbGxvd3MgZGVjaW1hbCBhbnl3aGVyZVxuICAgIHZhciBjcmVhdGVfX2lzb1JlZ2V4ID0gL14oLSk/UCg/Oig/OihbMC05LC5dKilZKT8oPzooWzAtOSwuXSopTSk/KD86KFswLTksLl0qKUQpPyg/OlQoPzooWzAtOSwuXSopSCk/KD86KFswLTksLl0qKU0pPyg/OihbMC05LC5dKilTKT8pP3woWzAtOSwuXSopVykkLztcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24gKGlucHV0LCBrZXkpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5wdXQsXG4gICAgICAgICAgICAvLyBtYXRjaGluZyBhZ2FpbnN0IHJlZ2V4cCBpcyBleHBlbnNpdmUsIGRvIGl0IG9uIGRlbWFuZFxuICAgICAgICAgICAgbWF0Y2ggPSBudWxsLFxuICAgICAgICAgICAgc2lnbixcbiAgICAgICAgICAgIHJldCxcbiAgICAgICAgICAgIGRpZmZSZXM7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBtcyA6IGlucHV0Ll9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICAgICAgZCAgOiBpbnB1dC5fZGF5cyxcbiAgICAgICAgICAgICAgICBNICA6IGlucHV0Ll9tb250aHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbltrZXldID0gaW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uLm1pbGxpc2Vjb25kcyA9IGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCEhKG1hdGNoID0gYXNwTmV0UmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSAnLScpID8gLTEgOiAxO1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeSAgOiAwLFxuICAgICAgICAgICAgICAgIGQgIDogdG9JbnQobWF0Y2hbREFURV0pICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgaCAgOiB0b0ludChtYXRjaFtIT1VSXSkgICAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBtICA6IHRvSW50KG1hdGNoW01JTlVURV0pICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIHMgIDogdG9JbnQobWF0Y2hbU0VDT05EXSkgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgbXMgOiB0b0ludChtYXRjaFtNSUxMSVNFQ09ORF0pICogc2lnblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGNyZWF0ZV9faXNvUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSAnLScpID8gLTEgOiAxO1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeSA6IHBhcnNlSXNvKG1hdGNoWzJdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBNIDogcGFyc2VJc28obWF0Y2hbM10sIHNpZ24pLFxuICAgICAgICAgICAgICAgIGQgOiBwYXJzZUlzbyhtYXRjaFs0XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgaCA6IHBhcnNlSXNvKG1hdGNoWzVdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBtIDogcGFyc2VJc28obWF0Y2hbNl0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIHMgOiBwYXJzZUlzbyhtYXRjaFs3XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgdyA6IHBhcnNlSXNvKG1hdGNoWzhdLCBzaWduKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChkdXJhdGlvbiA9PSBudWxsKSB7Ly8gY2hlY2tzIGZvciBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZHVyYXRpb24gPT09ICdvYmplY3QnICYmICgnZnJvbScgaW4gZHVyYXRpb24gfHwgJ3RvJyBpbiBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIGRpZmZSZXMgPSBtb21lbnRzRGlmZmVyZW5jZShsb2NhbF9fY3JlYXRlTG9jYWwoZHVyYXRpb24uZnJvbSksIGxvY2FsX19jcmVhdGVMb2NhbChkdXJhdGlvbi50bykpO1xuXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgZHVyYXRpb24ubXMgPSBkaWZmUmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIGR1cmF0aW9uLk0gPSBkaWZmUmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCA9IG5ldyBEdXJhdGlvbihkdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpICYmIGhhc093blByb3AoaW5wdXQsICdfbG9jYWxlJykpIHtcbiAgICAgICAgICAgIHJldC5fbG9jYWxlID0gaW5wdXQuX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgY3JlYXRlX19jcmVhdGVEdXJhdGlvbi5mbiA9IER1cmF0aW9uLnByb3RvdHlwZTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlSXNvIChpbnAsIHNpZ24pIHtcbiAgICAgICAgLy8gV2UnZCBub3JtYWxseSB1c2Ugfn5pbnAgZm9yIHRoaXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IGl0IGFsc29cbiAgICAgICAgLy8gY29udmVydHMgZmxvYXRzIHRvIGludHMuXG4gICAgICAgIC8vIGlucCBtYXkgYmUgdW5kZWZpbmVkLCBzbyBjYXJlZnVsIGNhbGxpbmcgcmVwbGFjZSBvbiBpdC5cbiAgICAgICAgdmFyIHJlcyA9IGlucCAmJiBwYXJzZUZsb2F0KGlucC5yZXBsYWNlKCcsJywgJy4nKSk7XG4gICAgICAgIC8vIGFwcGx5IHNpZ24gd2hpbGUgd2UncmUgYXQgaXRcbiAgICAgICAgcmV0dXJuIChpc05hTihyZXMpID8gMCA6IHJlcykgKiBzaWduO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcyA9IHttaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMH07XG5cbiAgICAgICAgcmVzLm1vbnRocyA9IG90aGVyLm1vbnRoKCkgLSBiYXNlLm1vbnRoKCkgK1xuICAgICAgICAgICAgKG90aGVyLnllYXIoKSAtIGJhc2UueWVhcigpKSAqIDEyO1xuICAgICAgICBpZiAoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpLmlzQWZ0ZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAtLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gK290aGVyIC0gKyhiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykpO1xuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcztcbiAgICAgICAgb3RoZXIgPSBjbG9uZVdpdGhPZmZzZXQob3RoZXIsIGJhc2UpO1xuICAgICAgICBpZiAoYmFzZS5pc0JlZm9yZShvdGhlcikpIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShvdGhlciwgYmFzZSk7XG4gICAgICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gLXJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICByZXMubW9udGhzID0gLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUFkZGVyKGRpcmVjdGlvbiwgbmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbCwgcGVyaW9kKSB7XG4gICAgICAgICAgICB2YXIgZHVyLCB0bXA7XG4gICAgICAgICAgICAvL2ludmVydCB0aGUgYXJndW1lbnRzLCBidXQgY29tcGxhaW4gYWJvdXQgaXRcbiAgICAgICAgICAgIGlmIChwZXJpb2QgIT09IG51bGwgJiYgIWlzTmFOKCtwZXJpb2QpKSB7XG4gICAgICAgICAgICAgICAgZGVwcmVjYXRlU2ltcGxlKG5hbWUsICdtb21lbnQoKS4nICsgbmFtZSAgKyAnKHBlcmlvZCwgbnVtYmVyKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIG1vbWVudCgpLicgKyBuYW1lICsgJyhudW1iZXIsIHBlcmlvZCkuJyk7XG4gICAgICAgICAgICAgICAgdG1wID0gdmFsOyB2YWwgPSBwZXJpb2Q7IHBlcmlvZCA9IHRtcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyArdmFsIDogdmFsO1xuICAgICAgICAgICAgZHVyID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbih2YWwsIHBlcmlvZCk7XG4gICAgICAgICAgICBhZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0KHRoaXMsIGR1ciwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QgKG1vbSwgZHVyYXRpb24sIGlzQWRkaW5nLCB1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IGR1cmF0aW9uLl9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICBkYXlzID0gZHVyYXRpb24uX2RheXMsXG4gICAgICAgICAgICBtb250aHMgPSBkdXJhdGlvbi5fbW9udGhzO1xuICAgICAgICB1cGRhdGVPZmZzZXQgPSB1cGRhdGVPZmZzZXQgPT0gbnVsbCA/IHRydWUgOiB1cGRhdGVPZmZzZXQ7XG5cbiAgICAgICAgaWYgKG1pbGxpc2Vjb25kcykge1xuICAgICAgICAgICAgbW9tLl9kLnNldFRpbWUoK21vbS5fZCArIG1pbGxpc2Vjb25kcyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF5cykge1xuICAgICAgICAgICAgZ2V0X3NldF9fc2V0KG1vbSwgJ0RhdGUnLCBnZXRfc2V0X19nZXQobW9tLCAnRGF0ZScpICsgZGF5cyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobW9udGhzKSB7XG4gICAgICAgICAgICBzZXRNb250aChtb20sIGdldF9zZXRfX2dldChtb20sICdNb250aCcpICsgbW9udGhzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQobW9tLCBkYXlzIHx8IG1vbnRocyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYWRkX3N1YnRyYWN0X19hZGQgICAgICA9IGNyZWF0ZUFkZGVyKDEsICdhZGQnKTtcbiAgICB2YXIgYWRkX3N1YnRyYWN0X19zdWJ0cmFjdCA9IGNyZWF0ZUFkZGVyKC0xLCAnc3VidHJhY3QnKTtcblxuICAgIGZ1bmN0aW9uIG1vbWVudF9jYWxlbmRhcl9fY2FsZW5kYXIgKHRpbWUsIGZvcm1hdHMpIHtcbiAgICAgICAgLy8gV2Ugd2FudCB0byBjb21wYXJlIHRoZSBzdGFydCBvZiB0b2RheSwgdnMgdGhpcy5cbiAgICAgICAgLy8gR2V0dGluZyBzdGFydC1vZi10b2RheSBkZXBlbmRzIG9uIHdoZXRoZXIgd2UncmUgbG9jYWwvdXRjL29mZnNldCBvciBub3QuXG4gICAgICAgIHZhciBub3cgPSB0aW1lIHx8IGxvY2FsX19jcmVhdGVMb2NhbCgpLFxuICAgICAgICAgICAgc29kID0gY2xvbmVXaXRoT2Zmc2V0KG5vdywgdGhpcykuc3RhcnRPZignZGF5JyksXG4gICAgICAgICAgICBkaWZmID0gdGhpcy5kaWZmKHNvZCwgJ2RheXMnLCB0cnVlKSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGRpZmYgPCAtNiA/ICdzYW1lRWxzZScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAtMSA/ICdsYXN0V2VlaycgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAwID8gJ2xhc3REYXknIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgMSA/ICdzYW1lRGF5JyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDIgPyAnbmV4dERheScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCA3ID8gJ25leHRXZWVrJyA6ICdzYW1lRWxzZSc7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdChmb3JtYXRzICYmIGZvcm1hdHNbZm9ybWF0XSB8fCB0aGlzLmxvY2FsZURhdGEoKS5jYWxlbmRhcihmb3JtYXQsIHRoaXMsIGxvY2FsX19jcmVhdGVMb2NhbChub3cpKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvbmUgKCkge1xuICAgICAgICByZXR1cm4gbmV3IE1vbWVudCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FmdGVyIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGlucHV0TXM7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModHlwZW9mIHVuaXRzICE9PSAndW5kZWZpbmVkJyA/IHVuaXRzIDogJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgaW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMgPiAraW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dE1zID0gaXNNb21lbnQoaW5wdXQpID8gK2lucHV0IDogK2xvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXRNcyA8ICt0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0JlZm9yZSAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHZhciBpbnB1dE1zO1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHR5cGVvZiB1bml0cyAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzIDwgK2lucHV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRNcyA9IGlzTW9tZW50KGlucHV0KSA/ICtpbnB1dCA6ICtsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpIDwgaW5wdXRNcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQmV0d2VlbiAoZnJvbSwgdG8sIHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQWZ0ZXIoZnJvbSwgdW5pdHMpICYmIHRoaXMuaXNCZWZvcmUodG8sIHVuaXRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1NhbWUgKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyB8fCAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcyA9PT0gK2lucHV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRNcyA9ICtsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICsodGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpKSA8PSBpbnB1dE1zICYmIGlucHV0TXMgPD0gKyh0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpZmYgKGlucHV0LCB1bml0cywgYXNGbG9hdCkge1xuICAgICAgICB2YXIgdGhhdCA9IGNsb25lV2l0aE9mZnNldChpbnB1dCwgdGhpcyksXG4gICAgICAgICAgICB6b25lRGVsdGEgPSAodGhhdC51dGNPZmZzZXQoKSAtIHRoaXMudXRjT2Zmc2V0KCkpICogNmU0LFxuICAgICAgICAgICAgZGVsdGEsIG91dHB1dDtcblxuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcblxuICAgICAgICBpZiAodW5pdHMgPT09ICd5ZWFyJyB8fCB1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCk7XG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCAvIDM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgLyAxMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbHRhID0gdGhpcyAtIHRoYXQ7XG4gICAgICAgICAgICBvdXRwdXQgPSB1bml0cyA9PT0gJ3NlY29uZCcgPyBkZWx0YSAvIDFlMyA6IC8vIDEwMDBcbiAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ21pbnV0ZScgPyBkZWx0YSAvIDZlNCA6IC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgICAgIHVuaXRzID09PSAnaG91cicgPyBkZWx0YSAvIDM2ZTUgOiAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAgICAgICAgIHVuaXRzID09PSAnZGF5JyA/IChkZWx0YSAtIHpvbmVEZWx0YSkgLyA4NjRlNSA6IC8vIDEwMDAgKiA2MCAqIDYwICogMjQsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ3dlZWsnID8gKGRlbHRhIC0gem9uZURlbHRhKSAvIDYwNDhlNSA6IC8vIDEwMDAgKiA2MCAqIDYwICogMjQgKiA3LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICAgICAgZGVsdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFzRmxvYXQgPyBvdXRwdXQgOiBhYnNGbG9vcihvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbnRoRGlmZiAoYSwgYikge1xuICAgICAgICAvLyBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICAgICAgICB2YXIgd2hvbGVNb250aERpZmYgPSAoKGIueWVhcigpIC0gYS55ZWFyKCkpICogMTIpICsgKGIubW9udGgoKSAtIGEubW9udGgoKSksXG4gICAgICAgICAgICAvLyBiIGlzIGluIChhbmNob3IgLSAxIG1vbnRoLCBhbmNob3IgKyAxIG1vbnRoKVxuICAgICAgICAgICAgYW5jaG9yID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiwgJ21vbnRocycpLFxuICAgICAgICAgICAgYW5jaG9yMiwgYWRqdXN0O1xuXG4gICAgICAgIGlmIChiIC0gYW5jaG9yIDwgMCkge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgLSAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvciAtIGFuY2hvcjIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgKyAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvcjIgLSBhbmNob3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0od2hvbGVNb250aERpZmYgKyBhZGp1c3QpO1xuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5kZWZhdWx0Rm9ybWF0ID0gJ1lZWVktTU0tRERUSEg6bW06c3NaJztcblxuICAgIGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb2NhbGUoJ2VuJykuZm9ybWF0KCdkZGQgTU1NIEREIFlZWVkgSEg6bW06c3MgW0dNVF1aWicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudF9mb3JtYXRfX3RvSVNPU3RyaW5nICgpIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzLmNsb25lKCkudXRjKCk7XG4gICAgICAgIGlmICgwIDwgbS55ZWFyKCkgJiYgbS55ZWFyKCkgPD0gOTk5OSkge1xuICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZykge1xuICAgICAgICAgICAgICAgIC8vIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBpcyB+NTB4IGZhc3RlciwgdXNlIGl0IHdoZW4gd2UgY2FuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9EYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCAnWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCAnWVlZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQgKGlucHV0U3RyaW5nKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBmb3JtYXRNb21lbnQodGhpcywgaW5wdXRTdHJpbmcgfHwgdXRpbHNfaG9va3NfX2hvb2tzLmRlZmF1bHRGb3JtYXQpO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb20gKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24oe3RvOiB0aGlzLCBmcm9tOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmcm9tTm93ICh3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb20obG9jYWxfX2NyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvICh0aW1lLCB3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKHtmcm9tOiB0aGlzLCB0bzogdGltZX0pLmxvY2FsZSh0aGlzLmxvY2FsZSgpKS5odW1hbml6ZSghd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9Ob3cgKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG8obG9jYWxfX2NyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZSAoa2V5KSB7XG4gICAgICAgIHZhciBuZXdMb2NhbGVEYXRhO1xuXG4gICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZS5fYWJicjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0xvY2FsZURhdGEgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgICAgICBpZiAobmV3TG9jYWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gbmV3TG9jYWxlRGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxhbmcgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQoKS5sYW5nKCkgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCwgdXNlIG1vbWVudCgpLmxvY2FsZURhdGEoKSB0byBnZXQgdGhlIGxhbmd1YWdlIGNvbmZpZ3VyYXRpb24uIFVzZSBtb21lbnQoKS5sb2NhbGUoKSB0byBjaGFuZ2UgbGFuZ3VhZ2VzLicsXG4gICAgICAgIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlRGF0YSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRPZiAodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIC8vIHRoZSBmb2xsb3dpbmcgc3dpdGNoIGludGVudGlvbmFsbHkgb21pdHMgYnJlYWsga2V5d29yZHNcbiAgICAgICAgLy8gdG8gdXRpbGl6ZSBmYWxsaW5nIHRocm91Z2ggdGhlIGNhc2VzLlxuICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICAgICAgdGhpcy5tb250aCgwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgICAgIHRoaXMuZGF0ZSgxKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgIGNhc2UgJ2lzb1dlZWsnOlxuICAgICAgICBjYXNlICdkYXknOlxuICAgICAgICAgICAgdGhpcy5ob3VycygwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICB0aGlzLm1pbnV0ZXMoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgICAgICAgICB0aGlzLnNlY29uZHMoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgICB0aGlzLm1pbGxpc2Vjb25kcygwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlZWtzIGFyZSBhIHNwZWNpYWwgY2FzZVxuICAgICAgICBpZiAodW5pdHMgPT09ICd3ZWVrJykge1xuICAgICAgICAgICAgdGhpcy53ZWVrZGF5KDApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ2lzb1dlZWsnKSB7XG4gICAgICAgICAgICB0aGlzLmlzb1dlZWtkYXkoMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBxdWFydGVycyBhcmUgYWxzbyBzcGVjaWFsXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICB0aGlzLm1vbnRoKE1hdGguZmxvb3IodGhpcy5tb250aCgpIC8gMykgKiAzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuZE9mICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSB1bmRlZmluZWQgfHwgdW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJ0T2YodW5pdHMpLmFkZCgxLCAodW5pdHMgPT09ICdpc29XZWVrJyA/ICd3ZWVrJyA6IHVuaXRzKSkuc3VidHJhY3QoMSwgJ21zJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9fdHlwZV9fdmFsdWVPZiAoKSB7XG4gICAgICAgIHJldHVybiArdGhpcy5fZCAtICgodGhpcy5fb2Zmc2V0IHx8IDApICogNjAwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuaXggKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigrdGhpcyAvIDEwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvRGF0ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXQgPyBuZXcgRGF0ZSgrdGhpcykgOiB0aGlzLl9kO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvQXJyYXkgKCkge1xuICAgICAgICB2YXIgbSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBbbS55ZWFyKCksIG0ubW9udGgoKSwgbS5kYXRlKCksIG0uaG91cigpLCBtLm1pbnV0ZSgpLCBtLnNlY29uZCgpLCBtLm1pbGxpc2Vjb25kKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvT2JqZWN0ICgpIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcnM6IG0ueWVhcigpLFxuICAgICAgICAgICAgbW9udGhzOiBtLm1vbnRoKCksXG4gICAgICAgICAgICBkYXRlOiBtLmRhdGUoKSxcbiAgICAgICAgICAgIGhvdXJzOiBtLmhvdXJzKCksXG4gICAgICAgICAgICBtaW51dGVzOiBtLm1pbnV0ZXMoKSxcbiAgICAgICAgICAgIHNlY29uZHM6IG0uc2Vjb25kcygpLFxuICAgICAgICAgICAgbWlsbGlzZWNvbmRzOiBtLm1pbGxpc2Vjb25kcygpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50X3ZhbGlkX19pc1ZhbGlkICgpIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkX19pc1ZhbGlkKHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNpbmdGbGFncyAoKSB7XG4gICAgICAgIHJldHVybiBleHRlbmQoe30sIGdldFBhcnNpbmdGbGFncyh0aGlzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW52YWxpZEF0ICgpIHtcbiAgICAgICAgcmV0dXJuIGdldFBhcnNpbmdGbGFncyh0aGlzKS5vdmVyZmxvdztcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ2dnJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2Vla1llYXIoKSAlIDEwMDtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnR0cnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc29XZWVrWWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gYWRkV2Vla1llYXJGb3JtYXRUb2tlbiAodG9rZW4sIGdldHRlcikge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbigwLCBbdG9rZW4sIHRva2VuLmxlbmd0aF0sIDAsIGdldHRlcik7XG4gICAgfVxuXG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignZ2dnZycsICAgICAnd2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdnZ2dnZycsICAgICd3ZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ0dHR0cnLCAgJ2lzb1dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignR0dHR0cnLCAnaXNvV2Vla1llYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnd2Vla1llYXInLCAnZ2cnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWtZZWFyJywgJ0dHJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdHJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignZycsICAgICAgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdnZycsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignR0dHRycsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnZ2cnLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdHR0dHRycsICBtYXRjaDF0bzYsIG1hdGNoNik7XG4gICAgYWRkUmVnZXhUb2tlbignZ2dnZ2cnLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydnZ2dnJywgJ2dnZ2dnJywgJ0dHR0cnLCAnR0dHR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW4uc3Vic3RyKDAsIDIpXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZ2cnLCAnR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW5dID0gdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIHdlZWtzSW5ZZWFyKHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKGxvY2FsX19jcmVhdGVMb2NhbChbeWVhciwgMTEsIDMxICsgZG93IC0gZG95XSksIGRvdywgZG95KS53ZWVrO1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFdlZWtZZWFyIChpbnB1dCkge1xuICAgICAgICB2YXIgeWVhciA9IHdlZWtPZlllYXIodGhpcywgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93LCB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3kpLnllYXI7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8geWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIHllYXIpLCAneScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT1dlZWtZZWFyIChpbnB1dCkge1xuICAgICAgICB2YXIgeWVhciA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkueWVhcjtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoKGlucHV0IC0geWVhciksICd5Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SVNPV2Vla3NJblllYXIgKCkge1xuICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIDEsIDQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFdlZWtzSW5ZZWFyICgpIHtcbiAgICAgICAgdmFyIHdlZWtJbmZvID0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWs7XG4gICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgd2Vla0luZm8uZG93LCB3ZWVrSW5mby5kb3kpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdRJywgMCwgMCwgJ3F1YXJ0ZXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygncXVhcnRlcicsICdRJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdRJywgbWF0Y2gxKTtcbiAgICBhZGRQYXJzZVRva2VuKCdRJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNT05USF0gPSAodG9JbnQoaW5wdXQpIC0gMSkgKiAzO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0UXVhcnRlciAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyBNYXRoLmNlaWwoKHRoaXMubW9udGgoKSArIDEpIC8gMykgOiB0aGlzLm1vbnRoKChpbnB1dCAtIDEpICogMyArIHRoaXMubW9udGgoKSAlIDMpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdEJywgWydERCcsIDJdLCAnRG8nLCAnZGF0ZScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdkYXRlJywgJ0QnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0QnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdERCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdEbycsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBpc1N0cmljdCA/IGxvY2FsZS5fb3JkaW5hbFBhcnNlIDogbG9jYWxlLl9vcmRpbmFsUGFyc2VMZW5pZW50O1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ0QnLCAnREQnXSwgREFURSk7XG4gICAgYWRkUGFyc2VUb2tlbignRG8nLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W0RBVEVdID0gdG9JbnQoaW5wdXQubWF0Y2gobWF0Y2gxdG8yKVswXSwgMTApO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldERheU9mTW9udGggPSBtYWtlR2V0U2V0KCdEYXRlJywgdHJ1ZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZCcsIDAsICdkbycsICdkYXknKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzTWluKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5cyh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2UnLCAwLCAwLCAnd2Vla2RheScpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdFJywgMCwgMCwgJ2lzb1dlZWtkYXknKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF5JywgJ2QnKTtcbiAgICBhZGRVbml0QWxpYXMoJ3dlZWtkYXknLCAnZScpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2Vla2RheScsICdFJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdkJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdlJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdFJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZCcsICAgbWF0Y2hXb3JkKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGQnLCAgbWF0Y2hXb3JkKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGRkJywgbWF0Y2hXb3JkKTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZGQnLCAnZGRkJywgJ2RkZGQnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcpIHtcbiAgICAgICAgdmFyIHdlZWtkYXkgPSBjb25maWcuX2xvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGdldCBhIHdlZWtkYXkgbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkXG4gICAgICAgIGlmICh3ZWVrZGF5ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHdlZWsuZCA9IHdlZWtkYXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkV2Vla2RheSA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2QnLCAnZScsICdFJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzTmFOKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnB1dCA9IGxvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIExPQ0FMRVNcblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXMgPSAnU3VuZGF5X01vbmRheV9UdWVzZGF5X1dlZG5lc2RheV9UaHVyc2RheV9GcmlkYXlfU2F0dXJkYXknLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXMgKG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzW20uZGF5KCldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydCA9ICdTdW5fTW9uX1R1ZV9XZWRfVGh1X0ZyaV9TYXQnLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNTaG9ydCAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFttLmRheSgpXTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluID0gJ1N1X01vX1R1X1dlX1RoX0ZyX1NhJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzTWluIChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblttLmRheSgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1BhcnNlICh3ZWVrZGF5TmFtZSkge1xuICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlID0gdGhpcy5fd2Vla2RheXNQYXJzZSB8fCBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIGlmICghdGhpcy5fd2Vla2RheXNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIG1vbSA9IGxvY2FsX19jcmVhdGVMb2NhbChbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMud2Vla2RheXMobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNNaW4obW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0RGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICB2YXIgZGF5ID0gdGhpcy5faXNVVEMgPyB0aGlzLl9kLmdldFVUQ0RheSgpIDogdGhpcy5fZC5nZXREYXkoKTtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlucHV0ID0gcGFyc2VXZWVrZGF5KGlucHV0LCB0aGlzLmxvY2FsZURhdGEoKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoaW5wdXQgLSBkYXksICdkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICB2YXIgd2Vla2RheSA9ICh0aGlzLmRheSgpICsgNyAtIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdykgJSA3O1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWtkYXkgOiB0aGlzLmFkZChpbnB1dCAtIHdlZWtkYXksICdkJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPRGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICAvLyBiZWhhdmVzIHRoZSBzYW1lIGFzIG1vbWVudCNkYXkgZXhjZXB0XG4gICAgICAgIC8vIGFzIGEgZ2V0dGVyLCByZXR1cm5zIDcgaW5zdGVhZCBvZiAwICgxLTcgcmFuZ2UgaW5zdGVhZCBvZiAwLTYpXG4gICAgICAgIC8vIGFzIGEgc2V0dGVyLCBzdW5kYXkgc2hvdWxkIGJlbG9uZyB0byB0aGUgcHJldmlvdXMgd2Vlay5cbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB0aGlzLmRheSgpIHx8IDcgOiB0aGlzLmRheSh0aGlzLmRheSgpICUgNyA/IGlucHV0IDogaW5wdXQgLSA3KTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignSCcsIFsnSEgnLCAyXSwgMCwgJ2hvdXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbignaCcsIFsnaGgnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ob3VycygpICUgMTIgfHwgMTI7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbSAodG9rZW4sIGxvd2VyY2FzZSkge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbih0b2tlbiwgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1lcmlkaWVtKHRoaXMuaG91cnMoKSwgdGhpcy5taW51dGVzKCksIGxvd2VyY2FzZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG1lcmlkaWVtKCdhJywgdHJ1ZSk7XG4gICAgbWVyaWRpZW0oJ0EnLCBmYWxzZSk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2hvdXInLCAnaCcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgZnVuY3Rpb24gbWF0Y2hNZXJpZGllbSAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLl9tZXJpZGllbVBhcnNlO1xuICAgIH1cblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2EnLCAgbWF0Y2hNZXJpZGllbSk7XG4gICAgYWRkUmVnZXhUb2tlbignQScsICBtYXRjaE1lcmlkaWVtKTtcbiAgICBhZGRSZWdleFRva2VuKCdIJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignaCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0hIJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2hoJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ0gnLCAnSEgnXSwgSE9VUik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2EnLCAnQSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9pc1BtID0gY29uZmlnLl9sb2NhbGUuaXNQTShpbnB1dCk7XG4gICAgICAgIGNvbmZpZy5fbWVyaWRpZW0gPSBpbnB1dDtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnaCcsICdoaCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlSXNQTSAoaW5wdXQpIHtcbiAgICAgICAgLy8gSUU4IFF1aXJrcyBNb2RlICYgSUU3IFN0YW5kYXJkcyBNb2RlIGRvIG5vdCBhbGxvdyBhY2Nlc3Npbmcgc3RyaW5ncyBsaWtlIGFycmF5c1xuICAgICAgICAvLyBVc2luZyBjaGFyQXQgc2hvdWxkIGJlIG1vcmUgY29tcGF0aWJsZS5cbiAgICAgICAgcmV0dXJuICgoaW5wdXQgKyAnJykudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkgPT09ICdwJyk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNZXJpZGllbVBhcnNlID0gL1thcF1cXC4/bT9cXC4/L2k7XG4gICAgZnVuY3Rpb24gbG9jYWxlTWVyaWRpZW0gKGhvdXJzLCBtaW51dGVzLCBpc0xvd2VyKSB7XG4gICAgICAgIGlmIChob3VycyA+IDExKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdwbScgOiAnUE0nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAnYW0nIDogJ0FNJztcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgLy8gU2V0dGluZyB0aGUgaG91ciBzaG91bGQga2VlcCB0aGUgdGltZSwgYmVjYXVzZSB0aGUgdXNlciBleHBsaWNpdGx5XG4gICAgLy8gc3BlY2lmaWVkIHdoaWNoIGhvdXIgaGUgd2FudHMuIFNvIHRyeWluZyB0byBtYWludGFpbiB0aGUgc2FtZSBob3VyIChpblxuICAgIC8vIGEgbmV3IHRpbWV6b25lKSBtYWtlcyBzZW5zZS4gQWRkaW5nL3N1YnRyYWN0aW5nIGhvdXJzIGRvZXMgbm90IGZvbGxvd1xuICAgIC8vIHRoaXMgcnVsZS5cbiAgICB2YXIgZ2V0U2V0SG91ciA9IG1ha2VHZXRTZXQoJ0hvdXJzJywgdHJ1ZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignbScsIFsnbW0nLCAyXSwgMCwgJ21pbnV0ZScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaW51dGUnLCAnbScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignbScsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ21tJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydtJywgJ21tJ10sIE1JTlVURSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0TWludXRlID0gbWFrZUdldFNldCgnTWludXRlcycsIGZhbHNlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdzJywgWydzcycsIDJdLCAwLCAnc2Vjb25kJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3NlY29uZCcsICdzJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdzJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignc3MnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ3MnLCAnc3MnXSwgU0VDT05EKTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRTZWNvbmQgPSBtYWtlR2V0U2V0KCdTZWNvbmRzJywgZmFsc2UpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMDApO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTUycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTUycsIDNdLCAwLCAnbWlsbGlzZWNvbmQnKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1MnLCA0XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTUycsIDVdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1MnLCA2XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1MnLCA3XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTUycsIDhdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTU1MnLCA5XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDAwMDtcbiAgICB9KTtcblxuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaWxsaXNlY29uZCcsICdtcycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignUycsICAgIG1hdGNoMXRvMywgbWF0Y2gxKTtcbiAgICBhZGRSZWdleFRva2VuKCdTUycsICAgbWF0Y2gxdG8zLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTUycsICBtYXRjaDF0bzMsIG1hdGNoMyk7XG5cbiAgICB2YXIgdG9rZW47XG4gICAgZm9yICh0b2tlbiA9ICdTU1NTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgICAgICBhZGRSZWdleFRva2VuKHRva2VuLCBtYXRjaFVuc2lnbmVkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU1zKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xuICAgIH1cblxuICAgIGZvciAodG9rZW4gPSAnUyc7IHRva2VuLmxlbmd0aCA8PSA5OyB0b2tlbiArPSAnUycpIHtcbiAgICAgICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgcGFyc2VNcyk7XG4gICAgfVxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRNaWxsaXNlY29uZCA9IG1ha2VHZXRTZXQoJ01pbGxpc2Vjb25kcycsIGZhbHNlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCd6JywgIDAsIDAsICd6b25lQWJicicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd6eicsIDAsIDAsICd6b25lTmFtZScpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZUFiYnIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnVVRDJyA6ICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFpvbmVOYW1lICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ0Nvb3JkaW5hdGVkIFVuaXZlcnNhbCBUaW1lJyA6ICcnO1xuICAgIH1cblxuICAgIHZhciBtb21lbnRQcm90b3R5cGVfX3Byb3RvID0gTW9tZW50LnByb3RvdHlwZTtcblxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uYWRkICAgICAgICAgID0gYWRkX3N1YnRyYWN0X19hZGQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5jYWxlbmRhciAgICAgPSBtb21lbnRfY2FsZW5kYXJfX2NhbGVuZGFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uY2xvbmUgICAgICAgID0gY2xvbmU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kaWZmICAgICAgICAgPSBkaWZmO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZW5kT2YgICAgICAgID0gZW5kT2Y7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5mb3JtYXQgICAgICAgPSBmb3JtYXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5mcm9tICAgICAgICAgPSBmcm9tO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZnJvbU5vdyAgICAgID0gZnJvbU5vdztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvICAgICAgICAgICA9IHRvO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9Ob3cgICAgICAgID0gdG9Ob3c7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5nZXQgICAgICAgICAgPSBnZXRTZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pbnZhbGlkQXQgICAgPSBpbnZhbGlkQXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0FmdGVyICAgICAgPSBpc0FmdGVyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNCZWZvcmUgICAgID0gaXNCZWZvcmU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0JldHdlZW4gICAgPSBpc0JldHdlZW47XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1NhbWUgICAgICAgPSBpc1NhbWU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1ZhbGlkICAgICAgPSBtb21lbnRfdmFsaWRfX2lzVmFsaWQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5sYW5nICAgICAgICAgPSBsYW5nO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubG9jYWxlICAgICAgID0gbG9jYWxlO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubG9jYWxlRGF0YSAgID0gbG9jYWxlRGF0YTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1heCAgICAgICAgICA9IHByb3RvdHlwZU1heDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbiAgICAgICAgICA9IHByb3RvdHlwZU1pbjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnBhcnNpbmdGbGFncyA9IHBhcnNpbmdGbGFncztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnNldCAgICAgICAgICA9IGdldFNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnN0YXJ0T2YgICAgICA9IHN0YXJ0T2Y7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5zdWJ0cmFjdCAgICAgPSBhZGRfc3VidHJhY3RfX3N1YnRyYWN0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9BcnJheSAgICAgID0gdG9BcnJheTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvT2JqZWN0ICAgICA9IHRvT2JqZWN0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9EYXRlICAgICAgID0gdG9EYXRlO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9JU09TdHJpbmcgID0gbW9tZW50X2Zvcm1hdF9fdG9JU09TdHJpbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b0pTT04gICAgICAgPSBtb21lbnRfZm9ybWF0X190b0lTT1N0cmluZztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvU3RyaW5nICAgICA9IHRvU3RyaW5nO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udW5peCAgICAgICAgID0gdW5peDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnZhbHVlT2YgICAgICA9IHRvX3R5cGVfX3ZhbHVlT2Y7XG5cbiAgICAvLyBZZWFyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by55ZWFyICAgICAgID0gZ2V0U2V0WWVhcjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzTGVhcFllYXIgPSBnZXRJc0xlYXBZZWFyO1xuXG4gICAgLy8gV2VlayBZZWFyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrWWVhciAgICA9IGdldFNldFdlZWtZZWFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla1llYXIgPSBnZXRTZXRJU09XZWVrWWVhcjtcblxuICAgIC8vIFF1YXJ0ZXJcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnF1YXJ0ZXIgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnF1YXJ0ZXJzID0gZ2V0U2V0UXVhcnRlcjtcblxuICAgIC8vIE1vbnRoXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5tb250aCAgICAgICA9IGdldFNldE1vbnRoO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF5c0luTW9udGggPSBnZXREYXlzSW5Nb250aDtcblxuICAgIC8vIFdlZWtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLndlZWsgICAgICAgICAgID0gbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrcyAgICAgICAgPSBnZXRTZXRXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2VlayAgICAgICAgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtzICAgICA9IGdldFNldElTT1dlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrc0luWWVhciAgICA9IGdldFdlZWtzSW5ZZWFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla3NJblllYXIgPSBnZXRJU09XZWVrc0luWWVhcjtcblxuICAgIC8vIERheVxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF0ZSAgICAgICA9IGdldFNldERheU9mTW9udGg7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXkgICAgICAgID0gbW9tZW50UHJvdG90eXBlX19wcm90by5kYXlzICAgICAgICAgICAgID0gZ2V0U2V0RGF5T2ZXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2Vla2RheSAgICA9IGdldFNldExvY2FsZURheU9mV2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtkYXkgPSBnZXRTZXRJU09EYXlPZldlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXlPZlllYXIgID0gZ2V0U2V0RGF5T2ZZZWFyO1xuXG4gICAgLy8gSG91clxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaG91ciA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaG91cnMgPSBnZXRTZXRIb3VyO1xuXG4gICAgLy8gTWludXRlXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5taW51dGUgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbnV0ZXMgPSBnZXRTZXRNaW51dGU7XG5cbiAgICAvLyBTZWNvbmRcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnNlY29uZCA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc2Vjb25kcyA9IGdldFNldFNlY29uZDtcblxuICAgIC8vIE1pbGxpc2Vjb25kXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5taWxsaXNlY29uZCA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWlsbGlzZWNvbmRzID0gZ2V0U2V0TWlsbGlzZWNvbmQ7XG5cbiAgICAvLyBPZmZzZXRcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnV0Y09mZnNldCAgICAgICAgICAgID0gZ2V0U2V0T2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udXRjICAgICAgICAgICAgICAgICAgPSBzZXRPZmZzZXRUb1VUQztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxvY2FsICAgICAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9Mb2NhbDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnBhcnNlWm9uZSAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5oYXNBbGlnbmVkSG91ck9mZnNldCA9IGhhc0FsaWduZWRIb3VyT2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNEU1QgICAgICAgICAgICAgICAgPSBpc0RheWxpZ2h0U2F2aW5nVGltZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzRFNUU2hpZnRlZCAgICAgICAgID0gaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNMb2NhbCAgICAgICAgICAgICAgPSBpc0xvY2FsO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNVdGNPZmZzZXQgICAgICAgICAgPSBpc1V0Y09mZnNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzVXRjICAgICAgICAgICAgICAgID0gaXNVdGM7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1VUQyAgICAgICAgICAgICAgICA9IGlzVXRjO1xuXG4gICAgLy8gVGltZXpvbmVcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnpvbmVBYmJyID0gZ2V0Wm9uZUFiYnI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by56b25lTmFtZSA9IGdldFpvbmVOYW1lO1xuXG4gICAgLy8gRGVwcmVjYXRpb25zXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXRlcyAgPSBkZXByZWNhdGUoJ2RhdGVzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBkYXRlIGluc3RlYWQuJywgZ2V0U2V0RGF5T2ZNb250aCk7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5tb250aHMgPSBkZXByZWNhdGUoJ21vbnRocyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgbW9udGggaW5zdGVhZCcsIGdldFNldE1vbnRoKTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnllYXJzICA9IGRlcHJlY2F0ZSgneWVhcnMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIHllYXIgaW5zdGVhZCcsIGdldFNldFllYXIpO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uem9uZSAgID0gZGVwcmVjYXRlKCdtb21lbnQoKS56b25lIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQoKS51dGNPZmZzZXQgaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE3NzknLCBnZXRTZXRab25lKTtcblxuICAgIHZhciBtb21lbnRQcm90b3R5cGUgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvO1xuXG4gICAgZnVuY3Rpb24gbW9tZW50X19jcmVhdGVVbml4IChpbnB1dCkge1xuICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0ICogMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50X19jcmVhdGVJblpvbmUgKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cykucGFyc2Vab25lKCk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRDYWxlbmRhciA9IHtcbiAgICAgICAgc2FtZURheSA6ICdbVG9kYXkgYXRdIExUJyxcbiAgICAgICAgbmV4dERheSA6ICdbVG9tb3Jyb3cgYXRdIExUJyxcbiAgICAgICAgbmV4dFdlZWsgOiAnZGRkZCBbYXRdIExUJyxcbiAgICAgICAgbGFzdERheSA6ICdbWWVzdGVyZGF5IGF0XSBMVCcsXG4gICAgICAgIGxhc3RXZWVrIDogJ1tMYXN0XSBkZGRkIFthdF0gTFQnLFxuICAgICAgICBzYW1lRWxzZSA6ICdMJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVfY2FsZW5kYXJfX2NhbGVuZGFyIChrZXksIG1vbSwgbm93KSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJyA/IG91dHB1dC5jYWxsKG1vbSwgbm93KSA6IG91dHB1dDtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvbmdEYXRlRm9ybWF0ID0ge1xuICAgICAgICBMVFMgIDogJ2g6bW06c3MgQScsXG4gICAgICAgIExUICAgOiAnaDptbSBBJyxcbiAgICAgICAgTCAgICA6ICdNTS9ERC9ZWVlZJyxcbiAgICAgICAgTEwgICA6ICdNTU1NIEQsIFlZWVknLFxuICAgICAgICBMTEwgIDogJ01NTU0gRCwgWVlZWSBoOm1tIEEnLFxuICAgICAgICBMTExMIDogJ2RkZGQsIE1NTU0gRCwgWVlZWSBoOm1tIEEnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvbmdEYXRlRm9ybWF0IChrZXkpIHtcbiAgICAgICAgdmFyIGZvcm1hdCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0sXG4gICAgICAgICAgICBmb3JtYXRVcHBlciA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXTtcblxuICAgICAgICBpZiAoZm9ybWF0IHx8ICFmb3JtYXRVcHBlcikge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0gPSBmb3JtYXRVcHBlci5yZXBsYWNlKC9NTU1NfE1NfEREfGRkZGQvZywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbC5zbGljZSgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRJbnZhbGlkRGF0ZSA9ICdJbnZhbGlkIGRhdGUnO1xuXG4gICAgZnVuY3Rpb24gaW52YWxpZERhdGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52YWxpZERhdGU7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRPcmRpbmFsID0gJyVkJztcbiAgICB2YXIgZGVmYXVsdE9yZGluYWxQYXJzZSA9IC9cXGR7MSwyfS87XG5cbiAgICBmdW5jdGlvbiBvcmRpbmFsIChudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yZGluYWwucmVwbGFjZSgnJWQnLCBudW1iZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZVBhcnNlUG9zdEZvcm1hdCAoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRSZWxhdGl2ZVRpbWUgPSB7XG4gICAgICAgIGZ1dHVyZSA6ICdpbiAlcycsXG4gICAgICAgIHBhc3QgICA6ICclcyBhZ28nLFxuICAgICAgICBzICA6ICdhIGZldyBzZWNvbmRzJyxcbiAgICAgICAgbSAgOiAnYSBtaW51dGUnLFxuICAgICAgICBtbSA6ICclZCBtaW51dGVzJyxcbiAgICAgICAgaCAgOiAnYW4gaG91cicsXG4gICAgICAgIGhoIDogJyVkIGhvdXJzJyxcbiAgICAgICAgZCAgOiAnYSBkYXknLFxuICAgICAgICBkZCA6ICclZCBkYXlzJyxcbiAgICAgICAgTSAgOiAnYSBtb250aCcsXG4gICAgICAgIE1NIDogJyVkIG1vbnRocycsXG4gICAgICAgIHkgIDogJ2EgeWVhcicsXG4gICAgICAgIHl5IDogJyVkIHllYXJzJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiByZWxhdGl2ZV9fcmVsYXRpdmVUaW1lIChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX3JlbGF0aXZlVGltZVtzdHJpbmddO1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBvdXRwdXQgPT09ICdmdW5jdGlvbicpID9cbiAgICAgICAgICAgIG91dHB1dChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIDpcbiAgICAgICAgICAgIG91dHB1dC5yZXBsYWNlKC8lZC9pLCBudW1iZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhc3RGdXR1cmUgKGRpZmYsIG91dHB1dCkge1xuICAgICAgICB2YXIgZm9ybWF0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW2RpZmYgPiAwID8gJ2Z1dHVyZScgOiAncGFzdCddO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGZvcm1hdCA9PT0gJ2Z1bmN0aW9uJyA/IGZvcm1hdChvdXRwdXQpIDogZm9ybWF0LnJlcGxhY2UoLyVzL2ksIG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlX3NldF9fc2V0IChjb25maWcpIHtcbiAgICAgICAgdmFyIHByb3AsIGk7XG4gICAgICAgIGZvciAoaSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIHByb3AgPSBjb25maWdbaV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzW2ldID0gcHJvcDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpc1snXycgKyBpXSA9IHByb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGVuaWVudCBvcmRpbmFsIHBhcnNpbmcgYWNjZXB0cyBqdXN0IGEgbnVtYmVyIGluIGFkZGl0aW9uIHRvXG4gICAgICAgIC8vIG51bWJlciArIChwb3NzaWJseSkgc3R1ZmYgY29taW5nIGZyb20gX29yZGluYWxQYXJzZUxlbmllbnQuXG4gICAgICAgIHRoaXMuX29yZGluYWxQYXJzZUxlbmllbnQgPSBuZXcgUmVnRXhwKHRoaXMuX29yZGluYWxQYXJzZS5zb3VyY2UgKyAnfCcgKyAoL1xcZHsxLDJ9Lykuc291cmNlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvdG90eXBlX19wcm90byA9IExvY2FsZS5wcm90b3R5cGU7XG5cbiAgICBwcm90b3R5cGVfX3Byb3RvLl9jYWxlbmRhciAgICAgICA9IGRlZmF1bHRDYWxlbmRhcjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmNhbGVuZGFyICAgICAgICA9IGxvY2FsZV9jYWxlbmRhcl9fY2FsZW5kYXI7XG4gICAgcHJvdG90eXBlX19wcm90by5fbG9uZ0RhdGVGb3JtYXQgPSBkZWZhdWx0TG9uZ0RhdGVGb3JtYXQ7XG4gICAgcHJvdG90eXBlX19wcm90by5sb25nRGF0ZUZvcm1hdCAgPSBsb25nRGF0ZUZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9pbnZhbGlkRGF0ZSAgICA9IGRlZmF1bHRJbnZhbGlkRGF0ZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmludmFsaWREYXRlICAgICA9IGludmFsaWREYXRlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX29yZGluYWwgICAgICAgID0gZGVmYXVsdE9yZGluYWw7XG4gICAgcHJvdG90eXBlX19wcm90by5vcmRpbmFsICAgICAgICAgPSBvcmRpbmFsO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX29yZGluYWxQYXJzZSAgID0gZGVmYXVsdE9yZGluYWxQYXJzZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnByZXBhcnNlICAgICAgICA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnBvc3Rmb3JtYXQgICAgICA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9yZWxhdGl2ZVRpbWUgICA9IGRlZmF1bHRSZWxhdGl2ZVRpbWU7XG4gICAgcHJvdG90eXBlX19wcm90by5yZWxhdGl2ZVRpbWUgICAgPSByZWxhdGl2ZV9fcmVsYXRpdmVUaW1lO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucGFzdEZ1dHVyZSAgICAgID0gcGFzdEZ1dHVyZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnNldCAgICAgICAgICAgICA9IGxvY2FsZV9zZXRfX3NldDtcblxuICAgIC8vIE1vbnRoXG4gICAgcHJvdG90eXBlX19wcm90by5tb250aHMgICAgICAgPSAgICAgICAgbG9jYWxlTW9udGhzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX21vbnRocyAgICAgID0gZGVmYXVsdExvY2FsZU1vbnRocztcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRoc1Nob3J0ICA9ICAgICAgICBsb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9tb250aHNTaG9ydCA9IGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRoc1BhcnNlICA9ICAgICAgICBsb2NhbGVNb250aHNQYXJzZTtcblxuICAgIC8vIFdlZWtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWsgPSBsb2NhbGVXZWVrO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWsgPSBkZWZhdWx0TG9jYWxlV2VlaztcbiAgICBwcm90b3R5cGVfX3Byb3RvLmZpcnN0RGF5T2ZZZWFyID0gbG9jYWxlRmlyc3REYXlPZlllYXI7XG4gICAgcHJvdG90eXBlX19wcm90by5maXJzdERheU9mV2VlayA9IGxvY2FsZUZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgLy8gRGF5IG9mIFdlZWtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzICAgICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWtkYXlzICAgICAgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXM7XG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5c01pbiAgICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c01pbjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl93ZWVrZGF5c01pbiAgID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2Vla2RheXNTaG9ydCAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl93ZWVrZGF5c1Nob3J0ID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQ7XG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5c1BhcnNlICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c1BhcnNlO1xuXG4gICAgLy8gSG91cnNcbiAgICBwcm90b3R5cGVfX3Byb3RvLmlzUE0gPSBsb2NhbGVJc1BNO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX21lcmlkaWVtUGFyc2UgPSBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1lcmlkaWVtID0gbG9jYWxlTWVyaWRpZW07XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fZ2V0IChmb3JtYXQsIGluZGV4LCBmaWVsZCwgc2V0dGVyKSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKCk7XG4gICAgICAgIHZhciB1dGMgPSBjcmVhdGVfdXRjX19jcmVhdGVVVEMoKS5zZXQoc2V0dGVyLCBpbmRleCk7XG4gICAgICAgIHJldHVybiBsb2NhbGVbZmllbGRdKHV0YywgZm9ybWF0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0IChmb3JtYXQsIGluZGV4LCBmaWVsZCwgY291bnQsIHNldHRlcikge1xuICAgICAgICBpZiAodHlwZW9mIGZvcm1hdCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuXG4gICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdHNfX2dldChmb3JtYXQsIGluZGV4LCBmaWVsZCwgc2V0dGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgb3V0ID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBvdXRbaV0gPSBsaXN0c19fZ2V0KGZvcm1hdCwgaSwgZmllbGQsIHNldHRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdE1vbnRocyAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnbW9udGhzJywgMTIsICdtb250aCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0TW9udGhzU2hvcnQgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ21vbnRoc1Nob3J0JywgMTIsICdtb250aCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0V2Vla2RheXMgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzJywgNywgJ2RheScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0V2Vla2RheXNTaG9ydCAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNTaG9ydCcsIDcsICdkYXknKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdFdlZWtkYXlzTWluIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5c01pbicsIDcsICdkYXknKTtcbiAgICB9XG5cbiAgICBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKCdlbicsIHtcbiAgICAgICAgb3JkaW5hbFBhcnNlOiAvXFxkezEsMn0odGh8c3R8bmR8cmQpLyxcbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBiID0gbnVtYmVyICUgMTAsXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKHRvSW50KG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyAndGgnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMSkgPyAnc3QnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMikgPyAnbmQnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMykgPyAncmQnIDogJ3RoJztcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcbiAgICB1dGlsc19ob29rc19faG9va3MubGFuZyA9IGRlcHJlY2F0ZSgnbW9tZW50LmxhbmcgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGUgaW5zdGVhZC4nLCBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKTtcbiAgICB1dGlsc19ob29rc19faG9va3MubGFuZ0RhdGEgPSBkZXByZWNhdGUoJ21vbWVudC5sYW5nRGF0YSBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZURhdGEgaW5zdGVhZC4nLCBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKTtcblxuICAgIHZhciBtYXRoQWJzID0gTWF0aC5hYnM7XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hYnNfX2FicyAoKSB7XG4gICAgICAgIHZhciBkYXRhICAgICAgICAgICA9IHRoaXMuX2RhdGE7XG5cbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gbWF0aEFicyh0aGlzLl9taWxsaXNlY29uZHMpO1xuICAgICAgICB0aGlzLl9kYXlzICAgICAgICAgPSBtYXRoQWJzKHRoaXMuX2RheXMpO1xuICAgICAgICB0aGlzLl9tb250aHMgICAgICAgPSBtYXRoQWJzKHRoaXMuX21vbnRocyk7XG5cbiAgICAgICAgZGF0YS5taWxsaXNlY29uZHMgID0gbWF0aEFicyhkYXRhLm1pbGxpc2Vjb25kcyk7XG4gICAgICAgIGRhdGEuc2Vjb25kcyAgICAgICA9IG1hdGhBYnMoZGF0YS5zZWNvbmRzKTtcbiAgICAgICAgZGF0YS5taW51dGVzICAgICAgID0gbWF0aEFicyhkYXRhLm1pbnV0ZXMpO1xuICAgICAgICBkYXRhLmhvdXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEuaG91cnMpO1xuICAgICAgICBkYXRhLm1vbnRocyAgICAgICAgPSBtYXRoQWJzKGRhdGEubW9udGhzKTtcbiAgICAgICAgZGF0YS55ZWFycyAgICAgICAgID0gbWF0aEFicyhkYXRhLnllYXJzKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0IChkdXJhdGlvbiwgaW5wdXQsIHZhbHVlLCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbihpbnB1dCwgdmFsdWUpO1xuXG4gICAgICAgIGR1cmF0aW9uLl9taWxsaXNlY29uZHMgKz0gZGlyZWN0aW9uICogb3RoZXIuX21pbGxpc2Vjb25kcztcbiAgICAgICAgZHVyYXRpb24uX2RheXMgICAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fZGF5cztcbiAgICAgICAgZHVyYXRpb24uX21vbnRocyAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fbW9udGhzO1xuXG4gICAgICAgIHJldHVybiBkdXJhdGlvbi5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgYWRkKDEsICdzJykgb3IgYWRkKGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkIChpbnB1dCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QodGhpcywgaW5wdXQsIHZhbHVlLCAxKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBzdWJ0cmFjdCgxLCAncycpIG9yIHN1YnRyYWN0KGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fc3VidHJhY3QgKGlucHV0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBpbnB1dCwgdmFsdWUsIC0xKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNDZWlsIChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWJibGUgKCkge1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuICAgICAgICB2YXIgZGF5cyAgICAgICAgID0gdGhpcy5fZGF5cztcbiAgICAgICAgdmFyIG1vbnRocyAgICAgICA9IHRoaXMuX21vbnRocztcbiAgICAgICAgdmFyIGRhdGEgICAgICAgICA9IHRoaXMuX2RhdGE7XG4gICAgICAgIHZhciBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgeWVhcnMsIG1vbnRoc0Zyb21EYXlzO1xuXG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYSBtaXggb2YgcG9zaXRpdmUgYW5kIG5lZ2F0aXZlIHZhbHVlcywgYnViYmxlIGRvd24gZmlyc3RcbiAgICAgICAgLy8gY2hlY2s6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8yMTY2XG4gICAgICAgIGlmICghKChtaWxsaXNlY29uZHMgPj0gMCAmJiBkYXlzID49IDAgJiYgbW9udGhzID49IDApIHx8XG4gICAgICAgICAgICAgICAgKG1pbGxpc2Vjb25kcyA8PSAwICYmIGRheXMgPD0gMCAmJiBtb250aHMgPD0gMCkpKSB7XG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgKz0gYWJzQ2VpbChtb250aHNUb0RheXMobW9udGhzKSArIGRheXMpICogODY0ZTU7XG4gICAgICAgICAgICBkYXlzID0gMDtcbiAgICAgICAgICAgIG1vbnRocyA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgYnViYmxlcyB1cCB2YWx1ZXMsIHNlZSB0aGUgdGVzdHMgZm9yXG4gICAgICAgIC8vIGV4YW1wbGVzIG9mIHdoYXQgdGhhdCBtZWFucy5cbiAgICAgICAgZGF0YS5taWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZHMgJSAxMDAwO1xuXG4gICAgICAgIHNlY29uZHMgICAgICAgICAgID0gYWJzRmxvb3IobWlsbGlzZWNvbmRzIC8gMTAwMCk7XG4gICAgICAgIGRhdGEuc2Vjb25kcyAgICAgID0gc2Vjb25kcyAlIDYwO1xuXG4gICAgICAgIG1pbnV0ZXMgICAgICAgICAgID0gYWJzRmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgZGF0YS5taW51dGVzICAgICAgPSBtaW51dGVzICUgNjA7XG5cbiAgICAgICAgaG91cnMgICAgICAgICAgICAgPSBhYnNGbG9vcihtaW51dGVzIC8gNjApO1xuICAgICAgICBkYXRhLmhvdXJzICAgICAgICA9IGhvdXJzICUgMjQ7XG5cbiAgICAgICAgZGF5cyArPSBhYnNGbG9vcihob3VycyAvIDI0KTtcblxuICAgICAgICAvLyBjb252ZXJ0IGRheXMgdG8gbW9udGhzXG4gICAgICAgIG1vbnRoc0Zyb21EYXlzID0gYWJzRmxvb3IoZGF5c1RvTW9udGhzKGRheXMpKTtcbiAgICAgICAgbW9udGhzICs9IG1vbnRoc0Zyb21EYXlzO1xuICAgICAgICBkYXlzIC09IGFic0NlaWwobW9udGhzVG9EYXlzKG1vbnRoc0Zyb21EYXlzKSk7XG5cbiAgICAgICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgICAgICB5ZWFycyA9IGFic0Zsb29yKG1vbnRocyAvIDEyKTtcbiAgICAgICAgbW9udGhzICU9IDEyO1xuXG4gICAgICAgIGRhdGEuZGF5cyAgID0gZGF5cztcbiAgICAgICAgZGF0YS5tb250aHMgPSBtb250aHM7XG4gICAgICAgIGRhdGEueWVhcnMgID0geWVhcnM7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5c1RvTW9udGhzIChkYXlzKSB7XG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDE0NjA5NyBkYXlzICh0YWtpbmcgaW50byBhY2NvdW50IGxlYXAgeWVhciBydWxlcylcbiAgICAgICAgLy8gNDAwIHllYXJzIGhhdmUgMTIgbW9udGhzID09PSA0ODAwXG4gICAgICAgIHJldHVybiBkYXlzICogNDgwMCAvIDE0NjA5NztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb250aHNUb0RheXMgKG1vbnRocykge1xuICAgICAgICAvLyB0aGUgcmV2ZXJzZSBvZiBkYXlzVG9Nb250aHNcbiAgICAgICAgcmV0dXJuIG1vbnRocyAqIDE0NjA5NyAvIDQ4MDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXMgKHVuaXRzKSB7XG4gICAgICAgIHZhciBkYXlzO1xuICAgICAgICB2YXIgbW9udGhzO1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuXG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICBkYXlzICAgPSB0aGlzLl9kYXlzICAgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyArIGRheXNUb01vbnRocyhkYXlzKTtcbiAgICAgICAgICAgIHJldHVybiB1bml0cyA9PT0gJ21vbnRoJyA/IG1vbnRocyA6IG1vbnRocyAvIDEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaGFuZGxlIG1pbGxpc2Vjb25kcyBzZXBhcmF0ZWx5IGJlY2F1c2Ugb2YgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgKGlzc3VlICMxODY3KVxuICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyBNYXRoLnJvdW5kKG1vbnRoc1RvRGF5cyh0aGlzLl9tb250aHMpKTtcbiAgICAgICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd3ZWVrJyAgIDogcmV0dXJuIGRheXMgLyA3ICAgICArIG1pbGxpc2Vjb25kcyAvIDYwNDhlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdkYXknICAgIDogcmV0dXJuIGRheXMgICAgICAgICArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXInICAgOiByZXR1cm4gZGF5cyAqIDI0ICAgICsgbWlsbGlzZWNvbmRzIC8gMzZlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdtaW51dGUnIDogcmV0dXJuIGRheXMgKiAxNDQwICArIG1pbGxpc2Vjb25kcyAvIDZlNDtcbiAgICAgICAgICAgICAgICBjYXNlICdzZWNvbmQnIDogcmV0dXJuIGRheXMgKiA4NjQwMCArIG1pbGxpc2Vjb25kcyAvIDEwMDA7XG4gICAgICAgICAgICAgICAgLy8gTWF0aC5mbG9vciBwcmV2ZW50cyBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyBoZXJlXG4gICAgICAgICAgICAgICAgY2FzZSAnbWlsbGlzZWNvbmQnOiByZXR1cm4gTWF0aC5mbG9vcihkYXlzICogODY0ZTUpICsgbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignVW5rbm93biB1bml0ICcgKyB1bml0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiBVc2UgdGhpcy5hcygnbXMnKT9cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hc19fdmFsdWVPZiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgdGhpcy5fZGF5cyAqIDg2NGU1ICtcbiAgICAgICAgICAgICh0aGlzLl9tb250aHMgJSAxMikgKiAyNTkyZTYgK1xuICAgICAgICAgICAgdG9JbnQodGhpcy5fbW9udGhzIC8gMTIpICogMzE1MzZlNlxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VBcyAoYWxpYXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFzKGFsaWFzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYXNNaWxsaXNlY29uZHMgPSBtYWtlQXMoJ21zJyk7XG4gICAgdmFyIGFzU2Vjb25kcyAgICAgID0gbWFrZUFzKCdzJyk7XG4gICAgdmFyIGFzTWludXRlcyAgICAgID0gbWFrZUFzKCdtJyk7XG4gICAgdmFyIGFzSG91cnMgICAgICAgID0gbWFrZUFzKCdoJyk7XG4gICAgdmFyIGFzRGF5cyAgICAgICAgID0gbWFrZUFzKCdkJyk7XG4gICAgdmFyIGFzV2Vla3MgICAgICAgID0gbWFrZUFzKCd3Jyk7XG4gICAgdmFyIGFzTW9udGhzICAgICAgID0gbWFrZUFzKCdNJyk7XG4gICAgdmFyIGFzWWVhcnMgICAgICAgID0gbWFrZUFzKCd5Jyk7XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9nZXRfX2dldCAodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIHJldHVybiB0aGlzW3VuaXRzICsgJ3MnXSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VHZXR0ZXIobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbbmFtZV07XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IG1ha2VHZXR0ZXIoJ21pbGxpc2Vjb25kcycpO1xuICAgIHZhciBzZWNvbmRzICAgICAgPSBtYWtlR2V0dGVyKCdzZWNvbmRzJyk7XG4gICAgdmFyIG1pbnV0ZXMgICAgICA9IG1ha2VHZXR0ZXIoJ21pbnV0ZXMnKTtcbiAgICB2YXIgaG91cnMgICAgICAgID0gbWFrZUdldHRlcignaG91cnMnKTtcbiAgICB2YXIgZGF5cyAgICAgICAgID0gbWFrZUdldHRlcignZGF5cycpO1xuICAgIHZhciBtb250aHMgICAgICAgPSBtYWtlR2V0dGVyKCdtb250aHMnKTtcbiAgICB2YXIgeWVhcnMgICAgICAgID0gbWFrZUdldHRlcigneWVhcnMnKTtcblxuICAgIGZ1bmN0aW9uIHdlZWtzICgpIHtcbiAgICAgICAgcmV0dXJuIGFic0Zsb29yKHRoaXMuZGF5cygpIC8gNyk7XG4gICAgfVxuXG4gICAgdmFyIHJvdW5kID0gTWF0aC5yb3VuZDtcbiAgICB2YXIgdGhyZXNob2xkcyA9IHtcbiAgICAgICAgczogNDUsICAvLyBzZWNvbmRzIHRvIG1pbnV0ZVxuICAgICAgICBtOiA0NSwgIC8vIG1pbnV0ZXMgdG8gaG91clxuICAgICAgICBoOiAyMiwgIC8vIGhvdXJzIHRvIGRheVxuICAgICAgICBkOiAyNiwgIC8vIGRheXMgdG8gbW9udGhcbiAgICAgICAgTTogMTEgICAvLyBtb250aHMgdG8geWVhclxuICAgIH07XG5cbiAgICAvLyBoZWxwZXIgZnVuY3Rpb24gZm9yIG1vbWVudC5mbi5mcm9tLCBtb21lbnQuZm4uZnJvbU5vdywgYW5kIG1vbWVudC5kdXJhdGlvbi5mbi5odW1hbml6ZVxuICAgIGZ1bmN0aW9uIHN1YnN0aXR1dGVUaW1lQWdvKHN0cmluZywgbnVtYmVyLCB3aXRob3V0U3VmZml4LCBpc0Z1dHVyZSwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUucmVsYXRpdmVUaW1lKG51bWJlciB8fCAxLCAhIXdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2h1bWFuaXplX19yZWxhdGl2ZVRpbWUgKHBvc05lZ0R1cmF0aW9uLCB3aXRob3V0U3VmZml4LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbihwb3NOZWdEdXJhdGlvbikuYWJzKCk7XG4gICAgICAgIHZhciBzZWNvbmRzICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdzJykpO1xuICAgICAgICB2YXIgbWludXRlcyAgPSByb3VuZChkdXJhdGlvbi5hcygnbScpKTtcbiAgICAgICAgdmFyIGhvdXJzICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ2gnKSk7XG4gICAgICAgIHZhciBkYXlzICAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdkJykpO1xuICAgICAgICB2YXIgbW9udGhzICAgPSByb3VuZChkdXJhdGlvbi5hcygnTScpKTtcbiAgICAgICAgdmFyIHllYXJzICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ3knKSk7XG5cbiAgICAgICAgdmFyIGEgPSBzZWNvbmRzIDwgdGhyZXNob2xkcy5zICYmIFsncycsIHNlY29uZHNdICB8fFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPT09IDEgICAgICAgICAgJiYgWydtJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA8IHRocmVzaG9sZHMubSAmJiBbJ21tJywgbWludXRlc10gfHxcbiAgICAgICAgICAgICAgICBob3VycyAgID09PSAxICAgICAgICAgICYmIFsnaCddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIGhvdXJzICAgPCB0aHJlc2hvbGRzLmggJiYgWydoaCcsIGhvdXJzXSAgIHx8XG4gICAgICAgICAgICAgICAgZGF5cyAgICA9PT0gMSAgICAgICAgICAmJiBbJ2QnXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBkYXlzICAgIDwgdGhyZXNob2xkcy5kICYmIFsnZGQnLCBkYXlzXSAgICB8fFxuICAgICAgICAgICAgICAgIG1vbnRocyAgPT09IDEgICAgICAgICAgJiYgWydNJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzICA8IHRocmVzaG9sZHMuTSAmJiBbJ01NJywgbW9udGhzXSAgfHxcbiAgICAgICAgICAgICAgICB5ZWFycyAgID09PSAxICAgICAgICAgICYmIFsneSddICAgICAgICAgICB8fCBbJ3l5JywgeWVhcnNdO1xuXG4gICAgICAgIGFbMl0gPSB3aXRob3V0U3VmZml4O1xuICAgICAgICBhWzNdID0gK3Bvc05lZ0R1cmF0aW9uID4gMDtcbiAgICAgICAgYVs0XSA9IGxvY2FsZTtcbiAgICAgICAgcmV0dXJuIHN1YnN0aXR1dGVUaW1lQWdvLmFwcGx5KG51bGwsIGEpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gYWxsb3dzIHlvdSB0byBzZXQgYSB0aHJlc2hvbGQgZm9yIHJlbGF0aXZlIHRpbWUgc3RyaW5nc1xuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2h1bWFuaXplX19nZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQgKHRocmVzaG9sZCwgbGltaXQpIHtcbiAgICAgICAgaWYgKHRocmVzaG9sZHNbdGhyZXNob2xkXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbWl0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJlc2hvbGRzW3RocmVzaG9sZF07XG4gICAgICAgIH1cbiAgICAgICAgdGhyZXNob2xkc1t0aHJlc2hvbGRdID0gbGltaXQ7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGh1bWFuaXplICh3aXRoU3VmZml4KSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgdmFyIG91dHB1dCA9IGR1cmF0aW9uX2h1bWFuaXplX19yZWxhdGl2ZVRpbWUodGhpcywgIXdpdGhTdWZmaXgsIGxvY2FsZSk7XG5cbiAgICAgICAgaWYgKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgICAgIG91dHB1dCA9IGxvY2FsZS5wYXN0RnV0dXJlKCt0aGlzLCBvdXRwdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2FsZS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgfVxuXG4gICAgdmFyIGlzb19zdHJpbmdfX2FicyA9IE1hdGguYWJzO1xuXG4gICAgZnVuY3Rpb24gaXNvX3N0cmluZ19fdG9JU09TdHJpbmcoKSB7XG4gICAgICAgIC8vIGZvciBJU08gc3RyaW5ncyB3ZSBkbyBub3QgdXNlIHRoZSBub3JtYWwgYnViYmxpbmcgcnVsZXM6XG4gICAgICAgIC8vICAqIG1pbGxpc2Vjb25kcyBidWJibGUgdXAgdW50aWwgdGhleSBiZWNvbWUgaG91cnNcbiAgICAgICAgLy8gICogZGF5cyBkbyBub3QgYnViYmxlIGF0IGFsbFxuICAgICAgICAvLyAgKiBtb250aHMgYnViYmxlIHVwIHVudGlsIHRoZXkgYmVjb21lIHllYXJzXG4gICAgICAgIC8vIFRoaXMgaXMgYmVjYXVzZSB0aGVyZSBpcyBubyBjb250ZXh0LWZyZWUgY29udmVyc2lvbiBiZXR3ZWVuIGhvdXJzIGFuZCBkYXlzXG4gICAgICAgIC8vICh0aGluayBvZiBjbG9jayBjaGFuZ2VzKVxuICAgICAgICAvLyBhbmQgYWxzbyBub3QgYmV0d2VlbiBkYXlzIGFuZCBtb250aHMgKDI4LTMxIGRheXMgcGVyIG1vbnRoKVxuICAgICAgICB2YXIgc2Vjb25kcyA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLl9taWxsaXNlY29uZHMpIC8gMTAwMDtcbiAgICAgICAgdmFyIGRheXMgICAgICAgICA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLl9kYXlzKTtcbiAgICAgICAgdmFyIG1vbnRocyAgICAgICA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLl9tb250aHMpO1xuICAgICAgICB2YXIgbWludXRlcywgaG91cnMsIHllYXJzO1xuXG4gICAgICAgIC8vIDM2MDAgc2Vjb25kcyAtPiA2MCBtaW51dGVzIC0+IDEgaG91clxuICAgICAgICBtaW51dGVzICAgICAgICAgICA9IGFic0Zsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICAgIGhvdXJzICAgICAgICAgICAgID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICAgICAgc2Vjb25kcyAlPSA2MDtcbiAgICAgICAgbWludXRlcyAlPSA2MDtcblxuICAgICAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgICAgIHllYXJzICA9IGFic0Zsb29yKG1vbnRocyAvIDEyKTtcbiAgICAgICAgbW9udGhzICU9IDEyO1xuXG5cbiAgICAgICAgLy8gaW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2RvcmRpbGxlL21vbWVudC1pc29kdXJhdGlvbi9ibG9iL21hc3Rlci9tb21lbnQuaXNvZHVyYXRpb24uanNcbiAgICAgICAgdmFyIFkgPSB5ZWFycztcbiAgICAgICAgdmFyIE0gPSBtb250aHM7XG4gICAgICAgIHZhciBEID0gZGF5cztcbiAgICAgICAgdmFyIGggPSBob3VycztcbiAgICAgICAgdmFyIG0gPSBtaW51dGVzO1xuICAgICAgICB2YXIgcyA9IHNlY29uZHM7XG4gICAgICAgIHZhciB0b3RhbCA9IHRoaXMuYXNTZWNvbmRzKCk7XG5cbiAgICAgICAgaWYgKCF0b3RhbCkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyB0aGUgc2FtZSBhcyBDIydzIChOb2RhKSBhbmQgcHl0aG9uIChpc29kYXRlKS4uLlxuICAgICAgICAgICAgLy8gYnV0IG5vdCBvdGhlciBKUyAoZ29vZy5kYXRlKVxuICAgICAgICAgICAgcmV0dXJuICdQMEQnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICh0b3RhbCA8IDAgPyAnLScgOiAnJykgK1xuICAgICAgICAgICAgJ1AnICtcbiAgICAgICAgICAgIChZID8gWSArICdZJyA6ICcnKSArXG4gICAgICAgICAgICAoTSA/IE0gKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgKEQgPyBEICsgJ0QnIDogJycpICtcbiAgICAgICAgICAgICgoaCB8fCBtIHx8IHMpID8gJ1QnIDogJycpICtcbiAgICAgICAgICAgIChoID8gaCArICdIJyA6ICcnKSArXG4gICAgICAgICAgICAobSA/IG0gKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgKHMgPyBzICsgJ1MnIDogJycpO1xuICAgIH1cblxuICAgIHZhciBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvID0gRHVyYXRpb24ucHJvdG90eXBlO1xuXG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hYnMgICAgICAgICAgICA9IGR1cmF0aW9uX2Fic19fYWJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYWRkICAgICAgICAgICAgPSBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZDtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnN1YnRyYWN0ICAgICAgID0gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19zdWJ0cmFjdDtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzICAgICAgICAgICAgID0gYXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc01pbGxpc2Vjb25kcyA9IGFzTWlsbGlzZWNvbmRzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNTZWNvbmRzICAgICAgPSBhc1NlY29uZHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc01pbnV0ZXMgICAgICA9IGFzTWludXRlcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzSG91cnMgICAgICAgID0gYXNIb3VycztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzRGF5cyAgICAgICAgID0gYXNEYXlzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNXZWVrcyAgICAgICAgPSBhc1dlZWtzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNNb250aHMgICAgICAgPSBhc01vbnRocztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzWWVhcnMgICAgICAgID0gYXNZZWFycztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnZhbHVlT2YgICAgICAgID0gZHVyYXRpb25fYXNfX3ZhbHVlT2Y7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5fYnViYmxlICAgICAgICA9IGJ1YmJsZTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmdldCAgICAgICAgICAgID0gZHVyYXRpb25fZ2V0X19nZXQ7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5taWxsaXNlY29uZHMgICA9IG1pbGxpc2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnNlY29uZHMgICAgICAgID0gc2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLm1pbnV0ZXMgICAgICAgID0gbWludXRlcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmhvdXJzICAgICAgICAgID0gaG91cnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5kYXlzICAgICAgICAgICA9IGRheXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by53ZWVrcyAgICAgICAgICA9IHdlZWtzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubW9udGhzICAgICAgICAgPSBtb250aHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by55ZWFycyAgICAgICAgICA9IHllYXJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uaHVtYW5pemUgICAgICAgPSBodW1hbml6ZTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnRvSVNPU3RyaW5nICAgID0gaXNvX3N0cmluZ19fdG9JU09TdHJpbmc7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b1N0cmluZyAgICAgICA9IGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udG9KU09OICAgICAgICAgPSBpc29fc3RyaW5nX190b0lTT1N0cmluZztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmxvY2FsZSAgICAgICAgID0gbG9jYWxlO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubG9jYWxlRGF0YSAgICAgPSBsb2NhbGVEYXRhO1xuXG4gICAgLy8gRGVwcmVjYXRpb25zXG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b0lzb1N0cmluZyA9IGRlcHJlY2F0ZSgndG9Jc29TdHJpbmcoKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRvSVNPU3RyaW5nKCkgaW5zdGVhZCAobm90aWNlIHRoZSBjYXBpdGFscyknLCBpc29fc3RyaW5nX190b0lTT1N0cmluZyk7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5sYW5nID0gbGFuZztcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuICAgIGFkZEZvcm1hdFRva2VuKCdYJywgMCwgMCwgJ3VuaXgnKTtcbiAgICBhZGRGb3JtYXRUb2tlbigneCcsIDAsIDAsICd2YWx1ZU9mJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCd4JywgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1gnLCBtYXRjaFRpbWVzdGFtcCk7XG4gICAgYWRkUGFyc2VUb2tlbignWCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGlucHV0LCAxMCkgKiAxMDAwKTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCd4JywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHRvSW50KGlucHV0KSk7XG4gICAgfSk7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy52ZXJzaW9uID0gJzIuMTAuNic7XG5cbiAgICBzZXRIb29rQ2FsbGJhY2sobG9jYWxfX2NyZWF0ZUxvY2FsKTtcblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5mbiAgICAgICAgICAgICAgICAgICAgPSBtb21lbnRQcm90b3R5cGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm1pbiAgICAgICAgICAgICAgICAgICA9IG1pbjtcbiAgICB1dGlsc19ob29rc19faG9va3MubWF4ICAgICAgICAgICAgICAgICAgID0gbWF4O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy51dGMgICAgICAgICAgICAgICAgICAgPSBjcmVhdGVfdXRjX19jcmVhdGVVVEM7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnVuaXggICAgICAgICAgICAgICAgICA9IG1vbWVudF9fY3JlYXRlVW5peDtcbiAgICB1dGlsc19ob29rc19faG9va3MubW9udGhzICAgICAgICAgICAgICAgID0gbGlzdHNfX2xpc3RNb250aHM7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmlzRGF0ZSAgICAgICAgICAgICAgICA9IGlzRGF0ZTtcbiAgICB1dGlsc19ob29rc19faG9va3MubG9jYWxlICAgICAgICAgICAgICAgID0gbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZTtcbiAgICB1dGlsc19ob29rc19faG9va3MuaW52YWxpZCAgICAgICAgICAgICAgID0gdmFsaWRfX2NyZWF0ZUludmFsaWQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmR1cmF0aW9uICAgICAgICAgICAgICA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb247XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmlzTW9tZW50ICAgICAgICAgICAgICA9IGlzTW9tZW50O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy53ZWVrZGF5cyAgICAgICAgICAgICAgPSBsaXN0c19fbGlzdFdlZWtkYXlzO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVpvbmUgICAgICAgICAgICAgPSBtb21lbnRfX2NyZWF0ZUluWm9uZTtcbiAgICB1dGlsc19ob29rc19faG9va3MubG9jYWxlRGF0YSAgICAgICAgICAgID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZTtcbiAgICB1dGlsc19ob29rc19faG9va3MuaXNEdXJhdGlvbiAgICAgICAgICAgID0gaXNEdXJhdGlvbjtcbiAgICB1dGlsc19ob29rc19faG9va3MubW9udGhzU2hvcnQgICAgICAgICAgID0gbGlzdHNfX2xpc3RNb250aHNTaG9ydDtcbiAgICB1dGlsc19ob29rc19faG9va3Mud2Vla2RheXNNaW4gICAgICAgICAgID0gbGlzdHNfX2xpc3RXZWVrZGF5c01pbjtcbiAgICB1dGlsc19ob29rc19faG9va3MuZGVmaW5lTG9jYWxlICAgICAgICAgID0gZGVmaW5lTG9jYWxlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy53ZWVrZGF5c1Nob3J0ICAgICAgICAgPSBsaXN0c19fbGlzdFdlZWtkYXlzU2hvcnQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm5vcm1hbGl6ZVVuaXRzICAgICAgICA9IG5vcm1hbGl6ZVVuaXRzO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5yZWxhdGl2ZVRpbWVUaHJlc2hvbGQgPSBkdXJhdGlvbl9odW1hbml6ZV9fZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkO1xuXG4gICAgdmFyIF9tb21lbnQgPSB1dGlsc19ob29rc19faG9va3M7XG5cbiAgICByZXR1cm4gX21vbWVudDtcblxufSkpOyIsIi8qKlxuICogVHdpZy5qcyAwLjguMlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxMS0yMDE1IEpvaG4gUm9lcGtlIGFuZCB0aGUgVHdpZy5qcyBDb250cmlidXRvcnNcbiAqIEBsaWNlbnNlICAgQXZhaWxhYmxlIHVuZGVyIHRoZSBCU0QgMi1DbGF1c2UgTGljZW5zZVxuICogQGxpbmsgICAgICBodHRwczovL2dpdGh1Yi5jb20vanVzdGpvaG4vdHdpZy5qc1xuICovXG5cbnZhciBUd2lnID0gKGZ1bmN0aW9uIChUd2lnKSB7XG5cbiAgICBUd2lnLlZFUlNJT04gPSBcIjAuOC4yXCI7XG5cbiAgICByZXR1cm4gVHdpZztcbn0pKFR3aWcgfHwge30pO1xuLy8gICAgIFR3aWcuanNcbi8vICAgICBBdmFpbGFibGUgdW5kZXIgdGhlIEJTRCAyLUNsYXVzZSBMaWNlbnNlXG4vLyAgICAgaHR0cHM6Ly9naXRodWIuY29tL2p1c3Rqb2huL3R3aWcuanNcblxudmFyIFR3aWcgPSAoZnVuY3Rpb24gKFR3aWcpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvLyAjIyB0d2lnLmNvcmUuanNcbiAgICAvL1xuICAgIC8vIFRoaXMgZmlsZSBoYW5kbGVzIHRlbXBsYXRlIGxldmVsIHRva2VuaXppbmcsIGNvbXBpbGluZyBhbmQgcGFyc2luZy5cblxuICAgIFR3aWcudHJhY2UgPSBmYWxzZTtcbiAgICBUd2lnLmRlYnVnID0gZmFsc2U7XG5cbiAgICAvLyBEZWZhdWx0IGNhY2hpbmcgdG8gdHJ1ZSBmb3IgdGhlIGltcHJvdmVkIHBlcmZvcm1hbmNlIGl0IG9mZmVyc1xuICAgIFR3aWcuY2FjaGUgPSB0cnVlO1xuXG4gICAgVHdpZy5wbGFjZWhvbGRlcnMgPSB7XG4gICAgICAgIHBhcmVudDogXCJ7e3xQQVJFTlR8fX1cIlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGYWxsYmFjayBmb3IgQXJyYXkuaW5kZXhPZiBmb3IgSUU4IGV0IGFsXG4gICAgICovXG4gICAgVHdpZy5pbmRleE9mID0gZnVuY3Rpb24gKGFyciwgc2VhcmNoRWxlbWVudCAvKiwgZnJvbUluZGV4ICovICkge1xuICAgICAgICBpZiAoQXJyYXkucHJvdG90eXBlLmhhc093blByb3BlcnR5KFwiaW5kZXhPZlwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5pbmRleE9mKHNlYXJjaEVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcnIgPT09IHZvaWQgMCB8fCBhcnIgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdCA9IE9iamVjdChhcnIpO1xuICAgICAgICB2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XG4gICAgICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbiA9IDA7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbiA9IE51bWJlcihhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgaWYgKG4gIT09IG4pIHsgLy8gc2hvcnRjdXQgZm9yIHZlcmlmeWluZyBpZiBpdCdzIE5hTlxuICAgICAgICAgICAgICAgIG4gPSAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuICE9PSAwICYmIG4gIT09IEluZmluaXR5ICYmIG4gIT09IC1JbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIG4gPSAobiA+IDAgfHwgLTEpICogTWF0aC5mbG9vcihNYXRoLmFicyhuKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG4gPj0gbGVuKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImluZGV4T2Ygbm90IGZvdW5kMSBcIiwgSlNPTi5zdHJpbmdpZnkoc2VhcmNoRWxlbWVudCksIEpTT04uc3RyaW5naWZ5KGFycikpO1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIHZhciBrID0gbiA+PSAwID8gbiA6IE1hdGgubWF4KGxlbiAtIE1hdGguYWJzKG4pLCAwKTtcbiAgICAgICAgZm9yICg7IGsgPCBsZW47IGsrKykge1xuICAgICAgICAgICAgaWYgKGsgaW4gdCAmJiB0W2tdID09PSBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyciA9PSBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImluZGV4T2Ygbm90IGZvdW5kMiBcIiwgSlNPTi5zdHJpbmdpZnkoc2VhcmNoRWxlbWVudCksIEpTT04uc3RyaW5naWZ5KGFycikpO1xuXG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBUd2lnLmZvckVhY2ggPSBmdW5jdGlvbiAoYXJyLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgICBpZiAoQXJyYXkucHJvdG90eXBlLmZvckVhY2ggKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyLmZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIFQsIGs7XG5cbiAgICAgICAgaWYgKCBhcnIgPT0gbnVsbCApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCBcIiB0aGlzIGlzIG51bGwgb3Igbm90IGRlZmluZWRcIiApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMS4gTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0IHBhc3NpbmcgdGhlIHx0aGlzfCB2YWx1ZSBhcyB0aGUgYXJndW1lbnQuXG4gICAgICAgIHZhciBPID0gT2JqZWN0KGFycik7XG5cbiAgICAgICAgLy8gMi4gTGV0IGxlblZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0IGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggdGhlIGFyZ3VtZW50IFwibGVuZ3RoXCIuXG4gICAgICAgIC8vIDMuIExldCBsZW4gYmUgVG9VaW50MzIobGVuVmFsdWUpLlxuICAgICAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7IC8vIEhhY2sgdG8gY29udmVydCBPLmxlbmd0aCB0byBhIFVJbnQzMlxuXG4gICAgICAgIC8vIDQuIElmIElzQ2FsbGFibGUoY2FsbGJhY2spIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgIC8vIFNlZTogaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS4xMVxuICAgICAgICBpZiAoIHt9LnRvU3RyaW5nLmNhbGwoY2FsbGJhY2spICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIiApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCBjYWxsYmFjayArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDUuIElmIHRoaXNBcmcgd2FzIHN1cHBsaWVkLCBsZXQgVCBiZSB0aGlzQXJnOyBlbHNlIGxldCBUIGJlIHVuZGVmaW5lZC5cbiAgICAgICAgaWYgKCB0aGlzQXJnICkge1xuICAgICAgICAgIFQgPSB0aGlzQXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gNi4gTGV0IGsgYmUgMFxuICAgICAgICBrID0gMDtcblxuICAgICAgICAvLyA3LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW5cbiAgICAgICAgd2hpbGUoIGsgPCBsZW4gKSB7XG5cbiAgICAgICAgICB2YXIga1ZhbHVlO1xuXG4gICAgICAgICAgLy8gYS4gTGV0IFBrIGJlIFRvU3RyaW5nKGspLlxuICAgICAgICAgIC8vICAgVGhpcyBpcyBpbXBsaWNpdCBmb3IgTEhTIG9wZXJhbmRzIG9mIHRoZSBpbiBvcGVyYXRvclxuICAgICAgICAgIC8vIGIuIExldCBrUHJlc2VudCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEhhc1Byb3BlcnR5IGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXG4gICAgICAgICAgLy8gICBUaGlzIHN0ZXAgY2FuIGJlIGNvbWJpbmVkIHdpdGggY1xuICAgICAgICAgIC8vIGMuIElmIGtQcmVzZW50IGlzIHRydWUsIHRoZW5cbiAgICAgICAgICBpZiAoIGsgaW4gTyApIHtcblxuICAgICAgICAgICAgLy8gaS4gTGV0IGtWYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldCBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxuICAgICAgICAgICAga1ZhbHVlID0gT1sgayBdO1xuXG4gICAgICAgICAgICAvLyBpaS4gQ2FsbCB0aGUgQ2FsbCBpbnRlcm5hbCBtZXRob2Qgb2YgY2FsbGJhY2sgd2l0aCBUIGFzIHRoZSB0aGlzIHZhbHVlIGFuZFxuICAgICAgICAgICAgLy8gYXJndW1lbnQgbGlzdCBjb250YWluaW5nIGtWYWx1ZSwgaywgYW5kIE8uXG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKCBULCBrVmFsdWUsIGssIE8gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gZC4gSW5jcmVhc2UgayBieSAxLlxuICAgICAgICAgIGsrKztcbiAgICAgICAgfVxuICAgICAgICAvLyA4LiByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICAgIFR3aWcubWVyZ2UgPSBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSwgb25seUNoYW5nZWQpIHtcbiAgICAgICAgVHdpZy5mb3JFYWNoKE9iamVjdC5rZXlzKHNvdXJjZSksIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChvbmx5Q2hhbmdlZCAmJiAhKGtleSBpbiB0YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEV4Y2VwdGlvbiB0aHJvd24gYnkgdHdpZy5qcy5cbiAgICAgKi9cbiAgICBUd2lnLkVycm9yID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgdGhpcy5uYW1lID0gXCJUd2lnRXhjZXB0aW9uXCI7XG4gICAgICAgdGhpcy50eXBlID0gXCJUd2lnRXhjZXB0aW9uXCI7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgVHdpZyBlcnJvci5cbiAgICAgKi9cbiAgICBUd2lnLkVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5uYW1lICsgXCI6IFwiICsgdGhpcy5tZXNzYWdlO1xuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFdyYXBwZXIgZm9yIGxvZ2dpbmcgdG8gdGhlIGNvbnNvbGUuXG4gICAgICovXG4gICAgVHdpZy5sb2cgPSB7XG4gICAgICAgIHRyYWNlOiBmdW5jdGlvbigpIHtpZiAoVHdpZy50cmFjZSAmJiBjb25zb2xlKSB7Y29uc29sZS5sb2coQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7fX0sXG4gICAgICAgIGRlYnVnOiBmdW5jdGlvbigpIHtpZiAoVHdpZy5kZWJ1ZyAmJiBjb25zb2xlKSB7Y29uc29sZS5sb2coQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7fX1cbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZS5lcnJvciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgVHdpZy5sb2cuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnNvbGUubG9nICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBUd2lnLmxvZy5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBUd2lnLmxvZy5lcnJvciA9IGZ1bmN0aW9uKCl7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXcmFwcGVyIGZvciBjaGlsZCBjb250ZXh0IG9iamVjdHMgaW4gVHdpZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IFZhbHVlcyB0byBpbml0aWFsaXplIHRoZSBjb250ZXh0IHdpdGguXG4gICAgICovXG4gICAgVHdpZy5DaGlsZENvbnRleHQgPSBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgIHZhciBDaGlsZENvbnRleHQgPSBmdW5jdGlvbiBDaGlsZENvbnRleHQoKSB7fTtcbiAgICAgICAgQ2hpbGRDb250ZXh0LnByb3RvdHlwZSA9IGNvbnRleHQ7XG4gICAgICAgIHJldHVybiBuZXcgQ2hpbGRDb250ZXh0KCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvbnRhaW5lciBmb3IgbWV0aG9kcyByZWxhdGVkIHRvIGhhbmRsaW5nIGhpZ2ggbGV2ZWwgdGVtcGxhdGUgdG9rZW5zXG4gICAgICogICAgICAoZm9yIGV4YW1wbGU6IHt7IGV4cHJlc3Npb24gfX0sIHslIGxvZ2ljICV9LCB7IyBjb21tZW50ICN9LCByYXcgZGF0YSlcbiAgICAgKi9cbiAgICBUd2lnLnRva2VuID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUb2tlbiB0eXBlcy5cbiAgICAgKi9cbiAgICBUd2lnLnRva2VuLnR5cGUgPSB7XG4gICAgICAgIG91dHB1dDogICdvdXRwdXQnLFxuICAgICAgICBsb2dpYzogICAnbG9naWMnLFxuICAgICAgICBjb21tZW50OiAnY29tbWVudCcsXG4gICAgICAgIHJhdzogICAgICdyYXcnXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRva2VuIHN5bnRheCBkZWZpbml0aW9ucy5cbiAgICAgKi9cbiAgICBUd2lnLnRva2VuLmRlZmluaXRpb25zID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLnRva2VuLnR5cGUucmF3LFxuICAgICAgICAgICAgb3BlbjogJ3slIHJhdyAlfScsXG4gICAgICAgICAgICBjbG9zZTogJ3slIGVuZHJhdyAlfSdcbiAgICAgICAgfSxcbiAgICAgICAgLy8gKk91dHB1dCB0eXBlIHRva2VucypcbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlc2UgdHlwaWNhbGx5IHRha2UgdGhlIGZvcm0gYHt7IGV4cHJlc3Npb24gfX1gLlxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLnRva2VuLnR5cGUub3V0cHV0LFxuICAgICAgICAgICAgb3BlbjogJ3t7JyxcbiAgICAgICAgICAgIGNsb3NlOiAnfX0nXG4gICAgICAgIH0sXG4gICAgICAgIC8vICpMb2dpYyB0eXBlIHRva2VucypcbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlc2UgdHlwaWNhbGx5IHRha2UgYSBmb3JtIGxpa2UgYHslIGlmIGV4cHJlc3Npb24gJX1gIG9yIGB7JSBlbmRpZiAlfWBcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy50b2tlbi50eXBlLmxvZ2ljLFxuICAgICAgICAgICAgb3BlbjogJ3slJyxcbiAgICAgICAgICAgIGNsb3NlOiAnJX0nXG4gICAgICAgIH0sXG4gICAgICAgIC8vICpDb21tZW50IHR5cGUgdG9rZW5zKlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGVzZSB0YWtlIHRoZSBmb3JtIGB7IyBhbnl0aGluZyAjfWBcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy50b2tlbi50eXBlLmNvbW1lbnQsXG4gICAgICAgICAgICBvcGVuOiAneyMnLFxuICAgICAgICAgICAgY2xvc2U6ICcjfSdcbiAgICAgICAgfVxuICAgIF07XG5cblxuICAgIC8qKlxuICAgICAqIFdoYXQgY2hhcmFjdGVycyBzdGFydCBcInN0cmluZ3NcIiBpbiB0b2tlbiBkZWZpbml0aW9ucy4gV2UgbmVlZCB0aGlzIHRvIGlnbm9yZSB0b2tlbiBjbG9zZVxuICAgICAqIHN0cmluZ3MgaW5zaWRlIGFuIGV4cHJlc3Npb24uXG4gICAgICovXG4gICAgVHdpZy50b2tlbi5zdHJpbmdzID0gWydcIicsIFwiJ1wiXTtcblxuICAgIFR3aWcudG9rZW4uZmluZFN0YXJ0ID0gZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IG51bGwsXG4gICAgICAgICAgICAgICAgZGVmOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIHRva2VuX3RlbXBsYXRlLFxuICAgICAgICAgICAgZmlyc3Rfa2V5X3Bvc2l0aW9uO1xuXG4gICAgICAgIGZvciAoaT0wO2k8VHdpZy50b2tlbi5kZWZpbml0aW9ucy5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICB0b2tlbl90ZW1wbGF0ZSA9IFR3aWcudG9rZW4uZGVmaW5pdGlvbnNbaV07XG4gICAgICAgICAgICBmaXJzdF9rZXlfcG9zaXRpb24gPSB0ZW1wbGF0ZS5pbmRleE9mKHRva2VuX3RlbXBsYXRlLm9wZW4pO1xuXG4gICAgICAgICAgICBUd2lnLmxvZy50cmFjZShcIlR3aWcudG9rZW4uZmluZFN0YXJ0OiBcIiwgXCJTZWFyY2hpbmcgZm9yIFwiLCB0b2tlbl90ZW1wbGF0ZS5vcGVuLCBcIiBmb3VuZCBhdCBcIiwgZmlyc3Rfa2V5X3Bvc2l0aW9uKTtcblxuICAgICAgICAgICAgLy8gRG9lcyB0aGlzIHRva2VuIG9jY3VyIGJlZm9yZSBhbnkgb3RoZXIgdHlwZXM/XG4gICAgICAgICAgICBpZiAoZmlyc3Rfa2V5X3Bvc2l0aW9uID49IDAgJiYgKG91dHB1dC5wb3NpdGlvbiA9PT0gbnVsbCB8fCBmaXJzdF9rZXlfcG9zaXRpb24gPCBvdXRwdXQucG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnBvc2l0aW9uID0gZmlyc3Rfa2V5X3Bvc2l0aW9uO1xuICAgICAgICAgICAgICAgIG91dHB1dC5kZWYgPSB0b2tlbl90ZW1wbGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcblxuICAgIFR3aWcudG9rZW4uZmluZEVuZCA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgdG9rZW5fZGVmLCBzdGFydCkge1xuICAgICAgICB2YXIgZW5kID0gbnVsbCxcbiAgICAgICAgICAgIGZvdW5kID0gZmFsc2UsXG4gICAgICAgICAgICBvZmZzZXQgPSAwLFxuXG4gICAgICAgICAgICAvLyBTdHJpbmcgcG9zaXRpb24gdmFyaWFibGVzXG4gICAgICAgICAgICBzdHJfcG9zID0gbnVsbCxcbiAgICAgICAgICAgIHN0cl9mb3VuZCA9IG51bGwsXG4gICAgICAgICAgICBwb3MgPSBudWxsLFxuICAgICAgICAgICAgZW5kX29mZnNldCA9IG51bGwsXG4gICAgICAgICAgICB0aGlzX3N0cl9wb3MgPSBudWxsLFxuICAgICAgICAgICAgZW5kX3N0cl9wb3MgPSBudWxsLFxuXG4gICAgICAgICAgICAvLyBGb3IgbG9vcCB2YXJpYWJsZXNcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBsO1xuXG4gICAgICAgIHdoaWxlICghZm91bmQpIHtcbiAgICAgICAgICAgIHN0cl9wb3MgPSBudWxsO1xuICAgICAgICAgICAgc3RyX2ZvdW5kID0gbnVsbDtcbiAgICAgICAgICAgIHBvcyA9IHRlbXBsYXRlLmluZGV4T2YodG9rZW5fZGVmLmNsb3NlLCBvZmZzZXQpO1xuXG4gICAgICAgICAgICBpZiAocG9zID49IDApIHtcbiAgICAgICAgICAgICAgICBlbmQgPSBwb3M7XG4gICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aHJvdyBhbiBleGNlcHRpb25cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIlVuYWJsZSB0byBmaW5kIGNsb3NpbmcgYnJhY2tldCAnXCIgKyB0b2tlbl9kZWYuY2xvc2UgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIidcIiArIFwiIG9wZW5lZCBuZWFyIHRlbXBsYXRlIHBvc2l0aW9uIFwiICsgc3RhcnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZ25vcmUgcXVvdGVzIHdpdGhpbiBjb21tZW50czsganVzdCBsb29rIGZvciB0aGUgbmV4dCBjb21tZW50IGNsb3NlIHNlcXVlbmNlLFxuICAgICAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiB3aGF0IGNvbWVzIGJlZm9yZSBpdC4gaHR0cHM6Ly9naXRodWIuY29tL2p1c3Rqb2huL3R3aWcuanMvaXNzdWVzLzk1XG4gICAgICAgICAgICBpZiAodG9rZW5fZGVmLnR5cGUgPT09IFR3aWcudG9rZW4udHlwZS5jb21tZW50KSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsID0gVHdpZy50b2tlbi5zdHJpbmdzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzX3N0cl9wb3MgPSB0ZW1wbGF0ZS5pbmRleE9mKFR3aWcudG9rZW4uc3RyaW5nc1tpXSwgb2Zmc2V0KTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzX3N0cl9wb3MgPiAwICYmIHRoaXNfc3RyX3BvcyA8IHBvcyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKHN0cl9wb3MgPT09IG51bGwgfHwgdGhpc19zdHJfcG9zIDwgc3RyX3BvcykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyX3BvcyA9IHRoaXNfc3RyX3BvcztcbiAgICAgICAgICAgICAgICAgICAgc3RyX2ZvdW5kID0gVHdpZy50b2tlbi5zdHJpbmdzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gV2UgZm91bmQgYSBzdHJpbmcgYmVmb3JlIHRoZSBlbmQgb2YgdGhlIHRva2VuLCBub3cgZmluZCB0aGUgc3RyaW5nJ3MgZW5kIGFuZCBzZXQgdGhlIHNlYXJjaCBvZmZzZXQgdG8gaXRcbiAgICAgICAgICAgIGlmIChzdHJfcG9zICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZW5kX29mZnNldCA9IHN0cl9wb3MgKyAxO1xuICAgICAgICAgICAgICAgIGVuZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBlbmRfc3RyX3BvcyA9IHRlbXBsYXRlLmluZGV4T2Yoc3RyX2ZvdW5kLCBlbmRfb2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZF9zdHJfcG9zIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmNsb3NlZCBzdHJpbmcgaW4gdGVtcGxhdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmUgZXNjYXBlZCBxdW90ZXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXBsYXRlLnN1YnN0cihlbmRfc3RyX3BvcyAtIDEsIDEpICE9PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gZW5kX3N0cl9wb3MgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRfb2Zmc2V0ID0gZW5kX3N0cl9wb3MgKyAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbmQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgYSB0ZW1wbGF0ZSBpbnRvIGhpZ2gtbGV2ZWwgdG9rZW5zLlxuICAgICAqL1xuICAgIFR3aWcudG9rZW5pemUgPSBmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgdmFyIHRva2VucyA9IFtdLFxuICAgICAgICAgICAgLy8gQW4gb2Zmc2V0IGZvciByZXBvcnRpbmcgZXJyb3JzIGxvY2F0aW9ucyBpbiB0aGUgdGVtcGxhdGUuXG4gICAgICAgICAgICBlcnJvcl9vZmZzZXQgPSAwLFxuXG4gICAgICAgICAgICAvLyBUaGUgc3RhcnQgYW5kIHR5cGUgb2YgdGhlIGZpcnN0IHRva2VuIGZvdW5kIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICAgICAgICAgIGZvdW5kX3Rva2VuID0gbnVsbCxcbiAgICAgICAgICAgIC8vIFRoZSBlbmQgcG9zaXRpb24gb2YgdGhlIG1hdGNoZWQgdG9rZW4uXG4gICAgICAgICAgICBlbmQgPSBudWxsO1xuXG4gICAgICAgIHdoaWxlICh0ZW1wbGF0ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBmaXJzdCBvY2N1cmFuY2Ugb2YgYW55IHRva2VuIHR5cGUgaW4gdGhlIHRlbXBsYXRlXG4gICAgICAgICAgICBmb3VuZF90b2tlbiA9IFR3aWcudG9rZW4uZmluZFN0YXJ0KHRlbXBsYXRlKTtcblxuICAgICAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLnRva2VuaXplOiBcIiwgXCJGb3VuZCB0b2tlbjogXCIsIGZvdW5kX3Rva2VuKTtcblxuICAgICAgICAgICAgaWYgKGZvdW5kX3Rva2VuLnBvc2l0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gQWRkIGEgcmF3IHR5cGUgdG9rZW4gZm9yIGFueXRoaW5nIGJlZm9yZSB0aGUgc3RhcnQgb2YgdGhlIHRva2VuXG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kX3Rva2VuLnBvc2l0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBUd2lnLnRva2VuLnR5cGUucmF3LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRlbXBsYXRlLnN1YnN0cmluZygwLCBmb3VuZF90b2tlbi5wb3NpdGlvbilcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUuc3Vic3RyKGZvdW5kX3Rva2VuLnBvc2l0aW9uICsgZm91bmRfdG9rZW4uZGVmLm9wZW4ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBlcnJvcl9vZmZzZXQgKz0gZm91bmRfdG9rZW4ucG9zaXRpb24gKyBmb3VuZF90b2tlbi5kZWYub3Blbi5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAvLyBGaW5kIHRoZSBlbmQgb2YgdGhlIHRva2VuXG4gICAgICAgICAgICAgICAgZW5kID0gVHdpZy50b2tlbi5maW5kRW5kKHRlbXBsYXRlLCBmb3VuZF90b2tlbi5kZWYsIGVycm9yX29mZnNldCk7XG5cbiAgICAgICAgICAgICAgICBUd2lnLmxvZy50cmFjZShcIlR3aWcudG9rZW5pemU6IFwiLCBcIlRva2VuIGVuZHMgYXQgXCIsIGVuZCk7XG5cbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICBmb3VuZF90b2tlbi5kZWYudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRlbXBsYXRlLnN1YnN0cmluZygwLCBlbmQpLnRyaW0oKVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBmb3VuZF90b2tlbi5kZWYudHlwZSA9PT0gXCJsb2dpY1wiICYmIHRlbXBsYXRlLnN1YnN0ciggZW5kICsgZm91bmRfdG9rZW4uZGVmLmNsb3NlLmxlbmd0aCwgMSApID09PSBcIlxcblwiICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBOZXdsaW5lcyBkaXJlY3RseSBhZnRlciBsb2dpYyB0b2tlbnMgYXJlIGlnbm9yZWRcbiAgICAgICAgICAgICAgICAgICAgZW5kICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5zdWJzdHIoZW5kICsgZm91bmRfdG9rZW4uZGVmLmNsb3NlLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgdGhlIHBvc2l0aW9uIGluIHRoZSB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIGVycm9yX29mZnNldCArPSBlbmQgKyBmb3VuZF90b2tlbi5kZWYuY2xvc2UubGVuZ3RoO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE5vIG1vcmUgdG9rZW5zIC0+IGFkZCB0aGUgcmVzdCBvZiB0aGUgdGVtcGxhdGUgYXMgYSByYXctdHlwZSB0b2tlblxuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogVHdpZy50b2tlbi50eXBlLnJhdyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfTtcblxuXG4gICAgVHdpZy5jb21waWxlID0gZnVuY3Rpb24gKHRva2Vucykge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyBPdXRwdXQgYW5kIGludGVybWVkaWF0ZSBzdGFja3NcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXSxcbiAgICAgICAgICAgICAgICBzdGFjayA9IFtdLFxuICAgICAgICAgICAgICAgIC8vIFRoZSB0b2tlbnMgYmV0d2VlbiBvcGVuIGFuZCBjbG9zZSB0YWdzXG4gICAgICAgICAgICAgICAgaW50ZXJtZWRpYXRlX291dHB1dCA9IFtdLFxuXG4gICAgICAgICAgICAgICAgdG9rZW4gPSBudWxsLFxuICAgICAgICAgICAgICAgIGxvZ2ljX3Rva2VuID0gbnVsbCxcbiAgICAgICAgICAgICAgICB1bmNsb3NlZF90b2tlbiA9IG51bGwsXG4gICAgICAgICAgICAgICAgLy8gVGVtcG9yYXJ5IHByZXZpb3VzIHRva2VuLlxuICAgICAgICAgICAgICAgIHByZXZfdG9rZW4gPSBudWxsLFxuICAgICAgICAgICAgICAgIC8vIFRoZSBwcmV2aW91cyB0b2tlbidzIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgcHJldl90ZW1wbGF0ZSA9IG51bGwsXG4gICAgICAgICAgICAgICAgLy8gVGhlIG91dHB1dCB0b2tlblxuICAgICAgICAgICAgICAgIHRva19vdXRwdXQgPSBudWxsLFxuXG4gICAgICAgICAgICAgICAgLy8gTG9naWMgVG9rZW4gdmFsdWVzXG4gICAgICAgICAgICAgICAgdHlwZSA9IG51bGwsXG4gICAgICAgICAgICAgICAgb3BlbiA9IG51bGwsXG4gICAgICAgICAgICAgICAgbmV4dCA9IG51bGw7XG5cbiAgICAgICAgICAgIHdoaWxlICh0b2tlbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJDb21waWxpbmcgdG9rZW4gXCIsIHRva2VuKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRva2VuLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBUd2lnLnRva2VuLnR5cGUucmF3OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm1lZGlhdGVfb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIFR3aWcudG9rZW4udHlwZS5sb2dpYzpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbXBpbGUgdGhlIGxvZ2ljIHRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpY190b2tlbiA9IFR3aWcubG9naWMuY29tcGlsZS5hcHBseSh0aGlzLCBbdG9rZW5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA9IGxvZ2ljX3Rva2VuLnR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuID0gVHdpZy5sb2dpYy5oYW5kbGVyW3R5cGVdLm9wZW47XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0ID0gVHdpZy5sb2dpYy5oYW5kbGVyW3R5cGVdLm5leHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFR3aWcubG9nLnRyYWNlKFwiVHdpZy5jb21waWxlOiBcIiwgXCJDb21waWxlZCBsb2dpYyB0b2tlbiB0byBcIiwgbG9naWNfdG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBuZXh0IGlzOiBcIiwgbmV4dCwgXCIgb3BlbiBpcyA6IFwiLCBvcGVuKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90IGEgc3RhbmRhbG9uZSB0b2tlbiwgY2hlY2sgbG9naWMgc3RhY2sgdG8gc2VlIGlmIHRoaXMgaXMgZXhwZWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcGVuICE9PSB1bmRlZmluZWQgJiYgIW9wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2X3Rva2VuID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldl90ZW1wbGF0ZSA9IFR3aWcubG9naWMuaGFuZGxlcltwcmV2X3Rva2VuLnR5cGVdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR3aWcuaW5kZXhPZihwcmV2X3RlbXBsYXRlLm5leHQsIHR5cGUpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodHlwZSArIFwiIG5vdCBleHBlY3RlZCBhZnRlciBhIFwiICsgcHJldl90b2tlbi50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2X3Rva2VuLm91dHB1dCA9IHByZXZfdG9rZW4ub3V0cHV0IHx8IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldl90b2tlbi5vdXRwdXQgPSBwcmV2X3Rva2VuLm91dHB1dC5jb25jYXQoaW50ZXJtZWRpYXRlX291dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJtZWRpYXRlX291dHB1dCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rX291dHB1dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogVHdpZy50b2tlbi50eXBlLmxvZ2ljLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogcHJldl90b2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJtZWRpYXRlX291dHB1dC5wdXNoKHRva19vdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva19vdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyB0b2tlbiByZXF1aXJlcyBhZGRpdGlvbmFsIHRva2VucyB0byBjb21wbGV0ZSB0aGUgbG9naWMgc3RydWN0dXJlLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQgIT09IHVuZGVmaW5lZCAmJiBuZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUd2lnLmxvZy50cmFjZShcIlR3aWcuY29tcGlsZTogXCIsIFwiUHVzaGluZyBcIiwgbG9naWNfdG9rZW4sIFwiIHRvIGxvZ2ljIHN0YWNrLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFB1dCBhbnkgY3VycmVudGx5IGhlbGQgb3V0cHV0IGludG8gdGhlIG91dHB1dCBsaXN0IG9mIHRoZSBsb2dpYyBvcGVyYXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjdXJyZW50bHkgYXQgdGhlIGhlYWQgb2YgdGhlIHN0YWNrIGJlZm9yZSB3ZSBwdXNoIGEgbmV3IG9uZSBvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldl90b2tlbiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2X3Rva2VuLm91dHB1dCA9IHByZXZfdG9rZW4ub3V0cHV0IHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2X3Rva2VuLm91dHB1dCA9IHByZXZfdG9rZW4ub3V0cHV0LmNvbmNhdChpbnRlcm1lZGlhdGVfb3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChwcmV2X3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJtZWRpYXRlX291dHB1dCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFB1c2ggdGhlIG5ldyBsb2dpYyB0b2tlbiBvbnRvIHRoZSBsb2dpYyBzdGFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobG9naWNfdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wZW4gIT09IHVuZGVmaW5lZCAmJiBvcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rX291dHB1dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogVHdpZy50b2tlbi50eXBlLmxvZ2ljLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogbG9naWNfdG9rZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0YW5kYWxvbmUgdG9rZW4gKGxpa2UgeyUgc2V0IC4uLiAlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVybWVkaWF0ZV9vdXRwdXQucHVzaCh0b2tfb3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tfb3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBEbyBub3RoaW5nLCBjb21tZW50cyBzaG91bGQgYmUgaWdub3JlZFxuICAgICAgICAgICAgICAgICAgICBjYXNlIFR3aWcudG9rZW4udHlwZS5jb21tZW50OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBUd2lnLnRva2VuLnR5cGUub3V0cHV0OlxuICAgICAgICAgICAgICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLmNvbXBpbGUuYXBwbHkodGhpcywgW3Rva2VuXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVybWVkaWF0ZV9vdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIFR3aWcubG9nLnRyYWNlKFwiVHdpZy5jb21waWxlOiBcIiwgXCIgT3V0cHV0OiBcIiwgb3V0cHV0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIExvZ2ljIFN0YWNrOiBcIiwgc3RhY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgUGVuZGluZyBPdXRwdXQ6IFwiLCBpbnRlcm1lZGlhdGVfb3V0cHV0ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZXJlIGFyZSBubyBsb2dpYyB0b2tlbnMgbGVmdCBpbiB0aGUgc3RhY2suXG4gICAgICAgICAgICBpZiAoc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHVuY2xvc2VkX3Rva2VuID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGZpbmQgYW4gZW5kIHRhZyBmb3IgXCIgKyB1bmNsb3NlZF90b2tlbi50eXBlICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIsIGV4cGVjdGluZyBvbmUgb2YgXCIgKyB1bmNsb3NlZF90b2tlbi5uZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICBUd2lnLmxvZy5lcnJvcihcIkVycm9yIGNvbXBpbGluZyB0d2lnIHRlbXBsYXRlIFwiICsgdGhpcy5pZCArIFwiOiBcIik7XG4gICAgICAgICAgICBpZiAoZXguc3RhY2spIHtcbiAgICAgICAgICAgICAgICBUd2lnLmxvZy5lcnJvcihleC5zdGFjayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFR3aWcubG9nLmVycm9yKGV4LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJldGhyb3cpIHRocm93IGV4O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFBhcnNlIGEgY29tcGlsZWQgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB0b2tlbnMgVGhlIGNvbXBpbGVkIHRva2Vucy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCBUaGUgcmVuZGVyIGNvbnRleHQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBwYXJzZWQgdGVtcGxhdGUuXG4gICAgICovXG4gICAgVHdpZy5wYXJzZSA9IGZ1bmN0aW9uICh0b2tlbnMsIGNvbnRleHQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXSxcbiAgICAgICAgICAgICAgICAvLyBUcmFjayBsb2dpYyBjaGFpbnNcbiAgICAgICAgICAgICAgICBjaGFpbiA9IHRydWUsXG4gICAgICAgICAgICAgICAgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgICAgIFR3aWcuZm9yRWFjaCh0b2tlbnMsIGZ1bmN0aW9uIHBhcnNlVG9rZW4odG9rZW4pIHtcbiAgICAgICAgICAgICAgICBUd2lnLmxvZy5kZWJ1ZyhcIlR3aWcucGFyc2U6IFwiLCBcIlBhcnNpbmcgdG9rZW46IFwiLCB0b2tlbik7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRva2VuLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBUd2lnLnRva2VuLnR5cGUucmF3OlxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goVHdpZy5maWx0ZXJzLnJhdyh0b2tlbi52YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBUd2lnLnRva2VuLnR5cGUubG9naWM6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9naWNfdG9rZW4gPSB0b2tlbi50b2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dpYyA9IFR3aWcubG9naWMucGFyc2UuYXBwbHkodGhhdCwgW2xvZ2ljX3Rva2VuLCBjb250ZXh0LCBjaGFpbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9naWMuY2hhaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYWluID0gbG9naWMuY2hhaW47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9naWMuY29udGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dCA9IGxvZ2ljLmNvbnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9naWMub3V0cHV0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChsb2dpYy5vdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBUd2lnLnRva2VuLnR5cGUuY29tbWVudDpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvIG5vdGhpbmcsIGNvbW1lbnRzIHNob3VsZCBiZSBpZ25vcmVkXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIFR3aWcudG9rZW4udHlwZS5vdXRwdXQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBUd2lnLmxvZy5kZWJ1ZyhcIlR3aWcucGFyc2U6IFwiLCBcIk91dHB1dCB0b2tlbjogXCIsIHRva2VuLnN0YWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhcnNlIHRoZSBnaXZlbiBleHByZXNzaW9uIGluIHRoZSBnaXZlbiBjb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChUd2lnLmV4cHJlc3Npb24ucGFyc2UuYXBwbHkodGhhdCwgW3Rva2VuLnN0YWNrLCBjb250ZXh0XSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gVHdpZy5vdXRwdXQuYXBwbHkodGhpcywgW291dHB1dF0pO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgVHdpZy5sb2cuZXJyb3IoXCJFcnJvciBwYXJzaW5nIHR3aWcgdGVtcGxhdGUgXCIgKyB0aGlzLmlkICsgXCI6IFwiKTtcbiAgICAgICAgICAgIGlmIChleC5zdGFjaykge1xuICAgICAgICAgICAgICAgIFR3aWcubG9nLmVycm9yKGV4LnN0YWNrKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVHdpZy5sb2cuZXJyb3IoZXgudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmV0aHJvdykgdGhyb3cgZXg7XG5cbiAgICAgICAgICAgIGlmIChUd2lnLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVG9rZW5pemUgYW5kIGNvbXBpbGUgYSBzdHJpbmcgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YSBUaGUgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGNvbXBpbGVkIHRva2Vucy5cbiAgICAgKi9cbiAgICBUd2lnLnByZXBhcmUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHZhciB0b2tlbnMsIHJhd190b2tlbnM7XG5cbiAgICAgICAgLy8gVG9rZW5pemVcbiAgICAgICAgVHdpZy5sb2cuZGVidWcoXCJUd2lnLnByZXBhcmU6IFwiLCBcIlRva2VuaXppbmcgXCIsIGRhdGEpO1xuICAgICAgICByYXdfdG9rZW5zID0gVHdpZy50b2tlbml6ZS5hcHBseSh0aGlzLCBbZGF0YV0pO1xuXG4gICAgICAgIC8vIENvbXBpbGVcbiAgICAgICAgVHdpZy5sb2cuZGVidWcoXCJUd2lnLnByZXBhcmU6IFwiLCBcIkNvbXBpbGluZyBcIiwgcmF3X3Rva2Vucyk7XG4gICAgICAgIHRva2VucyA9IFR3aWcuY29tcGlsZS5hcHBseSh0aGlzLCBbcmF3X3Rva2Vuc10pO1xuXG4gICAgICAgIFR3aWcubG9nLmRlYnVnKFwiVHdpZy5wcmVwYXJlOiBcIiwgXCJDb21waWxlZCBcIiwgdG9rZW5zKTtcblxuICAgICAgICByZXR1cm4gdG9rZW5zO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBKb2luIHRoZSBvdXRwdXQgdG9rZW4ncyBzdGFjayBhbmQgZXNjYXBlIGl0IGlmIG5lZWRlZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gT3V0cHV0IHRva2VuJ3Mgc3RhY2tcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ3xTdHJpbmd9IEF1dG9lc2NhcGVkIG91dHB1dFxuICAgICAqL1xuICAgIFR3aWcub3V0cHV0ID0gZnVuY3Rpb24ob3V0cHV0KSB7XG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmF1dG9lc2NhcGUpIHtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQuam9pbihcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFtdLm1hcCB3b3VsZCBiZSBiZXR0ZXIgYnV0IGl0J3Mgbm90IHN1cHBvcnRlZCBieSBJRTgtXG4gICAgICAgIHZhciBlc2NhcGVkX291dHB1dCA9IFtdO1xuICAgICAgICBUd2lnLmZvckVhY2gob3V0cHV0LCBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgICBpZiAoc3RyICYmICFzdHIudHdpZ19tYXJrdXApIHtcbiAgICAgICAgICAgICAgICBzdHIgPSBUd2lnLmZpbHRlcnMuZXNjYXBlKHN0cik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlc2NhcGVkX291dHB1dC5wdXNoKHN0cik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gVHdpZy5NYXJrdXAoZXNjYXBlZF9vdXRwdXQuam9pbihcIlwiKSk7XG4gICAgfVxuXG4gICAgLy8gTmFtZXNwYWNlIGZvciB0ZW1wbGF0ZSBzdG9yYWdlIGFuZCByZXRyaWV2YWxcbiAgICBUd2lnLlRlbXBsYXRlcyA9IHtcbiAgICAgICAgcmVnaXN0cnk6IHt9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIElzIHRoaXMgaWQgdmFsaWQgZm9yIGEgdHdpZyB0ZW1wbGF0ZT9cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgdG8gY2hlY2suXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIHtUd2lnLkVycm9yfSBJZiB0aGUgSUQgaXMgaW52YWxpZCBvciB1c2VkLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIElEIGlzIHZhbGlkLlxuICAgICAqL1xuICAgIFR3aWcudmFsaWRhdGVJZCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIGlmIChpZCA9PT0gXCJwcm90b3R5cGVcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoaWQgKyBcIiBpcyBub3QgYSB2YWxpZCB0d2lnIGlkZW50aWZpZXJcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoVHdpZy5UZW1wbGF0ZXMucmVnaXN0cnkuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIlRoZXJlIGlzIGFscmVhZHkgYSB0ZW1wbGF0ZSB3aXRoIHRoZSBJRCBcIiArIGlkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTYXZlIGEgdGVtcGxhdGUgb2JqZWN0IHRvIHRoZSBzdG9yZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VHdpZy5UZW1wbGF0ZX0gdGVtcGxhdGUgICBUaGUgdHdpZy5qcyB0ZW1wbGF0ZSB0byBzdG9yZS5cbiAgICAgKi9cbiAgICBUd2lnLlRlbXBsYXRlcy5zYXZlID0gZnVuY3Rpb24odGVtcGxhdGUpIHtcbiAgICAgICAgaWYgKHRlbXBsYXRlLmlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiVW5hYmxlIHRvIHNhdmUgdGVtcGxhdGUgd2l0aCBubyBpZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBUd2lnLlRlbXBsYXRlcy5yZWdpc3RyeVt0ZW1wbGF0ZS5pZF0gPSB0ZW1wbGF0ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTG9hZCBhIHByZXZpb3VzbHkgc2F2ZWQgdGVtcGxhdGUgZnJvbSB0aGUgc3RvcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgICBUaGUgSUQgb2YgdGhlIHRlbXBsYXRlIHRvIGxvYWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtUd2lnLlRlbXBsYXRlfSBBIHR3aWcuanMgdGVtcGxhdGUgc3RvcmVkIHdpdGggdGhlIHByb3ZpZGVkIElELlxuICAgICAqL1xuICAgIFR3aWcuVGVtcGxhdGVzLmxvYWQgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICBpZiAoIVR3aWcuVGVtcGxhdGVzLnJlZ2lzdHJ5Lmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFR3aWcuVGVtcGxhdGVzLnJlZ2lzdHJ5W2lkXTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTG9hZCBhIHRlbXBsYXRlIGZyb20gYSByZW1vdGUgbG9jYXRpb24gdXNpbmcgQUpBWCBhbmQgc2F2ZXMgaW4gd2l0aCB0aGUgZ2l2ZW4gSUQuXG4gICAgICpcbiAgICAgKiBBdmFpbGFibGUgcGFyYW1ldGVyczpcbiAgICAgKlxuICAgICAqICAgICAgYXN5bmM6ICAgICAgIFNob3VsZCB0aGUgSFRUUCByZXF1ZXN0IGJlIHBlcmZvcm1lZCBhc3luY2hyb25vdXNseS5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICBEZWZhdWx0cyB0byB0cnVlLlxuICAgICAqICAgICAgbWV0aG9kOiAgICAgIFdoYXQgbWV0aG9kIHNob3VsZCBiZSB1c2VkIHRvIGxvYWQgdGhlIHRlbXBsYXRlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgKGZzIG9yIGFqYXgpXG4gICAgICogICAgICBwcmVjb21waWxlZDogSGFzIHRoZSB0ZW1wbGF0ZSBhbHJlYWR5IGJlZW4gY29tcGlsZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gIFRoZSByZW1vdGUgVVJMIHRvIGxvYWQgYXMgYSB0ZW1wbGF0ZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIFRoZSB0ZW1wbGF0ZSBwYXJhbWV0ZXJzLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrICBBIGNhbGxiYWNrIHRyaWdnZXJlZCB3aGVuIHRoZSB0ZW1wbGF0ZSBmaW5pc2hlcyBsb2FkaW5nLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGVycm9yX2NhbGxiYWNrICBBIGNhbGxiYWNrIHRyaWdnZXJlZCBpZiBhbiBlcnJvciBvY2N1cnMgbG9hZGluZyB0aGUgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKlxuICAgICAqL1xuICAgIFR3aWcuVGVtcGxhdGVzLmxvYWRSZW1vdGUgPSBmdW5jdGlvbihsb2NhdGlvbiwgcGFyYW1zLCBjYWxsYmFjaywgZXJyb3JfY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGlkICAgICAgICAgID0gcGFyYW1zLmlkLFxuICAgICAgICAgICAgbWV0aG9kICAgICAgPSBwYXJhbXMubWV0aG9kLFxuICAgICAgICAgICAgYXN5bmMgICAgICAgPSBwYXJhbXMuYXN5bmMsXG4gICAgICAgICAgICBwcmVjb21waWxlZCA9IHBhcmFtcy5wcmVjb21waWxlZCxcbiAgICAgICAgICAgIHRlbXBsYXRlICAgID0gbnVsbDtcblxuICAgICAgICAvLyBEZWZhdWx0IHRvIGFzeW5jXG4gICAgICAgIGlmIChhc3luYyA9PT0gdW5kZWZpbmVkKSBhc3luYyA9IHRydWU7XG5cbiAgICAgICAgLy8gRGVmYXVsdCB0byB0aGUgVVJMIHNvIHRoZSB0ZW1wbGF0ZSBpcyBjYWNoZWQuXG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZCA9IGxvY2F0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHBhcmFtcy5pZCA9IGlkO1xuXG4gICAgICAgIC8vIENoZWNrIGZvciBleGlzdGluZyB0ZW1wbGF0ZVxuICAgICAgICBpZiAoVHdpZy5jYWNoZSAmJiBUd2lnLlRlbXBsYXRlcy5yZWdpc3RyeS5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgICAgICAgIC8vIEEgdGVtcGxhdGUgaXMgYWxyZWFkeSBzYXZlZCB3aXRoIHRoZSBnaXZlbiBpZC5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKFR3aWcuVGVtcGxhdGVzLnJlZ2lzdHJ5W2lkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gVHdpZy5UZW1wbGF0ZXMucmVnaXN0cnlbaWRdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1ldGhvZCA9PSAnYWpheCcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiVW5zdXBwb3J0ZWQgcGxhdGZvcm06IFVuYWJsZSB0byBkbyByZW1vdGUgcmVxdWVzdHMgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmVjYXVzZSB0aGVyZSBpcyBubyBYTUxIVFRQUmVxdWVzdCBpbXBsZW1lbnRhdGlvblwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhtbGh0dHAuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVHdpZy5sb2cuZGVidWcoXCJHb3QgdGVtcGxhdGUgXCIsIHhtbGh0dHAucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZWNvbXBpbGVkID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoeG1saHR0cC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0geG1saHR0cC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy51cmwgPSBsb2NhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy5kYXRhID0gZGF0YTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBuZXcgVHdpZy5UZW1wbGF0ZShwYXJhbXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh0ZW1wbGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3JfY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl9jYWxsYmFjayh4bWxodHRwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4bWxodHRwLm9wZW4oXCJHRVRcIiwgbG9jYXRpb24sIGFzeW5jKTtcbiAgICAgICAgICAgIHhtbGh0dHAuc2VuZCgpO1xuXG4gICAgICAgIH0gZWxzZSB7IC8vIGlmIG1ldGhvZCA9ICdmcydcbiAgICAgICAgICAgIC8vIENyZWF0ZSBsb2NhbCBzY29wZVxuICAgICAgICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBmcyA9IHJlcXVpcmUoJ2ZzJyksXG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyksXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICBsb2FkVGVtcGxhdGVGbiA9IGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcl9jYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl9jYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmVjb21waWxlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucGF0aCA9IGxvY2F0aW9uO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0ZW1wbGF0ZSBpcyBpbiBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IG5ldyBUd2lnLlRlbXBsYXRlKHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRlbXBsYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmIChhc3luYyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmcy5zdGF0KGxvY2F0aW9uLCBmdW5jdGlvbiAoZXJyLCBzdGF0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVyciB8fCAhc3RhdHMuaXNGaWxlKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJVbmFibGUgdG8gZmluZCB0ZW1wbGF0ZSBmaWxlIFwiICsgbG9jYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5yZWFkRmlsZShsb2NhdGlvbiwgJ3V0ZjgnLCBsb2FkVGVtcGxhdGVGbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZnMuc3RhdFN5bmMobG9jYXRpb24pLmlzRmlsZSgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJVbmFibGUgdG8gZmluZCB0ZW1wbGF0ZSBmaWxlIFwiICsgbG9jYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMobG9jYXRpb24sICd1dGY4Jyk7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRUZW1wbGF0ZUZuKHVuZGVmaW5lZCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXN5bmMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBwbGFjZWhvbGRlciBmb3Igbm93LCBzaG91bGQgZXZlbnR1YWxseSByZXR1cm4gYSBkZWZlcnJlZCBvYmplY3QuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBEZXRlcm1pbmUgb2JqZWN0IHR5cGVcbiAgICBmdW5jdGlvbiBpcyh0eXBlLCBvYmopIHtcbiAgICAgICAgdmFyIGNsYXMgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKS5zbGljZSg4LCAtMSk7XG4gICAgICAgIHJldHVybiBvYmogIT09IHVuZGVmaW5lZCAmJiBvYmogIT09IG51bGwgJiYgY2xhcyA9PT0gdHlwZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgdHdpZy5qcyB0ZW1wbGF0ZS5cbiAgICAgKlxuICAgICAqIFBhcmFtZXRlcnM6IHtcbiAgICAgKiAgICAgIGRhdGE6ICAgVGhlIHRlbXBsYXRlLCBlaXRoZXIgcHJlLWNvbXBpbGVkIHRva2VucyBvciBhIHN0cmluZyB0ZW1wbGF0ZVxuICAgICAqICAgICAgaWQ6ICAgICBUaGUgbmFtZSBvZiB0aGlzIHRlbXBsYXRlXG4gICAgICogICAgICBibG9ja3M6IEFueSBwcmUtZXhpc3RpbmcgYmxvY2sgZnJvbSBhIGNoaWxkIHRlbXBsYXRlXG4gICAgICogfVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBUaGUgdGVtcGxhdGUgcGFyYW1ldGVycy5cbiAgICAgKi9cbiAgICBUd2lnLlRlbXBsYXRlID0gZnVuY3Rpb24gKCBwYXJhbXMgKSB7XG4gICAgICAgIHZhciBkYXRhID0gcGFyYW1zLmRhdGEsXG4gICAgICAgICAgICBpZCA9IHBhcmFtcy5pZCxcbiAgICAgICAgICAgIGJsb2NrcyA9IHBhcmFtcy5ibG9ja3MsXG4gICAgICAgICAgICBtYWNyb3MgPSBwYXJhbXMubWFjcm9zIHx8IHt9LFxuICAgICAgICAgICAgYmFzZSA9IHBhcmFtcy5iYXNlLFxuICAgICAgICAgICAgcGF0aCA9IHBhcmFtcy5wYXRoLFxuICAgICAgICAgICAgdXJsID0gcGFyYW1zLnVybCxcbiAgICAgICAgICAgIC8vIHBhcnNlciBvcHRpb25zXG4gICAgICAgICAgICBvcHRpb25zID0gcGFyYW1zLm9wdGlvbnM7XG5cbiAgICAgICAgLy8gIyBXaGF0IGlzIHN0b3JlZCBpbiBhIFR3aWcuVGVtcGxhdGVcbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlIFR3aWcgVGVtcGxhdGUgaG9sZCBzZXZlcmFsIGNodWNrcyBvZiBkYXRhLlxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAge1xuICAgICAgICAvLyAgICAgICAgICBpZDogICAgIFRoZSB0b2tlbiBJRCAoaWYgYW55KVxuICAgICAgICAvLyAgICAgICAgICB0b2tlbnM6IFRoZSBsaXN0IG9mIHRva2VucyB0aGF0IG1ha2VzIHVwIHRoaXMgdGVtcGxhdGUuXG4gICAgICAgIC8vICAgICAgICAgIGJsb2NrczogVGhlIGxpc3Qgb2YgYmxvY2sgdGhpcyB0ZW1wbGF0ZSBjb250YWlucy5cbiAgICAgICAgLy8gICAgICAgICAgYmFzZTogICBUaGUgYmFzZSB0ZW1wbGF0ZSAoaWYgYW55KVxuICAgICAgICAvLyAgICAgICAgICAgIG9wdGlvbnM6ICB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIENvbXBpbGVyL3BhcnNlciBvcHRpb25zXG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHN0cmljdF92YXJpYWJsZXM6IHRydWUvZmFsc2VcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIFNob3VsZCBtaXNzaW5nIHZhcmlhYmxlL2tleXMgZW1pdCBhbiBlcnJvciBtZXNzYWdlLiBJZiBmYWxzZSwgdGhleSBkZWZhdWx0IHRvIG51bGwuXG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvL1xuXG4gICAgICAgIHRoaXMuaWQgICAgID0gaWQ7XG4gICAgICAgIHRoaXMuYmFzZSAgID0gYmFzZTtcbiAgICAgICAgdGhpcy5wYXRoICAgPSBwYXRoO1xuICAgICAgICB0aGlzLnVybCAgICA9IHVybDtcbiAgICAgICAgdGhpcy5tYWNyb3MgPSBtYWNyb3M7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICAgICAgdGhpcy5yZXNldChibG9ja3MpO1xuXG4gICAgICAgIGlmIChpcygnU3RyaW5nJywgZGF0YSkpIHtcbiAgICAgICAgICAgIHRoaXMudG9rZW5zID0gVHdpZy5wcmVwYXJlLmFwcGx5KHRoaXMsIFtkYXRhXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRva2VucyA9IGRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgVHdpZy5UZW1wbGF0ZXMuc2F2ZSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBUd2lnLlRlbXBsYXRlLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKGJsb2Nrcykge1xuICAgICAgICBUd2lnLmxvZy5kZWJ1ZyhcIlR3aWcuVGVtcGxhdGUucmVzZXRcIiwgXCJSZXNldGluZyB0ZW1wbGF0ZSBcIiArIHRoaXMuaWQpO1xuICAgICAgICB0aGlzLmJsb2NrcyA9IHt9O1xuICAgICAgICB0aGlzLmltcG9ydGVkQmxvY2tzID0gW107XG4gICAgICAgIHRoaXMuY2hpbGQgPSB7XG4gICAgICAgICAgICBibG9ja3M6IGJsb2NrcyB8fCB7fVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmV4dGVuZCA9IG51bGw7XG4gICAgfTtcblxuICAgIFR3aWcuVGVtcGxhdGUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChjb250ZXh0LCBwYXJhbXMpIHtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuXG4gICAgICAgIHZhciBvdXRwdXQsXG4gICAgICAgICAgICB1cmw7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dCB8fCB7fTtcblxuICAgICAgICAvLyBDbGVhciBhbnkgcHJldmlvdXMgc3RhdGVcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICBpZiAocGFyYW1zLmJsb2Nrcykge1xuICAgICAgICAgICAgdGhpcy5ibG9ja3MgPSBwYXJhbXMuYmxvY2tzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbXMubWFjcm9zKSB7XG4gICAgICAgICAgICB0aGlzLm1hY3JvcyA9IHBhcmFtcy5tYWNyb3M7XG4gICAgICAgIH1cblxuICAgICAgICBvdXRwdXQgPSBUd2lnLnBhcnNlLmFwcGx5KHRoaXMsIFt0aGlzLnRva2VucywgdGhpcy5jb250ZXh0XSk7XG5cbiAgICAgICAgLy8gRG9lcyB0aGlzIHRlbXBsYXRlIGV4dGVuZCBhbm90aGVyXG4gICAgICAgIGlmICh0aGlzLmV4dGVuZCkge1xuICAgICAgICAgICAgdmFyIGV4dF90ZW1wbGF0ZTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIHRlbXBsYXRlIGlzIHByb3ZpZGVkIGlubGluZVxuICAgICAgICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuYWxsb3dJbmxpbmVJbmNsdWRlcyApIHtcbiAgICAgICAgICAgICAgICBleHRfdGVtcGxhdGUgPSBUd2lnLlRlbXBsYXRlcy5sb2FkKHRoaXMuZXh0ZW5kKTtcbiAgICAgICAgICAgICAgICBpZiAoIGV4dF90ZW1wbGF0ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0X3RlbXBsYXRlLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgdGhlIHRlbXBsYXRlIGZpbGUgdmlhIGluY2x1ZGVcbiAgICAgICAgICAgIGlmICghZXh0X3RlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgdXJsID0gcmVsYXRpdmVQYXRoKHRoaXMsIHRoaXMuZXh0ZW5kKTtcblxuICAgICAgICAgICAgICAgIGV4dF90ZW1wbGF0ZSA9IFR3aWcuVGVtcGxhdGVzLmxvYWRSZW1vdGUodXJsLCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogdGhpcy51cmw/J2FqYXgnOidmcycsXG4gICAgICAgICAgICAgICAgICAgIGJhc2U6IHRoaXMuYmFzZSxcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6ICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICAgICB1cmwsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMub3B0aW9uc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IGV4dF90ZW1wbGF0ZTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnJlbmRlcih0aGlzLmNvbnRleHQsIHtcbiAgICAgICAgICAgICAgICBibG9ja3M6IHRoaXMuYmxvY2tzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMub3V0cHV0ID09ICdibG9ja3MnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ibG9ja3M7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLm91dHB1dCA9PSAnbWFjcm9zJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFjcm9zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBUd2lnLlRlbXBsYXRlLnByb3RvdHlwZS5pbXBvcnRGaWxlID0gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICB2YXIgdXJsLCBzdWJfdGVtcGxhdGU7XG4gICAgICAgIGlmICggIXRoaXMudXJsICYmICF0aGlzLnBhdGggJiYgdGhpcy5vcHRpb25zLmFsbG93SW5saW5lSW5jbHVkZXMgKSB7XG4gICAgICAgICAgICBzdWJfdGVtcGxhdGUgPSBUd2lnLlRlbXBsYXRlcy5sb2FkKGZpbGUpO1xuICAgICAgICAgICAgc3ViX3RlbXBsYXRlLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgICAgICBpZiAoIHN1Yl90ZW1wbGF0ZSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3ViX3RlbXBsYXRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIkRpZG4ndCBmaW5kIHRoZSBpbmxpbmUgdGVtcGxhdGUgYnkgaWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICB1cmwgPSByZWxhdGl2ZVBhdGgodGhpcywgZmlsZSk7XG5cbiAgICAgICAgLy8gTG9hZCBibG9ja3MgZnJvbSBhbiBleHRlcm5hbCBmaWxlXG4gICAgICAgIHN1Yl90ZW1wbGF0ZSA9IFR3aWcuVGVtcGxhdGVzLmxvYWRSZW1vdGUodXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IHRoaXMudXJsPydhamF4JzonZnMnLFxuICAgICAgICAgICAgYmFzZTogdGhpcy5iYXNlLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgaWQ6IHVybFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc3ViX3RlbXBsYXRlO1xuICAgIH07XG5cbiAgICBUd2lnLlRlbXBsYXRlLnByb3RvdHlwZS5pbXBvcnRCbG9ja3MgPSBmdW5jdGlvbihmaWxlLCBvdmVycmlkZSkge1xuICAgICAgICB2YXIgc3ViX3RlbXBsYXRlID0gdGhpcy5pbXBvcnRGaWxlKGZpbGUpLFxuICAgICAgICAgICAgY29udGV4dCA9IHRoaXMuY29udGV4dCxcbiAgICAgICAgICAgIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAga2V5O1xuXG4gICAgICAgIG92ZXJyaWRlID0gb3ZlcnJpZGUgfHwgZmFsc2U7XG5cbiAgICAgICAgc3ViX3RlbXBsYXRlLnJlbmRlcihjb250ZXh0KTtcblxuICAgICAgICAvLyBNaXhpbiBibG9ja3NcbiAgICAgICAgVHdpZy5mb3JFYWNoKE9iamVjdC5rZXlzKHN1Yl90ZW1wbGF0ZS5ibG9ja3MpLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIGlmIChvdmVycmlkZSB8fCB0aGF0LmJsb2Nrc1trZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGF0LmJsb2Nrc1trZXldID0gc3ViX3RlbXBsYXRlLmJsb2Nrc1trZXldO1xuICAgICAgICAgICAgICAgIHRoYXQuaW1wb3J0ZWRCbG9ja3MucHVzaChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgVHdpZy5UZW1wbGF0ZS5wcm90b3R5cGUuY29tcGlsZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgLy8gY29tcGlsZSB0aGUgdGVtcGxhdGUgaW50byByYXcgSlNcbiAgICAgICAgcmV0dXJuIFR3aWcuY29tcGlsZXIuY29tcGlsZSh0aGlzLCBvcHRpb25zKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHNhZmUgb3V0cHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ29udGVudCBzYWZlIHRvIG91dHB1dFxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBDb250ZW50IHdyYXBwZWQgaW50byBhIFN0cmluZ1xuICAgICAqL1xuXG4gICAgVHdpZy5NYXJrdXAgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycgJiYgY29udGVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gbmV3IFN0cmluZyhjb250ZW50KTtcbiAgICAgICAgICAgIGNvbnRlbnQudHdpZ19tYXJrdXAgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIHRoZSByZWxhdGl2ZSBjYW5vbmljYWwgdmVyc2lvbiBvZiBhIHVybCBiYXNlZCBvbiB0aGUgZ2l2ZW4gYmFzZSBwYXRoIGFuZCBmaWxlIHBhdGguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGUgVGhlIFR3aWcuVGVtcGxhdGUuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGUgVGhlIGZpbGUgcGF0aCwgcmVsYXRpdmUgdG8gdGhlIGJhc2UgcGF0aC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGNhbm9uaWNhbCB2ZXJzaW9uIG9mIHRoZSBwYXRoLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlbGF0aXZlUGF0aCh0ZW1wbGF0ZSwgZmlsZSkge1xuICAgICAgICB2YXIgYmFzZSxcbiAgICAgICAgICAgIGJhc2VfcGF0aCxcbiAgICAgICAgICAgIHNlcF9jaHIgPSBcIi9cIixcbiAgICAgICAgICAgIG5ld19wYXRoID0gW10sXG4gICAgICAgICAgICB2YWw7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlLnVybCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5iYXNlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGJhc2UgPSB0ZW1wbGF0ZS5iYXNlICsgKCh0ZW1wbGF0ZS5iYXNlLmNoYXJBdCh0ZW1wbGF0ZS5iYXNlLmxlbmd0aC0xKSA9PT0gJy8nKSA/ICcnIDogJy8nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRlbXBsYXRlLnVybDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0ZW1wbGF0ZS5wYXRoKSB7XG4gICAgICAgICAgICAvLyBHZXQgdGhlIHN5c3RlbS1zcGVjaWZpYyBwYXRoIHNlcGFyYXRvclxuICAgICAgICAgICAgdmFyIHBhdGggPSByZXF1aXJlKFwicGF0aFwiKSxcbiAgICAgICAgICAgICAgICBzZXAgPSBwYXRoLnNlcCB8fCBzZXBfY2hyLFxuICAgICAgICAgICAgICAgIHJlbGF0aXZlID0gbmV3IFJlZ0V4cChcIl5cXFxcLnsxLDJ9XCIgKyBzZXAucmVwbGFjZShcIlxcXFxcIiwgXCJcXFxcXFxcXFwiKSk7XG4gICAgICAgICAgICBmaWxlID0gZmlsZS5yZXBsYWNlKC9cXC8vZywgc2VwKTtcblxuICAgICAgICAgICAgaWYgKHRlbXBsYXRlLmJhc2UgIT09IHVuZGVmaW5lZCAmJiBmaWxlLm1hdGNoKHJlbGF0aXZlKSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmlsZSA9IGZpbGUucmVwbGFjZSh0ZW1wbGF0ZS5iYXNlLCAnJyk7XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRlbXBsYXRlLmJhc2UgKyBzZXA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJhc2UgPSB0ZW1wbGF0ZS5wYXRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiYXNlID0gYmFzZS5yZXBsYWNlKHNlcCtzZXAsIHNlcCk7XG4gICAgICAgICAgICBzZXBfY2hyID0gc2VwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJDYW5ub3QgZXh0ZW5kIGFuIGlubGluZSB0ZW1wbGF0ZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBiYXNlX3BhdGggPSBiYXNlLnNwbGl0KHNlcF9jaHIpO1xuXG4gICAgICAgIC8vIFJlbW92ZSBmaWxlIGZyb20gdXJsXG4gICAgICAgIGJhc2VfcGF0aC5wb3AoKTtcbiAgICAgICAgYmFzZV9wYXRoID0gYmFzZV9wYXRoLmNvbmNhdChmaWxlLnNwbGl0KHNlcF9jaHIpKTtcblxuICAgICAgICB3aGlsZSAoYmFzZV9wYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhbCA9IGJhc2VfcGF0aC5zaGlmdCgpO1xuICAgICAgICAgICAgaWYgKHZhbCA9PSBcIi5cIikge1xuICAgICAgICAgICAgICAgIC8vIElnbm9yZVxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWwgPT0gXCIuLlwiICYmIG5ld19wYXRoLmxlbmd0aCA+IDAgJiYgbmV3X3BhdGhbbmV3X3BhdGgubGVuZ3RoLTFdICE9IFwiLi5cIikge1xuICAgICAgICAgICAgICAgIG5ld19wYXRoLnBvcCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdfcGF0aC5wdXNoKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3X3BhdGguam9pbihzZXBfY2hyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gVHdpZztcblxufSkgKFR3aWcgfHwgeyB9KTtcblxuLy8gVGhlIGZvbGxvd2luZyBtZXRob2RzIGFyZSBmcm9tIE1ETiBhbmQgYXJlIGF2YWlsYWJsZSB1bmRlciBhXG4vLyBbTUlUIExpY2Vuc2VdKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKSBvciBhcmVcbi8vIFtQdWJsaWMgRG9tYWluXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9Qcm9qZWN0OkNvcHlyaWdodHMpLlxuLy9cbi8vIFNlZTpcbi8vICogW09iamVjdC5rZXlzIC0gTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3Qva2V5cylcblxuLy8gIyMgdHdpZy5maWxscy5qc1xuLy9cbi8vIFRoaXMgZmlsZSBjb250YWlucyBmaWxscyBmb3IgYmFja3dhcmRzIGNvbXBhdGFiaWxpdHkuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLy8gSGFuZGxlIG1ldGhvZHMgdGhhdCBkb24ndCB5ZXQgZXhpc3QgaW4gZXZlcnkgYnJvd3NlclxuXG4gICAgaWYgKCFTdHJpbmcucHJvdG90eXBlLnRyaW0pIHtcbiAgICAgICAgU3RyaW5nLnByb3RvdHlwZS50cmltID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCcnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZighT2JqZWN0LmtleXMpIE9iamVjdC5rZXlzID0gZnVuY3Rpb24obyl7XG4gICAgICAgIGlmIChvICE9PSBPYmplY3QobykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5rZXlzIGNhbGxlZCBvbiBub24tb2JqZWN0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9IFtdLCBwO1xuICAgICAgICBmb3IgKHAgaW4gbykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgcmV0LnB1c2gocCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG59KSgpO1xuLy8gIyMgdHdpZy5saWIuanNcbi8vXG4vLyBUaGlzIGZpbGUgY29udGFpbnMgM3JkIHBhcnR5IGxpYnJhcmllcyB1c2VkIHdpdGhpbiB0d2lnLlxuLy9cbi8vIENvcGllcyBvZiB0aGUgbGljZW5zZXMgZm9yIHRoZSBjb2RlIGluY2x1ZGVkIGhlcmUgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRVMubWQgZmlsZS5cbi8vXG5cbnZhciBUd2lnID0gKGZ1bmN0aW9uKFR3aWcpIHtcblxuICAgIC8vIE5hbWVzcGFjZSBmb3IgbGlicmFyaWVzXG4gICAgVHdpZy5saWIgPSB7IH07XG5cbiAgICAvKipcbiAgICBzcHJpbnRmKCkgZm9yIEphdmFTY3JpcHQgMC43LWJldGExXG4gICAgaHR0cDovL3d3dy5kaXZlaW50b2phdmFzY3JpcHQuY29tL3Byb2plY3RzL2phdmFzY3JpcHQtc3ByaW50ZlxuICAgICoqL1xuICAgIHZhciBzcHJpbnRmID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0X3R5cGUodmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YXJpYWJsZSkuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBzdHJfcmVwZWF0KGlucHV0LCBtdWx0aXBsaWVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG91dHB1dCA9IFtdOyBtdWx0aXBsaWVyID4gMDsgb3V0cHV0Wy0tbXVsdGlwbGllcl0gPSBpbnB1dCkgey8qIGRvIG5vdGhpbmcgKi99XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdHJfZm9ybWF0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RyX2Zvcm1hdC5jYWNoZS5oYXNPd25Qcm9wZXJ0eShhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyX2Zvcm1hdC5jYWNoZVthcmd1bWVudHNbMF1dID0gc3RyX2Zvcm1hdC5wYXJzZShhcmd1bWVudHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJfZm9ybWF0LmZvcm1hdC5jYWxsKG51bGwsIHN0cl9mb3JtYXQuY2FjaGVbYXJndW1lbnRzWzBdXSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHN0cl9mb3JtYXQuZm9ybWF0ID0gZnVuY3Rpb24ocGFyc2VfdHJlZSwgYXJndikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3Vyc29yID0gMSwgdHJlZV9sZW5ndGggPSBwYXJzZV90cmVlLmxlbmd0aCwgbm9kZV90eXBlID0gJycsIGFyZywgb3V0cHV0ID0gW10sIGksIGssIG1hdGNoLCBwYWQsIHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0cmVlX2xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZV90eXBlID0gZ2V0X3R5cGUocGFyc2VfdHJlZVtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGVfdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHBhcnNlX3RyZWVbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlX3R5cGUgPT09ICdhcnJheScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gcGFyc2VfdHJlZVtpXTsgLy8gY29udmVuaWVuY2UgcHVycG9zZXMgb25seVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoWzJdKSB7IC8vIGtleXdvcmQgYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3JdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbWF0Y2hbMl0ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFyZy5oYXNPd25Qcm9wZXJ0eShtYXRjaFsyXVtrXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93KHNwcmludGYoJ1tzcHJpbnRmXSBwcm9wZXJ0eSBcIiVzXCIgZG9lcyBub3QgZXhpc3QnLCBtYXRjaFsyXVtrXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmdbbWF0Y2hbMl1ba11dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChtYXRjaFsxXSkgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChleHBsaWNpdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndlttYXRjaFsxXV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoaW1wbGljaXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yKytdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoL1tec10vLnRlc3QobWF0Y2hbOF0pICYmIChnZXRfdHlwZShhcmcpICE9ICdudW1iZXInKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyhzcHJpbnRmKCdbc3ByaW50Zl0gZXhwZWN0aW5nIG51bWJlciBidXQgZm91bmQgJXMnLCBnZXRfdHlwZShhcmcpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKG1hdGNoWzhdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2InOiBhcmcgPSBhcmcudG9TdHJpbmcoMik7IGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjJzogYXJnID0gU3RyaW5nLmZyb21DaGFyQ29kZShhcmcpOyBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZCc6IGFyZyA9IHBhcnNlSW50KGFyZywgMTApOyBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZSc6IGFyZyA9IG1hdGNoWzddID8gYXJnLnRvRXhwb25lbnRpYWwobWF0Y2hbN10pIDogYXJnLnRvRXhwb25lbnRpYWwoKTsgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2YnOiBhcmcgPSBtYXRjaFs3XSA/IHBhcnNlRmxvYXQoYXJnKS50b0ZpeGVkKG1hdGNoWzddKSA6IHBhcnNlRmxvYXQoYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ28nOiBhcmcgPSBhcmcudG9TdHJpbmcoOCk7IGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzogYXJnID0gKChhcmcgPSBTdHJpbmcoYXJnKSkgJiYgbWF0Y2hbN10gPyBhcmcuc3Vic3RyaW5nKDAsIG1hdGNoWzddKSA6IGFyZyk7IGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd1JzogYXJnID0gTWF0aC5hYnMoYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3gnOiBhcmcgPSBhcmcudG9TdHJpbmcoMTYpOyBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnWCc6IGFyZyA9IGFyZy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTsgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzaWduID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoL1tkZWZdLy50ZXN0KG1hdGNoWzhdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaFszXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWduID0gYXJnID49IDAgPyAnKycgOiAnLSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9IGFyZyA+PSAwID8gJycgOiAnLSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IE1hdGguYWJzKGFyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZF9jaGFyYWN0ZXIgPSBtYXRjaFs0XSA/IG1hdGNoWzRdID09ICcwJyA/ICcwJyA6IG1hdGNoWzRdLmNoYXJBdCgxKSA6ICcgJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZF9sZW5ndGggPSBtYXRjaFs2XSAtIFN0cmluZyhhcmcpLmxlbmd0aCAtIHNpZ24ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkID0gbWF0Y2hbNl0gPyBzdHJfcmVwZWF0KHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGgpIDogJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaFs1XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyYWlsaW5nIHBhZGRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzaWduKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChhcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHBhZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCcwJyA9PSBwYWRfY2hhcmFjdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGVhZGluZyB6ZXJvIHBhZGRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzaWduKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChwYWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGFyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxlYWRpbmcgcGFkZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHBhZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goc2lnbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goYXJnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dC5qb2luKCcnKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHN0cl9mb3JtYXQuY2FjaGUgPSB7fTtcblxuICAgICAgICAgICAgc3RyX2Zvcm1hdC5wYXJzZSA9IGZ1bmN0aW9uKGZtdCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2ZtdCA9IGZtdCwgbWF0Y2ggPSBbXSwgcGFyc2VfdHJlZSA9IFtdLCBhcmdfbmFtZXMgPSAwO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoX2ZtdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgobWF0Y2ggPSAvXlteXFx4MjVdKy8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlX3RyZWUucHVzaChtYXRjaFswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKChtYXRjaCA9IC9eXFx4MjV7Mn0vLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2goJyUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gL15cXHgyNSg/OihbMS05XVxcZCopXFwkfFxcKChbXlxcKV0rKVxcKSk/KFxcKyk/KDB8J1teJF0pPygtKT8oXFxkKyk/KD86XFwuKFxcZCspKT8oW2ItZm9zdXhYXSkvLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnX25hbWVzIHw9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZF9saXN0ID0gW10sIHJlcGxhY2VtZW50X2ZpZWxkID0gbWF0Y2hbMl0sIGZpZWxkX21hdGNoID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSAvXihbYS16X11bYS16X1xcZF0qKS9pLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChyZXBsYWNlbWVudF9maWVsZCA9IHJlcGxhY2VtZW50X2ZpZWxkLnN1YnN0cmluZyhmaWVsZF9tYXRjaFswXS5sZW5ndGgpKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSAvXlxcLihbYS16X11bYS16X1xcZF0qKS9pLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGZpZWxkX21hdGNoID0gL15cXFsoXFxkKylcXF0vLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gaHVoPycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdygnW3NwcmludGZdIGh1aD8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFsyXSA9IGZpZWxkX2xpc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnX25hbWVzIHw9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnX25hbWVzID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gbWl4aW5nIHBvc2l0aW9uYWwgYW5kIG5hbWVkIHBsYWNlaG9sZGVycyBpcyBub3QgKHlldCkgc3VwcG9ydGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2gobWF0Y2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gaHVoPycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZm10ID0gX2ZtdC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VfdHJlZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBzdHJfZm9ybWF0O1xuICAgIH0pKCk7XG5cbiAgICB2YXIgdnNwcmludGYgPSBmdW5jdGlvbihmbXQsIGFyZ3YpIHtcbiAgICAgICAgYXJndi51bnNoaWZ0KGZtdCk7XG4gICAgICAgIHJldHVybiBzcHJpbnRmLmFwcGx5KG51bGwsIGFyZ3YpO1xuICAgIH07XG5cbiAgICAvLyBFeHBvc2UgdG8gVHdpZ1xuICAgIFR3aWcubGliLnNwcmludGYgPSBzcHJpbnRmO1xuICAgIFR3aWcubGliLnZzcHJpbnRmID0gdnNwcmludGY7XG5cblxuICAgIC8qKlxuICAgICAqIGpQYXEgLSBBIGZ1bGx5IGN1c3RvbWl6YWJsZSBKYXZhU2NyaXB0L0pTY3JpcHQgbGlicmFyeVxuICAgICAqIGh0dHA6Ly9qcGFxLm9yZy9cbiAgICAgKlxuICAgICAqIENvcHlyaWdodCAoYykgMjAxMSBDaHJpc3RvcGhlciBXZXN0XG4gICAgICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICAgICAqIGh0dHA6Ly9qcGFxLm9yZy9saWNlbnNlL1xuICAgICAqXG4gICAgICogVmVyc2lvbjogMS4wLjYuMDAwMFdcbiAgICAgKiBSZXZpc2VkOiBBcHJpbCA2LCAyMDExXG4gICAgICovXG4gICAgOyAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzaG9ydERheXMgPSBcIlN1bixNb24sVHVlLFdlZCxUaHUsRnJpLFNhdFwiLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgdmFyIGZ1bGxEYXlzID0gXCJTdW5kYXksTW9uZGF5LFR1ZXNkYXksV2VkbmVzZGF5LFRodXJzZGF5LEZyaWRheSxTYXR1cmRheVwiLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgdmFyIHNob3J0TW9udGhzID0gXCJKYW4sRmViLE1hcixBcHIsTWF5LEp1bixKdWwsQXVnLFNlcCxPY3QsTm92LERlY1wiLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgdmFyIGZ1bGxNb250aHMgPSBcIkphbnVhcnksRmVicnVhcnksTWFyY2gsQXByaWwsTWF5LEp1bmUsSnVseSxBdWd1c3QsU2VwdGVtYmVyLE9jdG9iZXIsTm92ZW1iZXIsRGVjZW1iZXJcIi5zcGxpdChcIixcIik7XG4gICAgICAgIGZ1bmN0aW9uIGdldE9yZGluYWxGb3IoaW50TnVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgoKGludE51bSA9IE1hdGguYWJzKGludE51bSkgJSAxMDApICUgMTAgPT0gMSAmJiBpbnROdW0gIT0gMTEpID8gXCJzdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICA6IChpbnROdW0gJSAxMCA9PSAyICYmIGludE51bSAhPSAxMikgPyBcIm5kXCIgOiAoaW50TnVtICUgMTAgPT0gM1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgaW50TnVtICE9IDEzKSA/IFwicmRcIiA6IFwidGhcIik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0SVNPODYwMVllYXIoYURhdGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKGFEYXRlLmdldEZ1bGxZZWFyKCkgKyAxLCAwLCA0KTtcbiAgICAgICAgICAgICAgICBpZigoZCAtIGFEYXRlKSAvIDg2NDAwMDAwIDwgNyAmJiAoYURhdGUuZ2V0RGF5KCkgKyA2KSAlIDcgPCAoZC5nZXREYXkoKSArIDYpICUgNylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICAgICAgaWYoYURhdGUuZ2V0TW9udGgoKSA+IDAgfHwgYURhdGUuZ2V0RGF0ZSgpID49IDQpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYURhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYURhdGUuZ2V0RnVsbFllYXIoKSAtICgoKGFEYXRlLmdldERheSgpICsgNikgJSA3IC0gYURhdGUuZ2V0RGF0ZSgpID4gMikgPyAxIDogMCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0SVNPODYwMVdlZWsoYURhdGUpIHtcbiAgICAgICAgICAgICAgICAvLyBHZXQgYSBkYXkgZHVyaW5nIHRoZSBmaXJzdCB3ZWVrIG9mIHRoZSB5ZWFyLlxuICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoZ2V0SVNPODYwMVllYXIoYURhdGUpLCAwLCA0KTtcbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGZpcnN0IG1vbmRheSBvZiB0aGUgeWVhci5cbiAgICAgICAgICAgICAgICBkLnNldERhdGUoZC5nZXREYXRlKCkgLSAoZC5nZXREYXkoKSArIDYpICUgNyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KChhRGF0ZSAtIGQpIC8gNjA0ODAwMDAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgICAgVHdpZy5saWIuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUsIGZvcm1hdCkge1xuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlxuICAgICAgICAgICAgLy8vICAgR2V0cyBhIHN0cmluZyBmb3IgdGhpcyBkYXRlLCBmb3JtYXR0ZWQgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBmb3JtYXRcbiAgICAgICAgICAgIC8vLyAgIHN0cmluZy5cbiAgICAgICAgICAgIC8vLyA8L3N1bW1hcnk+XG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJmb3JtYXRcIiB0eXBlPVwiU3RyaW5nXCI+XG4gICAgICAgICAgICAvLy8gICBUaGUgZm9ybWF0IG9mIHRoZSBvdXRwdXQgZGF0ZSBzdHJpbmcuICBUaGUgZm9ybWF0IHN0cmluZyB3b3JrcyBpbiBhXG4gICAgICAgICAgICAvLy8gICBuZWFybHkgaWRlbnRpY2FsIHdheSB0byB0aGUgUEhQIGRhdGUgZnVuY3Rpb24gd2hpY2ggaXMgaGlnaGxpZ2h0ZWQgaGVyZTpcbiAgICAgICAgICAgIC8vLyAgIGh0dHA6Ly9waHAubmV0L21hbnVhbC9lbi9mdW5jdGlvbi5kYXRlLnBocC5cbiAgICAgICAgICAgIC8vLyAgIFRoZSBvbmx5IGRpZmZlcmVuY2UgaXMgdGhlIGZhY3QgdGhhdCBcInVcIiBzaWduaWZpZXMgbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAvLy8gICBpbnN0ZWFkIG9mIG1pY3Jvc2Vjb25kcy4gIFRoZSBmb2xsb3dpbmcgY2hhcmFjdGVycyBhcmUgcmVjb2duaXplZCBpblxuICAgICAgICAgICAgLy8vICAgdGhlIGZvcm1hdCBwYXJhbWV0ZXIgc3RyaW5nOlxuICAgICAgICAgICAgLy8vICAgICBkIC0gRGF5IG9mIHRoZSBtb250aCwgMiBkaWdpdHMgd2l0aCBsZWFkaW5nIHplcm9zXG4gICAgICAgICAgICAvLy8gICAgIEQgLSBBIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSBkYXksIHRocmVlIGxldHRlcnNcbiAgICAgICAgICAgIC8vLyAgICAgaiAtIERheSBvZiB0aGUgbW9udGggd2l0aG91dCBsZWFkaW5nIHplcm9zXG4gICAgICAgICAgICAvLy8gICAgIGwgKGxvd2VyY2FzZSAnTCcpIC0gQSBmdWxsIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGRheSBvZiB0aGUgd2Vla1xuICAgICAgICAgICAgLy8vICAgICBOIC0gSVNPLTg2MDEgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiB0aGUgZGF5IG9mIHRoZSB3ZWVrIChzdGFydGluZyBmcm9tIDEpXG4gICAgICAgICAgICAvLy8gICAgIFMgLSBFbmdsaXNoIG9yZGluYWwgc3VmZml4IGZvciB0aGUgZGF5IG9mIHRoZSBtb250aCwgMiBjaGFyYWN0ZXJzIHN0LFxuICAgICAgICAgICAgLy8vICAgICAgICAgbmQsIHJkIG9yIHRoLiBXb3JrcyB3ZWxsIHdpdGggai5cbiAgICAgICAgICAgIC8vLyAgICAgdyAtIE51bWVyaWMgcmVwcmVzZW50YXRpb24gb2YgdGhlIGRheSBvZiB0aGUgd2VlayAoc3RhcnRpbmcgZnJvbSAwKVxuICAgICAgICAgICAgLy8vICAgICB6IC0gVGhlIGRheSBvZiB0aGUgeWVhciAoc3RhcnRpbmcgZnJvbSAwKVxuICAgICAgICAgICAgLy8vICAgICBXIC0gSVNPLTg2MDEgd2VlayBudW1iZXIgb2YgeWVhciwgd2Vla3Mgc3RhcnRpbmcgb24gTW9uZGF5XG4gICAgICAgICAgICAvLy8gICAgIEYgLSBBIGZ1bGwgdGV4dHVhbCByZXByZXNlbnRhdGlvbiBvZiBhIG1vbnRoLCBzdWNoIGFzIEphbnVhcnkgb3IgTWFyY2hcbiAgICAgICAgICAgIC8vLyAgICAgbSAtIE51bWVyaWMgcmVwcmVzZW50YXRpb24gb2YgYSBtb250aCwgd2l0aCBsZWFkaW5nIHplcm9zXG4gICAgICAgICAgICAvLy8gICAgIE0gLSBBIHNob3J0IHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSBtb250aCwgdGhyZWUgbGV0dGVyc1xuICAgICAgICAgICAgLy8vICAgICBuIC0gTnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiBhIG1vbnRoLCB3aXRob3V0IGxlYWRpbmcgemVyb3NcbiAgICAgICAgICAgIC8vLyAgICAgdCAtIE51bWJlciBvZiBkYXlzIGluIHRoZSBnaXZlbiBtb250aFxuICAgICAgICAgICAgLy8vICAgICBMIC0gV2hldGhlciBpdCdzIGEgbGVhcCB5ZWFyXG4gICAgICAgICAgICAvLy8gICAgIG8gLSBJU08tODYwMSB5ZWFyIG51bWJlci4gVGhpcyBoYXMgdGhlIHNhbWUgdmFsdWUgYXMgWSwgZXhjZXB0IHRoYXQgaWZcbiAgICAgICAgICAgIC8vLyAgICAgICAgIHRoZSBJU08gd2VlayBudW1iZXIgKFcpIGJlbG9uZ3MgdG8gdGhlIHByZXZpb3VzIG9yIG5leHQgeWVhciwgdGhhdFxuICAgICAgICAgICAgLy8vICAgICAgICAgeWVhciBpcyB1c2VkIGluc3RlYWQuXG4gICAgICAgICAgICAvLy8gICAgIFkgLSBBIGZ1bGwgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiBhIHllYXIsIDQgZGlnaXRzXG4gICAgICAgICAgICAvLy8gICAgIHkgLSBBIHR3byBkaWdpdCByZXByZXNlbnRhdGlvbiBvZiBhIHllYXJcbiAgICAgICAgICAgIC8vLyAgICAgYSAtIExvd2VyY2FzZSBBbnRlIG1lcmlkaWVtIGFuZCBQb3N0IG1lcmlkaWVtXG4gICAgICAgICAgICAvLy8gICAgIEEgLSBVcHBlcmNhc2UgQW50ZSBtZXJpZGllbSBhbmQgUG9zdCBtZXJpZGllbVxuICAgICAgICAgICAgLy8vICAgICBCIC0gU3dhdGNoIEludGVybmV0IHRpbWVcbiAgICAgICAgICAgIC8vLyAgICAgZyAtIDEyLWhvdXIgZm9ybWF0IG9mIGFuIGhvdXIgd2l0aG91dCBsZWFkaW5nIHplcm9zXG4gICAgICAgICAgICAvLy8gICAgIEcgLSAyNC1ob3VyIGZvcm1hdCBvZiBhbiBob3VyIHdpdGhvdXQgbGVhZGluZyB6ZXJvc1xuICAgICAgICAgICAgLy8vICAgICBoIC0gMTItaG91ciBmb3JtYXQgb2YgYW4gaG91ciB3aXRoIGxlYWRpbmcgemVyb3NcbiAgICAgICAgICAgIC8vLyAgICAgSCAtIDI0LWhvdXIgZm9ybWF0IG9mIGFuIGhvdXIgd2l0aCBsZWFkaW5nIHplcm9zXG4gICAgICAgICAgICAvLy8gICAgIGkgLSBNaW51dGVzIHdpdGggbGVhZGluZyB6ZXJvc1xuICAgICAgICAgICAgLy8vICAgICBzIC0gU2Vjb25kcywgd2l0aCBsZWFkaW5nIHplcm9zXG4gICAgICAgICAgICAvLy8gICAgIHUgLSBNaWxsaXNlY29uZHNcbiAgICAgICAgICAgIC8vLyAgICAgVSAtIFNlY29uZHMgc2luY2UgdGhlIFVuaXggRXBvY2ggKEphbnVhcnkgMSAxOTcwIDAwOjAwOjAwIEdNVClcbiAgICAgICAgICAgIC8vLyA8L3BhcmFtPlxuICAgICAgICAgICAgLy8vIDxyZXR1cm5zIHR5cGU9XCJTdHJpbmdcIj5cbiAgICAgICAgICAgIC8vLyAgIFJldHVybnMgdGhlIHN0cmluZyBmb3IgdGhpcyBkYXRlLCBmb3JtYXR0ZWQgYWNjb3JkaW5nIHRvIHRoZSBnaXZlblxuICAgICAgICAgICAgLy8vICAgZm9ybWF0IHN0cmluZy5cbiAgICAgICAgICAgIC8vLyA8L3JldHVybnM+XG4gICAgICAgICAgICAvLyBJZiB0aGUgZm9ybWF0IHdhcyBub3QgcGFzc2VkLCB1c2UgdGhlIGRlZmF1bHQgdG9TdHJpbmcgbWV0aG9kLlxuICAgICAgICAgICAgaWYodHlwZW9mIGZvcm1hdCAhPT0gXCJzdHJpbmdcIiB8fCAvXlxccyokLy50ZXN0KGZvcm1hdCkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlICsgXCJcIjtcbiAgICAgICAgICAgIHZhciBqYW4xc3QgPSBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIDAsIDEpO1xuICAgICAgICAgICAgdmFyIG1lID0gZGF0ZTtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXQucmVwbGFjZSgvW2REamxOU3d6V0ZtTW50TG9ZeWFBQmdHaEhpc3VVXS9nLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2gob3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERheSBvZiB0aGUgbW9udGgsIDIgZGlnaXRzIHdpdGggbGVhZGluZyB6ZXJvc1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZFwiOiByZXR1cm4gKFwiMFwiICsgbWUuZ2V0RGF0ZSgpKS5yZXBsYWNlKC9eLisoLi4pJC8sIFwiJDFcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIEEgdGV4dHVhbCByZXByZXNlbnRhdGlvbiBvZiBhIGRheSwgdGhyZWUgbGV0dGVyc1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiRFwiOiByZXR1cm4gc2hvcnREYXlzW21lLmdldERheSgpXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gRGF5IG9mIHRoZSBtb250aCB3aXRob3V0IGxlYWRpbmcgemVyb3NcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImpcIjogcmV0dXJuIG1lLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQSBmdWxsIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGRheSBvZiB0aGUgd2Vla1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibFwiOiByZXR1cm4gZnVsbERheXNbbWUuZ2V0RGF5KCldO1xuICAgICAgICAgICAgICAgICAgICAvLyBJU08tODYwMSBudW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkYXkgb2YgdGhlIHdlZWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIk5cIjogcmV0dXJuIChtZS5nZXREYXkoKSArIDYpICUgNyArIDE7XG4gICAgICAgICAgICAgICAgICAgIC8vIEVuZ2xpc2ggb3JkaW5hbCBzdWZmaXggZm9yIHRoZSBkYXkgb2YgdGhlIG1vbnRoLCAyIGNoYXJhY3RlcnNcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlNcIjogcmV0dXJuIGdldE9yZGluYWxGb3IobWUuZ2V0RGF0ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiB0aGUgZGF5IG9mIHRoZSB3ZWVrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ3XCI6IHJldHVybiBtZS5nZXREYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGRheSBvZiB0aGUgeWVhciAoc3RhcnRpbmcgZnJvbSAwKVxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwielwiOiByZXR1cm4gTWF0aC5jZWlsKChqYW4xc3QgLSBtZSkgLyA4NjQwMDAwMCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIElTTy04NjAxIHdlZWsgbnVtYmVyIG9mIHllYXIsIHdlZWtzIHN0YXJ0aW5nIG9uIE1vbmRheVxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiV1wiOiByZXR1cm4gKFwiMFwiICsgZ2V0SVNPODYwMVdlZWsobWUpKS5yZXBsYWNlKC9eLiguLikkLywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQSBmdWxsIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSBtb250aCwgc3VjaCBhcyBKYW51YXJ5IG9yIE1hcmNoXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJGXCI6IHJldHVybiBmdWxsTW9udGhzW21lLmdldE1vbnRoKCldO1xuICAgICAgICAgICAgICAgICAgICAvLyBOdW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIGEgbW9udGgsIHdpdGggbGVhZGluZyB6ZXJvc1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibVwiOiByZXR1cm4gKFwiMFwiICsgKG1lLmdldE1vbnRoKCkgKyAxKSkucmVwbGFjZSgvXi4rKC4uKSQvLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBBIHNob3J0IHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSBtb250aCwgdGhyZWUgbGV0dGVyc1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiTVwiOiByZXR1cm4gc2hvcnRNb250aHNbbWUuZ2V0TW9udGgoKV07XG4gICAgICAgICAgICAgICAgICAgIC8vIE51bWVyaWMgcmVwcmVzZW50YXRpb24gb2YgYSBtb250aCwgd2l0aG91dCBsZWFkaW5nIHplcm9zXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuXCI6IHJldHVybiBtZS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTnVtYmVyIG9mIGRheXMgaW4gdGhlIGdpdmVuIG1vbnRoXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0XCI6IHJldHVybiBuZXcgRGF0ZShtZS5nZXRGdWxsWWVhcigpLCBtZS5nZXRNb250aCgpICsgMSwgLTEpLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hldGhlciBpdCdzIGEgbGVhcCB5ZWFyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJMXCI6IHJldHVybiBuZXcgRGF0ZShtZS5nZXRGdWxsWWVhcigpLCAxLCAyOSkuZ2V0RGF0ZSgpID09IDI5ID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgICAgIC8vIElTTy04NjAxIHllYXIgbnVtYmVyLiBUaGlzIGhhcyB0aGUgc2FtZSB2YWx1ZSBhcyBZLCBleGNlcHQgdGhhdCBpZiB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gSVNPIHdlZWsgbnVtYmVyIChXKSBiZWxvbmdzIHRvIHRoZSBwcmV2aW91cyBvciBuZXh0IHllYXIsIHRoYXQgeWVhciBpc1xuICAgICAgICAgICAgICAgICAgICAvLyB1c2VkIGluc3RlYWQuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJvXCI6IHJldHVybiBnZXRJU084NjAxWWVhcihtZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEEgZnVsbCBudW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIGEgeWVhciwgNCBkaWdpdHNcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIllcIjogcmV0dXJuIG1lLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEEgdHdvIGRpZ2l0IHJlcHJlc2VudGF0aW9uIG9mIGEgeWVhclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwieVwiOiByZXR1cm4gKG1lLmdldEZ1bGxZZWFyKCkgKyBcIlwiKS5yZXBsYWNlKC9eLisoLi4pJC8sIFwiJDFcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIExvd2VyY2FzZSBBbnRlIG1lcmlkaWVtIGFuZCBQb3N0IG1lcmlkaWVtXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJhXCI6IHJldHVybiBtZS5nZXRIb3VycygpIDwgMTIgPyBcImFtXCIgOiBcInBtXCI7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVwcGVyY2FzZSBBbnRlIG1lcmlkaWVtIGFuZCBQb3N0IG1lcmlkaWVtXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJBXCI6IHJldHVybiBtZS5nZXRIb3VycygpIDwgMTIgPyBcIkFNXCIgOiBcIlBNXCI7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN3YXRjaCBJbnRlcm5ldCB0aW1lXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJCXCI6IHJldHVybiBNYXRoLmZsb29yKCgoKG1lLmdldFVUQ0hvdXJzKCkgKyAxKSAlIDI0KSArIG1lLmdldFVUQ01pbnV0ZXMoKSAvIDYwICsgbWUuZ2V0VVRDU2Vjb25kcygpIC8gMzYwMCkgKiAxMDAwIC8gMjQpO1xuICAgICAgICAgICAgICAgICAgICAvLyAxMi1ob3VyIGZvcm1hdCBvZiBhbiBob3VyIHdpdGhvdXQgbGVhZGluZyB6ZXJvc1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZ1wiOiByZXR1cm4gbWUuZ2V0SG91cnMoKSAlIDEyICE9IDAgPyBtZS5nZXRIb3VycygpICUgMTIgOiAxMjtcbiAgICAgICAgICAgICAgICAgICAgLy8gMjQtaG91ciBmb3JtYXQgb2YgYW4gaG91ciB3aXRob3V0IGxlYWRpbmcgemVyb3NcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkdcIjogcmV0dXJuIG1lLmdldEhvdXJzKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIDEyLWhvdXIgZm9ybWF0IG9mIGFuIGhvdXIgd2l0aCBsZWFkaW5nIHplcm9zXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJoXCI6IHJldHVybiAoXCIwXCIgKyAobWUuZ2V0SG91cnMoKSAlIDEyICE9IDAgPyBtZS5nZXRIb3VycygpICUgMTIgOiAxMikpLnJlcGxhY2UoL14uKyguLikkLywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gMjQtaG91ciBmb3JtYXQgb2YgYW4gaG91ciB3aXRoIGxlYWRpbmcgemVyb3NcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkhcIjogcmV0dXJuIChcIjBcIiArIG1lLmdldEhvdXJzKCkpLnJlcGxhY2UoL14uKyguLikkLywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTWludXRlcyB3aXRoIGxlYWRpbmcgemVyb3NcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImlcIjogcmV0dXJuIChcIjBcIiArIG1lLmdldE1pbnV0ZXMoKSkucmVwbGFjZSgvXi4rKC4uKSQvLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBTZWNvbmRzLCB3aXRoIGxlYWRpbmcgemVyb3NcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNcIjogcmV0dXJuIChcIjBcIiArIG1lLmdldFNlY29uZHMoKSkucmVwbGFjZSgvXi4rKC4uKSQvLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBNaWxsaXNlY29uZHNcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInVcIjogcmV0dXJuIG1lLmdldE1pbGxpc2Vjb25kcygpO1xuICAgICAgICAgICAgICAgICAgICAvLyBTZWNvbmRzIHNpbmNlIHRoZSBVbml4IEVwb2NoIChKYW51YXJ5IDEgMTk3MCAwMDowMDowMCBHTVQpXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJVXCI6IHJldHVybiBtZS5nZXRUaW1lKCkgLyAxMDAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH0pKCk7XG5cbiAgICBUd2lnLmxpYi5zdHJpcF90YWdzID0gZnVuY3Rpb24oaW5wdXQsIGFsbG93ZWQpIHtcbiAgICAgICAgLy8gU3RyaXBzIEhUTUwgYW5kIFBIUCB0YWdzIGZyb20gYSBzdHJpbmdcbiAgICAgICAgLy9cbiAgICAgICAgLy8gdmVyc2lvbjogMTEwOS4yMDE1XG4gICAgICAgIC8vIGRpc2N1c3MgYXQ6IGh0dHA6Ly9waHBqcy5vcmcvZnVuY3Rpb25zL3N0cmlwX3RhZ3NcbiAgICAgICAgLy8gKyAgIG9yaWdpbmFsIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va2V2aW4udmFuem9ubmV2ZWxkLm5ldClcbiAgICAgICAgLy8gKyAgIGltcHJvdmVkIGJ5OiBMdWtlIEdvZGZyZXlcbiAgICAgICAgLy8gKyAgICAgIGlucHV0IGJ5OiBQdWxcbiAgICAgICAgLy8gKyAgIGJ1Z2ZpeGVkIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va2V2aW4udmFuem9ubmV2ZWxkLm5ldClcbiAgICAgICAgLy8gKyAgIGJ1Z2ZpeGVkIGJ5OiBPbm5vIE1hcnNtYW5cbiAgICAgICAgLy8gKyAgICAgIGlucHV0IGJ5OiBBbGV4XG4gICAgICAgIC8vICsgICBidWdmaXhlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2tldmluLnZhbnpvbm5ldmVsZC5uZXQpXG4gICAgICAgIC8vICsgICAgICBpbnB1dCBieTogTWFyYyBQYWxhdVxuICAgICAgICAvLyArICAgaW1wcm92ZWQgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxuICAgICAgICAvLyArICAgICAgaW5wdXQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXG4gICAgICAgIC8vICsgICBidWdmaXhlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2tldmluLnZhbnpvbm5ldmVsZC5uZXQpXG4gICAgICAgIC8vICsgICBidWdmaXhlZCBieTogRXJpYyBOYWdlbFxuICAgICAgICAvLyArICAgICAgaW5wdXQgYnk6IEJvYmJ5IERyYWtlXG4gICAgICAgIC8vICsgICBidWdmaXhlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2tldmluLnZhbnpvbm5ldmVsZC5uZXQpXG4gICAgICAgIC8vICsgICBidWdmaXhlZCBieTogVG9tYXN6IFdlc29sb3dza2lcbiAgICAgICAgLy8gKyAgICAgIGlucHV0IGJ5OiBFdmVydGphbiBHYXJyZXRzZW5cbiAgICAgICAgLy8gKyAgICByZXZpc2VkIGJ5OiBSYWZhxYIgS3VrYXdza2kgKGh0dHA6Ly9ibG9nLmt1a2F3c2tpLnBsLylcbiAgICAgICAgLy8gKiAgICAgZXhhbXBsZSAxOiBzdHJpcF90YWdzKCc8cD5LZXZpbjwvcD4gPGI+dmFuPC9iPiA8aT5ab25uZXZlbGQ8L2k+JywgJzxpPjxiPicpO1xuICAgICAgICAvLyAqICAgICByZXR1cm5zIDE6ICdLZXZpbiA8Yj52YW48L2I+IDxpPlpvbm5ldmVsZDwvaT4nXG4gICAgICAgIC8vICogICAgIGV4YW1wbGUgMjogc3RyaXBfdGFncygnPHA+S2V2aW4gPGltZyBzcmM9XCJzb21laW1hZ2UucG5nXCIgb25tb3VzZW92ZXI9XCJzb21lRnVuY3Rpb24oKVwiPnZhbiA8aT5ab25uZXZlbGQ8L2k+PC9wPicsICc8cD4nKTtcbiAgICAgICAgLy8gKiAgICAgcmV0dXJucyAyOiAnPHA+S2V2aW4gdmFuIFpvbm5ldmVsZDwvcD4nXG4gICAgICAgIC8vICogICAgIGV4YW1wbGUgMzogc3RyaXBfdGFncyhcIjxhIGhyZWY9J2h0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0Jz5LZXZpbiB2YW4gWm9ubmV2ZWxkPC9hPlwiLCBcIjxhPlwiKTtcbiAgICAgICAgLy8gKiAgICAgcmV0dXJucyAzOiAnPGEgaHJlZj0naHR0cDovL2tldmluLnZhbnpvbm5ldmVsZC5uZXQnPktldmluIHZhbiBab25uZXZlbGQ8L2E+J1xuICAgICAgICAvLyAqICAgICBleGFtcGxlIDQ6IHN0cmlwX3RhZ3MoJzEgPCA1IDUgPiAxJyk7XG4gICAgICAgIC8vICogICAgIHJldHVybnMgNDogJzEgPCA1IDUgPiAxJ1xuICAgICAgICAvLyAqICAgICBleGFtcGxlIDU6IHN0cmlwX3RhZ3MoJzEgPGJyLz4gMScpO1xuICAgICAgICAvLyAqICAgICByZXR1cm5zIDU6ICcxICAxJ1xuICAgICAgICAvLyAqICAgICBleGFtcGxlIDY6IHN0cmlwX3RhZ3MoJzEgPGJyLz4gMScsICc8YnI+Jyk7XG4gICAgICAgIC8vICogICAgIHJldHVybnMgNjogJzEgIDEnXG4gICAgICAgIC8vICogICAgIGV4YW1wbGUgNzogc3RyaXBfdGFncygnMSA8YnIvPiAxJywgJzxicj48YnIvPicpO1xuICAgICAgICAvLyAqICAgICByZXR1cm5zIDc6ICcxIDxici8+IDEnXG4gICAgICAgIGFsbG93ZWQgPSAoKChhbGxvd2VkIHx8IFwiXCIpICsgXCJcIikudG9Mb3dlckNhc2UoKS5tYXRjaCgvPFthLXpdW2EtejAtOV0qPi9nKSB8fCBbXSkuam9pbignJyk7IC8vIG1ha2luZyBzdXJlIHRoZSBhbGxvd2VkIGFyZyBpcyBhIHN0cmluZyBjb250YWluaW5nIG9ubHkgdGFncyBpbiBsb3dlcmNhc2UgKDxhPjxiPjxjPilcbiAgICAgICAgdmFyIHRhZ3MgPSAvPFxcLz8oW2Etel1bYS16MC05XSopXFxiW14+XSo+L2dpLFxuICAgICAgICAgICAgY29tbWVudHNBbmRQaHBUYWdzID0gLzwhLS1bXFxzXFxTXSo/LS0+fDxcXD8oPzpwaHApP1tcXHNcXFNdKj9cXD8+L2dpO1xuICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZShjb21tZW50c0FuZFBocFRhZ3MsICcnKS5yZXBsYWNlKHRhZ3MsIGZ1bmN0aW9uICgkMCwgJDEpIHtcbiAgICAgICAgICAgIHJldHVybiBhbGxvd2VkLmluZGV4T2YoJzwnICsgJDEudG9Mb3dlckNhc2UoKSArICc+JykgPiAtMSA/ICQwIDogJyc7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIFR3aWcubGliLnBhcnNlSVNPODYwMURhdGUgPSBmdW5jdGlvbiAocyl7XG4gICAgICAgIC8vIFRha2VuIGZyb20gaHR0cDovL244di5lbnRldXhpcy5vcmcvMjAxMC8xMi9wYXJzaW5nLWlzby04NjAxLWRhdGVzLWluLWphdmFzY3JpcHQvXG4gICAgICAgIC8vIHBhcmVudGhlc2UgbWF0Y2hlczpcbiAgICAgICAgLy8geWVhciBtb250aCBkYXkgICAgaG91cnMgbWludXRlcyBzZWNvbmRzICBcbiAgICAgICAgLy8gZG90bWlsbGlzZWNvbmRzIFxuICAgICAgICAvLyB0enN0cmluZyBwbHVzbWludXMgaG91cnMgbWludXRlc1xuICAgICAgICB2YXIgcmUgPSAvKFxcZHs0fSktKFxcZFxcZCktKFxcZFxcZClUKFxcZFxcZCk6KFxcZFxcZCk6KFxcZFxcZCkoXFwuXFxkKyk/KFp8KFsrLV0pKFxcZFxcZCk6KFxcZFxcZCkpLztcblxuICAgICAgICB2YXIgZCA9IFtdO1xuICAgICAgICBkID0gcy5tYXRjaChyZSk7XG5cbiAgICAgICAgLy8gXCIyMDEwLTEyLTA3VDExOjAwOjAwLjAwMC0wOTowMFwiIHBhcnNlcyB0bzpcbiAgICAgICAgLy8gIFtcIjIwMTAtMTItMDdUMTE6MDA6MDAuMDAwLTA5OjAwXCIsIFwiMjAxMFwiLCBcIjEyXCIsIFwiMDdcIiwgXCIxMVwiLFxuICAgICAgICAvLyAgICAgXCIwMFwiLCBcIjAwXCIsIFwiLjAwMFwiLCBcIi0wOTowMFwiLCBcIi1cIiwgXCIwOVwiLCBcIjAwXCJdXG4gICAgICAgIC8vIFwiMjAxMC0xMi0wN1QxMTowMDowMC4wMDBaXCIgcGFyc2VzIHRvOlxuICAgICAgICAvLyAgW1wiMjAxMC0xMi0wN1QxMTowMDowMC4wMDBaXCIsICAgICAgXCIyMDEwXCIsIFwiMTJcIiwgXCIwN1wiLCBcIjExXCIsIFxuICAgICAgICAvLyAgICAgXCIwMFwiLCBcIjAwXCIsIFwiLjAwMFwiLCBcIlpcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cblxuICAgICAgICBpZiAoISBkKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNvdWxkbid0IHBhcnNlIElTTyA4NjAxIGRhdGUgc3RyaW5nICdcIiArIHMgKyBcIidcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHBhcnNlIHN0cmluZ3MsIGxlYWRpbmcgemVyb3MgaW50byBwcm9wZXIgaW50c1xuICAgICAgICB2YXIgYSA9IFsxLDIsMyw0LDUsNiwxMCwxMV07XG4gICAgICAgIGZvciAodmFyIGkgaW4gYSkge1xuICAgICAgICAgICAgZFthW2ldXSA9IHBhcnNlSW50KGRbYVtpXV0sIDEwKTtcbiAgICAgICAgfVxuICAgICAgICBkWzddID0gcGFyc2VGbG9hdChkWzddKTtcblxuICAgICAgICAvLyBEYXRlLlVUQyh5ZWFyLCBtb250aFssIGRhdGVbLCBocnNbLCBtaW5bLCBzZWNbLCBtc11dXV1dKVxuICAgICAgICAvLyBub3RlIHRoYXQgbW9udGggaXMgMC0xMSwgbm90IDEtMTJcbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0RhdGUvVVRDXG4gICAgICAgIHZhciBtcyA9IERhdGUuVVRDKGRbMV0sIGRbMl0gLSAxLCBkWzNdLCBkWzRdLCBkWzVdLCBkWzZdKTtcblxuICAgICAgICAvLyBpZiB0aGVyZSBhcmUgbWlsbGlzZWNvbmRzLCBhZGQgdGhlbVxuICAgICAgICBpZiAoZFs3XSA+IDApIHsgIFxuICAgICAgICAgICAgbXMgKz0gTWF0aC5yb3VuZChkWzddICogMTAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGVyZSdzIGEgdGltZXpvbmUsIGNhbGN1bGF0ZSBpdFxuICAgICAgICBpZiAoZFs4XSAhPSBcIlpcIiAmJiBkWzEwXSkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IGRbMTBdICogNjAgKiA2MCAqIDEwMDA7XG4gICAgICAgICAgICBpZiAoZFsxMV0pIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQgKz0gZFsxMV0gKiA2MCAqIDEwMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZFs5XSA9PSBcIi1cIikge1xuICAgICAgICAgICAgICAgIG1zIC09IG9mZnNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1zICs9IG9mZnNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShtcyk7XG4gICAgfTtcblxuICAgIFR3aWcubGliLnN0cnRvdGltZSA9IGZ1bmN0aW9uICh0ZXh0LCBub3cpIHtcbiAgICAgICAgLy8gIGRpc2N1c3MgYXQ6IGh0dHA6Ly9waHBqcy5vcmcvZnVuY3Rpb25zL3N0cnRvdGltZS9cbiAgICAgICAgLy8gICAgIHZlcnNpb246IDExMDkuMjAxNlxuICAgICAgICAvLyBvcmlnaW5hbCBieTogQ2FpbyBBcmllZGUgKGh0dHA6Ly9jYWlvYXJpZWRlLmNvbSlcbiAgICAgICAgLy8gaW1wcm92ZWQgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxuICAgICAgICAvLyBpbXByb3ZlZCBieTogQ2FpbyBBcmllZGUgKGh0dHA6Ly9jYWlvYXJpZWRlLmNvbSlcbiAgICAgICAgLy8gaW1wcm92ZWQgYnk6IEEuIE1hdMOtYXMgUXVlemFkYSAoaHR0cDovL2FtYXRpYXNxLmNvbSlcbiAgICAgICAgLy8gaW1wcm92ZWQgYnk6IHByZXV0ZXJcbiAgICAgICAgLy8gaW1wcm92ZWQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXG4gICAgICAgIC8vIGltcHJvdmVkIGJ5OiBNaXJrbyBGYWJlclxuICAgICAgICAvLyAgICBpbnB1dCBieTogRGF2aWRcbiAgICAgICAgLy8gYnVnZml4ZWQgYnk6IFdhZ25lciBCLiBTb2FyZXNcbiAgICAgICAgLy8gYnVnZml4ZWQgYnk6IEFydHVyIFRjaGVybnljaGV2XG4gICAgICAgIC8vICAgICAgICBub3RlOiBFeGFtcGxlcyBhbGwgaGF2ZSBhIGZpeGVkIHRpbWVzdGFtcCB0byBwcmV2ZW50IHRlc3RzIHRvIGZhaWwgYmVjYXVzZSBvZiB2YXJpYWJsZSB0aW1lKHpvbmVzKVxuICAgICAgICAvLyAgIGV4YW1wbGUgMTogc3RydG90aW1lKCcrMSBkYXknLCAxMTI5NjMzMjAwKTtcbiAgICAgICAgLy8gICByZXR1cm5zIDE6IDExMjk3MTk2MDBcbiAgICAgICAgLy8gICBleGFtcGxlIDI6IHN0cnRvdGltZSgnKzEgd2VlayAyIGRheXMgNCBob3VycyAyIHNlY29uZHMnLCAxMTI5NjMzMjAwKTtcbiAgICAgICAgLy8gICByZXR1cm5zIDI6IDExMzA0MjUyMDJcbiAgICAgICAgLy8gICBleGFtcGxlIDM6IHN0cnRvdGltZSgnbGFzdCBtb250aCcsIDExMjk2MzMyMDApO1xuICAgICAgICAvLyAgIHJldHVybnMgMzogMTEyNzA0MTIwMFxuICAgICAgICAvLyAgIGV4YW1wbGUgNDogc3RydG90aW1lKCcyMDA5LTA1LTA0IDA4OjMwOjAwIEdNVCcpO1xuICAgICAgICAvLyAgIHJldHVybnMgNDogMTI0MTQyNTgwMFxuXG4gICAgICAgIHZhciBwYXJzZWQsIG1hdGNoLCB0b2RheSwgeWVhciwgZGF0ZSwgZGF5cywgcmFuZ2VzLCBsZW4sIHRpbWVzLCByZWdleCwgaSwgZmFpbCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICghdGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhaWw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVbmVjZXNzYXJ5IHNwYWNlc1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHN7Mix9L2csICcgJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9bXFx0XFxyXFxuXS9nLCAnJylcbiAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIC8vIGluIGNvbnRyYXN0IHRvIHBocCwganMgRGF0ZS5wYXJzZSBmdW5jdGlvbiBpbnRlcnByZXRzOlxuICAgICAgICAvLyBkYXRlcyBnaXZlbiBhcyB5eXl5LW1tLWRkIGFzIGluIHRpbWV6b25lOiBVVEMsXG4gICAgICAgIC8vIGRhdGVzIHdpdGggXCIuXCIgb3IgXCItXCIgYXMgTURZIGluc3RlYWQgb2YgRE1ZXG4gICAgICAgIC8vIGRhdGVzIHdpdGggdHdvLWRpZ2l0IHllYXJzIGRpZmZlcmVudGx5XG4gICAgICAgIC8vIGV0Yy4uLmV0Yy4uLlxuICAgICAgICAvLyAuLi50aGVyZWZvcmUgd2UgbWFudWFsbHkgcGFyc2UgbG90cyBvZiBjb21tb24gZGF0ZSBmb3JtYXRzXG4gICAgICAgIG1hdGNoID0gdGV4dC5tYXRjaChcbiAgICAgICAgICAgIC9eKFxcZHsxLDR9KShbXFwtXFwuXFwvXFw6XSkoXFxkezEsMn0pKFtcXC1cXC5cXC9cXDpdKShcXGR7MSw0fSkoPzpcXHMoXFxkezEsMn0pOihcXGR7Mn0pPzo/KFxcZHsyfSk/KT8oPzpcXHMoW0EtWl0rKT8pPyQvKTtcblxuICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2hbMl0gPT09IG1hdGNoWzRdKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hbMV0gPiAxOTAxKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChtYXRjaFsyXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBZWVlZLU0tRFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoWzNdID4gMTIgfHwgbWF0Y2hbNV0gPiAzMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUobWF0Y2hbMV0sIHBhcnNlSW50KG1hdGNoWzNdLCAxMCkgLSAxLCBtYXRjaFs1XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFs2XSB8fCAwLCBtYXRjaFs3XSB8fCAwLCBtYXRjaFs4XSB8fCAwLCBtYXRjaFs5XSB8fCAwKSAvIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gWVlZWS5NLkQgaXMgbm90IHBhcnNlZCBieSBzdHJ0b3RpbWUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhaWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gWVlZWS9NL0RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaFszXSA+IDEyIHx8IG1hdGNoWzVdID4gMzEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKG1hdGNoWzFdLCBwYXJzZUludChtYXRjaFszXSwgMTApIC0gMSwgbWF0Y2hbNV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbNl0gfHwgMCwgbWF0Y2hbN10gfHwgMCwgbWF0Y2hbOF0gfHwgMCwgbWF0Y2hbOV0gfHwgMCkgLyAxMDAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaFs1XSA+IDE5MDEpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEQtTS1ZWVlZXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hbM10gPiAxMiB8fCBtYXRjaFsxXSA+IDMxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhaWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShtYXRjaFs1XSwgcGFyc2VJbnQobWF0Y2hbM10sIDEwKSAtIDEsIG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzZdIHx8IDAsIG1hdGNoWzddIHx8IDAsIG1hdGNoWzhdIHx8IDAsIG1hdGNoWzldIHx8IDApIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBELk0uWVlZWVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoWzNdID4gMTIgfHwgbWF0Y2hbMV0gPiAzMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUobWF0Y2hbNV0sIHBhcnNlSW50KG1hdGNoWzNdLCAxMCkgLSAxLCBtYXRjaFsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFs2XSB8fCAwLCBtYXRjaFs3XSB8fCAwLCBtYXRjaFs4XSB8fCAwLCBtYXRjaFs5XSB8fCAwKSAvIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTS9EL1lZWVlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaFsxXSA+IDEyIHx8IG1hdGNoWzNdID4gMzEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKG1hdGNoWzVdLCBwYXJzZUludChtYXRjaFsxXSwgMTApIC0gMSwgbWF0Y2hbM10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbNl0gfHwgMCwgbWF0Y2hbN10gfHwgMCwgbWF0Y2hbOF0gfHwgMCwgbWF0Y2hbOV0gfHwgMCkgLyAxMDAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFlZLU0tRFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoWzNdID4gMTIgfHwgbWF0Y2hbNV0gPiAzMSB8fCAobWF0Y2hbMV0gPCA3MCAmJiBtYXRjaFsxXSA+IDM4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyID0gbWF0Y2hbMV0gPj0gMCAmJiBtYXRjaFsxXSA8PSAzOCA/ICttYXRjaFsxXSArIDIwMDAgOiBtYXRjaFsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBwYXJzZUludChtYXRjaFszXSwgMTApIC0gMSwgbWF0Y2hbNV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbNl0gfHwgMCwgbWF0Y2hbN10gfHwgMCwgbWF0Y2hbOF0gfHwgMCwgbWF0Y2hbOV0gfHwgMCkgLyAxMDAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEQuTS5ZWSBvciBILk1NLlNTXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hbNV0gPj0gNzApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBELk0uWVlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hbM10gPiAxMiB8fCBtYXRjaFsxXSA+IDMxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShtYXRjaFs1XSwgcGFyc2VJbnQobWF0Y2hbM10sIDEwKSAtIDEsIG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFs2XSB8fCAwLCBtYXRjaFs3XSB8fCAwLCBtYXRjaFs4XSB8fCAwLCBtYXRjaFs5XSB8fCAwKSAvIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hbNV0gPCA2MCAmJiAhbWF0Y2hbNl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBILk1NLlNTXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoWzFdID4gMjMgfHwgbWF0Y2hbM10gPiA1OSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHRvZGF5LmdldEZ1bGxZZWFyKCksIHRvZGF5LmdldE1vbnRoKCksIHRvZGF5LmdldERhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbMV0gfHwgMCwgbWF0Y2hbM10gfHwgMCwgbWF0Y2hbNV0gfHwgMCwgbWF0Y2hbOV0gfHwgMCkgLyAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnZhbGlkIGZvcm1hdCwgY2Fubm90IGJlIHBhcnNlZFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhaWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTS9EL1lZXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMV0gPiAxMiB8fCBtYXRjaFszXSA+IDMxIHx8IChtYXRjaFs1XSA8IDcwICYmIG1hdGNoWzVdID4gMzgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhaWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXIgPSBtYXRjaFs1XSA+PSAwICYmIG1hdGNoWzVdIDw9IDM4ID8gK21hdGNoWzVdICsgMjAwMCA6IG1hdGNoWzVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIHBhcnNlSW50KG1hdGNoWzFdLCAxMCkgLSAxLCBtYXRjaFszXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFs2XSB8fCAwLCBtYXRjaFs3XSB8fCAwLCBtYXRjaFs4XSB8fCAwLCBtYXRjaFs5XSB8fCAwKSAvIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICc6JzpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSEg6TU06U1NcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaFsxXSA+IDIzIHx8IG1hdGNoWzNdID4gNTkgfHwgbWF0Y2hbNV0gPiA1OSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodG9kYXkuZ2V0RnVsbFllYXIoKSwgdG9kYXkuZ2V0TW9udGgoKSwgdG9kYXkuZ2V0RGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzFdIHx8IDAsIG1hdGNoWzNdIHx8IDAsIG1hdGNoWzVdIHx8IDApIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG90aGVyIGZvcm1hdHMgYW5kIFwibm93XCIgc2hvdWxkIGJlIHBhcnNlZCBieSBEYXRlLnBhcnNlKClcbiAgICAgICAgaWYgKHRleHQgPT09ICdub3cnKSB7XG4gICAgICAgICAgICByZXR1cm4gbm93ID09PSBudWxsIHx8IGlzTmFOKG5vdykgPyBuZXcgRGF0ZSgpXG4gICAgICAgICAgICAgICAgLmdldFRpbWUoKSAvIDEwMDAgfCAwIDogbm93IHwgMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzTmFOKHBhcnNlZCA9IERhdGUucGFyc2UodGV4dCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VkIC8gMTAwMCB8IDA7XG4gICAgICAgIH1cblxuICAgICAgICBkYXRlID0gbm93ID8gbmV3IERhdGUobm93ICogMTAwMCkgOiBuZXcgRGF0ZSgpO1xuICAgICAgICBkYXlzID0ge1xuICAgICAgICAgICAgJ3N1bic6IDAsXG4gICAgICAgICAgICAnbW9uJzogMSxcbiAgICAgICAgICAgICd0dWUnOiAyLFxuICAgICAgICAgICAgJ3dlZCc6IDMsXG4gICAgICAgICAgICAndGh1JzogNCxcbiAgICAgICAgICAgICdmcmknOiA1LFxuICAgICAgICAgICAgJ3NhdCc6IDZcbiAgICAgICAgfTtcbiAgICAgICAgcmFuZ2VzID0ge1xuICAgICAgICAgICAgJ3llYSc6ICdGdWxsWWVhcicsXG4gICAgICAgICAgICAnbW9uJzogJ01vbnRoJyxcbiAgICAgICAgICAgICdkYXknOiAnRGF0ZScsXG4gICAgICAgICAgICAnaG91JzogJ0hvdXJzJyxcbiAgICAgICAgICAgICdtaW4nOiAnTWludXRlcycsXG4gICAgICAgICAgICAnc2VjJzogJ1NlY29uZHMnXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gbGFzdE5leHQodHlwZSwgcmFuZ2UsIG1vZGlmaWVyKSB7XG4gICAgICAgICAgICB2YXIgZGlmZiwgZGF5ID0gZGF5c1tyYW5nZV07XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGRpZmYgPSBkYXkgLSBkYXRlLmdldERheSgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRpZmYgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA9IDcgKiBtb2RpZmllcjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpZmYgPiAwICYmIHR5cGUgPT09ICdsYXN0Jykge1xuICAgICAgICAgICAgICAgICAgICBkaWZmIC09IDc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaWZmIDwgMCAmJiB0eXBlID09PSAnbmV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlmZiArPSA3O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIGRpZmYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzcyh2YWwpIHtcbiAgICAgICAgICAgIHZhciBzcGx0ID0gdmFsLnNwbGl0KCcgJyksIC8vIFRvZG86IFJlY29uY2lsZSB0aGlzIHdpdGggcmVnZXggdXNpbmcgXFxzLCB0YWtpbmcgaW50byBhY2NvdW50IGJyb3dzZXIgaXNzdWVzIHdpdGggc3BsaXQgYW5kIHJlZ2V4ZXNcbiAgICAgICAgICAgICAgICB0eXBlID0gc3BsdFswXSxcbiAgICAgICAgICAgICAgICByYW5nZSA9IHNwbHRbMV0uc3Vic3RyaW5nKDAsIDMpLFxuICAgICAgICAgICAgICAgIHR5cGVJc051bWJlciA9IC9cXGQrLy50ZXN0KHR5cGUpLFxuICAgICAgICAgICAgICAgIGFnbyA9IHNwbHRbMl0gPT09ICdhZ28nLFxuICAgICAgICAgICAgICAgIG51bSA9ICh0eXBlID09PSAnbGFzdCcgPyAtMSA6IDEpICogKGFnbyA/IC0xIDogMSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlSXNOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICBudW0gKj0gcGFyc2VJbnQodHlwZSwgMTApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmFuZ2VzLmhhc093blByb3BlcnR5KHJhbmdlKSAmJiAhc3BsdFsxXS5tYXRjaCgvXm1vbihkYXl8XFwuKT8kL2kpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGVbJ3NldCcgKyByYW5nZXNbcmFuZ2VdXShkYXRlWydnZXQnICsgcmFuZ2VzW3JhbmdlXV0oKSArIG51bSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyYW5nZSA9PT0gJ3dlZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgKG51bSAqIDcpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICduZXh0JyB8fCB0eXBlID09PSAnbGFzdCcpIHtcbiAgICAgICAgICAgICAgICBsYXN0TmV4dCh0eXBlLCByYW5nZSwgbnVtKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXR5cGVJc051bWJlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aW1lcyA9ICcoeWVhcnM/fG1vbnRocz98d2Vla3M/fGRheXM/fGhvdXJzP3xtaW51dGVzP3xtaW58c2Vjb25kcz98c2VjJyArXG4gICAgICAgICAgICAnfHN1bmRheXxzdW5cXFxcLj98bW9uZGF5fG1vblxcXFwuP3x0dWVzZGF5fHR1ZVxcXFwuP3x3ZWRuZXNkYXl8d2VkXFxcXC4/JyArXG4gICAgICAgICAgICAnfHRodXJzZGF5fHRodVxcXFwuP3xmcmlkYXl8ZnJpXFxcXC4/fHNhdHVyZGF5fHNhdFxcXFwuPyknO1xuICAgICAgICByZWdleCA9ICcoWystXT9cXFxcZCtcXFxccycgKyB0aW1lcyArICd8JyArICcobGFzdHxuZXh0KVxcXFxzJyArIHRpbWVzICsgJykoXFxcXHNhZ28pPyc7XG5cbiAgICAgICAgbWF0Y2ggPSB0ZXh0Lm1hdGNoKG5ldyBSZWdFeHAocmVnZXgsICdnaScpKTtcbiAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhaWw7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBtYXRjaC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKCFwcm9jZXNzKG1hdGNoW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRUNNQVNjcmlwdCA1IG9ubHlcbiAgICAgICAgLy8gaWYgKCFtYXRjaC5ldmVyeShwcm9jZXNzKSlcbiAgICAgICAgLy8gICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiAoZGF0ZS5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgICB9O1xuXG4gICAgVHdpZy5saWIuaXMgPSBmdW5jdGlvbih0eXBlLCBvYmopIHtcbiAgICAgICAgdmFyIGNsYXMgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKS5zbGljZSg4LCAtMSk7XG4gICAgICAgIHJldHVybiBvYmogIT09IHVuZGVmaW5lZCAmJiBvYmogIT09IG51bGwgJiYgY2xhcyA9PT0gdHlwZTtcbiAgICB9O1xuXG4gICAgLy8gc2hhbGxvdy1jb3B5IGFuIG9iamVjdFxuICAgIFR3aWcubGliLmNvcHkgPSBmdW5jdGlvbihzcmMpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IHt9LFxuICAgICAgICAgICAga2V5O1xuICAgICAgICBmb3IgKGtleSBpbiBzcmMpXG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNyY1trZXldO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcblxuICAgIFR3aWcubGliLnJlcGxhY2VBbGwgPSBmdW5jdGlvbihzdHJpbmcsIHNlYXJjaCwgcmVwbGFjZSkge1xuICAgICAgICByZXR1cm4gc3RyaW5nLnNwbGl0KHNlYXJjaCkuam9pbihyZXBsYWNlKTtcbiAgICB9O1xuXG4gICAgLy8gY2h1bmsgYW4gYXJyYXkgKGFycikgaW50byBhcnJheXMgb2YgKHNpemUpIGl0ZW1zLCByZXR1cm5zIGFuIGFycmF5IG9mIGFycmF5cywgb3IgYW4gZW1wdHkgYXJyYXkgb24gaW52YWxpZCBpbnB1dFxuICAgIFR3aWcubGliLmNodW5rQXJyYXkgPSBmdW5jdGlvbiAoYXJyLCBzaXplKSB7XG4gICAgICAgIHZhciByZXR1cm5WYWwgPSBbXSxcbiAgICAgICAgICAgIHggPSAwLFxuICAgICAgICAgICAgbGVuID0gYXJyLmxlbmd0aDtcblxuICAgICAgICBpZiAoc2l6ZSA8IDEgfHwgIVR3aWcubGliLmlzKFwiQXJyYXlcIiwgYXJyKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKHggPCBsZW4pIHtcbiAgICAgICAgICAgIHJldHVyblZhbC5wdXNoKGFyci5zbGljZSh4LCB4ICs9IHNpemUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXR1cm5WYWw7XG4gICAgfTtcblxuICAgIFR3aWcubGliLnJvdW5kID0gZnVuY3Rpb24gcm91bmQodmFsdWUsIHByZWNpc2lvbiwgbW9kZSkge1xuICAgICAgICAvLyAgZGlzY3VzcyBhdDogaHR0cDovL3BocGpzLm9yZy9mdW5jdGlvbnMvcm91bmQvXG4gICAgICAgIC8vIG9yaWdpbmFsIGJ5OiBQaGlsaXAgUGV0ZXJzb25cbiAgICAgICAgLy8gIHJldmlzZWQgYnk6IE9ubm8gTWFyc21hblxuICAgICAgICAvLyAgcmV2aXNlZCBieTogVC5XaWxkXG4gICAgICAgIC8vICByZXZpc2VkIGJ5OiBSYWZhxYIgS3VrYXdza2kgKGh0dHA6Ly9ibG9nLmt1a2F3c2tpLnBsLylcbiAgICAgICAgLy8gICAgaW5wdXQgYnk6IEdyZWVuc2VlZFxuICAgICAgICAvLyAgICBpbnB1dCBieTogbWVvXG4gICAgICAgIC8vICAgIGlucHV0IGJ5OiBXaWxsaWFtXG4gICAgICAgIC8vICAgIGlucHV0IGJ5OiBKb3NlcCBTYW56IChodHRwOi8vd3d3LndzMy5lcy8pXG4gICAgICAgIC8vIGJ1Z2ZpeGVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxuICAgICAgICAvLyAgICAgICAgbm90ZTogR3JlYXQgd29yay4gSWRlYXMgZm9yIGltcHJvdmVtZW50OlxuICAgICAgICAvLyAgICAgICAgbm90ZTogLSBjb2RlIG1vcmUgY29tcGxpYW50IHdpdGggZGV2ZWxvcGVyIGd1aWRlbGluZXNcbiAgICAgICAgLy8gICAgICAgIG5vdGU6IC0gZm9yIGltcGxlbWVudGluZyBQSFAgY29uc3RhbnQgYXJndW1lbnRzIGxvb2sgYXRcbiAgICAgICAgLy8gICAgICAgIG5vdGU6IHRoZSBwYXRoaW5mbygpIGZ1bmN0aW9uLCBpdCBvZmZlcnMgdGhlIGdyZWF0ZXN0XG4gICAgICAgIC8vICAgICAgICBub3RlOiBmbGV4aWJpbGl0eSAmIGNvbXBhdGliaWxpdHkgcG9zc2libGVcbiAgICAgICAgLy8gICBleGFtcGxlIDE6IHJvdW5kKDEyNDE3NTcsIC0zKTtcbiAgICAgICAgLy8gICByZXR1cm5zIDE6IDEyNDIwMDBcbiAgICAgICAgLy8gICBleGFtcGxlIDI6IHJvdW5kKDMuNik7XG4gICAgICAgIC8vICAgcmV0dXJucyAyOiA0XG4gICAgICAgIC8vICAgZXhhbXBsZSAzOiByb3VuZCgyLjgzNSwgMik7XG4gICAgICAgIC8vICAgcmV0dXJucyAzOiAyLjg0XG4gICAgICAgIC8vICAgZXhhbXBsZSA0OiByb3VuZCgxLjE3NDk5OTk5OTk5OTksIDIpO1xuICAgICAgICAvLyAgIHJldHVybnMgNDogMS4xN1xuICAgICAgICAvLyAgIGV4YW1wbGUgNTogcm91bmQoNTg1NTEuNzk5OTk5OTk5OTk2LCAyKTtcbiAgICAgICAgLy8gICByZXR1cm5zIDU6IDU4NTUxLjhcblxuICAgICAgICB2YXIgbSwgZiwgaXNIYWxmLCBzZ247IC8vIGhlbHBlciB2YXJpYWJsZXNcbiAgICAgICAgcHJlY2lzaW9uIHw9IDA7IC8vIG1ha2luZyBzdXJlIHByZWNpc2lvbiBpcyBpbnRlZ2VyXG4gICAgICAgIG0gPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKTtcbiAgICAgICAgdmFsdWUgKj0gbTtcbiAgICAgICAgc2duID0gKHZhbHVlID4gMCkgfCAtKHZhbHVlIDwgMCk7IC8vIHNpZ24gb2YgdGhlIG51bWJlclxuICAgICAgICBpc0hhbGYgPSB2YWx1ZSAlIDEgPT09IDAuNSAqIHNnbjtcbiAgICAgICAgZiA9IE1hdGguZmxvb3IodmFsdWUpO1xuXG4gICAgICAgIGlmIChpc0hhbGYpIHtcbiAgICAgICAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1BIUF9ST1VORF9IQUxGX0RPV04nOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGYgKyAoc2duIDwgMCk7IC8vIHJvdW5kcyAuNSB0b3dhcmQgemVyb1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdQSFBfUk9VTkRfSEFMRl9FVkVOJzpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBmICsgKGYgJSAyICogc2duKTsgLy8gcm91ZHMgLjUgdG93YXJkcyB0aGUgbmV4dCBldmVuIGludGVnZXJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnUEhQX1JPVU5EX0hBTEZfT0REJzpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBmICsgIShmICUgMik7IC8vIHJvdW5kcyAuNSB0b3dhcmRzIHRoZSBuZXh0IG9kZCBpbnRlZ2VyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gZiArIChzZ24gPiAwKTsgLy8gcm91bmRzIC41IGF3YXkgZnJvbSB6ZXJvXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKGlzSGFsZiA/IHZhbHVlIDogTWF0aC5yb3VuZCh2YWx1ZSkpIC8gbTtcbiAgICB9XG5cbiAgICByZXR1cm4gVHdpZztcblxufSkoVHdpZyB8fCB7IH0pO1xuLy8gICAgIFR3aWcuanNcbi8vICAgICBBdmFpbGFibGUgdW5kZXIgdGhlIEJTRCAyLUNsYXVzZSBMaWNlbnNlXG4vLyAgICAgaHR0cHM6Ly9naXRodWIuY29tL2p1c3Rqb2huL3R3aWcuanNcblxuLy8gIyMgdHdpZy5sb2dpYy5qc1xuLy9cbi8vIFRoaXMgZmlsZSBoYW5kbGVzIHRva2VuaXppbmcsIGNvbXBpbGluZyBhbmQgcGFyc2luZyBsb2dpYyB0b2tlbnMuIHslIC4uLiAlfVxudmFyIFR3aWcgPSAoZnVuY3Rpb24gKFR3aWcpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIE5hbWVzcGFjZSBmb3IgbG9naWMgaGFuZGxpbmcuXG4gICAgICovXG4gICAgVHdpZy5sb2dpYyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogTG9naWMgdG9rZW4gdHlwZXMuXG4gICAgICovXG4gICAgVHdpZy5sb2dpYy50eXBlID0ge1xuICAgICAgICBpZl86ICAgICAgICdUd2lnLmxvZ2ljLnR5cGUuaWYnLFxuICAgICAgICBlbmRpZjogICAgICdUd2lnLmxvZ2ljLnR5cGUuZW5kaWYnLFxuICAgICAgICBmb3JfOiAgICAgICdUd2lnLmxvZ2ljLnR5cGUuZm9yJyxcbiAgICAgICAgZW5kZm9yOiAgICAnVHdpZy5sb2dpYy50eXBlLmVuZGZvcicsXG4gICAgICAgIGVsc2VfOiAgICAgJ1R3aWcubG9naWMudHlwZS5lbHNlJyxcbiAgICAgICAgZWxzZWlmOiAgICAnVHdpZy5sb2dpYy50eXBlLmVsc2VpZicsXG4gICAgICAgIHNldDogICAgICAgJ1R3aWcubG9naWMudHlwZS5zZXQnLFxuICAgICAgICBzZXRjYXB0dXJlOidUd2lnLmxvZ2ljLnR5cGUuc2V0Y2FwdHVyZScsXG4gICAgICAgIGVuZHNldDogICAgJ1R3aWcubG9naWMudHlwZS5lbmRzZXQnLFxuICAgICAgICBmaWx0ZXI6ICAgICdUd2lnLmxvZ2ljLnR5cGUuZmlsdGVyJyxcbiAgICAgICAgZW5kZmlsdGVyOiAnVHdpZy5sb2dpYy50eXBlLmVuZGZpbHRlcicsXG4gICAgICAgIGJsb2NrOiAgICAgJ1R3aWcubG9naWMudHlwZS5ibG9jaycsXG4gICAgICAgIGVuZGJsb2NrOiAgJ1R3aWcubG9naWMudHlwZS5lbmRibG9jaycsXG4gICAgICAgIGV4dGVuZHNfOiAgJ1R3aWcubG9naWMudHlwZS5leHRlbmRzJyxcbiAgICAgICAgdXNlOiAgICAgICAnVHdpZy5sb2dpYy50eXBlLnVzZScsXG4gICAgICAgIGluY2x1ZGU6ICAgJ1R3aWcubG9naWMudHlwZS5pbmNsdWRlJyxcbiAgICAgICAgc3BhY2VsZXNzOiAnVHdpZy5sb2dpYy50eXBlLnNwYWNlbGVzcycsXG4gICAgICAgIGVuZHNwYWNlbGVzczogJ1R3aWcubG9naWMudHlwZS5lbmRzcGFjZWxlc3MnLFxuICAgICAgICBtYWNybzogICAgICdUd2lnLmxvZ2ljLnR5cGUubWFjcm8nLFxuICAgICAgICBlbmRtYWNybzogICdUd2lnLmxvZ2ljLnR5cGUuZW5kbWFjcm8nLFxuICAgICAgICBpbXBvcnRfOiAgICdUd2lnLmxvZ2ljLnR5cGUuaW1wb3J0JyxcbiAgICAgICAgZnJvbTogICAgICAnVHdpZy5sb2dpYy50eXBlLmZyb20nLFxuICAgICAgICBlbWJlZDogICAgICdUd2lnLmxvZ2ljLnR5cGUuZW1iZWQnLFxuICAgICAgICBlbmRlbWJlZDogICdUd2lnLmxvZ2ljLnR5cGUuZW5kZW1iZWQnXG4gICAgfTtcblxuXG4gICAgLy8gUmVndWxhciBleHByZXNzaW9ucyBmb3IgaGFuZGxpbmcgbG9naWMgdG9rZW5zLlxuICAgIC8vXG4gICAgLy8gUHJvcGVydGllczpcbiAgICAvL1xuICAgIC8vICAgICAgdHlwZTogIFRoZSB0eXBlIG9mIGV4cHJlc3Npb24gdGhpcyBtYXRjaGVzXG4gICAgLy9cbiAgICAvLyAgICAgIHJlZ2V4OiBBIHJlZ3VsYXIgZXhwcmVzc2lvbiB0aGF0IG1hdGNoZXMgdGhlIGZvcm1hdCBvZiB0aGUgdG9rZW5cbiAgICAvL1xuICAgIC8vICAgICAgbmV4dDogIFdoYXQgbG9naWMgdG9rZW5zIChpZiBhbnkpIHBvcCB0aGlzIHRva2VuIG9mZiB0aGUgbG9naWMgc3RhY2suIElmIGVtcHR5LCB0aGVcbiAgICAvLyAgICAgICAgICAgICBsb2dpYyB0b2tlbiBpcyBhc3N1bWVkIHRvIG5vdCByZXF1aXJlIGFuIGVuZCB0YWcgYW5kIGlzbid0IHB1c2ggb250byB0aGUgc3RhY2suXG4gICAgLy9cbiAgICAvLyAgICAgIG9wZW46ICBEb2VzIHRoaXMgdGFnIG9wZW4gYSBsb2dpYyBleHByZXNzaW9uIG9yIGlzIGl0IHN0YW5kYWxvbmUuIEZvciBleGFtcGxlLFxuICAgIC8vICAgICAgICAgICAgIHslIGVuZGlmICV9IGNhbm5vdCBleGlzdCB3aXRob3V0IGFuIG9wZW5pbmcgeyUgaWYgLi4uICV9IHRhZywgc28gb3BlbiA9IGZhbHNlLlxuICAgIC8vXG4gICAgLy8gIEZ1bmN0aW9uczpcbiAgICAvL1xuICAgIC8vICAgICAgY29tcGlsZTogQSBmdW5jdGlvbiB0aGF0IGhhbmRsZXMgY29tcGlsaW5nIHRoZSB0b2tlbiBpbnRvIGFuIG91dHB1dCB0b2tlbiByZWFkeSBmb3JcbiAgICAvLyAgICAgICAgICAgICAgIHBhcnNpbmcgd2l0aCB0aGUgcGFyc2UgZnVuY3Rpb24uXG4gICAgLy9cbiAgICAvLyAgICAgIHBhcnNlOiAgIEEgZnVuY3Rpb24gdGhhdCBwYXJzZXMgdGhlIGNvbXBpbGVkIHRva2VuIGludG8gb3V0cHV0IChIVE1MIC8gd2hhdGV2ZXIgdGhlXG4gICAgLy8gICAgICAgICAgICAgICB0ZW1wbGF0ZSByZXByZXNlbnRzKS5cbiAgICBUd2lnLmxvZ2ljLmRlZmluaXRpb25zID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHR5cGUgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIGlmIGV4cHJlc3Npb24gJX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmlmXyxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmlmXFxzKyhbXFxzXFxTXSspJC8sXG4gICAgICAgICAgICBuZXh0OiBbXG4gICAgICAgICAgICAgICAgVHdpZy5sb2dpYy50eXBlLmVsc2VfLFxuICAgICAgICAgICAgICAgIFR3aWcubG9naWMudHlwZS5lbHNlaWYsXG4gICAgICAgICAgICAgICAgVHdpZy5sb2dpYy50eXBlLmVuZGlmXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHZhciBleHByZXNzaW9uID0gdG9rZW4ubWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgLy8gQ29tcGlsZSB0aGUgZXhwcmVzc2lvbi5cbiAgICAgICAgICAgICAgICB0b2tlbi5zdGFjayA9IFR3aWcuZXhwcmVzc2lvbi5jb21waWxlLmFwcGx5KHRoaXMsIFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICBUd2lnLmV4cHJlc3Npb24udHlwZS5leHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIH1dKS5zdGFjaztcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodG9rZW4sIGNvbnRleHQsIGNoYWluKSB7XG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dCA9ICcnLFxuICAgICAgICAgICAgICAgICAgICAvLyBQYXJzZSB0aGUgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBUd2lnLmV4cHJlc3Npb24ucGFyc2UuYXBwbHkodGhpcywgW3Rva2VuLnN0YWNrLCBjb250ZXh0XSk7XG5cbiAgICAgICAgICAgICAgICAvLyBTdGFydCBhIG5ldyBsb2dpYyBjaGFpblxuICAgICAgICAgICAgICAgIGNoYWluID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gcGFyc2UgaWYgb3V0cHV0XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IFR3aWcucGFyc2UuYXBwbHkodGhpcywgW3Rva2VuLm91dHB1dCwgY29udGV4dF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBjaGFpbjogY2hhaW4sXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dDogb3V0cHV0XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbHNlIGlmIHR5cGUgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIGVsc2VpZiBleHByZXNzaW9uICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5lbHNlaWYsXG4gICAgICAgICAgICByZWdleDogL15lbHNlaWZcXHMrKFteXFxzXS4qKSQvLFxuICAgICAgICAgICAgbmV4dDogW1xuICAgICAgICAgICAgICAgIFR3aWcubG9naWMudHlwZS5lbHNlXyxcbiAgICAgICAgICAgICAgICBUd2lnLmxvZ2ljLnR5cGUuZWxzZWlmLFxuICAgICAgICAgICAgICAgIFR3aWcubG9naWMudHlwZS5lbmRpZlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4cHJlc3Npb24gPSB0b2tlbi5tYXRjaFsxXTtcbiAgICAgICAgICAgICAgICAvLyBDb21waWxlIHRoZSBleHByZXNzaW9uLlxuICAgICAgICAgICAgICAgIHRva2VuLnN0YWNrID0gVHdpZy5leHByZXNzaW9uLmNvbXBpbGUuYXBwbHkodGhpcywgW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogIFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgfV0pLnN0YWNrO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gJyc7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2hhaW4gJiYgVHdpZy5leHByZXNzaW9uLnBhcnNlLmFwcGx5KHRoaXMsIFt0b2tlbi5zdGFjaywgY29udGV4dF0pID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYWluID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIC8vIHBhcnNlIGlmIG91dHB1dFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBUd2lnLnBhcnNlLmFwcGx5KHRoaXMsIFt0b2tlbi5vdXRwdXQsIGNvbnRleHRdKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBjaGFpbjogY2hhaW4sXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dDogb3V0cHV0XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbHNlIGlmIHR5cGUgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIGVsc2VpZiBleHByZXNzaW9uICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5lbHNlXyxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmVsc2UkLyxcbiAgICAgICAgICAgIG5leHQ6IFtcbiAgICAgICAgICAgICAgICBUd2lnLmxvZ2ljLnR5cGUuZW5kaWYsXG4gICAgICAgICAgICAgICAgVHdpZy5sb2dpYy50eXBlLmVuZGZvclxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKGNoYWluKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IFR3aWcucGFyc2UuYXBwbHkodGhpcywgW3Rva2VuLm91dHB1dCwgY29udGV4dF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBjaGFpbjogY2hhaW4sXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dDogb3V0cHV0XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbmQgaWYgdHlwZSBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgZW5kaWYgJX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmVuZGlmLFxuICAgICAgICAgICAgcmVnZXg6IC9eZW5kaWYkLyxcbiAgICAgICAgICAgIG5leHQ6IFsgXSxcbiAgICAgICAgICAgIG9wZW46IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRm9yIHR5cGUgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIGZvciBleHByZXNzaW9uICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5mb3JfLFxuICAgICAgICAgICAgcmVnZXg6IC9eZm9yXFxzKyhbYS16QS1aMC05XyxcXHNdKylcXHMraW5cXHMrKFteXFxzXS4qPykoPzpcXHMraWZcXHMrKFteXFxzXS4qKSk/JC8sXG4gICAgICAgICAgICBuZXh0OiBbXG4gICAgICAgICAgICAgICAgVHdpZy5sb2dpYy50eXBlLmVsc2VfLFxuICAgICAgICAgICAgICAgIFR3aWcubG9naWMudHlwZS5lbmRmb3JcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleV92YWx1ZSA9IHRva2VuLm1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gdG9rZW4ubWF0Y2hbMl0sXG4gICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbmFsID0gdG9rZW4ubWF0Y2hbM10sXG4gICAgICAgICAgICAgICAgICAgIGt2X3NwbGl0ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIHRva2VuLmtleV92YXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRva2VuLnZhbHVlX3ZhciA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBpZiAoa2V5X3ZhbHVlLmluZGV4T2YoXCIsXCIpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAga3Zfc3BsaXQgPSBrZXlfdmFsdWUuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGt2X3NwbGl0Lmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4ua2V5X3ZhciA9IGt2X3NwbGl0WzBdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuLnZhbHVlX3ZhciA9IGt2X3NwbGl0WzFdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiSW52YWxpZCBleHByZXNzaW9uIGluIGZvciBsb29wOiBcIiArIGtleV92YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbi52YWx1ZV92YXIgPSBrZXlfdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gVmFsaWQgZXhwcmVzc2lvbnMgZm9yIGEgZm9yIGxvb3BcbiAgICAgICAgICAgICAgICAvLyAgIGZvciBpdGVtICAgICBpbiBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgLy8gICBmb3Iga2V5LGl0ZW0gaW4gZXhwcmVzc2lvblxuXG4gICAgICAgICAgICAgICAgLy8gQ29tcGlsZSB0aGUgZXhwcmVzc2lvbi5cbiAgICAgICAgICAgICAgICB0b2tlbi5leHByZXNzaW9uID0gVHdpZy5leHByZXNzaW9uLmNvbXBpbGUuYXBwbHkodGhpcywgW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogIFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgfV0pLnN0YWNrO1xuXG4gICAgICAgICAgICAgICAgLy8gQ29tcGlsZSB0aGUgY29uZGl0aW9uYWwgKGlmIGF2YWlsYWJsZSlcbiAgICAgICAgICAgICAgICBpZiAoY29uZGl0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4uY29uZGl0aW9uYWwgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5hcHBseSh0aGlzLCBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogIFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29uZGl0aW9uYWxcbiAgICAgICAgICAgICAgICAgICAgfV0pLnN0YWNrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY29udGludWVfY2hhaW4pIHtcbiAgICAgICAgICAgICAgICAvLyBQYXJzZSBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFR3aWcuZXhwcmVzc2lvbi5wYXJzZS5hcHBseSh0aGlzLCBbdG9rZW4uZXhwcmVzc2lvbiwgY29udGV4dF0pLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgbGVuLFxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IDAsXG4gICAgICAgICAgICAgICAgICAgIGtleXNldCxcbiAgICAgICAgICAgICAgICAgICAgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbmFsID0gdG9rZW4uY29uZGl0aW9uYWwsXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkTG9vcCA9IGZ1bmN0aW9uKGluZGV4LCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc0NvbmRpdGlvbmFsID0gY29uZGl0aW9uYWwgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4KzEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgwOiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZpbmRleDogaXNDb25kaXRpb25hbD91bmRlZmluZWQ6bGVuLWluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmluZGV4MDogaXNDb25kaXRpb25hbD91bmRlZmluZWQ6bGVuLWluZGV4LTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IChpbmRleCA9PT0gMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdDogaXNDb25kaXRpb25hbD91bmRlZmluZWQ6KGluZGV4ID09PSBsZW4tMSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoOiBpc0NvbmRpdGlvbmFsP3VuZGVmaW5lZDpsZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyBydW4gb25jZSBmb3IgZWFjaCBpdGVyYXRpb24gb2YgdGhlIGxvb3BcbiAgICAgICAgICAgICAgICAgICAgbG9vcCA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbm5lcl9jb250ZXh0ID0gVHdpZy5DaGlsZENvbnRleHQoY29udGV4dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyX2NvbnRleHRbdG9rZW4udmFsdWVfdmFyXSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4ua2V5X3Zhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyX2NvbnRleHRbdG9rZW4ua2V5X3Zhcl0gPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIExvb3Agb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICBpbm5lcl9jb250ZXh0Lmxvb3AgPSBidWlsZExvb3AoaW5kZXgsIGxlbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb25hbCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnBhcnNlLmFwcGx5KHRoYXQsIFtjb25kaXRpb25hbCwgaW5uZXJfY29udGV4dF0pKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKFR3aWcucGFyc2UuYXBwbHkodGhhdCwgW3Rva2VuLm91dHB1dCwgaW5uZXJfY29udGV4dF0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWxldGUgbG9vcC1yZWxhdGVkIHZhcmlhYmxlcyBmcm9tIHRoZSBjb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgaW5uZXJfY29udGV4dFsnbG9vcCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGlubmVyX2NvbnRleHRbdG9rZW4udmFsdWVfdmFyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBpbm5lcl9jb250ZXh0W3Rva2VuLmtleV92YXJdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNZXJnZSBpbiB2YWx1ZXMgdGhhdCBleGlzdCBpbiBjb250ZXh0IGJ1dCBoYXZlIGNoYW5nZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluIGlubmVyX2NvbnRleHQuXG4gICAgICAgICAgICAgICAgICAgICAgICBUd2lnLm1lcmdlKGNvbnRleHQsIGlubmVyX2NvbnRleHQsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVuID0gcmVzdWx0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5mb3JFYWNoKHJlc3VsdCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gaW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxvb3Aoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuX2tleXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5c2V0ID0gcmVzdWx0Ll9rZXlzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5c2V0ID0gT2JqZWN0LmtleXMocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXHRcdFx0XHRcdGxlbiA9IGtleXNldC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIFR3aWcuZm9yRWFjaChrZXlzZXQsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWdub3JlIHRoZSBfa2V5cyBwcm9wZXJ0eSwgaXQncyBpbnRlcm5hbCB0byB0d2lnLmpzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBcIl9rZXlzXCIpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbG9vcChrZXksICByZXN1bHRba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE9ubHkgYWxsb3cgZWxzZSBzdGF0ZW1lbnRzIGlmIG5vIG91dHB1dCB3YXMgZ2VuZXJhdGVkXG4gICAgICAgICAgICAgICAgY29udGludWVfY2hhaW4gPSAob3V0cHV0Lmxlbmd0aCA9PT0gMCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBjaGFpbjogY29udGludWVfY2hhaW4sXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dDogVHdpZy5vdXRwdXQuYXBwbHkodGhpcywgW291dHB1dF0pXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbmQgaWYgdHlwZSBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgZW5kaWYgJX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmVuZGZvcixcbiAgICAgICAgICAgIHJlZ2V4OiAvXmVuZGZvciQvLFxuICAgICAgICAgICAgbmV4dDogWyBdLFxuICAgICAgICAgICAgb3BlbjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTZXQgdHlwZSBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgc2V0IGtleSA9IGV4cHJlc3Npb24gJX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLnNldCxcbiAgICAgICAgICAgIHJlZ2V4OiAvXnNldFxccysoW2EtekEtWjAtOV8sXFxzXSspXFxzKj1cXHMqKFtcXHNcXFNdKykkLyxcbiAgICAgICAgICAgIG5leHQ6IFsgXSxcbiAgICAgICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gdG9rZW4ubWF0Y2hbMV0udHJpbSgpLFxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gdG9rZW4ubWF0Y2hbMl0sXG4gICAgICAgICAgICAgICAgICAgIC8vIENvbXBpbGUgdGhlIGV4cHJlc3Npb24uXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb25fc3RhY2sgID0gVHdpZy5leHByZXNzaW9uLmNvbXBpbGUuYXBwbHkodGhpcywgW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICBUd2lnLmV4cHJlc3Npb24udHlwZS5leHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgfV0pLnN0YWNrO1xuXG4gICAgICAgICAgICAgICAgdG9rZW4ua2V5ID0ga2V5O1xuICAgICAgICAgICAgICAgIHRva2VuLmV4cHJlc3Npb24gPSBleHByZXNzaW9uX3N0YWNrO1xuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjb250aW51ZV9jaGFpbikge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IFR3aWcuZXhwcmVzc2lvbi5wYXJzZS5hcHBseSh0aGlzLCBbdG9rZW4uZXhwcmVzc2lvbiwgY29udGV4dF0pLFxuICAgICAgICAgICAgICAgICAgICBrZXkgPSB0b2tlbi5rZXk7XG5cbiAgICAgICAgICAgICAgICBjb250ZXh0W2tleV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGNoYWluOiBjb250aW51ZV9jaGFpbixcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogU2V0IGNhcHR1cmUgdHlwZSBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgc2V0IGtleSAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuc2V0Y2FwdHVyZSxcbiAgICAgICAgICAgIHJlZ2V4OiAvXnNldFxccysoW2EtekEtWjAtOV8sXFxzXSspJC8sXG4gICAgICAgICAgICBuZXh0OiBbXG4gICAgICAgICAgICAgICAgVHdpZy5sb2dpYy50eXBlLmVuZHNldFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gdG9rZW4ubWF0Y2hbMV0udHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgdG9rZW4ua2V5ID0ga2V5O1xuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjb250aW51ZV9jaGFpbikge1xuXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gVHdpZy5wYXJzZS5hcHBseSh0aGlzLCBbdG9rZW4ub3V0cHV0LCBjb250ZXh0XSksXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IHRva2VuLmtleTtcblxuICAgICAgICAgICAgICAgIC8vIHNldCBvbiBib3RoIHRoZSBnbG9iYWwgYW5kIGxvY2FsIGNvbnRleHRcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGNvbnRleHRba2V5XSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW46IGNvbnRpbnVlX2NoYWluLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBjb250ZXh0XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbmQgc2V0IHR5cGUgYmxvY2sgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIGVuZHNldCAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuZW5kc2V0LFxuICAgICAgICAgICAgcmVnZXg6IC9eZW5kc2V0JC8sXG4gICAgICAgICAgICBuZXh0OiBbIF0sXG4gICAgICAgICAgICBvcGVuOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbHRlciBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgZmlsdGVyIHVwcGVyICV9IG9yIHslIGZpbHRlciBsb3dlcnxlc2NhcGUgJX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmZpbHRlcixcbiAgICAgICAgICAgIHJlZ2V4OiAvXmZpbHRlclxccysoLispJC8sXG4gICAgICAgICAgICBuZXh0OiBbXG4gICAgICAgICAgICAgICAgVHdpZy5sb2dpYy50eXBlLmVuZGZpbHRlclxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IFwifFwiICsgdG9rZW4ubWF0Y2hbMV0udHJpbSgpO1xuICAgICAgICAgICAgICAgIC8vIENvbXBpbGUgdGhlIGV4cHJlc3Npb24uXG4gICAgICAgICAgICAgICAgdG9rZW4uc3RhY2sgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5hcHBseSh0aGlzLCBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAgVHdpZy5leHByZXNzaW9uLnR5cGUuZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICB9XSkuc3RhY2s7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjaGFpbikge1xuICAgICAgICAgICAgICAgIHZhciB1bmZpbHRlcmVkID0gVHdpZy5wYXJzZS5hcHBseSh0aGlzLCBbdG9rZW4ub3V0cHV0LCBjb250ZXh0XSksXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFR3aWcuZXhwcmVzc2lvbi50eXBlLnN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB1bmZpbHRlcmVkXG4gICAgICAgICAgICAgICAgICAgIH1dLmNvbmNhdCh0b2tlbi5zdGFjayk7XG5cbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gVHdpZy5leHByZXNzaW9uLnBhcnNlLmFwcGx5KHRoaXMsIFtzdGFjaywgY29udGV4dF0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW46IGNoYWluLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6IG91dHB1dFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRW5kIGZpbHRlciBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgZW5kZmlsdGVyICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5lbmRmaWx0ZXIsXG4gICAgICAgICAgICByZWdleDogL15lbmRmaWx0ZXIkLyxcbiAgICAgICAgICAgIG5leHQ6IFsgXSxcbiAgICAgICAgICAgIG9wZW46IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQmxvY2sgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIGJsb2NrIHRpdGxlICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5ibG9jayxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmJsb2NrXFxzKyhbYS16QS1aMC05X10rKSQvLFxuICAgICAgICAgICAgbmV4dDogW1xuICAgICAgICAgICAgICAgIFR3aWcubG9naWMudHlwZS5lbmRibG9ja1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICB0b2tlbi5ibG9jayA9IHRva2VuLm1hdGNoWzFdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodG9rZW4sIGNvbnRleHQsIGNoYWluKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrX291dHB1dCA9IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIGlzSW1wb3J0ZWQgPSB0aGlzLmltcG9ydGVkQmxvY2tzLmluZGV4T2YodG9rZW4uYmxvY2spID4gLTEsXG4gICAgICAgICAgICAgICAgICAgIGhhc1BhcmVudCA9IHRoaXMuYmxvY2tzW3Rva2VuLmJsb2NrXSAmJiB0aGlzLmJsb2Nrc1t0b2tlbi5ibG9ja10uaW5kZXhPZihUd2lnLnBsYWNlaG9sZGVycy5wYXJlbnQpID4gLTE7XG5cbiAgICAgICAgICAgICAgICAvLyBEb24ndCBvdmVycmlkZSBwcmV2aW91cyBibG9ja3MgdW5sZXNzIHRoZXkncmUgaW1wb3J0ZWQgd2l0aCBcInVzZVwiXG4gICAgICAgICAgICAgICAgLy8gTG9vcHMgc2hvdWxkIGJlIGV4ZW1wdGVkIGFzIHdlbGwuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmxvY2tzW3Rva2VuLmJsb2NrXSA9PT0gdW5kZWZpbmVkIHx8IGlzSW1wb3J0ZWQgfHwgaGFzUGFyZW50IHx8IGNvbnRleHQubG9vcCkge1xuICAgICAgICAgICAgICAgICAgICBibG9ja19vdXRwdXQgPSBUd2lnLmV4cHJlc3Npb24ucGFyc2UuYXBwbHkodGhpcywgW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFR3aWcuZXhwcmVzc2lvbi50eXBlLnN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBUd2lnLnBhcnNlLmFwcGx5KHRoaXMsIFt0b2tlbi5vdXRwdXQsIGNvbnRleHRdKVxuICAgICAgICAgICAgICAgICAgICB9LCBjb250ZXh0XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzSW1wb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9uY2UgdGhlIGJsb2NrIGlzIG92ZXJyaWRkZW4sIHJlbW92ZSBpdCBmcm9tIHRoZSBsaXN0IG9mIGltcG9ydGVkIGJsb2Nrc1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbXBvcnRlZEJsb2Nrcy5zcGxpY2UodGhpcy5pbXBvcnRlZEJsb2Nrcy5pbmRleE9mKHRva2VuLmJsb2NrKSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzUGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJsb2Nrc1t0b2tlbi5ibG9ja10gPSBUd2lnLk1hcmt1cCh0aGlzLmJsb2Nrc1t0b2tlbi5ibG9ja10ucmVwbGFjZShUd2lnLnBsYWNlaG9sZGVycy5wYXJlbnQsIGJsb2NrX291dHB1dCkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ibG9ja3NbdG9rZW4uYmxvY2tdID0gYmxvY2tfb3V0cHV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYSBjaGlsZCBibG9jayBoYXMgYmVlbiBzZXQgZnJvbSBhIHRlbXBsYXRlIGV4dGVuZGluZyB0aGlzIG9uZS5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGlsZC5ibG9ja3NbdG9rZW4uYmxvY2tdKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMuY2hpbGQuYmxvY2tzW3Rva2VuLmJsb2NrXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSB0aGlzLmJsb2Nrc1t0b2tlbi5ibG9ja107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW46IGNoYWluLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6IG91dHB1dFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRW5kIGJsb2NrIGxvZ2ljIHRva2Vucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiAgRm9ybWF0OiB7JSBlbmRibG9jayAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuZW5kYmxvY2ssXG4gICAgICAgICAgICByZWdleDogL15lbmRibG9jayg/OlxccysoW2EtekEtWjAtOV9dKykpPyQvLFxuICAgICAgICAgICAgbmV4dDogWyBdLFxuICAgICAgICAgICAgb3BlbjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBCbG9jayBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgZXh0ZW5kcyBcInRlbXBsYXRlLnR3aWdcIiAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuZXh0ZW5kc18sXG4gICAgICAgICAgICByZWdleDogL15leHRlbmRzXFxzKyguKykkLyxcbiAgICAgICAgICAgIG5leHQ6IFsgXSxcbiAgICAgICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IHRva2VuLm1hdGNoWzFdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5zdGFjayAgID0gVHdpZy5leHByZXNzaW9uLmNvbXBpbGUuYXBwbHkodGhpcywgW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogIFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgfV0pLnN0YWNrO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodG9rZW4sIGNvbnRleHQsIGNoYWluKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVzb2x2ZSBmaWxlbmFtZVxuICAgICAgICAgICAgICAgIHZhciBmaWxlID0gVHdpZy5leHByZXNzaW9uLnBhcnNlLmFwcGx5KHRoaXMsIFt0b2tlbi5zdGFjaywgY29udGV4dF0pO1xuXG4gICAgICAgICAgICAgICAgLy8gU2V0IHBhcmVudCB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuZXh0ZW5kID0gZmlsZTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGNoYWluOiBjaGFpbixcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0OiAnJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQmxvY2sgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIHVzZSBcInRlbXBsYXRlLnR3aWdcIiAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUudXNlLFxuICAgICAgICAgICAgcmVnZXg6IC9edXNlXFxzKyguKykkLyxcbiAgICAgICAgICAgIG5leHQ6IFsgXSxcbiAgICAgICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IHRva2VuLm1hdGNoWzFdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5zdGFjayA9IFR3aWcuZXhwcmVzc2lvbi5jb21waWxlLmFwcGx5KHRoaXMsIFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICBUd2lnLmV4cHJlc3Npb24udHlwZS5leHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIH1dKS5zdGFjaztcblxuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjaGFpbikge1xuICAgICAgICAgICAgICAgIC8vIFJlc29sdmUgZmlsZW5hbWVcbiAgICAgICAgICAgICAgICB2YXIgZmlsZSA9IFR3aWcuZXhwcmVzc2lvbi5wYXJzZS5hcHBseSh0aGlzLCBbdG9rZW4uc3RhY2ssIGNvbnRleHRdKTtcblxuICAgICAgICAgICAgICAgIC8vIEltcG9ydCBibG9ja3NcbiAgICAgICAgICAgICAgICB0aGlzLmltcG9ydEJsb2NrcyhmaWxlKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGNoYWluOiBjaGFpbixcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0OiAnJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQmxvY2sgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIGluY2x1ZGVzIFwidGVtcGxhdGUudHdpZ1wiIFt3aXRoIHtzb21lOiAndmFsdWVzJ30gb25seV0gJX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmluY2x1ZGUsXG4gICAgICAgICAgICByZWdleDogL15pbmNsdWRlXFxzKyhpZ25vcmUgbWlzc2luZ1xccyspPyguKz8pXFxzKig/OndpdGhcXHMrKFtcXFNcXHNdKz8pKT9cXHMqKG9ubHkpPyQvLFxuICAgICAgICAgICAgbmV4dDogWyBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IHRva2VuLm1hdGNoLFxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTWlzc2luZyA9IG1hdGNoWzFdICE9PSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBtYXRjaFsyXS50cmltKCksXG4gICAgICAgICAgICAgICAgICAgIHdpdGhDb250ZXh0ID0gbWF0Y2hbM10sXG4gICAgICAgICAgICAgICAgICAgIG9ubHkgPSAoKG1hdGNoWzRdICE9PSB1bmRlZmluZWQpICYmIG1hdGNoWzRdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5vbmx5ID0gb25seTtcbiAgICAgICAgICAgICAgICB0b2tlbi5pbmNsdWRlTWlzc2luZyA9IGluY2x1ZGVNaXNzaW5nO1xuXG4gICAgICAgICAgICAgICAgdG9rZW4uc3RhY2sgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5hcHBseSh0aGlzLCBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAgVHdpZy5leHByZXNzaW9uLnR5cGUuZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICB9XSkuc3RhY2s7XG5cbiAgICAgICAgICAgICAgICBpZiAod2l0aENvbnRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbi53aXRoU3RhY2sgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5hcHBseSh0aGlzLCBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogIFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogd2l0aENvbnRleHQudHJpbSgpXG4gICAgICAgICAgICAgICAgICAgIH1dKS5zdGFjaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgICAgICAgICAvLyBSZXNvbHZlIGZpbGVuYW1lXG4gICAgICAgICAgICAgICAgdmFyIGlubmVyQ29udGV4dCA9IHt9LFxuICAgICAgICAgICAgICAgICAgICB3aXRoQ29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRva2VuLm9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJDb250ZXh0ID0gVHdpZy5DaGlsZENvbnRleHQoY29udGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLndpdGhTdGFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpdGhDb250ZXh0ID0gVHdpZy5leHByZXNzaW9uLnBhcnNlLmFwcGx5KHRoaXMsIFt0b2tlbi53aXRoU3RhY2ssIGNvbnRleHRdKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgaW4gd2l0aENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXRoQ29udGV4dC5oYXNPd25Qcm9wZXJ0eShpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbm5lckNvbnRleHRbaV0gPSB3aXRoQ29udGV4dFtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBmaWxlID0gVHdpZy5leHByZXNzaW9uLnBhcnNlLmFwcGx5KHRoaXMsIFt0b2tlbi5zdGFjaywgaW5uZXJDb250ZXh0XSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFR3aWcuVGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBmaWxlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEltcG9ydCBmaWxlXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gdGhpcy5pbXBvcnRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGNoYWluOiBjaGFpbixcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0OiB0ZW1wbGF0ZS5yZW5kZXIoaW5uZXJDb250ZXh0KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5zcGFjZWxlc3MsXG4gICAgICAgICAgICByZWdleDogL15zcGFjZWxlc3MkLyxcbiAgICAgICAgICAgIG5leHQ6IFtcbiAgICAgICAgICAgICAgICBUd2lnLmxvZ2ljLnR5cGUuZW5kc3BhY2VsZXNzXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcblxuICAgICAgICAgICAgLy8gUGFyc2UgdGhlIGh0bWwgYW5kIHJldHVybiBpdCB3aXRob3V0IGFueSBzcGFjZXMgYmV0d2VlbiB0YWdzXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjaGFpbikge1xuICAgICAgICAgICAgICAgIHZhciAvLyBQYXJzZSB0aGUgb3V0cHV0IHdpdGhvdXQgYW55IGZpbHRlclxuICAgICAgICAgICAgICAgICAgICB1bmZpbHRlcmVkID0gVHdpZy5wYXJzZS5hcHBseSh0aGlzLCBbdG9rZW4ub3V0cHV0LCBjb250ZXh0XSksXG4gICAgICAgICAgICAgICAgICAgIC8vIEEgcmVndWxhciBleHByZXNzaW9uIHRvIGZpbmQgY2xvc2luZyBhbmQgb3BlbmluZyB0YWdzIHdpdGggc3BhY2VzIGJldHdlZW4gdGhlbVxuICAgICAgICAgICAgICAgICAgICByQmV0d2VlblRhZ1NwYWNlcyA9IC8+XFxzKzwvZyxcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVwbGFjZSBhbGwgc3BhY2UgYmV0d2VlbiBjbG9zaW5nIGFuZCBvcGVuaW5nIGh0bWwgdGFnc1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSB1bmZpbHRlcmVkLnJlcGxhY2UockJldHdlZW5UYWdTcGFjZXMsJz48JykudHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW46IGNoYWluLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6IG91dHB1dFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gQWRkIHRoZSB7JSBlbmRzcGFjZWxlc3MgJX0gdG9rZW5cbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmVuZHNwYWNlbGVzcyxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmVuZHNwYWNlbGVzcyQvLFxuICAgICAgICAgICAgbmV4dDogWyBdLFxuICAgICAgICAgICAgb3BlbjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNYWNybyBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogRm9ybWF0OiB7JSBtYXJvIGlucHV0KG5hbWUsIHZhbHVlLCB0eXBlLCBzaXplKSAlfVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLm1hY3JvLFxuICAgICAgICAgICAgcmVnZXg6IC9ebWFjcm9cXHMrKFthLXpBLVowLTlfXSspXFxzKlxcKFxccyooKD86W2EtekEtWjAtOV9dKyg/OixcXHMqKT8pKilcXHMqXFwpJC8sXG4gICAgICAgICAgICBuZXh0OiBbXG4gICAgICAgICAgICAgICAgVHdpZy5sb2dpYy50eXBlLmVuZG1hY3JvXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHZhciBtYWNyb05hbWUgPSB0b2tlbi5tYXRjaFsxXSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycyA9IHRva2VuLm1hdGNoWzJdLnNwbGl0KC9bXFxzLF0rLyk7XG5cbiAgICAgICAgICAgICAgICAvL1RPRE86IENsZWFuIHVwIGR1cGxpY2F0ZSBjaGVja1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxwYXJhbWV0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajxwYXJhbWV0ZXJzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzW2ldID09PSBwYXJhbWV0ZXJzW2pdICYmIGkgIT09IGopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIkR1cGxpY2F0ZSBhcmd1bWVudHMgZm9yIHBhcmFtZXRlcjogXCIrIHBhcmFtZXRlcnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdG9rZW4ubWFjcm9OYW1lID0gbWFjcm9OYW1lO1xuICAgICAgICAgICAgICAgIHRva2VuLnBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzO1xuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjaGFpbikge1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhpcy5tYWNyb3NbdG9rZW4ubWFjcm9OYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIGdsb2JhbCBjb250ZXh0IGFuZCBvdGhlciBtYWNyb3NcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hY3JvQ29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmOiB0ZW1wbGF0ZS5tYWNyb3NcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgcGFyYW1ldGVycyBmcm9tIGNvbnRleHQgdG8gbWFjcm9Db250ZXh0XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTx0b2tlbi5wYXJhbWV0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IHRva2VuLnBhcmFtZXRlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgYXJndW1lbnRzW2ldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hY3JvQ29udGV4dFtwcm9wXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFjcm9Db250ZXh0W3Byb3BdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbmRlclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5wYXJzZS5hcHBseSh0ZW1wbGF0ZSwgW3Rva2VuLm91dHB1dCwgbWFjcm9Db250ZXh0XSlcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW46IGNoYWluLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6ICcnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEVuZCBtYWNybyBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogRm9ybWF0OiB7JSBlbmRtYWNybyAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmVuZG1hY3JvLFxuICAgICAgICAgICAgIHJlZ2V4OiAvXmVuZG1hY3JvJC8sXG4gICAgICAgICAgICAgbmV4dDogWyBdLFxuICAgICAgICAgICAgIG9wZW46IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAqIGltcG9ydCBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAqXG4gICAgICAgICAgICAqIEZvcm1hdDogeyUgaW1wb3J0IFwidGVtcGxhdGUudHdpZ1wiIGFzIGZvcm0gJX1cbiAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuaW1wb3J0XyxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmltcG9ydFxccysoLispXFxzK2FzXFxzKyhbYS16QS1aMC05X10rKSQvLFxuICAgICAgICAgICAgbmV4dDogWyBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHZhciBleHByZXNzaW9uID0gdG9rZW4ubWF0Y2hbMV0udHJpbSgpLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0TmFtZSA9IHRva2VuLm1hdGNoWzJdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgICAgICAgICB0b2tlbi5jb250ZXh0TmFtZSA9IGNvbnRleHROYW1lO1xuXG4gICAgICAgICAgICAgICAgdG9rZW4uc3RhY2sgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5hcHBseSh0aGlzLCBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5leHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIH1dKS5zdGFjaztcblxuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjaGFpbikge1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5leHByZXNzaW9uICE9PSBcIl9zZWxmXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGUgPSBUd2lnLmV4cHJlc3Npb24ucGFyc2UuYXBwbHkodGhpcywgW3Rva2VuLnN0YWNrLCBjb250ZXh0XSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMuaW1wb3J0RmlsZShmaWxlIHx8IHRva2VuLmV4cHJlc3Npb24pO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0W3Rva2VuLmNvbnRleHROYW1lXSA9IHRlbXBsYXRlLnJlbmRlcih7fSwge291dHB1dDogJ21hY3Jvcyd9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHRbdG9rZW4uY29udGV4dE5hbWVdID0gdGhpcy5tYWNyb3M7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW46IGNoYWluLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6ICcnXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAqIGZyb20gbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgKlxuICAgICAgICAgICAgKiBGb3JtYXQ6IHslIGZyb20gXCJ0ZW1wbGF0ZS50d2lnXCIgaW1wb3J0IGZ1bmMgYXMgZm9ybSAlfVxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5mcm9tLFxuICAgICAgICAgICAgcmVnZXg6IC9eZnJvbVxccysoLispXFxzK2ltcG9ydFxccysoW2EtekEtWjAtOV8sIF0rKSQvLFxuICAgICAgICAgICAgbmV4dDogWyBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHZhciBleHByZXNzaW9uID0gdG9rZW4ubWF0Y2hbMV0udHJpbSgpLFxuICAgICAgICAgICAgICAgICAgICBtYWNyb0V4cHJlc3Npb25zID0gdG9rZW4ubWF0Y2hbMl0udHJpbSgpLnNwbGl0KC9bICxdKy8pLFxuICAgICAgICAgICAgICAgICAgICBtYWNyb05hbWVzID0ge307XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bWFjcm9FeHByZXNzaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzID0gbWFjcm9FeHByZXNzaW9uc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaCBmdW5jdGlvbiBhcyB2YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICB2YXIgbWFjcm9NYXRjaCA9IHJlcy5tYXRjaCgvXihbYS16QS1aMC05X10rKVxccysoLispXFxzK2FzXFxzKyhbYS16QS1aMC05X10rKSQvKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hY3JvTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hY3JvTmFtZXNbbWFjcm9NYXRjaFsxXS50cmltKCldID0gbWFjcm9NYXRjaFsyXS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzLm1hdGNoKC9eKFthLXpBLVowLTlfXSspJC8pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYWNyb05hbWVzW3Jlc10gPSByZXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgaW1wb3J0XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcblxuICAgICAgICAgICAgICAgIHRva2VuLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgICAgICAgICAgIHRva2VuLm1hY3JvTmFtZXMgPSBtYWNyb05hbWVzO1xuXG4gICAgICAgICAgICAgICAgdG9rZW4uc3RhY2sgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5hcHBseSh0aGlzLCBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5leHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIH1dKS5zdGFjaztcblxuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjaGFpbikge1xuICAgICAgICAgICAgICAgIHZhciBtYWNyb3M7XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uZXhwcmVzc2lvbiAhPT0gXCJfc2VsZlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWxlID0gVHdpZy5leHByZXNzaW9uLnBhcnNlLmFwcGx5KHRoaXMsIFt0b2tlbi5zdGFjaywgY29udGV4dF0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLmltcG9ydEZpbGUoZmlsZSB8fCB0b2tlbi5leHByZXNzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgbWFjcm9zID0gdGVtcGxhdGUucmVuZGVyKHt9LCB7b3V0cHV0OiAnbWFjcm9zJ30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbWFjcm9zID0gdGhpcy5tYWNyb3M7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbWFjcm9OYW1lIGluIHRva2VuLm1hY3JvTmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hY3Jvcy5oYXNPd25Qcm9wZXJ0eShtYWNyb05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0W3Rva2VuLm1hY3JvTmFtZXNbbWFjcm9OYW1lXV0gPSBtYWNyb3NbbWFjcm9OYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGNoYWluOiBjaGFpbixcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0OiAnJ1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFRoZSBlbWJlZCB0YWcgY29tYmluZXMgdGhlIGJlaGF2aW91ciBvZiBpbmNsdWRlIGFuZCBleHRlbmRzLlxuICAgICAgICAgICAgICogSXQgYWxsb3dzIHlvdSB0byBpbmNsdWRlIGFub3RoZXIgdGVtcGxhdGUncyBjb250ZW50cywganVzdCBsaWtlIGluY2x1ZGUgZG9lcy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiAgRm9ybWF0OiB7JSBlbWJlZCBcInRlbXBsYXRlLnR3aWdcIiBbd2l0aCB7c29tZTogJ3ZhbHVlcyd9IG9ubHldICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5lbWJlZCxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmVtYmVkXFxzKyhpZ25vcmUgbWlzc2luZ1xccyspPyguKz8pXFxzKig/OndpdGhcXHMrKC4rPykpP1xccyoob25seSk/JC8sXG4gICAgICAgICAgICBuZXh0OiBbXG4gICAgICAgICAgICAgICAgVHdpZy5sb2dpYy50eXBlLmVuZGVtYmVkXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IHRva2VuLm1hdGNoLFxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTWlzc2luZyA9IG1hdGNoWzFdICE9PSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBtYXRjaFsyXS50cmltKCksXG4gICAgICAgICAgICAgICAgICAgIHdpdGhDb250ZXh0ID0gbWF0Y2hbM10sXG4gICAgICAgICAgICAgICAgICAgIG9ubHkgPSAoKG1hdGNoWzRdICE9PSB1bmRlZmluZWQpICYmIG1hdGNoWzRdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5vbmx5ID0gb25seTtcbiAgICAgICAgICAgICAgICB0b2tlbi5pbmNsdWRlTWlzc2luZyA9IGluY2x1ZGVNaXNzaW5nO1xuXG4gICAgICAgICAgICAgICAgdG9rZW4uc3RhY2sgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5hcHBseSh0aGlzLCBbe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAgVHdpZy5leHByZXNzaW9uLnR5cGUuZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICB9XSkuc3RhY2s7XG5cbiAgICAgICAgICAgICAgICBpZiAod2l0aENvbnRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbi53aXRoU3RhY2sgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5hcHBseSh0aGlzLCBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogIFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogd2l0aENvbnRleHQudHJpbSgpXG4gICAgICAgICAgICAgICAgICAgIH1dKS5zdGFjaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgICAgICAgICAvLyBSZXNvbHZlIGZpbGVuYW1lXG4gICAgICAgICAgICAgICAgdmFyIGlubmVyQ29udGV4dCA9IHt9LFxuICAgICAgICAgICAgICAgICAgICB3aXRoQ29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRva2VuLm9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpIGluIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZXh0Lmhhc093blByb3BlcnR5KGkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyQ29udGV4dFtpXSA9IGNvbnRleHRbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW4ud2l0aFN0YWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgd2l0aENvbnRleHQgPSBUd2lnLmV4cHJlc3Npb24ucGFyc2UuYXBwbHkodGhpcywgW3Rva2VuLndpdGhTdGFjaywgY29udGV4dF0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSBpbiB3aXRoQ29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpdGhDb250ZXh0Lmhhc093blByb3BlcnR5KGkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyQ29udGV4dFtpXSA9IHdpdGhDb250ZXh0W2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGZpbGUgPSBUd2lnLmV4cHJlc3Npb24ucGFyc2UuYXBwbHkodGhpcywgW3Rva2VuLnN0YWNrLCBpbm5lckNvbnRleHRdKTtcblxuICAgICAgICAgICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVHdpZy5UZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IGZpbGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW1wb3J0IGZpbGVcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgPSB0aGlzLmltcG9ydEZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcmVzZXQgcHJldmlvdXMgYmxvY2tzXG4gICAgICAgICAgICAgICAgdGhpcy5ibG9ja3MgPSB7fTtcblxuICAgICAgICAgICAgICAgIC8vIHBhcnNlIHRva2Vucy4gb3V0cHV0IHdpbGwgYmUgbm90IHVzZWRcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gVHdpZy5wYXJzZS5hcHBseSh0aGlzLCBbdG9rZW4ub3V0cHV0LCBpbm5lckNvbnRleHRdKTtcblxuICAgICAgICAgICAgICAgIC8vIHJlbmRlciB0ZW1wYWx0ZSB3aXRoIGJsb2NrcyBkZWZpbmVkIGluIGVtYmVkIGJsb2NrXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW46IGNoYWluLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6IHRlbXBsYXRlLnJlbmRlcihpbm5lckNvbnRleHQsIHsnYmxvY2tzJzp0aGlzLmJsb2Nrc30pXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLyogQWRkIHRoZSB7JSBlbmRlbWJlZCAlfSB0b2tlblxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmVuZGVtYmVkLFxuICAgICAgICAgICAgcmVnZXg6IC9eZW5kZW1iZWQkLyxcbiAgICAgICAgICAgIG5leHQ6IFsgXSxcbiAgICAgICAgICAgIG9wZW46IGZhbHNlXG4gICAgICAgIH1cblxuICAgIF07XG5cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdHJ5IGZvciBsb2dpYyBoYW5kbGVycy5cbiAgICAgKi9cbiAgICBUd2lnLmxvZ2ljLmhhbmRsZXIgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZSBhIG5ldyB0b2tlbiB0eXBlLCBhdmFpbGFibGUgYXQgVHdpZy5sb2dpYy50eXBlLnt0eXBlfVxuICAgICAqL1xuICAgIFR3aWcubG9naWMuZXh0ZW5kVHlwZSA9IGZ1bmN0aW9uICh0eXBlLCB2YWx1ZSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlIHx8IChcIlR3aWcubG9naWMudHlwZVwiICsgdHlwZSk7XG4gICAgICAgIFR3aWcubG9naWMudHlwZVt0eXBlXSA9IHZhbHVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeHRlbmQgdGhlIGxvZ2ljIHBhcnNpbmcgZnVuY3Rpb25hbGl0eSB3aXRoIGEgbmV3IHRva2VuIGRlZmluaXRpb24uXG4gICAgICpcbiAgICAgKiAvLyBEZWZpbmUgYSBuZXcgdGFnXG4gICAgICogVHdpZy5sb2dpYy5leHRlbmQoe1xuICAgICAqICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUue3R5cGV9LFxuICAgICAqICAgICAvLyBUaGUgcGF0dGVybiB0byBtYXRjaCBmb3IgdGhpcyB0b2tlblxuICAgICAqICAgICByZWdleDogLi4uLFxuICAgICAqICAgICAvLyBXaGF0IHRva2VuIHR5cGVzIGNhbiBmb2xsb3cgdGhpcyB0b2tlbiwgbGVhdmUgYmxhbmsgaWYgYW55LlxuICAgICAqICAgICBuZXh0OiBbIC4uLiBdXG4gICAgICogICAgIC8vIENyZWF0ZSBhbmQgcmV0dXJuIGNvbXBpbGVkIHZlcnNpb24gb2YgdGhlIHRva2VuXG4gICAgICogICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuKSB7IC4uLiB9XG4gICAgICogICAgIC8vIFBhcnNlIHRoZSBjb21waWxlZCB0b2tlbiB3aXRoIHRoZSBjb250ZXh0IHByb3ZpZGVkIGJ5IHRoZSByZW5kZXIgY2FsbFxuICAgICAqICAgICAvLyAgIGFuZCB3aGV0aGVyIHRoaXMgdG9rZW4gY2hhaW4gaXMgY29tcGxldGUuXG4gICAgICogICAgIHBhcnNlOiBmdW5jdGlvbih0b2tlbiwgY29udGV4dCwgY2hhaW4pIHsgLi4uIH1cbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZpbml0aW9uIFRoZSBuZXcgbG9naWMgZXhwcmVzc2lvbi5cbiAgICAgKi9cbiAgICBUd2lnLmxvZ2ljLmV4dGVuZCA9IGZ1bmN0aW9uIChkZWZpbml0aW9uKSB7XG5cbiAgICAgICAgaWYgKCFkZWZpbml0aW9uLnR5cGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiVW5hYmxlIHRvIGV4dGVuZCBsb2dpYyBkZWZpbml0aW9uLiBObyB0eXBlIHByb3ZpZGVkIGZvciBcIiArIGRlZmluaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChUd2lnLmxvZ2ljLnR5cGVbZGVmaW5pdGlvbi50eXBlXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJVbmFibGUgdG8gZXh0ZW5kIGxvZ2ljIGRlZmluaXRpb25zLiBUeXBlIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmluaXRpb24udHlwZSArIFwiIGlzIGFscmVhZHkgZGVmaW5lZC5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBUd2lnLmxvZ2ljLmV4dGVuZFR5cGUoZGVmaW5pdGlvbi50eXBlKTtcbiAgICAgICAgfVxuICAgICAgICBUd2lnLmxvZ2ljLmhhbmRsZXJbZGVmaW5pdGlvbi50eXBlXSA9IGRlZmluaXRpb247XG4gICAgfTtcblxuICAgIC8vIEV4dGVuZCB3aXRoIGJ1aWx0LWluIGV4cHJlc3Npb25zXG4gICAgd2hpbGUgKFR3aWcubG9naWMuZGVmaW5pdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBUd2lnLmxvZ2ljLmV4dGVuZChUd2lnLmxvZ2ljLmRlZmluaXRpb25zLnNoaWZ0KCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbXBpbGUgYSBsb2dpYyB0b2tlbiBpbnRvIGFuIG9iamVjdCByZWFkeSBmb3IgcGFyc2luZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByYXdfdG9rZW4gQW4gdW5jb21waWxlZCBsb2dpYyB0b2tlbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQSBjb21waWxlZCBsb2dpYyB0b2tlbiwgcmVhZHkgZm9yIHBhcnNpbmcuXG4gICAgICovXG4gICAgVHdpZy5sb2dpYy5jb21waWxlID0gZnVuY3Rpb24gKHJhd190b2tlbikge1xuICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IHJhd190b2tlbi52YWx1ZS50cmltKCksXG4gICAgICAgICAgICB0b2tlbiA9IFR3aWcubG9naWMudG9rZW5pemUuYXBwbHkodGhpcywgW2V4cHJlc3Npb25dKSxcbiAgICAgICAgICAgIHRva2VuX3RlbXBsYXRlID0gVHdpZy5sb2dpYy5oYW5kbGVyW3Rva2VuLnR5cGVdO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSB0b2tlbiBuZWVkcyBjb21waWxpbmdcbiAgICAgICAgaWYgKHRva2VuX3RlbXBsYXRlLmNvbXBpbGUpIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5fdGVtcGxhdGUuY29tcGlsZS5hcHBseSh0aGlzLCBbdG9rZW5dKTtcbiAgICAgICAgICAgIFR3aWcubG9nLnRyYWNlKFwiVHdpZy5sb2dpYy5jb21waWxlOiBcIiwgXCJDb21waWxlZCBsb2dpYyB0b2tlbiB0byBcIiwgdG9rZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUb2tlbml6ZSBsb2dpYyBleHByZXNzaW9ucy4gVGhpcyBmdW5jdGlvbiBtYXRjaGVzIHRva2VuIGV4cHJlc3Npb25zIGFnYWluc3QgcmVndWxhclxuICAgICAqIGV4cHJlc3Npb25zIHByb3ZpZGVkIGluIHRva2VuIGRlZmluaXRpb25zIHByb3ZpZGVkIHdpdGggVHdpZy5sb2dpYy5leHRlbmQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXhwcmVzc2lvbiB0aGUgbG9naWMgdG9rZW4gZXhwcmVzc2lvbiB0byB0b2tlbml6ZVxuICAgICAqICAgICAgICAgICAgICAgIChpLmUuIHdoYXQncyBiZXR3ZWVuIHslIGFuZCAlfSlcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG1hdGNoZWQgdG9rZW4gd2l0aCB0eXBlIHNldCB0byB0aGUgdG9rZW4gdHlwZSBhbmQgbWF0Y2ggdG8gdGhlIHJlZ2V4IG1hdGNoLlxuICAgICAqL1xuICAgIFR3aWcubG9naWMudG9rZW5pemUgPSBmdW5jdGlvbiAoZXhwcmVzc2lvbikge1xuICAgICAgICB2YXIgdG9rZW4gPSB7fSxcbiAgICAgICAgICAgIHRva2VuX3RlbXBsYXRlX3R5cGUgPSBudWxsLFxuICAgICAgICAgICAgdG9rZW5fdHlwZSA9IG51bGwsXG4gICAgICAgICAgICB0b2tlbl9yZWdleCA9IG51bGwsXG4gICAgICAgICAgICByZWdleF9hcnJheSA9IG51bGwsXG4gICAgICAgICAgICByZWdleCA9IG51bGwsXG4gICAgICAgICAgICBtYXRjaCA9IG51bGw7XG5cbiAgICAgICAgLy8gSWdub3JlIHdoaXRlc3BhY2UgYXJvdW5kIGV4cHJlc3Npb25zLlxuICAgICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi50cmltKCk7XG5cbiAgICAgICAgZm9yICh0b2tlbl90ZW1wbGF0ZV90eXBlIGluIFR3aWcubG9naWMuaGFuZGxlcikge1xuICAgICAgICAgICAgaWYgKFR3aWcubG9naWMuaGFuZGxlci5oYXNPd25Qcm9wZXJ0eSh0b2tlbl90ZW1wbGF0ZV90eXBlKSkge1xuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgdHlwZSBhbmQgcmVnZXggZm9yIHRoaXMgdGVtcGxhdGUgdHlwZVxuICAgICAgICAgICAgICAgIHRva2VuX3R5cGUgPSBUd2lnLmxvZ2ljLmhhbmRsZXJbdG9rZW5fdGVtcGxhdGVfdHlwZV0udHlwZTtcbiAgICAgICAgICAgICAgICB0b2tlbl9yZWdleCA9IFR3aWcubG9naWMuaGFuZGxlclt0b2tlbl90ZW1wbGF0ZV90eXBlXS5yZWdleDtcblxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBtdWx0aXBsZSByZWd1bGFyIGV4cHJlc3Npb25zIHBlciB0eXBlLlxuICAgICAgICAgICAgICAgIHJlZ2V4X2FycmF5ID0gW107XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuX3JlZ2V4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVnZXhfYXJyYXkgPSB0b2tlbl9yZWdleDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWdleF9hcnJheS5wdXNoKHRva2VuX3JlZ2V4KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayByZWd1bGFyIGV4cHJlc3Npb25zIGluIHRoZSBvcmRlciB0aGV5IHdlcmUgc3BlY2lmaWVkIGluIHRoZSBkZWZpbml0aW9uLlxuICAgICAgICAgICAgICAgIHdoaWxlIChyZWdleF9hcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlZ2V4ID0gcmVnZXhfYXJyYXkuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSByZWdleC5leGVjKGV4cHJlc3Npb24udHJpbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbi50eXBlICA9IHRva2VuX3R5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbi5tYXRjaCA9IG1hdGNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmxvZ2ljLnRva2VuaXplOiBcIiwgXCJNYXRjaGVkIGEgXCIsIHRva2VuX3R5cGUsIFwiIHJlZ3VsYXIgZXhwcmVzc2lvbiBvZiBcIiwgbWF0Y2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm8gcmVnZXggbWF0Y2hlc1xuICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIlVuYWJsZSB0byBwYXJzZSAnXCIgKyBleHByZXNzaW9uLnRyaW0oKSArIFwiJ1wiKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUGFyc2UgYSBsb2dpYyB0b2tlbiB3aXRoaW4gYSBnaXZlbiBjb250ZXh0LlxuICAgICAqXG4gICAgICogV2hhdCBhcmUgbG9naWMgY2hhaW5zP1xuICAgICAqICAgICAgTG9naWMgY2hhaW5zIHJlcHJlc2VudCBhIHNlcmllcyBvZiB0b2tlbnMgdGhhdCBhcmUgY29ubmVjdGVkLFxuICAgICAqICAgICAgICAgIGZvciBleGFtcGxlOlxuICAgICAqICAgICAgICAgIHslIGlmIC4uLiAlfSB7JSBlbHNlICV9IHslIGVuZGlmICV9XG4gICAgICpcbiAgICAgKiAgICAgIFRoZSBjaGFpbiBwYXJhbWV0ZXIgaXMgdXNlZCB0byBzaWduaWZ5IGlmIGEgY2hhaW4gaXMgb3BlbiBvZiBjbG9zZWQuXG4gICAgICogICAgICBvcGVuOlxuICAgICAqICAgICAgICAgIE1vcmUgdG9rZW5zIGluIHRoaXMgY2hhaW4gc2hvdWxkIGJlIHBhcnNlZC5cbiAgICAgKiAgICAgIGNsb3NlZDpcbiAgICAgKiAgICAgICAgICBUaGlzIHRva2VuIGNoYWluIGhhcyBjb21wbGV0ZWQgcGFyc2luZyBhbmQgYW55IGFkZGl0aW9uYWxcbiAgICAgKiAgICAgICAgICB0b2tlbnMgKGVsc2UsIGVsc2VpZiwgZXRjLi4uKSBzaG91bGQgYmUgaWdub3JlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlbiBUaGUgY29tcGlsZWQgdG9rZW4uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgVGhlIHJlbmRlciBjb250ZXh0LlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hhaW4gSXMgdGhpcyBhbiBvcGVuIGxvZ2ljIGNoYWluLiBJZiBmYWxzZSwgdGhhdCBtZWFucyBhXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICBjaGFpbiBpcyBjbG9zZWQgYW5kIG5vIGZ1cnRoZXIgY2FzZXMgc2hvdWxkIGJlIHBhcnNlZC5cbiAgICAgKi9cbiAgICBUd2lnLmxvZ2ljLnBhcnNlID0gZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjaGFpbikge1xuICAgICAgICB2YXIgb3V0cHV0ID0gJycsXG4gICAgICAgICAgICB0b2tlbl90ZW1wbGF0ZTtcblxuICAgICAgICBjb250ZXh0ID0gY29udGV4dCB8fCB7IH07XG5cbiAgICAgICAgVHdpZy5sb2cuZGVidWcoXCJUd2lnLmxvZ2ljLnBhcnNlOiBcIiwgXCJQYXJzaW5nIGxvZ2ljIHRva2VuIFwiLCB0b2tlbik7XG5cbiAgICAgICAgdG9rZW5fdGVtcGxhdGUgPSBUd2lnLmxvZ2ljLmhhbmRsZXJbdG9rZW4udHlwZV07XG5cbiAgICAgICAgaWYgKHRva2VuX3RlbXBsYXRlLnBhcnNlKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSB0b2tlbl90ZW1wbGF0ZS5wYXJzZS5hcHBseSh0aGlzLCBbdG9rZW4sIGNvbnRleHQsIGNoYWluXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFR3aWc7XG5cbn0pKFR3aWcgfHwgeyB9KTtcbi8vICAgICBUd2lnLmpzXG4vLyAgICAgQXZhaWxhYmxlIHVuZGVyIHRoZSBCU0QgMi1DbGF1c2UgTGljZW5zZVxuLy8gICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9qdXN0am9obi90d2lnLmpzXG5cbi8vICMjIHR3aWcuZXhwcmVzc2lvbi5qc1xuLy9cbi8vIFRoaXMgZmlsZSBoYW5kbGVzIHRva2VuaXppbmcsIGNvbXBpbGluZyBhbmQgcGFyc2luZyBleHByZXNzaW9ucy5cbnZhciBUd2lnID0gKGZ1bmN0aW9uIChUd2lnKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBOYW1lc3BhY2UgZm9yIGV4cHJlc3Npb24gaGFuZGxpbmcuXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uID0geyB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzZXJ2ZWQgd29yZCB0aGF0IGNhbid0IGJlIHVzZWQgYXMgdmFyaWFibGUgbmFtZXMuXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uLnJlc2VydmVkV29yZHMgPSBbXG4gICAgICAgIFwidHJ1ZVwiLCBcImZhbHNlXCIsIFwibnVsbFwiLCBcIlRSVUVcIiwgXCJGQUxTRVwiLCBcIk5VTExcIiwgXCJfY29udGV4dFwiXG4gICAgXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSB0eXBlIG9mIHRva2VucyB1c2VkIGluIGV4cHJlc3Npb25zLlxuICAgICAqL1xuICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlID0ge1xuICAgICAgICBjb21tYTogICAgICAnVHdpZy5leHByZXNzaW9uLnR5cGUuY29tbWEnLFxuICAgICAgICBvcGVyYXRvcjoge1xuICAgICAgICAgICAgdW5hcnk6ICAnVHdpZy5leHByZXNzaW9uLnR5cGUub3BlcmF0b3IudW5hcnknLFxuICAgICAgICAgICAgYmluYXJ5OiAnVHdpZy5leHByZXNzaW9uLnR5cGUub3BlcmF0b3IuYmluYXJ5J1xuICAgICAgICB9LFxuICAgICAgICBzdHJpbmc6ICAgICAnVHdpZy5leHByZXNzaW9uLnR5cGUuc3RyaW5nJyxcbiAgICAgICAgYm9vbDogICAgICAgJ1R3aWcuZXhwcmVzc2lvbi50eXBlLmJvb2wnLFxuICAgICAgICBhcnJheToge1xuICAgICAgICAgICAgc3RhcnQ6ICAnVHdpZy5leHByZXNzaW9uLnR5cGUuYXJyYXkuc3RhcnQnLFxuICAgICAgICAgICAgZW5kOiAgICAnVHdpZy5leHByZXNzaW9uLnR5cGUuYXJyYXkuZW5kJ1xuICAgICAgICB9LFxuICAgICAgICBvYmplY3Q6IHtcbiAgICAgICAgICAgIHN0YXJ0OiAgJ1R3aWcuZXhwcmVzc2lvbi50eXBlLm9iamVjdC5zdGFydCcsXG4gICAgICAgICAgICBlbmQ6ICAgICdUd2lnLmV4cHJlc3Npb24udHlwZS5vYmplY3QuZW5kJ1xuICAgICAgICB9LFxuICAgICAgICBwYXJhbWV0ZXI6IHtcbiAgICAgICAgICAgIHN0YXJ0OiAgJ1R3aWcuZXhwcmVzc2lvbi50eXBlLnBhcmFtZXRlci5zdGFydCcsXG4gICAgICAgICAgICBlbmQ6ICAgICdUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuZW5kJ1xuICAgICAgICB9LFxuICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgIHBlcmlvZDogICAnVHdpZy5leHByZXNzaW9uLnR5cGUua2V5LnBlcmlvZCcsXG4gICAgICAgICAgICBicmFja2V0czogJ1R3aWcuZXhwcmVzc2lvbi50eXBlLmtleS5icmFja2V0cydcbiAgICAgICAgfSxcbiAgICAgICAgZmlsdGVyOiAgICAgJ1R3aWcuZXhwcmVzc2lvbi50eXBlLmZpbHRlcicsXG4gICAgICAgIF9mdW5jdGlvbjogICdUd2lnLmV4cHJlc3Npb24udHlwZS5fZnVuY3Rpb24nLFxuICAgICAgICB2YXJpYWJsZTogICAnVHdpZy5leHByZXNzaW9uLnR5cGUudmFyaWFibGUnLFxuICAgICAgICBudW1iZXI6ICAgICAnVHdpZy5leHByZXNzaW9uLnR5cGUubnVtYmVyJyxcbiAgICAgICAgX251bGw6ICAgICAnVHdpZy5leHByZXNzaW9uLnR5cGUubnVsbCcsXG4gICAgICAgIGNvbnRleHQ6ICAgICdUd2lnLmV4cHJlc3Npb24udHlwZS5jb250ZXh0JyxcbiAgICAgICAgdGVzdDogICAgICAgJ1R3aWcuZXhwcmVzc2lvbi50eXBlLnRlc3QnXG4gICAgfTtcblxuICAgIFR3aWcuZXhwcmVzc2lvbi5zZXQgPSB7XG4gICAgICAgIC8vIFdoYXQgY2FuIGZvbGxvdyBhbiBleHByZXNzaW9uIChpbiBnZW5lcmFsKVxuICAgICAgICBvcGVyYXRpb25zOiBbXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5maWx0ZXIsXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5vcGVyYXRvci51bmFyeSxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLm9wZXJhdG9yLmJpbmFyeSxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLmFycmF5LmVuZCxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLm9iamVjdC5lbmQsXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuZW5kLFxuICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUuY29tbWEsXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS50ZXN0XG4gICAgICAgIF0sXG4gICAgICAgIGV4cHJlc3Npb25zOiBbXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5fZnVuY3Rpb24sXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5ib29sLFxuICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUuc3RyaW5nLFxuICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUudmFyaWFibGUsXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5udW1iZXIsXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5fbnVsbCxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLmNvbnRleHQsXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuc3RhcnQsXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5hcnJheS5zdGFydCxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLm9iamVjdC5zdGFydFxuICAgICAgICBdXG4gICAgfTtcblxuICAgIC8vIE1vc3QgZXhwcmVzc2lvbnMgYWxsb3cgYSAnLicgb3IgJ1snIGFmdGVyIHRoZW0sIHNvIHdlIHByb3ZpZGUgYSBjb252ZW5pZW5jZSBzZXRcbiAgICBUd2lnLmV4cHJlc3Npb24uc2V0Lm9wZXJhdGlvbnNfZXh0ZW5kZWQgPSBUd2lnLmV4cHJlc3Npb24uc2V0Lm9wZXJhdGlvbnMuY29uY2F0KFtcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUua2V5LnBlcmlvZCxcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUua2V5LmJyYWNrZXRzXSk7XG5cbiAgICAvLyBTb21lIGNvbW1vbmx5IHVzZWQgY29tcGlsZSBhbmQgcGFyc2UgZnVuY3Rpb25zLlxuICAgIFR3aWcuZXhwcmVzc2lvbi5mbiA9IHtcbiAgICAgICAgY29tcGlsZToge1xuICAgICAgICAgICAgcHVzaDogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHVzaF9ib3RoOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIG91dHB1dCkge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcGFyc2U6IHtcbiAgICAgICAgICAgIHB1c2g6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHB1c2hfdmFsdWU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9rZW4udmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIFRoZSByZWd1bGFyIGV4cHJlc3Npb25zIGFuZCBjb21waWxlL3BhcnNlIGxvZ2ljIHVzZWQgdG8gbWF0Y2ggdG9rZW5zIGluIGV4cHJlc3Npb25zLlxuICAgIC8vXG4gICAgLy8gUHJvcGVydGllczpcbiAgICAvL1xuICAgIC8vICAgICAgdHlwZTogIFRoZSB0eXBlIG9mIGV4cHJlc3Npb24gdGhpcyBtYXRjaGVzXG4gICAgLy9cbiAgICAvLyAgICAgIHJlZ2V4OiBPbmUgb3IgbW9yZSByZWd1bGFyIGV4cHJlc3Npb25zIHRoYXQgbWF0Y2hlIHRoZSBmb3JtYXQgb2YgdGhlIHRva2VuLlxuICAgIC8vXG4gICAgLy8gICAgICBuZXh0OiAgVmFsaWQgdG9rZW5zIHRoYXQgY2FuIG9jY3VyIG5leHQgaW4gdGhlIGV4cHJlc3Npb24uXG4gICAgLy9cbiAgICAvLyBGdW5jdGlvbnM6XG4gICAgLy9cbiAgICAvLyAgICAgIGNvbXBpbGU6IEEgZnVuY3Rpb24gdGhhdCBjb21waWxlcyB0aGUgcmF3IHJlZ3VsYXIgZXhwcmVzc2lvbiBtYXRjaCBpbnRvIGEgdG9rZW4uXG4gICAgLy9cbiAgICAvLyAgICAgIHBhcnNlOiAgIEEgZnVuY3Rpb24gdGhhdCBwYXJzZXMgdGhlIGNvbXBpbGVkIHRva2VuIGludG8gb3V0cHV0LlxuICAgIC8vXG4gICAgVHdpZy5leHByZXNzaW9uLmRlZmluaXRpb25zID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS50ZXN0LFxuICAgICAgICAgICAgcmVnZXg6IC9eaXNcXHMrKG5vdCk/XFxzKihbYS16QS1aX11bYS16QS1aMC05X10qKS8sXG4gICAgICAgICAgICBuZXh0OiBUd2lnLmV4cHJlc3Npb24uc2V0Lm9wZXJhdGlvbnMuY29uY2F0KFtUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuc3RhcnRdKSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdG9rZW4uZmlsdGVyICAgPSB0b2tlbi5tYXRjaFsyXTtcbiAgICAgICAgICAgICAgICB0b2tlbi5tb2RpZmllciA9IHRva2VuLm1hdGNoWzFdO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4udmFsdWU7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBzdGFjay5wb3AoKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gdG9rZW4ucGFyYW1zICYmIFR3aWcuZXhwcmVzc2lvbi5wYXJzZS5hcHBseSh0aGlzLCBbdG9rZW4ucGFyYW1zLCBjb250ZXh0XSksXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IFR3aWcudGVzdCh0b2tlbi5maWx0ZXIsIHZhbHVlLCBwYXJhbXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLm1vZGlmaWVyID09ICdub3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goIXJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuY29tbWEsXG4gICAgICAgICAgICAvLyBNYXRjaCBhIGNvbW1hXG4gICAgICAgICAgICByZWdleDogL14sLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQuZXhwcmVzc2lvbnMuY29uY2F0KFtUd2lnLmV4cHJlc3Npb24udHlwZS5hcnJheS5lbmQsIFR3aWcuZXhwcmVzc2lvbi50eXBlLm9iamVjdC5lbmRdKSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBzdGFjay5sZW5ndGggLSAxLFxuICAgICAgICAgICAgICAgICAgICBzdGFja190b2tlbjtcblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4udmFsdWU7XG5cbiAgICAgICAgICAgICAgICAvLyBwb3AgdG9rZW5zIG9mZiB0aGUgc3RhY2sgdW50aWwgdGhlIHN0YXJ0IG9mIHRoZSBvYmplY3RcbiAgICAgICAgICAgICAgICBmb3IoO2kgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrX3Rva2VuID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFja190b2tlbi50eXBlID09PSBUd2lnLmV4cHJlc3Npb24udHlwZS5vYmplY3Quc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBzdGFja190b2tlbi50eXBlID09PSBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBzdGFja190b2tlbi50eXBlID09PSBUd2lnLmV4cHJlc3Npb24udHlwZS5hcnJheS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChzdGFja190b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzdGFja190b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUub3BlcmF0b3IuYmluYXJ5LFxuICAgICAgICAgICAgLy8gTWF0Y2ggYW55IG9mICssICosIC8sIC0sICUsIH4sIDwsIDw9LCA+LCA+PSwgIT0sID09LCAqKiwgPywgOiwgYW5kLCBvciwgbm90XG4gICAgICAgICAgICByZWdleDogLyheW1xcK1xcLX4lXFw/XFw6XXxeWyE9XT09P3xeWyE8Pl09P3xeXFwqXFwqP3xeXFwvXFwvP3xeYW5kXFxzK3xeb3JcXHMrfF5pblxccyt8Xm5vdCBpblxccyt8XlxcLlxcLikvLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnNldC5leHByZXNzaW9ucy5jb25jYXQoW1R3aWcuZXhwcmVzc2lvbi50eXBlLm9wZXJhdG9yLnVuYXJ5XSksXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIG91dHB1dCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcblxuICAgICAgICAgICAgICAgIHRva2VuLnZhbHVlID0gdG9rZW4udmFsdWUudHJpbSgpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRva2VuLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBvcGVyYXRvciA9IFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5sb29rdXAodmFsdWUsIHRva2VuKTtcblxuICAgICAgICAgICAgICAgIFR3aWcubG9nLnRyYWNlKFwiVHdpZy5leHByZXNzaW9uLmNvbXBpbGU6IFwiLCBcIk9wZXJhdG9yOiBcIiwgb3BlcmF0b3IsIFwiIGZyb20gXCIsIHZhbHVlKTtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgIChzdGFja1tzdGFjay5sZW5ndGgtMV0udHlwZSA9PSBUd2lnLmV4cHJlc3Npb24udHlwZS5vcGVyYXRvci51bmFyeSB8fCBzdGFja1tzdGFjay5sZW5ndGgtMV0udHlwZSA9PSBUd2lnLmV4cHJlc3Npb24udHlwZS5vcGVyYXRvci5iaW5hcnkpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob3BlcmF0b3IuYXNzb2NpYXRpdml0eSA9PT0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxlZnRUb1JpZ2h0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvci5wcmVjaWRlbmNlICAgID49IHN0YWNrW3N0YWNrLmxlbmd0aC0xXS5wcmVjaWRlbmNlKSB8fFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvcGVyYXRvci5hc3NvY2lhdGl2aXR5ID09PSBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IucmlnaHRUb0xlZnQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yLnByZWNpZGVuY2UgICAgPiAgc3RhY2tbc3RhY2subGVuZ3RoLTFdLnByZWNpZGVuY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0ZW1wKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IFwiOlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgYSB0ZXJuYXJ5IG9yIG9iamVjdCBrZXkgYmVpbmcgc2V0XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFja1tzdGFjay5sZW5ndGggLSAxXSAmJiBzdGFja1tzdGFjay5sZW5ndGgtMV0udmFsdWUgPT09IFwiP1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb250aW51ZSBhcyBub3JtYWwgZm9yIGEgdGVybmFyeVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBub3QgYSB0ZXJuYXJ5IHNvIHdlIHB1c2ggdGhlIHRva2VuIHRvIHRoZSBvdXRwdXQgd2hlcmUgaXQgY2FuIGJlIGhhbmRsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgd2hlbiB0aGUgYXNzb2NhdGVkIG9iamVjdCBpcyBjbG9zZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5X3Rva2VuID0gb3V0cHV0LnBvcCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5X3Rva2VuLnR5cGUgPT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLnN0cmluZyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXlfdG9rZW4udHlwZSA9PT0gVHdpZy5leHByZXNzaW9uLnR5cGUudmFyaWFibGUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5X3Rva2VuLnR5cGUgPT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLm51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuLmtleSA9IGtleV90b2tlbi52YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIlVuZXhwZWN0ZWQgdmFsdWUgYmVmb3JlICc6JyBvZiBcIiArIGtleV90b2tlbi50eXBlICsgXCIgPSBcIiArIGtleV90b2tlbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gob3BlcmF0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLmtleSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBoYW5kbGUgdGVybmFyeSAnOicgb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLnBhcnNlKHRva2VuLnZhbHVlLCBzdGFjayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5vcGVyYXRvci51bmFyeSxcbiAgICAgICAgICAgIC8vIE1hdGNoIGFueSBvZiBub3RcbiAgICAgICAgICAgIHJlZ2V4OiAvKF5ub3RcXHMrKS8sXG4gICAgICAgICAgICBuZXh0OiBUd2lnLmV4cHJlc3Npb24uc2V0LmV4cHJlc3Npb25zLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi52YWx1ZSA9IHRva2VuLnZhbHVlLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0b2tlbi52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3IgPSBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IubG9va3VwKHZhbHVlLCB0b2tlbik7XG5cbiAgICAgICAgICAgICAgICBUd2lnLmxvZy50cmFjZShcIlR3aWcuZXhwcmVzc2lvbi5jb21waWxlOiBcIiwgXCJPcGVyYXRvcjogXCIsIG9wZXJhdG9yLCBcIiBmcm9tIFwiLCB2YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAoc3RhY2tbc3RhY2subGVuZ3RoLTFdLnR5cGUgPT0gVHdpZy5leHByZXNzaW9uLnR5cGUub3BlcmF0b3IudW5hcnkgfHwgc3RhY2tbc3RhY2subGVuZ3RoLTFdLnR5cGUgPT0gVHdpZy5leHByZXNzaW9uLnR5cGUub3BlcmF0b3IuYmluYXJ5KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9wZXJhdG9yLmFzc29jaWF0aXZpdHkgPT09IFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5sZWZ0VG9SaWdodCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3IucHJlY2lkZW5jZSAgICA+PSBzdGFja1tzdGFjay5sZW5ndGgtMV0ucHJlY2lkZW5jZSkgfHxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob3BlcmF0b3IuYXNzb2NpYXRpdml0eSA9PT0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLnJpZ2h0VG9MZWZ0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvci5wcmVjaWRlbmNlICAgID4gIHN0YWNrW3N0YWNrLmxlbmd0aC0xXS5wcmVjaWRlbmNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godGVtcCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChvcGVyYXRvcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5wYXJzZSh0b2tlbi52YWx1ZSwgc3RhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1hdGNoIGEgc3RyaW5nLiBUaGlzIGlzIGFueXRoaW5nIGJldHdlZW4gYSBwYWlyIG9mIHNpbmdsZSBvciBkb3VibGUgcXVvdGVzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5zdHJpbmcsXG4gICAgICAgICAgICAvLyBTZWU6IGh0dHA6Ly9ibG9nLnN0ZXZlbmxldml0aGFuLmNvbS9hcmNoaXZlcy9tYXRjaC1xdW90ZWQtc3RyaW5nXG4gICAgICAgICAgICByZWdleDogL14oW1wiJ10pKD86KD89KFxcXFw/KSlcXDJbXFxzXFxTXSkqP1xcMS8sXG4gICAgICAgICAgICBuZXh0OiBUd2lnLmV4cHJlc3Npb24uc2V0Lm9wZXJhdGlvbnMsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIG91dHB1dCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRva2VuLnZhbHVlO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaFxuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBxdW90ZXMgZnJvbSB0aGUgc3RyaW5nXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN1YnN0cmluZygwLCAxKSA9PT0gJ1wiJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoJ1xcXFxcIicsICdcIicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShcIlxcXFwnXCIsIFwiJ1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdG9rZW4udmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMSwgdmFsdWUubGVuZ3RoLTEpLnJlcGxhY2UoIC9cXFxcbi9nLCBcIlxcblwiICkucmVwbGFjZSggL1xcXFxyL2csIFwiXFxyXCIgKTtcbiAgICAgICAgICAgICAgICBUd2lnLmxvZy50cmFjZShcIlR3aWcuZXhwcmVzc2lvbi5jb21waWxlOiBcIiwgXCJTdHJpbmcgdmFsdWU6IFwiLCB0b2tlbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBUd2lnLmV4cHJlc3Npb24uZm4ucGFyc2UucHVzaF92YWx1ZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1hdGNoIGEgcGFyYW1ldGVyIHNldCBzdGFydC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUucGFyYW1ldGVyLnN0YXJ0LFxuICAgICAgICAgICAgcmVnZXg6IC9eXFwoLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQuZXhwcmVzc2lvbnMuY29uY2F0KFtUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuZW5kXSksXG4gICAgICAgICAgICBjb21waWxlOiBUd2lnLmV4cHJlc3Npb24uZm4uY29tcGlsZS5wdXNoX2JvdGgsXG4gICAgICAgICAgICBwYXJzZTogVHdpZy5leHByZXNzaW9uLmZuLnBhcnNlLnB1c2hcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNYXRjaCBhIHBhcmFtZXRlciBzZXQgZW5kLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuZW5kLFxuICAgICAgICAgICAgcmVnZXg6IC9eXFwpLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9uc19leHRlbmRlZCxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YWNrX3Rva2VuLFxuICAgICAgICAgICAgICAgICAgICBlbmRfdG9rZW4gPSB0b2tlbjtcblxuICAgICAgICAgICAgICAgIHN0YWNrX3Rva2VuID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgd2hpbGUoc3RhY2subGVuZ3RoID4gMCAmJiBzdGFja190b2tlbi50eXBlICE9IFR3aWcuZXhwcmVzc2lvbi50eXBlLnBhcmFtZXRlci5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzdGFja190b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrX3Rva2VuID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gTW92ZSBjb250ZW50cyBvZiBwYXJlbnMgaW50byBwcmVjZWRpbmcgZmlsdGVyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtX3N0YWNrID0gW107XG4gICAgICAgICAgICAgICAgd2hpbGUodG9rZW4udHlwZSAhPT0gVHdpZy5leHByZXNzaW9uLnR5cGUucGFyYW1ldGVyLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCB0b2tlbiB0byBhcmd1bWVudHMgc3RhY2tcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1fc3RhY2sudW5zaGlmdCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gb3V0cHV0LnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYXJhbV9zdGFjay51bnNoaWZ0KHRva2VuKTtcblxuICAgICAgICAgICAgICAgIHZhciBpc19leHByZXNzaW9uID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHRva2VuIHByZWNlZGluZyB0aGUgcGFyYW1ldGVyc1xuICAgICAgICAgICAgICAgIHRva2VuID0gb3V0cHV0W291dHB1dC5sZW5ndGgtMV07XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICAgICAgICAodG9rZW4udHlwZSAhPT0gVHdpZy5leHByZXNzaW9uLnR5cGUuX2Z1bmN0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgIT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLmZpbHRlciAmJlxuICAgICAgICAgICAgICAgICAgICB0b2tlbi50eXBlICE9PSBUd2lnLmV4cHJlc3Npb24udHlwZS50ZXN0ICYmXG4gICAgICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgIT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLmtleS5icmFja2V0cyAmJlxuICAgICAgICAgICAgICAgICAgICB0b2tlbi50eXBlICE9PSBUd2lnLmV4cHJlc3Npb24udHlwZS5rZXkucGVyaW9kKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGVuZF90b2tlbi5leHByZXNzaW9uID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgc3RhcnQgYW5kIGVuZCB0b2tlbiBmcm9tIHN0YWNrXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtX3N0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBwYXJhbV9zdGFjay5zaGlmdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGVuZF90b2tlbi5wYXJhbXMgPSBwYXJhbV9zdGFjaztcblxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChlbmRfdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZW5kX3Rva2VuLmV4cHJlc3Npb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4ucGFyYW1zID0gcGFyYW1fc3RhY2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3X2FycmF5ID0gW10sXG4gICAgICAgICAgICAgICAgICAgIGFycmF5X2VuZGVkID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gVHdpZy5leHByZXNzaW9uLnBhcnNlLmFwcGx5KHRoaXMsIFt0b2tlbi5wYXJhbXMsIGNvbnRleHRdKVxuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHZhbHVlKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQdXNoIHZhbHVlcyBpbnRvIHRoZSBhcnJheSB1bnRpbCB0aGUgc3RhcnQgb2YgdGhlIGFycmF5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUudHlwZSAmJiB2YWx1ZS50eXBlID09IFR3aWcuZXhwcmVzc2lvbi50eXBlLnBhcmFtZXRlci5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5X2VuZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld19hcnJheS51bnNoaWZ0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghYXJyYXlfZW5kZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiRXhwZWN0ZWQgZW5kIG9mIHBhcmFtZXRlciBzZXQuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXdfYXJyYXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNYXRjaCBhbiBhcnJheSBzdGFydC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuYXJyYXkuc3RhcnQsXG4gICAgICAgICAgICByZWdleDogL15cXFsvLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnNldC5leHByZXNzaW9ucy5jb25jYXQoW1R3aWcuZXhwcmVzc2lvbi50eXBlLmFycmF5LmVuZF0pLFxuICAgICAgICAgICAgY29tcGlsZTogVHdpZy5leHByZXNzaW9uLmZuLmNvbXBpbGUucHVzaF9ib3RoLFxuICAgICAgICAgICAgcGFyc2U6IFR3aWcuZXhwcmVzc2lvbi5mbi5wYXJzZS5wdXNoXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTWF0Y2ggYW4gYXJyYXkgZW5kLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5hcnJheS5lbmQsXG4gICAgICAgICAgICByZWdleDogL15cXF0vLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnNldC5vcGVyYXRpb25zX2V4dGVuZGVkLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IHN0YWNrLmxlbmd0aCAtIDEsXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrX3Rva2VuO1xuICAgICAgICAgICAgICAgIC8vIHBvcCB0b2tlbnMgb2ZmIHRoZSBzdGFjayB1bnRpbCB0aGUgc3RhcnQgb2YgdGhlIG9iamVjdFxuICAgICAgICAgICAgICAgIGZvcig7aSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tfdG9rZW4gPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YWNrX3Rva2VuLnR5cGUgPT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLmFycmF5LnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzdGFja190b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld19hcnJheSA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBhcnJheV9lbmRlZCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBQdXNoIHZhbHVlcyBpbnRvIHRoZSBhcnJheSB1bnRpbCB0aGUgc3RhcnQgb2YgdGhlIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS50eXBlICYmIHZhbHVlLnR5cGUgPT0gVHdpZy5leHByZXNzaW9uLnR5cGUuYXJyYXkuc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5X2VuZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld19hcnJheS51bnNoaWZ0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFhcnJheV9lbmRlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIkV4cGVjdGVkIGVuZCBvZiBhcnJheS5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXdfYXJyYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBUb2tlbiB0aGF0IHJlcHJlc2VudHMgdGhlIHN0YXJ0IG9mIGEgaGFzaCBtYXAgJ30nXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEhhc2ggbWFwcyB0YWtlIHRoZSBmb3JtOlxuICAgICAgICAvLyAgICB7IFwia2V5XCI6ICd2YWx1ZScsIFwiYW5vdGhlcl9rZXlcIjogaXRlbSB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vIEtleXMgbXVzdCBiZSBxdW90ZWQgKGVpdGhlciBzaW5nbGUgb3IgZG91YmxlKSBhbmQgdmFsdWVzIGNhbiBiZSBhbnkgZXhwcmVzc2lvbi5cbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUub2JqZWN0LnN0YXJ0LFxuICAgICAgICAgICAgcmVnZXg6IC9eXFx7LyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQuZXhwcmVzc2lvbnMuY29uY2F0KFtUd2lnLmV4cHJlc3Npb24udHlwZS5vYmplY3QuZW5kXSksXG4gICAgICAgICAgICBjb21waWxlOiBUd2lnLmV4cHJlc3Npb24uZm4uY29tcGlsZS5wdXNoX2JvdGgsXG4gICAgICAgICAgICBwYXJzZTogVHdpZy5leHByZXNzaW9uLmZuLnBhcnNlLnB1c2hcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUb2tlbiB0aGF0IHJlcHJlc2VudHMgdGhlIGVuZCBvZiBhIEhhc2ggTWFwICd9J1xuICAgICAgICAvL1xuICAgICAgICAvLyBUaGlzIGlzIHdoZXJlIHRoZSBsb2dpYyBmb3IgYnVpbGRpbmcgdGhlIGludGVybmFsXG4gICAgICAgIC8vIHJlcHJlc2VudGF0aW9uIG9mIGEgaGFzaCBtYXAgaXMgZGVmaW5lZC5cbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUub2JqZWN0LmVuZCxcbiAgICAgICAgICAgIHJlZ2V4OiAvXlxcfS8sXG4gICAgICAgICAgICBuZXh0OiBUd2lnLmV4cHJlc3Npb24uc2V0Lm9wZXJhdGlvbnNfZXh0ZW5kZWQsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIG91dHB1dCkge1xuICAgICAgICAgICAgICAgIHZhciBpID0gc3RhY2subGVuZ3RoLTEsXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrX3Rva2VuO1xuXG4gICAgICAgICAgICAgICAgLy8gcG9wIHRva2VucyBvZmYgdGhlIHN0YWNrIHVudGlsIHRoZSBzdGFydCBvZiB0aGUgb2JqZWN0XG4gICAgICAgICAgICAgICAgZm9yKDtpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFja190b2tlbiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhY2tfdG9rZW4gJiYgc3RhY2tfdG9rZW4udHlwZSA9PT0gVHdpZy5leHByZXNzaW9uLnR5cGUub2JqZWN0LnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzdGFja190b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24oZW5kX3Rva2VuLCBzdGFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdfb2JqZWN0ID0ge30sXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdF9lbmRlZCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHRva2VuX2tleSA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGhhc192YWx1ZSA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBQdXNoIHZhbHVlcyBpbnRvIHRoZSBhcnJheSB1bnRpbCB0aGUgc3RhcnQgb2YgdGhlIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4gJiYgdG9rZW4udHlwZSAmJiB0b2tlbi50eXBlID09PSBUd2lnLmV4cHJlc3Npb24udHlwZS5vYmplY3Quc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdF9lbmRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4gJiYgdG9rZW4udHlwZSAmJiAodG9rZW4udHlwZSA9PT0gVHdpZy5leHByZXNzaW9uLnR5cGUub3BlcmF0b3IuYmluYXJ5IHx8IHRva2VuLnR5cGUgPT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLm9wZXJhdG9yLnVuYXJ5KSAmJiB0b2tlbi5rZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGFzX3ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJNaXNzaW5nIHZhbHVlIGZvciBrZXkgJ1wiICsgdG9rZW4ua2V5ICsgXCInIGluIG9iamVjdCBkZWZpbml0aW9uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld19vYmplY3RbdG9rZW4ua2V5XSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQcmVzZXJ2ZSB0aGUgb3JkZXIgdGhhdCBlbGVtZW50cyBhcmUgYWRkZWQgdG8gdGhlIG1hcFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBuZWNlc3Nhcnkgc2luY2UgSmF2YVNjcmlwdCBvYmplY3RzIGRvbid0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBndWFyYW50ZWUgdGhlIG9yZGVyIG9mIGtleXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdfb2JqZWN0Ll9rZXlzID09PSB1bmRlZmluZWQpIG5ld19vYmplY3QuX2tleXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld19vYmplY3QuX2tleXMudW5zaGlmdCh0b2tlbi5rZXkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXNldCB2YWx1ZSBjaGVja1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzX3ZhbHVlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc192YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghb2JqZWN0X2VuZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiVW5leHBlY3RlZCBlbmQgb2Ygb2JqZWN0LlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5ld19vYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRva2VuIHJlcHJlc2VudGluZyBhIGZpbHRlclxuICAgICAgICAvL1xuICAgICAgICAvLyBGaWx0ZXJzIGNhbiBmb2xsb3cgYW55IGV4cHJlc3Npb24gYW5kIHRha2UgdGhlIGZvcm06XG4gICAgICAgIC8vICAgIGV4cHJlc3Npb258ZmlsdGVyKG9wdGlvbmFsLCBhcmdzKVxuICAgICAgICAvL1xuICAgICAgICAvLyBGaWx0ZXIgcGFyc2luZyBpcyBkb25lIGluIHRoZSBUd2lnLmZpbHRlcnMgbmFtZXNwYWNlLlxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5maWx0ZXIsXG4gICAgICAgICAgICAvLyBtYXRjaCBhIHwgdGhlbiBhIGxldHRlciBvciBfLCB0aGVuIGFueSBudW1iZXIgb2YgbGV0dGVycywgbnVtYmVycywgXyBvciAtXG4gICAgICAgICAgICByZWdleDogL15cXHxcXHM/KFthLXpBLVpfXVthLXpBLVowLTlfXFwtXSopLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9uc19leHRlbmRlZC5jb25jYXQoW1xuICAgICAgICAgICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuc3RhcnRdKSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdG9rZW4udmFsdWUgPSB0b2tlbi5tYXRjaFsxXTtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IHN0YWNrLnBvcCgpLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB0b2tlbi5wYXJhbXMgJiYgVHdpZy5leHByZXNzaW9uLnBhcnNlLmFwcGx5KHRoaXMsIFt0b2tlbi5wYXJhbXMsIGNvbnRleHRdKTtcblxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goVHdpZy5maWx0ZXIuYXBwbHkodGhpcywgW3Rva2VuLnZhbHVlLCBpbnB1dCwgcGFyYW1zXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5fZnVuY3Rpb24sXG4gICAgICAgICAgICAvLyBtYXRjaCBhbnkgbGV0dGVyIG9yIF8sIHRoZW4gYW55IG51bWJlciBvZiBsZXR0ZXJzLCBudW1iZXJzLCBfIG9yIC0gZm9sbG93ZWQgYnkgKFxuICAgICAgICAgICAgcmVnZXg6IC9eKFthLXpBLVpfXVthLXpBLVowLTlfXSopXFxzKlxcKC8sXG4gICAgICAgICAgICBuZXh0OiBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuc3RhcnQsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKG1hdGNoLCB0b2tlbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJygnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGZuID0gdG9rZW4ubWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgdG9rZW4uZm4gPSBmbjtcbiAgICAgICAgICAgICAgICAvLyBjbGVhbnVwIHRva2VuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi52YWx1ZTtcblxuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHRva2VuLnBhcmFtcyAmJiBUd2lnLmV4cHJlc3Npb24ucGFyc2UuYXBwbHkodGhpcywgW3Rva2VuLnBhcmFtcywgY29udGV4dF0pLFxuICAgICAgICAgICAgICAgICAgICBmbiAgICAgPSB0b2tlbi5mbixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoVHdpZy5mdW5jdGlvbnNbZm5dKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgZnVuY3Rpb24gZnJvbSB0aGUgYnVpbHQtaW4gZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gVHdpZy5mdW5jdGlvbnNbZm5dLmFwcGx5KHRoaXMsIHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZXh0W2ZuXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgZnVuY3Rpb24gZnJvbSB0aGUgdXNlci9jb250ZXh0IGRlZmluZWQgZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29udGV4dFtmbl0uYXBwbHkoY29udGV4dCwgcGFyYW1zKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKGZuICsgJyBmdW5jdGlvbiBkb2VzIG5vdCBleGlzdCBhbmQgaXMgbm90IGRlZmluZWQgaW4gdGhlIGNvbnRleHQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUb2tlbiByZXByZXNlbnRpbmcgYSB2YXJpYWJsZS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVmFyaWFibGVzIGNhbiBjb250YWluIGxldHRlcnMsIG51bWJlcnMsIHVuZGVyc2NvcmVzIGFuZFxuICAgICAgICAvLyBkYXNoZXMsIGJ1dCBtdXN0IHN0YXJ0IHdpdGggYSBsZXR0ZXIgb3IgdW5kZXJzY29yZS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVmFyaWFibGVzIGFyZSByZXRyaWV2ZWQgZnJvbSB0aGUgcmVuZGVyIGNvbnRleHQgYW5kIHRha2VcbiAgICAgICAgLy8gdGhlIHZhbHVlIG9mICd1bmRlZmluZWQnIGlmIHRoZSBnaXZlbiB2YXJpYWJsZSBkb2Vzbid0XG4gICAgICAgIC8vIGV4aXN0IGluIHRoZSBjb250ZXh0LlxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS52YXJpYWJsZSxcbiAgICAgICAgICAgIC8vIG1hdGNoIGFueSBsZXR0ZXIgb3IgXywgdGhlbiBhbnkgbnVtYmVyIG9mIGxldHRlcnMsIG51bWJlcnMsIF8gb3IgLVxuICAgICAgICAgICAgcmVnZXg6IC9eW2EtekEtWl9dW2EtekEtWjAtOV9dKi8sXG4gICAgICAgICAgICBuZXh0OiBUd2lnLmV4cHJlc3Npb24uc2V0Lm9wZXJhdGlvbnNfZXh0ZW5kZWQuY29uY2F0KFtcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUucGFyYW1ldGVyLnN0YXJ0XSksXG4gICAgICAgICAgICBjb21waWxlOiBUd2lnLmV4cHJlc3Npb24uZm4uY29tcGlsZS5wdXNoLFxuICAgICAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKG1hdGNoLCB0b2tlbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFR3aWcuaW5kZXhPZihUd2lnLmV4cHJlc3Npb24ucmVzZXJ2ZWRXb3JkcywgbWF0Y2hbMF0pIDwgMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgdmFyaWFibGUgZnJvbSB0aGUgY29udGV4dFxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IFR3aWcuZXhwcmVzc2lvbi5yZXNvbHZlKGNvbnRleHRbdG9rZW4udmFsdWVdLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUua2V5LnBlcmlvZCxcbiAgICAgICAgICAgIHJlZ2V4OiAvXlxcLihbYS16QS1aMC05X10rKS8sXG4gICAgICAgICAgICBuZXh0OiBUd2lnLmV4cHJlc3Npb24uc2V0Lm9wZXJhdGlvbnNfZXh0ZW5kZWQuY29uY2F0KFtcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUucGFyYW1ldGVyLnN0YXJ0XSksXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIG91dHB1dCkge1xuICAgICAgICAgICAgICAgIHRva2VuLmtleSA9IHRva2VuLm1hdGNoWzFdO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4udmFsdWU7XG5cbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSB0b2tlbi5wYXJhbXMgJiYgVHdpZy5leHByZXNzaW9uLnBhcnNlLmFwcGx5KHRoaXMsIFt0b2tlbi5wYXJhbXMsIGNvbnRleHRdKSxcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gdG9rZW4ua2V5LFxuICAgICAgICAgICAgICAgICAgICBvYmplY3QgPSBzdGFjay5wb3AoKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0ID09PSBudWxsIHx8IG9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RyaWN0X3ZhcmlhYmxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJDYW4ndCBhY2Nlc3MgYSBrZXkgXCIgKyBrZXkgKyBcIiBvbiBhbiBudWxsIG9yIHVuZGVmaW5lZCBvYmplY3QuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7cmV0dXJuIHZhbHVlLnN1YnN0cigwLCAxKS50b1VwcGVyQ2FzZSgpICsgdmFsdWUuc3Vic3RyKDEpO307XG5cbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHZhcmlhYmxlIGZyb20gdGhlIGNvbnRleHRcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYga2V5IGluIG9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqZWN0W1wiZ2V0XCIrY2FwaXRhbGl6ZShrZXkpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gb2JqZWN0W1wiZ2V0XCIrY2FwaXRhbGl6ZShrZXkpXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9iamVjdFtcImlzXCIrY2FwaXRhbGl6ZShrZXkpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gb2JqZWN0W1wiaXNcIitjYXBpdGFsaXplKGtleSldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChUd2lnLmV4cHJlc3Npb24ucmVzb2x2ZSh2YWx1ZSwgb2JqZWN0LCBwYXJhbXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUua2V5LmJyYWNrZXRzLFxuICAgICAgICAgICAgcmVnZXg6IC9eXFxbKFteXFxdXSopXFxdLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9uc19leHRlbmRlZC5jb25jYXQoW1xuICAgICAgICAgICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuc3RhcnRdKSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gdG9rZW4ubWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLnZhbHVlO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcblxuICAgICAgICAgICAgICAgIC8vIFRoZSBleHByZXNzaW9uIHN0YWNrIGZvciB0aGUga2V5XG4gICAgICAgICAgICAgICAgdG9rZW4uc3RhY2sgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZSh7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBtYXRjaFxuICAgICAgICAgICAgICAgIH0pLnN0YWNrO1xuXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAvLyBFdmFsdWF0ZSBrZXlcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gdG9rZW4ucGFyYW1zICYmIFR3aWcuZXhwcmVzc2lvbi5wYXJzZS5hcHBseSh0aGlzLCBbdG9rZW4ucGFyYW1zLCBjb250ZXh0XSksXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IFR3aWcuZXhwcmVzc2lvbi5wYXJzZS5hcHBseSh0aGlzLCBbdG9rZW4uc3RhY2ssIGNvbnRleHRdKSxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0ID0gc3RhY2sucG9wKCksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdCA9PT0gbnVsbCB8fCBvYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN0cmljdF92YXJpYWJsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiQ2FuJ3QgYWNjZXNzIGEga2V5IFwiICsga2V5ICsgXCIgb24gYW4gbnVsbCBvciB1bmRlZmluZWQgb2JqZWN0LlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSB2YXJpYWJsZSBmcm9tIHRoZSBjb250ZXh0XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goVHdpZy5leHByZXNzaW9uLnJlc29sdmUodmFsdWUsIG9iamVjdCwgcGFyYW1zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTWF0Y2ggYSBudWxsIHZhbHVlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5fbnVsbCxcbiAgICAgICAgICAgIC8vIG1hdGNoIGEgbnVtYmVyXG4gICAgICAgICAgICByZWdleDogL14obnVsbHxOVUxMfG5vbmV8Tk9ORSkvLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnNldC5vcGVyYXRpb25zLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG4gICAgICAgICAgICAgICAgdG9rZW4udmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogVHdpZy5leHByZXNzaW9uLmZuLnBhcnNlLnB1c2hfdmFsdWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNYXRjaCB0aGUgY29udGV4dFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5jb250ZXh0LFxuICAgICAgICAgICAgcmVnZXg6IC9eX2NvbnRleHQvLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnNldC5vcGVyYXRpb25zX2V4dGVuZGVkLmNvbmNhdChbXG4gICAgICAgICAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLnBhcmFtZXRlci5zdGFydF0pLFxuICAgICAgICAgICAgY29tcGlsZTogVHdpZy5leHByZXNzaW9uLmZuLmNvbXBpbGUucHVzaCxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGNvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1hdGNoIGEgbnVtYmVyIChpbnRlZ2VyIG9yIGRlY2ltYWwpXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcuZXhwcmVzc2lvbi50eXBlLm51bWJlcixcbiAgICAgICAgICAgIC8vIG1hdGNoIGEgbnVtYmVyXG4gICAgICAgICAgICByZWdleDogL15cXC0/XFxkKyhcXC5cXGQrKT8vLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnNldC5vcGVyYXRpb25zLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICB0b2tlbi52YWx1ZSA9IE51bWJlcih0b2tlbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBUd2lnLmV4cHJlc3Npb24uZm4ucGFyc2UucHVzaF92YWx1ZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1hdGNoIGEgYm9vbGVhblxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5ib29sLFxuICAgICAgICAgICAgcmVnZXg6IC9eKHRydWV8VFJVRXxmYWxzZXxGQUxTRSkvLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnNldC5vcGVyYXRpb25zLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICB0b2tlbi52YWx1ZSA9ICh0b2tlbi5tYXRjaFswXS50b0xvd2VyQ2FzZSggKSA9PT0gXCJ0cnVlXCIpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IFR3aWcuZXhwcmVzc2lvbi5mbi5wYXJzZS5wdXNoX3ZhbHVlXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZSBhIGNvbnRleHQgdmFsdWUuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaXQgaXMgZXhlY3V0ZWQgd2l0aCBhIGNvbnRleHQgcGFyYW1ldGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgY29udGV4dCBvYmplY3Qga2V5LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IFRoZSByZW5kZXIgY29udGV4dC5cbiAgICAgKi9cbiAgICBUd2lnLmV4cHJlc3Npb24ucmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBwYXJhbXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUuYXBwbHkoY29udGV4dCwgcGFyYW1zIHx8IFtdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RyeSBmb3IgbG9naWMgaGFuZGxlcnMuXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uLmhhbmRsZXIgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZSBhIG5ldyBleHByZXNzaW9uIHR5cGUsIGF2YWlsYWJsZSBhdCBUd2lnLmxvZ2ljLnR5cGUue3R5cGV9XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgbmFtZSBvZiB0aGUgbmV3IHR5cGUuXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uLmV4dGVuZFR5cGUgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZVt0eXBlXSA9IFwiVHdpZy5leHByZXNzaW9uLnR5cGUuXCIgKyB0eXBlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeHRlbmQgdGhlIGV4cHJlc3Npb24gcGFyc2luZyBmdW5jdGlvbmFsaXR5IHdpdGggYSBuZXcgZGVmaW5pdGlvbi5cbiAgICAgKlxuICAgICAqIFRva2VuIGRlZmluaXRpb25zIGZvbGxvdyB0aGlzIGZvcm1hdDpcbiAgICAgKiAge1xuICAgICAqICAgICAgdHlwZTogICAgIE9uZSBvZiBUd2lnLmV4cHJlc3Npb24udHlwZS5bdHlwZV0sIGVpdGhlciBwcmUtZGVmaW5lZCBvciBhZGRlZCB1c2luZ1xuICAgICAqICAgICAgICAgICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24uZXh0ZW5kVHlwZVxuICAgICAqXG4gICAgICogICAgICBuZXh0OiAgICAgQXJyYXkgb2YgdHlwZXMgZnJvbSBUd2lnLmV4cHJlc3Npb24udHlwZSB0aGF0IGNhbiBmb2xsb3cgdGhpcyB0b2tlbixcbiAgICAgKlxuICAgICAqICAgICAgcmVnZXg6ICAgIEEgcmVnZXggb3IgYXJyYXkgb2YgcmVnZXgncyB0aGF0IHNob3VsZCBtYXRjaCB0aGUgdG9rZW4uXG4gICAgICpcbiAgICAgKiAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSBjYWxsZWQgd2hlbiB0aGlzIHRva2VuIGlzIGJlaW5nIGNvbXBpbGVkLlxuICAgICAqICAgICAgICAgICAgICAgICAgIFNob3VsZCByZXR1cm4gYW4gb2JqZWN0IHdpdGggc3RhY2sgYW5kIG91dHB1dCBzZXQuXG4gICAgICpcbiAgICAgKiAgICAgIHBhcnNlOiAgIGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCkgY2FsbGVkIHdoZW4gdGhpcyB0b2tlbiBpcyBiZWluZyBwYXJzZWQuXG4gICAgICogICAgICAgICAgICAgICAgICAgU2hvdWxkIHJldHVybiBhbiBvYmplY3Qgd2l0aCBzdGFjayBhbmQgY29udGV4dCBzZXQuXG4gICAgICogIH1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZpbml0aW9uIEEgdG9rZW4gZGVmaW5pdGlvbi5cbiAgICAgKi9cbiAgICBUd2lnLmV4cHJlc3Npb24uZXh0ZW5kID0gZnVuY3Rpb24gKGRlZmluaXRpb24pIHtcbiAgICAgICAgaWYgKCFkZWZpbml0aW9uLnR5cGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiVW5hYmxlIHRvIGV4dGVuZCBsb2dpYyBkZWZpbml0aW9uLiBObyB0eXBlIHByb3ZpZGVkIGZvciBcIiArIGRlZmluaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIFR3aWcuZXhwcmVzc2lvbi5oYW5kbGVyW2RlZmluaXRpb24udHlwZV0gPSBkZWZpbml0aW9uO1xuICAgIH07XG5cbiAgICAvLyBFeHRlbmQgd2l0aCBidWlsdC1pbiBleHByZXNzaW9uc1xuICAgIHdoaWxlIChUd2lnLmV4cHJlc3Npb24uZGVmaW5pdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBUd2lnLmV4cHJlc3Npb24uZXh0ZW5kKFR3aWcuZXhwcmVzc2lvbi5kZWZpbml0aW9ucy5zaGlmdCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCcmVhayBhbiBleHByZXNzaW9uIGludG8gdG9rZW5zIGRlZmluZWQgaW4gVHdpZy5leHByZXNzaW9uLmRlZmluaXRpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV4cHJlc3Npb24gVGhlIHN0cmluZyB0byB0b2tlbml6ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiB0b2tlbnMuXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uLnRva2VuaXplID0gZnVuY3Rpb24gKGV4cHJlc3Npb24pIHtcbiAgICAgICAgdmFyIHRva2VucyA9IFtdLFxuICAgICAgICAgICAgLy8gS2VlcCBhbiBvZmZzZXQgb2YgdGhlIGxvY2F0aW9uIGluIHRoZSBleHByZXNzaW9uIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgICAgICAgICAgIGV4cF9vZmZzZXQgPSAwLFxuICAgICAgICAgICAgLy8gVGhlIHZhbGlkIG5leHQgdG9rZW5zIG9mIHRoZSBwcmV2aW91cyB0b2tlblxuICAgICAgICAgICAgbmV4dCA9IG51bGwsXG4gICAgICAgICAgICAvLyBNYXRjaCBpbmZvcm1hdGlvblxuICAgICAgICAgICAgdHlwZSwgcmVnZXgsIHJlZ2V4X2FycmF5LFxuICAgICAgICAgICAgLy8gVGhlIHBvc3NpYmxlIG5leHQgdG9rZW4gZm9yIHRoZSBtYXRjaFxuICAgICAgICAgICAgdG9rZW5fbmV4dCxcbiAgICAgICAgICAgIC8vIEhhcyBhIG1hdGNoIGJlZW4gZm91bmQgZnJvbSB0aGUgZGVmaW5pdGlvbnNcbiAgICAgICAgICAgIG1hdGNoX2ZvdW5kLCBpbnZhbGlkX21hdGNoZXMgPSBbXSwgbWF0Y2hfZnVuY3Rpb247XG5cbiAgICAgICAgbWF0Y2hfZnVuY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKSxcbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBtYXRjaC5wb3AoKSxcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBtYXRjaC5wb3AoKTtcblxuICAgICAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmV4cHJlc3Npb24udG9rZW5pemVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTWF0Y2hlZCBhIFwiLCB0eXBlLCBcIiByZWd1bGFyIGV4cHJlc3Npb24gb2YgXCIsIG1hdGNoKTtcblxuICAgICAgICAgICAgaWYgKG5leHQgJiYgVHdpZy5pbmRleE9mKG5leHQsIHR5cGUpIDwgMCkge1xuICAgICAgICAgICAgICAgIGludmFsaWRfbWF0Y2hlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB0eXBlICsgXCIgY2Fubm90IGZvbGxvdyBhIFwiICsgdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXS50eXBlICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIGF0IHRlbXBsYXRlOlwiICsgZXhwX29mZnNldCArIFwiIG5lYXIgJ1wiICsgbWF0Y2hbMF0uc3Vic3RyaW5nKDAsIDIwKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcIi4uLidcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgLy8gTm90IGEgbWF0Y2gsIGRvbid0IGNoYW5nZSB0aGUgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFswXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVmFsaWRhdGUgdGhlIHRva2VuIGlmIGEgdmFsaWRhdGlvbiBmdW5jdGlvbiBpcyBwcm92aWRlZFxuICAgICAgICAgICAgaWYgKFR3aWcuZXhwcmVzc2lvbi5oYW5kbGVyW3R5cGVdLnZhbGlkYXRlICYmXG4gICAgICAgICAgICAgICAgICAgICFUd2lnLmV4cHJlc3Npb24uaGFuZGxlclt0eXBlXS52YWxpZGF0ZShtYXRjaCwgdG9rZW5zKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFswXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW52YWxpZF9tYXRjaGVzID0gW107XG5cbiAgICAgICAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAgdHlwZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogbWF0Y2hbMF0sXG4gICAgICAgICAgICAgICAgbWF0Y2g6IG1hdGNoXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWF0Y2hfZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgbmV4dCA9IHRva2VuX25leHQ7XG4gICAgICAgICAgICBleHBfb2Zmc2V0ICs9IG1hdGNoWzBdLmxlbmd0aDtcblxuICAgICAgICAgICAgLy8gRG9lcyB0aGUgdG9rZW4gbmVlZCB0byByZXR1cm4gb3V0cHV0IGJhY2sgdG8gdGhlIGV4cHJlc3Npb24gc3RyaW5nXG4gICAgICAgICAgICAvLyBlLmcuIGEgZnVuY3Rpb24gbWF0Y2ggb2YgY3ljbGUoIG1pZ2h0IHJldHVybiB0aGUgJygnIGJhY2sgdG8gdGhlIGV4cHJlc3Npb25cbiAgICAgICAgICAgIC8vIFRoaXMgYWxsb3dzIGxvb2stYWhlYWQgdG8gZGlmZmVyZW50aWF0ZSBiZXR3ZWVuIHRva2VuIHR5cGVzIChlLmcuIGZ1bmN0aW9ucyBhbmQgdmFyaWFibGUgbmFtZXMpXG4gICAgICAgICAgICBpZiAoVHdpZy5leHByZXNzaW9uLmhhbmRsZXJbdHlwZV0udHJhbnNmb3JtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuZXhwcmVzc2lvbi5oYW5kbGVyW3R5cGVdLnRyYW5zZm9ybShtYXRjaCwgdG9rZW5zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfTtcblxuICAgICAgICBUd2lnLmxvZy5kZWJ1ZyhcIlR3aWcuZXhwcmVzc2lvbi50b2tlbml6ZVwiLCBcIlRva2VuaXppbmcgZXhwcmVzc2lvbiBcIiwgZXhwcmVzc2lvbik7XG5cbiAgICAgICAgd2hpbGUgKGV4cHJlc3Npb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24udHJpbSgpO1xuICAgICAgICAgICAgZm9yICh0eXBlIGluIFR3aWcuZXhwcmVzc2lvbi5oYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKFR3aWcuZXhwcmVzc2lvbi5oYW5kbGVyLmhhc093blByb3BlcnR5KHR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuX25leHQgPSBUd2lnLmV4cHJlc3Npb24uaGFuZGxlclt0eXBlXS5uZXh0O1xuICAgICAgICAgICAgICAgICAgICByZWdleCA9IFR3aWcuZXhwcmVzc2lvbi5oYW5kbGVyW3R5cGVdLnJlZ2V4O1xuICAgICAgICAgICAgICAgICAgICAvLyBUd2lnLmxvZy50cmFjZShcIkNoZWNraW5nIHR5cGUgXCIsIHR5cGUsIFwiIG9uIFwiLCBleHByZXNzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZ2V4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2V4X2FycmF5ID0gcmVnZXg7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWdleF9hcnJheSA9IFtyZWdleF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBtYXRjaF9mb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAocmVnZXhfYXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXggPSByZWdleF9hcnJheS5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UocmVnZXgsIG1hdGNoX2Z1bmN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBBbiBleHByZXNzaW9uIHRva2VuIGhhcyBiZWVuIG1hdGNoZWQuIEJyZWFrIHRoZSBmb3IgbG9vcCBhbmQgc3RhcnQgdHJ5aW5nIHRvXG4gICAgICAgICAgICAgICAgICAgIC8vICBtYXRjaCB0aGUgbmV4dCB0ZW1wbGF0ZSAoaWYgZXhwcmVzc2lvbiBpc24ndCBlbXB0eS4pXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaF9mb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIW1hdGNoX2ZvdW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKGludmFsaWRfbWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKGludmFsaWRfbWF0Y2hlcy5qb2luKFwiIE9SIFwiKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJVbmFibGUgdG8gcGFyc2UgJ1wiICsgZXhwcmVzc2lvbiArIFwiJyBhdCB0ZW1wbGF0ZSBwb3NpdGlvblwiICsgZXhwX29mZnNldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmV4cHJlc3Npb24udG9rZW5pemVcIiwgXCJUb2tlbml6ZWQgdG8gXCIsIHRva2Vucyk7XG4gICAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvbXBpbGUgYW4gZXhwcmVzc2lvbiB0b2tlbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByYXdfdG9rZW4gVGhlIHVuY29tcGlsZWQgdG9rZW4uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjb21waWxlZCB0b2tlbi5cbiAgICAgKi9cbiAgICBUd2lnLmV4cHJlc3Npb24uY29tcGlsZSA9IGZ1bmN0aW9uIChyYXdfdG9rZW4pIHtcbiAgICAgICAgdmFyIGV4cHJlc3Npb24gPSByYXdfdG9rZW4udmFsdWUsXG4gICAgICAgICAgICAvLyBUb2tlbml6ZSBleHByZXNzaW9uXG4gICAgICAgICAgICB0b2tlbnMgPSBUd2lnLmV4cHJlc3Npb24udG9rZW5pemUoZXhwcmVzc2lvbiksXG4gICAgICAgICAgICB0b2tlbiA9IG51bGwsXG4gICAgICAgICAgICBvdXRwdXQgPSBbXSxcbiAgICAgICAgICAgIHN0YWNrID0gW10sXG4gICAgICAgICAgICB0b2tlbl90ZW1wbGF0ZSA9IG51bGw7XG5cbiAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmV4cHJlc3Npb24uY29tcGlsZTogXCIsIFwiQ29tcGlsaW5nIFwiLCBleHByZXNzaW9uKTtcblxuICAgICAgICAvLyBQdXNoIHRva2VucyBpbnRvIFJQTiBzdGFjayB1c2luZyB0aGUgU3VudGluZy15YXJkIGFsZ29yaXRobVxuICAgICAgICAvLyBTZWUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TaHVudGluZ195YXJkX2FsZ29yaXRobVxuXG4gICAgICAgIHdoaWxlICh0b2tlbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnMuc2hpZnQoKTtcbiAgICAgICAgICAgIHRva2VuX3RlbXBsYXRlID0gVHdpZy5leHByZXNzaW9uLmhhbmRsZXJbdG9rZW4udHlwZV07XG5cbiAgICAgICAgICAgIFR3aWcubG9nLnRyYWNlKFwiVHdpZy5leHByZXNzaW9uLmNvbXBpbGU6IFwiLCBcIkNvbXBpbGluZyBcIiwgdG9rZW4pO1xuXG4gICAgICAgICAgICAvLyBDb21waWxlIHRoZSB0ZW1wbGF0ZVxuICAgICAgICAgICAgdG9rZW5fdGVtcGxhdGUuY29tcGlsZSAmJiB0b2tlbl90ZW1wbGF0ZS5jb21waWxlKHRva2VuLCBzdGFjaywgb3V0cHV0KTtcblxuICAgICAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmV4cHJlc3Npb24uY29tcGlsZTogXCIsIFwiU3RhY2sgaXNcIiwgc3RhY2spO1xuICAgICAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmV4cHJlc3Npb24uY29tcGlsZTogXCIsIFwiT3V0cHV0IGlzXCIsIG91dHB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZShzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBvdXRwdXQucHVzaChzdGFjay5wb3AoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBUd2lnLmxvZy50cmFjZShcIlR3aWcuZXhwcmVzc2lvbi5jb21waWxlOiBcIiwgXCJGaW5hbCBvdXRwdXQgaXNcIiwgb3V0cHV0KTtcblxuICAgICAgICByYXdfdG9rZW4uc3RhY2sgPSBvdXRwdXQ7XG4gICAgICAgIGRlbGV0ZSByYXdfdG9rZW4udmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIHJhd190b2tlbjtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSBhbiBSUE4gZXhwcmVzc2lvbiBzdGFjayB3aXRoaW4gYSBjb250ZXh0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gdG9rZW5zIEFuIGFycmF5IG9mIGNvbXBpbGVkIGV4cHJlc3Npb24gdG9rZW5zLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IFRoZSByZW5kZXIgY29udGV4dCB0byBwYXJzZSB0aGUgdG9rZW5zIHdpdGguXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHQgb2YgcGFyc2luZyBhbGwgdGhlIHRva2Vucy4gVGhlIHJlc3VsdFxuICAgICAqICAgICAgICAgICAgICAgICAgY2FuIGJlIGFueXRoaW5nLCBTdHJpbmcsIEFycmF5LCBPYmplY3QsIGV0Yy4uLiBiYXNlZCBvblxuICAgICAqICAgICAgICAgICAgICAgICAgdGhlIGdpdmVuIGV4cHJlc3Npb24uXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uLnBhcnNlID0gZnVuY3Rpb24gKHRva2VucywgY29udGV4dCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgLy8gSWYgdGhlIHRva2VuIGlzbid0IGFuIGFycmF5LCBtYWtlIGl0IG9uZS5cbiAgICAgICAgaWYgKCEodG9rZW5zIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICB0b2tlbnMgPSBbdG9rZW5zXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBvdXRwdXQgc3RhY2tcbiAgICAgICAgdmFyIHN0YWNrID0gW10sXG4gICAgICAgICAgICB0b2tlbl90ZW1wbGF0ZSA9IG51bGw7XG5cbiAgICAgICAgVHdpZy5mb3JFYWNoKHRva2VucywgZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICB0b2tlbl90ZW1wbGF0ZSA9IFR3aWcuZXhwcmVzc2lvbi5oYW5kbGVyW3Rva2VuLnR5cGVdO1xuXG4gICAgICAgICAgICB0b2tlbl90ZW1wbGF0ZS5wYXJzZSAmJiB0b2tlbl90ZW1wbGF0ZS5wYXJzZS5hcHBseSh0aGF0LCBbdG9rZW4sIHN0YWNrLCBjb250ZXh0XSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFBvcCB0aGUgZmluYWwgdmFsdWUgb2ZmIHRoZSBzdGFja1xuICAgICAgICByZXR1cm4gc3RhY2sucG9wKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBUd2lnO1xuXG59KSggVHdpZyB8fCB7IH0gKTtcbi8vICAgICBUd2lnLmpzXG4vLyAgICAgQXZhaWxhYmxlIHVuZGVyIHRoZSBCU0QgMi1DbGF1c2UgTGljZW5zZVxuLy8gICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9qdXN0am9obi90d2lnLmpzXG5cbi8vICMjIHR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5qc1xuLy9cbi8vIFRoaXMgZmlsZSBoYW5kbGVzIG9wZXJhdG9yIGxvb2t1cHMgYW5kIHBhcnNpbmcuXG52YXIgVHdpZyA9IChmdW5jdGlvbiAoVHdpZykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogT3BlcmF0b3IgYXNzb2NpYXRpdml0eSBjb25zdGFudHMuXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yID0ge1xuICAgICAgICBsZWZ0VG9SaWdodDogJ2xlZnRUb1JpZ2h0JyxcbiAgICAgICAgcmlnaHRUb0xlZnQ6ICdyaWdodFRvTGVmdCdcbiAgICB9O1xuXG4gICAgdmFyIGNvbnRhaW5tZW50ID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAgICBpZiAoYi5pbmRleE9mICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIFN0cmluZ1xuICAgICAgICAgICAgcmV0dXJuIGEgPT09IGIgfHwgYSAhPT0gJycgJiYgYi5pbmRleE9mKGEpID4gLTE7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBlbDtcbiAgICAgICAgICAgIGZvciAoZWwgaW4gYikge1xuICAgICAgICAgICAgICAgIGlmIChiLmhhc093blByb3BlcnR5KGVsKSAmJiBiW2VsXSA9PT0gYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBwcmVjaWRlbmNlIGFuZCBhc3NvY2lhdGl2aXR5IG9mIGFuIG9wZXJhdG9yLiBUaGVzZSBmb2xsb3cgdGhlIG9yZGVyIHRoYXQgQy9DKysgdXNlLlxuICAgICAqIFNlZSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL09wZXJhdG9yc19pbl9DX2FuZF9DKysgZm9yIHRoZSB0YWJsZSBvZiB2YWx1ZXMuXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxvb2t1cCA9IGZ1bmN0aW9uIChvcGVyYXRvciwgdG9rZW4pIHtcbiAgICAgICAgc3dpdGNoIChvcGVyYXRvcikge1xuICAgICAgICAgICAgY2FzZSBcIi4uXCI6XG4gICAgICAgICAgICBjYXNlICdub3QgaW4nOlxuICAgICAgICAgICAgY2FzZSAnaW4nOlxuICAgICAgICAgICAgICAgIHRva2VuLnByZWNpZGVuY2UgPSAyMDtcbiAgICAgICAgICAgICAgICB0b2tlbi5hc3NvY2lhdGl2aXR5ID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxlZnRUb1JpZ2h0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICcsJzpcbiAgICAgICAgICAgICAgICB0b2tlbi5wcmVjaWRlbmNlID0gMTg7XG4gICAgICAgICAgICAgICAgdG9rZW4uYXNzb2NpYXRpdml0eSA9IFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5sZWZ0VG9SaWdodDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy8gVGVybmFyeVxuICAgICAgICAgICAgY2FzZSAnPyc6XG4gICAgICAgICAgICBjYXNlICc6JzpcbiAgICAgICAgICAgICAgICB0b2tlbi5wcmVjaWRlbmNlID0gMTY7XG4gICAgICAgICAgICAgICAgdG9rZW4uYXNzb2NpYXRpdml0eSA9IFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5yaWdodFRvTGVmdDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnb3InOlxuICAgICAgICAgICAgICAgIHRva2VuLnByZWNpZGVuY2UgPSAxNDtcbiAgICAgICAgICAgICAgICB0b2tlbi5hc3NvY2lhdGl2aXR5ID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxlZnRUb1JpZ2h0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdhbmQnOlxuICAgICAgICAgICAgICAgIHRva2VuLnByZWNpZGVuY2UgPSAxMztcbiAgICAgICAgICAgICAgICB0b2tlbi5hc3NvY2lhdGl2aXR5ID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxlZnRUb1JpZ2h0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICc9PSc6XG4gICAgICAgICAgICBjYXNlICchPSc6XG4gICAgICAgICAgICAgICAgdG9rZW4ucHJlY2lkZW5jZSA9IDk7XG4gICAgICAgICAgICAgICAgdG9rZW4uYXNzb2NpYXRpdml0eSA9IFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5sZWZ0VG9SaWdodDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnPCc6XG4gICAgICAgICAgICBjYXNlICc8PSc6XG4gICAgICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICAgIGNhc2UgJz49JzpcbiAgICAgICAgICAgICAgICB0b2tlbi5wcmVjaWRlbmNlID0gODtcbiAgICAgICAgICAgICAgICB0b2tlbi5hc3NvY2lhdGl2aXR5ID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxlZnRUb1JpZ2h0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG5cbiAgICAgICAgICAgIGNhc2UgJ34nOiAvLyBTdHJpbmcgY29uY2F0aW5hdGlvblxuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICB0b2tlbi5wcmVjaWRlbmNlID0gNjtcbiAgICAgICAgICAgICAgICB0b2tlbi5hc3NvY2lhdGl2aXR5ID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxlZnRUb1JpZ2h0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICcvLyc6XG4gICAgICAgICAgICBjYXNlICcqKic6XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgY2FzZSAnJSc6XG4gICAgICAgICAgICAgICAgdG9rZW4ucHJlY2lkZW5jZSA9IDU7XG4gICAgICAgICAgICAgICAgdG9rZW4uYXNzb2NpYXRpdml0eSA9IFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5sZWZ0VG9SaWdodDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbm90JzpcbiAgICAgICAgICAgICAgICB0b2tlbi5wcmVjaWRlbmNlID0gMztcbiAgICAgICAgICAgICAgICB0b2tlbi5hc3NvY2lhdGl2aXR5ID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLnJpZ2h0VG9MZWZ0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKG9wZXJhdG9yICsgXCIgaXMgYW4gdW5rbm93biBvcGVyYXRvci5cIik7XG4gICAgICAgIH1cbiAgICAgICAgdG9rZW4ub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgb3BlcmF0aW9ucyBvbiB0aGUgUlBOIHN0YWNrLlxuICAgICAqXG4gICAgICogUmV0dXJucyB0aGUgdXBkYXRlZCBzdGFjay5cbiAgICAgKi9cbiAgICBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IucGFyc2UgPSBmdW5jdGlvbiAob3BlcmF0b3IsIHN0YWNrKSB7XG4gICAgICAgIFR3aWcubG9nLnRyYWNlKFwiVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLnBhcnNlOiBcIiwgXCJIYW5kbGluZyBcIiwgb3BlcmF0b3IpO1xuICAgICAgICB2YXIgYSwgYiwgYztcbiAgICAgICAgc3dpdGNoIChvcGVyYXRvcikge1xuICAgICAgICAgICAgY2FzZSAnOic6XG4gICAgICAgICAgICAgICAgLy8gSWdub3JlXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJz8nOlxuICAgICAgICAgICAgICAgIGMgPSBzdGFjay5wb3AoKTsgLy8gZmFsc2UgZXhwclxuICAgICAgICAgICAgICAgIGIgPSBzdGFjay5wb3AoKTsgLy8gdHJ1ZSBleHByXG4gICAgICAgICAgICAgICAgYSA9IHN0YWNrLnBvcCgpOyAvLyBjb25kaXRpb25hbFxuICAgICAgICAgICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgIGIgPSBwYXJzZUZsb2F0KHN0YWNrLnBvcCgpKTtcbiAgICAgICAgICAgICAgICBhID0gcGFyc2VGbG9hdChzdGFjay5wb3AoKSk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChhICsgYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgIGIgPSBwYXJzZUZsb2F0KHN0YWNrLnBvcCgpKTtcbiAgICAgICAgICAgICAgICBhID0gcGFyc2VGbG9hdChzdGFjay5wb3AoKSk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChhIC0gYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIGIgPSBwYXJzZUZsb2F0KHN0YWNrLnBvcCgpKTtcbiAgICAgICAgICAgICAgICBhID0gcGFyc2VGbG9hdChzdGFjay5wb3AoKSk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChhICogYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgIGIgPSBwYXJzZUZsb2F0KHN0YWNrLnBvcCgpKTtcbiAgICAgICAgICAgICAgICBhID0gcGFyc2VGbG9hdChzdGFjay5wb3AoKSk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChhIC8gYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJy8vJzpcbiAgICAgICAgICAgICAgICBiID0gcGFyc2VGbG9hdChzdGFjay5wb3AoKSk7XG4gICAgICAgICAgICAgICAgYSA9IHBhcnNlRmxvYXQoc3RhY2sucG9wKCkpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gocGFyc2VJbnQoYSAvIGIpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnJSc6XG4gICAgICAgICAgICAgICAgYiA9IHBhcnNlRmxvYXQoc3RhY2sucG9wKCkpO1xuICAgICAgICAgICAgICAgIGEgPSBwYXJzZUZsb2F0KHN0YWNrLnBvcCgpKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgJSBiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnfic6XG4gICAgICAgICAgICAgICAgYiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGEgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCAoYSAhPSBudWxsID8gYS50b1N0cmluZygpIDogXCJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKyAoYiAhPSBudWxsID8gYi50b1N0cmluZygpIDogXCJcIikgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbm90JzpcbiAgICAgICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goIXN0YWNrLnBvcCgpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnPCc6XG4gICAgICAgICAgICAgICAgYiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGEgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgPCBiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnPD0nOlxuICAgICAgICAgICAgICAgIGIgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBhID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChhIDw9IGIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICAgICAgICBiID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgYSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYSA+IGIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICc+PSc6XG4gICAgICAgICAgICAgICAgYiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGEgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgPj0gYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJz09PSc6XG4gICAgICAgICAgICAgICAgYiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGEgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgPT09IGIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICc9PSc6XG4gICAgICAgICAgICAgICAgYiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGEgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgPT0gYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJyE9PSc6XG4gICAgICAgICAgICAgICAgYiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGEgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgIT09IGIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICchPSc6XG4gICAgICAgICAgICAgICAgYiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGEgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgIT0gYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ29yJzpcbiAgICAgICAgICAgICAgICBiID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgYSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYSB8fCBiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnYW5kJzpcbiAgICAgICAgICAgICAgICBiID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgYSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYSAmJiBiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnKionOlxuICAgICAgICAgICAgICAgIGIgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBhID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChNYXRoLnBvdyhhLCBiKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cblxuICAgICAgICAgICAgY2FzZSAnbm90IGluJzpcbiAgICAgICAgICAgICAgICBiID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgYSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goICFjb250YWlubWVudChhLCBiKSApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdpbic6XG4gICAgICAgICAgICAgICAgYiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGEgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCBjb250YWlubWVudChhLCBiKSApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICcuLic6XG4gICAgICAgICAgICAgICAgYiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGEgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCBUd2lnLmZ1bmN0aW9ucy5yYW5nZShhLCBiKSApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKG9wZXJhdG9yICsgXCIgaXMgYW4gdW5rbm93biBvcGVyYXRvci5cIik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFR3aWc7XG5cbn0pKCBUd2lnIHx8IHsgfSApO1xuLy8gICAgIFR3aWcuanNcbi8vICAgICBBdmFpbGFibGUgdW5kZXIgdGhlIEJTRCAyLUNsYXVzZSBMaWNlbnNlXG4vLyAgICAgaHR0cHM6Ly9naXRodWIuY29tL2p1c3Rqb2huL3R3aWcuanNcblxuLy8gIyMgdHdpZy5maWx0ZXJzLmpzXG4vL1xuLy8gVGhpcyBmaWxlIGhhbmRsZXMgcGFyc2luZyBmaWx0ZXJzLlxudmFyIFR3aWcgPSAoZnVuY3Rpb24gKFR3aWcpIHtcblxuICAgIC8vIERldGVybWluZSBvYmplY3QgdHlwZVxuICAgIGZ1bmN0aW9uIGlzKHR5cGUsIG9iaikge1xuICAgICAgICB2YXIgY2xhcyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopLnNsaWNlKDgsIC0xKTtcbiAgICAgICAgcmV0dXJuIG9iaiAhPT0gdW5kZWZpbmVkICYmIG9iaiAhPT0gbnVsbCAmJiBjbGFzID09PSB0eXBlO1xuICAgIH1cblxuICAgIFR3aWcuZmlsdGVycyA9IHtcbiAgICAgICAgLy8gU3RyaW5nIEZpbHRlcnNcbiAgICAgICAgdXBwZXI6ICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIgKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB9LFxuICAgICAgICBsb3dlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FwaXRhbGl6ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiICkge1xuICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIHZhbHVlLnRvTG93ZXJDYXNlKCkuc3Vic3RyKDEpO1xuICAgICAgICB9LFxuICAgICAgICB0aXRsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCAvKF58XFxzKShbYS16XSkvZyAsIGZ1bmN0aW9uKG0sIHAxLCBwMil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHAxICsgcDIudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBsZW5ndGg6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoVHdpZy5saWIuaXMoXCJBcnJheVwiLCB2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVHdpZy5saWIuaXMoXCJPYmplY3RcIiwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLl9rZXlzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLl9rZXlzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEFycmF5L09iamVjdCBGaWx0ZXJzXG4gICAgICAgIHJldmVyc2U6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaXMoXCJBcnJheVwiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUucmV2ZXJzZSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpcyhcIlN0cmluZ1wiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSB2YWx1ZS5fa2V5cyB8fCBPYmplY3Qua2V5cyh2YWx1ZSkucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIHZhbHVlLl9rZXlzID0ga2V5cztcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNvcnQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaXMoXCJBcnJheVwiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc29ydCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIC8vIFNvcnRpbmcgb2JqZWN0cyBpc24ndCBvYnZpb3VzIHNpbmNlIHRoZSBvcmRlciBvZlxuICAgICAgICAgICAgICAgIC8vIHJldHVybmVkIGtleXMgaXNuJ3QgZ3VhcmFudGVlZGluIEphdmFTY3JpcHQuXG4gICAgICAgICAgICAgICAgLy8gQmVjYXVzZSBvZiB0aGlzIHdlIHVzZSBhIFwiaGlkZGVuXCIga2V5IGNhbGxlZCBfa2V5cyB0b1xuICAgICAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBrZXlzIGluIHRoZSBvcmRlciB3ZSB3YW50IHRvIHJldHVybiB0aGVtLlxuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlLl9rZXlzO1xuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpLFxuICAgICAgICAgICAgICAgICAgICBzb3J0ZWRfa2V5cyA9IGtleXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVbYV0gPiB2YWx1ZVtiXTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFsdWUuX2tleXMgPSBzb3J0ZWRfa2V5cztcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGtleXM6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBrZXlzZXQgPSB2YWx1ZS5fa2V5cyB8fCBPYmplY3Qua2V5cyh2YWx1ZSksXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gW107XG5cbiAgICAgICAgICAgIFR3aWcuZm9yRWFjaChrZXlzZXQsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IFwiX2tleXNcIikgcmV0dXJuOyAvLyBJZ25vcmUgdGhlIF9rZXlzIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH0sXG4gICAgICAgIHVybF9lbmNvZGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgam9pbjogZnVuY3Rpb24odmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGpvaW5fc3RyID0gXCJcIixcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBbXSxcbiAgICAgICAgICAgICAgICBrZXlzZXQgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAocGFyYW1zICYmIHBhcmFtc1swXSkge1xuICAgICAgICAgICAgICAgIGpvaW5fc3RyID0gcGFyYW1zWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAga2V5c2V0ID0gdmFsdWUuX2tleXMgfHwgT2JqZWN0LmtleXModmFsdWUpO1xuICAgICAgICAgICAgICAgIFR3aWcuZm9yRWFjaChrZXlzZXQsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBcIl9rZXlzXCIpIHJldHVybjsgLy8gSWdub3JlIHRoZSBfa2V5cyBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godmFsdWVba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQuam9pbihqb2luX3N0cik7XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGVmYXVsdFwiOiBmdW5jdGlvbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1zID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiZGVmYXVsdCBmaWx0ZXIgZXhwZWN0cyBvbmUgYXJndW1lbnRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gJycgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtc1swXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBqc29uX2VuY29kZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSggXCJfa2V5c1wiICkgKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlLl9rZXlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lcmdlOiBmdW5jdGlvbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgb2JqID0gW10sXG4gICAgICAgICAgICAgICAgYXJyX2luZGV4ID0gMCxcbiAgICAgICAgICAgICAgICBrZXlzZXQgPSBbXTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIGFsbCB0aGUgb2JqZWN0cyBiZWluZyBtZXJnZWQgYXJlIGFycmF5c1xuICAgICAgICAgICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgb2JqIGFzIGFuIE9iamVjdFxuICAgICAgICAgICAgICAgIG9iaiA9IHsgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVHdpZy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEocGFyYW0gaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9IHsgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEob2JqIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgb2JqLl9rZXlzID0gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgVHdpZy5mb3JFYWNoKHZhbHVlLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5fa2V5cykgb2JqLl9rZXlzLnB1c2goYXJyX2luZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgb2JqW2Fycl9pbmRleF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIGFycl9pbmRleCsrO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBrZXlzZXQgPSB2YWx1ZS5fa2V5cyB8fCBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgVHdpZy5mb3JFYWNoKGtleXNldCwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLl9rZXlzLnB1c2goa2V5KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgZWRnZSBjYXNlIHdoZXJlIGEgbnVtYmVyIGluZGV4IGluIGFuIG9iamVjdCBpcyBncmVhdGVyIHRoYW5cbiAgICAgICAgICAgICAgICAgICAgLy8gICB0aGUgYXJyYXkgY291bnRlci4gSW4gc3VjaCBhIGNhc2UsIHRoZSBhcnJheSBjb3VudGVyIGlzIGluY3JlYXNlZFxuICAgICAgICAgICAgICAgICAgICAvLyAgIG9uZSBwYXN0IHRoZSBpbmRleC5cbiAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgLy8gRXhhbXBsZSB7eyBbXCJhXCIsIFwiYlwiXXxtZXJnZSh7XCI0XCI6XCJ2YWx1ZVwifSwgW1wiY1wiLCBcImRcIl0pXG4gICAgICAgICAgICAgICAgICAgIC8vIFdpdGhvdXQgdGhpcywgZCB3b3VsZCBoYXZlIGFuIGluZGV4IG9mIFwiNFwiIGFuZCBvdmVyd3JpdGUgdGhlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIC8vICAgb2YgXCJ2YWx1ZVwiXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnRfa2V5ID0gcGFyc2VJbnQoa2V5LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4oaW50X2tleSkgJiYgaW50X2tleSA+PSBhcnJfaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycl9pbmRleCA9IGludF9rZXkgKyAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG1peGluIHRoZSBtZXJnZSBhcnJheXNcbiAgICAgICAgICAgIFR3aWcuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5mb3JFYWNoKHBhcmFtLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmouX2tleXMpIG9iai5fa2V5cy5wdXNoKGFycl9pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbYXJyX2luZGV4XSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycl9pbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBrZXlzZXQgPSBwYXJhbS5fa2V5cyB8fCBPYmplY3Qua2V5cyhwYXJhbSk7XG4gICAgICAgICAgICAgICAgICAgIFR3aWcuZm9yRWFjaChrZXlzZXQsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvYmpba2V5XSkgb2JqLl9rZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtrZXldID0gcGFyYW1ba2V5XTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludF9rZXkgPSBwYXJzZUludChrZXksIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4oaW50X2tleSkgJiYgaW50X2tleSA+PSBhcnJfaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJfaW5kZXggPSBpbnRfa2V5ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiRmlsdGVyIG1lcmdlIGV4cGVjdHMgYXQgbGVhc3Qgb25lIHBhcmFtZXRlclwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSxcbiAgICAgICAgZGF0ZTogZnVuY3Rpb24odmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWR8fHZhbHVlID09PSBudWxsKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkYXRlID0gVHdpZy5mdW5jdGlvbnMuZGF0ZSh2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gVHdpZy5saWIuZm9ybWF0RGF0ZShkYXRlLCBwYXJhbXNbMF0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRhdGVfbW9kaWZ5OiBmdW5jdGlvbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbXMgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJkYXRlX21vZGlmeSBmaWx0ZXIgZXhwZWN0cyAxIGFyZ3VtZW50XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbW9kaWZ5VGV4dCA9IHBhcmFtc1swXSwgdGltZTtcblxuICAgICAgICAgICAgaWYgKFR3aWcubGliLmlzKFwiRGF0ZVwiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aW1lID0gVHdpZy5saWIuc3RydG90aW1lKG1vZGlmeVRleHQsIHZhbHVlLmdldFRpbWUoKSAvIDEwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFR3aWcubGliLmlzKFwiU3RyaW5nXCIsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRpbWUgPSBUd2lnLmxpYi5zdHJ0b3RpbWUobW9kaWZ5VGV4dCwgVHdpZy5saWIuc3RydG90aW1lKHZhbHVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoVHdpZy5saWIuaXMoXCJOdW1iZXJcIiwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGltZSA9IFR3aWcubGliLnN0cnRvdGltZShtb2RpZnlUZXh0LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lICogMTAwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVwbGFjZTogZnVuY3Rpb24odmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWR8fHZhbHVlID09PSBudWxsKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwYWlycyA9IHBhcmFtc1swXSxcbiAgICAgICAgICAgICAgICB0YWc7XG4gICAgICAgICAgICBmb3IgKHRhZyBpbiBwYWlycykge1xuICAgICAgICAgICAgICAgIGlmIChwYWlycy5oYXNPd25Qcm9wZXJ0eSh0YWcpICYmIHRhZyAhPT0gXCJfa2V5c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gVHdpZy5saWIucmVwbGFjZUFsbCh2YWx1ZSwgdGFnLCBwYWlyc1t0YWddKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9ybWF0OiBmdW5jdGlvbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gVHdpZy5saWIudnNwcmludGYodmFsdWUsIHBhcmFtcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RyaXB0YWdzOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFR3aWcubGliLnN0cmlwX3RhZ3ModmFsdWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGVzY2FwZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkfHwgdmFsdWUgPT09IG51bGwpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByYXdfdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCImIzAzOTtcIik7XG4gICAgICAgICAgICByZXR1cm4gVHdpZy5NYXJrdXAocmF3X3ZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBBbGlhcyBvZiBlc2NhcGUgKi9cbiAgICAgICAgXCJlXCI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gVHdpZy5maWx0ZXJzLmVzY2FwZSh2YWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbmwyYnI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxpbmVicmVha190YWcgPSBcIkJBQ0tTTEFTSF9uX3JlcGxhY2VcIixcbiAgICAgICAgICAgICAgICBiciA9IFwiPGJyIC8+XCIgKyBsaW5lYnJlYWtfdGFnO1xuXG4gICAgICAgICAgICB2YWx1ZSA9IFR3aWcuZmlsdGVycy5lc2NhcGUodmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxyXFxuL2csIGJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcci9nLCBicilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgYnIpO1xuXG4gICAgICAgICAgICByZXR1cm4gVHdpZy5saWIucmVwbGFjZUFsbCh2YWx1ZSwgbGluZWJyZWFrX3RhZywgXCJcXG5cIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkYXB0ZWQgZnJvbTogaHR0cDovL3BocGpzLm9yZy9mdW5jdGlvbnMvbnVtYmVyX2Zvcm1hdDo0ODFcbiAgICAgICAgICovXG4gICAgICAgIG51bWJlcl9mb3JtYXQ6IGZ1bmN0aW9uKHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBudW1iZXIgPSB2YWx1ZSxcbiAgICAgICAgICAgICAgICBkZWNpbWFscyA9IChwYXJhbXMgJiYgcGFyYW1zWzBdKSA/IHBhcmFtc1swXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZWMgICAgICA9IChwYXJhbXMgJiYgcGFyYW1zWzFdICE9PSB1bmRlZmluZWQpID8gcGFyYW1zWzFdIDogXCIuXCIsXG4gICAgICAgICAgICAgICAgc2VwICAgICAgPSAocGFyYW1zICYmIHBhcmFtc1syXSAhPT0gdW5kZWZpbmVkKSA/IHBhcmFtc1syXSA6IFwiLFwiO1xuXG4gICAgICAgICAgICBudW1iZXIgPSAobnVtYmVyICsgJycpLnJlcGxhY2UoL1teMC05K1xcLUVlLl0vZywgJycpO1xuICAgICAgICAgICAgdmFyIG4gPSAhaXNGaW5pdGUoK251bWJlcikgPyAwIDogK251bWJlcixcbiAgICAgICAgICAgICAgICBwcmVjID0gIWlzRmluaXRlKCtkZWNpbWFscykgPyAwIDogTWF0aC5hYnMoZGVjaW1hbHMpLFxuICAgICAgICAgICAgICAgIHMgPSAnJyxcbiAgICAgICAgICAgICAgICB0b0ZpeGVkRml4ID0gZnVuY3Rpb24gKG4sIHByZWMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGsgPSBNYXRoLnBvdygxMCwgcHJlYyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJyArIE1hdGgucm91bmQobiAqIGspIC8gaztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuICAgICAgICAgICAgcyA9IChwcmVjID8gdG9GaXhlZEZpeChuLCBwcmVjKSA6ICcnICsgTWF0aC5yb3VuZChuKSkuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmIChzWzBdLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgICAgICBzWzBdID0gc1swXS5yZXBsYWNlKC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHNbMV0gfHwgJycpLmxlbmd0aCA8IHByZWMpIHtcbiAgICAgICAgICAgICAgICBzWzFdID0gc1sxXSB8fCAnJztcbiAgICAgICAgICAgICAgICBzWzFdICs9IG5ldyBBcnJheShwcmVjIC0gc1sxXS5sZW5ndGggKyAxKS5qb2luKCcwJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcy5qb2luKGRlYyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJpbTogZnVuY3Rpb24odmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWR8fCB2YWx1ZSA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3RyID0gVHdpZy5maWx0ZXJzLmVzY2FwZSggJycgKyB2YWx1ZSApLFxuICAgICAgICAgICAgICAgIHdoaXRlc3BhY2U7XG4gICAgICAgICAgICBpZiAoIHBhcmFtcyAmJiBwYXJhbXNbMF0gKSB7XG4gICAgICAgICAgICAgICAgd2hpdGVzcGFjZSA9ICcnICsgcGFyYW1zWzBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aGl0ZXNwYWNlID0gJyBcXG5cXHJcXHRcXGZcXHgwYlxceGEwXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMGFcXHUyMDBiXFx1MjAyOFxcdTIwMjlcXHUzMDAwJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdoaXRlc3BhY2UuaW5kZXhPZihzdHIuY2hhckF0KGkpKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZyhpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gc3RyLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdoaXRlc3BhY2UuaW5kZXhPZihzdHIuY2hhckF0KGkpKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB3aGl0ZXNwYWNlLmluZGV4T2Yoc3RyLmNoYXJBdCgwKSkgPT09IC0xID8gc3RyIDogJyc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJ1bmNhdGU6IGZ1bmN0aW9uICh2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gMzAsXG4gICAgICAgICAgICAgICAgcHJlc2VydmUgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBzZXBhcmF0b3IgPSAnLi4uJztcblxuICAgICAgICAgICAgdmFsdWUgPSAgdmFsdWUgKyAnJztcbiAgICAgICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IHBhcmFtc1swXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICBwcmVzZXJ2ZSA9IHBhcmFtc1sxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtc1syXSkge1xuICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3IgPSBwYXJhbXNbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gbGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJlc2VydmUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gdmFsdWUuaW5kZXhPZignICcsIGxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZW5ndGggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICB2YWx1ZS5zdWJzdHIoMCwgbGVuZ3RoKSArIHNlcGFyYXRvcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNsaWNlOiBmdW5jdGlvbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbXMgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwic2xpY2UgZmlsdGVyIGV4cGVjdHMgYXQgbGVhc3QgMSBhcmd1bWVudFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBzdGFydCBvZiBzdHJpbmdcbiAgICAgICAgICAgIHZhciBzdGFydCA9IHBhcmFtc1swXSB8fCAwO1xuICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBsZW5ndGggb2Ygc3RyaW5nXG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gcGFyYW1zLmxlbmd0aCA+IDEgPyBwYXJhbXNbMV0gOiB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAvLyBoYW5kbGUgbmVnYXRpdmUgc3RhcnQgdmFsdWVzXG4gICAgICAgICAgICB2YXIgc3RhcnRJbmRleCA9IHN0YXJ0ID49IDAgPyBzdGFydCA6IE1hdGgubWF4KCB2YWx1ZS5sZW5ndGggKyBzdGFydCwgMCApO1xuXG4gICAgICAgICAgICBpZiAoVHdpZy5saWIuaXMoXCJBcnJheVwiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0SW5kZXg7IGkgPCBzdGFydEluZGV4ICsgbGVuZ3RoICYmIGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh2YWx1ZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFR3aWcubGliLmlzKFwiU3RyaW5nXCIsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5zdWJzdHIoc3RhcnRJbmRleCwgbGVuZ3RoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJzbGljZSBmaWx0ZXIgZXhwZWN0cyB2YWx1ZSB0byBiZSBhbiBhcnJheSBvciBzdHJpbmdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWJzOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyh2YWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmlyc3Q6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVswXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoJ19rZXlzJyBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVbdmFsdWUuX2tleXNbMF1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc3Vic3RyKDAsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3BsaXQ6IGZ1bmN0aW9uKHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcmFtcyA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5sZW5ndGggPCAxIHx8IHBhcmFtcy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJzcGxpdCBmaWx0ZXIgZXhwZWN0cyAxIG9yIDIgYXJndW1lbnRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoVHdpZy5saWIuaXMoXCJTdHJpbmdcIiwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlbGltaXRlciA9IHBhcmFtc1swXSxcbiAgICAgICAgICAgICAgICAgICAgbGltaXQgPSBwYXJhbXNbMV0sXG4gICAgICAgICAgICAgICAgICAgIHNwbGl0ID0gdmFsdWUuc3BsaXQoZGVsaW1pdGVyKTtcblxuICAgICAgICAgICAgICAgIGlmIChsaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNwbGl0O1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsaW1pdCA8IDApIHtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc3BsaXQoZGVsaW1pdGVyLCBzcGxpdC5sZW5ndGggKyBsaW1pdCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaW1pdGVkU3BsaXQgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVsaW1pdGVyID09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbXB0eSBkZWxpbWl0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiYWFiYmNjXCJ8c3BsaXQoJycsIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLT4gWydhYScsICdiYicsICdjYyddXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlKHNwbGl0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGxpbWl0ICYmIHNwbGl0Lmxlbmd0aCA+IDA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wICs9IHNwbGl0LnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0ZWRTcGxpdC5wdXNoKHRlbXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBub24tZW1wdHkgZGVsaW1pdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBcIm9uZSx0d28sdGhyZWUsZm91cixmaXZlXCJ8c3BsaXQoJywnLCAzKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC0+IFsnb25lJywgJ3R3bycsICd0aHJlZSxmb3VyLGZpdmUnXVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bGltaXQtMSAmJiBzcGxpdC5sZW5ndGggPiAwOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdGVkU3BsaXQucHVzaChzcGxpdC5zaGlmdCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdGVkU3BsaXQucHVzaChzcGxpdC5qb2luKGRlbGltaXRlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpbWl0ZWRTcGxpdDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJzcGxpdCBmaWx0ZXIgZXhwZWN0cyB2YWx1ZSB0byBiZSBhIHN0cmluZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbGFzdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChUd2lnLmxpYi5pcygnT2JqZWN0JywgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleXM7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuX2tleXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGtleXMgPSB2YWx1ZS5fa2V5cztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVba2V5c1trZXlzLmxlbmd0aCAtIDFdXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc3RyaW5nfGFycmF5XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVbdmFsdWUubGVuZ3RoIC0gMV07XG4gICAgICAgIH0sXG4gICAgICAgIHJhdzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBUd2lnLk1hcmt1cCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGJhdGNoOiBmdW5jdGlvbihpdGVtcywgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgc2l6ZSA9IHBhcmFtcy5zaGlmdCgpLFxuICAgICAgICAgICAgICAgIGZpbGwgPSBwYXJhbXMuc2hpZnQoKSxcbiAgICAgICAgICAgICAgICByZXN1bHQsXG4gICAgICAgICAgICAgICAgbGFzdCxcbiAgICAgICAgICAgICAgICBtaXNzaW5nO1xuXG4gICAgICAgICAgICBpZiAoIVR3aWcubGliLmlzKFwiQXJyYXlcIiwgaXRlbXMpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJiYXRjaCBmaWx0ZXIgZXhwZWN0cyBpdGVtcyB0byBiZSBhbiBhcnJheVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFUd2lnLmxpYi5pcyhcIk51bWJlclwiLCBzaXplKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiYmF0Y2ggZmlsdGVyIGV4cGVjdHMgc2l6ZSB0byBiZSBhIG51bWJlclwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2l6ZSA9IE1hdGguY2VpbChzaXplKTtcblxuICAgICAgICAgICAgcmVzdWx0ID0gVHdpZy5saWIuY2h1bmtBcnJheShpdGVtcywgc2l6ZSk7XG5cbiAgICAgICAgICAgIGlmIChmaWxsICYmIGl0ZW1zLmxlbmd0aCAlIHNpemUgIT0gMCkge1xuICAgICAgICAgICAgICAgIGxhc3QgPSByZXN1bHQucG9wKCk7XG4gICAgICAgICAgICAgICAgbWlzc2luZyA9IHNpemUgLSBsYXN0Lmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChtaXNzaW5nLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdC5wdXNoKGZpbGwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxhc3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuICAgICAgICByb3VuZDogZnVuY3Rpb24odmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IFtdO1xuXG4gICAgICAgICAgICB2YXIgcHJlY2lzaW9uID0gcGFyYW1zLmxlbmd0aCA+IDAgPyBwYXJhbXNbMF0gOiAwLFxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IHBhcmFtcy5sZW5ndGggPiAxID8gcGFyYW1zWzFdIDogXCJjb21tb25cIjtcblxuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcblxuICAgICAgICAgICAgaWYocHJlY2lzaW9uICYmICFUd2lnLmxpYi5pcyhcIk51bWJlclwiLCBwcmVjaXNpb24pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJyb3VuZCBmaWx0ZXIgZXhwZWN0cyBwcmVjaXNpb24gdG8gYmUgYSBudW1iZXJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09IFwiY29tbW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5saWIucm91bmQodmFsdWUsIHByZWNpc2lvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFUd2lnLmxpYi5pcyhcIkZ1bmN0aW9uXCIsIE1hdGhbbWV0aG9kXSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcInJvdW5kIGZpbHRlciBleHBlY3RzIG1ldGhvZCB0byBiZSAnZmxvb3InLCAnY2VpbCcsIG9yICdjb21tb24nXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gTWF0aFttZXRob2RdKHZhbHVlICogTWF0aC5wb3coMTAsIHByZWNpc2lvbikpIC8gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgVHdpZy5maWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXIsIHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgaWYgKCFUd2lnLmZpbHRlcnNbZmlsdGVyXSkge1xuICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBmaWx0ZXIgXCIgKyBmaWx0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFR3aWcuZmlsdGVyc1tmaWx0ZXJdLmFwcGx5KHRoaXMsIFt2YWx1ZSwgcGFyYW1zXSk7XG4gICAgfTtcblxuICAgIFR3aWcuZmlsdGVyLmV4dGVuZCA9IGZ1bmN0aW9uKGZpbHRlciwgZGVmaW5pdGlvbikge1xuICAgICAgICBUd2lnLmZpbHRlcnNbZmlsdGVyXSA9IGRlZmluaXRpb247XG4gICAgfTtcblxuICAgIHJldHVybiBUd2lnO1xuXG59KShUd2lnIHx8IHsgfSk7XG4vLyAgICAgVHdpZy5qc1xuLy8gICAgICAgICAgICAgICAgICAgMjAxMiBIYWRyaWVuIExhbm5lYXVcbi8vICAgICBBdmFpbGFibGUgdW5kZXIgdGhlIEJTRCAyLUNsYXVzZSBMaWNlbnNlXG4vLyAgICAgaHR0cHM6Ly9naXRodWIuY29tL2p1c3Rqb2huL3R3aWcuanNcblxuLy8gIyMgdHdpZy5mdW5jdGlvbnMuanNcbi8vXG4vLyBUaGlzIGZpbGUgaGFuZGxlcyBwYXJzaW5nIGZpbHRlcnMuXG52YXIgVHdpZyA9IChmdW5jdGlvbiAoVHdpZykge1xuXG4gICAgLy8gRGV0ZXJtaW5lIG9iamVjdCB0eXBlXG4gICAgZnVuY3Rpb24gaXModHlwZSwgb2JqKSB7XG4gICAgICAgIHZhciBjbGFzID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikuc2xpY2UoOCwgLTEpO1xuICAgICAgICByZXR1cm4gb2JqICE9PSB1bmRlZmluZWQgJiYgb2JqICE9PSBudWxsICYmIGNsYXMgPT09IHR5cGU7XG4gICAgfVxuXG4gICAgVHdpZy5mdW5jdGlvbnMgPSB7XG4gICAgICAgIC8vICBhdHRyaWJ1dGUsIGJsb2NrLCBjb25zdGFudCwgZGF0ZSwgZHVtcCwgcGFyZW50LCByYW5kb20sLlxuXG4gICAgICAgIC8vIFJhbmdlIGZ1bmN0aW9uIGZyb20gaHR0cDovL3BocGpzLm9yZy9mdW5jdGlvbnMvcmFuZ2U6NDk5XG4gICAgICAgIC8vIFVzZWQgdW5kZXIgYW4gTUlUIExpY2Vuc2VcbiAgICAgICAgcmFuZ2U6IGZ1bmN0aW9uIChsb3csIGhpZ2gsIHN0ZXApIHtcbiAgICAgICAgICAgIC8vIGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0XG4gICAgICAgICAgICAvLyArICAgb3JpZ2luYWwgYnk6IFdhbGRvIE1hbHF1aSBTaWx2YVxuICAgICAgICAgICAgLy8gKiAgICAgZXhhbXBsZSAxOiByYW5nZSAoIDAsIDEyICk7XG4gICAgICAgICAgICAvLyAqICAgICByZXR1cm5zIDE6IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyXVxuICAgICAgICAgICAgLy8gKiAgICAgZXhhbXBsZSAyOiByYW5nZSggMCwgMTAwLCAxMCApO1xuICAgICAgICAgICAgLy8gKiAgICAgcmV0dXJucyAyOiBbMCwgMTAsIDIwLCAzMCwgNDAsIDUwLCA2MCwgNzAsIDgwLCA5MCwgMTAwXVxuICAgICAgICAgICAgLy8gKiAgICAgZXhhbXBsZSAzOiByYW5nZSggJ2EnLCAnaScgKTtcbiAgICAgICAgICAgIC8vICogICAgIHJldHVybnMgMzogWydhJywgJ2InLCAnYycsICdkJywgJ2UnLCAnZicsICdnJywgJ2gnLCAnaSddXG4gICAgICAgICAgICAvLyAqICAgICBleGFtcGxlIDQ6IHJhbmdlKCAnYycsICdhJyApO1xuICAgICAgICAgICAgLy8gKiAgICAgcmV0dXJucyA0OiBbJ2MnLCAnYicsICdhJ11cbiAgICAgICAgICAgIHZhciBtYXRyaXggPSBbXTtcbiAgICAgICAgICAgIHZhciBpbml2YWwsIGVuZHZhbCwgcGx1cztcbiAgICAgICAgICAgIHZhciB3YWxrZXIgPSBzdGVwIHx8IDE7XG4gICAgICAgICAgICB2YXIgY2hhcnMgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKCFpc05hTihsb3cpICYmICFpc05hTihoaWdoKSkge1xuICAgICAgICAgICAgICAgIGluaXZhbCA9IHBhcnNlSW50KGxvdywgMTApO1xuICAgICAgICAgICAgICAgIGVuZHZhbCA9IHBhcnNlSW50KGhpZ2gsIDEwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNOYU4obG93KSAmJiBpc05hTihoaWdoKSkge1xuICAgICAgICAgICAgICAgIGNoYXJzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpbml2YWwgPSBsb3cuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgICAgICBlbmR2YWwgPSBoaWdoLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGluaXZhbCA9IChpc05hTihsb3cpID8gMCA6IGxvdyk7XG4gICAgICAgICAgICAgICAgZW5kdmFsID0gKGlzTmFOKGhpZ2gpID8gMCA6IGhpZ2gpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwbHVzID0gKChpbml2YWwgPiBlbmR2YWwpID8gZmFsc2UgOiB0cnVlKTtcbiAgICAgICAgICAgIGlmIChwbHVzKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGluaXZhbCA8PSBlbmR2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LnB1c2goKChjaGFycykgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKGluaXZhbCkgOiBpbml2YWwpKTtcbiAgICAgICAgICAgICAgICAgICAgaW5pdmFsICs9IHdhbGtlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdoaWxlIChpbml2YWwgPj0gZW5kdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5wdXNoKCgoY2hhcnMpID8gU3RyaW5nLmZyb21DaGFyQ29kZShpbml2YWwpIDogaW5pdmFsKSk7XG4gICAgICAgICAgICAgICAgICAgIGluaXZhbCAtPSB3YWxrZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbWF0cml4O1xuICAgICAgICB9LFxuICAgICAgICBjeWNsZTogZnVuY3Rpb24oYXJyLCBpKSB7XG4gICAgICAgICAgICB2YXIgcG9zID0gaSAlIGFyci5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gYXJyW3Bvc107XG4gICAgICAgIH0sXG4gICAgICAgIGR1bXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIEVPTCA9ICdcXG4nLFxuICAgICAgICAgICAgXHRpbmRlbnRDaGFyID0gJyAgJyxcbiAgICAgICAgICAgIFx0aW5kZW50VGltZXMgPSAwLFxuICAgICAgICAgICAgXHRvdXQgPSAnJyxcblx0XHRcdFx0YXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyksXG5cdFx0XHRcdGluZGVudCA9IGZ1bmN0aW9uKHRpbWVzKSB7XG4gICAgICAgICAgICAgICAgXHR2YXIgaW5kXHQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRpbWVzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZCArPSBpbmRlbnRDaGFyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmQ7XG4gICAgICAgICAgICAgICAgfSxcblx0XHRcdFx0ZGlzcGxheVZhciA9IGZ1bmN0aW9uKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSBpbmRlbnQoaW5kZW50VGltZXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHZhcmlhYmxlKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1bXBWYXIodmFyaWFibGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZih2YXJpYWJsZSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnZnVuY3Rpb24oKScgKyBFT0w7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKHZhcmlhYmxlKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnc3RyaW5nKCcgKyB2YXJpYWJsZS5sZW5ndGggKyAnKSBcIicgKyB2YXJpYWJsZSArICdcIicgKyBFT0w7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKHZhcmlhYmxlKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnbnVtYmVyKCcgKyB2YXJpYWJsZSArICcpJyArIEVPTDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YodmFyaWFibGUpID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnYm9vbCgnICsgdmFyaWFibGUgKyAnKScgKyBFT0w7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgIFx0ZHVtcFZhciA9IGZ1bmN0aW9uKHZhcmlhYmxlKSB7XG5cdFx0XHRcdFx0dmFyXHRpO1xuXHQgICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlID09PSBudWxsKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICdOVUxMJyArIEVPTDtcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFyaWFibGUgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICAgICAgICAgIG91dCArPSAndW5kZWZpbmVkJyArIEVPTDtcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhcmlhYmxlID09PSAnb2JqZWN0Jykge1xuXHQgICAgICAgICAgICAgICAgICAgIG91dCArPSBpbmRlbnQoaW5kZW50VGltZXMpICsgdHlwZW9mKHZhcmlhYmxlKTtcblx0ICAgICAgICAgICAgICAgICAgICBpbmRlbnRUaW1lcysrO1xuXHQgICAgICAgICAgICAgICAgICAgIG91dCArPSAnKCcgKyAoZnVuY3Rpb24ob2JqKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzaXplID0gMCwga2V5O1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGtleSBpbiBvYmopIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemUrKztcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2l6ZTtcblx0ICAgICAgICAgICAgICAgICAgICB9KSh2YXJpYWJsZSkgKyAnKSB7JyArIEVPTDtcblx0ICAgICAgICAgICAgICAgICAgICBmb3IgKGkgaW4gdmFyaWFibGUpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgb3V0ICs9IGluZGVudChpbmRlbnRUaW1lcykgKyAnWycgKyBpICsgJ109PiAnICsgRU9MO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5VmFyKHZhcmlhYmxlW2ldKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgaW5kZW50VGltZXMtLTtcblx0ICAgICAgICAgICAgICAgICAgICBvdXQgKz0gaW5kZW50KGluZGVudFRpbWVzKSArICd9JyArIEVPTDtcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgZGlzcGxheVZhcih2YXJpYWJsZSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH07XG5cblx0XHRcdC8vIGhhbmRsZSBubyBhcmd1bWVudCBjYXNlIGJ5IGR1bXBpbmcgdGhlIGVudGlyZSByZW5kZXIgY29udGV4dFxuXHRcdFx0aWYgKGFyZ3MubGVuZ3RoID09IDApIGFyZ3MucHVzaCh0aGlzLmNvbnRleHQpO1xuXG5cdFx0XHRUd2lnLmZvckVhY2goYXJncywgZnVuY3Rpb24odmFyaWFibGUpIHtcblx0XHRcdFx0ZHVtcFZhcih2YXJpYWJsZSk7XG5cdFx0XHR9KTtcblxuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfSxcbiAgICAgICAgZGF0ZTogZnVuY3Rpb24oZGF0ZSwgdGltZSkge1xuICAgICAgICAgICAgdmFyIGRhdGVPYmo7XG4gICAgICAgICAgICBpZiAoZGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZGF0ZU9iaiA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFR3aWcubGliLmlzKFwiRGF0ZVwiLCBkYXRlKSkge1xuICAgICAgICAgICAgICAgIGRhdGVPYmogPSBkYXRlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChUd2lnLmxpYi5pcyhcIlN0cmluZ1wiLCBkYXRlKSkge1xuICAgICAgICAgICAgICAgIGRhdGVPYmogPSBuZXcgRGF0ZShUd2lnLmxpYi5zdHJ0b3RpbWUoZGF0ZSkgKiAxMDAwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVHdpZy5saWIuaXMoXCJOdW1iZXJcIiwgZGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAvLyB0aW1lc3RhbXBcbiAgICAgICAgICAgICAgICBkYXRlT2JqID0gbmV3IERhdGUoZGF0ZSAqIDEwMDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIlVuYWJsZSB0byBwYXJzZSBkYXRlIFwiICsgZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGF0ZU9iajtcbiAgICAgICAgfSxcbiAgICAgICAgYmxvY2s6IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ibG9ja3NbYmxvY2tdO1xuICAgICAgICB9LFxuICAgICAgICBwYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gQWRkIGEgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgIHJldHVybiBUd2lnLnBsYWNlaG9sZGVycy5wYXJlbnQ7XG4gICAgICAgIH0sXG4gICAgICAgIGF0dHJpYnV0ZTogZnVuY3Rpb24ob2JqZWN0LCBtZXRob2QsIHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkobWV0aG9kKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iamVjdFttZXRob2RdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3RbbWV0aG9kXS5hcHBseSh1bmRlZmluZWQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0W21ldGhvZF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBBcnJheSB3aWxsIHJldHVybiBlbGVtZW50IDAtaW5kZXhcbiAgICAgICAgICAgIHJldHVybiBvYmplY3RbbWV0aG9kXSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlX2Zyb21fc3RyaW5nOiBmdW5jdGlvbih0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgaWYgKHRlbXBsYXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUd2lnLlRlbXBsYXRlKHtcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgZGF0YTogdGVtcGxhdGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICByYW5kb206IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgTElNSVRfSU5UMzEgPSAweDgwMDAwMDAwO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRSYW5kb21OdW1iZXIobikge1xuICAgICAgICAgICAgICAgIHZhciByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBMSU1JVF9JTlQzMSk7XG4gICAgICAgICAgICAgICAgdmFyIGxpbWl0cyA9IFswLCBuXTtcbiAgICAgICAgICAgICAgICB2YXIgbWluID0gTWF0aC5taW4uYXBwbHkobnVsbCwgbGltaXRzKSxcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gTWF0aC5tYXguYXBwbHkobnVsbCwgbGltaXRzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcigobWF4IC0gbWluICsgMSkgKiByYW5kb20gLyBMSU1JVF9JTlQzMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKFR3aWcubGliLmlzKFwiTnVtYmVyXCIsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21OdW1iZXIodmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihUd2lnLmxpYi5pcyhcIlN0cmluZ1wiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuY2hhckF0KGdldFJhbmRvbU51bWJlcih2YWx1ZS5sZW5ndGgtMSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihUd2lnLmxpYi5pcyhcIkFycmF5XCIsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVtnZXRSYW5kb21OdW1iZXIodmFsdWUubGVuZ3RoLTEpXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoVHdpZy5saWIuaXMoXCJPYmplY3RcIiwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlW2tleXNbZ2V0UmFuZG9tTnVtYmVyKGtleXMubGVuZ3RoLTEpXV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21OdW1iZXIoTElNSVRfSU5UMzEtMSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgVHdpZy5fZnVuY3Rpb24gPSBmdW5jdGlvbihfZnVuY3Rpb24sIHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgaWYgKCFUd2lnLmZ1bmN0aW9uc1tfZnVuY3Rpb25dKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIGZ1bmN0aW9uIFwiICsgX2Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBUd2lnLmZ1bmN0aW9uc1tfZnVuY3Rpb25dKHZhbHVlLCBwYXJhbXMpO1xuICAgIH07XG5cbiAgICBUd2lnLl9mdW5jdGlvbi5leHRlbmQgPSBmdW5jdGlvbihfZnVuY3Rpb24sIGRlZmluaXRpb24pIHtcbiAgICAgICAgVHdpZy5mdW5jdGlvbnNbX2Z1bmN0aW9uXSA9IGRlZmluaXRpb247XG4gICAgfTtcblxuICAgIHJldHVybiBUd2lnO1xuXG59KShUd2lnIHx8IHsgfSk7XG4vLyAgICAgVHdpZy5qc1xuLy8gICAgIEF2YWlsYWJsZSB1bmRlciB0aGUgQlNEIDItQ2xhdXNlIExpY2Vuc2Vcbi8vICAgICBodHRwczovL2dpdGh1Yi5jb20vanVzdGpvaG4vdHdpZy5qc1xuXG4vLyAjIyB0d2lnLnRlc3RzLmpzXG4vL1xuLy8gVGhpcyBmaWxlIGhhbmRsZXMgZXhwcmVzc2lvbiB0ZXN0cy4gKGlzIGVtcHR5LCBpcyBub3QgZGVmaW5lZCwgZXRjLi4uKVxudmFyIFR3aWcgPSAoZnVuY3Rpb24gKFR3aWcpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBUd2lnLnRlc3RzID0ge1xuICAgICAgICBlbXB0eTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIC8vIEhhbmRsZXIgbnVtYmVyc1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIGZhbHNlOyAvLyBudW1iZXJzIGFyZSBuZXZlciBcImVtcHR5XCJcbiAgICAgICAgICAgIC8vIEhhbmRsZSBzdHJpbmdzIGFuZCBhcnJheXNcbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggJiYgdmFsdWUubGVuZ3RoID4gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgLy8gSGFuZGxlIG9iamVjdHNcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgb2RkOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlICUgMiA9PT0gMTtcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSAlIDIgPT09IDA7XG4gICAgICAgIH0sXG4gICAgICAgIGRpdmlzaWJsZWJ5OiBmdW5jdGlvbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgJSBwYXJhbXNbMF0gPT09IDA7XG4gICAgICAgIH0sXG4gICAgICAgIGRlZmluZWQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgfSxcbiAgICAgICAgbm9uZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgJ251bGwnOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9uZSh2YWx1ZSk7IC8vIEFsaWFzIG9mIG5vbmVcbiAgICAgICAgfSxcbiAgICAgICAgc2FtZWFzOiBmdW5jdGlvbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09IHBhcmFtc1swXTtcbiAgICAgICAgfSxcbiAgICAgICAgaXRlcmFibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgJiYgKFR3aWcubGliLmlzKFwiQXJyYXlcIiwgdmFsdWUpIHx8IFR3aWcubGliLmlzKFwiT2JqZWN0XCIsIHZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgY29uc3RhbnQgP1xuICAgICAgICAgKi9cbiAgICB9O1xuXG4gICAgVHdpZy50ZXN0ID0gZnVuY3Rpb24odGVzdCwgdmFsdWUsIHBhcmFtcykge1xuICAgICAgICBpZiAoIVR3aWcudGVzdHNbdGVzdF0pIHtcbiAgICAgICAgICAgIHRocm93IFwiVGVzdCBcIiArIHRlc3QgKyBcIiBpcyBub3QgZGVmaW5lZC5cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gVHdpZy50ZXN0c1t0ZXN0XSh2YWx1ZSwgcGFyYW1zKTtcbiAgICB9O1xuXG4gICAgVHdpZy50ZXN0LmV4dGVuZCA9IGZ1bmN0aW9uKHRlc3QsIGRlZmluaXRpb24pIHtcbiAgICAgICAgVHdpZy50ZXN0c1t0ZXN0XSA9IGRlZmluaXRpb247XG4gICAgfTtcblxuICAgIHJldHVybiBUd2lnO1xufSkoIFR3aWcgfHwgeyB9ICk7XG4vLyAgICAgVHdpZy5qc1xuLy8gICAgIEF2YWlsYWJsZSB1bmRlciB0aGUgQlNEIDItQ2xhdXNlIExpY2Vuc2Vcbi8vICAgICBodHRwczovL2dpdGh1Yi5jb20vanVzdGpvaG4vdHdpZy5qc1xuXG4vLyAjIyB0d2lnLmV4cG9ydHMuanNcbi8vXG4vLyBUaGlzIGZpbGUgcHJvdmlkZXMgZXh0ZW5zaW9uIHBvaW50cyBhbmQgb3RoZXIgaG9va3MgaW50byB0aGUgdHdpZyBmdW5jdGlvbmFsaXR5LlxuXG52YXIgVHdpZyA9IChmdW5jdGlvbiAoVHdpZykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIFR3aWcuZXhwb3J0cyA9IHtcbiAgICAgICAgVkVSU0lPTjogVHdpZy5WRVJTSU9OXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgY29tcGlsZSBhIHR3aWcuanMgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gUGFyYW10ZXJlcyBmb3IgY3JlYXRpbmcgYSBUd2lnIHRlbXBsYXRlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7VHdpZy5UZW1wbGF0ZX0gQSBUd2lnIHRlbXBsYXRlIHJlYWR5IGZvciByZW5kZXJpbmcuXG4gICAgICovXG4gICAgVHdpZy5leHBvcnRzLnR3aWcgPSBmdW5jdGlvbiB0d2lnKHBhcmFtcykge1xuICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgIHZhciBpZCA9IHBhcmFtcy5pZCxcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc3RyaWN0X3ZhcmlhYmxlczogcGFyYW1zLnN0cmljdF92YXJpYWJsZXMgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogdHVybiBhdXRvc2NhcGUgb24gaW4gdGhlIG5leHQgbWFqb3IgdmVyc2lvblxuICAgICAgICAgICAgICAgIGF1dG9lc2NhcGU6IHBhcmFtcy5hdXRvZXNjYXBlICE9IG51bGwgJiYgcGFyYW1zLmF1dG9lc2NhcGUgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgYWxsb3dJbmxpbmVJbmNsdWRlczogcGFyYW1zLmFsbG93SW5saW5lSW5jbHVkZXMgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgcmV0aHJvdzogcGFyYW1zLnJldGhyb3cgfHwgZmFsc2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICBUd2lnLnZhbGlkYXRlSWQoaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5kZWJ1ZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBUd2lnLmRlYnVnID0gcGFyYW1zLmRlYnVnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbXMudHJhY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgVHdpZy50cmFjZSA9IHBhcmFtcy50cmFjZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFR3aWcuVGVtcGxhdGUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHBhcmFtcy5kYXRhLFxuICAgICAgICAgICAgICAgIG1vZHVsZTogcGFyYW1zLm1vZHVsZSxcbiAgICAgICAgICAgICAgICBpZDogICBpZCxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5yZWYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5pZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJCb3RoIHJlZiBhbmQgaWQgY2Fubm90IGJlIHNldCBvbiBhIHR3aWcuanMgdGVtcGxhdGUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFR3aWcuVGVtcGxhdGVzLmxvYWQocGFyYW1zLnJlZik7XG5cbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMuaHJlZiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gVHdpZy5UZW1wbGF0ZXMubG9hZFJlbW90ZShwYXJhbXMuaHJlZiwge1xuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdhamF4JyxcbiAgICAgICAgICAgICAgICBiYXNlOiBwYXJhbXMuYmFzZSxcbiAgICAgICAgICAgICAgICBtb2R1bGU6IHBhcmFtcy5tb2R1bGUsXG4gICAgICAgICAgICAgICAgcHJlY29tcGlsZWQ6IHBhcmFtcy5wcmVjb21waWxlZCxcbiAgICAgICAgICAgICAgICBhc3luYzogcGFyYW1zLmFzeW5jLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcblxuICAgICAgICAgICAgfSwgcGFyYW1zLmxvYWQsIHBhcmFtcy5lcnJvcik7XG5cbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMucGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gVHdpZy5UZW1wbGF0ZXMubG9hZFJlbW90ZShwYXJhbXMucGF0aCwge1xuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdmcycsXG4gICAgICAgICAgICAgICAgYmFzZTogcGFyYW1zLmJhc2UsXG4gICAgICAgICAgICAgICAgbW9kdWxlOiBwYXJhbXMubW9kdWxlLFxuICAgICAgICAgICAgICAgIHByZWNvbXBpbGVkOiBwYXJhbXMucHJlY29tcGlsZWQsXG4gICAgICAgICAgICAgICAgYXN5bmM6IHBhcmFtcy5hc3luYyxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG5cbiAgICAgICAgICAgIH0sIHBhcmFtcy5sb2FkLCBwYXJhbXMuZXJyb3IpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEV4dGVuZCBUd2lnIHdpdGggYSBuZXcgZmlsdGVyLlxuICAgIFR3aWcuZXhwb3J0cy5leHRlbmRGaWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXIsIGRlZmluaXRpb24pIHtcbiAgICAgICAgVHdpZy5maWx0ZXIuZXh0ZW5kKGZpbHRlciwgZGVmaW5pdGlvbik7XG4gICAgfTtcblxuICAgIC8vIEV4dGVuZCBUd2lnIHdpdGggYSBuZXcgZnVuY3Rpb24uXG4gICAgVHdpZy5leHBvcnRzLmV4dGVuZEZ1bmN0aW9uID0gZnVuY3Rpb24oZm4sIGRlZmluaXRpb24pIHtcbiAgICAgICAgVHdpZy5fZnVuY3Rpb24uZXh0ZW5kKGZuLCBkZWZpbml0aW9uKTtcbiAgICB9O1xuXG4gICAgLy8gRXh0ZW5kIFR3aWcgd2l0aCBhIG5ldyB0ZXN0LlxuICAgIFR3aWcuZXhwb3J0cy5leHRlbmRUZXN0ID0gZnVuY3Rpb24odGVzdCwgZGVmaW5pdGlvbikge1xuICAgICAgICBUd2lnLnRlc3QuZXh0ZW5kKHRlc3QsIGRlZmluaXRpb24pO1xuICAgIH07XG5cbiAgICAvLyBFeHRlbmQgVHdpZyB3aXRoIGEgbmV3IGRlZmluaXRpb24uXG4gICAgVHdpZy5leHBvcnRzLmV4dGVuZFRhZyA9IGZ1bmN0aW9uKGRlZmluaXRpb24pIHtcbiAgICAgICAgVHdpZy5sb2dpYy5leHRlbmQoZGVmaW5pdGlvbik7XG4gICAgfTtcblxuICAgIC8vIFByb3ZpZGUgYW4gZW52aXJvbm1lbnQgZm9yIGV4dGVuZGluZyBUd2lnIGNvcmUuXG4gICAgLy8gQ2FsbHMgZm4gd2l0aCB0aGUgaW50ZXJuYWwgVHdpZyBvYmplY3QuXG4gICAgVHdpZy5leHBvcnRzLmV4dGVuZCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgIGZuKFR3aWcpO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFByb3ZpZGUgYW4gZXh0ZW5zaW9uIGZvciB1c2Ugd2l0aCBleHByZXNzIDIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWFya3VwIFRoZSB0ZW1wbGF0ZSBtYXJrdXAuXG4gICAgICogQHBhcmFtIHthcnJheX0gb3B0aW9ucyBUaGUgZXhwcmVzcyBvcHRpb25zLlxuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgcmVuZGVyZWQgdGVtcGxhdGUuXG4gICAgICovXG4gICAgVHdpZy5leHBvcnRzLmNvbXBpbGUgPSBmdW5jdGlvbihtYXJrdXAsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGlkID0gb3B0aW9ucy5maWxlbmFtZSxcbiAgICAgICAgICAgIHBhdGggPSBvcHRpb25zLmZpbGVuYW1lLFxuICAgICAgICAgICAgdGVtcGxhdGU7XG5cbiAgICAgICAgLy8gVHJ5IHRvIGxvYWQgdGhlIHRlbXBsYXRlIGZyb20gdGhlIGNhY2hlXG4gICAgICAgIHRlbXBsYXRlID0gbmV3IFR3aWcuVGVtcGxhdGUoe1xuICAgICAgICAgICAgZGF0YTogbWFya3VwLFxuICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnMuc2V0dGluZ3NbJ3R3aWcgb3B0aW9ucyddXG4gICAgICAgIH0pOyAvLyBUd2lnLlRlbXBsYXRlcy5sb2FkKGlkKSB8fFxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUucmVuZGVyKGNvbnRleHQpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQcm92aWRlIGFuIGV4dGVuc2lvbiBmb3IgdXNlIHdpdGggZXhwcmVzcyAzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIGxvY2F0aW9uIG9mIHRoZSB0ZW1wbGF0ZSBmaWxlIG9uIGRpc2suXG4gICAgICogQHBhcmFtIHtPYmplY3R8RnVuY3Rpb259IFRoZSBvcHRpb25zIG9yIGNhbGxiYWNrLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIGNhbGxiYWNrLlxuICAgICAqL1xuXG4gICAgVHdpZy5leHBvcnRzLnJlbmRlckZpbGUgPSBmdW5jdGlvbihwYXRoLCBvcHRpb25zLCBmbikge1xuICAgICAgICAvLyBoYW5kbGUgY2FsbGJhY2sgaW4gb3B0aW9uc1xuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygb3B0aW9ucykge1xuICAgICAgICAgICAgZm4gPSBvcHRpb25zO1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgICAgIGJhc2U6IG9wdGlvbnMuc2V0dGluZ3NbJ3ZpZXdzJ10sXG4gICAgICAgICAgICAgICAgbG9hZDogZnVuY3Rpb24odGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVuZGVyIGFuZCByZXR1cm4gdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgZm4obnVsbCwgdGVtcGxhdGUucmVuZGVyKG9wdGlvbnMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIC8vIG1peGluIGFueSBvcHRpb25zIHByb3ZpZGVkIHRvIHRoZSBleHByZXNzIGFwcC5cbiAgICAgICAgdmFyIHZpZXdfb3B0aW9ucyA9IG9wdGlvbnMuc2V0dGluZ3NbJ3R3aWcgb3B0aW9ucyddO1xuXG4gICAgICAgIGlmICh2aWV3X29wdGlvbnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG9wdGlvbiBpbiB2aWV3X29wdGlvbnMpIGlmICh2aWV3X29wdGlvbnMuaGFzT3duUHJvcGVydHkob3B0aW9uKSkge1xuICAgICAgICAgICAgICAgIHBhcmFtc1tvcHRpb25dID0gdmlld19vcHRpb25zW29wdGlvbl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBUd2lnLmV4cG9ydHMudHdpZyhwYXJhbXMpO1xuICAgIH07XG5cbiAgICAvLyBFeHByZXNzIDMgaGFuZGxlclxuICAgIFR3aWcuZXhwb3J0cy5fX2V4cHJlc3MgPSBUd2lnLmV4cG9ydHMucmVuZGVyRmlsZTtcblxuICAgIC8qKlxuICAgICAqIFNob3VkIFR3aWcuanMgY2FjaGUgdGVtcGxhdGVzLlxuICAgICAqIERpc2FibGUgZHVyaW5nIGRldmVsb3BtZW50IHRvIHNlZSBjaGFuZ2VzIHRvIHRlbXBsYXRlcyB3aXRob3V0XG4gICAgICogcmVsb2FkaW5nLCBhbmQgZGlzYWJsZSBpbiBwcm9kdWN0aW9uIHRvIGltcHJvdmUgcGVyZm9ybWFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNhY2hlXG4gICAgICovXG4gICAgVHdpZy5leHBvcnRzLmNhY2hlID0gZnVuY3Rpb24oY2FjaGUpIHtcbiAgICAgICAgVHdpZy5jYWNoZSA9IGNhY2hlO1xuICAgIH1cblxuICAgIHJldHVybiBUd2lnO1xufSkgKFR3aWcgfHwgeyB9KTtcblxuLy8gICAgIFR3aWcuanNcbi8vICAgICBBdmFpbGFibGUgdW5kZXIgdGhlIEJTRCAyLUNsYXVzZSBMaWNlbnNlXG4vLyAgICAgaHR0cHM6Ly9naXRodWIuY29tL2p1c3Rqb2huL3R3aWcuanNcblxuLy8gIyMgdHdpZy5jb21waWxlci5qc1xuLy9cbi8vIFRoaXMgZmlsZSBoYW5kbGVzIGNvbXBpbGluZyB0ZW1wbGF0ZXMgaW50byBKU1xudmFyIFR3aWcgPSAoZnVuY3Rpb24gKFR3aWcpIHtcbiAgICAvKipcbiAgICAgKiBOYW1lc3BhY2UgZm9yIGNvbXBpbGF0aW9uLlxuICAgICAqL1xuICAgIFR3aWcuY29tcGlsZXIgPSB7XG4gICAgICAgIG1vZHVsZToge31cbiAgICB9O1xuXG4gICAgLy8gQ29tcGlsZSBhIFR3aWcgVGVtcGxhdGUgdG8gb3V0cHV0LlxuICAgIFR3aWcuY29tcGlsZXIuY29tcGlsZSA9IGZ1bmN0aW9uKHRlbXBsYXRlLCBvcHRpb25zKSB7XG4gICAgICAgIC8vIEdldCB0b2tlbnNcbiAgICAgICAgdmFyIHRva2VucyA9IEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlLnRva2VucylcbiAgICAgICAgICAgICwgaWQgPSB0ZW1wbGF0ZS5pZFxuICAgICAgICAgICAgLCBvdXRwdXQ7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubW9kdWxlKSB7XG4gICAgICAgICAgICBpZiAoVHdpZy5jb21waWxlci5tb2R1bGVbb3B0aW9ucy5tb2R1bGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIlVuYWJsZSB0byBmaW5kIG1vZHVsZSB0eXBlIFwiICsgb3B0aW9ucy5tb2R1bGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0cHV0ID0gVHdpZy5jb21waWxlci5tb2R1bGVbb3B0aW9ucy5tb2R1bGVdKGlkLCB0b2tlbnMsIG9wdGlvbnMudHdpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBUd2lnLmNvbXBpbGVyLndyYXAoaWQsIHRva2Vucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xuXG4gICAgVHdpZy5jb21waWxlci5tb2R1bGUgPSB7XG4gICAgICAgIGFtZDogZnVuY3Rpb24oaWQsIHRva2VucywgcGF0aFRvVHdpZykge1xuICAgICAgICAgICAgcmV0dXJuICdkZWZpbmUoW1wiJyArIHBhdGhUb1R3aWcgKyAnXCJdLCBmdW5jdGlvbiAoVHdpZykge1xcblxcdHZhciB0d2lnLCB0ZW1wbGF0ZXM7XFxudHdpZyA9IFR3aWcudHdpZztcXG50ZW1wbGF0ZXMgPSAnICsgVHdpZy5jb21waWxlci53cmFwKGlkLCB0b2tlbnMpICsgJ1xcblxcdHJldHVybiB0ZW1wbGF0ZXM7XFxufSk7JztcbiAgICAgICAgfVxuICAgICAgICAsIG5vZGU6IGZ1bmN0aW9uKGlkLCB0b2tlbnMpIHtcbiAgICAgICAgICAgIHJldHVybiAndmFyIHR3aWcgPSByZXF1aXJlKFwidHdpZ1wiKS50d2lnO1xcbidcbiAgICAgICAgICAgICAgICArICdleHBvcnRzLnRlbXBsYXRlID0gJyArIFR3aWcuY29tcGlsZXIud3JhcChpZCwgdG9rZW5zKVxuICAgICAgICB9XG4gICAgICAgICwgY2pzMjogZnVuY3Rpb24oaWQsIHRva2VucywgcGF0aFRvVHdpZykge1xuICAgICAgICAgICAgcmV0dXJuICdtb2R1bGUuZGVjbGFyZShbeyB0d2lnOiBcIicgKyBwYXRoVG9Ud2lnICsgJ1wiIH1dLCBmdW5jdGlvbiAocmVxdWlyZSwgZXhwb3J0cywgbW9kdWxlKSB7XFxuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKyAnXFx0dmFyIHR3aWcgPSByZXF1aXJlKFwidHdpZ1wiKS50d2lnO1xcbidcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJ1xcdGV4cG9ydHMudGVtcGxhdGUgPSAnICsgVHdpZy5jb21waWxlci53cmFwKGlkLCB0b2tlbnMpXG4gICAgICAgICAgICAgICAgICAgICsgJ1xcbn0pOydcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBUd2lnLmNvbXBpbGVyLndyYXAgPSBmdW5jdGlvbihpZCwgdG9rZW5zKSB7XG4gICAgICAgIHJldHVybiAndHdpZyh7aWQ6XCInK2lkLnJlcGxhY2UoJ1wiJywgJ1xcXFxcIicpKydcIiwgZGF0YTonK3Rva2VucysnLCBwcmVjb21waWxlZDogdHJ1ZX0pO1xcbic7XG4gICAgfTtcblxuICAgIHJldHVybiBUd2lnO1xufSkoVHdpZyB8fCB7fSk7XG4vLyAgICAgVHdpZy5qc1xuLy8gICAgIEF2YWlsYWJsZSB1bmRlciB0aGUgQlNEIDItQ2xhdXNlIExpY2Vuc2Vcbi8vICAgICBodHRwczovL2dpdGh1Yi5jb20vanVzdGpvaG4vdHdpZy5qc1xuXG4vLyAjIyB0d2lnLm1vZHVsZS5qc1xuLy8gUHJvdmlkZSBhIENvbW1vbkpTL0FNRC9Ob2RlIG1vZHVsZSBleHBvcnQuXG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZGVjbGFyZSkge1xuICAgIC8vIFByb3ZpZGUgYSBDb21tb25KUyBNb2R1bGVzLzIuMCBkcmFmdCA4IG1vZHVsZVxuICAgIG1vZHVsZS5kZWNsYXJlKFtdLCBmdW5jdGlvbihyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGUpIHtcbiAgICAgICAgLy8gQWRkIGV4cG9ydHMgZnJvbSB0aGUgVHdpZyBleHBvcnRzXG4gICAgICAgIGZvciAoa2V5IGluIFR3aWcuZXhwb3J0cykge1xuICAgICAgICAgICAgaWYgKFR3aWcuZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgZXhwb3J0c1trZXldID0gVHdpZy5leHBvcnRzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBUd2lnLmV4cG9ydHM7XG4gICAgfSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgLy8gUHJvdmlkZSBhIENvbW1vbkpTIE1vZHVsZXMvMS4xIG1vZHVsZVxuICAgIG1vZHVsZS5leHBvcnRzID0gVHdpZy5leHBvcnRzO1xufSBlbHNlIHtcbiAgICAvLyBFeHBvcnQgZm9yIGJyb3dzZXIgdXNlXG4gICAgd2luZG93LnR3aWcgPSBUd2lnLmV4cG9ydHMudHdpZztcbiAgICB3aW5kb3cuVHdpZyA9IFR3aWcuZXhwb3J0cztcbn1cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUKSB7XG4gIFQuZXh0ZW5kRmlsdGVyKCdwYXNzdGhyb3VnaCcsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFQpIHtcbiAgVC5leHRlbmQoZnVuY3Rpb24oVHdpZykge1xuICAgIC8vIE1ha2UgdHJhbnMgdGFnIGF2YWlsYWJsZS5cbiAgICBUd2lnLmV4cG9ydHMuZXh0ZW5kVGFnKHtcbiAgICAgIHR5cGU6ICd0cmFucycsXG4gICAgICByZWdleDogL150cmFucyQvLFxuICAgICAgLy8gU2hvdWxkIGJlIGZvbGxvd2VkIGJ5IGVuZHRyYW5zLlxuICAgICAgbmV4dDogWyAnZW5kdHJhbnMnIF0sXG4gICAgICBvcGVuOiB0cnVlLFxuXG4gICAgICAvLyBUaGUgZm9sbG93aW5nIGlzIGJhc2VkIG9uIHRoaXMgd2lraSBwYWdlOiBodHRwczovL2dpdGh1Yi5jb20vanVzdGpvaG4vdHdpZy5qcy93aWtpL0V4dGVuZGluZy10d2lnLmpzLVdpdGgtQ3VzdG9tLVRhZ3NcbiAgICAgIC8vIHJ1bnMgb24gbWF0Y2hlZCB0b2tlbnMgd2hlbiB0aGUgdGVtcGxhdGUgaXMgbG9hZGVkLiAob25jZSBwZXIgdGVtcGxhdGUpXG4gICAgICBjb21waWxlOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgfSxcblxuICAgICAgLy8gUnVucyB3aGVuIHRoZSB0ZW1wbGF0ZSBpcyByZW5kZXJlZFxuICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IFR3aWcucGFyc2UuYXBwbHkodGhpcywgW3Rva2VuLm91dHB1dCwgY29udGV4dF0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2hhaW46IGZhbHNlLFxuICAgICAgICAgIG91dHB1dDogb3V0cHV0XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBFeHBvcnQgZW5kdHJhbnMgdGFnLlxuICAgIFR3aWcuZXhwb3J0cy5leHRlbmRUYWcoe1xuICAgICAgdHlwZTogJ2VuZHRyYW5zJyxcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgcmVnZXg6IC9eZW5kdHJhbnMkLyxcbiAgICAgIG5leHQ6IFtdXG4gICAgfSk7XG4gIH0pO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVCkge1xuICBULmV4dGVuZEZpbHRlcignd2l0aG91dCcsIGZ1bmN0aW9uKHZhbHVlLCBhcmdzKSB7XG4gICAgdmFyIG91dHB1dCA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBkZWxldGUgdmFsdWVbYXJnc1tpXV07XG4gICAgfVxuICAgIGZvciAodmFyIHByb3AgaW4gdmFsdWUpIHtcbiAgICAgIG91dHB1dCArPSB2YWx1ZVtwcm9wXTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfSk7XG59O1xuIl19
