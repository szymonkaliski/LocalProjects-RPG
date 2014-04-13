define([
	"jquery",
	"backbone",
	"models/game",
	"views/cmsGame",
	"views/cmsQuestions",
	"text!templates/cmsGames.tpl"
], function($, Backbone, Game, CMSGameView, CMSQuestionsView, ViewTemplate) {
	return Backbone.View.extend({
		el: "#main",

		events: {
			"click .game-add": "addGame"
		},

		children: [],

		initialize: function(options) {
			_.bindAll(this, "render", "addGame", "remove");

			// save options
			this.options = options;

			// re-render on collection sync
			var rerender = _.debounce(function() {
				for (var i = 0; i < this.children.length; ++i) {
					this.children[i].remove();
				}
				this.children.length = 0;

				this.render();
			}.bind(this), 100);
			rerender();

			this.options.games.on("sync add remove", rerender);
		},

		render: function() {
			if ($("#main").length === 0) {
				$("body").append("<div id='main'></div>");
			}

			// if id passed with options, then render view with questions for given game
			if (this.options.id) {
				var game = this.options.games.get(this.options.id);

				this.children = [
					new CMSQuestionsView({
						"game": game,
						"gameID": this.options.id,
						"games": this.options.games,
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
			this.$el.removeData().unbind();

			for (var i = 0; i < this.children.length; ++i) {
				this.children[i].remove();
			}

			Backbone.View.prototype.remove.call(this);

			return this;
		}
	});
});
