/**
 * Dependencies
 */
var path     = require('path')
,   Stream   = require('stream')
,   Busboy   = require('busboy')
,   Promise  = require('bluebird')
,   errbot   = require('errbot')
,   async    = require('async')
,   includes = require('lodash.includes')
,   extend   = require('ampersand-class-extend');

/**
 * Base Class
 */
class Glimmer {
  static register (key, uploader) {
    this.uploaders[key] = uploader;
  }

  static parse (context, options, done) {
    options = options || {};
    context = context.req || context;

    var self   = this
    ,   meta   = options.meta || {}
    ,   parser = new Busboy({ headers: context.headers })
    ,   deferred;

    delete options.meta;

    context.pipe(parser);

    deferred = new Promise(function (resolve, reject) {
      var count = 0
      ,   files = {}
      ,   onEnd;

      onEnd = function () {
        if (0 !== count) return;
        return resolve(files);
      };

      parser.on('error', function (err) {
        return reject(err);
      });

      parser.on('file', function (fieldname, stream, filename, enc, mime) {
        let mapping  = options[fieldname]
        ,   Uploader = self.uploaders[mapping];

        if (!filename || !mapping || !Uploader) return stream.resume();

        count++;

        new Uploader(stream, filename, meta).save().then(function (stored) {
          count--;
          files[fieldname] = stored;
          onEnd();
        }, function (err) {
          return reject(err);
        });
      });

      parser.on('finish', function () {
        onEnd();
      });
    });

    if (done) {
      deferred.then(function (stored) {
        done(null, stored);
      }, done);
    }

    return deferred;
  }
}

Glimmer.uploaders = {};

/**
 * Uploader
 */
class Uploader {
  constructor (source, filename, meta) {
    if (!source) throw new Error('Please pass a source stream.');

    this.source       = source;
    this.input        = new Stream.PassThrough();
    this.filename     = filename;
    this.meta         = meta || {};
    this.transformers = [];
    this.extensions   = [];

    this.source.pipe(this.input);
    this.configure();
  }

  configure () {}

  accepts (extensions) {
    if (Array.isArray(extensions)) {
      this.extensions = extensions;
    } else {
      this.extensions = [extensions];
    }
  }

  validate () {
    if (!this.extensions.length) return true;

    return includes(
      this.extensions,
      path.extname(this.filename).slice(1)
    );
  }

  transform (method) {
    this.transformers.push(method);
  }

  save () {
    var self = this;

    return new Promise(function (resolve, reject) {
      if (!self.validate()) {
        return reject(errbot.badRequest('Please try another file type.'));
      }

      async.map(self.transformers, function (transformer, next) {
        if (!this[transformer]) return next();
        this[transformer](next)
      }.bind(self), function (err, saved) {
        if (err) return reject(err);
        resolve(saved);
      });
    });
  }
}

/**
 * Class Methods
 */
Uploader.extend = extend;

/**
 * Expose Glimmer
 */
exports = module.exports = Glimmer;
exports.Uploader = Uploader;
