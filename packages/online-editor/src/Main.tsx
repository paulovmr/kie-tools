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
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { History } from "history";
import { routes } from "./common/Routes";
import { Page } from "@patternfly/react-core";
import { HomePage } from "./home/HomePage";
import { Editor } from "./editor/Editor";
import { NoMatchPage } from "./NoMatchPage";
import { useState, useContext } from "react";
import { GlobalContextType } from "./common/GlobalContext";
import { GlobalStateType } from "./common/GlobalState";

interface Props {
  history: History;
}

export class Main extends React.Component<Props, GlobalStateType> {
  private fileContent: string;
  private fileExtension: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      openedFile: null
    };
  }

  onFileChanged(file: any) {
    this.fileExtension = extractEditorType(file.name)!;
    this.props.history.push(routes.editor({ type: this.fileExtension }));

    if (file != null) {
      const setFileContent = (fileContent: string) => {
        this.fileContent = fileContent;
        this.setState({ openedFile: file });
      }

      let reader = new FileReader();
      reader.onload = function(event: any) {
        console.log(event.target.result);
        setFileContent(event.target.result);
      };
      reader.readAsText(file);
    } else {
      this.fileContent = "";
      this.setState({ openedFile: file });
    }
  }

  render() {
    return (
      <>
        {this.state.openedFile == null && (
          <HomePage onFileUpload={(file) => this.onFileChanged(file)} />
        )}

        {this.state.openedFile != null && (
          <Editor content={this.fileContent}/>
        )}
      </>
    )
  };
}

export function extractEditorType(fileName: string) {
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
