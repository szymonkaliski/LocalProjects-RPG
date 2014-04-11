define([
	"jquery",
	"backbone",
	"addons/bus",
	"models/token",
	"views/cmsToken",
	"text!templates/cmsQuestion.tpl"
], function($, Backbone, Bus, Token, CMSTokenView, ViewTemplate) {
	return Backbone.View.extend({
		tagName: "li",

		events: {
			"click .question-remove": "removeQuestion",
			"click .question-edit": "editQuestion",
			"click .question-save": "saveQuestion",
			"click .token-add-new": "addTokenNew",
			"click .token-add": "addToken"
		},

		form: null,
		tokenList: null,

		children: [],

		initialize: function(options) {
			_.bindAll(this, "render", "editQuestion", "removeQuestion", "saveQuestion", "addToken", "addTokenNew", "impactChange", "remove");

			// save options
			this.options = options;

			// re-render on collection sync
			var rerender = _.debounce(function() {
				for (var i = 0; i < this.children.length; ++i) {
					this.children[i].remove();
				}
				this.children.length = 0;

				this.render();
			}.bind(this), 10);

			this.options.tokens.on("sync add remove", rerender);
			if (Bus) Bus.on("impactChange", this.impactChange);
		},

		render: function() {
			if ($("#main").length === 0) {
				$("body").append("<div id='main'></div>");
			}

			// get tokens from model
			var modelTokens = this.options.model.get("tokens");

			// render main template
			this.$el.html(_.template(ViewTemplate, {
				"model": this.options.model,
				"tokens": this.options.tokens.filter(function(token) {
					// in selection display only tokens that aren't already added to the question
					return (modelTokens[token.id] === undefined);
				})
			}));

			// save dom elements
			this.form = this.$el.find("form");
			this.tokenList = this.$el.find(".tokens-list");

			// add token views below question
			for (var key in modelTokens) {
				var modelToken = this.options.tokens.get(key);

				if (modelToken) {
					var tokenView = new CMSTokenView({
						"model": modelToken,
						"impact": modelTokens[key],
						"questionID": this.model.id
					});

					this.tokenList.append(tokenView.render().el);
					this.children.push(tokenView);
				}
			}

			return this;
		},

		editQuestion: function(event) {
			event.preventDefault();
			event.stopPropagation();

			this.modal.modal("show");
		},

		removeQuestion: function(event) {
			event.preventDefault();
			event.stopPropagation();

			this.model.destroy();
		},

		saveQuestion: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var name = this.modal.find("input.name").val();

			if (name.length > 0) {
				this.model.set("name", name);
				this.model.save();
			}
		},

		addTokenNew: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var name = this.form.find(".token-name").val();

			if (name.length > 0) {
				var token = new Token({ "name": name });

				token.save({}, {
					"success": function() {
						this.options.tokens.add(token);

						var tokens = this.model.get("tokens");
						tokens[token.id] = { "yes": 0, "no": 0 };
						this.model.set("tokens", tokens);
						this.model.save();
					}.bind(this)
				});
			}
		},

		addToken: function(event) {
			event.preventDefault();
			event.stopPropagation();

			// add selected token to model
			var selectedID = this.form.find("select :selected").data("id");
			var tokens = this.model.get("tokens");
			tokens[selectedID] = { "yes": 0, "no": 0 };
			this.model.set("tokens", tokens);
			this.model.save();
		},

		impactChange: function(event) {
			if (event.questionID === this.model.id) {
				var tokens = this.model.get("tokens");
				tokens[event.tokenID] = event.value;
				this.model.set("tokens", tokens);
				this.model.save();
			}
		},

		remove: function() {
			// FIXME: ugly fix for zombie views; cmsQuestions probably stays alive,
			// but couldn't find a place where, cmsQuestion removes all child views,
			// so it's pretty strange
			Bus = null;

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
