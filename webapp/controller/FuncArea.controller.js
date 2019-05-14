sap.ui.define([
       'jquery.sap.global',
       'sap/ui/core/Fragment',
       //'sap/ui/core/mvc/Controller',
          "./BaseController",
       'sap/ui/model/Filter',
       'sap/ui/model/Sorter',
       'sap/ui/model/json/JSONModel',
       '../model/Formatter',
], function (jQuery, Formatter, Fragment, Controller, Filter, Sorter, JSONModel) {
       "use strict";



       Controller.extend("one.labs.mem_profiler.view.FuncArea", {



              //chart stuff
              _constants: {
                     sampleName: "one.labs.mem_profiler",



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
                            modulePath: this._getModulePath(),//"/odata/MEM_PROFILER.xsodata",


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


              },
              //end chart stuff

              /**
              * Changeable properties depending on the app's state.
              *
              * @private
              * @property {String[]} chartContainerId Id of the chart container
              * @property {sap.suite.ui.commons.ChartContainer} chartContainer Chart container object
              * @property {Object} content Chart container content object
              * @property {Object} content.chart Chart container content chart object
              * @property {Object} content.table Chart container content table object
              */
              _state: {
                     chartContainer: null,
                     content: {
                            chart: null,
                            table: null
                     }
              },

              _oDialog: null,
              onInit: function () {
                     jQuery.sap.log.info('in init platform controller');
                     /*              var oModel = new sap.ui.model.json.JSONModel(this.settingsModel);
                                   oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
                                   this.getView().setModel(oModel);
                                   
                                   var oVizFrame = this.oVizFrame = this.getView().byId("vizFrame");
                                   var dataModel = new sap.ui.model.json.JSONModel(this.dataPath + "/odata/MEM_PROFILER.xsodata");
                                   oVizFrame.setModel(dataModel);
                     */

                     this._oView = this.getView();
                     this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
                     this._oResourceBundle = this._oComponent.getModel("i18n").getResourceBundle();
                     this._oRouter = this._oComponent.getRouter();

                     this._initViewPropertiesModel();
                     jQuery.sap.log.info(this);
                     var oModel = this._oComponent.getModel();
                     jQuery.sap.log.info(oModel);


                     jQuery.sap.log.info('end first part init master controller');


                     //              this._updateCustomIcons(this._constants.customIcons);

                     jQuery.sap.log.info('after updatecustomeicons');

                     var platformChart = this.getView().byId('platformMicroChart');
                     jQuery.sap.log.info('--->>>' + platformChart);
                     //              platformChart.bindData('/odata/MEM_PROFILER.xsodata/PLATFORM_OVERVIEW');
                     jQuery.sap.log.info('--->>>' + platformChart);




                     // start concept
                     var oDatasetModel; //new sap.ui.model.json.JSONModel(microData);
                     var oDatasetView = this.getView();
                     jQuery.sap.log.info('!!!!!!     FuncArea MODEL Binding');
                     var xsjsUrl = '/MEM_PROFILER/webapp/view/Business3.xsjs';
                     var microData = jQuery.ajax({
                            url: xsjsUrl,
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                   jQuery.sap.log.info('success function result funcarea: ' + data);
                                   oDatasetModel = new sap.ui.model.json.JSONModel(data);
                                   oDatasetView.setModel(oDatasetModel);
                            }
                     });
                     jQuery.sap.log.info(microData);



                     jQuery.sap.log.info(oDatasetModel);
                     jQuery.sap.log.info(this.getView());

                     // end concept

              },


              //new
              /* ============================================================ */
              /* Helper Methods                                               */
              /* ============================================================ */
              /**
              * Created table content for the chart container, with the given path to the data.
              *
              * @private
              */
              _createContent: function () {
                     var oVizFramePath = jQuery.sap.getModulePath(this._constants.sampleName, this._constants.table.modulePath);
                     var oVizFrameModel = new sap.ui.model.json.JSONModel(oVizFramePath);
                     var oTableConfig = this._constants.table;
                     var oTable = new sap.m.Table({
                            width: "100%",
                            fixedLayout: true,
                            columns: this._createTableColumns(oTableConfig.columnLabelTexts)
                     });
                     var oTableItemTemplate = new sap.m.ColumnListItem({
                            type: sap.m.ListType.Active,
                            cells: this._createLabels(oTableConfig.templateCellLabelTexts)
                     });

                     oTable.bindItems(oTableConfig.itemBindingPath, oTableItemTemplate, null, null);
                     oTable.setModel(oVizFrameModel);

                     return new sap.suite.ui.commons.ChartContainerContent({
                            icon: oTableConfig.icon,
                            title: oTableConfig.title,
                            content: oTable
                     });
              },
              /**
              * Calls the method to add the dimension selector for each of the passed selectors.
              *
              * @private
              * @param {sap.m.Select[]} dimensionSelectors Dimension selectors
              */
              _addDimensionSelectorItems: function (dimensionSelectors) {
                     for (var i = 0; i < dimensionSelectors.length; i++) {
                            this._addDimensionSelectorItem(i, dimensionSelectors[i]);
                     }
              },
              /**
              * Calls the method to create a select item for each of the selector's items and adds it to the select element.
              *
              * @private
              * @param {Int} index Index of the dimension selector
              * @param {sap.m.Select} dimensionSelector Dimension selector
              */
              _addDimensionSelectorItem: function (index, dimensionSelector) {
                     var oItem;
                     var oSelect = this.getView().byId(dimensionSelector.id);
                     for (var i = 0; i < dimensionSelector.items.length; i++) {
                            oItem = this._createSelectItem(index, dimensionSelector.items[i]);
                            oSelect.addItem(oItem);
                     }
              },
              /**
              * Returns a new instance of sap.ui.core.Item given the specified key and text.
              *
              * @private
              * @param {String} key Item key
              * @param {String} text Item text
              */
              _createSelectItem: function (key, text) {
                     return new sap.ui.core.Item({
                            key: key,
                            text: text
                     });
              },
              /**
              * Calls update icon method for each of the passed custom icons.
              *
              * @private
              * @param {sap.ui.core.Icon[]} icons Custom icons
              */
              _updateCustomIcons: function (icons) {
                     for (var i = 0; i < icons.length; i++) {
                            this._updateIcon(icons[i]);
                     }
              },
              /**
              * Adds all the necessary properties to the given icon.
              *
              * @private
              * @param {sap.ui.core.Icon} icon Custom icon
              */
              _updateIcon: function (icon) {
                     var fnOnPress;
                     var oIcon = this.getView().byId(icon.id);
                     var sIconPressMessage = icon.pressMessage + icon.id;

                     oIcon.setSrc(icon.src);
                     oIcon.setTooltip(icon.tooltip);

                     if (icon.id === this._constants.contentSwitchButtonId) {
                            fnOnPress = this._switchContent;
                     } else {
                            fnOnPress = this._showMessageToast;
                     }

                     oIcon.attachPress(fnOnPress.bind(this, sIconPressMessage));
              },
              /**
              * Calls the message toast show method with the given message.
              *
              * @private
              * @param {String} message Message for message toast
              */
              _showMessageToast: function (message) {
                     sap.m.MessageToast.show(message);
              },
              /**
              * Switched between chart and table data content.
              *
              * @private
              * @param {String} message Message for message toast
              */
              _switchContent: function (message) {
                     var oSelectedContent = this._state.chartContainer.getSelectedContent();

                     this._showMessageToast(message);

                     // if it's the first time, save the chart's reference and switch to the table
                     if (!this._state.content.chart) {
                            this._state.content.chart = oSelectedContent;
                            this._state.chartContainer.switchChart(this._state.content.table);

                            return;
                     }

                     if (oSelectedContent === this._state.content.table) {
                            this._state.chartContainer.switchChart(this._state.content.chart);
                     } else {
                            this._state.chartContainer.switchChart(this._state.content.table);
                     }
              },
              /**
              * Updates the Viz Frame with the necessary data and properties.
              *
              * @private
              * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to update
              */
              _updateVizFrame: function (vizFrame) {
                     jQuery.sap.log.info('updateVizFrame');
                     var oVizFrame = this._constants.vizFrame;

                     vizFrame.setVizProperties({
                            plotArea: {

                                   dataShape: {
                                          primaryAxis: ["line", "line", "bar", "bar"]
                                   }
                            },

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
                                   visible: false,
                                   text: 'Revenue by City and Store Name'
                            }
                     });


                     var oDataset = new sap.viz.ui5.data.FlattenedDataset(this._constants.vizFrame.dataset);
                     //console.log
                     var oVizFramePath = jQuery.sap.getModulePath(this._constants.sampleName, oVizFrame.modulePath);
                     jQuery.sap.log.info(oVizFramePath);
                     //            var oModel = new sap.ui.model.json.JSONModel(oVizFramePath);
                     var oModel = new sap.ui.model.odata.ODataModel(oVizFramePath);
                     jQuery.sap.log.info(oModel);
                     jQuery.sap.log.info('--->>>>>>');
                     jQuery.sap.log.info(oDataset);
                     jQuery.sap.log.info('<<<<<---');
                     vizFrame.setDataset(oDataset);

                     vizFrame.setModel(oModel);
                     jQuery.sap.log.info('feed:');
                     jQuery.sap.log.info(oVizFrame.feedItems);
                     this._addFeedItems(vizFrame, oVizFrame.feedItems);

                     //vizFrame.setVizType(oVizFrame.type);
                     vizFrame.setVizType('stacked_combination');
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
              /**
              * Creates table columns with labels as headers.
              *
              * @private
              * @param {String[]} labels Column labels
              * @returns {sap.m.Column[]} Array of columns
              */
              _createTableColumns: function (labels) {
                     var aLabels = this._createLabels(labels);

                     return this._createControls(sap.m.Column, "header", aLabels);
              },
              /**
              * Creates label control array with the specified texts.
              *
              * @private
              * @param {String[]} labelTexts text array
              * @returns {sap.m.Column[]} Array of columns
              */
              _createLabels: function (labelTexts) {
                     return this._createControls(sap.m.Label, "text", labelTexts);
              },
              /**
              * Creates an array of controls with the specified control type, property name and value.
              *
              * @private
              * @param {sap.ui.core.control} control Control type to create
              * @param {String} prop Property name
              * @param {Array} propValues Value of the control's property
              * @returns {sap.ui.core.control[]} array of the new controls
              */
              _createControls: function (control, prop, propValues) {
                     var aControls = [];

                     var oProps = {};
                     for (var i = 0; i < propValues.length; i++) {
                            oProps[prop] = propValues[i];
                            aControls.push(new control(oProps));
                     }

                     return aControls;
              },
              //end new




              // The model created here is used to set values or view element properties that cannot be bound
              // directly to the OData service. Setting view element attributes by binding them to a model is preferable to the
              // alternative of getting each view element by its ID and setting the values directly because a JSon model is more
              // robust if the customer removes view elements (see extensibility).
              _initViewPropertiesModel: function () {
                     jQuery.sap.log.info('in _initViewPropertiesModel');
                     var oViewElemProperties = {};
                     if (sap.ui.Device.system.phone) {
                            oViewElemProperties.availabilityColumnWidth = "80%";
                            oViewElemProperties.pictureColumnWidth = "5rem";
                            oViewElemProperties.btnColHeaderVisible = true;
                            oViewElemProperties.searchFieldWidth = "100%";
                            oViewElemProperties.catalogTitleVisible = false;
                            // in phone mode the spacer is removed in order to increase the size of the search field
                            this.byId("tableToolbar").removeContent(this.byId("toolbarSpacer"));
                     } else {
                            oViewElemProperties.availabilityColumnWidth = "18%";
                            oViewElemProperties.pictureColumnWidth = "9%";
                            oViewElemProperties.btnColHeaderVisible = false;
                            oViewElemProperties.searchFieldWidth = "30%";
                            oViewElemProperties.catalogTitleVisible = true;
                     }
                     this._oViewProperties = new sap.ui.model.json.JSONModel(oViewElemProperties);
                     this._oView.setModel(this._oViewProperties, "viewProperties");
              },

              onNavBack: function () {
                     window.history.go(-1);
              },


              // Dialog sorting, grouping 



              handleViewSettingsDialogButtonPressed: function (oEvent) {
                     jQuery.sap.log.info(oEvent.getId());
                     if (!this._oDialog) {
                            this._oDialog = sap.ui.xmlfragment("one.labs.mem_profiler.view.UserSettingDialog", this);
                     }
                     // toggle compact style
                     jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
                     this._oDialog.open();
              },

              handleReportViewSettingsDialogButtonPressed: function (oEvent) {
                     jQuery.sap.log.info(oEvent.getId());
                     if (!this._oDialog) {
                            this._oDialog = sap.ui.xmlfragment("one.labs.mem_profiler.view.UserReportSettingDialog", this);
                     }
                     // toggle compact style
                     jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
                     this._oDialog.open();
              },

              handleDatasetViewSettingsDialogButtonPressed: function (oEvent) {
                     jQuery.sap.log.info(oEvent.getId());
                     if (!this._oDialog) {
                            this._oDialog = sap.ui.xmlfragment("one.labs.mem_profiler.view.DatasetSettingDialog", this);
                     }
                     // toggle compact style
                     jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
                     this._oDialog.open();
              },

              handleConfirmDataset: function (oEvent) {
                     jQuery.sap.log.info("in confirm report");
                     var oView = this.getView();
                     jQuery.sap.log.info(oView);
                     jQuery.sap.log.info('hierboven oView');
                     var oTable = oView.byId("datasetTable");
                     var oBinding = this.byId("datasetTable").getBinding("items");
                     //var oModel = this.getModel();
                     jQuery.sap.log.info(oTable);
                     jQuery.sap.log.info(oTable + 'oTable');

                     var oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
                     var oModel = this._oComponent.getModel();
                     //this.oRouter = this.oComponent.getRouter();          
                     jQuery.sap.log.info(oModel);
                     jQuery.sap.log.info(oTable);
                     jQuery.sap.log.info(oTable + 'oTable');

                     var mParams = oEvent.getParameters();
                     //var oBinding = oTable.getBinding("items");
                     jQuery.sap.log.info(oBinding + 'obinding');
                     jQuery.sap.log.info(oBinding);
                     var testFilter = oBinding.aFilters;
                     jQuery.sap.log.info('testFilter:');
                     jQuery.sap.log.info(testFilter);
                     jQuery.sap.log.info('event:');
                     jQuery.sap.log.info(oEvent);
                     jQuery.sap.log.info('mParams');
                     jQuery.sap.log.info(mParams);
                     for (var i = 0; i < testFilter.length; i++) {
                            jQuery.sap.log.info(testFilter[i]);
                            var localPath = testFilter[i].sPath;
                            jQuery.sap.log.info("localPath");
                            jQuery.sap.log.info(localPath);
                            jQuery.sap.log.info(testFilter[i].oValue1);
                            jQuery.sap.log.info(testFilter[i].oValue2);
                            jQuery.sap.log.info(testFilter[i].sOperator);
                     }

                     // apply sorter to binding
                     // (grouping comes before sorting)
                     var aSorters = [];
                     if (mParams.groupItem) {
                            var sPath = mParams.groupItem.getKey();
                            jQuery.sap.log.info(sPath + 'spath');
                            var bDescending = mParams.groupDescending;
                            jQuery.sap.log.info(bDescending + 'bDescending');
                            var vGroup = this.mGroupFunctions[sPath];
                            jQuery.sap.log.info(vGroup + 'vGroup');
                            aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
                     }
                     var sPath = mParams.sortItem.getKey();
                     jQuery.sap.log.info(sPath + 'sPath');
                     jQuery.sap.log.info(mParams);
                     var bDescending = mParams.sortDescending;
                     jQuery.sap.log.info(bDescending + 'bDescending');
                     jQuery.sap.log.info(aSorters);
                     aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
                     jQuery.sap.log.info(aSorters);
                     jQuery.sap.log.info('oBinding:');
                     jQuery.sap.log.info(oBinding);
                     oBinding.sort(aSorters);
                     jQuery.sap.log.info(oBinding);
                     jQuery.sap.log.info('no sort');
                     // apply filters to binding
                     var aFilters = [];
                     jQuery.each(mParams.filterItems, function (i, oItem) {
                            var aSplit = oItem.getKey().split("___");
                            var sPath = aSplit[0];
                            var sOperator = aSplit[1];
                            var sValue1 = aSplit[2];
                            var sValue2 = aSplit[3];
                            jQuery.sap.log.info('filtertest');
                            jQuery.sap.log.info(sPath);
                            jQuery.sap.log.info(sOperator);
                            jQuery.sap.log.info(sValue1);
                            jQuery.sap.log.info(sValue2);
                            jQuery.sap.log.info(oFilter);

                            jQuery.sap.log.info(aFilters);

                            var oFilter = new sap.ui.model.Filter(sPath,

                                   sOperator
                                   , sValue1, sValue2);
                            aFilters.push(oFilter);

                     });

                     //test
                     //Set filter values chosen by user-clicks (user_name, report_name, dataset):
                     //var sUserName = this.byId("USER_NAME_FILTER").getValue();
                     //if (sUserName != ''){
                     //     var sFilter = new sap.ui.model.Filter("USER_NAME_CUSTOM",sap.ui.model.FilterOperator.EQ, sUserName);
                     //     aFilters.push(sFilter);
                     //}
                     jQuery.sap.log.info(aFilters);
                     oBinding.filter(aFilters);
                     jQuery.sap.log.info(oBinding);
                     jQuery.sap.log.info('no jquery');
                     // update filter bar
                     oView.byId("vsdDatasetFilterBar").setVisible(aFilters.length > 0);
                     jQuery.sap.log.info('na vsdFilterBar');
                     oView.byId("vsdDatasetFilterLabel").setText(mParams.filterString);
                     jQuery.sap.log.info('na vsdFilterLabel');


              },

              handleConfirmReport: function (oEvent) {
                     jQuery.sap.log.info("in confirm report");
                     var oView = this.getView();
                     jQuery.sap.log.info(oView);
                     jQuery.sap.log.info('hierboven oView');
                     var oTable = oView.byId("ReportTable");
                     var oBinding = this.byId("ReportTable").getBinding("items");
                     //var oModel = this.getModel();
                     jQuery.sap.log.info(oTable);
                     jQuery.sap.log.info(oTable + 'oTable');

                     var oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
                     var oModel = this._oComponent.getModel();
                     //this.oRouter = this.oComponent.getRouter();          
                     jQuery.sap.log.info(oModel);
                     jQuery.sap.log.info(oTable);
                     jQuery.sap.log.info(oTable + 'oTable');

                     var mParams = oEvent.getParameters();
                     //var oBinding = oTable.getBinding("items");
                     jQuery.sap.log.info(oBinding + 'obinding');
                     jQuery.sap.log.info(oBinding);
                     jQuery.sap.log.info('event:');
                     jQuery.sap.log.info(oEvent);
                     jQuery.sap.log.info('mParams');
                     jQuery.sap.log.info(mParams);

                     // apply sorter to binding
                     // (grouping comes before sorting)
                     var aSorters = [];
                     if (mParams.groupItem) {
                            var sPath = mParams.groupItem.getKey();
                            jQuery.sap.log.info(sPath + 'spath');
                            var bDescending = mParams.groupDescending;
                            jQuery.sap.log.info(bDescending + 'bDescending');
                            var vGroup = this.mGroupFunctions[sPath];
                            jQuery.sap.log.info(vGroup + 'vGroup');
                            aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
                     }
                     var sPath = mParams.sortItem.getKey();
                     jQuery.sap.log.info(sPath + 'sPath');
                     jQuery.sap.log.info(mParams);
                     var bDescending = mParams.sortDescending;
                     jQuery.sap.log.info(bDescending + 'bDescending');
                     jQuery.sap.log.info(aSorters);
                     aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
                     jQuery.sap.log.info(aSorters);
                     jQuery.sap.log.info('oBinding:');
                     jQuery.sap.log.info(oBinding);
                     oBinding.sort(aSorters);
                     jQuery.sap.log.info(oBinding);
                     jQuery.sap.log.info('no sort');
                     // apply filters to binding
                     var aFilters = [];
                     jQuery.each(mParams.filterItems, function (i, oItem) {
                            var aSplit = oItem.getKey().split("___");
                            var sPath = aSplit[0];
                            var sOperator = aSplit[1];
                            var sValue1 = aSplit[2];
                            var sValue2 = aSplit[3];
                            jQuery.sap.log.info('filtertest');
                            jQuery.sap.log.info(sPath);
                            jQuery.sap.log.info(sOperator);
                            jQuery.sap.log.info(sValue1);
                            jQuery.sap.log.info(sValue2);
                            jQuery.sap.log.info(oFilter);

                            jQuery.sap.log.info(aFilters);

                            var oFilter = new sap.ui.model.Filter(sPath,

                                   sOperator
                                   , sValue1, sValue2);
                            aFilters.push(oFilter);

                     });

                     //test
                     //Set filter values chosen by user-clicks (user_name, report_name, dataset):
                     //var sUserName = this.byId("USER_NAME_FILTER").getValue();
                     //if (sUserName != ''){
                     //     var sFilter = new sap.ui.model.Filter("USER_NAME_CUSTOM",sap.ui.model.FilterOperator.EQ, sUserName);
                     //     aFilters.push(sFilter);
                     //}
                     jQuery.sap.log.info(aFilters);
                     oBinding.filter(aFilters);
                     jQuery.sap.log.info(oBinding);
                     jQuery.sap.log.info('no jquery');
                     // update filter bar
                     oView.byId("vsdReportFilterBar").setVisible(aFilters.length > 0);
                     jQuery.sap.log.info('na vsdFilterBar');
                     oView.byId("vsdReportFilterLabel").setText(mParams.filterString);
                     jQuery.sap.log.info('na vsdFilterLabel');


              },

              handleConfirm: function (oEvent) {

                     var oView = this.getView();
                     jQuery.sap.log.info(oView);
                     jQuery.sap.log.info('hierboven oView');
                     var oTable = oView.byId("catalogTable");
                     var oBinding = this.byId("catalogTable").getBinding("items");
                     //var oModel = this.getModel();
                     jQuery.sap.log.info(oTable);
                     jQuery.sap.log.info(oTable + 'oTable');

                     var oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
                     var oModel = this._oComponent.getModel();
                     //this.oRouter = this.oComponent.getRouter();          
                     jQuery.sap.log.info(oModel);
                     jQuery.sap.log.info(oTable);
                     jQuery.sap.log.info(oTable + 'oTable');
                     /*jQuery.sap.log.info(oModel.read("/MEMORY_PROFILER_PROFILER/?$SELECT=USER_NAME",  
                       undefined,  
                       undefined,  
                       false,  
                       function _OnSuccess(oData, response) {  
                              window.ojson = oData;  
                          },  
                       function _OnError(oError){                                  
                          }                               ));
                     
                     */


                     var mParams = oEvent.getParameters();
                     //var oBinding = oTable.getBinding("items");
                     jQuery.sap.log.info(oBinding + 'obinding');
                     jQuery.sap.log.info(oBinding);
                     jQuery.sap.log.info('event:');
                     jQuery.sap.log.info(oEvent);
                     jQuery.sap.log.info('mParams');
                     jQuery.sap.log.info(mParams);

                     // apply sorter to binding
                     // (grouping comes before sorting)
                     var aSorters = [];
                     if (mParams.groupItem) {
                            var sPath = mParams.groupItem.getKey();
                            jQuery.sap.log.info(sPath + 'spath');
                            var bDescending = mParams.groupDescending;
                            jQuery.sap.log.info(bDescending + 'bDescending');
                            var vGroup = this.mGroupFunctions[sPath];
                            jQuery.sap.log.info(vGroup + 'vGroup');
                            aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
                     }
                     var sPath = mParams.sortItem.getKey();
                     jQuery.sap.log.info(sPath + 'sPath');
                     jQuery.sap.log.info(mParams);
                     var bDescending = mParams.sortDescending;
                     jQuery.sap.log.info(bDescending + 'bDescending');
                     jQuery.sap.log.info(aSorters);
                     aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
                     jQuery.sap.log.info(aSorters);
                     jQuery.sap.log.info('oBinding:');
                     jQuery.sap.log.info(oBinding);
                     oBinding.sort(aSorters);
                     jQuery.sap.log.info(oBinding);
                     jQuery.sap.log.info('no sort');
                     // apply filters to binding
                     var aFilters = [];
                     jQuery.each(mParams.filterItems, function (i, oItem) {
                            var aSplit = oItem.getKey().split("___");
                            var sPath = aSplit[0];
                            var sOperator = aSplit[1];
                            var sValue1 = aSplit[2];
                            var sValue2 = aSplit[3];
                            //var oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
                            //var oFilter = new sap.ui.model.Filter("CLASSIFICATION_MEASURE",       sap.ui.model.FilterOperator.EQ, sValue1);
                            jQuery.sap.log.info('filtertest');
                            jQuery.sap.log.info(sPath);
                            jQuery.sap.log.info(sOperator);
                            jQuery.sap.log.info(sValue1);
                            jQuery.sap.log.info(sValue2);
                            jQuery.sap.log.info(oFilter);

                            jQuery.sap.log.info(aFilters);
                            //jQuery.sap.log.info(oValue);

                            var oFilter = new sap.ui.model.Filter(sPath,
                                   //var oFilter = new Filter(sPath,
                                   //sap.ui.model.FilterOperator.EQ
                                   sOperator
                                   , sValue1, sValue2);

                            /*            var oFilter = new sap.ui.model.Filter(sPath,
                                                       fnTest);
                                                       */
                            /*                   var oFilter = new sap.ui.model.Filter({path: sPath, test: function(oValue){
                                                       if (sOperator == 'EQ'){
                                                              jQuery.sap.log.info('EQ selected');
                                                              if (oValue == sValue1){
                                                                     jQuery.sap.log.info('true selected');
                                                                     return true;
                                                                     }
                                                              else{
                                                                     jQuery.sap.log.info('false selected');
                                                                     return false;
                                                              }
                                                       }
                                                 }});
                                                 */
                            aFilters.push(oFilter);
                            //oBinding.filter([oFilter]);
                     });
                     //jQuery.sap.log.info(sap.ui.model.FilterOperator.EQ);
                     //jQuery.sap.log.info(sap.ui.model.FilterOperator.Equals);
                     //     jQuery.sap.log.info(oFilter);
                     //Set filter values chosen by user-clicks (user_name, report_name, dataset):
                     var sUserName = this.byId("USER_NAME_FILTER").getValue();
                     if (sUserName != '') {
                            var sFilter = new sap.ui.model.Filter("USER_NAME_CUSTOM", sap.ui.model.FilterOperator.EQ, sUserName);
                            aFilters.push(sFilter);
                     }
                     jQuery.sap.log.info(aFilters);
                     oBinding.filter(aFilters);
                     jQuery.sap.log.info(oBinding);
                     //--
                     //var oFilter = new sap.ui.model.Filter("USER_NAME",
                     //            sap.ui.model.FilterOperator.Contains, sValue);
                     //     var oBinding = this.byId("catalogTable").getBinding("items");
                     //     oBinding.filter([oFilter]);
                     //--

                     jQuery.sap.log.info('no jquery');
                     // update filter bar
                     oView.byId("vsdFilterBar").setVisible(aFilters.length > 0);
                     jQuery.sap.log.info('na vsdFilterBar');
                     oView.byId("vsdFilterLabel").setText(mParams.filterString);
                     jQuery.sap.log.info('na vsdFilterLabel');



              },



              // end dialog sorting, grouping

              // --- List Handling

              // Handler method for the table search.
              onSearchPressed: function () {
                     var sValue = this.byId("searchField").getValue();
                     jQuery.sap.log.info("searchfield " + sValue);
                     var aFilter = [];
                     var oBinding = this.byId("catalogTable").getBinding("items");
                     if (sValue != "") {
                            var oFilter = new sap.ui.model.Filter("USER_NAME_CUSTOM", //USER_NAME_CUSTOM",
                                   sap.ui.model.FilterOperator.Contains, sValue);
                            aFilter.push(oFilter);
                     }
                     if (sValue == "") {
                            var oFilter = new sap.ui.model.Filter("USER_NAME_CUSTOM", //"VIEW_NAME",
                                   sap.ui.model.FilterOperator.NE, sValue);
                            aFilter.push(oFilter);
                            jQuery.sap.log.info(oFilter);
                     }
                     oBinding.filter(aFilter);
              },
              onSearchReportPressed: function () {
                     var sValue = this.byId("searchReports").getValue();
                     jQuery.sap.log.info("searchfield " + sValue);
                     var aFilter = [];
                     var oBinding = this.byId("ReportTable").getBinding("items");
                     if (sValue != "") {
                            var oFilter = new sap.ui.model.Filter("VIEW_NAME_1", //"VIEW_NAME_1",
                                   sap.ui.model.FilterOperator.Contains, sValue);
                            aFilter.push(oFilter);
                     }
                     if (sValue == "") {
                            var oFilter = new sap.ui.model.Filter("VIEW_NAME_1", //"VIEW_NAME",
                                   sap.ui.model.FilterOperator.NE, sValue);
                            aFilter.push(oFilter);
                            jQuery.sap.log.info(oFilter);
                     }
                     oBinding.filter(aFilter);

                     //var oFilter = new sap.ui.model.Filter("VIEW_NAME_1",
                     //     sap.ui.model.FilterOperator.Contains, sValue);
              },
              onSearchDatasetPressed: function () {
                     var sValue = this.byId("searchDatasets").getValue();
                     jQuery.sap.log.info("searchfield " + sValue);
                     var aFilter = [];
                     var oBinding = this.byId("datasetTable").getBinding("items");
                     jQuery.sap.log.info(oBinding);
                     if (sValue != "") {
                            var oFilter = new sap.ui.model.Filter("CUSTOM_DESCRIPTION", //"VIEW_NAME",
                                   sap.ui.model.FilterOperator.Contains, sValue);
                            aFilter.push(oFilter);
                            jQuery.sap.log.info(oFilter);
                     }
                     if (sValue == "") {
                            var oFilter = new sap.ui.model.Filter("CUSTOM_DESCRIPTION", //"VIEW_NAME",
                                   sap.ui.model.FilterOperator.NE, sValue);
                            aFilter.push(oFilter);
                            jQuery.sap.log.info(oFilter);
                     }
                     jQuery.sap.log.info(aFilter);
                     oBinding.filter(aFilter);


                     //var oFilter = new sap.ui.model.Filter("CUSTOM_DESCRIPTION",
                     //     sap.ui.model.FilterOperator.Contains, sValue);

              },
              onDatasetSelectPress: function () {
                     var aFilter = [];
                     var aFilter2 = [];
                     var aFilter3 = [];
                     var oBinding = this.byId("datasetTable").getBinding("items");
                     var oBinding2 = this.byId("ReportTable").getBinding("items");
                     var oBinding3 = this.byId("catalogTable").getBinding("items");
                     var testFilter = oBinding.aFilters;
                     for (var i = 0; i < testFilter.length; i++) {
                            jQuery.sap.log.info(testFilter[i]);
                            var localPath = testFilter[i].sPath;
                            if (localPath != "DATASET") {
                                   var oFilter = new sap.ui.model.Filter(localPath, testFilter[i].sOperator, testFilter[i].oValue1, testFilter[i].oValue2);
                                   aFilter.push(oFilter);
                            }
                     }
                     testFilter = oBinding2.aFilters;
                     for (var i = 0; i < testFilter.length; i++) {
                            jQuery.sap.log.info(testFilter[i]);
                            var localPath = testFilter[i].sPath;
                            if (localPath != "DATASET") {
                                   var oFilter = new sap.ui.model.Filter(localPath, testFilter[i].sOperator, testFilter[i].oValue1, testFilter[i].oValue2);
                                   aFilter2.push(oFilter);
                            }
                     }
                     testFilter = oBinding3.aFilters;
                     for (var i = 0; i < testFilter.length; i++) {
                            jQuery.sap.log.info(testFilter[i]);
                            var localPath = testFilter[i].sPath;
                            if (localPath != "DATASET") {
                                   var oFilter = new sap.ui.model.Filter(localPath, testFilter[i].sOperator, testFilter[i].oValue1, testFilter[i].oValue2);
                                   aFilter3.push(oFilter);
                            }
                     }
                     var oTable = this.getView().byId("datasetTable");
                     var idx = oTable.indexOfItem(oTable.getSelectedItem());
                     jQuery.sap.log.info(idx);
                     if (idx > -1) {
                            var oItems = oTable.getSelectedItems();
                            var counter = 0;
                            var oSelectedItems = [];
                            for (var i = 0; i < oItems.length; i++) {
                                   var doContinue = true;
                                   testFilter = oBinding.aFilters;
                                   for (var j = 0; j < testFilter.length; j++) {
                                          jQuery.sap.log.info(testFilter[j]);
                                          var localPath = testFilter[j].sPath;
                                          if (testFilter[j].oValue1 == decodeURI(oItems[j].getBindingContext().getObject().DATASET)) {
                                                 doContinue = false;
                                          }
                                   }
                                   if (doContinue == true) {
                                          jQuery.sap.log.info((oItems[i].getBindingContext().getObject()));
                                          jQuery.sap.log.info(oItems[i].getBindingContext().getPath());
                                          jQuery.sap.log.info(oItems[i].getBindingContext().getObject().DATASET);
                                          var str = oItems[i].getBindingContext().getPath();
                                          str = str.replace("/MEMORY_PROFILER_DATASETS('", "");
                                          str = str.replace("')", "");
                                          jQuery.sap.log.info(str);
                                          str = decodeURI(str);
                                          var oFilter = new sap.ui.model.Filter("DATASET", sap.ui.model.FilterOperator.EQ, decodeURI(oItems[i].getBindingContext().getObject().DATASET));
                                          aFilter.push(oFilter);
                                          aFilter2.push(oFilter);
                                          oFilter = new sap.ui.model.Filter("ALL_DATASETS", sap.ui.model.FilterOperator.Contains, (decodeURI(oItems[i].getBindingContext().getObject().DATASET)).concat(","));
                                          aFilter3.push(oFilter);
                                          counter++;
                                   }

                            }
                            if (counter != 0) {
                                   this.byId("deselectDataset").setProperty("visible", true);
                            }
                     }
                     else
                            this.byId("deselectDataset").setProperty("visible", false);
                     jQuery.sap.log.info(aFilter);
                     oBinding.filter(aFilter);
                     oBinding2.filter(aFilter2);
                     oBinding3.filter(aFilter3);
                     jQuery.sap.log.info("check user filter:");
                     jQuery.sap.log.info(aFilter3);

                     var aSorters = [];
                     var vGroup = this.mGroupFunctions['USER_NAME_CUSTOM'];
                     jQuery.sap.log.info(vGroup + 'vGroup');
                     aSorters.push(new sap.ui.model.Sorter('USER_NAME_CUSTOM', '', vGroup));

                     jQuery.sap.log.info(aSorters);
                     jQuery.sap.log.info('oBinding:');
                     jQuery.sap.log.info(oBinding);
                     oBinding3.sort(aSorters);
              },

              onDatasetDeselectPress: function () {
                     this.byId("deselectDataset").setProperty("visible", false);

                     var aFilter = [];
                     var oBinding = this.byId("datasetTable").getBinding("items");

                     var testFilter = oBinding.aFilters;
                     for (var i = 0; i < testFilter.length; i++) {
                            jQuery.sap.log.info(testFilter[i]);
                            var localPath = testFilter[i].sPath;
                            if (localPath != "DATASET") {
                                   var oFilter = new sap.ui.model.Filter(localPath, testFilter[i].sOperator, testFilter[i].oValue1, testFilter[i].oValue2);
                                   aFilter.push(oFilter);
                            }
                     }
                     jQuery.sap.log.info(aFilter);
                     oBinding.filter(aFilter);

                     // do the same for USER table
                     oBinding = this.byId("catalogTable").getBinding("items");
                     testFilter = oBinding.aFilters;
                     for (var i = 0; i < testFilter.length; i++) {
                            jQuery.sap.log.info(testFilter[i]);
                            var localPath = testFilter[i].sPath;
                            if (localPath != "DATASET") {
                                   var oFilter = new sap.ui.model.Filter(localPath, testFilter[i].sOperator, testFilter[i].oValue1, testFilter[i].oValue2);
                                   aFilter.push(oFilter);
                            }
                     }
                     jQuery.sap.log.info(aFilter);
                     oBinding.filter(aFilter);

                     // do the same for REPORT table
                     oBinding = this.byId("ReportTable").getBinding("items");
                     testFilter = oBinding.aFilters;
                     for (var i = 0; i < testFilter.length; i++) {
                            jQuery.sap.log.info(testFilter[i]);
                            var localPath = testFilter[i].sPath;
                            if (localPath != "DATASET") {
                                   var oFilter = new sap.ui.model.Filter(localPath, testFilter[i].sOperator, testFilter[i].oValue1, testFilter[i].oValue2);
                                   aFilter.push(oFilter);
                            }
                     }
                     jQuery.sap.log.info(aFilter);
                     oBinding.filter(aFilter);
              },

              // -> open/close the panels:       
              onOverviewPress: function (oEvent) {
                     var visibility = this.byId("vizFrame").getProperty("visible");
                     if (visibility == false) {
                            this.byId("vizFrame").setProperty("visible", true);
                     }
                     if (visibility == true) {
                            this.byId("vizFrame").setProperty("visible", false);
                     }
              },

              onPlatformPress: function (oEvent) {
                     var visibility = this.byId("platformTable").getProperty("visible");
                     if (visibility == false) {
                            this.byId("platformTable").setProperty("visible", true);
                     }
                     if (visibility == true) {
                            this.byId("platformTable").setProperty("visible", false);
                     }
              },

              onFuncAreaPress: function (oEvent) {
                     var visibility = this.byId("funcAreaTable").getProperty("visible");
                     if (visibility == false) {
                            this.byId("funcAreaTable").setProperty("visible", true);
                     }
                     if (visibility == true) {
                            this.byId("funcAreaTable").setProperty("visible", false);
                     }
              },
              // <- open/close the panels     

              // --- Navigation
              onLineItemPressed: function (oEvent) {

              }

       });

});
