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
import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { GlobalContext } from "../common/GlobalContext";
import { useMemo } from "react";
import { useImperativeHandle } from "react";
import { useLocation } from "react-router";
import { useCallback } from "react";

interface Props {
  fullscreen: boolean;
  onSave: (content: string) => void;
}

export type EditorRef = {
  requestSave(): void;
} | null;

const RefForwardingEditor: React.RefForwardingComponent<EditorRef, Props> = (props, forwardedRef) => {
  const iframeRef: RefObject<HTMLIFrameElement> = useRef(null);

  const context = useContext(GlobalContext);
  const location = useLocation();
  const editorType = useMemo(() => context.routes.editor.args(location.pathname).type, [location]);

  const envelopeBusOuterMessageHandler = useMemo(
    () => {
      return context.envelopeBusOuterMessageHandlerFactory.createNew(iframeRef, self => ({
        pollInit() {
          self.request_initResponse(window.location.origin);
        },
        receive_languageRequest() {
          self.respond_languageRequest(context.router.getLanguageData(editorType)!);
        },
        receive_contentResponse(content: string) {
          props.onSave(content);
        },
        receive_contentRequest() {
          context.file.getFileContents().then(c => self.respond_contentRequest(c || ""));
        },
        receive_setContentError() {
          console.info("Set content error");
        },
        receive_dirtyIndicatorChange(isDirty: boolean) {
          console.info(`Dirty indicator changed to ${isDirty}`);
        },
        receive_ready() {
          console.info(`Editor is ready`);
        }
      }));
    },
    [editorType]
  );

  useEffect(() => {
    const listener = (msg: MessageEvent) => envelopeBusOuterMessageHandler.receive(msg.data);
    window.addEventListener("message", listener, false);
    envelopeBusOuterMessageHandler.startInitPolling();

    return () => {
      envelopeBusOuterMessageHandler.stopInitPolling();
      window.removeEventListener("message", listener);
      iframeRef.current!.contentWindow!.onunload = () => {};
      iframeRef.current!.contentWindow!.onbeforeunload = () => {};
      iframeRef.current!.contentDocument!.location.reload();
    };
  }, [envelopeBusOuterMessageHandler]);

  useImperativeHandle(
    forwardedRef,
    () => ({ requestSave: () => envelopeBusOuterMessageHandler.request_contentResponse() }),
    [envelopeBusOuterMessageHandler]
  );

  return (
    <iframe
      ref={iframeRef}
      id={"kogito-iframe"}
      className="kogito--editor"
      src={context.router.getRelativePathTo(context.iframeTemplateRelativePath)}
    />
  );
};

export const Editor = React.forwardRef(RefForwardingEditor);
