import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { z } from "zod";

// Reaproveitando a função matemática de validação de CPF real que usamos no cadastro
const validarCPF = (cpf) => {
  const strCPF = cpf.replace(/[^\d]+/g, "");
  if (strCPF.length !== 11 || /^(\d)\1{10}$/.test(strCPF)) return false;
  let soma = 0;
  let resto;
  for (let i = 1; i <= 9; i++)
    soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(strCPF.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma = soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(strCPF.substring(10, 11))) return false;
  return true;
};

// Schema do Zod focado nos critérios de redefinição
const redefinirSchema = z.object({
  login: z.string().min(4, "O nome de usuário deve ter no mínimo 4 caracteres"),
  cpf: z
    .string()
    .length(11, "O CPF deve conter exatamente 11 dígitos")
    .regex(/^\d+$/, "O CPF deve conter apenas números")
    .refine((val) => validarCPF(val), {
      message: "CPF inválido ou inexistente",
    }),
  novaSenha: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
});

const RedefinirSenha = () => {
  const [login, setLogin] = useState("");
  const [cpf, setCpf] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRedefinir = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccess("");

    const dadosFormulario = { login: login.trim(), cpf: cpf.trim(), novaSenha };

    // Validação em tempo de execução com o Zod
    const resultado = redefinirSchema.safeParse(dadosFormulario);

    if (!resultado.success) {
      const errosFormatados = resultado.error.flatten().fieldErrors;
      const errosMapeados = {};
      Object.keys(errosFormatados).forEach((campo) => {
        errosMapeados[campo] = errosFormatados[campo][0];
      });
      setFieldErrors(errosMapeados);
      return;
    }

    setLoading(true);

    try {
      // Dispara o payload validado para a nova rota do Spring Boot
      await axios.post(
        "http://localhost:8080/api/adms/redefinir-senha",
        resultado.data,
      );

      setSuccess("Senha alterada com sucesso! Redirecionando para o login...");
      setLogin("");
      setCpf("");
      setNovaSenha("");

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensagem ||
          "Erro ao redefinir a senha. Verifique as credenciais e tente novamente.",
      );
    } finally {
      setLoading(false);
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
      }}
    >
      <h2>Redefinir Senha</h2>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
        Confirme seu usuário e CPF para cadastrar uma nova senha de acesso.
      </p>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", fontWeight: "bold" }}>{success}</p>
      )}

      <form onSubmit={handleRedefinir}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Nome de Usuário (Login):
          </label>
          <input
            type="text"
            value={login}
            onChange={(e) => {
              setLogin(e.target.value);
              if (fieldErrors.login)
                setFieldErrors({ ...fieldErrors, login: "" });
            }}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {fieldErrors.login && (
            <span
              style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}
            >
              {fieldErrors.login}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            CPF (Apenas números):
          </label>
          <input
            type="text"
            maxLength={11}
            value={cpf}
            onChange={(e) => {
              setCpf(e.target.value);
              if (fieldErrors.cpf) setFieldErrors({ ...fieldErrors, cpf: "" });
            }}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {fieldErrors.cpf && (
            <span
              style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}
            >
              {fieldErrors.cpf}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Nova Senha:
          </label>
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => {
              setNovaSenha(e.target.value);
              if (fieldErrors.novaSenha)
                setFieldErrors({ ...fieldErrors, novaSenha: "" });
            }}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {fieldErrors.novaSenha && (
            <span
              style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}
            >
              {fieldErrors.novaSenha}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#e91e63",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Processando..." : "Alterar Senha"}
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Lembrou a senha? <Link to="/login">Voltar para o Login</Link>
      </p>
    </div>
  );
};

export default RedefinirSenha;
