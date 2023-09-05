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

import * as React from "react";
import { Nav, NavExpandable, NavItem, NavList } from "@patternfly/react-core/dist/js/components/Nav";
import { Link, matchPath } from "react-router-dom";
import { ExternalLinkAltIcon } from "@patternfly/react-icons/dist/js/icons";
import { routes } from "../../navigation/Routes";
import { SERVERLESS_LOGIC_WEBTOOLS_DOCUMENTATION_URL } from "../../AppConstants";

export function HomePageNav(props: { pathname: string }) {
  return (
    <>
      <Nav aria-label="Global NAV" theme="dark">
        <NavList>
          <NavItem
            itemId={0}
            key={"Overview-nav"}
            isActive={props.pathname === routes.home.path({})}
            ouiaId="overview-nav"
          >
            <Link to={routes.home.path({})}>Overview</Link>
          </NavItem>

          <NavItem
            itemId={1}
            key={"Recent-models-nav"}
            isActive={
              props.pathname === routes.recentModels.path({}) ||
              matchPath(props.pathname, { path: routes.workspaceWithFiles.path({ workspaceId: ":workspaceId" }) })
                ?.isExact
            }
            ouiaId="recent-models-nav"
          >
            <Link to={routes.recentModels.path({})}>Recent Models</Link>
          </NavItem>

          <NavItem
            itemId={2}
            key={"SampleCatalog-nav"}
            isActive={props.pathname === routes.sampleCatalog.path({})}
            ouiaId="samples-catalog-nav"
          >
            <Link to={routes.sampleCatalog.path({})}>Sample Catalog</Link>
          </NavItem>

          <NavExpandable title="Runtime Tools" groupId="runtime-tools-nav-group">
            <NavItem
              itemId={3}
              key={"RuntimeTools-nav"}
              isActive={props.pathname === routes.runtimeToolsWorkflows.path({})}
              ouiaId="runtime-tools-workflows-nav"
            >
              <Link to={routes.runtimeToolsWorkflows.path({})}>Workflows</Link>
            </NavItem>
          </NavExpandable>

          <NavItem itemId={4} key={"Documentation-nav"} className="chr-c-navigation__additional-links">
            <a href={SERVERLESS_LOGIC_WEBTOOLS_DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">
              Documentation
              <ExternalLinkAltIcon />
            </a>
          </NavItem>
        </NavList>
      </Nav>
    </>
  );
}
