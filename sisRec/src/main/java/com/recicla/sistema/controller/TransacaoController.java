package com.recicla.sistema.controller;

import com.recicla.sistema.model.*;
import com.recicla.sistema.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transacoes")
@CrossOrigin(origins = "*")
public class TransacaoController {

    private final TransacaoRepository repository;
    private final ContribuinteRepository contribuinteRepository;
    private final ProdutoRepository produtoRepository;
    private final MovimentacaoRepository movimentacaoRepository;
    private final AdmRepository admRepository; // INJETADO PARA AUDITORIA

    // Construtor unificado injetando todas as dependências necessárias
    public TransacaoController(TransacaoRepository repository, 
                               ContribuinteRepository contribuinteRepository, 
                               ProdutoRepository produtoRepository, 
                               MovimentacaoRepository movimentacaoRepository,
                               AdmRepository admRepository) {
        this.repository = repository;
        this.contribuinteRepository = contribuinteRepository;
        this.produtoRepository = produtoRepository;
        this.movimentacaoRepository = movimentacaoRepository;
        this.admRepository = admRepository;
    }

    // 🔍 ROTA GET PADRÃO: Lista todas as transações cadastradas no banco de dados
    @GetMapping
    public ResponseEntity<List<Transacao>> listarTodos() {
        List<Transacao> lista = repository.findAll();
        return ResponseEntity.ok(lista);
    }

    // 🚀 ROTA INTELIGENTE E BLINDADA: Processa pesagem e amarra o ID do administrador operador
    @PostMapping("/pesar")
    public ResponseEntity<?> realizarReciclagem(@RequestBody OperacaoRequest request) {
        try {
            // 0. Validação de Auditoria: Verifica se o Administrador Operador foi enviado e existe
            if (request.getIdAdm() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("mensagem", "O ID do administrador operador é obrigatório para auditoria."));
            }
            
            // Busca o administrador usando o método nativo findById
            Adm administrador = admRepository.findById(Long.valueOf(request.getIdAdm().toString()))
                    .orElse(null);
                    
            if (administrador == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("mensagem", "Administrador operador não encontrado ou inativo no Ecoponto."));
            }

            // 1. Valida se o Contribuinte existe no banco
            if (request.getCodContribuinte() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensagem", "ID do contribuinte inválido."));
            }
            Contribuinte contribuinte = contribuinteRepository.findById(Long.valueOf(request.getCodContribuinte().toString()))
                    .orElse(null);
            if (contribuinte == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("mensagem", "Contribuinte não encontrado."));
            }

            // 🛡️ BLINDAGEM COMPLETA: Bloqueia se o status do Contribuinte for explicitamente igual a FALSE (Inativo)
            if (Boolean.FALSE.equals(contribuinte.getAtivo())) {
                System.out.println("-> BLOQUEIO SEGURO: Contribuinte ID [" + contribuinte.getCodContribuinte() + "] está INATIVO.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("mensagem", "Operação Recusada! Este contribuinte está INATIVO no sistema e não pode realizar transações."));
            }

            // 2. Valida se o Produto existe no banco
            if (request.getCodProduto() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensagem", "ID do produto inválido."));
            }
            Produto produto = produtoRepository.findById(Long.valueOf(request.getCodProduto()))
                    .orElse(null);
            if (produto == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("mensagem", "Produto não encontrado."));
            }

            // Segurança Preventiva: Valores numéricos padrão contra nulos
            BigDecimal ptsProduto = produto.getPtstotais() != null ? produto.getPtstotais() : BigDecimal.ZERO;
            BigDecimal valorProduto = produto.getValorporkg() != null ? produto.getValorporkg() : BigDecimal.ZERO;
            BigDecimal pesoDigitado = request.getPesoKg() != null ? request.getPesoKg() : BigDecimal.ZERO;

            // 3. Regra Matemática da Balança
            BigDecimal pontosCalculados = pesoDigitado.multiply(ptsProduto);
            BigDecimal valorFinanceiro = pesoDigitado.multiply(valorProduto);

            // 4. Atualiza a carteira digital de pontos do Contribuinte
            int pontosAtuais = contribuinte.getPtsContribuinte() != null ? contribuinte.getPtsContribuinte() : 0;
            contribuinte.setPtsContribuinte(pontosAtuais + pontosCalculados.intValue());
            contribuinteRepository.save(contribuinte);

            // 5. REGISTRO NA TABELA DE TRANSAÇÕES - VINCULANDO O ADM PARA CUMPRIR O NOT-NULL 🛡️
            Transacao transacao = new Transacao();
            
            // Injeta o Objeto Administrador completo para sanar a restrição física id_adm do Postgres
            transacao.setAdministrador(administrador);

            if (contribuinte.getCodContribuinte() != null) {
                transacao.setIdContribuinte(contribuinte.getCodContribuinte().intValue());
            }
            
            if (produto.getCodProduto() != null) {
                transacao.setIdProduto(produto.getCodProduto().intValue());
            }
            
            transacao.setTipoProduto(produto.getTipoProduto());
            transacao.setPesoMedido(pesoDigitado.doubleValue());
            transacao.setPontosGerados(pontosCalculados.intValue()); 
            transacao.setValorGerado(valorFinanceiro.doubleValue());
            transacao.setDataTransacao(LocalDateTime.now());
            
            Transacao transacaoSalva = repository.save(transacao);

            // 6. Alimenta o extrato global do Administrador (consultamov)
            Movimentacao movimentacao = new Movimentacao();
            movimentacao.setCodContribuinte(contribuinte.getCodContribuinte());
            movimentacao.setNomeContribuinte(contribuinte.getNomeContribuinte());
            movimentacao.setTipoProduto(produto.getTipoProduto());
            movimentacao.setValorTransacao(valorFinanceiro);
            movimentacao.setPtsTotais(pontosCalculados);
            movimentacao.setDataTransacao(java.time.LocalDate.now());
            movimentacao.setSaldomov(BigDecimal.valueOf(contribuinte.getPtsContribuinte()));
            
            movimentacaoRepository.save(movimentacao);

            return ResponseEntity.status(HttpStatus.CREATED).body(transacaoSalva);
            
        } catch (Exception e) {
            // 🎯 CORRIGIDO CIRURGICAMENTE: Ajustado de System.error.println para System.err.println
            System.err.println("-> ERRO CRÍTICO NA BALANÇA: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("mensagem", "Erro interno ao salvar transação: " + e.getMessage()));
        }
    }
}
