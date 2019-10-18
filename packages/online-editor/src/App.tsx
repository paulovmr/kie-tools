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
import { GlobalContext } from "./common/GlobalContext";
import { OnlineEditorRouter } from "./OnlineEditorRouter";
import { GwtEditorRoutes } from "@kogito-tooling/gwt-editors";
import { Main } from "./Main";

export function App() {
  const onlineEditorRouter = new OnlineEditorRouter(new GwtEditorRoutes({ bpmnPath: "../unpacked-gwt-editors/bpmn" }));
  return (
    <GlobalContext.Provider value={{ router: onlineEditorRouter }}>
      <Main />
    </GlobalContext.Provider>
  );
}
