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
import { useContext, useRef } from "react";
import { GlobalContext, GlobalContextType } from "../common/GlobalContext";
import { SingleEditorToolbar } from "./EditorToolbar";
import { FullScreenToolbar } from "./EditorFullScreenToolbar";
import { EditorIframe } from "./EditorIframe";
import { EditorStateType, EditorState } from "./EditorState";
import { RefObject } from "react";

interface Props {
  context: GlobalContextType;
  getFileContents: () => Promise<string | undefined>;
  fileName: string;
  fileExtension: string;
  onClose: () => void;
}

export function Editor(props: { getFileContents: () => Promise<string | undefined>, fileName: string, fileExtension: string, onClose: () => void }) {
  const globalContext = useContext(GlobalContext);

  return <EditorComponent 
           context={globalContext} 
           getFileContents={props.getFileContents}  
           fileName={props.fileName}
           fileExtension={props.fileExtension}
           onClose={props.onClose} />
};

export class EditorComponent extends React.Component<Props, EditorStateType> {
  private editorIframeRef: RefObject<EditorIframe>;

  constructor(props: Props) {
    super(props);
    this.state = {
      fullscreen: false
    };
  }

  private save(content: string) {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = this.props.fileName;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  public render() {
    this.editorIframeRef = React.createRef();
    return (
      <EditorState.Provider value={{ fullscreen: this.state.fullscreen }}>
        {!this.state.fullscreen &&
          <SingleEditorToolbar
            onFullScreen={() => this.setState({ fullscreen: true })}
            onSave={() => this.editorIframeRef.current!.requestSave()}
            onClose={this.props.onClose}
          />
        }

        {this.state.fullscreen &&
          <FullScreenToolbar onExitFullScreen={() => this.setState({ fullscreen: false })} />
        }

        <EditorIframe
          ref={this.editorIframeRef}
          openFileExtension={this.props.fileExtension}
          getFileContents={this.props.getFileContents}
          context={this.props.context}
          onSave={(content) => { this.save(content) }}
          fullscreen={this.state.fullscreen}
        />
      </EditorState.Provider>
    )
  };
}
