/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { buildEditor } from "./augmentation";

interface Props {
  content: string;
  onContentChange: (content: string) => void;
}

export interface MonacoEditorRef {
  undo(): Promise<void>;

  redo(): Promise<void>;
}

const RefForwardingMonacoEditor: React.ForwardRefRenderFunction<MonacoEditorRef | undefined, Props> = (
  { content = "{}", onContentChange },
  forwardedRef
) => {
  const [monacoInstance, setMonacoInstance] = useState<monaco.editor.IStandaloneCodeEditor>();
  const editorContainer = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    forwardedRef,
    () => {
      return {
        redo: () => {
          monacoInstance?.trigger("whatever...", "redo", null);
          return Promise.resolve();
        },
        undo: () => {
          monacoInstance?.trigger("whatever...", "undo", null);
          return Promise.resolve();
        },
      };
    },
    [monacoInstance]
  );

  useEffect(() => {
    if (!content || content === "") {
      return;
    }

    const instance = buildEditor(editorContainer.current!, content);

    instance.getModel()?.onDidChangeContent((event: monaco.editor.IModelContentChangedEvent) => {
      onContentChange(instance.getValue());
    });

    setMonacoInstance(instance);

    return () => {
      instance.dispose();
    };
  }, [content]);

  if (!content) {
    return <div />;
  }

  return <div style={{ height: "100%" }} ref={editorContainer} />;
};

export const MonacoEditor = React.forwardRef(RefForwardingMonacoEditor);
