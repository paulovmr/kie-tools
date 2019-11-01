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
import { useMemo } from "react";
import { Router, Switch, Route } from "react-router";
import { Routes } from "./common/Routes";
import { HomePage } from "./home/HomePage";
import { EditorPage } from "./editor/EditorPage";
import { NoMatchPage } from "./NoMatchPage";
import { OnlineEditorRouter } from "./common/OnlineEditorRouter";
import { GwtEditorRoutes } from "@kogito-tooling/gwt-editors";
import { GlobalContext } from "./common/GlobalContext";
import { createBrowserHistory } from "history";
import { EnvelopeBusOuterMessageHandlerFactory } from "./editor/EnvelopeBusOuterMessageHandlerFactory";

interface Props {
  iframeTemplateRelativePath: string;
}

export function App(props: Props) {
  const routes = useMemo(() => new Routes(), []);
  const history = useMemo(() => createBrowserHistory(), []);
  const envelopeBusOuterMessageHandlerFactory = useMemo(() => new EnvelopeBusOuterMessageHandlerFactory(), []);
  const onlineEditorRouter = useMemo(
    () =>
      new OnlineEditorRouter(
        new GwtEditorRoutes({
          bpmnPath: "gwt-editors/bpmn",
          dmnPath: "gwt-editors/dmn"
        })
      ),
    []
  );

  return (
    <GlobalContext.Provider
      value={{
        router: onlineEditorRouter,
        routes: routes,
        envelopeBusOuterMessageHandlerFactory: envelopeBusOuterMessageHandlerFactory,
        iframeTemplateRelativePath: props.iframeTemplateRelativePath,
        file: undefined
      }}
    >
      <Router history={history}>
        <Switch>
          <Route path={routes.editor.url({ type: ":type" })}>
            <EditorPage />
          </Route>
          <Route exact={true} path={routes.home.url({})}>
            <HomePage />
          </Route>
          <Route component={NoMatchPage} />
        </Switch>
      </Router>
    </GlobalContext.Provider>
  );
}
