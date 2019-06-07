sap.ui.define([
    "./BaseController",
    "sap/ui/core/Fragment",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/ui/model/json/JSONModel",
    '../model/Formatter'
], function (BaseController,Fragment,FeedItem,JSONModel,Formatter) {
	"use strict";
	

	return BaseController.extend("one.labs.mem_profiler.controller.MemoryOverview", {

		formatter: Formatter,
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf one.labs.mem_profiler.view.MemoryOverview
		 */
		onInit: function () {
	        this._constants = this.getOverviewChartConstant();
	        this._state = this.getOverviewState();


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
            var oVizFrame = this.getView().byId(this._constants.vizFrame.id);
            this._updateVizFrame(oVizFrame);
            
            //connect the popover
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
		},

        
        _initChartPersonalizationModel: function() {
        	let PersModel = new JSONModel({
        		showAllocationLimit: true,
        		showLicensedSpace: true,
        		showColumnStoreData: true,
        		showRowStoreData: true,
        		showPeakMemoryUsage: true
        	});
        	this.getView().setModel(PersModel,"chartPersonalization");
        },

        onSelectMeasure: function (oEvent) {
            
            //this._state.chartContainer.removeContent();
            var oVizFrame = this.getView().byId(this._constants.vizFrame.id);
            this._updateVizFrame2(oVizFrame);

        },
        
        onChartPersonalizationPress: function(oEvent){
        	var oView = this.getView();
        	if(!this.byId("chartPersonalizationDialog")){
        	//if(!this._oChartPersonalizationDialog){
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
	        	//this._oChartPersonalizationDialog.open();
	        	this.byId("chartPersonalizationDialog").open();
	        }
        },
        
        onPressCloseChartPersonalizationDialog: function(oEvent) {
        	//this._oChartPersonalizationDialog.close();
        	this.byId("chartPersonalizationDialog").close();
            //this._updateVizFrame2(this.getView().byId(this._constants.vizFrame.id));
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
        _updateVizFrame2: function (vizFrame) {
            
            // var oVizFrame = this._constants.vizFrame;
            let oChartPersModel = this.getView().getModel("chartPersonalization");
            let showAllocationLimit = oChartPersModel.getProperty("/showAllocationLimit");
            let showLicensedSpace = oChartPersModel.getProperty("/showLicensedSpace");
            let showColumnStoreData = oChartPersModel.getProperty("/showColumnStoreData");
            let showRowStoreData = oChartPersModel.getProperty("/showRowStoreData");
            let showPeakMemoryUsage = oChartPersModel.getProperty("/showPeakMemoryUsage");
            
            
            let aMeasures = [
            	{
            		name: "Allocation Limit",
            		selected: showAllocationLimit,
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
            		
            	}];
            
            let aSelectedMeasures = aMeasures.filter(elem=>{return elem.selected;}); // get selected measures
            
            vizFrame.setVizProperties(Object.assign({
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


            var oDataset = new sap.viz.ui5.data.FlattenedDataset(this._constants.vizFrame.dataset);
            
    

            vizFrame.destroyDataset();
            vizFrame.removeAllFeeds();
            vizFrame.vizUpdate({
                'data': oDataset,
                //'properties' : properties,
                //'scales' : scales,
                //'customizations' : customizations,
                'feeds': aFeeds
            });


            vizFrame.setVizType('stacked_combination'); //('stacked_combination');
            if ((!showAllocationLimit &&
                !showLicensedSpace && !showColumnStoreData && !showRowStoreData && showPeakMemoryUsage)
                ||
                (showAllocationLimit &&
                    !showLicensedSpace && !showColumnStoreData && !showRowStoreData && !showPeakMemoryUsage)
                ||
                (!showAllocationLimit && showLicensedSpace && !showColumnStoreData && !showRowStoreData && !showPeakMemoryUsage)) {
                vizFrame.setVizType('line'); //('stacked_combination');   
            }
            if ((!showAllocationLimit && !showLicensedSpace && !showColumnStoreData && showRowStoreData && !showPeakMemoryUsage)
                || (!showAllocationLimit && !showLicensedSpace && showColumnStoreData && !showRowStoreData && !showPeakMemoryUsage)) {
                vizFrame.setVizType('column');
            }
            if ((!showAllocationLimit && !showLicensedSpace && showColumnStoreData && showRowStoreData && !showPeakMemoryUsage)
            ) {
                
                vizFrame.setVizType('stacked_column');
            }
            vizFrame.setVisible(true);
            if (!showAllocationLimit &&
                !showLicensedSpace && !showColumnStoreData && !showRowStoreData && !showPeakMemoryUsage) {
                vizFrame.destroyDataset();
                vizFrame.removeAllFeeds();
                vizFrame.destroyFeeds();
                vizFrame.setVisible(false);
            }
            //vizFrame.setVizType('combination'); //dual_combination is not supported in this version of UI5
            //vizFrame.setVizType('column');
        },
        /**
        * Updates the Viz Frame with the necessary data and properties.
        *
        * @private
        * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to update
        */
        _updateVizFrame: function (vizFrame) {
            
            var oVizFrame = this._constants.vizFrame;

            vizFrame.setVizProperties(Object.assign({
                plotArea: {

                    dataShape: {
                        primaryAxis: ["line", "line", "bar", "bar"],
                        secondaryAxis: ["bar"]
                    }
                }
            },this._oCommonVizProperties));


            var oDataset = new sap.viz.ui5.data.FlattenedDataset(this._constants.vizFrame.dataset);
            //console.log
            // var oVizFramePath = oVizFrame.modulePath;
            
            //var oModel = new sap.ui.model.odata.ODataModel(oVizFramePath);
            let oModel = this.getOwnerComponent().getModel();                                   
            
            
            
            
            vizFrame.setDataset(oDataset);

            vizFrame.setModel(oModel);
            
            
            this._addFeedItems(vizFrame, oVizFrame.feedItems);

            //vizFrame.setVizType(oVizFrame.type);
            vizFrame.setVizType('stacked_combination'); //('stacked_combination'); 
            //vizFrame.setVizType('combination'); //dual_combination is not supported in this version of UI5
            //vizFrame.setVizType('column');
        },
        /**
        * Adds the passed feed items to the passed Viz Frame.
        *
        * @private
        * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to add feed items to
        * @param {Object[]} feedItems Feed items to add
        */
        _addFeedItems: function (vizFrame, feedItems) {
            for (var i = 0; i < feedItems.length; i++) {
                vizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem(feedItems[i]));
            }
        },        
        _initViewPropertiesModel: function () {

		}

	});

});