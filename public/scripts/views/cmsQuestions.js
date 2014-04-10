define([
	"jquery",
	"backbone",
	"addons/bus",
	"models/question",
	"views/cmsQuestion",
	"text!templates/cmsQuestions.tpl"
], function($, Backbone, Bus, Question, CMSQuestion, ViewTemplate) {
	return Backbone.View.extend({
		el: "body",

		events: {
			"click .question-add-new": "addQuestionNew",
			"click .question-add": "addQuestion"
		},

		children: [],

		initialize: function(options) {
			_.bindAll(this, "render", "addQuestionNew", "addQuestion", "questionRemoved", "remove");

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

			// listen to Bus events
			Bus.on("questionRemoved", this.questionRemoved);
		},

		render: function() {
			// render basic view
			this.$el.html(_.template(ViewTemplate, {
				"game": this.options.game,
				"questions": this.options.questions
			}));
			var $questionList = this.$el.find(".question-list");

			// if view got game as option, then render only questions for this game
			if (this.options.game) {
				var gameQuestions = this.options.game.get("questions");
				gameQuestions.forEach(function(gameID) {
					var questionView = new CMSQuestion({
						"gameID": this.options.game.id,
						"model": this.options.questions.get(gameID),
						"tokens": this.options.tokens
					});

					$questionList.append(questionView.render().el);
					this.children.push(questionView);
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

			// TODO: add ability to insert question from list
		},

		questionRemoved: function(event) {
			if (this.options.game.id === event.gameID ) {
				var gameQuestions = this.options.game.get("questions");
				gameQuestions = gameQuestions.filter(function(question) {
					return question !== event.questionID;
				});

				this.options.game.set("questions", gameQuestions);
				this.options.game.save();
			}
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
