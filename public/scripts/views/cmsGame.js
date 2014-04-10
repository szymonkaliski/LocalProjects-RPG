define([
	"jquery",
	"backbone",
	"bootstrapModal",
	"addons/bus",
	"text!templates/cmsGame.tpl"
], function($, Backbone, BootstrapModal, Bus, ViewTemplate) {
	return Backbone.View.extend({
		tagName: "li",

		events: {
			"click .game-remove": "removeGame",
			"click .game-edit": "editGame",
			"click .game-save": "saveGame"
		},

		modal: null,

		initialize: function(options) {
			_.bindAll(this, "render", "editGame", "removeGame", "saveGame");

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

		editGame: function() {
			this.modal.modal("show");
		},

		removeGame: function() {
			this.model.destroy();
		},

		saveGame: function() {
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
