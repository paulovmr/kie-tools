/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ContentType,
  ResourceContent,
  ResourceContentOptions,
  ResourceContentService,
  ResourceListOptions,
  ResourcesList,
  SearchType
} from "@kogito-tooling/channel-common-api";

import * as vscode from "vscode";
import * as nodePath from "path";
import { RelativePattern, WorkspaceFolder } from "vscode";
import { File, StateControl } from "@kogito-tooling/editor/dist/channel";
import { KogitoEditorChannelApi } from "@kogito-tooling/editor/dist/api";

/**
 * Implementation of a ResourceContentService that uses callbacks to redirect the request
 */
export class StandaloneEditorResourceContentService implements ResourceContentService {
  constructor(
    private readonly listAction: (pattern: string, opts?: ResourceListOptions) => Promise<ResourcesList>,
    private readonly getAction: (path: string, opts?: ResourceContentOptions) => Promise<ResourceContent | undefined>
  ) {}

  public async list(pattern: string, opts?: ResourceListOptions): Promise<ResourcesList> {
    return this.listAction(pattern, opts);
  }

  public async get(path: string, opts?: ResourceContentOptions): Promise<ResourceContent | undefined> {
    return this.getAction(path, opts);
  }
}
