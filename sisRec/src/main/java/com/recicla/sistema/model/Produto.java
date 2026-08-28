package com.recicla.sistema.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cadproduto") // Nome exato da tabela no Postgres
@Data
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codproduto")
    private Long codProduto;

    @Column(name = "tipoproduto") // Força o uso do nome correto sem sublinhado
    private String tipoProduto;

    @Column(name = "pesounidade")
    private BigDecimal pesounidade;

    @Column(name = "pesokg")
    private BigDecimal pesokg;

    @Column(name = "valorporkg")
    private BigDecimal valorporkg;

    @Column(name = "ptstotais")
    private BigDecimal ptstotais;

    @Column(name = "datacad")
    private LocalDate datacad;

    // Adicione este campo para sustentar a lógica de Soft Delete do Ecoponto
    @Column(name = "ativo")
    private Boolean ativo = true; 
}