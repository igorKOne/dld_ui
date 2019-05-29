// define a root UI component that exposes the main view
// jQuery.sap.declare("one.labs.mem_profiler.Component");
// jQuery.sap.require("sap.ui.core.UIComponent");
// jQuery.sap.require("sap.ui.core.routing.History");
// jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
// sap.ui.core.UIComponent.extend("one.labs.mem_profiler.Component", {
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/m/routing/RouteMatchedHandler",
	"./model/models"
], function (UIComponent, Device, RouteMatchedHandler, models) {
	"use strict";

	return UIComponent.extend("one.labs.mem_profiler.Component", {

	metadata: {
		manifest: "json"
	},
	
	init: function () {

		// call the base component's init function
		UIComponent.prototype.init.apply(this, arguments);

		// enable routing
		this.getRouter().initialize();

		// set the device model
		this.setModel(models.createDeviceModel(), "device");



	},
	
	getServiceURLfromManifest: function(sDataSource){
		var sServiceUrl = this.getMetadata().getManifestEntry("sap.app").dataSources[sDataSource].uri;
		return sServiceUrl ;
	}
	// exit: function () {
	// 	this._routeMatchedHandler.destroy();
	// },
	// // This method lets the app can decide if a navigation closes all open dialogs
	// setRouterSetCloseDialogs: function (bCloseDialogs) {
	// 	this._bRouterCloseDialogs = bCloseDialogs;
	// 	if (this._routeMatchedHandler) {
	// 		this._routeMatchedHandler.setCloseDialogs(bCloseDialogs);
	// 	}
	// }
});
});