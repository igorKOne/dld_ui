sap.ui.jsview("ol_auth_worklist.Main", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ol_auth_profiler.Main
	*/ 
	getControllerName : function() {
		return "ol_auth_worklist.Main";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ol_auth_profiler.Main
	*/ 
	createContent : function(oController) {
			var myButton = new sap.ui.commons.Button("btn");
			myButton.setText("Hello World");
			myButton.attachPres(function(){$("btn").fadeOut();});
			return myButton;
		
	}

});