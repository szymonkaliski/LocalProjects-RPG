define([
	"jquery",
	"backbone",
	"collections/games",
	"collections/questions",
	"collections/tokens",
	"views/cmsQuestions",
	"views/cmsTokens"
], function($, Backbone, Games, Questions, Tokens, CMSQuestionsView, CMSTokensView) {
	return Backbone.Router.extend({
		currentView: null, // save current view

		questions: null,   // questions collection
		tokens: null,      // tokens collection
		games: null,       // games collection

		routes: {
			"cms/game(/:id)": "cmsGame",
			"cms/question(/:id)": "cmsQuestion",
			"cms/token(/:id)": "cmsToken",
			"game/:id": "renderGame",
			"*actions": "defaultAction"
		},

		initialize: function() {
			// ASSUMPTION: all three collections are relatively small,
			// fetching them all at beginning shouldn't make an impact;
			// this might change in the future

			this.tokens = new Tokens();
			this.tokens.fetch();

			this.questions = new Questions();
			this.questions.fetch();

			this.games = new Games();
			this.games.fetch();
		},

		cmsGame: function(id) {
			console.log("Game for: " + id);
		},

		cmsQuestion: function(id) {
			this.currentView = new CMSQuestionsView({ "id": id, "tokens": this.tokens, "questions": this.questions });
		},

		cmsToken: function(id) {
			this.currentView = new CMSTokensView({ "id": id, "tokens": this.tokens });
		},

		renderGame: function(id) {
			console.log("GAME");
		},

		defaultAction: function() {
			console.log("HELLO WORLD");
		},
	});
});
