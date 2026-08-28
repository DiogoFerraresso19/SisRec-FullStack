package com.recicla.sistema.controller;

import com.recicla.sistema.model.Produto;
import com.recicla.sistema.repository.ProdutoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*") // Libera acesso ao React integrado
public class ProdutoController {

    private final ProdutoRepository repository;

    // Injeção de dependência via construtor padrão
    public ProdutoController(ProdutoRepository repository) {
        this.repository = repository;
    }

    // Rota GET: Alterada para trazer apenas produtos que NÃO foram inativados
    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        List<Produto> lista = repository.findByAtivoTrue(); // Busca personalizada
        return ResponseEntity.ok(lista);
    }

    // Rota POST: Força a data de cadastro atual e o status ativo como true
    @PostMapping
    public ResponseEntity<Produto> salvarNovo(@RequestBody Produto produto) {
        produto.setDatacad(LocalDate.now()); // Automatiza a data de cadastro
        produto.setAtivo(true);              // Garante que nasce ativo
        Produto novoProduto = repository.save(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);
    }

        // Nova rota PUT: Atualiza o preço por KG de um produto existente
        @PutMapping("/alterar-preco/{id}")
    public ResponseEntity<Produto> alterarPreco(@PathVariable Long id, @RequestBody Produto produtoDadosAtualizados) {
        return repository.findById(id).map(produtoExistente -> {
            // Atualiza o valor por KG usando o getter/setter do seu Model
            produtoExistente.setValorporkg(produtoDadosAtualizados.getValorporkg());
            
            Produto produtoSalvo = repository.save(produtoExistente);
            return ResponseEntity.ok(produtoSalvo);
        }).orElse(ResponseEntity.notFound().build());
    }
}