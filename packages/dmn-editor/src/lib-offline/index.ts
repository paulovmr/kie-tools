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

import dmnEnvelopeIndex from "!!raw-loader!../../dist/resources/lib-offline/dmnEnvelopeIndex.html";
import { EnvelopeServer } from "@kogito-tooling/envelope-bus/dist/channel";
import {
  EditorContent,
  KogitoEditorChannelApi,
  KogitoEditorEnvelopeApi,
  StateControlCommand
} from "@kogito-tooling/editor/dist/api";
import { Tutorial, UserInteraction } from "@kogito-tooling/guided-tour/dist/api";
import { KogitoEdit } from "@kogito-tooling/channel-common-api/dist/KogitoEdit";
import {
  ResourceContentRequest,
  ResourceContent,
  ResourcesList,
  ResourceListRequest
} from "@kogito-tooling/channel-common-api";
import { MessageBusClientApi } from "../../../envelope-bus/src/api";

declare global {
  interface Window {
    DmnEditor: {
      open: (args: {
        container: Element;
        initialContent: string;
        readOnly: boolean;
        origin?: string;
      }) => { envelopeApi: MessageBusClientApi<KogitoEditorEnvelopeApi>; close: () => void };
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

  const listener = (message: MessageEvent) => {
    envelopeServer.receive(message.data, {
      receive_contentRequest: async () => {
        return { content: args.initialContent, path: "" };
      },
      async receive_getLocale(): Promise<string> {
        return "en-US";
      },
      receive_guidedTourRegisterTutorial(tutorial: Tutorial): void {
        /* */
      },
      receive_guidedTourUserInteraction(userInteraction: UserInteraction): void {
        /* */
      },
      receive_newEdit(edit: KogitoEdit): void {
        /* */
      },
      receive_openFile(path: string): void {
        /* */
      },
      receive_ready(): void {
        /* */
      },
      async receive_resourceContentRequest(request: ResourceContentRequest): Promise<ResourceContent | undefined> {
        return undefined;
      },
      async receive_resourceListRequest(request: ResourceListRequest): Promise<ResourcesList> {
        return { paths: [], pattern: request.pattern };
      },
      receive_setContentError(errorMessage: string): void {
        /* */
      },
      receive_stateControlCommandUpdate(command: StateControlCommand): void {
        /* */
      }
    });
  };
  window.addEventListener("message", listener);

  args.container.appendChild(iframe);
  envelopeServer.startInitPolling();

  return {
    envelopeApi: envelopeServer.envelopeApi,
    close: () => {
      window.removeEventListener("message", listener);
      iframe.remove();
    }
  };
}

window.DmnEditor = { open };
