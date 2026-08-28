package com.recicla.sistema.model; // Define a "pasta" ou pacote onde esta classe está guardada no projeto

// Importações de ferramentas do Java e do Spring Boot necessárias para o código funcionar
import jakarta.persistence.*; // Traz as anotações que conectam a classe ao Banco de Dados (como @Entity, @Table, @Column)
import lombok.Data;          // Traz o Lombok, que cria automaticamente os Getters, Setters e construtores nos bastidores
import java.math.BigDecimal; // Tipo de dado ideal para dinheiro/pontos, pois evita erros de arredondamento matemático
import java.time.LocalDate;  // Tipo de dado para trabalhar com datas (ano, mês e dia) sem guardar o horário

@Entity // Avisa ao Spring Boot que esta classe é uma Entidade (representa uma tabela do banco de dados)
@Table(name = "consultamov") // Diz ao Hibernate qual é o nome exato da tabela física lá no PostgreSQL
@Data // Magia do Lombok: Cria em tempo de compilação todos os métodos get(), set() e toString() para você não ter que digitar
public class Movimentacao {

    @Id // Avisa ao banco de dados que este atributo abaixo é a Chave Primária (o ID único da linha)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Diz que o ID é gerado automaticamente pelo banco (estilo o SERIAL ou AUTO_INCREMENT)
    @Column(name = "codconsulta") // Mapeia o atributo java para o nome exato da coluna física na tabela do Postgres
    private Long codConsulta; // Guarda o número identificador de cada movimentação (ex: 1, 2, 3...)

    @Column(name = "codcontribuinte") // Vincula este campo à coluna 'cod_contribuinte' do banco
    private Long codContribuinte; // Guarda o número do ID do cliente que está reciclando naquele momento

    @Column(name = "nome_contribuinte") // Vincula este campo à coluna de texto que armazena nomes no banco
    private String nomeContribuinte; // Guarda o nome completo do cidadão/contribuinte (ex: "Contribuinte UM da Silva")

    @Column(name = "tipo_produto") // Vincula este campo à coluna que identifica o material no banco
    private String tipoProduto; // Guarda a categoria do material reciclado (ex: "Lata", "Plástico", "Vidro")

    @Column(name = "valor_transacao") // Vincula este campo à coluna financeira correspondente no banco
    private BigDecimal valorTransacao; // Guarda o valor em dinheiro pago ao cliente pelo material (ex: 75.50)

    @Column(name = "pts_totais") // Vincula este campo à coluna que armazena os pontos gerados
    private BigDecimal ptsTotais; // Guarda a pontuação que o cliente ganhou com essa pesagem específica

    @Column(name = "datatransacao") // Vincula este campo à coluna que armazena o dia da operação
    private LocalDate dataTransacao; // Guarda o dia exato em que a reciclagem aconteceu (ex: 2026-08-25)

    @Column(name = "saldomov") // Vincula este campo à coluna de extrato de saldo acumulado no banco
    private BigDecimal saldomov; // Guarda o saldo final total de pontos que o cliente ficou na carteira após essa operação
}