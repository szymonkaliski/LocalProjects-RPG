require.config({
	baseUrl: "scripts",
	paths: {
		"text": "libraries/text",
		"jquery": "libraries/jquery",
		"backbone": "libraries/backbone",
		"underscore": "libraries/underscore",
		"bootstrapModal": "libraries/modal",
		"paper": "libraries/paper-full"
	},
	shim: {
		"bootstrapModal": {
			deps: [ "jquery" ],
			exports: "$.fn.modal"
		}
	}
});

require([
	"jquery",
	"backbone",
	"router"
], function($, Backbone, Router) {
	new Router();
	Backbone.history.start();
});
