import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, papeisPermitidos }) => {
  const navigate = useNavigate();

  // Mantém a sua verificação original de autenticação intacta
  const isAuthenticated =
    localStorage.getItem("@sisRec:token") ||
    localStorage.getItem("@sisRec:adm");

  // Recupera o objeto do administrador para validar o perfil (MASTER/OPERADOR)
  const admSalvo = localStorage.getItem("@sisRec:adm");
  const usuario = admSalvo ? JSON.parse(admSalvo) : null;

  useEffect(() => {
    // 1. Se NÃO estiver autenticado, expulsa imediatamente para a tela de login
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    // 2. Se estiver autenticado, mas a rota exigir um perfil que o usuário NÃO possui
    if (
      papeisPermitidos &&
      usuario &&
      !papeisPermitidos.includes(usuario.perfil)
    ) {
      console.warn(
        `-> BLOQUEIO: O usuário [${usuario.login}] tentou forçar acesso a uma rota restrita.`,
      );

      // Se for um OPERADOR, joga ele para a tela padrão de trabalho (Balança/Pesagem)
      const rotaAlternativa =
        usuario.perfil === "OPERADOR" ? "/pesagem" : "/contribuintes";
      navigate(rotaAlternativa, { replace: true });
    }
  }, [isAuthenticated, navigate, papeisPermitidos, usuario]);

  // Bloqueia a renderização visual caso não passe nos critérios básicos de segurança
  if (!isAuthenticated) {
    return null;
  }

  if (
    papeisPermitidos &&
    usuario &&
    !papeisPermitidos.includes(usuario.perfil)
  ) {
    return null;
  }

  // Se passou em tudo, renderiza a tela normalmente
  return children;
};

export default ProtectedRoute;
