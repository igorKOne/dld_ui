sap.ui.define([
    "./BaseController",
    "sap/ui/core/Fragment",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/ui/model/json/JSONModel",
    '../model/Formatter'
], function (Controller,Fragment,FeedItem,JSONModel,Formatter) {
	"use strict";
	

	return Controller.extend("one.labs.mem_profiler.controller.MemoryOverview", {

		formatter: Formatter,
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf one.labs.mem_profiler.view.MemoryOverview
		 */
		onInit: function () {
	        this._constants = this.getOverviewChartConstant();
	        // this._state = this.getOverviewState();


            this._oView = this.getView();
            this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
            this._oResourceBundle = this._oComponent.getModel("i18n").getResourceBundle();
            this._oRouter = this._oComponent.getRouter();
            
	        this._oCommonVizProperties = {
                    valueAxis: {
                        label: {
                            visible: true
                        },
                        title: {
                            visible: false
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: false
                        }
                    },
                    title: {
                        visible: true,
                        text: this._oResourceBundle.getText("memoryUsageHistoryChartTitle")
                    }            
        	};


            this._initViewPropertiesModel();
            this._initChartPersonalizationModel();

			// update the VizFrame control
            var oVizFrame = this.getView().byId("vizFrameOverview");
            this._updateVizFrame(oVizFrame);
            
            //connect the popover
            var oPopOver = this.getView().byId("popoverOverview");
            oPopOver.connect(oVizFrame.getVizUid());
		},

        
        _initChartPersonalizationModel: function() {
        	let PersModel = new JSONModel({
                showAllocationLimit: true,
                showMaxStorage: true,
        		showLicensedSpace: false,
        		showColumnStoreData: false,
        		showRowStoreData: false,
        		showPeakMemoryUsage: false,
        		showWarmPotential: true,
        		showTotalMemory: true
        	});
        	this.getView().setModel(PersModel,"chartPersonalization");
        },

        onSelectMeasure: function (oEvent) {
            
            //this._state.chartContainer.removeContent();
            var oVizFrame = this.getView().byId("vizFrameOverview");
            this._updateVizFrame2(oVizFrame);

        },
        
        onChartPersonalizationPress: function(oEvent){
        	var oView = this.getView();
        	if(!this.byId("chartPersonalizationDialog")){
	        	Fragment.load({type: "XML", 
	        				id: oView.getId(),
	        				name: "one.labs.mem_profiler.view.ChartPersonalizationDialog",
	        				controller: this
	        	}).then((oDialog)=>{
					oView.addDependent(oDialog);
					oDialog.open();
					//this._oChartPersonalizationDialog = oDialog;
				});	
	        } else {
	        	this.byId("chartPersonalizationDialog").open();
	        }
        },
        
        onPressCloseChartPersonalizationDialog: function(oEvent) {
        	this.byId("chartPersonalizationDialog").close();
        },
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf one.labs.mem_profiler.view.MemoryOverview
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf one.labs.mem_profiler.view.MemoryOverview
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf one.labs.mem_profiler.view.MemoryOverview
		 */
		//	onExit: function() {
		//
		//	}

       /**
         * Updates the Viz Frame with the necessary data and properties.
         *
         * @private
         * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to update
         */
        _updateVizFrame2: function (oVizFrame) {
        	
        	let oVizFrameConf = this._constants.vizFrame;
            
            let oChartPersModel = this.getView().getModel("chartPersonalization");
            let showAllocationLimit = oChartPersModel.getProperty("/showAllocationLimit");
            let showMaxStorage = oChartPersModel.getProperty("/showMaxStorage");
            let showLicensedSpace = oChartPersModel.getProperty("/showLicensedSpace");
            let showColumnStoreData = oChartPersModel.getProperty("/showColumnStoreData");
            let showRowStoreData = oChartPersModel.getProperty("/showRowStoreData");
            let showPeakMemoryUsage = oChartPersModel.getProperty("/showPeakMemoryUsage");
            let showWarmPotential = oChartPersModel.getProperty("/showWarmPotential");
            let showTotalMemory = oChartPersModel.getProperty("/showTotalMemory");
            
            let aMeasures = [
            	{
            		name: "Global Allocation Limit",
            		selected: showAllocationLimit,
            		axis: "line"
                }, {
            		name: "Max Memory Footprint",
            		selected: showMaxStorage,
            		axis: "line"
                },{
            		name: "Licensed Space",
            		selected: showLicensedSpace,
            		axis: "line"
            		
            	} ,{
            		name:"RowStore Data",
            		selected: showRowStoreData,
            		axis: "bar"
            		
            	}, {
            		name: "ColumnStore Data",
            		selected: showColumnStoreData,
            		axis: "bar"
            		
            	},{
            		name: "Peak Memory Usage",
            		selected: showPeakMemoryUsage,
            		axis: "line"
            	},{
            		name: "Warm Potential",
            		selected: showWarmPotential,
            		axis: "bar"
            	},{
            		name: "Total Memory",
            		selected: showTotalMemory,
            		axis: "bar"
            	}];
            
            let aSelectedMeasures = aMeasures.filter(elem=>{return elem.selected;}); // get selected measures
            
            oVizFrame.setVizProperties(Object.assign({
                plotArea: {

                    dataShape: {
                        primaryAxis: aSelectedMeasures.map((elem)=>{return elem.axis;}), // all filtered axises
                        secondaryAxis: ["bar"]
                    }
                }

            }, this._oCommonVizProperties));


            let aFeeds = [
                new FeedItem({
                    'uid': "primaryValues",
                    'type': "Measure",
                    'values': aSelectedMeasures.map((elem)=>{return elem.name;}) //all filtered names
                }),
                new FeedItem({
                        'uid': "axisLabels",
                        'type': "Dimension",
                        'values': ["MONTH_STRING"]
                })
            ]; 


            var oDataset = new sap.viz.ui5.data.FlattenedDataset(oVizFrameConf.dataset);
            //console.log('dataset : ', oVizFrameConf.dataset);
            //console.log('feeds : ', aFeeds);
    
            oVizFrame.destroyDataset();
            oVizFrame.removeAllFeeds();
            oVizFrame.vizUpdate({
                'data': oDataset,
                //'properties' : properties,
                //'scales' : scales,
                //'customizations' : customizations,
                'feeds': aFeeds
            });


            oVizFrame.setVizType('combination'); //('stacked_combination');
            if ((!showAllocationLimit &&
                !showLicensedSpace && !showColumnStoreData && !showRowStoreData && !showWarmPotential && !showTotalMemory && showPeakMemoryUsage)
                ||
                (showAllocationLimit &&
                    !showLicensedSpace && !showColumnStoreData && !showRowStoreData && !showWarmPotential && !showTotalMemory && !showPeakMemoryUsage)
                ||
                (!showAllocationLimit && showLicensedSpace && !showColumnStoreData && !showRowStoreData && !showWarmPotential && !showTotalMemory && !showPeakMemoryUsage)) {
                oVizFrame.setVizType('line'); //('stacked_combination');   
            }
            if ((!showAllocationLimit && !showLicensedSpace && !showColumnStoreData && showRowStoreData && !showWarmPotential && !showTotalMemory && !showPeakMemoryUsage)
                || (!showAllocationLimit && !showLicensedSpace && showColumnStoreData && !showRowStoreData && !showWarmPotential && !showTotalMemory && !showPeakMemoryUsage)
                || (!showAllocationLimit && !showLicensedSpace && !showColumnStoreData && !showRowStoreData && showWarmPotential && !showTotalMemory && !showPeakMemoryUsage)
                || (!showAllocationLimit && !showLicensedSpace && !showColumnStoreData && !showRowStoreData && !showWarmPotential && showTotalMemory && !showPeakMemoryUsage)) {
                oVizFrame.setVizType('column');
            }
            if ((!showAllocationLimit && !showLicensedSpace && showColumnStoreData && showRowStoreData && !showWarmPotential && !showTotalMemory && !showPeakMemoryUsage)
            ) {
            	oVizFrame.setVizType('stacked_column');
            }
            if ((!showAllocationLimit && !showLicensedSpace && showColumnStoreData && showRowStoreData && showWarmPotential && showTotalMemory && !showPeakMemoryUsage)
            	|| (!showAllocationLimit && !showLicensedSpace && !showColumnStoreData && showRowStoreData && showWarmPotential && showTotalMemory && !showPeakMemoryUsage)
            	|| (!showAllocationLimit && !showLicensedSpace && showColumnStoreData && !showRowStoreData && showWarmPotential && showTotalMemory && !showPeakMemoryUsage)
            	|| (!showAllocationLimit && !showLicensedSpace && showColumnStoreData && showRowStoreData && !showWarmPotential && showTotalMemory && !showPeakMemoryUsage)
            	|| (!showAllocationLimit && !showLicensedSpace && showColumnStoreData && showRowStoreData && showWarmPotential && !showTotalMemory && !showPeakMemoryUsage)
            	|| (!showAllocationLimit && !showLicensedSpace && !showColumnStoreData && showRowStoreData && showWarmPotential && !showTotalMemory && !showPeakMemoryUsage)
            	|| (!showAllocationLimit && !showLicensedSpace && showColumnStoreData && !showRowStoreData && showWarmPotential && !showTotalMemory && !showPeakMemoryUsage)
            ) {
                oVizFrame.setVizType('column');
            }
            oVizFrame.setVisible(true);
            if (!showAllocationLimit &&
                ! showMaxStorage &&
                !showLicensedSpace && 
                !showColumnStoreData && 
                !showRowStoreData && 
                !showWarmPotential && 
                !showTotalMemory && 
                !showPeakMemoryUsage) {
                oVizFrame.destroyDataset();
                oVizFrame.removeAllFeeds();
                oVizFrame.destroyFeeds();
                oVizFrame.setVisible(false);
            }
            //oVizFrame.setVizType('combination'); //dual_combination is not supported in this version of UI5
            //oVizFrame.setVizType('column');
        },
        /**
        * Updates the Viz Frame with the necessary data and properties.
        *
        * @private
        * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to update
        */
        _updateVizFrame: function (oVizFrame) {
            
            let oVizFrameConf = this._constants.vizFrame;
            
            let oChartPersModel = this.getView().getModel("chartPersonalization");
            let showAllocationLimit = oChartPersModel.getProperty("/showAllocationLimit");
            let showMaxStorage = oChartPersModel.getProperty("/showMaxStorage");
            let showLicensedSpace = oChartPersModel.getProperty("/showLicensedSpace");
            let showColumnStoreData = oChartPersModel.getProperty("/showColumnStoreData");
            let showRowStoreData = oChartPersModel.getProperty("/showRowStoreData");
            let showPeakMemoryUsage = oChartPersModel.getProperty("/showPeakMemoryUsage");
            let showWarmPotential = oChartPersModel.getProperty("/showWarmPotential");
            let showTotalMemory = oChartPersModel.getProperty("/showTotalMemory");
            
            let aMeasures = [
            	{
            		name: "Global Allocation Limit",
            		selected: showAllocationLimit,
            		axis: "line"
            	}, {
            		name: "Max Memory Footprint",
            		selected: showMaxStorage,
            		axis: "line"
            	}, {
            		name: "Licensed Space",
            		selected: showLicensedSpace,
            		axis: "line"
            		
            	} ,{
            		name:"RowStore Data",
            		selected: showRowStoreData,
            		axis: "bar"
            		
            	}, {
            		name: "ColumnStore Data",
            		selected: showColumnStoreData,
            		axis: "bar"
            		
            	},{
            		name: "Peak Memory Usage",
            		selected: showPeakMemoryUsage,
            		axis: "line"
            	},{
            		name: "Warm Potential",
            		selected: showWarmPotential,
            		axis: "bar"
            	},{
            		name: "Total Memory",
            		selected: showTotalMemory,
            		axis: "bar"
            	}
            	];
            
            let aSelectedMeasures = aMeasures.filter(elem=>{return elem.selected;}); // get selected measures
            
            oVizFrame.setVizProperties(Object.assign({
                plotArea: {

                    dataShape: {
                        primaryAxis: aSelectedMeasures.map((elem)=>{return elem.axis;}), // all filtered axises
                        secondaryAxis: ["bar"]
                    }
                }

            }, this._oCommonVizProperties));

			
            var oDataset = new sap.viz.ui5.data.FlattenedDataset(oVizFrameConf.dataset);
            //console.log(oDataset);
            // var oVizFramePath = oVizFrameConf.modulePath;
            
            //var oModel = new sap.ui.model.odata.ODataModel(oVizFramePath);
            let oModel = this.getOwnerComponent().getModel();                                   
            //console.log(oModel);
            oVizFrame.setDataset(oDataset);

            oVizFrame.setModel(oModel);
            
            oVizFrame.addFeed( new FeedItem({
                    'uid': "primaryValues",
                    'type': "Measure",
                    'values': aSelectedMeasures.map((elem)=>{return elem.name;}) //all filtered names
                }));
            oVizFrame.addFeed(new FeedItem({
                        'uid': "axisLabels",
                        'type': "Dimension",
                        'values': ["MONTH_STRING"]
                }));
            
            //oVizFrame.setVizType(oVizFrameConf.type);
            oVizFrame.setVizType('combination'); //('stacked_combination'); 
        },
      
        _initViewPropertiesModel: function () {

		}

	});

});