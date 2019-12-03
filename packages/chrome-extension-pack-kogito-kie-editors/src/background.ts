/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import HttpHeader = chrome.webRequest.HttpHeader;

chrome.runtime.onInstalled.addListener(() => {
  console.log("Kogito Tooling extension is running.");
});

function removeHeader(headers: HttpHeader[], name: string) {
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].name.toLowerCase() === name) {
      headers.splice(i, 1);
      break;
    }
  }
}

chrome.webRequest.onHeadersReceived.addListener(
  details => {
    removeHeader(details.responseHeaders!, "content-security-policy");
    removeHeader(details.responseHeaders!, "x-frame-options");
    return { responseHeaders: details.responseHeaders };
  },
  { urls: ["https://github.com/*"] },
  ["blocking", "responseHeaders"]
);

let activeTabId: number;

chrome.tabs.onActivated.addListener(function(activeInfo) {
  activeTabId = activeInfo.tabId;
});

function getActiveTab(callback: (tab: any) => void) {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    var tab = tabs[0];

    if (tab) {
      callback(tab);
    } else {
      chrome.tabs.get(activeTabId, function(tab) {
        if (tab) {
          callback(tab);
        } else {
          console.log("No active tab identified.");
        }
      });
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.messageId && request.messageId == "OPEN_ONLINE_EDITOR") {
    chrome.tabs.create({ url: "http://localhost:9001/?ext#/editor/" + extractFileExtension(request.filePath)}, tab => {
      let newTabReady = () => {
        newTabReady = () => {};
        chrome.tabs.onUpdated.removeListener(tabUpdateListener);
        chrome.tabs.sendMessage(
          tab.id!,
          {
            messageId: "LOAD_ONLINE_EDITOR",
            filePath: removeDirectories(removeFileExtension(request.filePath)),
            fileContent: request.fileContent,
            modifiable: request.modifiable
          },
          function(response: any) {
            if (response && !response.success) {
              alert("Error during online editor data load.");
              sendResponse({ success: true });
            } else {
              sendResponse({ success: false });
            }
          }
        );
      };

      chrome.tabs.get(tab.id!, function(tab) {
        if (tab.status === 'complete') {
          newTabReady();
        }
      });

      const tabUpdateListener = (updatedTabId: number, changeInfo: any) => {
        if (updatedTabId === tab.id && changeInfo.status == 'complete') {
          newTabReady();
        }
      }

      chrome.tabs.onUpdated.addListener(tabUpdateListener);
    });
  } else {
    sendResponse({ success: false });
  }
});

function extractFileExtension(fileName: string) {
  const fileExtension = fileName.split(".").pop();
  if (!fileExtension) {
    return undefined;
  }

  const openFileExtensionRegex = fileExtension.match(/[\w\d]+/);
  if (!openFileExtensionRegex) {
    return undefined;
  }

  const openFileExtension = openFileExtensionRegex.pop();
  if (!openFileExtension) {
    return undefined;
  }

  return openFileExtension;
}

function removeFileExtension(fileName: string) {
  const fileExtension = extractFileExtension(fileName);

  if (!fileExtension) {
    return fileName;
  }

  return fileName.substr(0, fileName.length - fileExtension.length - 1);
}

function removeDirectories(filePath: string) {
  return filePath.split("/").pop();;
}
