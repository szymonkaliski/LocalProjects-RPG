define([
	"jquery",
	"backbone",
	"collections/games",
	"collections/questions",
	"collections/tokens",
	"views/cmsGames",
	"views/cmsQuestions",
	"views/cmsTokens",
	"views/game"
], function($, Backbone, Games, Questions, Tokens, CMSGamesView, CMSQuestionsView, CMSTokensView, GameView) {
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
			_.bindAll(this, "switchToView");

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

		switchToView: function(view, options) {
			if (this.currentView) {
				this.currentView.remove();
			}

			if ($("#main").length === 0) {
				$("body").append("<div id='main'></div>");
			}

			this.currentView = new view(options);
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
			this.switchToView(GameView, { "id": id, "games": this.games, "questions": this.questions, "tokens": this.tokens });
		},

		defaultAction: function() {
			// redirect to game cms by default
			window.location = "#cms/game";
		},
	});
});
