define([
	"jquery",
	"backbone"
], function($, Backbone) {
	return Backbone.Router.extend({
		routes: {
			"*actions": "defaultAction"
		},

		defaultAction: function() {
			console.log("HELLO WORLD");
		},
	});
});
