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
import { useHistory } from "react-router-dom";
import { EditorToolbar } from "./EditorToolbar";
import { FullScreenToolbar } from "./EditorFullScreenToolbar";
import { Editor, EditorRef } from "./Editor";
import { useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../common/GlobalContext";
import { useRef } from "react";
import { useCallback } from "react";
import { Page, Stack, StackItem, PageSection } from '@patternfly/react-core';
import "@patternfly/patternfly/patternfly.css";

export function EditorPage() {
  const context = useContext(GlobalContext);
  const history = useHistory();
  const editorRef = useRef<EditorRef>(null);

  const [fullscreen, setFullscreen] = useState(false);

  const close = useCallback(() => history.replace(context.routes.home.url({})), []);
  const save = useCallback(() => editorRef.current!.requestSave(), []);

  const enterFullscreen = useCallback(() => {
    const page = document.documentElement;
    if (page.requestFullscreen) {
      page.requestFullscreen();
    }

    setFullscreen(true);
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }

    setFullscreen(false);
  }, []);

  return (
    <Page>
      <PageSection variant="light" noPadding>
        <Stack>
          <StackItem>
            {!fullscreen && <EditorToolbar onFullScreen={enterFullscreen} onSave={save} onClose={close} />}

            {fullscreen && <FullScreenToolbar onExitFullScreen={exitFullscreen} />}
          </StackItem>

          <StackItem className="pf-m-fill">
            <Editor ref={editorRef} fullscreen={fullscreen} />
          </StackItem>
        </Stack>
      </PageSection>
    </Page>
  );
}
