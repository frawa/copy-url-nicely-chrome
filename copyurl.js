// FW 12.6.2012

function addSelection(selection,str) { 
    var clipboard = document.getElementById("clipboard");
    clipboard.innerHTML = str; 
    var range = document.createRange();
    range.setStartBefore(clipboard);
    range.setEndAfter(clipboard);  
    range.selectNode(clipboard);
    selection.addRange(range);
} 

function copyUrl(format,url,title,screenshotUrl) {
	var nice = url;
	if ( format==childWiki ) {
		nice = "[["+url+"]["+title+"]]";
	} else if ( format==childHtml ) {
		nice = "<a href='"+url+"'>"+title+"</a>";
	} else if ( format==childHtmlScreenshot ) {
		nice = "<a href='"+url+"'>"+title+"</a><br/><img src='"+screenshotUrl+"' width='640' height='480'/>";
	}
    //console.log("clip " + nice);
    var selection = window.getSelection();
    selection.removeAllRanges();
    addSelection(selection,nice);
    document.execCommand("copy"); 
}

function copyUrlFindTitle(format,byurl,tabid) {
    chrome.tabs.executeScript(tabid,{file:"content.js"});
    chrome.tabs.sendRequest(tabid, {action:"getUrlTitle", url:byurl}, function(title) {
        copyUrl(format,byurl,title);
    });
}

function copyUrlWithScreenshot(format,byurl,title) {
	var result = null;
	//chrome.tabs.captureVisibleTab(null,{format:"png"},function(url) {
	chrome.tabs.captureVisibleTab(null,null,function(url) {
        copyUrl(format,byurl,title,url);
	});
	return result;
}

// A generic onclick callback function.
function genericOnClick(info, tab) {
  //console.log("item " + info.menuItemId + " was clicked");
  	
  if ( info.linkUrl ) {
	copyUrlFindTitle(info.menuItemId,info.linkUrl,tab.id);
	return;
  }

  if ( info.menuItemId==childHtmlScreenshot ) {
	copyUrlWithScreenshot(info.menuItemId,tab.url,tab.title);
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
var childHtmlScreenshot = chrome.contextMenus.create(
  {"title": "as Html with Screenshot", "parentId": parent, "onclick": genericOnClick});
