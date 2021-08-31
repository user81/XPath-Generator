console.log(chrome.devtools.inspectedWindow.eval);


document.querySelector("#doTheStuff").onclick = function(){
    chrome.devtools.inspectedWindow.eval('window.ELEMENT_MOUSE_OVER = $0; window.os_execute();',
        { useContentScriptContext: true });
};