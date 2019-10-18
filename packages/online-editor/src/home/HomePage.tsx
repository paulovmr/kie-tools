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
import { useContext } from "react";
import { GlobalContext } from "../common/GlobalContext";

export function HomePage() {
  const globalContext = useContext(GlobalContext);

  let uploadBoxOnDragOver = (e: any) => {
    const uploadBox = document.getElementById("upload-box")!;
    uploadBox.className = 'hover';
    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  let uploadBoxOnDragEnd = (e: any) => {
    const uploadBox = document.getElementById("upload-box")!;
    uploadBox.className = '';
    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  let uploadBoxOnDrop = (e: any) => {
    const uploadBox = document.getElementById("upload-box")!;
    uploadBox.className = '';
    e.stopPropagation();
    e.preventDefault();

    var file = e.dataTransfer.files[0],
    reader = new FileReader();
    reader.onload = function(event: any) {
      console.log(event.target);
      uploadBox.innerText = event.target.result;
    };
    console.log(file);
    reader.readAsText(file);

    return false;
  };

  return (
    <div className="fullscreen centered">
      <img src={globalContext.router.getRelativePathTo("images/kogito_logo.png")} />
      <div 
        id="upload-box" 
        onDragOver={uploadBoxOnDragOver} 
        onDragLeave={uploadBoxOnDragEnd} 
        onDrop={uploadBoxOnDrop} 
      ></div> 
    </div>
  );
}
