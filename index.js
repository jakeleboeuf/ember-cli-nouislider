/* jshint node: true */
'use strict';
var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var map = require('broccoli-stew').map;

module.exports = {
  name: 'ember-cli-nouislider',

  included: function() {
    this._super.included.apply(this, arguments);
    this._ensureThisImport();

    if (!process.env.EMBER_CLI_FASTBOOT) {
      this.import('vendor/nouislider.js');
      this.import('vendor/nouislider.min.css');
      this.import('vendor/shims/nouislider.js');
    }
  },

  treeForVendor: function(vendorTree) {
    var nouisliderTree = new Funnel(
      path.dirname(require.resolve('nouislider/distribute/nouislider.js'))
    );

    browserVendorLib = map(
      browserVendorLib,
      content => `if (typeof FastBoot === 'undefined') { ${content} }`
    );

    return new MergeTrees([vendorTree, nouisliderTree]);
  },

  treeForStyles: function(vendorTree) {
    var nouisliderTree = new Funnel(
      path.dirname(require.resolve('nouislider/distribute/nouislider.min.css'))
    );

    browserVendorLib = map(
      browserVendorLib,
      content => `if (typeof FastBoot === 'undefined') { ${content} }`
    );

    return new MergeTrees([vendorTree, nouisliderTree]);
  },

  _ensureThisImport: function() {
    if (!this.import) {
      this._findHost = function findHostShim() {
        var current = this;
        var app;
        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));
        return app;
      };
      this.import = function importShim(asset, options) {
        var app = this._findHost();
        app.import(asset, options);
      };
    }
  }
};
