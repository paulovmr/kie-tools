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
import { GlobalContext } from "../common/GlobalContext";
import { SingleEditorToolbar } from "./EditorToolbar";
import { FullScreenToolbar } from "./EditorFullScreenToolbar";
import { EditorIframe } from "./EditorIframe";
import { EditorStateType, EditorState } from "./EditorState";
import { RefObject } from "react";
import {
  Page,
  Stack, 
  StackItem
} from '@patternfly/react-core';
import "@patternfly/patternfly/patternfly.css";

interface Props {
  getFileContents: () => Promise<string | undefined>;
  fileName: string;
  fileExtension: string;
  onClose: () => void;
}

export class Editor extends React.Component<Props, EditorStateType> {
  public static contextType = GlobalContext;

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
    const editorIframeRef: RefObject<EditorIframe> = React.createRef();

    return (
        <EditorState.Provider value={{ fullscreen: this.state.fullscreen }}>
          <Page>
            <Stack>
              <StackItem>
                {!this.state.fullscreen &&
                  <SingleEditorToolbar
                    onFullScreen={() => this.setState({ fullscreen: true })}
                    onSave={() => editorIframeRef.current!.requestSave()}
                    onClose={() => this.props.onClose()}
                  />
                }

                {this.state.fullscreen &&
                  <FullScreenToolbar onExitFullScreen={() => this.setState({ fullscreen: false })} />
                }
              </StackItem>
              <StackItem className="pf-m-fill">
                <EditorIframe
                ref={editorIframeRef}
                openFileExtension={this.props.fileExtension}
                getFileContents={this.props.getFileContents}
                context={this.context}
                onSave={(content) => this.save(content)}
                fullscreen={this.state.fullscreen}
              />
              </StackItem>
            </Stack>
          </Page>

        </EditorState.Provider>
    )
  };
}
