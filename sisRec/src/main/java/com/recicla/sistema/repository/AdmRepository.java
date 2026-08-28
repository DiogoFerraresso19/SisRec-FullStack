package com.recicla.sistema.repository;

import com.recicla.sistema.model.Adm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface AdmRepository extends JpaRepository<Adm, Long> {
    
    // 🛡️ CONSULTA NATIVA FORÇADA E BLINDADA: Busca apenas administradores ativos
    @Query(value = "SELECT * FROM public.cadadm WHERE login = :login AND ativo = TRUE LIMIT 1", nativeQuery = true)
    Optional<Adm> findByLogin(@Param("login") String login);
}
