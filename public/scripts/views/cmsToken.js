define([
	"jquery",
	"backbone",
	"text!templates/cmsToken.tpl"
], function($, Backbone, ViewTemplate) {
	return Backbone.View.extend({
		el: "body",

		initialize: function(options) {
			_.bindAll(this, "render");

			// save options
			this.options = options;

			// render on start
			this.render();
		},

		render: function() {
			this.$el.html(_.template(ViewTemplate));
		},
	});
});
