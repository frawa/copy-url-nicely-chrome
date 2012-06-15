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

function copyUrl(format,tab) {
	var url = tab.url;
	if ( format==childWiki ) {
		url = "[["+tab.url+"]["+tab.title+"]]";
	} else if ( format==childHtml ) {
		url = "<a href='"+tab.url+"'>"+tab.title+"</a>";
	}
    //console.log("clip " + url);
    var selection = window.getSelection();
    selection.removeAllRanges();
	addSelection(selection,url);
    document.execCommand("copy"); 
}

// A generic onclick callback function.
function genericOnClick(info, tab) {
  //console.log("item " + info.menuItemId + " was clicked");
  copyUrl(info.menuItemId,tab);
}

// Create a parent item and two children.
var parent = chrome.contextMenus.create({"title": "Copy URL nicely"});
var childHtml = chrome.contextMenus.create(
  {"title": "as Html", "parentId": parent, "onclick": genericOnClick});
var childWiki = chrome.contextMenus.create(
  {"title": "as Wiki", "parentId": parent, "onclick": genericOnClick});
