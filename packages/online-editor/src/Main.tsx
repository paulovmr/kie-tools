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
import { Router, Switch, Route } from "react-router";
import { History } from "history";
import { routes } from "./common/Routes";
import { HomePage } from "./home/HomePage";
import { Editor } from "./editor/Editor";
import { GlobalStateType } from "./common/GlobalState";
import { NoMatchPage } from "./NoMatchPage";

interface Props {
  history: History;
}

export class Main extends React.Component<Props, GlobalStateType> {
  private getFileContents: () => Promise<string | undefined>;
  private fileName: string;
  private fileExtension: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      openedFile: null
    };
  }

  private extractEditorType(fileName: string) {
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

  private onFileUpload(file: any) {
    this.fileName = file.name;
    this.fileExtension = this.extractEditorType(file.name)!;
    this.props.history.replace(routes.editor({ type: this.fileExtension }));

    if (file != null) {
      this.getFileContents = () => new Promise<string | undefined>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          resolve(event.target.result as string);
        };
        reader.readAsText(file);
      });
    } else {
      this.getFileContents = () => Promise.resolve("");
    }
    this.setState({ openedFile: file });
  }

  private onFileCreation(type: string) {
    this.fileName = "new-file." + type;
    this.fileExtension = type;
    this.props.history.replace(routes.editor({ type: this.fileExtension }));
    this.getFileContents = () => Promise.resolve("");
    this.setState({ openedFile: this.fileName });
  }

  private onClose() {
    this.props.history.replace(routes.home());
  }

  public render() {
    return (
      <Router history={this.props.history}>
        <Switch>
          <Route path="/editor">
            <Editor getFileContents={this.getFileContents} fileName={this.fileName} fileExtension={this.fileExtension} onClose={() => this.onClose()} />
          </Route>
          <Route exact={true} path="/">
            <HomePage onFileUpload={(file) => this.onFileUpload(file)}
                      onFileCreation={(type) => this.onFileCreation(type)} />
          </Route>
          <Route component={NoMatchPage} />
        </Switch>
      </Router>
    )
  };
}
