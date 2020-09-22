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

export interface JSResource {
  path: string;
  content: string;
}

export interface CSSResource {
  path: string;
  content: string;
}

export interface FontSource {
  mimeType: string;
  content: string;
  format: string;
}

export interface FontResource {
  family: string;
  sources: FontSource[];
  additionalStyle?: string;
}

export interface EditorResources {
  envelopeJSResource: JSResource;
  baseJSResources: JSResource[];
  referencedJSResources: JSResource[];
  baseCSSResources: CSSResource[];
  referencedCSSResources: CSSResource[];
  fontResources: FontResource[];
}

export interface FontSourceTypeAttributes {
  mimeType: string;
  format: string;
}

export const FONT_ATTRIBUTES = new Map<string, FontSourceTypeAttributes>([
  ["ttf", { mimeType: "font/ttf", format: "truetype" }],
  ["woff", { mimeType: "font/woff", format: "woff" }],
  ["woff2", { mimeType: "font/woff2", format: "woff2" }],
  ["eot", { mimeType: "application/vnd.ms-fontobject", format: "embedded-opentype" }],
  ["svg", { mimeType: "image/svg+xml", format: "svg" }]
]);

export class DMNEditorResources {
  public get(args: { resourcesPathPrefix: string }) {
    const dmnLanguageData = new GwtEditorMapping().getLanguageData({
      resourcesPathPrefix: args.resourcesPathPrefix,
      fileExtension: "dmn",
      initialLocale: "",
      isReadOnly: false
    })!;

    const dmnEditorResources: EditorResources = {
      envelopeJSResource: this.createResource(`dist/envelope/index.js`),
      baseJSResources: dmnLanguageData?.resources
        .filter(r => r.type === "js")
        .pop()
        ?.paths.map(p => this.createResource(p))!,
      referencedJSResources: this.getReferencedJSPaths(args.resourcesPathPrefix, dmnLanguageData.gwtModuleName).map(p =>
        this.createResource(p)
      ),
      baseCSSResources: dmnLanguageData?.resources
        .filter(r => r.type === "css")
        .pop()
        ?.paths.map(p => this.createResource(p))!,
      referencedCSSResources: this.getReferencedCSSPaths(
        args.resourcesPathPrefix,
        dmnLanguageData.gwtModuleName
      ).map(p => this.createResource(p)),
      fontResources: this.getFontResources(args.resourcesPathPrefix, dmnLanguageData.gwtModuleName)
    };

    return dmnEditorResources;
  }

  private createResource(path: string) {
    return { path: path, content: fs.readFileSync(path).toString() };
  }

  private getReferencedJSPaths(resourcesPathPrefix: string, gwtModuleName: string) {
    const editorDir = fs.readdirSync(`${resourcesPathPrefix}/${gwtModuleName}`);
    const gwtJSFile = editorDir.filter(file => file.indexOf(".cache.js") >= 0).pop();
    return [
      `${resourcesPathPrefix}/${gwtModuleName}/monaco-editor/dev/vs/editor/editor.main.js`,
      `${resourcesPathPrefix}/${gwtModuleName}/${gwtJSFile?.split("/").pop()}`,
    ];
  }

  private getReferencedCSSPaths(resourcesPathPrefix: string, gwtModuleName: string) {
    return [
      `${resourcesPathPrefix}/${gwtModuleName}/jquery-ui/jquery-ui.min.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/bootstrap-daterangepicker/daterangepicker.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/bootstrap-select/css/bootstrap-select.min.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/prettify/bin/prettify.min.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/uberfire-patternfly.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/monaco-editor/dev/vs/editor/editor.main.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/css/patternfly-additions.min.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/css/bootstrap-datepicker3-1.6.4.min.cache.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/css/animate-3.5.2.min.cache.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/css/bootstrap-notify-custom.min.cache.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/css/card-1.0.1.cache.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/css/bootstrap-slider-9.2.0.min.cache.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/css/bootstrap-switch-3.3.2.min.cache.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/css/bootstrap-datetimepicker-2.4.4.min.cache.css`,
      `${resourcesPathPrefix}/${gwtModuleName}/css/typeahead-0.10.5.min.cache.css`
    ];
  }

  private getFontResources(resourcesPathPrefix: string, gwtModuleName: string) {
    return [
      {
        family: "codicon",
        sources: [
          this.createFontSource(
            `${resourcesPathPrefix}/${gwtModuleName}/monaco-editor/dev/vs/base/browser/ui/codiconLabel/codicon/codicon.ttf`
          )
        ]
      },
      {
        family: "FontAwesome",
        additionalStyle: "font-weight:normal;font-style:normal;",
        sources: [
          this.createFontSource(`${resourcesPathPrefix}/${gwtModuleName}/fonts/fontawesome-webfont.ttf`)
        ]
      },
      {
        family: "PatternFlyIcons-webfont",
        additionalStyle: "font-weight:normal;font-style:normal;",
        sources: [
          this.createFontSource(`${resourcesPathPrefix}/${gwtModuleName}/fonts/PatternFlyIcons-webfont.ttf`)
        ]
      },
      {
        family: "Glyphicons Halflings",
        sources: [
          this.createFontSource(`${resourcesPathPrefix}/${gwtModuleName}/fonts/glyphicons-halflings-regular.ttf`)
        ]
      },
      {
        family: "Open Sans",
        additionalStyle: "font-weight:300;font-style:normal;",
        sources: [
          this.createFontSource(`${resourcesPathPrefix}/${gwtModuleName}/fonts/OpenSans-Light-webfont.ttf`)
        ]
      },
      {
        family: "Open Sans",
        additionalStyle: "font-weight:400;font-style:normal;",
        sources: [
          this.createFontSource(`${resourcesPathPrefix}/${gwtModuleName}/fonts/OpenSans-Regular-webfont.ttf`)
        ]
      },
      {
        family: "Open Sans",
        additionalStyle: "font-weight:600;font-style:normal;",
        sources: [
          this.createFontSource(`${resourcesPathPrefix}/${gwtModuleName}/fonts/OpenSans-Semibold-webfont.ttf`)
        ]
      },
      {
        family: "Open Sans",
        additionalStyle: "font-weight:700;font-style:normal;",
        sources: [
          this.createFontSource(`${resourcesPathPrefix}/${gwtModuleName}/fonts/OpenSans-Bold-webfont.ttf`)
        ]
      },
      {
        family: "Open Sans",
        additionalStyle: "font-weight:800;font-style:normal;",
        sources: [
          this.createFontSource(`${resourcesPathPrefix}/${gwtModuleName}/fonts/OpenSans-ExtraBold-webfont.ttf`)
        ]
      },
      {
        family: "Font Awesome 5 Free",
        additionalStyle: "font-weight:900;font-style:normal;",
        sources: [
          this.createFontSource(`${resourcesPathPrefix}/${gwtModuleName}/fonts/fontawesome-webfont.ttf`)
        ]
      }
    ];
  }

  private createFontSource(path: string) {
    const fontAttributes = FONT_ATTRIBUTES.get(path.split(".").pop()!)!;
    return {
      mimeType: fontAttributes.mimeType,
      content: this.getBase64FromFile(path),
      format: fontAttributes.format
    };
  }

  private getBase64FromFile(path: string) {
    return Buffer.from(fs.readFileSync(path)).toString("base64");
  }
}
