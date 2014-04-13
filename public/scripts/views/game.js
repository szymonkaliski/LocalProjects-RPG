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
			"click .no": "answerClicked",
			"click .play-again": "restartGame"
		},

		initialize: function(options) {
			_.bindAll(this, "render", "renderQuestion", "renderEndScreen", "answerClicked", "restartGame");

			// save options
			this.options = options;

			// start question
			this.currentQuestion = 0;

			// re-render on collection sync
			var rerender = _.debounce(function() {
				this.model = this.options.games.get(this.options.id);

				// get individual tokens affected by this games questions
				if (this.model)  {
					this.gameTokens = this.model.get("questions")
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

					// get property from array of objects
					var indexOfProp = function(array, prop, value) {
						return array.map(function(object) {
							return object[prop];
						}).indexOf(value);
					};

					// below is naive way of finding maximal and minimal possible outcome
					// for token in given game
					var maxValues = this.gameTokens.map(function(token) {
						return { "id": token.id, "max": 0, "min": 0 };
					});

					this.model.get("questions")
						.map(function(questionID) {
							var question = this.options.questions.get(questionID);

							for (var key in question.get("tokens")) {
								var index = indexOfProp(maxValues, "id", key);
								var val = question.get("tokens")[key];

								if (index > 0) {
									var max = Math.max(val.yes, val.no);
									var min = Math.min(val.yes, val.no);

									if (max > 0) maxValues[index].max += max;
									if (min < 0) maxValues[index].min += min;
								}
							}
						}.bind(this));

					this.minValue = maxValues.reduce(function(memo, value) {
						return (value.min < memo) ? value.min : memo;
					}, 0);

					this.maxValue = maxValues.reduce(function(memo, value) {
						return (value.max > memo) ? value.max : memo;
					}, 0);
				}

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
			this.$gameActive = this.$el.find(".game-active");
			this.$gameFinished = this.$el.find(".game-finished");

			// render first question
			this.renderQuestion();

			// setup paper game
			this.gamePaper = new GamePaper(
				this.$canvas,
				this.gameTokens,
				"green",
				this.minValue,
				this.maxValue
			);
		},

		renderQuestion: function() {
			var gameQuestions = this.model.get("questions");

			if (this.currentQuestion === gameQuestions.length - 1) {
				this.renderEndScreen();
			}
			else {
				var question = this.options.questions.get(gameQuestions[this.currentQuestion]);
				this.$question.text(question.get("name"));
			}
		},

		renderEndScreen: function() {
			this.$gameActive.hide();
			this.$gameFinished.show();
		},

		answerClicked: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var $event = $(event.currentTarget);
			var answer = $event.hasClass("yes") ? "yes" : "no";

			var gameQuestions = this.model.get("questions");
			var question = this.options.questions.get(gameQuestions[this.currentQuestion]);
			var questionTokens = question.get("tokens");

			var tokenIndex = function(gameTokens, key) {
				return gameTokens.map(function(gameToken) {
					return gameToken.id;
				}).indexOf(key);
			};

			for (var key in questionTokens) {
				var val = questionTokens[key];
				var index = tokenIndex(this.gameTokens, key);
				if (index > 0) this.gamePaper.updateValue(index, val[answer]);
			}

			this.currentQuestion++;
			this.renderQuestion();
		},

		restartGame: function(event) {
			event.preventDefault();
			event.stopPropagation();

			this.currentQuestion = 0;
			this.gamePaper.reset();

			this.$gameActive.show();
			this.$gameFinished.hide();
		}
	});
});
