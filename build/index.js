"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Dependencies
 */
var path = require("path"),
    Stream = require("stream"),
    Busboy = require("busboy"),
    Promise = require("bluebird"),
    errbot = require("errbot"),
    async = require("async"),
    includes = require("lodash.includes"),
    extend = require("ampersand-class-extend");

/**
 * Base Class
 */
var Glimmer = (function () {
  function Glimmer() {
    _classCallCheck(this, Glimmer);
  }

  _prototypeProperties(Glimmer, {
    register: {
      value: function register(key, uploader) {
        this.uploaders[key] = uploader;
      },
      writable: true,
      configurable: true
    },
    parse: {
      value: function parse(context, options, done) {
        options = options || {};
        context = context.req || context;

        var self = this,
            meta = options.meta || {},
            parser = new Busboy({ headers: context.headers }),
            deferred;

        delete options.meta;

        context.pipe(parser);

        deferred = new Promise(function (resolve, reject) {
          var count = 0,
              files = {},
              onEnd;

          onEnd = function () {
            if (0 !== count) return;
            return resolve(files);
          };

          parser.on("error", function (err) {
            return reject(err);
          });

          parser.on("file", function (fieldname, stream, filename, enc, mime) {
            var mapping = options[fieldname],
                Uploader = self.uploaders[mapping];

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

          parser.on("finish", function () {
            onEnd();
          });
        });

        if (done) {
          deferred.then(function (stored) {
            done(null, stored);
          }, done);
        }

        return deferred;
      },
      writable: true,
      configurable: true
    }
  });

  return Glimmer;
})();

Glimmer.uploaders = {};

/**
 * Uploader
 */
var Uploader = (function () {
  function Uploader(source, filename, meta) {
    _classCallCheck(this, Uploader);

    if (!source) throw new Error("Please pass a source stream.");

    this.source = source;
    this.input = new Stream.PassThrough();
    this.filename = filename;
    this.meta = meta || {};
    this.transformers = [];
    this.extensions = [];

    this.source.pipe(this.input);
    this.configure();
  }

  _prototypeProperties(Uploader, null, {
    configure: {
      value: function configure() {},
      writable: true,
      configurable: true
    },
    accepts: {
      value: function accepts(extensions) {
        if (Array.isArray(extensions)) {
          this.extensions = extensions;
        } else {
          this.extensions = [extensions];
        }
      },
      writable: true,
      configurable: true
    },
    validate: {
      value: function validate() {
        if (!this.extensions.length) {
          return true;
        }return includes(this.extensions, path.extname(this.filename).slice(1));
      },
      writable: true,
      configurable: true
    },
    transform: {
      value: function transform(method) {
        this.transformers.push(method);
      },
      writable: true,
      configurable: true
    },
    save: {
      value: function save() {
        var self = this;

        return new Promise(function (resolve, reject) {
          if (!self.validate()) {
            return reject(errbot.badRequest("Please try another file type."));
          }

          async.map(self.transformers, (function (transformer, next) {
            if (!this[transformer]) return next();
            this[transformer](next);
          }).bind(self), function (err, saved) {
            if (err) return reject(err);
            resolve(saved);
          });
        });
      },
      writable: true,
      configurable: true
    }
  });

  return Uploader;
})();

/**
 * Class Methods
 */
Uploader.extend = extend;

/**
 * Expose Glimmer
 */
exports = module.exports = Glimmer;
exports.Uploader = Uploader;