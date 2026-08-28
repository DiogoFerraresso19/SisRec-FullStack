package com.recicla.sistema.repository;

import com.recicla.sistema.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    // O Spring Boot gera automaticamente: SELECT * FROM cadproduto WHERE ativo = true
    List<Produto> findByAtivoTrue();
}