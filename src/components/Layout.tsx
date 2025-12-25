import { Link, Outlet, useLocation } from "react-router-dom";

const theme = {
  primary: "#EC4899",
  soft: "#FBCFE8",
  bg: "#FFF1F7",
  card: "#FFFFFF",
  text: "#111827",
};

function NavLink({ to, label }: { to: string; label: string }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        textDecoration: "none",
        border: `1px solid ${active ? theme.primary : theme.soft}`,
        background: active ? theme.primary : theme.card,
        color: active ? "white" : theme.text,
        fontWeight: 700,
        textAlign: "center",
      }}
    >
      {label}
    </Link>
  );
}

export default function Layout() {
  return (
    <div style={{ minHeight: "100vh", background: theme.bg }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: 20 }}>
        <header style={{ display: "grid", gap: 10, marginBottom: 14 }}>
          <h2 style={{ margin: 0, textAlign: "center", color: theme.primary }}>
            QR 스탬프 이벤트
          </h2>

          <nav style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <NavLink to="/" label="홈" />
            <NavLink to="/places/new" label="가맹점" />
            <NavLink to="/book" label="검증" />
          </nav>
        </header>

        <main
          style={{
            background: theme.card,
            borderRadius: 20,
            padding: 16,
            boxShadow: "0 10px 20px rgba(236,72,153,0.15)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
