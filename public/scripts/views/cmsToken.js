define([
	"jquery",
	"backbone",
	"bootstrapModal",
	"text!templates/cmsToken.tpl"
], function($, Backbone, BootstrapModal, ViewTemplate) {
	return Backbone.View.extend({
		tagName: "li",

		events: {
			"click .token-remove": "removeToken",
			"click .token-edit": "editToken",
			"click .token-save": "saveToken"
		},

		modal: null,

		initialize: function(options) {
			_.bindAll(this, "render", "editToken", "removeToken", "saveToken");

			// save options
			this.options = options;
		},

		render: function() {
			this.$el.html(_.template(ViewTemplate, {
				"model": this.model
			}));

			this.modal = this.$el.find(".modal");
			this.modal.modal({
				"show": false
			});

			return this;
		},

		editToken: function() {
			this.modal.modal("show");
		},

		removeToken: function() {
			this.model.destroy();
		},

		saveToken: function() {
			var name = this.modal.find("input.name").val();

			if (name.length > 0) {
				this.model.set("name", name);
				this.model.save({}, {
					"success": function() {
						this.modal.modal("hide");
					}.bind(this)
				});
			}
		}
	});
});
