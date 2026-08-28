package com.recicla.sistema.repository;

import com.recicla.sistema.model.Contribuinte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


//o Spring Data JPA cria automaticamente os métodos mais comuns de manipulação de dados:
@Repository
public interface ContribuinteRepository extends JpaRepository<Contribuinte, Long> {

}

//Não precisa escrever conexões (Connection).
//Não precisa abrir ou fechar transações manualmente.
//Não escreve comandos como INSERT INTO ou SELECT * FROM.
