var path    = require('path')
,   fs      = require('fs')
,   expect  = require('chai').expect
,   Glimmer = require('../')
,   ImageUploader;

ImageUploader = require(path.join(__dirname, 'lib/image_uploader'));

describe('Glimmer#store', function () {
  it('should be a function', function () {
    expect(Glimmer.store).to.be.a('function');
  });

  describe('Promise API', function () {
    it('should upload a source stream', function (done) {
      var input = fs.createReadStream(
        path.join(__dirname, 'support/avatar.jpg')
      );

      Glimmer.store(input, 'ImageUploader', {
        id: 'xxxx'
      }).then(function (results) {
        expect(results).to.be.a('object');
        expect(Object.keys(results).length).to.not.equal(0);
      }).catch(function (err) {
        expect(err).to.equal(null);
      }).finally(function () {
        done();
      });
    });

    it('should function as expected without meta', function (done) {
      var input = fs.createReadStream(
        path.join(__dirname, 'support/avatar.jpg')
      );

      Glimmer.store(input, 'ImageUploader').then(function (results) {
        expect(results).to.be.a('object');
        expect(Object.keys(results).length).to.not.equal(0);
      }).catch(function (err) {
        expect(err).to.equal(null);
      }).finally(function () {
        done();
      });
    });
  });

  describe('Callback API', function () {
    it('should upload a source stream', function (done) {
      var input = fs.createReadStream(
        path.join(__dirname, 'support/avatar.jpg')
      );

      Glimmer.store(input, 'ImageUploader', {
        id: 'xxxx'
      }, function (err, results) {
        if (err) return done(err);

        expect(err).to.equal(null);
        expect(results).to.be.a('object');
        expect(Object.keys(results).length).to.not.equal(0);

        done();
      });
    });

    it('should function as expected without meta', function (done) {
      var input = fs.createReadStream(
        path.join(__dirname, 'support/avatar.jpg')
      );

      Glimmer.store(input, 'ImageUploader', function (err, results) {
        if (err) return done(err);

        expect(err).to.equal(null);
        expect(results).to.be.a('object');
        expect(Object.keys(results).length).to.not.equal(0);

        done();
      });
    });
  });
});
