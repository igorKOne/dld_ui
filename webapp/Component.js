// define a root UI component that exposes the main view
jQuery.sap.declare("shell.app.local-dd3.NLTMI0.MEMORY_PROFILER.MEM_PROFILER.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

sap.ui.core.UIComponent.extend("shell.app.local-dd3.NLTMI0.MEMORY_PROFILER.MEM_PROFILER.Component", {
	metadata: {
		"name": "lower_version",
		"version": "1.1.0-SNAPSHOT",
		"library": "lower",
		"includes": ["css/fullScreenStyles.css"],
		"dependencies": {
			"libs": ["sap.m", "sap.ui.layout"],
			"components": []
		},
		"config": {
			resourceBundle: "i18n/messageBundle.properties",
			serviceConfig: {
				name: "/IWBEP/GWSAMPLE_BASIC",
				serviceUrl: "../../../service/MEM_PROFILER.xsodata/",
					parameters: {select: "INDEX,SNAPSHOT_PERIOD,TOTAL_MEMORY_PEAK, ALLOCATION_LIMIT, FUNCTIONAL_MEMORY_SIZE"}
//$select=USER_NAME,ACCESSED_VS_TOTAL,RESTRICTED_VS_TOTAL,CLASSIFICATION					
//					         /shell/app/local-dd3/NLTMI0/OL_AUTH_APP/OL_AUTH/webapp/odata/OL_AUTH.xsodata/$metadata					
			}
		},
		routing: {
			// The default values for routes
			config: {
				"viewType": "XML",
				"viewPath": "shell.app.local-dd3.NLTMI0.MEMORY_PROFILER.MEM_PROFILER.view",
				"targetControl": "fioriContent", // This is the control in which new views are placed
				"targetAggregation": "pages", // This is the aggregation in which the new views will be placed
				"clearTarget": false
			},
			routes: [{
				pattern: "",
				name: "main",
				view: "Master"
			}, {
				name: "details",
				view: "Details",
				pattern: "{entity}"
			}]
		}
	},

	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent: function() {
		var oViewData = {
			component: this
		};

		return sap.ui.view({
			viewName: "shell.app.local-dd3.NLTMI0.MEMORY_PROFILER.MEM_PROFILER.view.Main",
			type: sap.ui.core.mvc.ViewType.XML,
			viewData: oViewData
		});
	},

	init: function() {
		console.log('super init');
		// call super init (will call function "create content")
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var sRootPath = jQuery.sap.getModulePath("shell.app.local-dd3.NLTMI0.MEMORY_PROFILER.MEM_PROFILER");

		// The service URL for the oData model 
		var oServiceConfig = this.getMetadata().getConfig().serviceConfig;
		console.log(oServiceConfig);
		var sServiceUrl = oServiceConfig.serviceUrl;
//		sServiceUrl = sServiceUrl + 'AUTH_PROFILER/?$select=USER_NAME,CLASSIFICATION,ACCESSED_VS_TOTAL,UNRESTRICTED_VS_TOTAL';
		console.log(sServiceUrl);
		// the metadata is read to get the location of the i18n language files later
		var mConfig = this.getMetadata().getConfig();
		this._routeMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter(), this._bRouterCloseDialogs);

		// create oData model
		this._initODataModel(sServiceUrl);

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: [sRootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");

		// initialize router and navigate to the first page
		this.getRouter().initialize();
		console.log('end super init');
	},

	exit: function() {
		this._routeMatchedHandler.destroy();
	},

	// This method lets the app can decide if a navigation closes all open dialogs
	setRouterSetCloseDialogs: function(bCloseDialogs) {
		this._bRouterCloseDialogs = bCloseDialogs;
		if (this._routeMatchedHandler) {
			this._routeMatchedHandler.setCloseDialogs(bCloseDialogs);
		}
	},

	// creation and setup of the oData model
	_initODataModel: function(sServiceUrl) {
		jQuery.sap.require("shell.app.local-dd3.NLTMI0.MEMORY_PROFILER.MEM_PROFILER.util.messages");
		var oConfig = {
			metadataUrlParams: { //"select": "USER_NAME, RESTRICTED_VS_TOTAL, ACCESSED_VS_TOTAL, CLASSIFICATION"
				},
			json: true,
			 loadMetadataAsync : true,
			defaultBindingMode: "TwoWay",
			defaultCountMode: "Inline",
			useBatch: true
		};
		console.log('sServiceUrl = ' + sServiceUrl);
		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, oConfig);
		console.log('before msg');
		//oModel.attachRequestFailed(null, shell.app.local-dd3.NLTMI0.MEMORY_PROFILER.MEM_PROFILER.util.messages.showErrorMessage);
		console.log('after msg (to be updated');
		this.setModel(oModel);
	}
});


