define([
	"backbone"
], function(Backbone) {
	return Backbone.Model.extend({
		idAttribute: "_id",
		baseUrl: "/api/token",

		url: function() {
			var url = this.baseUrl;

			if (this.id) {
				url += "/" + this.id;
			}

			return url;
		},

		defaults: {
			"name": null
		}
	});
});
