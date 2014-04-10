define([
	"jquery",
	"backbone",
	"text!templates/cmsToken.tpl"
], function($, Backbone, ViewTemplate) {
	return Backbone.View.extend({
		tagName: "tr",

		events: {
			"click .remove": "remove",
			"click .edit": "edit"
		},

		initialize: function(options) {
			_.bindAll(this, "render", "edit", "remove");

			// save options
			this.options = options;
		},

		render: function() {
			this.$el.html(_.template(ViewTemplate, {
				"model": this.options.model
			}));

			return this;
		},

		edit: function() {
			console.log("EDIT");
		},

		remove: function() {
			this.model.destroy();
		}
	});
});
