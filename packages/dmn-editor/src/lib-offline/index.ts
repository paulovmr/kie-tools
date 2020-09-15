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

import * as _ from "underscore";
import * as fs from "fs";
import { DMNEditorResources } from "../editor/DMNEditorResources";
import { GwtEditorMapping } from "@kogito-tooling/kie-bc-editors";

function getBase64FromFile(path: string) {
  return new Buffer(fs.readFileSync(path)).toString("base64");
}

function main() {
  const languageData = new GwtEditorMapping().getLanguageData({
    resourcesPathPrefix: "../kie-bc-editors-unpacked/dmn",
    fileExtension: "dmn",
    initialLocale: "",
    isReadOnly: false
  });

  const additionalLanguageData = new DMNEditorResources().get({
    resourcesPathPrefix: "../kie-bc-editors-unpacked/dmn"
  });

  const template = _.template(fs.readFileSync("dist/resources/lib-offline/dmnEnvelopeIndex.template").toString());
  const dmnEnvelopeIndex = template({
    fontResources: [
      {
        family: "codicon",
        sources: [
          {
            mimeType: "font/ttf",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/monaco-editor/dev/vs/base/browser/ui/codiconLabel/codicon/codicon.ttf`
            ),
            format: "truetype"
          }
        ]
      },
      {
        family: "FontAwesome",
        additionalStyle: "font-weight:normal;font-style:normal;",
        sources: [
          {
            mimeType: "application/vnd.ms-fontobject",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/fontawesome-webfont.eot`
            ),
            format: "embedded-opentype"
          },
          {
            mimeType: "font/woff2",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/fontawesome-webfont.woff2`
            ),
            format: "woff2"
          },
          {
            mimeType: "font/woff",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/fontawesome-webfont.woff`
            ),
            format: "woff"
          },
          {
            mimeType: "font/ttf",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/fontawesome-webfont.ttf`
            ),
            format: "truetype"
          },
          {
            mimeType: "image/svg+xml",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/fontawesome-webfont.svg`
            ),
            format: "svg"
          }
        ]
      },
      {
        family: "PatternFlyIcons-webfont",
        additionalStyle: "font-weight:normal;font-style:normal;",
        sources: [
          {
            mimeType: "application/vnd.ms-fontobject",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/PatternFlyIcons-webfont.eot`
            ),
            format: "embedded-opentype"
          },
          {
            mimeType: "font/woff",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/PatternFlyIcons-webfont.woff`
            ),
            format: "woff"
          },
          {
            mimeType: "font/ttf",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/PatternFlyIcons-webfont.ttf`
            ),
            format: "truetype"
          },
          {
            mimeType: "image/svg+xml",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/PatternFlyIcons-webfont.svg`
            ),
            format: "svg"
          }
        ]
      },
      {
        family: "Glyphicons Halflings",
        sources: [
          {
            mimeType: "application/vnd.ms-fontobject",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/glyphicons-halflings-regular.eot`
            ),
            format: "embedded-opentype"
          },
          {
            mimeType: "font/woff",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/glyphicons-halflings-regular.woff`
            ),
            format: "woff"
          },
          {
            mimeType: "font/woff2",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/glyphicons-halflings-regular.woff2`
            ),
            format: "woff2"
          },
          {
            mimeType: "font/ttf",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/glyphicons-halflings-regular.ttf`
            ),
            format: "truetype"
          },
          {
            mimeType: "image/svg+xml",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/glyphicons-halflings-regular.svg`
            ),
            format: "svg"
          }
        ]
      },
      {
        family: "Open Sans",
        additionalStyle: "font-weight:300;font-style:normal;",
        sources: [
          {
            mimeType: "application/vnd.ms-fontobject",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Light-webfont.eot`
            ),
            format: "embedded-opentype"
          },
          {
            mimeType: "font/ttf",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Light-webfont.ttf`
            ),
            format: "truetype"
          },
          {
            mimeType: "font/woff",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Light-webfont.woff`
            ),
            format: "woff"
          },
          {
            mimeType: "image/svg+xml",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Light-webfont.svg`
            ),
            format: "svg"
          }
        ]
      },
      {
        family: "Open Sans",
        additionalStyle: "font-weight:400;font-style:normal;",
        sources: [
          {
            mimeType: "application/vnd.ms-fontobject",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Regular-webfont.eot`
            ),
            format: "embedded-opentype"
          },
          {
            mimeType: "font/ttf",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Regular-webfont.ttf`
            ),
            format: "truetype"
          },
          {
            mimeType: "font/woff",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Regular-webfont.woff`
            ),
            format: "woff"
          },
          {
            mimeType: "image/svg+xml",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Regular-webfont.svg`
            ),
            format: "svg"
          }
        ]
      },
      {
        family: "Open Sans",
        additionalStyle: "font-weight:600;font-style:normal;",
        sources: [
          {
            mimeType: "application/vnd.ms-fontobject",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Semibold-webfont.eot`
            ),
            format: "embedded-opentype"
          },
          {
            mimeType: "font/ttf",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Semibold-webfont.ttf`
            ),
            format: "truetype"
          },
          {
            mimeType: "font/woff",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Semibold-webfont.woff`
            ),
            format: "woff"
          },
          {
            mimeType: "image/svg+xml",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Semibold-webfont.svg`
            ),
            format: "svg"
          }
        ]
      },
      {
        family: "Open Sans",
        additionalStyle: "font-weight:700;font-style:normal;",
        sources: [
          {
            mimeType: "application/vnd.ms-fontobject",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Bold-webfont.eot`
            ),
            format: "embedded-opentype"
          },
          {
            mimeType: "font/ttf",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Bold-webfont.ttf`
            ),
            format: "truetype"
          },
          {
            mimeType: "font/woff",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Bold-webfont.woff`
            ),
            format: "woff"
          },
          {
            mimeType: "image/svg+xml",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-Bold-webfont.svg`
            ),
            format: "svg"
          }
        ]
      },
      {
        family: "Open Sans",
        additionalStyle: "font-weight:800;font-style:normal;",
        sources: [
          {
            mimeType: "application/vnd.ms-fontobject",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-ExtraBold-webfont.eot`
            ),
            format: "embedded-opentype"
          },
          {
            mimeType: "font/ttf",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-ExtraBold-webfont.ttf`
            ),
            format: "truetype"
          },
          {
            mimeType: "font/woff",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-ExtraBold-webfont.woff`
            ),
            format: "woff"
          },
          {
            mimeType: "image/svg+xml",
            content: getBase64FromFile(
              `../kie-bc-editors-unpacked/dmn/${languageData?.gwtModuleName}/fonts/OpenSans-ExtraBold-webfont.svg`
            ),
            format: "svg"
          }
        ]
      }
    ],
    cssResources: languageData?.resources
      .filter(r => r.type === "css")
      .pop()
      ?.paths.map(path => {
        console.log(path);
        return {
          path: path,
          content: fs.readFileSync(path)
        };
      }),
    jsResources: languageData?.resources
      .filter(r => r.type === "js")
      .pop()
      ?.paths.map(path => {
        console.log(path);
        return {
          path: path,
          content: fs.readFileSync(path)
        };
      }),
    postInitialLoadingCssResources: additionalLanguageData?.resources
      .filter(r => r.type === "css")
      .pop()
      ?.paths.map(path => {
        console.log(path);
        return {
          path: path,
          content: fs.readFileSync(path)
        };
      }),
    postInitialLoadingJsResources: additionalLanguageData?.resources
      .filter(r => r.type === "js")
      .pop()
      ?.paths.map(path => {
        console.log(path);
        return {
          path: path,
          content: fs.readFileSync(path)
        };
      })
  });

  fs.writeFileSync("dist/resources/lib-offline/dmnEnvelopeIndex.html", dmnEnvelopeIndex);
  fs.writeFileSync(
    "dist/resources/lib-offline/dmnEnvelopeIndex.html.base64",
    Buffer.from(dmnEnvelopeIndex).toString("base64")
  );
}

main();
