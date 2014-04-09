define([
	"backbone"
], function(Backbone) {
	return Backbone.Model.extend({
		idAttribute: "_id",
		baseUrl: "/api/game",

		url: function() {
			return this.baseUrl + "/" + this.id;
		},

		// TODO: set game defaults
		defaults: {
		}
	});
});
