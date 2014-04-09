define([
	"backbone",
	"models/token"
], function(Backbone, TokenModel) {
	return Backbone.Collection.extend({
		model: TokenModel,
		url: "/api/token"
	});
});
