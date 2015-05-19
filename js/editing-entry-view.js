(function(window, document, undefined) {
  var EditingEntryView = {};

  /* Renders a view to allow the user to edit an entry. Requires the $entry
   * element and an object representing the active entry. */
  EditingEntryView.render = function($entry, activeEntryData) {
  	var dataObj = {editing: true, entries: null, activeEntryData: activeEntryData};
		Util.renderHandlebars($entry, $('#entry-template'), dataObj);
		//attach event listeners for editing an entry
		EditingEntryView.attachEventListeners($entry);
  };

  /*
   * Attaches an event listener to the 'update' button on the editing page.
   * Sends updated data to server to be processed.
   */
  EditingEntryView.attachEventListeners = function($entry) {
  	// Attach event listener for 'update' button - triggers updating of entry
  	$('#entry .update').each(function() {
			this.addEventListener("click", function() {
				//get valus from data fields
				var eName = $('#entry input[name="name"]').first().val();
				var eAddress = $('#entry input[name="address"]').first().val();
				var eDescr = $('#entry textarea[name="description"]').first().val();
				var eID = $('#entry .id').first().val();
				var updatedEntry = {description: eDescr, address: eAddress, name: eName, id: eID};
				EntryModel.update(updatedEntry, function(error) {
					if(error) { //ERROR
						Util.displayErrMsg(error);
					} else { //OK
						EntryView.render($entry, updatedEntry);
					}
				});
			});
		});
  }

  window.EditingEntryView = EditingEntryView;
})(this, this.document);
