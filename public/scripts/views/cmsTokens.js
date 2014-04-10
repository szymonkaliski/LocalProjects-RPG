define([
	"jquery",
	"backbone",
	"models/token",
	"views/cmsToken",
	"text!templates/cmsTokens.tpl"
], function($, Backbone, Token, CMSTokenView, ViewTemplate) {
	return Backbone.View.extend({
		el: "body",

		events: {
			"submit form": "submit"
		},

		initialize: function(options) {
			_.bindAll(this, "render", "submit");

			// save options
			this.options = options;

			// render on start
			this.render();

			// re-render on collection sync
			this.options.tokens.on("sync add remove", function() {
				this.render();
			}.bind(this));
		},

		render: function() {
			// render basic view
			this.$el.html(_.template(ViewTemplate));
			var $tokenList = this.$el.find(".token-list");

			// render all questions
			this.options.tokens.forEach(function(token) {
				var tokenView = new CMSTokenView({ "model": token });
				$tokenList.append(tokenView.render().el);
			}.bind(this));

			return this;
		},

		submit: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var name = this.$el.find("form #token-name").val();
			if (name.length > 0) {
				var token = new Token({ "name": name });
				token.save();
				this.options.tokens.add(token);
			}
		}
	});
});
