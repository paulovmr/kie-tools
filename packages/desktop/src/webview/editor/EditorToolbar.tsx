/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
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

import * as React from "react";
import { useContext, useMemo, useState } from "react";
import { GlobalContext } from "../common/GlobalContext";
import { PageSection, Title, Toolbar, ToolbarGroup, ToolbarItem } from "@patternfly/react-core";
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle } from "@patternfly/react-core";
import { removeDirectories } from "../../common/utils";
import { Tooltip, TooltipPosition } from "@patternfly/react-core/dist/js/components/Tooltip/Tooltip";

interface Props {
  onCopyContentToClipboard: () => void;
}

export function EditorToolbar(props: Props) {
  const context = useContext(GlobalContext);
  const [isKebabOpen, setKebabOpen] = useState(false);

  const kebabItems = useMemo(
    () => [
      <DropdownItem key="copy" component="button" onClick={props.onCopyContentToClipboard}>
        Copy content to clipboard
      </DropdownItem>
    ],
    []
  );

  const tooltipContent = <div>{context.file?.filePath!}</div>;

  return (
    <PageSection type="nav" className="kogito--editor__toolbar-section">
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem>
            <Tooltip content={tooltipContent} position={TooltipPosition.bottom}>
              <Title headingLevel="h3" size="md">
                {removeDirectories(context.file?.filePath!)}
              </Title>
            </Tooltip>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup className="kogito--right">
          <ToolbarItem className="pf-u-mr-sm">
            <Dropdown
              onSelect={() => setKebabOpen(false)}
              toggle={<KebabToggle onToggle={isOpen => setKebabOpen(isOpen)} />}
              isOpen={isKebabOpen}
              isPlain={true}
              dropdownItems={kebabItems}
              position={DropdownPosition.right}
            />
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    </PageSection>
  );
}
