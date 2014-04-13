define([
	"jquery",
	"backbone",
	"paper",
	"text!templates/game.tpl"
], function($, Backbone, Paper, ViewTemplate) {
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
				this.render();
			}.bind(this), 100);
			rerender();

			// reload on collection fetches
			this.options.games.on("sync", rerender);
			this.options.questions.on("sync", rerender);
			this.options.tokens.on("sync", rerender);
		},

		render: function() {
			console.log("rendering game", this.model, Paper);

			this.$el.html(_.template(ViewTemplate));
			this.$canvas = this.$el.find(".game-canvas");
			this.$question = this.$el.find(".question");

			this.renderQuestion();
		},

		renderQuestion: function() {
			var gameQuestions = this.model.get("questions");
			var question = this.options.questions.get(gameQuestions[this.currentQuestion]);
			this.currentQuestion++;

			this.$question.text(question.get("name"));
		},

		answerClicked: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var $event = $(event.currentTarget);
			var answer = $event.hasClass("yes") ? "yes" : "no";

			console.log("clicked: " + answer);
			this.renderQuestion();
		}
	});
});
