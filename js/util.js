(function(window, document, undefined) {
  var Util = {};

  /*
   * Renders provided data (@dataObj) in the specified Handlebars template (@$template)
   * and puts that html in the target html element (@$target)
   */
  Util.renderHandlebars = function($target, $template, dataObj) {
  	if($target == null || $template == null || dataObj == null) {
  		return;
  	}
		var render = Handlebars.compile($template.html());
		var finalHTML = render(dataObj);
		$target.html(finalHTML);
  }

  /*
   * Displays an the param error message in the default error div
   */
  Util.displayErrMsg = function(msg) {
  	var errorDivs = document.getElementsByClassName('error'); //written in vanilla js b/c jquery wasn't working
  	var errorDiv = errorDivs[0];
  	errorDiv.innerHTML = msg;
  }

  window.Util = Util;
})(this, this.document);
