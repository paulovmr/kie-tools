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
import { GlobalContext } from "../common/GlobalContext";
import { GlobalStateType } from "../common/GlobalState";

interface Props {
  onFileUpload: (file: File) => void;
  onFileCreation: (type: string) => void;
}

export class HomePage extends React.Component<Props, GlobalStateType> {
  public static contextType = GlobalContext;

  private typeSelect: RefObject<HTMLSelectElement>;
  private uploadInput: RefObject<HTMLInputElement>;
  private uploadBox: RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.typeSelect = React.createRef();
    this.uploadInput = React.createRef();
    this.uploadBox = React.createRef();
  }

  private uploadBoxOnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    this.uploadBox.current!.className = 'hover';
    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  private uploadBoxOnDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    this.uploadBox.current!.className = '';
    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  private uploadBoxOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    this.uploadBox.current!.className = '';
    e.stopPropagation();
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    this.props.onFileUpload(file);

    return false;
  };

  private createFile() {
    this.props.onFileCreation(this.typeSelect.current!.value);
  }

  private editFile() {
    if (this.uploadInput.current!.files) {
      const file = this.uploadInput.current!.files![0];
      this.props.onFileUpload(file);
    }
  }

  public render() {
    return (
      <div className="fullscreen centered home">
        <img src={this.context.router.getRelativePathTo("images/kogito_logo.png")} />
        <div className="file-actions">
          <button className="btn" onClick={() => this.createFile()}>Create</button>
          <span>or</span> 
          <div className="upload-btn-wrapper">
            <button className="btn">Edit</button>
            <input type="file" ref={this.uploadInput} onChange={() => this.editFile()} />
          </div>
          <span>a</span>
          <select className="btn" ref={this.typeSelect}>
            <option value="bpmn">BPMN</option>
            <option value="dmn">DMN</option>
          </select>
          <span>diagram. Or...</span>
        </div>
        <div 
          ref={this.uploadBox}
          id="upload-box" 
          className="file-actions"
          onDragOver={this.uploadBoxOnDragOver} 
          onDragLeave={this.uploadBoxOnDragEnd} 
          onDrop={this.uploadBoxOnDrop} 
        >
          ...drop a file here to edit it.
        </div> 
      </div>
    )
  };
}
