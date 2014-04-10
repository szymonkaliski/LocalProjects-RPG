define([
	"jquery",
	"backbone",
	"models/game",
	"views/cmsGame",
	"views/cmsQuestions",
	"text!templates/cmsGames.tpl"
], function($, Backbone, Game, CMSGameView, CMSQuestionsView, ViewTemplate) {
	return Backbone.View.extend({
		el: "body",

		events: {
			"click .game-add": "addGame"
		},

		children: [],

		initialize: function(options) {
			_.bindAll(this, "render", "addGame", "remove");

			// save options
			this.options = options;

			// render on start
			this.render();

			// re-render on collection sync
			this.options.games.on("sync add remove", function() {
				this.remove();

				this.delegateEvents();
				this.render();
			}.bind(this));
		},

		render: function() {
			// if id passed with options, then render view with questions for given game
			if (this.options.id) {
				this.children = [
					new CMSQuestionsView({
						"game": this.options.games.get(this.options.id),
						"questions": this.options.questions,
						"tokens": this.options.tokens
					})
				];
			}
			// otherwise render list of games with ability to add new
			else {
				// render basic view
				this.$el.html(_.template(ViewTemplate));
				var $gameList = this.$el.find(".game-list");

				// render all games
				this.options.games.forEach(function(game) {
					var gameView = new CMSGameView({
						"model": game
					});

					$gameList.append(gameView.render().el);
					this.children.push(gameView);
				}.bind(this));
			}

			return this;
		},

		addGame: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var name = this.$el.find("form #game-name").val();
			if (name.length > 0) {
				var game = new Game({ "name": name });
				game.save({}, {
					"success": function() {
						this.options.games.add(game);
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
