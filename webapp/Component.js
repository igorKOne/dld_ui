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
	// 	metadata: {
	// 	"name": "lower_version",
	// 	"version": "1.1.0-SNAPSHOT",
	// 	"library": "lower",
	// 	"includes": ["css/style.css"],
	// 	"dependencies": {
	// 		"libs": [
	// 			"sap.m",
	// 			"sap.ui.layout"
	// 		],
	// 		"components": []
	// 	},
	// 	"config": {
	// 		"resourceBundle": "i18n/messageBundle.properties",
	// 		"serviceConfig": {
	// 			"name": "MEM_PROFILER.xsodata",
	// 			"serviceUrl": "/one/one/labs/mem_prof/app/service/MEM_PROFILER.xsodata/",
	// 			"parameters": {
	// 				"select": "INDEX,SNAPSHOT_PERIOD,TOTAL_MEMORY_PEAK, ALLOCATION_LIMIT, FUNCTIONAL_MEMORY_SIZE"
	// 			}
	// 		}
	// 	},
	// 	routing: {
	// 		// The default values for routes
	// 		config: {
	// 			"viewType": "XML",
	// 			"viewPath": "one.labs.mem_profiler.view",
	// 			"targetControl": "fioriContent",
	// 			// This is the control in which new views are placed
	// 			"targetAggregation": "pages",
	// 			// This is the aggregation in which the new views will be placed
	// 			"clearTarget": false
	// 		},
	// 		routes: [{
	// 			pattern: "",
	// 			name: "main",
	// 			view: "Master"
	// 		}, {
	// 			name: "details",
	// 			view: "Details",
	// 			pattern: "{entity}"
	// 		}]
	// 	}
	// },
	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	metadata: {
		manifest: "json"
	},
	// createContent: function () {
	// 	var oViewData = {
	// 		component: this
	// 	};
	// 	return sap.ui.view({
	// 		viewName: "one.labs.mem_profiler.view.Main",
	// 		type: sap.ui.core.mvc.ViewType.XML,
	// 		viewData: oViewData
	// 	});
	// },
	init: function () {

		// call the base component's init function
		UIComponent.prototype.init.apply(this, arguments);

		// enable routing
		this.getRouter().initialize();

		// set the device model
		this.setModel(models.createDeviceModel(), "device");


		// The service URL for the oData model 
		// var oServiceConfig = this.getMetadata().getConfig().serviceConfig;
		// var sServiceUrl = oServiceConfig.serviceUrl;


		// this._routeMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter(), this._bRouterCloseDialogs);
		// create oData model
		// this._initODataModel(sServiceUrl);


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
// 	// creation and setup of the oData model
// 	_initODataModel: function (sServiceUrl) {
// //		jQuery.sap.require("one.labs.mem_profiler.util.messages");
// 		var oConfig = {
// 			metadataUrlParams: {
// 				//"select": "USER_NAME, RESTRICTED_VS_TOTAL, ACCESSED_VS_TOTAL, CLASSIFICATION"
// 			},
// 			json: true,
// 			loadMetadataAsync: true,
// 			defaultBindingMode: "TwoWay",
// 			defaultCountMode: "Inline",
// 			useBatch: true
// 		};
// 		
// 		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, oConfig);
// 		
// 		//oModel.attachRequestFailed(null, one.labs.mem_profiler.util.messages.showErrorMessage);
// 		
// 		this.setModel(oModel);
// 	}
});
});