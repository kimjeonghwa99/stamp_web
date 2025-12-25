import { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./Home.css";

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
  qrCode: string; // 매장 QR
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
  couponUsed?: boolean;
  couponToken?: string; // 쿠폰 검증용 QR (eventId 포함)
  couponUsedAtPlaceId?: string;
  couponUsedAtISO?: string;
};

/* ================= 유틸 ================= */
const STORAGE_EVENTS = "stamp-events-pink";
const STORAGE_PROGRESS = "stamp-progress-pink";

const newId = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;
const newQr = () => `QR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const newCouponToken = (eventId: string) =>
  `CPN|${eventId}|${Math.random().toString(36).slice(2, 10).toUpperCase()}-${Date.now()
    .toString(36)
    .toUpperCase()}`;

function parseCouponToken(tokenRaw: string): { eventId: string; raw: string } | null {
  const token = tokenRaw.trim();
  const parts = token.split("|");
  if (parts.length < 3) return null;
  if (parts[0] !== "CPN") return null;
  const eventId = parts[1];
  if (!eventId) return null;
  return { eventId, raw: token };
}

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
function PinkStampBoard({ total, current }: { total: number; current: number }) {
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

/* ================= QR 스캐너(재사용) ================= */
function QrScanner({
  elementId,
  title,
  onScan,
  onClose,
}: {
  elementId: string;
  title: string;
  onScan: (decodedText: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      elementId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [elementId, onScan]);

  return (
    <div
      style={{
        marginTop: 16,
        background: theme.card,
        borderRadius: 16,
        padding: 12,
        boxShadow: "0 10px 20px rgba(236,72,153,0.15)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <b style={{ color: theme.text }}>{title}</b>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: theme.soft,
            borderRadius: 10,
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          닫기
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <div id={elementId} />
      </div>

      <p style={{ marginTop: 10, fontSize: 12, color: theme.gray }}>
        카메라 권한을 허용하고 QR이 중앙에 오도록 맞춰주세요.
      </p>
    </div>
  );
}

/* ================= 쿠폰 카드(유저) ================= */
function CouponCard({
  title,
  used,
  token,
  usedAtPlaceName,
  usedAtISO,
}: {
  title: string;
  used: boolean;
  token: string;
  usedAtPlaceName?: string;
  usedAtISO?: string;
}) {
  return (
    <div
      style={{
        background: theme.card,
        borderRadius: 20,
        padding: 24,
        textAlign: "center",
        boxShadow: "0 12px 30px rgba(236,72,153,0.25)",
        opacity: used ? 0.65 : 1,
      }}
    >
      <h2 style={{ color: theme.primary, marginBottom: 8 }}>
        {used ? "✅ 사용 완료된 쿠폰" : "🎉 쿠폰 획득!"}
      </h2>

      <p style={{ marginBottom: 12 }}>{title}</p>

      <div
        style={{
          border: `2px dashed ${theme.primary}`,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          background: used ? "#F3F4F6" : theme.card,
        }}
      >
        <div style={{ fontSize: 14, color: theme.gray }}>무료 음료 1잔</div>

        <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
          <QRCodeCanvas value={token} size={160} />
        </div>

        <div style={{ marginTop: 10, fontSize: 12, color: theme.gray, wordBreak: "break-all" }}>
          {token}
        </div>
      </div>

      {!used ? (
        <p style={{ fontSize: 12, color: theme.gray }}>
          직원에게 이 화면(QR)을 보여주세요. 직원이 매장 QR 확인 후 사용 처리합니다.
        </p>
      ) : (
        <div style={{ fontSize: 12, color: theme.gray }}>
          <div>이미 사용된 쿠폰입니다.</div>
          {usedAtPlaceName && <div style={{ marginTop: 6 }}>사용 매장: {usedAtPlaceName}</div>}
          {usedAtISO && <div style={{ marginTop: 4 }}>사용 시각: {usedAtISO}</div>}
        </div>
      )}
    </div>
  );
}

/* ================= Home(App) ================= */
export default function Home() {
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
  const [adminView, setAdminView] = useState<"가맹점" | "쿠폰검증">("가맹점");

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
      prev.map((e) => (e.id === selectedEvent.id ? { ...e, places: [...e.places, place] } : e))
    );

    setPlaceForm({ name: "", address: "", category: "맛집" });
  };

  /* ---------- 유저 ---------- */
  const [qrInput, setQrInput] = useState("");
  const [showUserScanner, setShowUserScanner] = useState(false);

  const userProgress = useMemo<UserProgress>(() => {
    return (
      progress.find((p) => p.eventId === selectedEvent.id) ?? {
        eventId: selectedEvent.id,
        stampedPlaceIds: [],
        couponUsed: false,
        couponToken: "",
      }
    );
  }, [progress, selectedEvent.id]);

  const userStamped = userProgress.stampedPlaceIds.length;
  const isCompleted = userStamped >= selectedEvent.rule.requiredCount;

  useEffect(() => {
    if (!isCompleted) return;
    if (userProgress.couponToken) return;

    const token = newCouponToken(selectedEvent.id);

    setProgress((prev) => {
      const cur =
        prev.find((p) => p.eventId === selectedEvent.id) ??
        ({
          eventId: selectedEvent.id,
          stampedPlaceIds: [],
          couponUsed: false,
          couponToken: "",
        } as UserProgress);

      const next: UserProgress = { ...cur, couponToken: token };
      return [...prev.filter((p) => p.eventId !== selectedEvent.id), next];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted]);

  const stampByCode = (codeRaw: string) => {
    const code = codeRaw.trim();
    if (!code) return;

    const place = selectedEvent.places.find((p) => p.qrCode === code);
    if (!place) return alert("유효하지 않은 QR 코드");

    setProgress((prev) => {
      const cur =
        prev.find((p) => p.eventId === selectedEvent.id) ??
        ({
          eventId: selectedEvent.id,
          stampedPlaceIds: [],
          couponUsed: false,
          couponToken: "",
        } as UserProgress);

      if (cur.stampedPlaceIds.includes(place.id)) {
        alert("이미 스탬프 완료");
        return prev;
      }

      const next: UserProgress = {
        ...cur,
        stampedPlaceIds: [...cur.stampedPlaceIds, place.id],
      };

      return [...prev.filter((p) => p.eventId !== selectedEvent.id), next];
    });

    alert(`"${place.name}" 스탬프 완료!`);
  };

  const stampByQr = () => {
    stampByCode(qrInput);
    setQrInput("");
  };

  /* ---------- 직원(관리자) 쿠폰 검증 ---------- */
  const [showStoreScanner, setShowStoreScanner] = useState(false);
  const [showCouponScanner, setShowCouponScanner] = useState(false);
  const [activePlaceId, setActivePlaceId] = useState<string>("");

  const activePlace = useMemo(() => {
    return selectedEvent.places.find((p) => p.id === activePlaceId);
  }, [selectedEvent.places, activePlaceId]);

  const verifyStoreQr = (storeQrRaw: string) => {
    const storeQr = storeQrRaw.trim();
    const place = selectedEvent.places.find((p) => p.qrCode === storeQr);

    if (!place) {
      alert("❌ 이 QR은 등록된 매장 QR이 아닙니다.");
      return;
    }

    setActivePlaceId(place.id);
    alert(`✅ 매장 확인 완료: ${place.name}`);
  };

  const verifyCouponAtStore = (couponRaw: string) => {
    if (!activePlaceId) {
      alert("먼저 매장 QR을 스캔해서 현재 매장을 확인하세요.");
      return;
    }

    const parsed = parseCouponToken(couponRaw);
    if (!parsed) {
      alert("❌ 유효하지 않은 쿠폰 QR 입니다.");
      return;
    }

    if (parsed.eventId !== selectedEvent.id) {
      alert("❌ 이 쿠폰은 현재 이벤트의 쿠폰이 아닙니다.");
      return;
    }

    const found = progress.find((p) => p.eventId === selectedEvent.id && p.couponToken === parsed.raw);

    if (!found) {
      alert("❌ 존재하지 않는 쿠폰입니다.");
      return;
    }

    if (found.couponUsed) {
      alert("⚠️ 이미 사용된 쿠폰입니다.");
      return;
    }

    const isPlaceInEvent = selectedEvent.places.some((p) => p.id === activePlaceId);
    if (!isPlaceInEvent) {
      alert("❌ 이 매장은 현재 이벤트 가맹점이 아닙니다.");
      return;
    }

    if (!confirm(`✅ 유효한 쿠폰입니다.\n매장: ${activePlace?.name ?? ""}\n사용 처리할까요?`)) return;

    const nowISO = new Date().toISOString();

    setProgress((prev) =>
      prev.map((p) =>
        p.eventId === selectedEvent.id && p.couponToken === parsed.raw
          ? {
              ...p,
              couponUsed: true,
              couponUsedAtPlaceId: activePlaceId,
              couponUsedAtISO: nowISO,
            }
          : p
      )
    );

    alert("✅ 쿠폰 사용 처리 완료!");
  };

  const usedAtPlaceName = useMemo(() => {
    if (!userProgress.couponUsedAtPlaceId) return "";
    const p = selectedEvent.places.find((x) => x.id === userProgress.couponUsedAtPlaceId);
    return p?.name ?? "";
  }, [selectedEvent.places, userProgress.couponUsedAtPlaceId]);

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
      <h1 style={{ textAlign: "center", color: theme.primary }}>QR 스탬프 이벤트</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setTab("관리자")}>관리자</button>
        <button onClick={() => setTab("유저")}>유저</button>
      </div>

      {tab === "관리자" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button onClick={() => setAdminView("가맹점")}>가맹점</button>
            <button onClick={() => setAdminView("쿠폰검증")}>쿠폰 검증</button>
          </div>

          {adminView === "가맹점" && (
            <>
              <h3>가맹점 추가</h3>
              <input
                placeholder="이름"
                value={placeForm.name}
                onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })}
              />
              <input
                placeholder="주소"
                value={placeForm.address}
                onChange={(e) => setPlaceForm({ ...placeForm, address: e.target.value })}
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
                    <div style={{ fontSize: 13, color: theme.gray }}>{p.address}</div>
                    <div style={{ fontSize: 12, color: theme.primary }}>{p.qrCode}</div>
                  </div>
                </div>
              ))}
            </>
          )}

          {adminView === "쿠폰검증" && (
            <>
              <h3>직원용 쿠폰 검증 (매장별)</h3>

              <div
                style={{
                  background: theme.card,
                  borderRadius: 16,
                  padding: 12,
                  boxShadow: "0 6px 12px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontSize: 13, color: theme.gray }}>
                  1) 먼저 <b>매장 QR</b>을 스캔해서 “현재 매장”을 확인하세요.
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: theme.gray }}>
                  2) 그 다음 <b>쿠폰 QR</b>을 스캔해서 사용 처리합니다.
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: theme.gray, marginBottom: 6 }}>현재 매장</div>
                  <div style={{ fontWeight: "bold" }}>
                    {activePlace ? activePlace.name : "미선택(매장 QR 먼저 스캔)"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowStoreScanner((v) => !v)}
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "14px 0",
                  background: theme.primary,
                  color: "white",
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: "bold",
                  border: "none",
                }}
              >
                🏪 매장 QR 스캔
              </button>

              {showStoreScanner && (
                <QrScanner
                  elementId="qr-reader-store"
                  title="매장 QR 스캔"
                  onScan={(text) => {
                    setShowStoreScanner(false);
                    verifyStoreQr(text);
                  }}
                  onClose={() => setShowStoreScanner(false)}
                />
              )}

              <button
                onClick={() => {
                  if (!activePlaceId) {
                    alert("먼저 매장 QR을 스캔하세요.");
                    return;
                  }
                  setShowCouponScanner((v) => !v);
                }}
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: "14px 0",
                  background: activePlaceId ? theme.primary : "#F9A8D4",
                  color: "white",
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: "bold",
                  border: "none",
                }}
              >
                🎟️ 쿠폰 QR 스캔(현재 매장에서만)
              </button>

              {showCouponScanner && (
                <QrScanner
                  elementId="qr-reader-coupon"
                  title="쿠폰 QR 스캔"
                  onScan={(text) => {
                    setShowCouponScanner(false);
                    verifyCouponAtStore(text);
                  }}
                  onClose={() => setShowCouponScanner(false)}
                />
              )}
            </>
          )}
        </>
      )}

      {tab === "유저" && (
        <>
          {!isCompleted ? (
            <>
              <p style={{ textAlign: "center" }}>
                {userStamped} / {selectedEvent.rule.requiredCount}
              </p>

              <PinkStampBoard total={selectedEvent.rule.requiredCount} current={userStamped} />

              <button
                onClick={() => setShowUserScanner((v) => !v)}
                style={{
                  marginTop: 16,
                  width: "100%",
                  padding: "14px 0",
                  background: theme.primary,
                  color: "white",
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: "bold",
                  border: "none",
                }}
              >
                📷 매장 QR 찍기
              </button>

              {showUserScanner && (
                <QrScanner
                  elementId="qr-reader-user"
                  title="매장 QR 스캔"
                  onScan={(text) => {
                    setShowUserScanner(false);
                    stampByCode(text);
                  }}
                  onClose={() => setShowUserScanner(false)}
                />
              )}

              <div style={{ marginTop: 16 }}>
                <input
                  placeholder="(백업) QR 코드 입력"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                />
                <button onClick={stampByQr}>스탬프 찍기</button>
              </div>
            </>
          ) : (
            <CouponCard
              title={selectedEvent.title}
              used={!!userProgress.couponUsed}
              token={userProgress.couponToken || "CPN|GENERATING|..."}
              usedAtPlaceName={usedAtPlaceName}
              usedAtISO={userProgress.couponUsedAtISO}
            />
          )}
        </>
      )}
    </div>
  );
}
