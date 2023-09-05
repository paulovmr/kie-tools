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

export enum JobStatus {
  Error = "ERROR",
  Executed = "EXECUTED",
  Scheduled = "SCHEDULED",
  Retry = "RETRY",
  Canceled = "CANCELED",
}

export interface Job {
  id: string;
  workflowId: string;
  workflowInstanceId: string;
  rootWorkflowInstanceId?: string;
  rootWorkflowId?: string;
  status: JobStatus;
  expirationTime: Date;
  priority: number;
  callbackEndpoint: string;
  repeatInterval: number;
  repeatLimit: number;
  scheduledId: string;
  retries: number;
  lastUpdate: Date;
  executionCounter?: number;
  endpoint?: string;
  nodeInstanceId?: string;
}

export interface BulkCancel {
  successJobs: Job[];
  failedJobs: Job[];
}

export interface BulkWorkflowInstanceActionResponse {
  successWorkflowInstances: WorkflowInstance[];
  failedWorkflowInstances: WorkflowInstance[];
}

export interface JobCancel {
  modalTitle: string;
  modalContent: string;
}

export enum WorkflowInstanceState {
  Active = "ACTIVE",
  Completed = "COMPLETED",
  Aborted = "ABORTED",
  Suspended = "SUSPENDED",
  Error = "ERROR",
}

export enum TitleType {
  SUCCESS = "success",
  FAILURE = "failure",
}

export enum MilestoneStatus {
  Available = "AVAILABLE",
  Active = "ACTIVE",
  Completed = "COMPLETED",
}

export interface NodeInstance {
  __typename?: "NodeInstance";
  id: string;
  name: string;
  type: string;
  enter: Date;
  exit?: Date;
  definitionId: string;
  nodeId: string;
}

export interface TriggerableNode {
  id: number;
  name: string;
  type: string;
  uniqueId: string;
  nodeDefinitionId: string;
}

export interface Milestone {
  __typename?: "Milestone";
  id: string;
  name: string;
  status: MilestoneStatus;
}

export interface WorkflowInstanceError {
  __typename?: "WorkflowInstanceError";
  nodeDefinitionId: string;
  message?: string;
}
export interface WorkflowInstance {
  id: string;
  workflowId: string;
  workflowName?: string;
  parentWorkflowInstanceId?: string;
  rootWorkflowInstanceId?: string;
  rootWorkflowId?: string;
  roles?: string[];
  state: WorkflowInstanceState;
  endpoint: string;
  serviceUrl?: string;
  nodes: NodeInstance[];
  milestones?: Milestone[];
  variables?: string;
  start: Date;
  end?: Date;
  parentWorkflowInstance?: WorkflowInstance;
  childWorkflowInstances?: WorkflowInstance[];
  error?: WorkflowInstanceError;
  addons?: string[];
  lastUpdate: Date;
  businessKey?: string;
  isSelected?: boolean;
  errorMessage?: string;
  isOpen?: boolean;
  diagram?: string;
  nodeDefinitions?: TriggerableNode[];
  source?: string;
}

export interface WorkflowInstanceFilter {
  status: WorkflowInstanceState[];
  businessKey?: string[];
}

export enum OrderBy {
  ASC = "ASC",
  DESC = "DESC",
}

export interface WorkflowListSortBy {
  workflowName?: OrderBy;
  state?: OrderBy;
  start?: OrderBy;
  lastUpdate?: OrderBy;
}

export interface JobsSortBy {
  status?: OrderBy;
  expirationTime?: OrderBy;
  priority?: OrderBy;
  retries?: OrderBy;
  lastUpdate?: OrderBy;
  executionCounter?: OrderBy;
}

export interface WorkflowListState {
  filters: WorkflowInstanceFilter;
  sortBy: WorkflowListSortBy;
}

export interface SvgSuccessResponse {
  svg: string;
  error?: never;
}

export interface SvgErrorResponse {
  error: string;
  svg?: never;
}
