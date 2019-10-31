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
  ToolbarItem
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import "@patternfly/patternfly/patternfly-variables.css";
import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/patternfly/patternfly-no-reset.css";
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
    const options = [
      {value: "BPMN file"},
      {value: "DMN file"}
    ]

    return (
      <Page>
        <PageSection variant="light">

      <Bullseye>
      <Grid gutter="lg">
        <GridItem className="pf-u-text-align-center" span={12}>
        <img src={this.context.router.getRelativePathTo("images/kogito_logo.png")} alt="Kogito Logo"/>
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
                    aria-label="Select file type"
                    onToggle={(isExpanded) => {}}
                  >
                    {options.map((option, index) => (
                      <SelectOption
                        key={index}
                        value={option.value}
                      />
                    ))}
                  </Select>
                </ToolbarItem>
                <ToolbarItem>
              <Button className="pf-u-ml-md" variant="secondary"  onClick={() => this.createFile()}>Create</Button>                 
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
          <StackItem>
            {/* Upload Drag Target */}
            <div 
              ref={this.uploadBox}
              id="upload-box" 
              className="file-actions kogito--upload-box"
              onDragOver={this.uploadBoxOnDragOver} 
              onDragLeave={this.uploadBoxOnDragEnd} 
              onDrop={this.uploadBoxOnDrop} 
            >
              <Bullseye>
                Drag & drop BPMN or DMN file here
              </Bullseye>
            </div>               
          </StackItem>
          <StackItem>
            or 
            <Button  className="pf-u-ml-md" variant="secondary"  onClick={() => this.editFile()}>Choose a local file</Button>                 

            {/* <input className="pf-c-button" type="file" ref={this.uploadInput} onChange={() => this.editFile()} /> */}
          </StackItem>
        </Stack>


      </GridItem>

      </Grid>
      
      </Bullseye>

{/* TO BE REMOVED!!!  */}
      <div className="file-actions" >
        <select className="btn" ref={this.typeSelect}>
                <option value="bpmn">BPMN</option>
                <option value="dmn">DMN</option>
        </select>

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

      {/* // <div className="fullscreen centered home">
      // <img src={this.context.router.getRelativePathTo("images/kogito_logo.png")} />
      // <div className="file-actions">
      //   <button className="btn" onClick={() => this.createFile()}>Create</button>
      //   <span>or</span> 
      //   <div className="upload-btn-wrapper">
      //     <button className="btn">Edit</button>
      //     <input type="file" ref={this.uploadInput} onChange={() => this.editFile()} />
      //   </div>
      //   <span>a</span>
        // <select className="btn" ref={this.typeSelect}>
        //   <option value="bpmn">BPMN</option>
        //   <option value="dmn">DMN</option>
        // </select>
      //   <span>diagram. Or...</span>
      // </div>
      // <div 
      //   ref={this.uploadBox}
      //   id="upload-box" 
      //   className="file-actions"
      //   onDragOver={this.uploadBoxOnDragOver} 
      //   onDragLeave={this.uploadBoxOnDragEnd} 
      //   onDrop={this.uploadBoxOnDrop} 
      // >
      //   ...drop a file here to edit it.
      // </div> 
      // </div> */}
          
          </PageSection>
        </Page>

      )
    };
  }
  