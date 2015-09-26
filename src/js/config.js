// Environment configuration values go here.
// For an explaination of how to use this file, see here:
// https://github.com/InfinitiesLoop/coldfront#configuration-done-right

var config = {
	// make sure to include every possible configuration value you have, even if 
	// no default is required. And heavily document what each key means!

	// The email address that users are given when they need help
	adminEmail: "SystemHelp@example.com",

	// Configuration for the someService API
	someService: {
		appKey: "mykey",
		url: "http://someservice-dev/api/"
	},

	// Configuration for the someOtherService API
	someOtherService: {
		appKey: "myotherkey",
		url: "http://someotherservice-dev/api/"
	}
};

// Define global, so these config values can be utilized by other scripts without having to bundle this
// file in together with everything else.
window.AppConfig = config;
