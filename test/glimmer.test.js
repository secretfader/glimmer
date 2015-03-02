var path    = require('path')
,   expect  = require('chai').expect
,   Glimmer = require('../')
,   ImageUploader;

ImageUploader = require(path.join(__dirname, 'lib/image_uploader'));

describe('Glimmer#get', function () {
  it('should return the same object', function () {
    var uploader = Glimmer.get('ImageUploader');

    expect(uploader).to.equal(ImageUploader);
  });
});
