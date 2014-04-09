define([
	"backbone"
], function(Backbone) {
	return Backbone.Model.extend({
		idAttribute: "_id",
		baseUrl: "/api/question",

		url: function() {
			return this.baseUrl + "/" + this.id;
		},

		// TODO: set question defaults
		defaults: {
		}
	});
});
