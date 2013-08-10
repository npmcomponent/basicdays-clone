'use strict';

require('should');
var clone = require('../');

describe('clone()', function() {
	it('should return a cloner', function() {
		var cloner = clone();
		cloner.should.be.ok;
		cloner.from.should.be.ok;
	});
});

describe('clone(string)', function() {
	it('should pass back', function() {
		var stub = 'the dude';

		var subject = clone(stub);
		subject.should.eql(stub);
		subject.should.equal(stub);
	});
});

describe('clone(number)', function() {
	it('should pass back', function() {
		var stub = 42;

		var subject = clone(stub);
		subject.should.eql(stub);
		subject.should.equal(stub);
	});
});

describe('clone(boolean)', function() {
	it('should pass back', function() {
		var stub = true;

		var subject = clone(stub);
		subject.should.eql(stub);
		subject.should.equal(stub);
	});
});

describe('clone(regex)', function() {
	it('should pass back', function() {
		var stub = /the dude/g;

		var subject = clone(stub);
		subject.should.eql(stub);
		subject.should.equal(stub);
	});
});

describe('clone(array)', function() {
	it('should clone an empty array', function() {
		var stub = [];

		var subject = clone(stub);
		subject.should.eql(stub);
		subject.should.not.equal(stub);

		subject[0] = 42;
		subject.should.not.eql(stub);
		subject.should.not.equal(stub);
	});

	it('should clone a filled array', function() {
		var stub = [1, 2, 3, 5, 7];

		var subject = clone(stub);
		subject.should.eql(stub);
		subject.should.not.equal(stub);

		subject[0] = 42;
		subject.should.not.eql(stub);
		subject.should.not.equal(stub);
	});

	it('should clone array contents by value by default', function() {
		var stub = [new Date(2013, 8, 1)];

		var subject = clone(stub);
		subject.should.eql(stub);
		subject.should.not.equal(stub);

		subject[0].setFullYear(1990);
		stub[0].should.eql(new Date(1990, 8, 1));
		subject[0].should.eql(new Date(1990, 8, 1));
	});

	it('should clone array contents if includeArray is set', function() {
		var stub = [new Date(2013, 8, 1)];

		var subject = clone().includeArrays.from(stub);
		subject.should.eql(stub);
		subject.should.not.equal(stub);

		subject[0].setFullYear(1990);
		stub[0].should.eql(new Date(2013, 8, 1));
		subject[0].should.eql(new Date(1990, 8, 1));
	});
});

describe('clone(date)', function() {
	it('should recreate a new equivalent date', function() {
		var stub = new Date(2013, 8, 1);

		var subject = clone(stub);
		subject.should.eql(stub);
		subject.should.not.equal(stub);

		subject.setFullYear(1990);
		subject.should.not.eql(stub);
		subject.should.not.equal(stub);
	});
});

describe('clone(object)', function() {
	describe('without deep cloning', function() {
		it('should clone a simple object', function() {
			var stub = {
				spam: 'eggs'
			};

			var subject = clone(stub);
			subject.should.eql(stub);
		});

		it('should clone a simple object and can edit it separately', function() {
			var stub = {
				foo: 'bar'
			};

			var subject = clone(stub);
			subject.foo = 'baz';
			subject.foo.should.not.equal(stub.foo);
			subject.foo.should.equal('baz');
			stub.foo.should.equal('bar');
		});

		it('should clone dates in an object', function() {
			var stub = {
				time: new Date(2013, 1, 1)
			};

			var subject = clone(stub);
			subject.time.should.not.equal(stub.time);
			subject.time.setFullYear(1990);
			subject.time.getFullYear().should.equal(1990);
			stub.time.getFullYear().should.equal(2013);
		});

		it('should clone number arrays in an object', function() {
			var stub = {
				nums: [1, 2, 3, 5, 7]
			};

			var subject = clone(stub);
			subject.nums.should.eql(stub.nums);
			subject.nums.should.not.equal(stub.nums);

			subject.nums[0] = 42;
			subject.nums.should.not.eql(stub.nums);
			subject.nums.should.not.equal(stub.nums);
		});

		it('should clone date arrays in an object by value', function() {
			var stub = {
				times: [new Date(2013, 8, 1)]
			};

			var subject = clone(stub);
			subject.times.should.eql(stub.times);
			subject.times.should.not.equal(stub.times);

			subject.times[0].setFullYear(1990);
			stub.times[0].should.eql(new Date(1990, 8, 1));
			subject.times[0].should.eql(new Date(1990, 8, 1));
		});

		it('should copy a constructed object, but reference the same prototype', function() {
			var StubClass1 = function() {
				this.spam = 'eggs';
			};
			StubClass1.prototype.funky1 = function() {};
			var StubClass2 = function() {
				StubClass1.call(this);
				this.foo = 'bar';
			};
			StubClass2.prototype = Object.create(StubClass1.prototype);
			StubClass2.prototype.constructor = StubClass2;
			StubClass2.prototype.funky2 = function() {};
			var newObject = new StubClass2();

			var newSubject = clone(newObject);

			newSubject.constructor.should.equal(StubClass2);
			newSubject.should.eql(newObject);
			newSubject.should.not.equal(newObject);

			var subject2 = Object.getPrototypeOf(newSubject);
			subject2.should.equal(StubClass2.prototype);
		});
	});

	describe('with deep cloning', function() {
		it('should copy the object and it\'s prototypes, but not global Object.prototype', function() {
			var stub1 = {
				spam: 'eggs'
			};
			var stub2 = Object.create(stub1);
			stub2.foo = 'bar';

			var subject2 = clone().includeInheritance.from(stub2, true);
			subject2.should.eql(stub2);
			subject2.should.not.equal(stub2);

			var subject1 = Object.getPrototypeOf(subject2);
			subject1.should.eql(stub1);
			subject1.should.not.equal(stub1);

			var subjectBase = Object.getPrototypeOf(subject1);
			subjectBase.should.equal(Object.prototype);
		});

		it('should copy a constructed object and it\'s prototypes, but reference the same constructors', function() {
			var StubClass1 = function() {
				this.spam = 'eggs';
			};
			StubClass1.prototype.funky1 = function() {};
			var StubClass2 = function() {
				StubClass1.call(this);
				this.foo = 'bar';
			};
			StubClass2.prototype = Object.create(StubClass1.prototype);
			StubClass2.prototype.constructor = StubClass2;
			StubClass2.prototype.funky2 = function() {};
			var newObject = new StubClass2();

			var newSubject = clone().includeInheritance.from(newObject, true);

			newSubject.constructor.should.equal(StubClass2);
			newSubject.should.eql(newObject);
			newSubject.should.not.equal(newObject);

			var subject2 = Object.getPrototypeOf(newSubject);
			subject2.funky2.should.equal(StubClass2.prototype.funky2);
			subject2.constructor.should.equal(StubClass2);
			subject2.should.eql(StubClass2.prototype);
			subject2.should.not.equal(StubClass2.prototype);

			var subject1 = Object.getPrototypeOf(subject2);
			subject1.funky1.should.equal(StubClass1.prototype.funky1);
			subject1.constructor.should.equal(StubClass1);
			subject1.should.eql(StubClass1.prototype);
			subject1.should.not.equal(StubClass1.prototype);

			var subjectBase = Object.getPrototypeOf(subject1);
			subjectBase.should.equal(Object.prototype);
		});
	});
});
