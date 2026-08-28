package com.recicla.sistema.controller;

import com.recicla.sistema.model.Movimentacao;
import com.recicla.sistema.repository.MovimentacaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimentacoes")
@CrossOrigin(origins = "*") // Libera o acesso para o React integrado
public class MovimentacaoController {

    // Injeção de dependência limpa e imutável pelo construtor
    private final MovimentacaoRepository repository;

    public MovimentacaoController(MovimentacaoRepository repository) {
        this.repository = repository;
    }

    // Rota GET: Retorna status 200 OK com a lista de movimentações
    @GetMapping
    public ResponseEntity<List<Movimentacao>> listarTodas() {
        List<Movimentacao> lista = repository.findAll();
        return ResponseEntity.ok(lista);
    }

    // Rota POST: Salva uma movimentação e retorna status 201 Created
    @PostMapping
    public ResponseEntity<Movimentacao> salvarNova(@RequestBody Movimentacao movimentacao) {
        Movimentacao novaMovimentacao = repository.save(movimentacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaMovimentacao);
    }
}