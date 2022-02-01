import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  Button,
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  Tooltip,
} from "@patternfly/react-core";
import { getFunctionDefinitionList } from "./apis";
import { FunctionDefinition } from "./types";

const FunctionCatalog = () => {
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string>("");
  const [functionList, setFunctionList] = useState<FunctionDefinition[]>([]);
  const data = JSON.parse(localStorage.getItem("services") || "[]");
  const file = "openapi.yaml";
  const fileName = file.split(".")[0];

  const handleClick = (): void => {
    setDisplayMenu(!displayMenu);
  };

  const initLoad = async (): Promise<void> => {
    const tempList: FunctionDefinition[] = await getFunctionDefinitionList(file);

    setFunctionList(tempList);
  };
  React.useEffect(() => {
    initLoad();
  }, []);

  const onToggle = (id: string): void => {
    if (id === expanded) {
      setExpanded("");
    } else {
      setExpanded(id);
    }
  };

  const renderAccordionItem = (): JSX.Element => {
    if (fileName.length === 0) {
      return <MenuItem isDisabled>No service</MenuItem>;
    } else {
      return (
        <Accordion asDefinitionList style={{ width: "250px" }}>
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle(fileName);
              }}
              isExpanded={expanded === fileName}
              id={fileName}
            >
              {fileName}
            </AccordionToggle>
            <AccordionContent id={fileName} isHidden={expanded !== fileName}>
              {functionList &&
                functionList.map((list: FunctionDefinition, index: number) => (
                  <Tooltip content={<div>{list.name}</div>} key={index}>
                    <MenuItem key={index} onClick={handleClick}>
                      {list.name}
                    </MenuItem>
                  </Tooltip>
                ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleClick} ouiaId="catalog-button">
        Catalog Explorer
      </Button>
      {displayMenu && (
        <Menu>
          <MenuContent>
            <MenuList>{renderAccordionItem()}</MenuList>
          </MenuContent>
        </Menu>
      )}
    </>
  );
};

export default FunctionCatalog;
