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
import * as ReactDOM from "react-dom";
import { History } from "history";
import { useContext } from "react";
import { GlobalContext, GlobalContextType } from "../common/GlobalContext";
import { Editor } from "../editor/Editor";
import { routes } from "../common/Routes";
import { GlobalStateType } from "../common/GlobalState";
import { match } from "react-router";

interface Props {
  context: GlobalContextType;
  onFileUpload: (file: any) => void;
}

export class HomePageComponent extends React.Component<Props, GlobalStateType> {
  static globalContext = GlobalContext;

  constructor(props: Props) {
    super(props);
  }

  private uploadBoxOnDragOver = (e: any) => {
    const uploadBox = document.getElementById("upload-box")!;
    uploadBox.className = 'hover';
    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  private uploadBoxOnDragEnd = (e: any) => {
    const uploadBox = document.getElementById("upload-box")!;
    uploadBox.className = '';
    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  private uploadBoxOnDrop = (e: any) => {
    const uploadBox = document.getElementById("upload-box")!;
    uploadBox.className = '';
    e.stopPropagation();
    e.preventDefault();

    var file = e.dataTransfer.files[0];
    this.props.onFileUpload(file);

    return false;
  };

  render() {
    return (
      <div className="fullscreen centered">
        <img src={this.props.context.router.getRelativePathTo("images/kogito_logo.png")} />
        <div 
          id="upload-box" 
          onDragOver={this.uploadBoxOnDragOver} 
          onDragLeave={this.uploadBoxOnDragEnd} 
          onDrop={this.uploadBoxOnDrop} 
        ></div> 
      </div>
    )
  };
}

export function HomePage(props: { onFileUpload: (file: any) => void }) {
  let globalContext = useContext(GlobalContext);

  return <HomePageComponent context={globalContext} onFileUpload={props.onFileUpload} />
};
