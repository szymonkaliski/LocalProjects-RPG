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
			"click .question-add": "addQuestion"
		},

		children: [],

		initialize: function(options) {
			_.bindAll(this, "render", "addQuestion", "remove");

			// save options
			this.options = options;

			// render on start
			this.render();

			// re-render on collection sync
			this.options.questions.on("sync add remove", function() {
				this.remove();

				this.delegateEvents();
				this.render();
			}.bind(this));
		},

		render: function() {
			// render basic view
			this.$el.html(_.template(ViewTemplate, { "game": this.options.game }));
			var $questionList = this.$el.find(".question-list");

			// if view got game as option, then render only questions for this game
			if (this.options.game) {
				var gameQuestions = this.options.game.get("questions");
				gameQuestions.forEach(function(gameID) {
					var questionView = new CMSQuestion({
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

		addQuestion: function(event) {
			event.preventDefault();
			event.stopPropagation();

			console.log("EVENT!");

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
