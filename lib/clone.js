/** @module */
'use strict';

var type;
try {
	type = require('component-type');
} catch(ex) {
	type = require('type-component');
}

var cloneTool = {
	/**
	 * Copies one object into a new one.
	 *
	 * @param {*} srcObj the object to copy
	 * @returns {*} the newly cloned object
	 */
	from: function(srcObj) {
		switch (type(srcObj)) {
			case 'date':
				return this.cloneDate(srcObj);
			case 'array':
				return this.cloneArray(srcObj);
			case 'object':
				return this.cloneObject(srcObj);
			default:
				//should be boolean, function, number, string, etc.
				return srcObj;
		}
	},

	/**
	 * Sets clone to copy up the prototype chain.
	 * @returns {Object} this
	 */
	get includeInheritance() {
		this.attr.includeInheritance = true;
		return this;
	},

	/**
	 * Sets clone to copy array contents
	 * @returns {Object} this
	 */
	get includeArrays() {
		this.attr.includeArrays = true;
		return this;
	},

	/**
	 * Syntatic getter
	 * @returns {Object} this
	 */
	get and() {
		return this;
	},

	/**
	 * modified from component/clone - MIT
	 *
	 * @private
	 * @param {Array} srcObj
	 * @returns {Array}
	 */
	cloneArray: function(srcObj) {
		var destObj = new Array(srcObj.length);
		for (var i = 0; i < srcObj.length; i++) {
			destObj[i] = this.attr.includeArrays ? clone(srcObj[i]) : srcObj[i];
		}
		return destObj;
	},

	/**
	 * from component/clone - MIT
	 *
	 * @private
	 * @param {Date} srcObj
	 * @returns {Date}
	 */
	cloneDate: function(srcObj) {
		return new Date(srcObj.getTime());
	},

	/**
	 * @private
	 * @param {Object} srcObj
	 * @param {Boolean} [deepCopy]
	 * @returns {Object}
	 */
	cloneObject: function(srcObj) {
		var self = this,
			properties = Object.getOwnPropertyNames(srcObj),
			parent = Object.getPrototypeOf(srcObj),
			destProperties = {},
			destObj;

		properties.forEach(function(property) {
			var descriptor = Object.getOwnPropertyDescriptor(srcObj, property);
			if (descriptor.value) {
				descriptor.value = self.from(descriptor.value);
			}
			destProperties[property] = descriptor;
		});

		if (this.attr.includeInheritance && parent && parent !== Object.prototype) {
			parent = this.from(Object.getPrototypeOf(srcObj));
		}
		destObj = Object.create(parent, destProperties);
		self.setObjExtensible(srcObj, destObj);
		return destObj;
	},

	/**
	 * Directly sets a cloned object's extension properties to match it's source object.
	 *
	 * @private
	 * @param {Object} srcObj
	 * @param {Object} destObj
	 * @param {Boolean} [deepCopy]
	 */
	setObjExtensible: function(srcObj, destObj) {
		if (!Object.isExtensible(srcObj)) {
			Object.preventExtensions(destObj);
		}
		if (this.attr.includeInheritance && Object.getPrototypeOf(srcObj)) {
			this.setObjExtensible(Object.getPrototypeOf(srcObj), Object.getPrototypeOf(destObj));
		}
	}
};

/**
 * Clone function to clone objects, or retrieve a prepared clone tool.
 *
 * @param {*} [srcObj]
 * @returns {*} Cloned object if `srcObj` passed, clone tool if not.
 */
function clone(srcObj) {
	var cloner = Object.create(cloneTool);
	cloner.attr = {
		includeInheritance: false,
		includeArrays: false
	};
	if (srcObj) {
		return cloner.from(srcObj);
	} else {
		return cloner;
	}
}
exports = module.exports = clone;
exports.cloneTool = cloneTool;
