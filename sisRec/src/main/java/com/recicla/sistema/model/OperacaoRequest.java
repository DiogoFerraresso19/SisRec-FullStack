package com.recicla.sistema.model;

import lombok.Data;
import java.math.BigDecimal;

@Data // 👈 O Lombok lê este bloco e cria automaticamente todos os Getters e Setters
public class OperacaoRequest {
    
    private Long codContribuinte;
    private Long codProduto;
    private BigDecimal pesoKg;
    private Long idAdm; 
}
