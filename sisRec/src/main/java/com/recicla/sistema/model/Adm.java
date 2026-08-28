package com.recicla.sistema.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cadadm") 
@Data
public class Adm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_adm") // Chave primária oficial vinculada às chaves estrangeiras
    private Long codadm;

    @Column(name = "codadm", insertable = false, updatable = false) 
    // 🎯 CORRIGIDO: Agora aponta para a coluna física minúscula do banco sem aspas doidas
    private Integer codadmMinulo;

    private String nome;
    private Long cpf;      
    private String email;
    private String endereco; 
    private String login;    
    private String senha;

    @Column(name = "perfil", nullable = false)
    private String perfil = "OPERADOR"; 

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true; 
}
