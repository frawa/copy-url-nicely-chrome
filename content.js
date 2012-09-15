// FW 15.6.2012

//if ( window == top ) {
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == "getUrlTitle") {
        var result = request.url;
        var list = document.getElementsByTagName('a');
        for (var i=0; i<list.length; i++) {
	        if ( list.item(i).href == request.url ) {
	            result=list.item(i).textContent;
	            break;
            }
        }
        sendResponse(result);
    } else if (request.action == "getSelectedUrls") {
        var result = [];
		var sel = window.getSelection();
        for (var r=0; r<sel.rangeCount; r++) {
			var range = sel.getRangeAt(r);
			var selectionContents = range.cloneContents();		
			var list = selectionContents.querySelectorAll('a');
			for (var i=0; i<list.length; i++) {
				result[i] = {
					'url': list.item(i).href,
					'title': list.item(i).textContent
				};
				console.log("FW "+list.item(i));
			}
		}
		console.log("FW "+result);
        sendResponse(result);
    } else {
        sendResponse(null);
    }
});
//}

