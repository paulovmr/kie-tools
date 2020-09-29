/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
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

import dmnEnvelopeIndex from "!!raw-loader!../../dist/resources/dmn/dmnEnvelopeIndex.html";
import { EnvelopeServer } from "@kogito-tooling/envelope-bus/dist/channel";
import { EditorApi, KogitoEditorChannelApi, KogitoEditorEnvelopeApi } from "@kogito-tooling/editor/dist/api";
import { KogitoEditorChannelApiImpl } from "../envelope/KogitoEditorChannelApiImpl";
import { StateControl } from "@kogito-tooling/editor/dist/channel";
import { MessageBusClientApi } from "@kogito-tooling/envelope-bus/dist/api";

declare global {
  interface Window {
    DmnEditor: {
      open: (args: {
        container: Element;
        initialContent: string;
        readOnly: boolean;
        origin?: string;
      }) => EditorApi & {
        stateControl: StateControl;
        envelopeApi: MessageBusClientApi<KogitoEditorEnvelopeApi>;
        close: () => void;
      };
    };
  }
}

export function open(args: { container: Element; initialContent: string; readOnly?: boolean; origin?: string }) {
  const iframe = document.createElement("iframe");
  iframe.srcdoc = dmnEnvelopeIndex;

  const envelopeServer = new EnvelopeServer<KogitoEditorChannelApi, KogitoEditorEnvelopeApi>(
    { postMessage: message => iframe.contentWindow?.postMessage(message, "*") },
    args.origin ?? window.location.origin,
    self => {
      return self.envelopeApi.requests.receive_initRequest(
        {
          origin: self.origin,
          envelopeServerId: self.id
        },
        {
          resourcesPathPrefix: "",
          fileExtension: "dmn",
          initialLocale: "en-US",
          isReadOnly: args.readOnly ?? true
        }
      );
    }
  );

  const stateControl = new StateControl();

  const listener = (message: MessageEvent) => {
    envelopeServer.receive(
      message.data,
      new KogitoEditorChannelApiImpl(
        stateControl,
        {
          fileName: "",
          fileExtension: "dmn",
          getFileContents: () => Promise.resolve(args.initialContent),
          isReadOnly: args.readOnly ?? false
        },
        "en-US",
        {}
      )
    );
  };
  window.addEventListener("message", listener);

  args.container.appendChild(iframe);
  envelopeServer.startInitPolling();

  return {
    getElementPosition: (selector: string) =>
      envelopeServer.envelopeApi.requests.receive_guidedTourElementPositionRequest(selector),
    undo: () => Promise.resolve(envelopeServer.envelopeApi.notifications.receive_editorUndo()),
    redo: () => Promise.resolve(envelopeServer.envelopeApi.notifications.receive_editorRedo()),
    getContent: () => envelopeServer.envelopeApi.requests.receive_contentRequest().then(c => c.content),
    getPreview: () => envelopeServer.envelopeApi.requests.receive_previewRequest(),
    setContent: async (content: string) =>
      envelopeServer.envelopeApi.notifications.receive_contentChanged({ content: content }),
    stateControl: stateControl,
    envelopeApi: envelopeServer.envelopeApi,
    close: () => {
      window.removeEventListener("message", listener);
      iframe.remove();
    }
  };
}

window.DmnEditor = { open };
