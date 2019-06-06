sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library"
], function (Controller, UIComponent, mobileLibrary) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("one.labs.loadmoni_dashb.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress : function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},
		

		onNavBack: function() {
			window.history.go(-1);
		},
		
		_getModulePath: function(){
			return this.getOwnerComponent().getModel().sServiceUrl;
		},
		
		getPlatformServiceURL: function(){
			return this.getOwnerComponent().getServiceURLfromManifest("Platform");
		},
		getBusiness3ServiceURL: function(){
			return this.getOwnerComponent().getServiceURLfromManifest("Business3");
		},
		getOverviewChartConstant: function() {
			return {
            sampleName: "one.labs.mem_profiler",
            chartContainerId: "chartContainer",
            contentSwitchButtonId: "customIcon1",
            vizFrame: {
                id: "vizFrame",
                modulePath: this._getModulePath(),//"/odata/MEM_PROFILER.xsodata",
                dataset: {
                    dimensions: [{
                        name: 'MONTH_STRING',
                        value: "{MONTH_STRING}"
                        //},{
                        //name : 'Index',
                        //value : "{INDEX}"  
                    }],
                    measures: [
                        {
                            name: 'Allocation Limit',
                            value: '{ALLOCATION_LIMIT}',
                            tooltip: {
                                visible: true
                            }
                        }
                        ,

                        {
                            name: 'Licensed Space',
                            value: '{PRODUCT_LIMIT}'
                        }
                        ,

                        {
                            name: 'Peak Memory Usage',
                            value: '{TOTAL_MEMORY_USED_SIZE}'
                        }
                        ,

                        {
                            name: 'RowStore Data',
                            value: '{RS_SIZE}'
                        }
                        ,

                        {
                            name: 'ColumnStore Data',
                            value: '{CS_SIZE}'
                        }

                    ],

                    data: {
                        path: "/MEM_OVERVIEW"
                    }
                },

                type: "dual_combination",
                feedItems: [{
                    'uid': "primaryValues",
                    'type': "Measure",
                    'values': ["Allocation Limit",
                        "Licensed Space",
                        "RowStore Data",
                        "ColumnStore Data",
                        "Peak Memory Usage"]
                },
                //                     {
                //                           'uid' : "secondaryValues",
                //                           'type' : "Measure",
                //                          'values' : [ "TOTAL_MEMORY_USED_SIZE"
                //                          ]
                //                     },
                {
                    'uid': "axisLabels",
                    'type': "Dimension",
                    'values': ["MONTH_STRING"
                    ]
                }],
                feedItems2: [{
                    'uid': "primaryValues",
                    'type': "Measure",
                    'values': [
                        "Licensed Space",
                        "RowStore Data",
                        "ColumnStore Data",
                        "Peak Memory Usage"]
                },
                //                   {
                //                         'uid' : "secondaryValues",
                //                         'type' : "Measure",
                //                        'values' : [ "TOTAL_MEMORY_USED_SIZE"
                //                        ]
                //                   },
                {
                    'uid': "axisLabels",
                    'type': "Dimension",
                    'values': ["MONTH_STRING"
                    ]
                }]
            },
            table: {
                icon: "sap-icon://table-chart",
                title: "Table",
                modulePath:this._getModulePath(),
                itemBindingPath: "/MEM_OVERVIEW",
                columnLabelTexts: ["MONTH_STRING", "TOTAL_MEMORY_USED_SIZE", "ALLOCATION_LIMIT"],
                templateCellLabelTexts: ["{MONTH_STRING}", "{TOTAL_MEMORY_USED_SIZE}", "{ALLOCATION_LIMIT}"]
            },

            dimensionSelectors: [{
                id: "dimensionSelector1",
                items: ["item 0", "item 1"]
            }, {
                id: "dimensionSelector2",
                items: ["item A", "item B"]
            }],
            customIcons: [{
                id: "customIcon1",
                src: "sap-icon://table-chart",
                tooltip: "Custom Table Content",
                pressMessage: "custom-table custom icon pressed: "
            }, {
                id: "customIcon2",
                src: "sap-icon://accept",
                tooltip: "Accept",
                pressMessage: "accept custom icon pressed: "
            }, {
                id: "customIcon3",
                src: "sap-icon://activity-items",
                tooltip: "Activity Items",
                pressMessage: "activity-items custom icon pressed: "
            }],

            //
            platformData: {
                id: "platformData",
                modulePath: this._getModulePath(), //"/odata/MEM_PROFILER.xsodata",


                items: {

                    dataset: {
                        dimensions: [{
                            title: 'Staging',
                            value: "{STG_PERC}"
                        }, {
                            title: 'Reporting',
                            value: "{REP_PERC}"
                        }],

                        data: { path: "/PLATFORM_OVERVIEW" }
                    }

                }
            }
            //


        };
		},
		getOverviewState: function(){
			return {
            chartContainer: null,
            content: {
                chart: null,
                table: null
            }
        };
		}
		
	});


});