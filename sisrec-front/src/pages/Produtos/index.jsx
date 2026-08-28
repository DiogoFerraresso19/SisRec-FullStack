// src/pages/Produtos/index.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function Produtos() {
  // Estados para o formulário baseados nas colunas do banco
  const [tipoProduto, setTipoProduto] = useState("");
  const [pesounidade, setPesounidade] = useState("");
  const [pesokg, setPesokg] = useState("");
  const [valorporkg, setValorporkg] = useState("");
  const [ptstotais, setPtstotais] = useState("");

  // Estados para listagem e controle
  const [lista, setLista] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  // RBAC: Lê as permissões do administrador logado no localStorage
  const admLogado = JSON.parse(localStorage.getItem("@sisRec:adm") || "{}");
  const ehMaster = admLogado.perfil === "MASTER";

  // 1. ROTA GET: Carrega todos os produtos recicláveis ativos cadastrados
  const carregarProdutos = async () => {
    try {
      const response = await api.get("/produtos");
      setLista(response.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // 2. ROTA POST: Envia o novo produto para o Spring Boot
  const handleCadastro = async (e) => {
    e.preventDefault();
    if (!ehMaster) return; // Trava de segurança no Front

    setMensagem(null);
    setErro(null);

    // DTO alinhado com o Model Java e colunas do Postgres
    const novoProduto = {
      tipoProduto,
      pesounidade: parseFloat(pesounidade),
      pesokg: parseFloat(pesokg),
      valorporkg: parseFloat(valorporkg),
      ptstotais: parseFloat(ptstotais),
    };

    try {
      // Ajustado para a rota correta mapeada no seu ProdutoController
      await api.post("/produtos/cadastrar", novoProduto);
      setMensagem("Produto cadastrado com sucesso!");

      // Limpa os campos
      setTipoProduto("");
      setPesounidade("");
      setPesokg("");
      setValorporkg("");
      setPtstotais("");
      carregarProdutos();
    } catch (err) {
      setErro("Erro ao salvar produto no servidor.");
    }
  };

  const handleEditarPreco = async (id, precoAtual) => {
    if (!ehMaster) return;

    // Abre uma caixinha no navegador perguntando o novo preço
    const novoPreco = prompt(
      `Digite o novo valor por KG (Preço atual: R$ ${precoAtual.toFixed(2)}):`,
      precoAtual,
    );

    // Se o usuário cancelou ou não digitou nada, interrompe
    if (novoPreco === null || novoPreco.trim() === "") return;

    const precoFormatado = parseFloat(novoPreco);
    if (isNaN(precoFormatado) || precoFormatado < 0) {
      alert("Por favor, digite um valor numérico válido e maior que zero.");
      return;
    }

    try {
      // Consome o novo endpoint do Spring Boot
      await api.put(`/produtos/alterar-preco/${id}`, {
        valorporkg: precoFormatado,
      });
      setMensagem("Preço atualizado com sucesso!");
      carregarProdutos(); // Recarrega a tabela com o preço novo
    } catch (err) {
      console.error("Erro ao atualizar preço:", err);
      setErro("Não foi possível atualizar o preço no servidor.");
    }
  };

  // 3. ROTA PUT: Efetua a inativação lógica (Soft Delete) no banco
  const handleInativar = async (id) => {
    if (!ehMaster) return;
    try {
      await api.put(`/produtos/inativar/${id}`);
      carregarProdutos(); // Recarrega a lista sem o produto inativado
    } catch (err) {
      console.error("Erro ao inativar produto:", err);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>📦 Gerenciamento de Produtos (Recicláveis)</h2>

      {/* Formulário condicional: Apenas MASTER cadastra */}
      {ehMaster ? (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
            backgroundColor: "#fff",
          }}
        >
          <h3>Novo Material</h3>
          <form onSubmit={handleCadastro}>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Tipo de Produto (ex: PET, Alumínio, Papelão):
              </label>
              <input
                type="text"
                value={tipoProduto}
                onChange={(e) => setTipoProduto(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Peso Unidade:
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={pesounidade}
                  onChange={(e) => setPesounidade(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Peso KG Padrão:
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={pesokg}
                  onChange={(e) => setPesokg(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Valor por KG (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={valorporkg}
                  onChange={(e) => setValorporkg(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Pontos por KG:
                </label>
                <input
                  type="number"
                  step="1"
                  value={ptstotais}
                  onChange={(e) => setPtstotais(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 15px",
                backgroundColor: "#2e7d32", // Verde Ecoponto
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Salvar Material
            </button>
          </form>
          {mensagem && (
            <p
              style={{ color: "green", marginTop: "10px", fontWeight: "bold" }}
            >
              {mensagem}
            </p>
          )}
          {erro && (
            <p style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
              {erro}
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#fff3e0",
            color: "#e65100",
            borderRadius: "6px",
            marginBottom: "30px",
            fontWeight: "bold",
            border: "1px solid #ffe0b2",
          }}
        >
          ⚠️ Apenas Administradores MASTER podem cadastrar ou inativar materiais
          da Tabela de Preços.
        </div>
      )}

      {/* Tabela */}
      <div>
        <h3>Materiais Configurados no Banco</h3>
        <table
          border="1"
          cellPadding="8"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            backgroundColor: "#fff",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th>ID (Código)</th>
              <th>Tipo</th>
              <th>Valor/KG</th>
              <th>Pts/KG</th>
              {ehMaster && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td
                  colSpan={ehMaster ? "5" : "4"}
                  style={{ textAlign: "center", color: "#666" }}
                >
                  Nenhum produto ativo configurado ainda.
                </td>
              </tr>
            ) : (
              lista.map((p) => {
                // Garante conversão segura para evitar erros de renderização com .toFixed
                const precoNumerico = parseFloat(p.valorporkg) || 0;

                return (
                  <tr key={p.codProduto}>
                    <td>{p.codProduto}</td>
                    <td>{p.tipoProduto}</td>
                    <td>R$ {precoNumerico.toFixed(2)}</td>
                    <td style={{ fontWeight: "bold", color: "#2e7d32" }}>
                      {p.ptstotais} pts
                    </td>
                    {ehMaster && (
                      <td>
                        {/* BOTÃO DE EDITAR PREÇO CONECTADO À SUA FUNÇÃO */}
                        <button
                          onClick={() =>
                            handleEditarPreco(p.codProduto, precoNumerico)
                          }
                          style={{
                            backgroundColor: "#f57c00", // Cor laranja para diferenciar
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            marginRight: "8px",
                          }}
                        >
                          Editar Preço
                        </button>

                        <button
                          onClick={() => handleInativar(p.codProduto)}
                          style={{
                            backgroundColor: "#d32f2f",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          Inativar
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
