define([
	"jquery",
	"backbone",
	"models/question",
	"views/cmsQuestion",
	"text!templates/cmsQuestions.tpl"
], function($, Backbone, Question, CMSQuestionView, ViewTemplate) {
	return Backbone.View.extend({
		el: "#main",

		events: {
			"click .question-add-new": "addQuestionNew",
			"click .question-add": "addQuestion"
		},

		children: [],

		initialize: function(options) {
			_.bindAll(this, "render", "addQuestionNew", "addQuestion", "remove");

			// save options
			this.options = options;

			// render on start
			this.render();

			// re-render on collection sync
			var rerender = _.debounce(function() {
				for (var i = 0; i < this.children.length; ++i) {
					this.children[i].remove();
				}
				this.children.length = 0;

				this.render();
			}.bind(this), 10);

			this.options.questions.on("sync add remove", rerender);
		},

		render: function() {
			if ($("#main").length === 0) {
				$("body").append("<div id='main'></div>");
			}

			if (this.options.gameID) {
				this.options.game = this.options.games.get(this.options.gameID);
			}

			var gameQuestions = this.options.game ? this.options.game.get("questions") : [];

			// render basic view
			this.$el.html(_.template(ViewTemplate, {
				"game": this.options.game,
				"questions": this.options.questions.filter(function(question) {
					// display only questions that aren't already added to the game
					return (gameQuestions.indexOf(question.id) < 0);
				})
			}));
			var $questionList = this.$el.find(".question-list");

			// if view got game as option, then render only questions for this game
			if (this.options.game) {
				gameQuestions.forEach(function(gameID) {
					var model = this.options.questions.get(gameID);

					if (model) {
						var questionView = new CMSQuestionView({
							"gameID": this.options.game.id,
							"model": model,
							"tokens": this.options.tokens
						});

						this.children.push(questionView);
						$questionList.append(questionView.render().el);
					}
				}.bind(this));
			}
			// otherwise render all questions
			else {
				this.options.questions.forEach(function(question) {
					var questionView = new CMSQuestionView({
						"model": question,
						"tokens": this.options.tokens
					});

					this.children.push(questionView);
					$questionList.append(questionView.render().el);
				}.bind(this));
			}

			return this;
		},

		addQuestionNew: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var name = this.$el.find("form #question-name").val();
			if (name.length > 0) {
				var question = new Question({ "name": name });

				question.save({}, {
					"success": function(model) {
						this.options.questions.add(question);

						if (this.options.game) {
							var gameQuestions = this.options.game.get("questions");
							gameQuestions.push(model.id);

							this.options.game.set("questions", gameQuestions);
							this.options.game.save();
						}
					}.bind(this)
				});
			}
		},

		addQuestion: function(event) {
			event.preventDefault();
			event.stopPropagation();

			// add selected question to game
			var selectedID = this.$el.find("form select :selected").data("id");
			var gameQuestions = this.options.game.get("questions");
			gameQuestions.push(selectedID);
			this.options.game.set("questions", gameQuestions);
			this.options.game.save();
		},

		remove: function() {
			this.undelegateEvents();
			this.$el.removeData().unbind();

			for (var i = 0; i < this.children.length; ++i) {
				this.children[i].remove();
			}
			this.children.length = 0;

			Backbone.View.prototype.remove.call(this);

			return this;
		}
	});
});
