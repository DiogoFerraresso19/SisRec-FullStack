package com.recicla.sistema.repository;

import com.recicla.sistema.model.Movimentacao; // Importa a classe do pacote model
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {

        // Herdando o findAll() para trazer todo o histórico de auditoria do Ecoponto

}