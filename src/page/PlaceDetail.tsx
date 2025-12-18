import { useParams, Link } from "react-router-dom"

export default function PlaceDetail() {
  const { id } = useParams()

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>맛집 상세</h1>
      <div style={{ opacity: 0.85 }}>placeId: {id}</div>

      <div style={{ display: "flex", gap: 10 }}>
        <Link
          to="/"
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #333", color: "#ddd", textDecoration: "none" }}
        >
          ← 목록
        </Link>
        <Link
          to="/book"
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #333", color: "#ddd", textDecoration: "none" }}
        >
          스탬프북
        </Link>
      </div>

      <div style={{ borderTop: "1px solid #333", paddingTop: 12, opacity: 0.85 }}>
        다음 단계에서 “스탬프 찍기(방문 기록)” UI 붙입니다.
      </div>
    </div>
  )
}
