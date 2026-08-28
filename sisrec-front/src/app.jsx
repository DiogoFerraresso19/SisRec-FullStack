// src/App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
} from "react-router-dom";

// Importações das páginas que criamos dentro da pasta 'pages'
import Contribuinte from "./pages/Contribuintes";
import Pesagem from "./pages/Pesagem";
import Produtos from "./pages/Produtos";
import Login from "./pages/Login";
import CadastroAdm from "./pages/CadastroAdm";
import ProtectedRoute from "./components/ProtectedRoute";
import RedefinirSenha from "./pages/RedefinirSenha";
import GerenciarAdms from "./pages/GerenciarAdms";
import Extrato from "./pages/Extrato"; // Nova página importada

/**
 * 🗺️ COMPONENTE DE LAYOUT DO ECOPONTO
 * Agrupa o Menu Superior Verde e gerencia o controle visual de permissões (RBAC).
 */
const EcopontoLayout = () => {
  // Recupera as informações do ADM usando a sua chave padrão do localStorage
  const admSalvo = localStorage.getItem("@sisRec:adm");
  const usuarioLogado = admSalvo ? JSON.parse(admSalvo) : {};

  // Só exibe as abas administrativas se o perfil for MASTER
  const ehMaster = usuarioLogado.perfil === "MASTER";

  return (
    <>
      {/* 🧭 MENU DE NAVEGAÇÃO PRINCIPAL DO ECOPONTO */}
      <nav
        style={{
          padding: "15px 30px",
          backgroundColor: "#2e7d32",
          display: "flex",
          gap: "20px",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1.2rem",
            marginRight: "20px",
          }}
        >
          ♻️ sisRec
        </span>

        {/* Links públicos para qualquer perfil autenticado */}
        <Link
          to="/contribuintes"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: "500",
            padding: "8px 12px",
            borderRadius: "4px",
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        >
          👥 Contribuintes
        </Link>

        <Link
          to="/pesagem"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: "500",
            padding: "8px 12px",
            borderRadius: "4px",
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        >
          ⚖️ Balança (Pesagem)
        </Link>

        {/* 📊 LINK DO EXTRATO: Acessível para Master e Operador auditarem dados */}
        <Link
          to="/extrato"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: "500",
            padding: "8px 12px",
            borderRadius: "4px",
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        >
          📊 Extrato Global
        </Link>

        {/* 🔐 RENDERIZAÇÃO CONDICIONAL: Abas visíveis APENAS para perfil MASTER */}
        {ehMaster && (
          <>
            <Link
              to="/produtos"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: "500",
                padding: "8px 12px",
                borderRadius: "4px",
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              📦 Produtos
            </Link>

            <Link
              to="/gerenciar-adms"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: "500",
                padding: "8px 12px",
                borderRadius: "4px",
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              👑 Permissões
            </Link>
          </>
        )}

        {/* 🚪 BOTÃO DE SAÍDA (LOGOUT) */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          style={{
            marginLeft: "auto",
            color: "#fff",
            backgroundColor: "#d32f2f",
            border: "none",
            padding: "8px 14px",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Sair
        </button>
      </nav>

      {/* 🖥️ ÁREA DE CONTEÚDO DAS TELAS */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          minHeight: "calc(100vh - 70px)",
          paddingBottom: "4px",
        }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 ROTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar-adm" element={<CadastroAdm />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />

        {/* 🔐 ROTAS PROTEGIDAS DO ECOPONTO */}
        <Route
          element={
            <ProtectedRoute>
              <EcopontoLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/contribuintes" element={<Contribuinte />} />
          <Route path="/pesagem" element={<Pesagem />} />

          {/* Nova Rota Protegida do Extrato de Auditoria */}
          <Route path="/extrato" element={<Extrato />} />

          {/* 🛡️ ROTAS BLINDADAS FÍSICAMENTE PARA PERFIL MASTER */}
          <Route
            path="/produtos"
            element={
              <ProtectedRoute papeisPermitidos={["MASTER"]}>
                <Produtos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gerenciar-adms"
            element={
              <ProtectedRoute papeisPermitidos={["MASTER"]}>
                <GerenciarAdms />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Redirecionamento padrão caso a URL não case com nenhuma rota */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
