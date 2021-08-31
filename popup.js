// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var showUI = document.getElementById('showUI');

showUI.onclick = function(element) {
    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.executeScript(
            tab.id,
            {file : "inject.js"});
        window.close();
    } );
};
