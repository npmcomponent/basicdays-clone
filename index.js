'use strict';

/** @module */

/**
 * Copies one object into a new one.
 *
 * @param {Object} obj the object to copy
 * @param {Boolean} [deepCopy] whether to do a shallow copy or a deep copy
 * @returns {Object} the newly cloned object
 */
module.exports = function(obj, deepCopy) {
	var properties = Object.getOwnPropertyNames(obj),
		parent = Object.getPrototypeOf(obj),
		destProperties = {},
		destObj;
	deepCopy = deepCopy || false;

	properties.forEach(function(property) {
		destProperties[property] = Object.getOwnPropertyDescriptor(obj, property);
	});

	if (deepCopy && Object.getPrototypeOf(obj)) {
		parent = clone(Object.getPrototypeOf(obj));
	}
	destObj = Object.create(parent, destProperties);
	setExtensible(obj, destObj, deepCopy);
	return destObj;
};

/**
 * Sets an cloned object's extension properties to match it's source object.
 *
 * @param {Object} srcObj
 * @param {Object} destObj
 * @param {Boolean} [deepCopy]
 */
function setExtensible(srcObj, destObj, deepCopy) {
	deepCopy = deepCopy || false;

	if (!Object.isExtensible(srcObj)) {
		Object.preventExtensions(destObj);
	}
	if (deepCopy && Object.getPrototypeOf(srcObj)) {
		setExtensible(Object.getPrototypeOf(srcObj), Object.getPrototypeOf(destObj));
	}
}
