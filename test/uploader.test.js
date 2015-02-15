var expect  = require('chai').expect
,   Glimmer = require('../')
,   MediaUploader;

MediaUploader = Glimmer.Uploader.extend({
  configure: function () {
    this.transform('avatar');
  },
  avatar: function (next) {
    next();
  }
});

Glimmer.register('MediaUploader', MediaUploader);

describe('Glimmer Uploader Methods', function () {
  it('should have a configure method', function () {
  });
});
