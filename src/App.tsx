import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

/* ================= 핑크 테마 ================= */
const theme = {
  primary: "#EC4899",
  soft: "#FBCFE8",
  bg: "#FFF1F7",
  card: "#FFFFFF",
  text: "#111827",
  gray: "#6B7280",
};

/* ================= 타입 ================= */
type PlaceCategory = "맛집" | "카페";

type Place = {
  id: string;
  name: string;
  address: string;
  category: PlaceCategory;
  qrCode: string;
};

type StampEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  rule: { requiredCount: number };
  places: Place[];
};

type UserProgress = {
  eventId: string;
  stampedPlaceIds: string[];
};

/* ================= 유틸 ================= */
const STORAGE_EVENTS = "stamp-events-pink";
const STORAGE_PROGRESS = "stamp-progress-pink";

const newId = (p: string) =>
  `${p}-${Math.random().toString(36).slice(2, 9)}`;

const newQr = () =>
  `QR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/* ================= 초기 이벤트 ================= */
const seedEvents: StampEvent[] = [
  {
    id: newId("evt"),
    title: "핑크 스탬프 이벤트",
    startDate: "2025-12-31",
    endDate: "2026-03-31",
    rule: { requiredCount: 10 },
    places: [],
  },
];

/* ================= 스탬프 보드 ================= */
function PinkStampBoard({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <div
      style={{
        background: theme.card,
        padding: 20,
        borderRadius: 20,
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 14,
        boxShadow: "0 10px 20px rgba(236,72,153,0.15)",
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: i < current ? theme.primary : theme.soft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {i < current ? "💖" : ""}
        </div>
      ))}
    </div>
  );
}

/* ================= 쿠폰 카드 ================= */
function CouponCard({ title }: { title: string }) {
  return (
    <div
      style={{
        background: theme.card,
        borderRadius: 20,
        padding: 24,
        textAlign: "center",
        boxShadow: "0 12px 30px rgba(236,72,153,0.25)",
      }}
    >
      <h2 style={{ color: theme.primary, marginBottom: 8 }}>
        🎉 쿠폰 획득!
      </h2>

      <p style={{ marginBottom: 16 }}>{title}</p>

      <div
        style={{
          border: `2px dashed ${theme.primary}`,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 14, color: theme.gray }}>
          무료 음료 1잔
        </div>
        <div style={{ fontSize: 22, fontWeight: "bold" }}>
          COUPON-2025
        </div>
      </div>

      <p style={{ fontSize: 12, color: theme.gray }}>
        직원에게 이 화면을 보여주세요
      </p>
    </div>
  );
}

/* ================= App ================= */
export default function App() {
  const [events, setEvents] = useState<StampEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_EVENTS);
    return saved ? JSON.parse(saved) : seedEvents;
  });

  const [progress, setProgress] = useState<UserProgress[]>(() => {
    const saved = localStorage.getItem(STORAGE_PROGRESS);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(progress));
  }, [progress]);

  const [tab, setTab] = useState<"관리자" | "유저">("관리자");
  const selectedEvent = events[0];

  /* ---------- 관리자 ---------- */
  const [placeForm, setPlaceForm] = useState({
    name: "",
    address: "",
    category: "맛집" as PlaceCategory,
  });

  const addPlace = () => {
    if (!placeForm.name || !placeForm.address) return;

    const place: Place = {
      id: newId("pl"),
      qrCode: newQr(),
      ...placeForm,
    };

    setEvents((prev) =>
      prev.map((e) =>
        e.id === selectedEvent.id
          ? { ...e, places: [...e.places, place] }
          : e
      )
    );

    setPlaceForm({ name: "", address: "", category: "맛집" });
  };

  /* ---------- 유저 ---------- */
  const [qrInput, setQrInput] = useState("");

  const stampByQr = () => {
    const place = selectedEvent.places.find(
      (p) => p.qrCode === qrInput.trim()
    );
    if (!place) return alert("유효하지 않은 QR 코드");

    setProgress((prev) => {
      const cur =
        prev.find((p) => p.eventId === selectedEvent.id) ??
        { eventId: selectedEvent.id, stampedPlaceIds: [] };

      if (cur.stampedPlaceIds.includes(place.id)) {
        alert("이미 스탬프 완료");
        return prev;
      }

      return [
        ...prev.filter((p) => p.eventId !== selectedEvent.id),
        {
          ...cur,
          stampedPlaceIds: [...cur.stampedPlaceIds, place.id],
        },
      ];
    });

    setQrInput("");
  };

  const userStamped =
    progress.find((p) => p.eventId === selectedEvent.id)
      ?.stampedPlaceIds.length ?? 0;

  const isCompleted =
    userStamped >= selectedEvent.rule.requiredCount;

  /* ================= UI ================= */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        padding: 20,
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", color: theme.primary }}>
        QR 스탬프 이벤트
      </h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setTab("관리자")}>관리자</button>
        <button onClick={() => setTab("유저")}>유저</button>
      </div>

      {tab === "관리자" && (
        <>
          <h3>가맹점 추가</h3>
          <input
            placeholder="이름"
            value={placeForm.name}
            onChange={(e) =>
              setPlaceForm({ ...placeForm, name: e.target.value })
            }
          />
          <input
            placeholder="주소"
            value={placeForm.address}
            onChange={(e) =>
              setPlaceForm({ ...placeForm, address: e.target.value })
            }
          />
          <button onClick={addPlace}>추가</button>

          {selectedEvent.places.map((p) => (
            <div
              key={p.id}
              style={{
                background: theme.card,
                borderRadius: 16,
                padding: 16,
                marginTop: 12,
                display: "flex",
                gap: 12,
                boxShadow: "0 6px 12px rgba(0,0,0,0.05)",
              }}
            >
              <QRCodeCanvas value={p.qrCode} size={80} />
              <div>
                <b>{p.name}</b>
                <div style={{ fontSize: 13, color: theme.gray }}>
                  {p.address}
                </div>
                <div style={{ fontSize: 12, color: theme.primary }}>
                  {p.qrCode}
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "유저" && (
        <>
          {!isCompleted ? (
            <>
              <p style={{ textAlign: "center" }}>
                {userStamped} / {selectedEvent.rule.requiredCount}
              </p>

              <PinkStampBoard
                total={selectedEvent.rule.requiredCount}
                current={userStamped}
              />

              <input
                placeholder="QR 코드 입력"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                style={{ marginTop: 16 }}
              />
              <button onClick={stampByQr}>스탬프 찍기</button>
            </>
          ) : (
            <CouponCard title={selectedEvent.title} />
          )}
        </>
      )}
    </div>
  );
}
