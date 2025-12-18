import { store } from "../lib/store"
import { Link } from "react-router-dom"

export default function Home() {
  const places = store.getPlaces()
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">맛집 스탬프</h1>
      <Link to="/places/new" className="text-blue-600">+ 맛집 추가</Link>
      <ul className="space-y-2">
        {places.map(p => (
          <li key={p.id} className="border p-3 rounded">
            <Link to={`/places/${p.id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
