define([
	"backbone",
	"models/game"
], function(Backbone, GameModel) {
	return Backbone.Collection.extend({
		model: GameModel,
		url: "/api/game"
	});
});
