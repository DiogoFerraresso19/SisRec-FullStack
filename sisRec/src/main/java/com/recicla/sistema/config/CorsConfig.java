package com.recicla.sistema.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Permite requisições da origem do seu frontend React (Vite)
        config.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
        
        // Libera os métodos HTTP necessários para o ecoponto operar
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Libera explicitamente o seu cabeçalho customizado de permissões e os padrões do Axios
        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization", "X-Perfil-Usuario"));
        
        // Permite que o navegador leia as respostas
        config.setAllowCredentials(true);
        
        // Aplica essa regra para todos os endpoints da API (/api/**)
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
