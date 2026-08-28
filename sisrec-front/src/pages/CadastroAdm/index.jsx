import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { z } from "zod";

// Função matemática para validar o algoritmo real do CPF (Receita Federal)
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

// 1. Definição do Schema de Validação
const cadastroSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  cpf: z
    .string()
    .length(11, "O CPF deve conter exatamente 11 dígitos")
    .regex(/^\d+$/, "O CPF deve conter apenas números")
    .refine((val) => validarCPF(val), {
      message: "CPF inválido ou inexistente",
    }),
  email: z.string().email("Insira um endereço de e-mail válido"),
  endereco: z.string().min(5, "O endereço deve conter mais detalhes"),
  login: z.string().min(4, "O login deve ter no mínimo 4 caracteres"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

const CadastroAdm = () => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccess("");

    const dadosFormulario = {
      nome: nome.trim(),
      cpf: cpf.trim(),
      email: email.trim(),
      endereco: endereco.trim(),
      login: login.trim(),
      senha: senha,
    };

    const resultado = cadastroSchema.safeParse(dadosFormulario);

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
      const payload = {
        ...resultado.data,
        cpf: parseInt(resultado.data.cpf, 10),
      };

      await axios.post("http://localhost:8080/api/adms/cadastrar", payload);

      setSuccess("Administrador cadastrado com sucesso! Redirecionando...");

      setNome("");
      setCpf("");
      setEmail("");
      setEndereco("");
      setLogin("");
      setSenha("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensagem ||
          "Erro ao realizar o cadastro. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "30px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Novo Administrador</h2>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", fontWeight: "bold" }}>{success}</p>
      )}

      <form onSubmit={handleCadastro}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Nome Completo:
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              if (fieldErrors.nome)
                setFieldErrors({ ...fieldErrors, nome: "" });
            }}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {fieldErrors.nome && (
            <span
              style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}
            >
              {fieldErrors.nome}
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

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            E-mail:
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email)
                setFieldErrors({ ...fieldErrors, email: "" });
            }}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {fieldErrors.email && (
            <span
              style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}
            >
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Endereço:
          </label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => {
              setEndereco(e.target.value);
              if (fieldErrors.endereco)
                setFieldErrors({ ...fieldErrors, endereco: "" });
            }}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {fieldErrors.endereco && (
            <span
              style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}
            >
              {fieldErrors.endereco}
            </span>
          )}
        </div>

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

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Senha:
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              if (fieldErrors.senha)
                setFieldErrors({ ...fieldErrors, senha: "" });
            }}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {fieldErrors.senha && (
            <span
              style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}
            >
              {fieldErrors.senha}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#008CBA",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Processando..." : "Cadastrar"}
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Já possui uma conta? <Link to="/login">Faça Login</Link>
      </p>
    </div>
  );
};

export default CadastroAdm;
