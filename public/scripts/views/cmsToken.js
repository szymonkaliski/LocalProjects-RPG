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
				"model": this.options.model
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
				this.model.destroy();
			}
		},

		saveToken: function() {
			var name = this.modal.find("input.name").val();

			if (name.length > 0) {
				this.model.set("name", name);
				this.model.save({}, {
					"success": function() {
						this.modal.modal("hide");

						Bus.trigger("tokenRenamed", {
							"tokenID": this.model.id,
							"questionID": this.options.questionID
						});
					}.bind(this)
				});
			}
		}
	});
});
