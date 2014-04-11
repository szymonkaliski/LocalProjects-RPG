define([
	"jquery",
	"backbone",
	"models/question",
	"views/cmsQuestion",
	"text!templates/cmsQuestions.tpl"
], function($, Backbone, Question, CMSQuestion, ViewTemplate) {
	return Backbone.View.extend({
		el: "body",

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
			var rerender = function() {
				this.remove();

				this.delegateEvents();
				this.render();
			}.bind(this);

			this.options.questions.on("sync add remove", rerender);
			if (this.options.games) this.options.games.on("sync add remove", rerender);
		},

		render: function() {
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
						var questionView = new CMSQuestion({
							"gameID": this.options.game.id,
							"model": model,
							"tokens": this.options.tokens
						});

						$questionList.append(questionView.render().el);
						this.children.push(questionView);
					}
				}.bind(this));
			}
			// otherwise render all questions
			else {
				this.options.questions.forEach(function(question) {
					var questionView = new CMSQuestion({
						"model": question,
						"tokens": this.options.tokens
					});

					$questionList.append(questionView.render().el);
					this.children.push(questionView);
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
			this.$el.empty();
			this.stopListening();

			this.children.forEach(function(child) {
				child.remove();
			});

			return this;
		}
	});
});
