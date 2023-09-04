package com.cybermodding.configurations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.cybermodding.runners.WebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    protected WebSocketHandler webSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/ws").setAllowedOriginPatterns("http://localhost:4200");
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
