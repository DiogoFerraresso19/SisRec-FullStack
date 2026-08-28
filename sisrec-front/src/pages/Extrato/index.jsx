// src/pages/Extrato/index.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function Extrato() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarMovimentacoes();
  }, []);

  const carregarMovimentacoes = async () => {
    try {
      setCarregando(true);
      const response = await api.get("/movimentacoes");
      setMovimentacoes(response.data);
    } catch (err) {
      console.error("Erro ao buscar histórico de movimentações:", err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topo}>
        <h2 style={styles.titulo}>
          📊 Painel do Extrato Global de Movimentações
        </h2>
        <button onClick={carregarMovimentacoes} style={styles.btnAtualizar}>
          🔄 Atualizar Dados
        </button>
      </div>

      {carregando ? (
        <p style={styles.aviso}>Carregando histórico de auditoria...</p>
      ) : movimentacoes.length === 0 ? (
        <div style={styles.cardVazio}>
          📭 Nenhuma pesagem ou transação foi registrada no banco de dados até o
          momento.
        </div>
      ) : (
        <div style={styles.tabelaContainer}>
          <table style={styles.tabela}>
            <thead>
              <tr style={styles.topoTabela}>
                <th style={styles.th}>Cód. Consulta</th>
                <th style={styles.th}>Contribuinte</th>
                <th style={styles.th}>Material</th>
                <th style={styles.th}>Valor Pago</th>
                <th style={styles.th}>Pontos Ganhos</th>
                <th style={styles.th}>Saldo Acumulado</th>
                <th style={styles.th}>Data Operação</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((m) => {
                const valor = parseFloat(m.valorTransacao) || 0;
                const pontos = parseFloat(m.ptsTotais) || 0;
                const saldo = parseFloat(m.saldomov) || 0;

                return (
                  <tr key={m.codConsulta} style={styles.linha}>
                    <td style={styles.td}>#{m.codConsulta}</td>
                    <td style={styles.td}>
                      <strong>{m.nomeContribuinte}</strong>
                      <span style={styles.subText}>
                        {" "}
                        (ID: {m.codContribuinte})
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{m.tipoProduto}</span>
                    </td>

                    {/* CORREÇÃO AQUI: Mesclando os estilos com o operador ... */}
                    <td
                      style={{
                        ...styles.td,
                        color: "#2e7d32",
                        fontWeight: "bold",
                      }}
                    >
                      R$ {valor.toFixed(2)}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        color: "#1565c0",
                        fontWeight: "bold",
                      }}
                    >
                      +{pontos.toFixed(0)} pts
                    </td>
                    <td style={{ ...styles.td, fontWeight: "500" }}>
                      {saldo.toFixed(0)} pts
                    </td>

                    <td style={styles.td}>{m.dataTransacao}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  },
  topo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  titulo: {
    color: "#2e7d32",
    margin: 0,
  },
  btnAtualizar: {
    padding: "8px 16px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  aviso: {
    textAlign: "center",
    color: "#666",
    fontSize: "1.1rem",
  },
  cardVazio: {
    padding: "30px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
    color: "#555",
    fontWeight: "500",
  },

  // FIX VISUAL: Container com rolagem lateral caso a tela seja pequena, e sombra elegante
  tabelaContainer: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    overflowX: "auto", // Cria barra de rolagem lateral se a tela diminuir
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },

  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  topoTabela: {
    backgroundColor: "#2e7d32",
    color: "white",
  },
  th: {
    padding: "14px 15px",
    fontWeight: "bold",
    fontSize: "0.95rem",
  },
  td: {
    padding: "14px 15px",
    borderBottom: "1px solid #eee",
    fontSize: "0.95rem",
    verticalAlign: "middle",
  },
  linha: {
    transition: "background-color 0.2s",
    backgroundColor: "#fff",
  },
  badge: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    padding: "4px 10px",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "0.85rem",
    display: "inline-block",
  },
  subText: {
    color: "#777",
    fontSize: "0.85rem",
  },
};
