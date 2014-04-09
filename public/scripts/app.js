require.config({
	baseUrl: "scripts",
	paths: {
		"text": "libraries/text",
		"jquery": "libraries/jquery",
		"backbone": "libraries/backbone",
		"underscore": "libraries/underscore"
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
