/*
 * Copyright 2011 JBoss, by Red Hat, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jboss.errai.bus.server.io.websockets;


import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.socket.nio.NioServerSocketChannelFactory;
import org.jboss.errai.bus.server.service.ErraiService;
import org.jboss.errai.bus.server.service.ErraiServiceConfigurator;
import org.slf4j.Logger;

import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * @author Mike Brock
 */
public class WebSocketServer {

  private ErraiService svc;
  private Logger log = getLogger(getClass());

  public WebSocketServer(ErraiService bus) {
    this.svc = bus;
  }

  public void start() {
    Integer port = svc.getConfiguration().getIntProperty(ErraiServiceConfigurator.WEB_SOCKET_PORT);
    if (port == null) {
      port = 8081;
    }
    
    // Configure the server.
    ServerBootstrap bootstrap = new ServerBootstrap(new NioServerSocketChannelFactory(
            Executors.newCachedThreadPool(), Executors.newCachedThreadPool()));

    // Set up the event pipeline factory.
    bootstrap.setPipelineFactory(new WebSocketServerPipelineFactory(svc));

    // Bind and start to accept incoming connections.
    bootstrap.bind(new InetSocketAddress(port));
    
    log.info("started web socket server on port: " + port);
  }
}
