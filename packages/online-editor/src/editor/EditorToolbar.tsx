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
import { useContext } from "react";
import { GlobalContext } from "../common/GlobalContext";
import { Button, Toolbar, ToolbarGroup, ToolbarItem, PageSection, Title, TextInput } from "@patternfly/react-core";
import { EditAltIcon, CheckIcon, CloseIcon } from "@patternfly/react-icons";
import { useState } from "react";
import { useMemo } from "react";
import { useCallback } from "react";
import { useLocation } from "react-router";

interface Props {
  onFileNameChanged: (fileName: string) => void;
  onFullScreen: () => void;
  onSave: () => void;
  onClose: () => void;
}

export function EditorToolbar(props: Props) {
  const context = useContext(GlobalContext);
  const location = useLocation();
  const editorType = useMemo(() => context.routes.editor.args(location.pathname).type, [location]);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(context.file.fileName);

  const updateTempName = useCallback(
    newName => {
      setName(newName);
    },
    [name]
  );

  const saveNewName = useCallback(
    () => {
      props.onFileNameChanged(name);
      setEditingName(false);
    },
    [name, editingName]
  );

  const cancelNewName = useCallback(
    () => {
      setEditingName(false);
      setName(context.file.fileName);
    },
    [name, editingName]
  );

  const editName = useCallback(
    () => {
      setEditingName(true);
    },
    [name, editingName]
  );

  const onNameInputKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      // Enter
      saveNewName();
    } else if (e.keyCode === 27) {
      // ESC
      cancelNewName();
    }
  }, [name, editingName]);

  return (
    <PageSection type="nav" className="kogito--editor__toolbar-section">
      <Toolbar>
        {!editingName && (
          <ToolbarGroup>
            <ToolbarItem>
              <Title headingLevel="h3" size="xl" onDoubleClick={editName}>
                {context.file.fileName + "." + editorType}
              </Title>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="link" icon={<EditAltIcon />} onClick={editName} />
            </ToolbarItem>
          </ToolbarGroup>
        )}
        {editingName && (
          <ToolbarGroup>
            <ToolbarItem>
              <div className="kogito--editor__toolbar-name-container">
                <Title headingLevel="h3" size="xl" onDoubleClick={editName}>
                  {name + "." + editorType}
                </Title>
                <TextInput
                  autoFocus
                  value={name}
                  type="text"
                  aria-label="fileName"
                  className="pf-c-title pf-m-xl"
                  onChange={updateTempName}
                  onKeyUp={onNameInputKeyUp}
                />
              </div>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="link" icon={<CheckIcon />} onClick={saveNewName} />
              <Button variant="link" icon={<CloseIcon />} onClick={cancelNewName} />
            </ToolbarItem>
          </ToolbarGroup>
        )}
        <ToolbarGroup className="kogito--right">
          <ToolbarItem>
            <Button variant="link" onClick={props.onFullScreen}>
              Full Screen
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem className="pf-u-mr-sm">
            <Button variant="primary" onClick={props.onSave}>
              Save
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="secondary" onClick={props.onClose}>
              Close
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    </PageSection>
  );
}
