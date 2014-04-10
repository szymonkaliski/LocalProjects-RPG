define([
	"jquery",
	"backbone",
	"views/cmsToken",
	"text!templates/cmsTokens.tpl"
], function($, Backbone, CMSToken, ViewTemplate) {
	return Backbone.View.extend({
		el: "body",

		initialize: function(options) {
			_.bindAll(this, "render");

			// save options
			this.options = options;

			// render on start
			this.render();

			// re-render on collection sync
			this.options.tokens.on("sync", function() {
				this.render();
			}.bind(this));
		},

		render: function() {
			// render basic view
			this.$el.html(_.template(ViewTemplate));
			var $tagList = this.$el.find(".tag-list");

			// render all tokens
			this.options.tokens.forEach(function(token) {
				var tokenView = new CMSToken({ "model": token });
				$tagList.append(tokenView.render().el);
			}.bind(this));

			return this;
		},
	});
});
