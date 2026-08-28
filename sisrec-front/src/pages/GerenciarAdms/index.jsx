import React, { useEffect, useState } from "react";
import axios from "axios";

const GerenciarAdms = () => {
  const [adms, setAdms] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Busca todos os administradores cadastrados ao carregar a página
  const carregarAdms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/adms");
      setAdms(response.data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar a lista de administradores.");
    }
  };

  useEffect(() => {
    carregarAdms();
  }, []);

  // Envia as alterações de perfil ou status ativo ao backend
  const handleAlterar = async (
    id,
    perfilAtual,
    statusAtivoAtual,
    campoAlterado,
    novoValor,
  ) => {
    setError("");
    setSuccess("");

    // Monta o payload mantendo os valores antigos se não sofrerem alteração
    const payload = {
      perfil: campoAlterado === "perfil" ? novoValor : perfilAtual,
      ativo: campoAlterado === "ativo" ? novoValor : statusAtivoAtual,
    };

    try {
      await axios.put(
        `http://localhost:8080/api/adms/alterar-permissao/${id}`,
        payload,
      );
      setSuccess("Permissões atualizadas com sucesso!");
      carregarAdms(); // Recarrega a tabela para refletir os novos dados
    } catch (err) {
      console.error(err);
      setError("Falha ao salvar as alterações no servidor.");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h2>👑 Gerenciamento de Permissões (Administradores)</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Apenas administradores MASTER têm acesso a esta visualização de
        controle.
      </p>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", fontWeight: "bold" }}>{success}</p>
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#2e7d32",
              color: "white",
              textAlign: "left",
            }}
          >
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>ID</th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Nome</th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>
              Usuário (Login)
            </th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>
              Nível de Acesso (Perfil)
            </th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>
              Status da Conta
            </th>
          </tr>
        </thead>
        <tbody>
          {adms.map((adm) => (
            <tr
              key={adm.codadm}
              style={{
                backgroundColor: "#fff",
                borderBottom: "1px solid #ddd",
              }}
            >
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {adm.codadm}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {adm.nome}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {adm.login}
              </td>

              {/* Seleção do Perfil/Permissão */}
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                <select
                  value={adm.perfil}
                  onChange={(e) =>
                    handleAlterar(
                      adm.codadm,
                      adm.perfil,
                      adm.ativo,
                      "perfil",
                      e.target.value,
                    )
                  }
                  style={{ padding: "5px", width: "100%", borderRadius: "4px" }}
                >
                  <option value="OPERADOR">⚙️ OPERADOR</option>
                  <option value="MASTER">👑 MASTER</option>
                </select>
              </td>

              {/* Botão liga/desliga para Ativar ou Inativar a conta (Soft Delete) */}
              <td
                style={{
                  padding: "12px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() =>
                    handleAlterar(
                      adm.codadm,
                      adm.perfil,
                      adm.ativo,
                      "ativo",
                      !adm.ativo,
                    )
                  }
                  style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "none",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                    backgroundColor: adm.ativo ? "#4CAF50" : "#d32f2f",
                    width: "100px",
                  }}
                >
                  {adm.ativo ? "Ativo" : "Inativo"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GerenciarAdms;
