import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/adms/login",
        {
          login: login,
          senha: senha,
        },
      );

      // Se o backend respondeu com sucesso
      if (response.data) {
        const tokenValido =
          response.data.token || response.data.login || "authenticated";

        localStorage.setItem("@sisRec:token", tokenValido);
        localStorage.setItem("@sisRec:adm", JSON.stringify(response.data));

        // 🧠 REDIRECIONAMENTO INTELIGENTE BASEADO NO PERFIL RETORNADO PELO POSTGRES
        const perfilUsuario = response.data.perfil;

        if (perfilUsuario === "OPERADOR") {
          // Operadores vão direto para a tela da balança operar pesagens
          navigate("/pesagem");
        } else {
          // Administradores MASTER vão para a tela de gerenciamento de contribuintes
          navigate("/contribuintes");
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensagem ||
          "Credenciais inválidas ou erro na comunicação.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Acesso do Administrador - sisRec</h2>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Usuário / Login:
          </label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Senha:
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Autenticando..." : "Entrar"}
        </button>
      </form>

      {/* 🔑 ADICIONADO: Link para a nova tela de redefinição de senha segura */}
      <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
        <Link
          to="/redefinir-senha"
          style={{ color: "#008CBA", textDecoration: "none" }}
        >
          Esqueceu sua senha? Redefinir aqui
        </Link>
      </p>

      <p style={{ marginTop: "10px", textAlign: "center", fontSize: "14px" }}>
        Não tem cadastro? <Link to="/cadastrar-adm">Cadastre-se aqui</Link>
      </p>
    </div>
  );
};

export default Login;
