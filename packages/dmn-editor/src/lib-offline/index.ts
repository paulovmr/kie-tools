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
import * as _ from "underscore";
import * as fs from "fs";

function main() {
  const languageData = new GwtEditorMapping().getLanguageData({
    resourcesPathPrefix: "../kie-bc-editors-unpacked/dmn",
    fileExtension: "dmn",
    initialLocale: "",
    isReadOnly: false
  });

  const template = _.template(fs.readFileSync("dist/resources/lib-offline/dmnEnvelopeIndex.html").toString());
  const dmnEnvelopeIndex = template({
    cssResources: languageData?.resources
      .filter(r => r.type === "css")
      .pop()
      ?.paths.map(path => fs.readFileSync(path)),
    jsResources: languageData?.resources
      .filter(r => r.type === "js")
      .pop()
      ?.paths.map(path => fs.readFileSync(path))
  });

  fs.writeFileSync("dist/resources/lib-offline/dmnEnvelopeIndex.html", dmnEnvelopeIndex);
  fs.writeFileSync(
    "dist/resources/lib-offline/dmnEnvelopeIndex.html.b64",
    Buffer.from(dmnEnvelopeIndex).toString("base64")
  );
}

main();
