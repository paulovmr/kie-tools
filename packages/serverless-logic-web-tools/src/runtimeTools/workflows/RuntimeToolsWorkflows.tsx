/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { ReactText, useCallback, useState } from "react";
import { Page, PageSection } from "@patternfly/react-core/dist/js/components/Page";
import { Text, TextContent, TextVariants } from "@patternfly/react-core/dist/js/components/Text";
import { Tab, Tabs, TabTitleText } from "@patternfly/react-core/dist/js/components/Tabs";
import { Card } from "@patternfly/react-core/dist/js/components/Card";
import WorkflowListContainer from "./WorkflowListContainer/WorkflowListContainer";
import { useHistory } from "react-router";
import { WorkflowListState } from "./WorkflowList/WorkflowListGatewayApi";

const PAGE_TITLE = "Workflows";

export function RuntimeToolsWorkflows() {
  const history = useHistory();

  const [activeTabKey, setActiveTabKey] = useState<ReactText>(0);

  const handleTabClick = useCallback(
    (event, tabIndex) => {
      setActiveTabKey(tabIndex);
    },
    [setActiveTabKey]
  );

  const initialState: WorkflowListState = history.location && (history.location.state as WorkflowListState);

  return (
    <>
      <Page>
        <PageSection variant={"light"}>
          <TextContent>
            <Text component={TextVariants.h1}>{PAGE_TITLE}</Text>
            <Text component={TextVariants.p}>
              List, view and start workflows from the Data Index and Kogito Service linked in your Runtime Tools
              settings.
            </Text>
          </TextContent>
        </PageSection>

        <PageSection isFilled aria-label="workflows-section">
          <Tabs
            activeKey={activeTabKey}
            onSelect={handleTabClick}
            isBox
            variant="light300"
            style={{
              background: "white",
            }}
          >
            <Tab id="workflow-list-tab" eventKey={0} title={<TabTitleText>Workflow Instances</TabTitleText>}>
              <PageSection>
                <Card style={{ height: "100%" }}>
                  <WorkflowListContainer initialState={initialState} />
                </Card>
              </PageSection>
            </Tab>
            <Tab id="process-definitions-tab" eventKey={1} title={<TabTitleText>Workflow Definitions</TabTitleText>}>
              <PageSection>
                <Card style={{ height: "100%" }}>WorkflowDefinitionListContainer</Card>
              </PageSection>
            </Tab>
          </Tabs>
        </PageSection>
      </Page>
    </>
  );
}
