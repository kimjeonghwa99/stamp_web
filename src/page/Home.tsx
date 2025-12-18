import { Link } from "react-router-dom"

export default function Home() {
  // 임시 더미 (다음 단계에서 localStorage로 교체)
  const demo = [
    { id: "p1", name: "을지로 국수집", address: "서울 중구..." },
    { id: "p2", name: "성수 수제버거", address: "서울 성동구..." },
  ]

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>홈</h1>
      <p style={{ margin: 0, opacity: 0.85 }}>맛집 목록(임시 더미)</p>

      <div style={{ display: "grid", gap: 10 }}>
        {demo.map((p) => (
          <Link
            key={p.id}
            to={`/places/${p.id}`}
            style={{
              display: "block",
              padding: 12,
              borderRadius: 14,
              border: "1px solid #333",
              color: "#ddd",
              textDecoration: "none",
            }}
          >
            <div style={{ fontWeight: 700 }}>{p.name}</div>
            <div style={{ opacity: 0.8, fontSize: 13 }}>{p.address}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
