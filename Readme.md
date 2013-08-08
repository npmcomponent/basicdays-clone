# clone

Copies an object into a new one.

## Installation

Using npm

	$ npm install up-clone

Using [Component](http://component.io):

	$ component install basicdays/clone

## API

Supports recreating `Date` and `Array`. Array contents are themselves cloned as well.

Will attempt to clone `Object`. An object's properties are by default only shallowly copied. In order to copy
the all its prototypes into new objects with the same inheritance, set `deepCopy` to true. If the base object
inherits `Object.prototype`, the clone will reference `Object.prototype`, not a clone of `Object.prototype`.

Cloning classes ("typed" objects), especially with crazy inheritance
structures, are not fully supported. You should use the object's originating constructor or just pass the
reference to the same object.

`Function`, `Arguments`, `RegExp`, and DOM nodes will be passed back. Cloning functions is not supported due to the
complexities of inheritance and closures.

Cloning some of the built-in object "types" is untested and unsupported at this time (e.g. `NaN`, `Error`, `null`).

## Notes

Influenced by: https://github.com/component/clone

## License

MIT
