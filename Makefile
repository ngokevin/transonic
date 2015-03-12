-include node_modules/marketplace-gulp/Makefile

SLIMERJSLAUNCHER ?= /Applications/Firefox.app/Contents/MacOS/firefox

jshint:
	node_modules/.bin/jshint src/media/js tests/

unittest:
	node_modules/karma/bin/karma start --single-run

unittest-watch:
	node_modules/karma/bin/karma start

uitest-phantom:
	PATH=node_modules/.bin:${PATH} casperjs test tests/ui/ --includes=tests/lib/shim.js

uitest-slimer:
	PATH=node_modules/.bin:${PATH} casperjs test tests/ui/ --includes=tests/lib/shim.js --engine=slimerjs
