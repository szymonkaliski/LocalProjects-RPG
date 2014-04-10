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
			"click .question-remove": "remove",
			"click .question-edit": "edit",
			"click .question-save": "save",
			"click .question-add": "add"
		},

		dom: {
			"form": null
		},

		initialize: function(options) {
			_.bindAll(this, "render", "edit", "remove", "save", "add", "tokenRemoved");

			// save options
			this.options = options;

			// handle bus events
			Bus.on("tokenRemoved", this.tokenRemoved);
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
			this.dom.form = this.$el.find("form");
			var $tokenList = this.$el.find(".tokens-list");

			// add token views below question
			for (var key in modelTokens) {
				var modelToken = this.options.tokens.get(key);
				var tokenView = new CMSTokenView({
					"model": modelToken,
					"questionID": this.model.id
				});
				$tokenList.append(tokenView.render().el);
			}

			return this;
		},

		edit: function() {
			this.modal.modal("show");
		},

		remove: function() {
			this.model.destroy();
		},

		save: function() {
			var name = this.modal.find("input.name").val();

			if (name.length > 0) {
				this.model.set("name", name);
				this.model.save();
			}
		},

		add: function(event) {
			event.preventDefault();
			event.stopPropagation();

			// add selected token to model
			var selectedID = this.dom.form.find("select :selected").data("id");
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
		}
	});
});
