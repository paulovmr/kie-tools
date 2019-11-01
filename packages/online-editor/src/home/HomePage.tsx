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
import { RefObject } from "react";
import { useContext, useRef } from "react";
import { GlobalContext } from "../common/GlobalContext";
import { useHistory } from "react-router";
import { useCallback } from "react";

export function HomePage() {
  const context = useContext(GlobalContext);
  const history = useHistory();
  const typeSelectRef: RefObject<HTMLSelectElement> = useRef(null);
  const uploadInputRef: RefObject<HTMLInputElement> = useRef(null);
  const uploadBoxRef: RefObject<HTMLDivElement> = useRef(null);

  const uploadBoxOnDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      uploadBoxRef.current!.className = "hover";
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    [uploadBoxRef]
  );

  const uploadBoxOnDragEnd = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      uploadBoxRef.current!.className = "";
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    [uploadBoxRef]
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
    [uploadBoxRef]
  );

  const createFile = useCallback(
    () => {
      history.replace(context.routes.editor.url({ type: typeSelectRef.current!.value }));
    },
    [context, history, typeSelectRef]
  );

  const editFile = useCallback(
    () => {
      if (uploadInputRef.current!.files) {
        const file = uploadInputRef.current!.files![0];
        onFileUpload(file);
      }
    },
    [uploadInputRef]
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

  return (
    <div className="fullscreen centered home">
      <img src={context.router.getRelativePathTo("images/kogito_logo.png")} />
      <div className="file-actions">
        <button className="btn" onClick={createFile}>
          Create
        </button>
        <span>or</span>
        <div className="upload-btn-wrapper">
          <button className="btn">Edit</button>
          <input type="file" ref={uploadInputRef} onChange={editFile} />
        </div>
        <span>a</span>
        <select className="btn" ref={typeSelectRef}>
          <option value="bpmn">BPMN</option>
          <option value="dmn">DMN</option>
        </select>
        <span>diagram. Or...</span>
      </div>
      <div
        ref={uploadBoxRef}
        id="upload-box"
        className="file-actions"
        onDragOver={uploadBoxOnDragOver}
        onDragLeave={uploadBoxOnDragEnd}
        onDrop={uploadBoxOnDrop}
      >
        ...drop a file here to edit it.
      </div>
    </div>
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
