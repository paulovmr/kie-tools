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
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import { GlobalContext } from "../common/GlobalContext";
import {
  Title,
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Bullseye,
  Stack,
  StackItem,
  Page,
  PageSection,
  Grid,
  GridItem,
  Select,
  SelectOption,
  SelectVariant,
  Toolbar,
  ToolbarItem,
  SelectDirection
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import "@patternfly/patternfly/patternfly-variables.css";
import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/patternfly/patternfly-no-reset.css";

export function HomePage() {
  const context = useContext(GlobalContext);
  const history = useHistory();

  const uploadInputRef: RefObject<HTMLInputElement> = useRef(null);
  const uploadBoxRef: RefObject<HTMLDivElement> = useRef(null);

  const uploadBoxOnDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      uploadBoxRef.current!.className = "hover";
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    []
  );

  const uploadBoxOnDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      uploadBoxRef.current!.className = "";
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    []
  );

  const uploadBoxOnDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      uploadBoxRef.current!.className = "";
      e.stopPropagation();
      e.preventDefault();

      const file = e.dataTransfer.files[0];
      onFileUpload(file);

      return false;
    },
    []
  );

  const editFile = useCallback(
    () => {
      if (uploadInputRef.current!.files) {
        const file = uploadInputRef.current!.files![0];
        onFileUpload(file);
      }
    },
    []
  );

  const onFileUpload = useCallback(
    (file: File) => {
      const fileName = file.name;
      const getFileContents = () =>
        new Promise<string | undefined>(resolve => {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            resolve(event.target.result as string);
          };
          reader.readAsText(file);
        });

      context.file = {
        fileName: fileName,
        getFileContents: getFileContents
      };
      history.replace(context.routes.editor.url({ type: extractFileExtension(fileName)! }));
    },
    [context, history]
  );

  const options = useMemo(() => [{ value: "BPMN" }, { value: "DMN" }], []);

  const [fileTypeSelect, setFileTypeSelect] = useState({
    isExpanded: false,
    value: "BPMN"
  });

  const onSelectFileType = useCallback(
    selection => {
      setFileTypeSelect({
        isExpanded: false,
        value: selection
      });
    },
    []
  );

  const onToggleFileType = useCallback(
    isExpanded => {
      setFileTypeSelect({
        isExpanded: isExpanded,
        value: fileTypeSelect.value
      });
    },
    []
  );

  const createFile = useCallback(
    () => {
      if (fileTypeSelect && fileTypeSelect.value) {
        history.replace(context.routes.editor.url({ type: fileTypeSelect.value!.toLowerCase() }));
      }
    },
    [context, history, fileTypeSelect]
  );

  return (
    <Page>
      <PageSection variant="light">
        <Bullseye>
          <Grid gutter="lg">
            <GridItem className="pf-u-text-align-center" span={12}>
              <img src={context.router.getRelativePathTo("images/kogito_logo.png")} alt="Kogito Logo" />
            </GridItem>
            <GridItem span={6}>
              {/* Create side */}
              <Stack gutter="lg">
                <StackItem>
                  <Title headingLevel="h2" size="3xl">
                    Create
                  </Title>
                </StackItem>
                <StackItem>
                  <Toolbar>
                    <ToolbarItem>
                      <Select
                        onSelect={onSelectFileType}
                        onToggle={onToggleFileType}
                        isExpanded={fileTypeSelect.isExpanded}
                      >
                        {options.map((option, index) => (
                          <SelectOption key={index} value={option.value} />
                        ))}
                      </Select>
                    </ToolbarItem>
                    <ToolbarItem>
                      <Button className="pf-u-ml-md" variant="secondary" onClick={createFile}>
                        Create
                      </Button>
                    </ToolbarItem>
                  </Toolbar>
                </StackItem>
              </Stack>
            </GridItem>
            <GridItem span={6}>
              {/* Edit side */}
              <Stack gutter="lg">
                <StackItem>
                  <Title headingLevel="h2" size="3xl">
                    Edit
                  </Title>
                </StackItem>
                <StackItem className="kogito--upload-box">
                  {/* Upload Drag Target */}
                  <div
                    ref={uploadBoxRef}                    
                    onDragOver={uploadBoxOnDragOver}
                    onDragLeave={uploadBoxOnDragLeave}
                    onDrop={uploadBoxOnDrop}
                  >
                    <Bullseye>Drag &amp; drop BPMN or DMN file here</Bullseye>
                  </div>
                </StackItem>
                <StackItem className="kogito--upload-btn-container">
                  or
                  <div className="kogito--upload-btn">
                    <Button className="pf-u-ml-md" variant="secondary" onClick={editFile}>
                      Choose a local file
                    </Button>
                    <input className="pf-c-button" type="file" ref={uploadInputRef} onChange={editFile} />
                  </div>
                </StackItem>
              </Stack>
            </GridItem>
          </Grid>
        </Bullseye>
      </PageSection>
    </Page>
  );
}

function extractFileExtension(fileName: string) {
  const fileExtension = fileName.split(".").pop();
  if (!fileExtension) {
    return undefined;
  }

  const openFileExtensionRegex = fileExtension.match(/[\w\d]+/);
  if (!openFileExtensionRegex) {
    return undefined;
  }

  const openFileExtension = openFileExtensionRegex.pop();
  if (!openFileExtension) {
    return undefined;
  }

  return openFileExtension;
}
