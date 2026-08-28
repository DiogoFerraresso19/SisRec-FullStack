package com.recicla.sistema.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "cadtransacao")
public class Transacao implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "codcontribuinte")
    private Integer idContribuinte;

    @Column(name = "idproduto")
    private Integer idProduto;

    @Column(name = "tipoproduto")
    private String tipoProduto;

    @Column(name = "pesomedido")
    private Double pesoMedido;

    @Column(name = "ptstotais")
    private Integer pontosGerados;

    @Column(name = "valortransacao")
    private Double valorGerado;

    @Column(name = "datatransacao")
    private LocalDateTime dataTransacao;

    // 🛡️ ADICIONADO: Campo de controle para Desativação Lógica (Soft Delete)
    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    // 🔑 CORRIGIDO: O relacionamento com o Adm agora está posicionado dentro da classe
    @ManyToOne
    @JoinColumn(name = "id_adm", referencedColumnName = "cod_adm", nullable = false)
    private Adm administrador;

    // Construtor Padrão
    public Transacao() {}

    // GETTERS E SETTERS CORRIGIDOS
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getIdContribuinte() { return idContribuinte; }
    public void setIdContribuinte(Integer idContribuinte) { this.idContribuinte = idContribuinte; }

    public Integer getIdProduto() { return idProduto; }
    public void setIdProduto(Integer idProduto) { this.idProduto = idProduto; }

    public String getTipoProduto() { return tipoProduto; }
    public void setTipoProduto(String tipoProduto) { this.tipoProduto = tipoProduto; }

    public Double getPesoMedido() { return pesoMedido; }
    public void setPesoMedido(Double pesoMedido) { this.pesoMedido = pesoMedido; }

    public Integer getPontosGerados() { return pontosGerados; }
    public void setPontosGerados(Integer pontosGerados) { this.pontosGerados = pontosGerados; }

    public Double getValorGerado() { return valorGerado; }
    public void setValorGerado(Double valorGerado) { this.valorGerado = valorGerado; }

    public LocalDateTime getDataTransacao() { return dataTransacao; }
    public void setDataTransacao(LocalDateTime dataTransacao) { this.dataTransacao = dataTransacao; }

    // GETTER E SETTER DO ATIVO
    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }

    // GETTER E SETTER DO ADMINISTRADOR
    public Adm getAdministrador() { return administrador; }
    public void setAdministrador(Adm administrador) { this.administrador = administrador; }
}
