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

import * as React from "react";
import { useState, useContext } from "react";
import { GlobalContext } from "../common/GlobalContext";
import { EditorContext } from "./EditorContext";
import { SingleEditorToolbar } from "./EditorToolbar";
import { FullScreenToolbar } from "./EditorFullScreenToolbar";
import { EditorIframe } from "./EditorIframe";

export function Editor(props: { content: string }) {
    const globalContext = useContext(GlobalContext);
    const editorType = extractEditorType(window.location.href);
    const [fullscreen, setFullscreen] = useState(false);
  
    return (
      <EditorContext.Provider
        value={{
          fullscreen: fullscreen,
        }}
      >
        {!fullscreen &&
          <SingleEditorToolbar
            onFullScreen={() => setFullscreen(true)}
            save={() => alert("Save!")}
          />
        }

        {fullscreen &&
          <FullScreenToolbar onExitFullScreen={() => setFullscreen(false)} />
        }

        <EditorIframe
          router={globalContext.router}
          openFileExtension={editorType!}
          getFileContents={() => { return Promise.resolve(props.content); }}
        />
      </EditorContext.Provider>
    );
}

export function extractEditorType(url: string) {
  const splitLocationHref = url.split("/").pop();
  if (!splitLocationHref) {
    return undefined;
  }

  const openFileExtensionRegex = splitLocationHref.match(/[\w\d]+/);
  if (!openFileExtensionRegex) {
    return undefined;
  }

  const openFileExtension = openFileExtensionRegex.pop();
  if (!openFileExtension) {
    return undefined;
  }

  return openFileExtension;
}
