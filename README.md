# ♻️ sisRec - Sistema de Automação para Ecopontos de Reciclagem

O **sisRec** é uma aplicação Full Stack desenvolvida para gerenciar e automatizar a operação de ecopontos de reciclagem, trocando o material por pontos, esses pontos, os contribuintes poderiam trocar por produtos nos mercados, locais especificos de banheiro e banho, produtos eletronicos, etc... O sistema gerencia o cadastro de contribuintes (clientes), tabelas de preços e pontos de materiais recicláveis, e realiza a operação central de pesagem (balança digital), calculando automaticamente os créditos e pontos ecológicos de forma segura e auditável.

## 🚀 Arquitetura e Tecnologias

O projeto foi construído seguindo o modelo de arquitetura desacoplada (Client-Server), dividida em duas camadas principais:

### Backend (API RESTful)

- **Java 17 & Spring Boot:** Núcleo da aplicação e gerenciamento das regras de negócio.
- **Spring Data JPA:** Abstração da camada de persistência e comunicação com o banco.
- **PostgreSQL:** Banco de dados relacional robusto para armazenamento seguro dos dados.
- **Lombok:** Produtividade no desenvolvimento através da geração automatizada de boilerplate (getters/setters).

### Frontend (Single Page Application)

- **React (Vite):** Framework ágil para construção de interfaces componentizadas de alta performance.
- **React Router Dom:** Gerenciamento de rotas e navegação interna da aplicação.
- **Axios:** Cliente HTTP para consumo assíncrono e integrado dos endpoints da API Java.

---

## 🔒 Funcionalidades Críticas Implementadas

#### 1. Controle de Acesso Baseado em Funções (RBAC)

- **Níveis de Permissão:** Separação física e visual entre os perfis **MASTER** (Administrador) e **OPERADOR** (Funcionário da Balança).
- **Guarda-Costas de Rotas (`ProtectedRoute`):** Barreiras no Frontend que impedem o acesso forçado via URL direta. Caso um OPERADOR tente acessar áreas restritas, ele é interceptado e redirecionado.
- **Menu Dinâmico:** A interface se adapta em tempo real. Abas de alteração de preços e permissões desaparecem para usuários sem o nível MASTER.

### 2. Regras de Negócio e Segurança de Dados

- **Criptografia de Senhas:** Integração de segurança com o hash `BCryptPasswordEncoder` para garantir que nenhuma credencial seja salva em texto limpo no banco.
- **Filtro de Login Blindado:** Consultas nativas que bloqueiam o acesso imediato de administradores inativados no sistema.
- **Soft Delete (Desativação Lógica):** Produtos e contribuintes desativados não são apagados fisicamente do banco de dados (`ativo = false`). Isso garante que dados históricos nunca virem registros "fantasmas", mantendo a integridade dos relatórios.
- **Trava de Segurança na Balança:** O endpoint de pesagem recusa transações no ato caso o contribuinte informado esteja com a conta inativa, retornando um tratamento de erro visual na tela.

### 3. Painel do Extrato Global de Movimentações

- Tela de auditoria em tempo real que consome a tabela `consultamov`. Permite visualizar de forma cronológica quem realizou a pesagem, o material entregue, o valor pago e o saldo acumulado de pontos na carteira digital do cidadão.

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos

- Java JDK 17 ou superior instalado.
- Node.js instalado.
- Banco de Dados PostgreSQL ativo.

### 1. Inicializando o Backend (Java Spring Boot)

1. Certifique-se de que a tabela e as credenciais do PostgreSQL estão configuradas no `application.properties`.
2. Abra o terminal na pasta do backend e execute:

```bash
.\mvnw.cmd spring-boot:run
```

A API inicializará e ficará disponível na porta `http://localhost:8080`.

### 2. Inicializando o Frontend (React + Vite)

1. Abra o terminal na pasta do frontend.
2. Instale as dependências do projeto:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A interface gráfica abrirá no seu navegador através do endereço local fornecido pelo Vite (geralmente porta `5173`).

---

## 🧑‍💻 Autor

Desenvolvido como projeto prático focado em Engenharia de Software Full Stack para composição de portfólio profissional.
