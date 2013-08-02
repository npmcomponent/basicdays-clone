'use strict';

var should = require('should'),
    clone = require('../clone');

describe('clone', function() {
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

        var subject = clone(stub).foo = 'baz';
        subject.foo.should.not.equal(stub.foo);
        subject.foo.should.equal('baz');
        stub.foo.should.equal('bar');
    });
});
