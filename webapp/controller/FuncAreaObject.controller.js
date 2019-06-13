sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("one.labs.mem_profiler.controller.FuncAreaObject", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf one.labs.mem_profiler.view.FuncAreaObject
		 */
		onInit: function () {
			this.getRouter().getRoute("FuncAreaObject").attachPatternMatched(this._onPatternMatched, this);

			this._oModel = new JSONModel();
			this._oView = this.getView();
			this._oView.setModel(this._oModel, "funcArea");

			this._dataAgingChart = this.byId("chartDataAging");
			this._dataPurposeChart = this.byId("chartDataPurpose");
			this._rowColumStoreChart = this.byId("chartRowColumnStore");
			
			this._tableOverviewTable = this.byId("smartTableTableOverview");
		},

		_onPatternMatched: function (oEvent) {
			let oView = this.getView();
			let oDataAgingChart = this._dataAgingChart;
			let oDataPurposeChart = this._dataPurposeChart;
			let oRowColumStoreChart = this._rowColumStoreChart;
			let oTableOverview = this._tableOverviewTable;
			
			//let sAreaId = oEvent.getParameter("areaId");
			let sAreaId = oEvent.getParameter("arguments").areaId;
			
			this._currentAreaId = sAreaId;

			let serviceUrl = this.getBusiness3ServiceURL();

			//serviceUrl += "func_area=" + sAreaId; 

			let oLoadPromise = this._oModel.loadData(serviceUrl, {
					func_area: sAreaId
				},
				true,
				"GET");

			function _onBindingChange() {
				// here we need to implement navigation to NotFound if needed
			}

			oLoadPromise.then(() => {
				oView.bindElement({
					path: "/results/0",
					model: "funcArea",
					events: {
						change: _onBindingChange
					}
				});
				
					
				oDataAgingChart.bindData({
					path: "/results/0/years/", 
					model: "funcArea"
					
				});
				
				oDataPurposeChart.bindData({
					path: "/results/0/data/", 
					model: "funcArea"					
				});
				
				oRowColumStoreChart.bindData({
					path: "/results/0/RSCS/", 
					model: "funcArea"					
				});
				
				
				// oTableOverview.setEntitySet("TableMemoryOverview");
				oTableOverview.rebindTable();
			});

			oLoadPromise.catch(oError => {
				MessageBox.error(JSON.stringify(oError));
			});


		},
		onBeforeRebindTable: function(oSource){
		    var binding = oSource.getParameter("bindingParams");
		    var oFilter = new sap.ui.model.Filter("FUNC_AREA", sap.ui.model.FilterOperator.EQ, this._currentAreaId);
		    binding.filters.push(oFilter);
		},
		
		onNavBack: function() {
			window.history.go(-1);
		}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf one.labs.mem_profiler.view.FuncAreaObject
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf one.labs.mem_profiler.view.FuncAreaObject
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf one.labs.mem_profiler.view.FuncAreaObject
		 */
		//	onExit: function() {
		//
		//	}

	});

});