twigjs-drupal8
==============
[![Build Status](https://travis-ci.org/eiriksm/twigjs-drupal8.svg?branch=master)](https://travis-ci.org/eiriksm/twigjs-drupal8)
[![Code Climate](http://img.shields.io/codeclimate/github/eiriksm/twigjs-drupal8.svg)](https://codeclimate.com/github/eiriksm/twigjs-drupal8)
[![Dependency Status](https://david-dm.org/eiriksm/twigjs-drupal8.svg?theme=shields.io)](https://david-dm.org/eiriksm/twigjs-drupal8)

Working theme for Drupal 8 that uses twig for templates both server side and client side.

First page load is a regular one. You get the page as rendered by Drupal.

Subsequent clicks on either the or logo, site name will load the /node page via a view with a REST output. Clicks on nodes will load the node via the REST module.

## Installation
- Install Drupal as usual.
- Enable the required modules and this theme (for example with drush: `drush en hal rest twigjs_drupal8 -y`)
- Grant the permission of requesting nodes via REST to anonymous users: (`drush rap "anonymous" "restful get entity:node" -y`)
- Set this theme as the default one: (`drush cset system.theme default twigjs_drupal8 -y`)
- Probably disable some blocks that clutters up the page.
- Generate some content (For example with devel generate).

## Demo
There is a demo site of this theme up at [twigjs-drupal8.orkjern.com](http://twigjs-drupal8.orkjern.com)

## Quirks, bugs, hacks
This is just a quick proof of concept. Quite often you want to combine this maybe with a framework, and maybe not brute-force all those events onto the elements. Also, this has not been tested in other browsers than Chrome and Firefox. Your milage may vary.

Things that are not implemented at all:
- Pager on the front page.
- Reattach quick edit links and events.
- Translation of templates.
- Probably a whole lot more.

So keep that in mind. This is just a quick hack and not production code. If you want to help implement some of these things in the demo, that sounds swell. Pull requests welcome.

