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

import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { Menu } from "./Menu";
import { FS } from "../storage/core/FS";
import { Files } from "../storage/core/Files";
import { DesktopUserData } from "./DesktopUserData";

const userData = new DesktopUserData();

app.on("ready", () => {
  Files.register(new FS());

  const mainWindow = new BrowserWindow({
    height: 960,
    width: 1280,
    show: false,
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true //https://github.com/electron/electron/issues/9920#issuecomment-575839738
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  const menu = new Menu(mainWindow, userData);
  menu.setup();

  ipcMain.on("mainWindowLoaded", () => {
    console.info("Desktop app is loaded.");
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
