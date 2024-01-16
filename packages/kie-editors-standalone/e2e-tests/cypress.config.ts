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

import { defineConfig } from "cypress";

export default defineConfig({
  fixturesFolder: "./cypress/fixtures",
  screenshotsFolder: "../dist-e2e-tests/screenshots",
  videosFolder: "../dist-e2e-tests/videos",
  reporter: "junit",
  reporterOptions: {
    mochaFile: "../dist-e2e-tests/junit-report-[hash].xml",
    testsuitesTitle: "BPMN and DMN Standalone Editors",
    testCaseSwitchClassnameAndName: true,
    suiteTitleSeparatedBy: ".",
    useFullSuiteTitle: true,
    rootSuiteTitle: "@kie-tools/kie-editors-standalone",
  },
  video: true,
  e2e: {
    specPattern: "./cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
  retries: {
    runMode: 1,
    openMode: 0,
  },
});
