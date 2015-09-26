# Cold Front
![Cold Front](/src/content/cold-front.png?raw=true)
*A simple starting point for front-end sites*

__Cold Front__ is a starter kit for building front-end websites that use:

* gulp as a task runner and builder
* browserify to bundle up client-side scripts
* babelify to support ES6 and React
* a js linter 
* watchify to automatically rebuild during development
* less for css
* a simple directory structure for js/css/content
* source maps keep your js debuggable despite all the transpiling and bunding going on
* a config script to include environment-specific settings such as API urls

## What is not
__Cold Front__ tries not to make any opinions on runtime frameworks. So you will not find any references to things like jQuery, Bootstrap, Angular, React, or what-have-you.

## Installation

	git clone https://github.com/InfinitiesLoop/coldfront.git
	cd coldfront
	npm install

## Building

Build and watch for changes:

	gulp

Just build:

	gulp build