define([
	"jquery",
	"backbone",
	"text!templates/cmsToken.tpl"
], function($, Backbone, ViewTemplate) {
	return Backbone.View.extend({
		tagName: "div",

		initialize: function(options) {
			_.bindAll(this, "render");

			// save options
			this.options = options;
		},

		render: function() {
			this.$el.html(_.template(ViewTemplate, {
				"model": this.options.model
			}));

			return this;
		},
	});
});
