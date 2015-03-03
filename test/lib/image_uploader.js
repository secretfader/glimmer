var telecast = require('telecast')
,   Glimmer  = require('../../')
,   ImageUploader;

ImageUploader = Glimmer.Uploader.extend({
  configure: function () {
    this.accepts(['jpg']);
    this.transform('upload');
    this.transform('small');
  },
  upload: function (next) {
    var output = []
    ,   upload;

    if (this.meta.id) output.push(this.meta.id);

    output.push('avatar.jpg');

    upload = telecast.put(output.join('/'));

    upload.on('error', function (err) {
      return next(err);
    });

    upload.on('success', function (stored) {
      return next(null, stored);
    });

    this.input.pipe(upload);
  },
  small: function (next) {
    var output = []
    ,   upload;

    if (this.meta.id) output.push(this.meta.id);

    output.push('avatar-small.jpg');

    upload = telecast.put(output.join('/'));

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
