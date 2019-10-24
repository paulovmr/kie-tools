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

import * as React from "react";
import { RefObject } from "react";
import { EnvelopeBusOuterMessageHandler } from "@kogito-tooling/microeditor-envelope-protocol";
import { GlobalContextType } from "../common/GlobalContext";

interface Props {
  context: GlobalContextType;
  openFileExtension: string;
  getFileContents: () => Promise<string | undefined>;
  onSave: (fileContent: string) => void;
  fullscreen: boolean;
}

export class EditorIframe extends React.Component<Props> {

  private readonly envelopeBusOuterMessageHandler: EnvelopeBusOuterMessageHandler;
  private iframeRef: RefObject<HTMLIFrameElement>;
  private listener: (msg: MessageEvent) => void;

  public constructor(props: Props) {
    super(props);
    this.envelopeBusOuterMessageHandler = new EnvelopeBusOuterMessageHandler(
      {
        postMessage: msg => {
          if (this.iframeRef.current && this.iframeRef.current.contentWindow) {
            this.iframeRef.current.contentWindow.postMessage(msg, "*");
          }
        }
      },
      self => ({
        pollInit() {
          self.request_initResponse(window.location.origin);
        },
        receive_languageRequest() {
          self.respond_languageRequest(props.context.router.getLanguageData(props.openFileExtension));
        },
        receive_contentResponse(content: string) {
          props.onSave(content);
        },
        receive_contentRequest() {
          props
            .getFileContents()
            .then(c => self.respond_contentRequest(c || ""))
        },
        receive_setContentError() {
          //TODO: Display a nice message with explanation why "setContent" failed
          console.info("Set content error");
        },
        receive_dirtyIndicatorChange(isDirty: boolean) {
          //TODO: Perhaps show window.alert to warn that the changes were not saved?
          console.info(`Dirty indicator changed to ${isDirty}`);
        },
        receive_ready() {
          console.info(`Editor is ready`);
        }
      })
    );
  }

  public requestSave() {
    this.envelopeBusOuterMessageHandler.request_contentResponse();
  }

  public componentDidMount() {
    this.props.getFileContents().then(c => this.envelopeBusOuterMessageHandler.respond_contentRequest(c || ""))
    this.listener = (msg: MessageEvent) => this.envelopeBusOuterMessageHandler.receive(msg.data);
    window.addEventListener("message", this.listener, false);
    this.envelopeBusOuterMessageHandler.startInitPolling();
  }

  public componentWillUnmount() {
    this.envelopeBusOuterMessageHandler.stopInitPolling();
    window.removeEventListener("message", this.listener);
  }

  public render() {
    this.iframeRef = React.createRef();
  
    return (
      <iframe
        ref={this.iframeRef}
        id={"kogito-iframe"}
        className={this.props.fullscreen ? "fullscreen" : "not-fullscreen"}
        src={this.props.context.router.getRelativePathTo("envelope/index.html")}
      />
    );
  };
}
