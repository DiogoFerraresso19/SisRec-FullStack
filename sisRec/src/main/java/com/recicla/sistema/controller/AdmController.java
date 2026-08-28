package com.recicla.sistema.controller;

import com.recicla.sistema.model.Adm;
import com.recicla.sistema.repository.AdmRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/adms")
@CrossOrigin(origins = "*") // Mantém a liberação de acesso para o React (Vite)
public class AdmController {

    private final AdmRepository repository;
    private final PasswordEncoder passwordEncoder;

    // Injeção de dependências do repositório e do codificador através do construtor
    public AdmController(AdmRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    // Rota GET: http://localhost:8080/api/adms
    @GetMapping
    public ResponseEntity<List<Adm>> listarTodos() {
        List<Adm> lista = repository.findAll();
        return ResponseEntity.ok(lista);
    }

    // Rota POST: http://localhost:8080/api/adms/cadastrar
    @PostMapping("/cadastrar")
    public ResponseEntity<?> salvarNovo(@RequestBody Adm adm, @RequestHeader(value = "X-Perfil-Usuario", required = false) String perfilOperador) {
        // Se quem está cadastrando explicitamente passar o cabeçalho e não for MASTER, bloqueia
        // Nota: deixamos como opcional (required = false) para não quebrar a tela pública de autocadastro caso usem a mesma rota
        if (perfilOperador != null && !"MASTER".equals(perfilOperador)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("mensagem", "Apenas Administradores MASTER podem cadastrar novos usuários com essa permissão."));
        }

        // 🔑 Criptografa a senha recebida em texto limpo antes de salvar no banco
        String senhaCriptografada = passwordEncoder.encode(adm.getSenha());
        adm.setSenha(senhaCriptografada);

        Adm novoAdm = repository.save(adm);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoAdm);
    }

    // Rota POST: http://localhost:8080/api/adms/login
    @PostMapping("/login")
    public ResponseEntity<?> efetuarLogin(@RequestBody Map<String, String> dados) {
        String loginDigitado = dados.get("login");
        String senhaDigitada = dados.get("senha");

        // 🔍 RASTREADOR 1: Mostra o que veio digitado no formulário do React
        System.out.println("====== DIAGNÓSTICO DE LOGIN ======");
        System.out.println("-> LOGIN DO FRONTEND: [" + loginDigitado + "]");
        System.out.println("-> SENHA DO FRONTEND: [" + senhaDigitada + "]");

        // Chama a nossa consulta nativa do repositório
        Optional<Adm> admExistente = repository.findByLogin(loginDigitado);

        // Se o administrador existir no banco
        if (admExistente.isPresent()) {
            Adm adm = admExistente.get();
            
            // 🔍 RASTREADOR 2: Mostra o hash criptografado gravado no Postgres
            System.out.println("-> USUÁRIO ENCONTRADO NO POSTGRES!");
            System.out.println("-> HASH DA SENHA NO POSTGRES: [" + adm.getSenha() + "]");

            // 🔑 Compara a senha em texto limpo com o hash criptografado usando matches()
            if (passwordEncoder.matches(senhaDigitada, adm.getSenha())) {
                System.out.println("-> SUCESSO: As senhas batem criptograficamente! Liberando o sisRec.");
                System.out.println("==================================");
                
                // Opcional: Oculta a senha hash no JSON de resposta por segurança extra
                adm.setSenha(null); 
                return ResponseEntity.ok(adm);
            } else {
                System.out.println("-> ERRO: A senha digitada não bate com o hash criptografado do banco.");
            }
        } else {
            System.out.println("-> ERRO: O login [" + loginDigitado + "] não existe na tabela cadadm.");
        }
        
        System.out.println("==================================");

        // Se falhar (usuário não existe ou senha errada), retorna erro 401 Unauthorized
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("mensagem", "Usuário ou senha inválidos."));
    }

    // Rota POST: http://localhost:8080/api/adms/redefinir-senha
    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody Map<String, String> dados) {
        String loginDigitado = dados.get("login");
        String cpfDigitadoStr = dados.get("cpf");
        String novaSenhaDigitada = dados.get("novaSenha");

        System.out.println("====== SOLICITAÇÃO DE REDEFINIÇÃO ======");
        System.out.println("-> LOGIN: [" + loginDigitado + "]");
        System.out.println("-> CPF RECEBIDO: [" + cpfDigitadoStr + "]");

        // 1. Busca o administrador pelo login na nossa query nativa
        Optional<Adm> admExistente = repository.findByLogin(loginDigitado);

        if (admExistente.isPresent()) {
            Adm adm = admExistente.get();

            // Convertemos o CPF recebido para Long para comparar com o tipo do banco
            try {
                Long cpfDigitado = Long.parseLong(cpfDigitadoStr);

                // 2. Validação de Segurança: O CPF digitado pertence a este Login?
                if (adm.getCpf().equals(cpfDigitado)) {
                    
                    // 3. Criptografa a nova senha com BCrypt antes de persistir
                    String novaSenhaCriptografada = passwordEncoder.encode(novaSenhaDigitada);
                    adm.setSenha(novaSenhaCriptografada);
                    
                    repository.save(adm); // Atualiza o registro no banco
                    
                    System.out.println("-> SUCESSO: Senha do usuário [" + loginDigitado + "] redefinida com sucesso!");
                    System.out.println("========================================");
                    return ResponseEntity.ok(Map.of("mensagem", "Senha alterada com sucesso!"));
                } else {
                    System.out.println("-> ERRO: O CPF digitado não confere com o login.");
                }
            } catch (NumberFormatException e) {
                System.out.println("-> ERRO: Formato de CPF inválido enviado pelo frontend.");
            }
        } else {
            System.out.println("-> ERRO: Usuário [" + loginDigitado + "] não encontrado ou inativo.");
        }

        System.out.println("========================================");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("mensagem", "Dados inválidos. Não foi possível redefinir a senha."));
    }

    // Rota PUT: http://localhost:8080/api/adms/alterar-permissao/{id}
    @PutMapping("/alterar-permissao/{id}")
    public ResponseEntity<?> alterarPermissao(@PathVariable Long id, @RequestBody Map<String, Object> dados) {
        String novoPerfil = (String) dados.get("perfil");
        Boolean novoStatusAtivo = (Boolean) dados.get("ativo");

        System.out.println("====== ALTERAÇÃO DE PERMISSÕES ======");
        System.out.println("-> ALTERANDO ID ADM: [" + id + "]");
        System.out.println("-> NOVO PERFIL: [" + novoPerfil + "]");
        System.out.println("-> ATIVO: [" + novoStatusAtivo + "]");

        return repository.findById(id)
            .map(adm -> {
                // Validações básicas antes de salvar
                if (novoPerfil != null && ("MASTER".equals(novoPerfil) || "OPERADOR".equals(novoPerfil))) {
                    adm.setPerfil(novoPerfil);
                }
                if (novoStatusAtivo != null) {
                    adm.setAtivo(novoStatusAtivo);
                }
                
                repository.save(adm);
                System.out.println("-> SUCESSO: Permissões atualizadas no Postgres!");
                System.out.println("=====================================");
                return ResponseEntity.ok(Map.of("mensagem", "Permissões updated com sucesso!"));
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensagem", "Administrador não encontrado.")));
    }
}
