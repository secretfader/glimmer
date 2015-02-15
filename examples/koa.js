var path     = require('path')
,   telecast = require('telecast')
,   Glimmer  = require('../')
,   app      = require('koa')()

/**
 * Define Uploaders
 */
var ImageUploader = Glimmer.Uploader.extend({
  configure: function () {
    // Register transform callbacks.
    this.transform('avatar');
  },
  avatar: function (next) {
    /**
     * Access input stream through `this.stream`.
     * On success, return next(null, saved).
     * Return next(err) on failure or error.
     */
    var upload = telecast.put('avatar.jpg');

    upload.on('error', function (err) {
      return next(err);
    });

    upload.on('success', function (stored) {
      next(null, stored);
    });

    this.input.pipe(upload);
  }
});

/**
 * Register Uploader
 */
Glimmer.register('ImageUploader', ImageUploader);

/**
 * Middleware/Routes
 */
app.use(require('koa-static')(path.join(__dirname, 'public')));

app.use(function *() {
  if (!this.is('multipart/*')) throw new Error('Request must be multipart.');

  var files = yield Glimmer.parse(this, {
    avatar: 'ImageUploader'
  });

  this.body = files;
});

/**
 * Boot App
 */
app.listen(process.env.PORT || 9292);
