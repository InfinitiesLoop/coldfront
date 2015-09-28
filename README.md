# Cold Front
![Cold Front](/src/content/cold-front.png?raw=true)
*A simple starting point for building front-end sites*

__Cold Front__ is a starter kit for building front-end websites that features:

* gulp as a task runner and builder
* browserify to bundle up client-side scripts and allow for npm package imports
* babelify to support ES6 and React
* uglify for javascript minification
* a js linter 
* watchify to automatically rebuild during development
* less for css
* a simple directory structure for js/css/content
* source maps keep your js and css debuggable despite all the transpiling and bunding going on
* a config script to include environment-specific settings such as API urls
* automatically generated cache-busting file paths so you can tell browsers to cache assets forever
* produces a clean build output that can be deployed to multiple environments without rebuilding

## What is not
__Cold Front__ tries not to make any opinions on runtime frameworks. So you will not find any references to things like jQuery, Bootstrap, Angular, React, or what-have-you. The only runtime requirement is **browserify** to enable importing of NPM packages, and whatever polyfils **babel** injects for ES6->ES5 transpiling.

Cold Front makes no assumptions about what server tech you want to use. Many starter kits will use something like gulp-open and gulp-connect in order to automatically host and launch your application during development time. But I'd rather map an IIS site to my repo and be done with it. Gulp-open sounds nice, but you just end up with many duplicate tabs as it blindly reopens the app for you every time it runs. If you really want something like that, it's super easy to add to your own gulpfile, I just don't think it belongs in a starter kit!

## Installation

	git clone https://github.com/InfinitiesLoop/coldfront.git
	cd coldfront
	npm install

## Configuration Done Right

Cold Front defines a config.js module that can contain environment-specific settings, such as API keys, URLs, etc. However, a good build and deployment system is one that does not force you to check in things like that! *Your project build output should be environment-agnostic.* Environment specific configuration is a property of the *deployment* of the application, *not a part of how it is built.*

Many apps get this wrong by defining special environment-specific hooks in the build system. For example, using an Environment Variable accessed via gulp to swap out a file at build time. 

You should be able to build your application once, and then deploy the output to any environment you like. If your build output includes environment-specific configuration values, then you can't really do that.

That being said, it's also desirable to have a frictionless development experience. You should be able to build the application and easily run it locally. New team members should be able to pull it down and be up and running with little to no manual steps.

How then, can we have a build output that runs locally, and is thus a development environment build output, but still have an environment-agnostic build output?

We will make a compromise and use convention. 

The config.js module will contain development environment configuration values. This file should basically be an advertisement for all the configuration knobs your application has, where the values are sensible defaults. As such, it should have every possible configuration setting defined, even if no default value is necessary, and it should be heavily commented.

The deployment system then will be given the responsibility of replacing the config module with one for the appropriate the environment it is deploying the application to. There are many examples out there of build tasks designed for production output, so this may seem like a cop-out, but it's the right way to do it! You shouldn't be checking in production configuration values, and you shouldn't be mixing environment related configuration, a deployment concern, with build concerns.

This means that the configuration module must not be bundled in with the rest of your application! The deployment system can't replace the file if it's been bundled. So the config module is included separately than the rest of the application, and defines a global variable. This could possibly be replaced with a module loader that works at run-time, but Browserify does not support run-time package resolution, and introducing one for just this purpose would be way overkill.


## Building

Build and automatically watch for changes:

	gulp watch

Just build:

	gulp build

Or just:

    gulp


## TODO

* js linting and/or hinting
* sourcemaps for LESS transformations
* Probably simplify how the watching works
* Test errors to ensure the output is helpful when things go wrong
* Add a starter test suite
* Better logo and an index page that explains how to use the starter kit to start building your own site
* A gulp task that creates a new repo for you to start building from

