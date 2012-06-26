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
		nice = "<a href='"+url+"'>"+title+"</a><br/><img src='"+screenshotUrl+"' width='100%'/>";
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
	chrome.tabs.captureVisibleTab(null,{format:"png"},function(url) {
	//chrome.tabs.captureVisibleTab(null,null,function(url) {
        copyUrl(format,byurl,title,url);
	});
	return result;
}

/*
function mailClipboard(title,tabid) {
	var action_url = "mailto:?subject="+encodeURIComponent(title) + "&";

	var body = document.getElementById("clipboard").innerHTML;
    action_url += "body=" + encodeURIComponent(body);

    console.log('Action url: ' + action_url);
    chrome.tabs.create({ url: action_url }, function(tab) {
		chrome.tabs.remove(tab.id);
	});
}
*/
function mailClipboard(title,tabid) {
	var mail = document.getElementById("mail");
	mail.action="mailto:?subject="+encodeURIComponent(title);

	var body = document.getElementById("clipboard").innerHTML;
	mail.elements[0].value=body;
	
	document.forms['mail'].submit();
}

// A generic onclick callback function.
function genericOnClick(info, tab) {
  //console.log("item " + info.menuItemId + " was clicked");
  	
  if ( info.linkUrl ) {
	copyUrlFindTitle(info.menuItemId,info.linkUrl,tab.id);
	return;
  }
  
  copyUrl(info.menuItemId,tab.url,tab.title);
}

function screenshotOnClick(info, tab) {
  copyUrlWithScreenshot(childHtmlScreenshot,tab.url,tab.title);
}

function mailOnClick(info, tab) {
  screenshotOnClick(info,tab);
  mailClipboard(tab.title,tab.id);
}

// Create a parent item and two children.
var contexts = ["page","link"];
var parent = chrome.contextMenus.create({"title": "Copy URL nicely", "contexts":contexts});
var childHtml = chrome.contextMenus.create(
  {"title": "as Html", "parentId": parent, "onclick": genericOnClick, "contexts":contexts});
var childWiki = chrome.contextMenus.create(
  {"title": "as Wiki", "parentId": parent, "onclick": genericOnClick, "contexts":contexts});
var childHtmlScreenshot = chrome.contextMenus.create(
  {"title": "as Html with Screenshot", "parentId": parent, "onclick": screenshotOnClick});
var childMail = chrome.contextMenus.create(
  {"title": "as Mail", "parentId": parent, "onclick": mailOnClick});
