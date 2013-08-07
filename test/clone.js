'use strict';

require('should');
var clone = require('../');

describe('clone(obj)', function() {
	it('should clone a simple object', function() {
		var stub = {
			foo: 'bar'
		};

		var subject = clone(stub);
		subject.foo.should.equal(stub.foo);
	});

	it('should clone a simple object and can edit it', function() {
		var stub = {
			foo: 'bar'
		};

		var subject = clone(stub);
		subject.foo = 'baz';
		subject.foo.should.not.equal(stub.foo);
		subject.foo.should.equal('baz');
		stub.foo.should.equal('bar');
	});
});

describe('clone(array)', function() {

});

describe('clone(date)', function() {

});

describe('clone(regex)', function() {

});
