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
			"click .token-add": "addToken"
		},

		children: [],

		initialize: function(options) {
			_.bindAll(this, "render", "addToken");

			// save options
			this.options = options;

			// render on start
			this.render();

			// re-render on collection sync
			var rerender = _.debounce(function() {
				this.children.forEach(function(child) {
					child.remove();
				});
				this.children.length = 0;

				this.render();
			}.bind(this), 200);

			this.options.tokens.on("sync add remove", rerender);
		},

		render: function() {
			// render basic view
			this.$el.html(_.template(ViewTemplate));
			var $tokenList = this.$el.find(".token-list");

			// render all questions
			this.options.tokens.forEach(function(token) {
				var tokenView = new CMSTokenView({ "model": token });
				$tokenList.append(tokenView.render().el);
				this.children.push(tokenView);
			}.bind(this));

			return this;
		},

		addToken: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var name = this.$el.find("form #token-name").val();
			if (name.length > 0) {
				var token = new Token({ "name": name });
				token.save({}, {
					"success": function() {
						this.options.tokens.add(token);
					}.bind(this)
				});
			}
		},

		remove: function() {
			this.undelegateEvents();
			this.$el.removeData().unbind();

			this.children.forEach(function(child) {
				child.remove();
			});

			Backbone.View.prototype.remove.call(this);

			return this;
		}
	});
});
