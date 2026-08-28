// src/pages/Contribuintes/index.jsx
import axios from "axios";
import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Importa o Axios configurado

export default function Contribuinte() {
  const [nomeContribuinte, setNomeContribuinte] = useState("");
  const [cpfContribuinte, setCpfContribuinte] = useState("");
  const [endContribuinte, setEndContribuinte] = useState("");
  const [docContribuinte, setDocContribuinte] = useState("");
  const admSalvo = localStorage.getItem("@sisRec:adm");
  const usuarioLogado = admSalvo ? JSON.parse(admSalvo) : {};

  const [lista, setLista] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  const ehMaster = usuarioLogado.perfil === "MASTER";

  const carregarContribuintes = async () => {
    try {
      const response = await api.get("/contribuintes");
      setLista(response.data);
    } catch (err) {
      console.error("Erro ao buscar contribuintes:", err);
    }
  };

  useEffect(() => {
    carregarContribuintes();
  }, []);

  const handleCadastro = async (e) => {
    e.preventDefault();
    setMensagem(null);
    setErro(null);

    const novoContribuinte = {
      nomeContribuinte,
      cpfContribuinte,
      endContribuinte,
      docContribuinte,
      ptsContribuinte: 0,
    };

    try {
      await api.post("/contribuintes", novoContribuinte, {
        headers: { "X-Perfil-Usuario": usuarioLogado.perfil },
      });

      setMensagem("Contribuinte cadastrado com sucesso!");
      setNomeContribuinte("");
      setCpfContribuinte("");
      setEndContribuinte("");
      setDocContribuinte("");
      carregarContribuintes();
    } catch (err) {
      console.error(err);
      setErro(
        err.response?.data?.mensagem ||
          "Erro ao salvar contribuinte no servidor.",
      );
    }
  };

  // 🔄 NOVA FUNÇÃO: Altera o status lógico (Ativo/Inativo) via PUT do Axios 🎯
  const handleAlternarStatus = async (id, statusAtual) => {
    setMensagem(null);
    setErro(null);

    try {
      await api.put(
        `/contribuintes/alterar-status/${id}`,
        { ativo: !statusAtual },
        { headers: { "X-Perfil-Usuario": usuarioLogado.perfil } },
      );
      carregarContribuintes(); // Recarrega os dados imediatamente na tabela
    } catch (err) {
      console.error(err);
      setErro("Não foi possível alterar o status do contribuinte.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Gerenciamento de Contribuintes (Ecoponto)</h2>

      {ehMaster ? (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ color: "#2e7d32" }}>
            👑 Novo Cadastro (Restrito a Administradores)
          </h3>
          <form onSubmit={handleCadastro}>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Nome Completo:
              </label>
              <input
                type="text"
                value={nomeContribuinte}
                onChange={(e) => setNomeContribuinte(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                CPF:
              </label>
              <input
                type="text"
                value={cpfContribuinte}
                onChange={(e) => setCpfContribuinte(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Endereço:
              </label>
              <input
                type="text"
                value={endContribuinte}
                onChange={(e) => setEndContribuinte(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Documento (RG/CNH):
              </label>
              <input
                type="text"
                value={docContribuinte}
                onChange={(e) => setDocContribuinte(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 15px",
                backgroundColor: "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Salvar Registro
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
            backgroundColor: "#e8f5e9",
            borderRadius: "6px",
            marginBottom: "30px",
            color: "#2e7d32",
            fontWeight: "500",
          }}
        >
          ⚙️ Modo Operador: Você possui permissão para visualizar e pesquisar
          contribuintes na listagem abaixo.
        </div>
      )}

      {/* Tabela de Visualização */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <h3>Contribuintes Cadastrados no Banco</h3>
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
              <th>Nome</th>
              <th>CPF</th>
              <th>Saldo de Pontos</th>
              {/* 👑 Coluna condicional: Só adiciona a coluna de Ações na tabela se for MASTER */}
              {ehMaster && <th style={{ textAlign: "center" }}>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td
                  colSpan={ehMaster ? "5" : "4"}
                  style={{ textAlign: "center", color: "#666" }}
                >
                  Nenhum contribuinte cadastrado ainda.
                </td>
              </tr>
            ) : (
              lista.map((c) => (
                <tr
                  key={c.codContribuinte}
                  style={{ opacity: c.ativo === false ? 0.6 : 1 }}
                >
                  <td>{c.codContribuinte}</td>
                  <td>
                    {c.nomeContribuinte}{" "}
                    {c.ativo === false && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        (Inativo)
                      </span>
                    )}
                  </td>
                  <td>{c.cpfContribuinte}</td>
                  <td style={{ fontWeight: "bold", color: "#28a745" }}>
                    {c.ptsContribuinte || 0} pts
                  </td>

                  {/* 👑 Botão condicional de Soft Delete: Altera o status com cliques rápidos */}
                  {ehMaster && (
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() =>
                          handleAlternarStatus(c.codContribuinte, c.ativo)
                        }
                        style={{
                          padding: "5px 12px",
                          borderRadius: "4px",
                          border: "none",
                          color: "white",
                          fontWeight: "bold",
                          cursor: "pointer",
                          backgroundColor:
                            c.ativo !== false ? "#4CAF50" : "#d32f2f",
                          width: "85px",
                        }}
                      >
                        {c.ativo !== false ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
