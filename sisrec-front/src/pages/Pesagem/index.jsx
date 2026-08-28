// src/pages/Pesagem/index.jsx
import React, { useState } from "react";
// 🟢 Importamos a biblioteca Axios pura para fazer a chamada direta
import axios from "axios";

export default function Pesagem() {
  const [codContribuinte, setCodContribuinte] = useState("");
  const [codProduto, setCodProduto] = useState("");
  const [pesoKg, setPesoKg] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const handlePesagem = async (e) => {
    e.preventDefault();
    setMensagem(null);
    setErro(null);
    setCarregando(true);

    // 🔑 AUDITORIA: Recupera o administrador logado do seu localStorage padrão
    const admLogado = JSON.parse(localStorage.getItem("@sisRec:adm")) || {};

    // DTO idêntico ao OperacaoRequest que o Spring Boot espera receber no @RequestBody
    const operacaoRequest = {
      codContribuinte: Number(codContribuinte),
      codProduto: Number(codProduto),
      pesoKg: parseFloat(pesoKg),
      idAdm: admLogado.codadm, // 🎯 PROPRIEDADE OBRIGATÓRIA ENVIADA SEGUINDO O CONTRATO DO BACKEND
    };

    try {
      // Dispara a requisição para a rota inteligente do Spring Boot
      const response = await axios.post(
        "http://localhost:8080/api/transacoes/pesar",
        operacaoRequest,
      );

      // 🟢 VALIDAÇÃO BLINDADA: Se o status for 201 (Created) ou 200 (OK), o banco salvou!
      if (response.status === 201 || response.status === 200) {
        // Busca o identificador retornado do registro da transação
        const idTransacao = response.data?.id || "Efetuada";

        setMensagem(
          `Sucesso! Pesagem processada com sucesso no banco. Código da Transação: ${idTransacao}`,
        );

        // Limpa os campos para a próxima pesagem
        setCodContribuinte("");
        setCodProduto("");
        setPesoKg("");
      }
    } catch (err) {
      console.error(err);
      // 🛡️ CAPTURA CIRÚRGICA: Lê a mensagem de bloqueio controlada vinda do Spring Boot (Ex: Contribuinte Inativo)
      if (err.response && err.response.data && err.response.data.mensagem) {
        setErro(err.response.data.mensagem);
      } else if (err.response && typeof err.response.data === "string") {
        setErro(err.response.data);
      } else {
        setErro(
          "Erro ao processar os dados da balança no servidor. Verifique os códigos informados.",
        );
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontFamily: "sans-serif",
        backgroundColor: "#fff",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h2
        style={{ color: "#2e7d32", textAlign: "center", marginBottom: "20px" }}
      >
        ⚖️ Operação Central - Balança Ecoponto
      </h2>

      <form onSubmit={handlePesagem}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Código do Contribuinte (ID):
          </label>
          <input
            type="number"
            value={codContribuinte}
            onChange={(e) => setCodContribuinte(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Código do Produto (ID):
          </label>
          <input
            type="number"
            value={codProduto}
            onChange={(e) => setCodProduto(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Peso Bruto (KG):
          </label>
          <input
            type="number"
            step="0.001"
            value={pesoKg}
            onChange={(e) => setPesoKg(e.target.value)}
            required
            placeholder="0.000"
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            marginTop: "10px",
          }}
        >
          {carregando ? "Processando Pesagem..." : "Confirmar Pesagem"}
        </button>
      </form>

      {mensagem && (
        <div
          style={{
            marginTop: "20px",
            color: "green",
            fontWeight: "bold",
            padding: "10px",
            backgroundColor: "#e8f5e9",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          {mensagem}
        </div>
      )}

      {erro && (
        <div
          style={{
            marginTop: "20px",
            color: "red",
            fontWeight: "bold",
            padding: "10px",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          {erro}
        </div>
      )}
    </div>
  );
}
