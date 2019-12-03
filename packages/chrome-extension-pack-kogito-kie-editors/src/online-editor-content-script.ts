/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.messageId && request.messageId == "LOAD_ONLINE_EDITOR") {
    const event = new CustomEvent("loadOnlineEditor", {
      detail: {
        fileName: request.filePath,
        fileContent: request.fileContent,
        modifiable: request.modifiable
      }
    });
    window.dispatchEvent(event);
    sendResponse({ success: true });
  } else {
    sendResponse({ success: false });
  }
});
