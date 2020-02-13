/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import { Bullseye, Card, CardBody, CardFooter, Grid, GridItem, Page, PageSection, Title } from "@patternfly/react-core";
import { useCallback, useEffect, useState } from "react";
import { useMemo } from "react";
import * as electron from "electron";
import { extractFileExtension, removeDirectories } from "../../common/utils";
import IpcRendererEvent = Electron.IpcRendererEvent;

export function HomePage() {
  const [lastOpenedFiles, setLastOpenedFiles] = useState<string[]>([]);

  const ipc = useMemo(() => electron.ipcRenderer, [electron.ipcRenderer]);

  const openFile = useCallback((filePath: string) => {
    ipc.send("openFile", { filePath: filePath });
  }, []);

  useEffect(() => {
    ipc.on("returnLastOpenedFiles", (event: IpcRendererEvent, data: { lastOpenedFiles: string[] }) => {
      setLastOpenedFiles(data.lastOpenedFiles);
    });

    ipc.send("requestLastOpenedFiles");

    return () => {
      ipc.removeAllListeners("returnLastOpenedFiles");
    };
  }, [ipc, lastOpenedFiles]);

  return (
    <Page>
      <PageSection variant="light">
        {lastOpenedFiles.length === 0 && (
          <Bullseye>
            <img src={"images/kogito_logo.png"} alt="Kogito Logo" />
          </Bullseye>
        )}

        {lastOpenedFiles.length > 0 && (
          <Grid gutter="lg" className="pf-m-all-12-col pf-m-all-6-col-on-md">
            {lastOpenedFiles.map(filePath => (
              <GridItem className="pf-m-3-col" key={filePath}>
                <Card className={"kogito--card"} onClick={() => openFile(filePath)}>
                  <CardBody>
                    <img title={filePath} src={"images/" + extractFileExtension(filePath) + "_thumbnail.png"} />
                  </CardBody>
                  <CardFooter>
                    <Title headingLevel="h3" size="md">
                      {removeDirectories(filePath)}
                    </Title>
                  </CardFooter>
                </Card>
              </GridItem>
            ))}
          </Grid>
        )}
      </PageSection>
    </Page>
  );
}
