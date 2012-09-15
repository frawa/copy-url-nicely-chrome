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

function getNice(format,url,title,screenshotUrl) {
	var nice = url;
	if ( format==childWiki ) {
		nice = "[["+url+"]["+title+"]]";
	} else if ( format==childHtml ) {
		nice = "<a href='"+url+"'>"+title+"</a>";
	} else if ( format==childHtmlScreenshot ) {
		nice = "<a href='"+url+"'>"+title+"</a><br/><img src='"+screenshotUrl+"' width='100%'/>";
	}
	return nice;
}

function copyUrl(format,url,title,screenshotUrl) {
	var nice = getNice(format,url,title,screenshotUrl);
    var selection = window.getSelection();
    selection.removeAllRanges();
    addSelection(selection,nice);
    document.execCommand("copy"); 
}

function copyUrls(format,urls) {
	var nl = '<br/>';
	var allNice = "";
    for (var i=0; i<urls.length; i++) {
		var nice = getNice(format,urls[i].url,urls[i].title);
		allNice += nice + nl;
    }
    var selection = window.getSelection();
    selection.removeAllRanges();
    addSelection(selection,allNice);
    document.execCommand("copy"); 
}

function copyUrlFindTitle(format,byurl,tabid) {
    chrome.tabs.executeScript(tabid,{file:"content.js"}, function() {
		chrome.tabs.sendRequest(tabid, {action:"getUrlTitle", url:byurl}, function(title) {
			copyUrl(format,byurl,title);
		});
	});
}

function copyUrlFindSelected(format,tabid) {
    chrome.tabs.executeScript(tabid,{file:"content.js"}, function() {
		chrome.tabs.sendRequest(tabid, {action:"getSelectedUrls"}, function(urls) {
			copyUrls(format,urls);
		});
	});
}

function copyUrlWithScreenshot(format,byurl,title) {
	chrome.tabs.captureVisibleTab(null,{format:"png"},function(url) {
        copyUrl(format,byurl,title,url);
	});
}

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
  if ( info.selectionText ) {
	copyUrlFindSelected(info.menuItemId,tab.id);
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
var contexts = ["page","link","selection"];
var parent = chrome.contextMenus.create({"title": "Copy URL nicely", "contexts":contexts});
var childHtml = chrome.contextMenus.create(
  {"title": "as Html", "parentId": parent, "onclick": genericOnClick, "contexts":contexts});
var childWiki = chrome.contextMenus.create(
  {"title": "as Wiki", "parentId": parent, "onclick": genericOnClick, "contexts":contexts});
var childHtmlScreenshot = chrome.contextMenus.create(
  {"title": "as Html with Screenshot", "parentId": parent, "onclick": screenshotOnClick});
var childMail = chrome.contextMenus.create(
  {"title": "as Mail", "parentId": parent, "onclick": mailOnClick});
