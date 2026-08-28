package com.recicla.sistema.controller;

import com.recicla.sistema.model.Contribuinte;
import com.recicla.sistema.repository.ContribuinteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contribuintes")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ContribuinteController {
    
    private final ContribuinteRepository repository;

    // Construtor estruturado para injeção de dependência
    public ContribuinteController(ContribuinteRepository repository) {
        this.repository = repository;
    }

    // 🔍 Rota GET: Envia a lista completa de contribuintes para o React
    @GetMapping
    public ResponseEntity<List<Contribuinte>> listarTodos() {
        List<Contribuinte> lista = repository.findAll();
        return ResponseEntity.ok(lista);
    }

    // 🛡️ Rota POST Unificada: Recebe o payload na raiz e valida a permissão MASTER
    @PostMapping
    public ResponseEntity<?> salvarContribuinte(
            @RequestBody Contribuinte contribuinte, 
            @RequestHeader(value = "X-Perfil-Usuario", required = false) String perfilOperador) {
        
        System.out.println("====== CADASTRO DE CONTRIBUINTE ======");
        System.out.println("-> PERFIL REQUISITANTE: [" + perfilOperador + "]");

        // Bloqueio no servidor: se o perfil for enviado e não for MASTER, o sistema barra no ato
        if (perfilOperador != null && !"MASTER".equals(perfilOperador)) {
            System.out.println("-> BLOQUEADO: Operador sem privilégios tentou cadastrar.");
            System.out.println("======================================");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("mensagem", "Apenas administradores MASTER possuem permissão para cadastrar contribuintes."));
        }

        Contribuinte novo = repository.save(contribuinte);
        System.out.println("-> SUCESSO: Contribuinte [" + novo.getNomeContribuinte() + "] salvo com sucesso!");
        System.out.println("======================================");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    // 🔄 Rota PUT: Altera o status lógico (Ativo/Inativo) - Soft Delete
    @PutMapping("/alterar-status/{id}")
    public ResponseEntity<?> alterarStatusContribuinte(
            @PathVariable Long id, // 🎯 CORRIGIDO: Alterado de Integer para Long para bater com o Repository!
            @RequestBody Map<String, Object> dados,
            @RequestHeader(value = "X-Perfil-Usuario", required = false) String perfilOperador) {
        
        System.out.println("====== ALTERAÇÃO STATUS CONTRIBUINTE ======");
        System.out.println("-> ALTERANDO ID CONTRIBUINTE: [" + id + "]");

        // Validação extra de segurança no servidor: Apenas MASTER altera status
        if (perfilOperador != null && !"MASTER".equals(perfilOperador)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("mensagem", "Apenas administradores MASTER podem alterar o status de um contribuinte."));
        }

        Boolean novoStatusAtivo = (Boolean) dados.get("ativo");

        return repository.findById(id)
            .map(c -> {
                if (novoStatusAtivo != null) {
                    c.setAtivo(novoStatusAtivo);
                }
                repository.save(c);
                System.out.println("-> SUCESSO: Status alterado no Postgres para " + novoStatusAtivo);
                System.out.println("===========================================");
                return ResponseEntity.ok(Map.of("mensagem", "Status do contribuinte atualizado com sucesso!"));
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensagem", "Contribuinte não encontrado.")));
    }
}
