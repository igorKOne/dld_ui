sap.ui.controller("shell.app.local-dd3.NLTMI0.MEMORY_PROFILER.MEM_PROFILER.view.Main", {

	onInit: function() {
		if (sap.ui.Device.support.touch === false) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
	}
});