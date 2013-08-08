/** @module */
'use strict';

var type;
try {
	type = require('type');
} catch(ex) {
	type = require('type-component');
}

/**
 * Copies one object into a new one.
 *
 * Supports recreating `Date` and `Array`. Array contents are themselves cloned as well.
 *
 * Will attempt to clone `Object`. An object's properties are by default only shallowly copied. In order to copy
 * the all its prototypes into new objects with the same inheritance, set `deepCopy` to true. If the base object
 * inherits `Object.prototype`, the clone will reference `Object.prototype`, not a clone of `Object.prototype`.
 *
 * Cloning classes ("typed" objects), especially with crazy inheritance
 * structures, are not fully supported. You should use the object's originating constructor or just pass the
 * reference to the same object.
 *
 * `Function`, `Arguments`, `RegExp`, and DOM nodes will be passed back. Cloning functions is not supported due to the
 * complexities of inheritance and closures.
 *
 * Cloning some of the built-in object "types" is untested and unsupported at this time (e.g. `NaN`, `Error`, `null`).
 *
 * @param {*} srcObj the object to copy
 * @param {Boolean} [deepCopy] whether to do a shallow copy or a deep copy
 * @returns {*} the newly cloned object
 */
function clone(srcObj, deepCopy) {
	switch (type(srcObj)) {
		case 'date':
			return cloneDate(srcObj);
		case 'array':
			return cloneArray(srcObj);
		case 'object':
			return cloneObject(srcObj, deepCopy);
		default:
			//should be boolean, function, number, string, etc.
			return srcObj;
	}
}
exports = module.exports = clone;

/**
 * modified from component/clone - MIT
 *
 * @param {Array} srcObj
 * @returns {Array}
 */
function cloneArray(srcObj) {
	var destObj = new Array(srcObj.length);
	for (var i = 0; i < srcObj.length; i++) {
		destObj[i] = clone(srcObj[i]);
	}
	return destObj;
}

/**
 * from component/clone - MIT
 *
 * @param {Date} srcObj
 * @returns {Date}
 */
function cloneDate(srcObj) {
	return new Date(srcObj.getTime());
}

/**
 * @param {Object} srcObj
 * @param {Boolean} [deepCopy]
 * @returns {Object}
 */
function cloneObject(srcObj, deepCopy) {
	var properties = Object.getOwnPropertyNames(srcObj),
		parent = Object.getPrototypeOf(srcObj),
		destProperties = {},
		destObj;

	properties.forEach(function(property) {
		var descriptor = Object.getOwnPropertyDescriptor(srcObj, property);
		if (descriptor.value) {
			descriptor.value = clone(descriptor.value);
		}
		destProperties[property] = descriptor;
	});

	if (deepCopy && parent && parent !== Object.prototype) {
		parent = clone(Object.getPrototypeOf(srcObj), deepCopy);
	}
	destObj = Object.create(parent, destProperties);
	setObjExtensible(srcObj, destObj, deepCopy);
	return destObj;
}

/**
 * Directly sets a cloned object's extension properties to match it's source object.
 *
 * @param {Object} srcObj
 * @param {Object} destObj
 * @param {Boolean} [deepCopy]
 */
function setObjExtensible(srcObj, destObj, deepCopy) {
	if (!Object.isExtensible(srcObj)) {
		Object.preventExtensions(destObj);
	}
	if (deepCopy && Object.getPrototypeOf(srcObj)) {
		setObjExtensible(Object.getPrototypeOf(srcObj), Object.getPrototypeOf(destObj));
	}
}
