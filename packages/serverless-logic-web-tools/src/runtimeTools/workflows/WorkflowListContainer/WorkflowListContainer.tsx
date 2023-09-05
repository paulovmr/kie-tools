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

import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { componentOuiaProps, OUIAProps } from "@kie-tools/runtime-tools-common/dist/ouiaTools";
import { EmbeddedWorkflowList } from "@kie-tools/runtime-tools-components/dist/workflowList/embedded";
import { WorkflowListGatewayApi, useWorkflowListGatewayApi } from "../WorkflowList";
import { WorkflowInstance, WorkflowListState } from "@kie-tools/runtime-tools-common";
import { CloudEventPageSource } from "../CloudEventForm/CloudEventForm";

interface WorkflowListContainerProps {
  initialState: WorkflowListState;
}

const WorkflowListContainer: React.FC<WorkflowListContainerProps & OUIAProps> = ({
  initialState,
  ouiaId,
  ouiaSafe,
}) => {
  const history = useHistory();
  const gatewayApi: WorkflowListGatewayApi = useWorkflowListGatewayApi();

  useEffect(() => {
    const onOpenInstanceUnsubscriber = gatewayApi.onOpenWorkflowListen({
      onOpen(workflow: WorkflowInstance) {
        history.push({
          pathname: `/Workflow/${workflow.id}`,
          state: gatewayApi.workflowListState,
        });
      },
    });
    const onTriggerCloudEventUnsubscriber = gatewayApi.onOpenTriggerCloudEventListen({
      onOpen(workflowInstance?: WorkflowInstance) {
        history.push({
          pathname: `/Workflowes/CloudEvent/${workflowInstance?.id ?? ""}`,
          state: {
            source: CloudEventPageSource.INSTANCES,
          },
        });
      },
    });
    return () => {
      onOpenInstanceUnsubscriber.unSubscribe();
      onTriggerCloudEventUnsubscriber?.unSubscribe();
    };
  }, []);

  return (
    <EmbeddedWorkflowList
      {...componentOuiaProps(ouiaId, "workflow-list-container", ouiaSafe)}
      driver={gatewayApi}
      targetOrigin={"kogitoServiceUrl"} // TODO kogitoServiceUrl
      initialState={initialState}
    />
  );
};

export default WorkflowListContainer;
