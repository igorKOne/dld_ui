sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("one.labs.mem_profiler.controller.App", {
		onInit: function () {
			// set a device-dependent content density class 
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

		}
	});
});