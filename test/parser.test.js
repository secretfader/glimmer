var fs      = require('fs')
,   path    = require('path')
,   expect  = require('chai').expect
,   request = require('supertest')
,   app     = require('koa')()
,   Glimmer = require('../')
,   MediaUploader, ImageUploader;

MediaUploader = require(path.join(__dirname, 'lib/media_uploader'));
ImageUploader = require(path.join(__dirname, 'lib/image_uploader'));

app.use(function * () {
  this.body = yield Glimmer.parse(this, {
    avatar: 'ImageUploader'
  });
});

describe('Glimmer: Parser', function () {
  it('should parse and store the provided files', function (done) {
    request(app.listen())
      .post('/')
      .attach('avatar', path.join(__dirname, 'support/avatar.jpg'))
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.have.key('avatar');
        done();
      });
  });

  it('should ignore fields that are not provided', function (done) {
    request(app.listen())
      .post('/')
      .attach('avatar', path.join(__dirname, 'support/avatar.jpg'))
      .attach('junk', path.join(__dirname, 'support/avatar.jpg'))
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.have.key('avatar');
        expect(res.body).to.not.have.key('junk');
        done();
      });
  })
});
