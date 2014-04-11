define([
	"jquery",
	"backbone",
	"models/token",
	"views/cmsToken",
	"text!templates/cmsQuestion.tpl"
], function($, Backbone, Token, CMSTokenView, ViewTemplate) {
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
			_.bindAll(this, "render", "editQuestion", "removeQuestion", "saveQuestion", "addToken", "addTokenNew", "remove");

			// save options
			this.options = options;

			// re-render
			var rerender = function() {
				this.remove();

				this.delegateEvents();
				this.render();
			}.bind(this);

			this.options.tokens.on("sync add remove", rerender);
		},

		render: function() {
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
						"questionID": this.model.id
					});

					this.tokenList.append(tokenView.render().el);
					this.children.push(tokenView);
				}
			}

			return this;
		},

		editQuestion: function() {
			this.modal.modal("show");
		},

		removeQuestion: function() {
			this.model.destroy();
		},

		saveQuestion: function() {
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
						tokens[token.id] = 0;
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
			tokens[selectedID] = 0;
			this.model.set("tokens", tokens);
			this.model.save();
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
