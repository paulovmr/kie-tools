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

import React from "react";
import { componentOuiaProps, OUIAProps } from "@kie-tools/runtime-tools-common/dist/ouiaTools";
import { WorkflowDefinition } from "@kie-tools/runtime-tools-common";
import { WorkflowFormGatewayApi, useWorkflowFormGatewayApi } from "../WorkflowForm";
import { EmbeddedWorkflowForm } from "@kie-tools/runtime-tools-components/dist/workflowForm";

interface WorkflowFormContainerProps {
  workflowDefinitionData: WorkflowDefinition;
  onSubmitSuccess: (id: string) => void;
  onSubmitError: (details?: string) => void;
  onResetForm: () => void;
}
const WorkflowFormContainer: React.FC<WorkflowFormContainerProps & OUIAProps> = ({
  workflowDefinitionData,
  onSubmitSuccess,
  onSubmitError,
  onResetForm,
  ouiaId,
  ouiaSafe,
}) => {
  const gatewayApi: WorkflowFormGatewayApi = useWorkflowFormGatewayApi();

  return (
    <EmbeddedWorkflowForm
      {...componentOuiaProps(ouiaId, "workflow-form-container", ouiaSafe)}
      driver={{
        async getCustomWorkflowSchema(): Promise<Record<string, any>> {
          return gatewayApi.getCustomWorkflowSchema(workflowDefinitionData.workflowName);
        },
        async resetBusinessKey() {
          onResetForm();
        },
        async startWorkflow(endpoint: string, data: Record<string, any>): Promise<void> {
          return gatewayApi
            .startWorkflow(endpoint, data)
            .then((id: string) => {
              onSubmitSuccess(`A workflow with id ${id} was triggered successfully.`);
            })
            .catch((error: any) => {
              const message =
                error?.response?.data?.message + " " + error?.response?.data?.cause ||
                error?.message ||
                "Unknown error. More details in the developer tools console.";
              onSubmitError(message);
            });
        },
      }}
      targetOrigin={window.location.origin}
      workflowDefinition={{
        workflowName: workflowDefinitionData.workflowName,
        endpoint: workflowDefinitionData.endpoint,
      }}
    />
  );
};

export default WorkflowFormContainer;
