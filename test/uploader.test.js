var fs     = require('fs')
,   path   = require('path')
,   expect = require('chai').expect
,   MediaUploader, ImageUploader;

MediaUploader = require(path.join(__dirname, 'lib/media_uploader'));
ImageUploader = require(path.join(__dirname, 'lib/image_uploader'));

describe('Glimmer Uploader: Methods', function () {
  before(function () {
    this.uploader = new MediaUploader(
      fs.createReadStream(path.join(__dirname, 'support/data.txt')),
      'data.txt'
    );
  });

  it('should have a configure() method', function () {
    expect(this.uploader.configure).to.be.a('function');
  });

  it('should have a save() method', function () {
    expect(this.uploader.save).to.be.a('function');
  });

  it('should be able to register callbacks', function () {
    expect(Object.keys(this.uploader.transformers)).to.include('avatar');
  });

  it('should store callback function names', function () {
    expect(this.uploader.avatar).to.be.a('function');
  });
});

describe('Glimmer Uploader: Validation', function () {
  it('should error if provided with a mismatched format', function (done) {
    var uploader = new ImageUploader(
      fs.createReadStream(path.join(__dirname, 'support/data.txt')),
      'data.txt'
    );

    uploader.save().then(function () {}, function (err) {
      expect(err).to.not.equal(null);
    }).finally(done);
  });

  it('should save cleanly when the format is accepted', function (done) {
    var uploader = new ImageUploader(
      fs.createReadStream(path.join(__dirname, 'support/avatar.jpg')),
      'avatar.jpg'
    );

    uploader.save().then(function (result) {
      expect(result).to.not.equal([]);
    }).finally(done);
  });
});
