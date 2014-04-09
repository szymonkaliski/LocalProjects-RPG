define([
	"backbone",
	"models/question"
], function(Backbone, QuestionModel) {
	return Backbone.Collection.extend({
		model: QuestionModel,
		url: "/api/question"
	});
});
