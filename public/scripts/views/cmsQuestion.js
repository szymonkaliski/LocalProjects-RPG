define([
	"jquery",
	"backbone",
	"addons/bus",
	"views/cmsToken",
	"text!templates/cmsQuestion.tpl"
], function($, Backbone, Bus, CMSTokenView, ViewTemplate) {
	return Backbone.View.extend({
		tagName: "li",

		events: {
			"click .question-remove": "removeQuestion",
			"click .question-edit": "editQuestion",
			"click .question-save": "saveQuestion",
			"click .token-add": "addToken"
		},

		form: null,
		tokenList: null,

		children: [],

		initialize: function(options) {
			_.bindAll(this, "render", "editQuestion", "removeQuestion", "saveQuestion", "addToken", "tokenRemoved", "tokenRenamed", "remove");

			// save options
			this.options = options;

			// handle bus events
			Bus.on("tokenRemoved", this.tokenRemoved);
			Bus.on("tokenRenamed", this.tokenRenamed);
		},

		render: function() {
			// get tokens from model
			var modelTokens = this.options.model.get("tokens");

			// render main template
			this.$el.html(_.template(ViewTemplate, {
				"model": this.options.model,
				"tokens": this.options.tokens.filter(function(token) {
					// you can only add tokens that are not already connected to question
					return (modelTokens[token.id] === undefined);
				})
			}));

			// save dom elements
			this.form = this.$el.find("form");
			this.tokenList = this.$el.find(".tokens-list");

			// add token views below question
			for (var key in modelTokens) {
				var modelToken = this.options.tokens.get(key);
				var tokenView = new CMSTokenView({
					"model": modelToken,
					"questionID": this.model.id
				});

				this.tokenList.append(tokenView.render().el);
				this.children.push(tokenView);
			}

			return this;
		},

		editQuestion: function() {
			this.modal.modal("show");
		},

		removeQuestion: function() {
			// if question is displayed inside game, then on remove
			// it should be removed from game, not from server
			if (this.options.gameID) {
				Bus.trigger("questionRemoved", {
					"questionID": this.model.id,
					"gameID": this.options.gameID
				});
			}
			// if question is removed on cms token list it should be removed
			// from server
			else {
				this.model.destroy();
			}
		},

		saveQuestion: function() {
			var name = this.modal.find("input.name").val();

			if (name.length > 0) {
				this.model.set("name", name);
				this.model.save();
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

		tokenRemoved: function(event) {
			if (this.model.id === event.questionID) {
				var tokens = this.model.get("tokens");
				delete tokens[event.tokenID];
				this.model.set("tokens", tokens);
				this.model.save();
			}
		},

		tokenRenamed: function(event) {
			// when token was renamed, redraw all tokens from questions
			// to be safe that they are named properly

			this.tokenList.empty();
			var modelTokens = this.options.model.get("tokens");

			for (var key in modelTokens) {
				var modelToken = this.options.tokens.get(key);

				var tokenView = new CMSTokenView({
					"model": modelToken,
					"questionID": this.model.id
				});

				this.tokenList.append(tokenView.render().el);
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
