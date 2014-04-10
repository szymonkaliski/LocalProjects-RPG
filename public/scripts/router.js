define([
	"jquery",
	"backbone",
	"collections/games",
	"collections/questions",
	"collections/tokens",
	"views/cmsGames",
	"views/cmsQuestions",
	"views/cmsTokens"
], function($, Backbone, Games, Questions, Tokens, CMSGamesView, CMSQuestionsView, CMSTokensView) {
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

		switchToView: function(view, options) {
			if (this.currentView) this.currentView.remove();

			this.currentView = new view(options);
		},

		initialize: function() {
			// ASSUMPTION: all three collections are relatively small,
			// fetching them all at beginning shouldn't make an impact;
			// this might change in the future

			this.games = new Games();
			this.games.fetch();

			this.questions = new Questions();
			this.questions.fetch();

			this.tokens = new Tokens();
			this.tokens.fetch();
		},

		cmsGame: function(id) {
			this.switchToView(CMSGamesView, { "id": id, "games": this.games, "questions": this.questions, "tokens": this.tokens });
		},

		cmsQuestion: function(id) {
			this.switchToView(CMSQuestionsView, { "id": id, "tokens": this.tokens, "questions": this.questions });
		},

		cmsToken: function(id) {
			this.switchToView(CMSTokensView, { "id": id, "tokens": this.tokens });
		},

		renderGame: function(id) {
			console.log("GAME");
		},

		defaultAction: function() {
			console.log("HELLO WORLD");
		},
	});
});
