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
    } else {
        sendResponse(null);
    }
});
//}

