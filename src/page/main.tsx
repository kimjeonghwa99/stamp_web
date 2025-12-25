import "./Main.css";

export default function Main() {
  return (
    <div className="page">
      <div className="panel">
        <h1 className="title">QR 스탬프 이벤트</h1>

        <div className="menuGrid">
          <button className="menuBtn">관리자</button>
          <button className="menuBtn">유저</button>
          <button className="menuBtn">가맹점</button>
          <button className="menuBtn">쿠폰 검증</button>
        </div>

        <p className="sectionLabel">가맹점 추가</p>

        <div className="formRow">
          <input className="input" placeholder="이름" />
          <input className="input" placeholder="주소" />
        </div>

        <button className="addBtn">추가</button>
      </div>
    </div>
  );
}
