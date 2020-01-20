sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/viz/ui5/controls/Popover",
	'../model/Formatter'
], function (Controller, JSONModel, MessageBox, vizPopover, Formatter) {
	"use strict";

	return Controller.extend("one.labs.mem_profiler.controller.FuncAreaObject", {
		formatter : Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf one.labs.mem_profiler.view.FuncAreaObject
		 */
		onInit: function () {
			this.getRouter().getRoute("FuncAreaObject").attachPatternMatched(this._onPatternMatched, this);

			this._oModel = new JSONModel();
			this._oModelTableMemoryOverview = new JSONModel();
			this._oView = this.getView();
			this._oView.setModel(this._oModel, "object");
			this._oView.setModel(this._oModelTableMemoryOverview, "tableMemoryOverview");

			this._dataAgingChart = this.byId("chartDataAging");
			this._dataPurposeChart = this.byId("chartDataPurpose");
			this._rowColumStoreChart = this.byId("chartRowColumnStore");
			this._tableMemoryOverviewTable = this.byId("tableMemoryOverviewTable");
			this._tableOverviewTable = this.byId("smartTableTableOverview");
			
			// Create and attach Viz Control Popovers to the charts
			let aCharts = ["chartDataAging", "chartDataPurpose", "chartRowColumnStore"];
			
			aCharts.forEach(elem => { 
				let oChart = this.byId(elem);
				let oPopover = new vizPopover({});
				oPopover.connect(oChart.getVizUid());
			},this)
		},

		_onPatternMatched: function (oEvent) {
			let oView = this.getView();
			let oDataAgingChart = this._dataAgingChart;
			let oDataPurposeChart = this._dataPurposeChart;
			let oRowColumStoreChart = this._rowColumStoreChart;
			let oTableOverview = this._tableOverviewTable;
			let oTableMemoryOverviewTable = this._tableMemoryOverviewTable;
			
			//let sAreaId = oEvent.getParameter("areaId");
			let sAreaId = oEvent.getParameter("arguments").areaId;
			
			this._currentAreaId = sAreaId;

			let serviceUrl = this.getBusiness3ServiceURL();                         
		
			//serviceUrl += "func_area=" + sAreaId; 

			let oLoadPromise = this._oModel.loadData(serviceUrl, {
					func_area: sAreaId},
					true,
					"GET");
			function _onBindingChange() {
				// here we need to implement navigation to NotFound if needed
			}

			oLoadPromise.then(() => {
				oView.bindElement({
					path: "/results/0",
					model: "object",
					events: {
						change: _onBindingChange
					}
				});
					
				oDataAgingChart.bindData({
					path: "/results/0/years/", 
					model: "object"
					
				});
				
				oDataPurposeChart.bindData({
					path: "/results/0/data/", 
					model: "object"					
				});
				
				oRowColumStoreChart.bindData({
					path: "/results/0/RSCS/", 
					model: "object"					
				});
				
				oTableOverview.rebindTable();
				
			});
			
			// catch errors
			oLoadPromise.catch(oError => {
				MessageBox.error(JSON.stringify(oError));
			});
			
			let serviceUrlTableMemoryOverviewTable = this.getTableMemoryOverviewServiceURL();
			//let oLoadPromiseTableMemoryOverviewTable = 
			this._oModelTableMemoryOverview.loadData(serviceUrlTableMemoryOverviewTable, { func_area: sAreaId}, true, "GET");
			
			/*oLoadPromiseTableMemoryOverviewTable.then(() => {
				this._oModelTableMemoryOverview.refresh();
				//oTableMemoryOverviewTable.
			});*/
			
			
			
		},
		
		onBeforeRebindTable: function(oSource){
		    var binding = oSource.getParameter("bindingParams");
		    var oFilter = new sap.ui.model.Filter("FUNC_AREA", sap.ui.model.FilterOperator.EQ, this._currentAreaId);
		    binding.filters.push(oFilter);
		    binding.sorter=[new sap.ui.model.Sorter("TABLE_NAME", true)];
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