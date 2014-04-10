define([
	"jquery",
	"backbone",
	"bootstrapModal",
	"text!templates/cmsToken.tpl"
], function($, Backbone, BootstrapModal, ViewTemplate) {
	return Backbone.View.extend({
		tagName: "tr",

		events: {
			"click .remove": "remove",
			"click .edit": "edit",
			"click .save": "save"
		},

		dom: {
			"modal": null
		},

		initialize: function(options) {
			_.bindAll(this, "render", "edit", "remove", "save");

			// save options
			this.options = options;
		},

		render: function() {
			this.$el.html(_.template(ViewTemplate, {
				"model": this.options.model
			}));

			this.modal = this.$el.find(".modal");
			this.modal.modal({
				"show": false
			});

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
		}
	});
});
