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

import React, { useMemo } from "react";
import { ApolloClient } from "apollo-client";
import { WorkflowListContext } from "./WorkflowListContext";
import { WorkflowListGatewayApiImpl } from "./WorkflowListGatewayApi";
import { GraphQLWorkflowListQueries } from "./WorkflowListQueries";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";

export function WorkflowListContextProvider(props: React.PropsWithChildren<{}>) {
  const httpLink = new HttpLink({
    uri: "http://localhost:8180", // TODO dataIndexUrl
  });
  const cache = new InMemoryCache();

  const apolloClient: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link: httpLink,
  });

  const gatewayApiImpl = useMemo(() => {
    return new WorkflowListGatewayApiImpl(new GraphQLWorkflowListQueries(apolloClient));
  }, [apolloClient]);

  return <WorkflowListContext.Provider value={gatewayApiImpl}>{props.children}</WorkflowListContext.Provider>;
}
