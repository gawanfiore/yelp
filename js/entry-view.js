(function(window, document, undefined) {
  var EntryView = {};

  /* Renders an entry into the given $entry element. Requires the object
   * representing the active entry (activeEntryData). If this object is null,
   * picks the first existing entry. If no entry exists, this view will display
   * the CreatingEntryView. */
  EntryView.render = function($entry, activeEntryData) {
    EntryModel.loadAll(function(error, entries) {
    	// Error checking
    	if(error) {
    		Util.displayErrMsg(error);
    		return;
    	}
    	//if no active entry, choose first one
    	if(activeEntryData == null && entries.length > 0) { 
    		activeEntryData = entries[0];
    	} else if(entries.length <= 0) { //if no entries at all, render creating entry form
    		CreatingEntryView.render($entry);
    	}
    	
			//Handlebars setup and rendering of template with entry data
			var dataObj = {viewing: true, entries: entries, activeEntryData: activeEntryData};
			Util.renderHandlebars($entry, $('#entry-template'), dataObj);
			
			// Attach event listeners to buttons and dropdown list
			EntryView.attachEventListeners($entry, entries, activeEntryData);
			// Render map
			var $map = $('#entry .map').first();
			GoogleMapView.render($map, activeEntryData);
    });
  };

  /*
	 * Attaches event listeners to buttons and dropdown list on the main entry viewing page.
   */
  EntryView.attachEventListeners = function($entry, entries, activeEntryData) {
  	// Attach event listeners to 'new', 'edit', and 'delete' buttons
		// Each button performs it's action on the currently displayed entry
		$('#entry .new').each(function() {
			this.addEventListener("click", function() {
				CreatingEntryView.render($entry);
			});
		});
		$('#entry .edit').each(function() {
			this.addEventListener("click", function() {
				EditingEntryView.render($entry, activeEntryData);
			});
		});
		$('#entry .delete').each(function() {
			this.addEventListener("click", function() {
				EntryModel.remove(activeEntryData.id, function(responseText) {
					if(responseText) { //ERROR
						Util.displayErrMsg(responseText);
					} else { //OK
						EntryView.render($entry, null);
					}
				});
			});
		});

		// Attach an event listener to the dropdown menu. The callback finds
		// the correct entry object and renders it through EntryView.render()
		var $select = $('#entry .dropdown select').first();
		$select.on('change', function() {
			var value = $select.val();
			//filter entries to get correct ont hat matches selected ID
			var entryMatch = entries.filter(function(entryObj) {
				if(entryObj.id == value) {
					return true;
				} else {
					return false;
				}
			})[0];
			// re-render entry view with new selected entry
			EntryView.render($entry, entryMatch);
		});
  }

  window.EntryView = EntryView;
})(this, this.document);
