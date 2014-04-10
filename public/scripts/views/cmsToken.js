define([
	"jquery",
	"backbone",
	"bootstrapModal",
	"addons/bus",
	"text!templates/cmsToken.tpl"
], function($, Backbone, BootstrapModal, Bus, ViewTemplate) {
	return Backbone.View.extend({
		tagName: "li",

		events: {
			"click .token-remove": "remove",
			"click .token-edit": "edit",
			"click .token-save": "save"
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
			// if token is displayed inside question, then on remove
			// it should be removed from question, not from server
			if (this.options.questionID) {
				Bus.trigger("tokenRemoved", {
					"tokenID": this.model.id,
					"questionID": this.options.questionID
				});
			}
			// if token is removed on cms token list it should be removed 
			// from server
			else {
				console.log("DESTROY");
				this.model.destroy();
			}
		},

		save: function() {
			var name = this.modal.find("input.name").val();

			if (name.length > 0) {
				this.model.set("name", name);
				this.model.save();

				this.modal.modal("hide");
			}
		}
	});
});
