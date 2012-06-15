// FW 12.6.2012

function addSelection(selection,str) { 
    var clipboard = document.getElementById("clipboard"); ; 
    clipboard.innerHTML = str; 
    var range = document.createRange();
    range.setStartBefore(clipboard);
    range.setEndAfter(clipboard);  
    range.selectNode(clipboard);
    selection.addRange(range);
} 

function copyUrl(format,url,title) {
	var nice = url;
	if ( format==childWiki ) {
		nice = "[["+url+"]["+title+"]]";
	} else if ( format==childHtml ) {
		nice = "<a href='"+url+"'>"+title+"</a>";
	}
    //console.log("clip " + nice);
    var selection = window.getSelection();
    selection.removeAllRanges();
    addSelection(selection,nice);
    document.execCommand("copy"); 
}

function copyUrlfindTitle(format,byurl,tabid) {
    chrome.tabs.sendRequest(tabid, {action:"getUrlTitle", url:byurl}, function(title) {
        copyUrl(format,byurl,title);
    });
}

// A generic onclick callback function.
function genericOnClick(info, tab) {
  //console.log("item " + info.menuItemId + " was clicked");
  	
  if ( info.linkUrl ) {
	copyUrlfindTitle(info.menuItemId,info.linkUrl,tab.id);
	return;
  }

  copyUrl(info.menuItemId,tab.url,tab.title);
}

// Create a parent item and two children.
var contexts = ["page","link"];
var parent = chrome.contextMenus.create({"title": "Copy URL nicely", "contexts":contexts});
var childHtml = chrome.contextMenus.create(
  {"title": "as Html", "parentId": parent, "onclick": genericOnClick, "contexts":contexts});
var childWiki = chrome.contextMenus.create(
  {"title": "as Wiki", "parentId": parent, "onclick": genericOnClick, "contexts":contexts});
