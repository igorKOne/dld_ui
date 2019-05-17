//jQuery.sap.declare("MEM_PROFILER.util.messages");
//jQuery.sap.require("sap.ca.ui.message.message");
sap.ui.define(["sap/ca/ui/message/message",
"sap/ui/model/json/JSONModel"], function(message,JSONModel) {
	"use strict";
	

function _parseError(oParameter) {
	var sMessage = "",
		sDetails = "",
		oEvent = null,
		oResponse = null,
		oError = {};

	if (oParameter["mParameters"]) {
		oEvent = oParameter;
		sMessage = oEvent.getParameter("message");
		sDetails = oEvent.getParameter("responseText");
	} else {
		oResponse = oParameter;
		sMessage = oResponse.message;
		sDetails = oResponse.response.body;
	}

	if (jQuery.sap.startsWith(sDetails, "{\"error\":")) {
		var oErrModel = new sap.ui.model.json.JSONModel();
		oErrModel.setJSON(sDetails);
		sMessage = oErrModel.getProperty("/error/message/value");
	}

	oError.sDetails = sDetails;
	oError.sMessage = sMessage;
	return oError;
}	
	return {
//MEM_PROFILER.util.messages = {};

/**
 * Show an error dialog with information from the oData response object.
 *
 * @param {object}
 *            oParameter The object containing error information
 * @return {void}
 * @public
 */
showErrorMessage: function (oParameter) {
	var oErrorDetails = _parseError(oParameter);
	var oMsgBox = sap.ca.ui.message.showMessageBox({
		type: sap.ca.ui.message.Type.ERROR,
		message: oErrorDetails.sMessage,
		details: oErrorDetails.sDetails
	});
	if (!sap.ui.Device.support.touch) {
		oMsgBox.addStyleClass("sapUiSizeCompact");
	}
},

getErrorContent: function (oParameter) {
	return _parseError(oParameter).sMessage;
}
};
});