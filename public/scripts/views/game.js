define([
	"jquery",
	"backbone",
	"views/gamePaper",
	"text!templates/game.tpl"
], function($, Backbone, GamePaper, ViewTemplate) {
	return Backbone.View.extend({
		el: "#main",

		events: {
			"click .yes": "answerClicked",
			"click .no": "answerClicked"
		},

		initialize: function(options) {
			_.bindAll(this, "render", "renderQuestion", "answerClicked");

			// save options
			this.options = options;

			// start question
			this.currentQuestion = 0;

			// re-render on collection sync
			var rerender = _.debounce(function() {
				this.model = this.options.games.get(this.options.id);

				// get individual tokens affected by this games questions
				if (this.model) this.gameTokens = this.model.get("questions")
					.map(function(questionID) {
						var question = this.options.questions.get(questionID);
						var questionTokens = [];
						for (var key in question.get("tokens")) {
							if (questionTokens.indexOf(key) < 0) questionTokens.push(key);
						}

						return questionTokens;
					}.bind(this))
					.reduce(function(memo, tokenList) {
						tokenList.forEach(function(tokenID) {
							if (memo.indexOf(tokenID) < 0) memo.push(tokenID);
						});

						return memo;
					}, [])
					.map(function(tokenID) {
						return this.options.tokens.get(tokenID);
					}.bind(this))
					.filter(function(token) {
						return (token !== undefined);
					});

				this.render();
			}.bind(this), 100);
			rerender();

			// reload on collection fetches
			this.options.games.on("sync", rerender);
			this.options.questions.on("sync", rerender);
			this.options.tokens.on("sync", rerender);
		},

		render: function() {
			this.$el.html(_.template(ViewTemplate));
			this.$canvas = this.$el.find(".game-canvas");
			this.$question = this.$el.find(".question");

			// render first question
			this.renderQuestion();

			// setup paper game
			this.gamePaper = new GamePaper(
				this.$canvas,
				this.gameTokens.map(function() { return 0; }),
				"red"
			);
		},

		renderQuestion: function() {
			var gameQuestions = this.model.get("questions");
			var question = this.options.questions.get(gameQuestions[this.currentQuestion]);
			this.$question.text(question.get("name"));

			this.currentQuestion = (this.currentQuestion + 1) % gameQuestions.length;
		},

		answerClicked: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var $event = $(event.currentTarget);
			var answer = $event.hasClass("yes") ? "yes" : "no";

			var gameQuestions = this.model.get("questions");
			var question = this.options.questions.get(gameQuestions[this.currentQuestion]);
			var questionTokens = question.get("tokens");

			for (var key in questionTokens) {
				var val = questionTokens[key];
				var index = this.gameTokens.map(function(gameToken) {
					return gameToken.id;
				}).indexOf(key);

				this.gamePaper.updateValue(index, val[answer]);
			}

			this.renderQuestion();
		}
	});
});
