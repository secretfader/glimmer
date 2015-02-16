var Glimmer = require('../../')
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

module.exports = MediaUploader;
