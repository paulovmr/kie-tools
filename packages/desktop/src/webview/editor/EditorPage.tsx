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
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { Editor, EditorRef } from "./Editor";
import { GlobalContext } from "../common/GlobalContext";
import { Page, PageSection, Stack, StackItem } from "@patternfly/react-core";
import "@patternfly/patternfly/patternfly.css";
import { Alert, AlertActionCloseButton } from "@patternfly/react-core";
import { useMemo } from "react";
import * as electron from "electron";

interface Props {
  editorType: string;
}

enum ActionType {
  NONE,
  SAVE,
  DOWNLOAD,
  COPY
}

const ALERT_AUTO_CLOSE_TIMEOUT = 3000;

// FIXME: This action should be moved inside the React hooks lifecycle.
let action = ActionType.NONE;
let saveData: any;

export function EditorPage(props: Props) {
  const context = useContext(GlobalContext);
  const editorRef = useRef<EditorRef>(null);
  const copyContentTextArea = useRef<HTMLTextAreaElement>(null);
  const [copySuccessAlertVisible, setCopySuccessAlertVisible] = useState(false);

  const ipc = useMemo(() => electron.ipcRenderer, [electron.ipcRenderer]);

  const requestSave = useCallback(() => {
    action = ActionType.SAVE;
    editorRef.current?.requestContent();
  }, []);

  const requestCopyContentToClipboard = useCallback(() => {
    action = ActionType.COPY;
    editorRef.current?.requestContent();
  }, []);

  const closeCopySuccessAlert = useCallback(() => setCopySuccessAlertVisible(false), []);

  const onContentResponse = useCallback((content: string) => {
    if (action === ActionType.SAVE) {
      saveData.file = { filePath: context.file!.filePath, fileType: context.file!.fileType, fileContent: content };
      ipc.send("returnOpenedFile", saveData);
    } else if (action === ActionType.COPY && copyContentTextArea.current) {
      copyContentTextArea.current.value = content;
      copyContentTextArea.current.select();
      if (document.execCommand("copy")) {
        setCopySuccessAlertVisible(true);
      }
    }
  }, []);

  useEffect(() => {
    if (closeCopySuccessAlert) {
      const autoCloseCopySuccessAlert = setTimeout(closeCopySuccessAlert, ALERT_AUTO_CLOSE_TIMEOUT);
      return () => clearInterval(autoCloseCopySuccessAlert);
    }

    return () => {
      /* Do nothing */
    };
  }, [copySuccessAlertVisible]);

  useEffect(() => {
    ipc.on("requestOpenedFile", (event: any, data: any) => {
      saveData = data;
      requestSave();
    });

    return () => {
      ipc.removeAllListeners("requestOpenedFile");
    };
  }, [ipc]);

  return (
    <Page className={"kogito--editor-page"}>
      <PageSection variant="light" noPadding={true} style={{ flexBasis: "100%" }}>
        {copySuccessAlertVisible && (
          <div className={"kogito--alert-container"}>
            <Alert
              variant="success"
              title="Content copied to clipboard"
              action={<AlertActionCloseButton onClose={closeCopySuccessAlert} />}
            />
          </div>
        )}
        <Stack>
          <StackItem>
            <EditorToolbar onCopyContentToClipboard={requestCopyContentToClipboard} />
          </StackItem>

          <StackItem className="pf-m-fill">
            <Editor ref={editorRef} editorType={props.editorType} onContentResponse={onContentResponse} />
          </StackItem>
        </Stack>
        <textarea ref={copyContentTextArea} style={{ opacity: 0, width: 0, height: 0 }} />
      </PageSection>
    </Page>
  );
}
