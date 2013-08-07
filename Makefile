build: components index.js
	@component build --dev

components: component.json
	@component install --dev

lint:
	@./node_modules/.bin/jshint **/*.js

test: lint
	@./node_modules/.bin/mocha --reporter list

clean:
	@rm -fr build components docs template.js

doc:
	@jsdoc -d ./docs ./index.js

.PHONY: lint test clean doc
