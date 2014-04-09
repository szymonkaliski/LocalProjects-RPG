define([
	"backbone"
], function(Backbone) {
	return Backbone.Model.extend({
		idAttribute: "_id",
		baseUrl: "/api/token",

		url: function() {
			return this.baseUrl + "/" + this.id;
		},

		defaults: {
			"name": null
		}
	});
});
