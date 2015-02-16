var telecast = require('telecast')
,   Glimmer  = require('../../')
,   ImageUploader;

ImageUploader = Glimmer.Uploader.extend({
  configure: function () {
    this.accepts(['jpg']);
    this.transform('upload');
  },
  upload: function (next) {
    var upload = telecast.put('avatar.jpg');

    upload.on('error', function (err) {
      return next(err);
    });

    upload.on('success', function (stored) {
      return next(null, stored);
    });

    this.input.pipe(upload);
  }
});

Glimmer.register('ImageUploader', ImageUploader);

module.exports = ImageUploader;
