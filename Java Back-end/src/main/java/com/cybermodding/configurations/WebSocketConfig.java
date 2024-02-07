package com.cybermodding.configurations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.cybermodding.runners.WSChatHandler;
import com.cybermodding.runners.WSOnlineSpyHandler;
import com.cybermodding.runners.WSPMsHandler;

@Configuration
@EnableWebSocket
@SuppressWarnings("null")
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    protected WSChatHandler wsChatHandler;
    @Autowired
    protected WSPMsHandler wsPmsHandler;
    @Autowired
    WSOnlineSpyHandler wsOnlineSpyHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(wsChatHandler, "/ws/chat").setAllowedOriginPatterns("http://localhost:4200");
        registry.addHandler(wsPmsHandler, "/ws/pms").setAllowedOriginPatterns("http://localhost:4200");
        registry.addHandler(wsOnlineSpyHandler, "/ws/online/{userId}")
                .setAllowedOriginPatterns("http://localhost:4200");
    }
}

// @Configuration
// @EnableWebSocketMessageBroker
// public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

// @Override
// public void configureMessageBroker(MessageBrokerRegistry config) {
// config.enableSimpleBroker("/topic");
// }

// @Override
// public void registerStompEndpoints(StompEndpointRegistry registry) {
// registry.addEndpoint("/ws").setAllowedOriginPatterns("http://localhost:4200");
// }
// }
