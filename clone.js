'use strict';

function setExtensible(srcObj, destObj, deepCopy) {
    if (!Object.isExtensible(srcObj)) {Object.preventExtensions(destObj);}
    if (deepCopy && Object.getPrototypeOf(srcObj)) {
        setExtensible(Object.getPrototypeOf(srcObj), Object.getPrototypeOf(destObj));
    }
}

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
        parent = this.clone(Object.getPrototypeOf(obj));
    }
    destObj = Object.create(parent, destProperties);
    setExtensible(obj, destObj, deepCopy);
    return destObj;
};
