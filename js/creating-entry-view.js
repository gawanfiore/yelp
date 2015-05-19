(function(window, document, undefined) {
  var CreatingEntryView = {};

  /* Renders a view to allow the user to create an entry. Requires the $entry
   * element. */
  CreatingEntryView.render = function($entry) {
  	var dataObj = {creating: true, entries: null, activeEntryData: null};
		Util.renderHandlebars($entry, $('#entry-template'), dataObj);
		//attach event listeners for creating an entry
		CreatingEntryView.attachEventListeners($entry);
  };

  /*
   * Attaches an event listener to the 'add' button on the creating page.
   * Sends entry data to server to be added to the database.
   */
  CreatingEntryView.attachEventListeners = function($entry) {
  	// Attach event listener for 'add' button - triggers adding of entry
  	$('#entry .add').each(function() {
			this.addEventListener("click", function() {
				//get valus from data fields
				var eName = $('#entry input[name="name"]').first().val();
				var eAddress = $('#entry input[name="address"]').first().val();
				var eDescr = $('#entry textarea[name="description"]').first().val();
				var newEntry = {description: eDescr, address: eAddress, name: eName};
				EntryModel.add(newEntry, function(error, entry) {
					if(error) { //ERROR
						Util.displayErrMsg(error);
					} else { //OK
						EntryView.render($entry, entry);
					}
				});
			});
		});
  }

  window.CreatingEntryView = CreatingEntryView;
})(this, this.document);
