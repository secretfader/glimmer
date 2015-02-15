var path     = require('path')
,   express  = require('express')
,   telecast = require('telecast')
,   Glimmer  = require('../')
,   app      = express();

/**
 * Define Uploaders
 */
var ImageUploader = Glimmer.Uploader.extend({
  configure: function () {
    // Register transform callbacks.
    this.transform('avatar');
    this.transform('original');
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
  },
  original: function (next) {
    var upload = telecast.put('original.jpg');

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
app.use(require('morgan')('combined'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  if (!req.is('multipart')) return next();

  Glimmer.parse(req, {
    avatar: 'ImageUploader'
  }).then(function (stored) {
    req.files = stored;
    next();
  }, function (err) {
    return next(err);
  });
});

app.post('/', function (req, res) {
  res.json(req.files);
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.code || 500).end();
});

/**
 * Boot App
 */
app.listen(process.env.PORT || 9292);
