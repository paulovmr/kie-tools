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

import { Menu as ElectronMenu, BrowserWindow, dialog, app } from "electron";
import * as path from "path";
import { FileOperations } from "./FileOperations";
import { DesktopUserData } from "./DesktopUserData";

export class Menu {
  private readonly window: BrowserWindow;
  private readonly userData: DesktopUserData;
  private readonly fileOperations: FileOperations;

  private readonly saveMenu = {
    label: "Save",
    click: () => {
      this.fileOperations.save();
    },
    enabled: false
  };

  private readonly saveAsMenu = {
    label: "Save As...",
    click: () => {
      dialog
        .showSaveDialog(this.window, {
          title: "Save file",
          filters: [
            { name: "Supported file extensions (*.bpmn, *.bpmn2, *.dmn)", extensions: ["bpmn", "bpmn2", "dmn"] }
          ]
        })
        .then(result => {
          if (!result.canceled) {
            this.fileOperations.saveAs(result.filePath!);
          }
        });
    },
    enabled: false
  };

  constructor(window: BrowserWindow, userData: DesktopUserData) {
    this.window = window;
    this.userData = userData;
    this.fileOperations = new FileOperations(window, this, userData);
  }

  public setFileMenusEnabled(enabled: boolean) {
    this.saveMenu.enabled = enabled;
    this.saveAsMenu.enabled = enabled;
    this.setup();
  }

  public setup() {
    ElectronMenu.setApplicationMenu(
      ElectronMenu.buildFromTemplate([
        {
          label: "File",
          submenu: [
            {
              label: "New",
              submenu: [
                {
                  label: "BPMN",
                  click: () => {
                    this.fileOperations.new("bpmn");
                  }
                },
                {
                  label: "DMN",
                  click: () => {
                    this.fileOperations.new("dmn");
                  }
                }
              ]
            },
            {
              label: "Open",
              submenu: [
                {
                  label: "File",
                  click: () => {
                    dialog
                      .showOpenDialog(this.window, {
                        title: "Open file",
                        filters: [
                          {
                            name: "Supported file extensions (*.bpmn, *.bpmn2, *.dmn)",
                            extensions: ["bpmn", "bpmn2", "dmn"]
                          }
                        ]
                      })
                      .then(result => {
                        if (!result.canceled) {
                          this.fileOperations.open(result.filePaths[0]);
                        }
                      });
                  }
                },
                {
                  label: "URL",
                  click: () => {
                    this.window.webContents.send("goToOpenFileByURL");
                    this.setFileMenusEnabled(false);
                  }
                },
                {
                  label: "Sample",
                  submenu: [
                    {
                      label: "BPMN",
                      click: () => {
                        this.fileOperations.openSample(path.join(__dirname, "samples/sample.bpmn"));
                      }
                    },
                    {
                      label: "DMN",
                      click: () => {
                        this.fileOperations.openSample(path.join(__dirname, "samples/sample.dmn"));
                      }
                    }
                  ]
                }
              ]
            },
            this.saveMenu,
            this.saveAsMenu,
            {
              type: "separator"
            },
            {
              label: "Clear cache",
              click: () => {
                this.userData.clear();
              }
            },
            {
              label: "Close All",
              click: () => {
                this.window.webContents.send("goToHomePage");
                this.setFileMenusEnabled(false);
              }
            },
            {
              type: "separator"
            },
            {
              label: "Quit",
              click: () => {
                app.quit();
              }
            }
          ]
        },
        {
          label: "View",
          submenu: [
            {
              label: "Show Developer Tools",
              click: () => {
                this.window.webContents.openDevTools();
              }
            }
          ]
        }
      ])
    );
  }
}
