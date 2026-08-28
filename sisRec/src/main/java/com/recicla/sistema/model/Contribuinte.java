package com.recicla.sistema.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cadcontribuinte") // Nome exato da tabela no Postgres
@Data // 🚀 O Lombok vai gerar os Getters e Setters perfeitos em memória
public class Contribuinte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"codContribuinte\"") 
    private Long codContribuinte;

    @Column(name = "\"nomeContribuinte\"")
    private String nomeContribuinte;

    @Column(name = "\"cpfContribuinte\"")
    private String cpfContribuinte;

    @Column(name = "\"endContribuinte\"")
    private String endContribuinte;

    @Column(name = "\"docContribuinte\"")
    private String docContribuinte;
    
    @Column(name = "\"ptsContribuinte\"")
    private Integer ptsContribuinte; 

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true; // 🎯 Removidos os métodos manuais daqui para o Lombok operar sem conflitos!
}
