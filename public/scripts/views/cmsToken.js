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
			"click .token-save": "saveToken",
			"change .impact-yes": "impactChange",
			"change .impact-no": "impactChange"
		},

		modal: null,

		initialize: function(options) {
			_.bindAll(this, "render", "editToken", "removeToken", "saveToken", "impactChange");

			// save options
			this.options = options;
		},

		render: function() {
			this.$el.html(_.template(ViewTemplate, {
				"model": this.model,
				"impact": this.options.impact
			}));

			this.modal = this.$el.find(".modal");
			this.modal.modal({
				"show": false
			});

			return this;
		},

		editToken: function(event) {
			event.preventDefault();
			event.stopPropagation();

			this.modal.modal("show");
		},

		removeToken: function(event) {
			event.preventDefault();
			event.stopPropagation();

			this.model.destroy();
		},

		saveToken: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var name = this.modal.find("input.name").val();

			if (name.length > 0) {
				this.model.set("name", name);
				this.model.save({}, {
					"success": function() {
						this.modal.modal("hide");
					}.bind(this)
				});
			}
		},

		impactChange: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var valueYes = this.$el.find(".impact-yes").val();
			var valueNo = this.$el.find(".impact-no").val();

			Bus.trigger("impactChange", {
				"questionID": this.options.questionID,
				"tokenID": this.model.id,
				"value": {
					"yes": parseInt(valueYes, 10),
					"no": parseInt(valueNo, 10)
				}
			});
		}
	});
});
