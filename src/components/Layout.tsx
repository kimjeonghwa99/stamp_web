import { Link, Outlet, useLocation } from "react-router-dom"

function NavLink({ to, label }: { to: string; label: string }) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        textDecoration: "none",
        border: "1px solid #333",
        background: active ? "#333" : "transparent",
        color: active ? "#fff" : "#ddd",
      }}
    >
      {label}
    </Link>
  )
}

export default function Layout() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: 16, color: "#ddd" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <h2 style={{ margin: 0, marginRight: 10 }}>맛집 스탬프</h2>
        <nav style={{ display: "flex", gap: 10 }}>
          <NavLink to="/" label="홈" />
          <NavLink to="/places/new" label="맛집추가" />
          <NavLink to="/book" label="스탬프북" />
        </nav>
      </header>

      <main style={{ border: "1px solid #333", borderRadius: 16, padding: 16 }}>
        <Outlet />
      </main>
    </div>
  )
}
