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

import { GitHubDomElements } from "./GitHubDomElements";

export class GitHubDomElementsEdit implements GitHubDomElements {
  public toolbarContainer() {
    return document.querySelector(".breadcrumb.d-flex.flex-items-center")!;
  }

  public getFileContents() {
    return Promise.resolve((document.querySelector(".file-editor-textarea")! as HTMLTextAreaElement).value);
  }

  public githubTextEditorToReplace() {
    return document.querySelector(".js-code-editor")! as HTMLElement;
  }

  public iframeContainer() {
    const element = () => document.getElementById("kogito-iframe-container")!;
    if (!element()) {
      document
        .querySelector(".file")!
        .insertAdjacentHTML("afterend", `<div id="kogito-iframe-container" class="edit"></div>`);
    }
    return element();
  }

  public iframeFullscreenContainer() {
    const element = () => document.getElementById("kogito-iframe-fullscreen-container")!;
    if (!element()) {
      document.body.insertAdjacentHTML("afterbegin", `<div id="kogito-iframe-fullscreen-container"></div>`);
    }
    return element();
  }
}
