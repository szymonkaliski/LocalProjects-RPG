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

		initialize: function(options) {
			_.bindAll(this, "render", "addQuestion");

			// save options
			this.options = options;

			// render on start
			this.render();

			// re-render on collection sync
			this.options.questions.on("sync add remove", function() {
				this.render();
			}.bind(this));
		},

		render: function() {
			// render basic view
			this.$el.html(_.template(ViewTemplate));
			var $questionList = this.$el.find(".question-list");

			// render all questions
			this.options.questions.forEach(function(question) {
				var questionView = new CMSQuestion({
					"model": question,
					"tokens": this.options.tokens
				});

				$questionList.append(questionView.render().el);
			}.bind(this));

			return this;
		},

		addQuestion: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var name = this.$el.find("form #question-name").val();
			if (name.length > 0) {
				var question = new Question({ "name": name });
				question.save();
				this.options.questions.add(question);
			}
		}
	});
});
