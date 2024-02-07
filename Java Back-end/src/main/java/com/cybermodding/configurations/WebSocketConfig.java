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
    WSChatHandler wsChatHandler;
    @Autowired
    WSPMsHandler wsPmsHandler;
    @Autowired
    WSOnlineSpyHandler wsOnlineSpyHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        String[] domains = { "http://localhost:4200", "*.devtunnels.ms" };

        registry.addHandler(wsChatHandler, "/ws/chat").setAllowedOriginPatterns(domains);
        registry.addHandler(wsPmsHandler, "/ws/pms").setAllowedOriginPatterns(domains);
        registry.addHandler(wsOnlineSpyHandler, "/ws/online/{userId}").setAllowedOriginPatterns(domains);
    }
}
