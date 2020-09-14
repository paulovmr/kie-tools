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

import { GwtEditorMapping } from "@kogito-tooling/kie-bc-editors";
import * as fs from "fs";

export class DMNEditorResources {
  public get(args: { resourcesPathPrefix: string }) {
    const dmnLanguageData = new GwtEditorMapping().getLanguageData({
      resourcesPathPrefix: "../kie-bc-editors-unpacked/dmn",
      fileExtension: "dmn",
      initialLocale: "",
      isReadOnly: false
    });

    (dmnLanguageData?.resources[0] as any).paths = [
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/jquery-ui/jquery-ui.min.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/bootstrap-daterangepicker/daterangepicker.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/bootstrap-select/css/bootstrap-select.min.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/prettify/bin/prettify.min.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/uberfire-patternfly.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/monaco-editor/dev/vs/editor/editor.main.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/css/patternfly-additions.min.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/css/bootstrap-datepicker3-1.6.4.min.cache.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/css/animate-3.5.2.min.cache.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/css/bootstrap-notify-custom.min.cache.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/css/card-1.0.1.cache.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/css/bootstrap-slider-9.2.0.min.cache.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/css/bootstrap-switch-3.3.2.min.cache.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/css/bootstrap-datetimepicker-2.4.4.min.cache.css`,
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/css/typeahead-0.10.5.min.cache.css`
    ];

    const dmnFiles = fs.readdirSync(`${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}`);
    const gwtJsFile = dmnFiles.filter(file => file.indexOf(".cache.js") >= 0).pop();

    // dmnLanguageData?.resources[1].paths.pop();
    (dmnLanguageData?.resources[1] as any).paths = [
      `${args.resourcesPathPrefix}/${dmnLanguageData?.gwtModuleName}/${gwtJsFile?.split("/").pop()}`
    ];

    return dmnLanguageData;
  }
}
