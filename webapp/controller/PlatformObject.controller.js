sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("one.labs.mem_profiler.controller.PlatformObject", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf one.labs.mem_profiler.view.PlatformObject
		 */
		onInit: function () {

			this.getRouter().getRoute("PlatformObject").attachPatternMatched(this._onPatternMatched, this);

			this._oModel = new JSONModel();
			this._oView = this.getView();
			this._oView.setModel(this._oModel, "platform");

			this._dataAgingChart = this.byId("chartDataAging");
			this._dataPurposeChart = this.byId("chartDataPurpose");
			this._rowColumStoreChart = this.byId("chartRowColumnStore");
			this._funcAreasChart = this.byId("chartFuncAreas");
		},

		_onPatternMatched: function (oEvent) {
			let oView = this.getView();
			let oDataAgingChart = this._dataAgingChart;
			let oDataPurposeChart = this._dataPurposeChart;
			let oRowColumStoreChart = this._rowColumStoreChart;
			let oFuncAreasChart = this._funcAreasChart;
			
			let sId = oEvent.getParameter("arguments").platformId;

			let serviceUrl = this.getPlatformServiceURL();
			//serviceUrl += "func_area=" + sAreaId; 

			let oLoadPromise = this._oModel.loadData(serviceUrl, {
					platformId: sId
				},
				true,
				"GET");

			function _onBindingChange() {
				// here we need to implement navigation to NotFound if needed
			}

			oLoadPromise.then(() => {
				oView.bindElement({
					path: "/results/0",
					model: "platform",
					events: {
						change: _onBindingChange
					}
				});
				
					
				oDataAgingChart.bindData({
					path: "/results/0/years/", 
					model: "platform"
					
				});
				
				oDataPurposeChart.bindData({
					path: "/results/0/data/", 
					model: "platform"					
				});
				
				oRowColumStoreChart.bindData({
					path: "/results/0/RSCS/", 
					model: "platform"					
				});
				
				oFuncAreasChart.bindData({
					path:"/results/0/business/",
					model: "platform"
				});
				
			});

			oLoadPromise.catch(oError => {
				MessageBox.error(JSON.stringify(oError));
			});


		},

		onNavBack: function() {
			window.history.go(-1);
		}
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf one.labs.mem_profiler.view.PlatformObject
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf one.labs.mem_profiler.view.PlatformObject
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf one.labs.mem_profiler.view.PlatformObject
		 */
		//	onExit: function() {
		//
		//	}

	});

});