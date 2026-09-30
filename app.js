/**
 * DermaTape Consulting — 프론트엔드 로직
 * -----------------------------------------------------------
 * 1) 서비스 카드 / 지식베이스 / 규제 체크리스트 렌더링
 * 2) 추천 진단 스코어링 엔진
 * 3) 문의 폼 처리 (데모: 로컬 확인 메시지)
 */
(function () {
  "use strict";

  const KB = window.MEDTAPE_KB;
  if (!KB) {
    console.error("지식 베이스(MEDTAPE_KB)를 불러오지 못했습니다. knowledge.js 로드를 확인하세요.");
    return;
  }

  // ---------- 유틸 ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, html) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  };
  // 1~5 점수를 별/막대 텍스트로 표현
  const scaleBar = (score) => {
    const filled = "●".repeat(score);
    const empty = "○".repeat(5 - score);
    return `<span class="scale">${filled}${empty}</span>`;
  };

  // ---------- 서비스 카드 데이터 ----------
  const SERVICES = [
    {
      icon: "🔎",
      title: "테이프 선정 컨설팅",
      desc: "제품 착용 시나리오에 맞는 접착제·원단 조합을 진단하고 후보군을 제시합니다.",
    },
    {
      icon: "🧪",
      title: "적용성 & 안전성 검토",
      desc: "피부 자극, 박리력, 통기성 관점에서 리스크를 사전 점검합니다.",
    },
    {
      icon: "📐",
      title: "다이컷 / 구조 설계",
      desc: "패치 형상, 라이너, 릴리스 구조 등 양산을 고려한 설계를 지원합니다.",
    },
    {
      icon: "📋",
      title: "규제 · 인허가 대응",
      desc: "생체적합성 시험 항목과 등급 분류, 문서화 방향을 안내합니다.",
    },
  ];

  // ---------- 렌더러 ----------
  function renderServices() {
    const wrap = $("#service-cards");
    if (!wrap) return;
    SERVICES.forEach((s) => {
      const card = el("article", "card");
      card.innerHTML = `
        <div class="card-icon" aria-hidden="true">${s.icon}</div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>`;
      wrap.appendChild(card);
    });
  }

  function renderAdhesives() {
    const wrap = $("#adhesive-grid");
    if (!wrap) return;
    KB.ADHESIVES.forEach((a) => {
      const card = el("article", "kb-card");
      card.innerHTML = `
        <h4>${a.name}</h4>
        <p class="kb-summary">${a.summary}</p>
        <ul class="kb-metrics">
          <li>접착력 ${scaleBar(a.adhesionStrength)}</li>
          <li>피부순함 ${scaleBar(a.skinFriendliness)}</li>
          <li>내습성 ${scaleBar(a.moistureResistance)}</li>
        </ul>
        <p class="kb-tag"><strong>적합:</strong> ${a.bestFor.join(", ")}</p>
        <p class="kb-caution"><strong>주의:</strong> ${a.cautions.join(" · ")}</p>`;
      wrap.appendChild(card);
    });
  }

  function renderBackings() {
    const wrap = $("#backing-grid");
    if (!wrap) return;
    KB.BACKINGS.forEach((b) => {
      const card = el("article", "kb-card");
      card.innerHTML = `
        <h4>${b.name}</h4>
        <p class="kb-summary">${b.summary}</p>
        <ul class="kb-metrics">
          <li>통기성 ${scaleBar(b.breathability)}</li>
          <li>밀착성 ${scaleBar(b.conformability)}</li>
          <li>방수성 ${scaleBar(b.waterproof)}</li>
        </ul>
        <p class="kb-tag"><strong>적합:</strong> ${b.bestFor.join(", ")}</p>`;
      wrap.appendChild(card);
    });
  }

  function renderCompliance() {
    const wrap = $("#compliance-list");
    if (!wrap) return;
    KB.COMPLIANCE_NOTES.forEach((c) => {
      const item = el("div", "compliance-item");
      item.innerHTML = `
        <span class="badge">${c.code}</span>
        <div>
          <h4>${c.title}</h4>
          <p>${c.desc}</p>
        </div>`;
      wrap.appendChild(item);
    });
  }

  // ---------- 추천 스코어링 엔진 ----------
  /**
   * 입력 조건에 따라 각 접착제/원단에 가중 점수를 부여하고 상위 후보를 반환.
   */
  function scoreAdhesive(a, input) {
    let score = 0;
    const reasons = [];

    // 착용 기간 적합도
    if (a.wearTime.includes(input.wearTime)) {
      score += 3;
      reasons.push("착용 기간에 적합");
    } else {
      score -= 2;
    }

    // 피부 민감도
    if (input.skinType === "neonatal") {
      score += (a.skinFriendliness - 3) * 2; // 순할수록 크게 가점
      if (a.skinFriendliness >= 5) reasons.push("신생아 피부에 안전");
    } else if (input.skinType === "sensitive") {
      score += (a.skinFriendliness - 3);
      if (a.skinFriendliness >= 4) reasons.push("민감성 피부에 순함");
    }

    // 수분/방수 환경
    if (input.moisture === "high") {
      score += (a.moistureResistance - 3);
      if (a.moistureResistance >= 4) reasons.push("습윤·방수 환경에 강함");
    }

    // 활동량/고정 강도
    if (input.activity === "high") {
      score += (a.adhesionStrength - 3);
      if (a.adhesionStrength >= 4) reasons.push("강한 고정력 제공");
    } else if (input.activity === "low") {
      // 저활동엔 순한 접착제 선호
      score += (a.skinFriendliness - 3) * 0.5;
    }

    // 재부착 필요
    if (input.reposition) {
      if (a.repositionable) {
        score += 3;
        reasons.push("반복 탈부착 가능");
      } else {
        score -= 3;
      }
    }

    return { item: a, score, reasons };
  }

  function scoreBacking(b, input) {
    let score = 0;
    const reasons = [];

    if (input.moisture === "high") {
      score += (b.waterproof - 3);
      if (b.waterproof >= 4) reasons.push("방수 원단");
    } else {
      score += (b.breathability - 3) * 0.5; // 저수분이면 통기성 선호
    }

    if (input.activity === "high") {
      score += (b.conformability - 3);
      if (b.conformability >= 4) reasons.push("곡면·관절에 밀착");
    }

    if (input.wearTime === "long") {
      score += (b.breathability - 3);
      if (b.breathability >= 4) reasons.push("장기 착용 통기성");
    }

    return { item: b, score, reasons };
  }

  function topN(list, n) {
    return list.slice().sort((x, y) => y.score - x.score).slice(0, n);
  }

  function renderResult(input) {
    const out = $("#advisor-result");
    if (!out) return;

    const adhesives = topN(KB.ADHESIVES.map((a) => scoreAdhesive(a, input)), 2);
    const backings = topN(KB.BACKINGS.map((b) => scoreBacking(b, input)), 2);

    const wearLabel = { short: "단기(~1일)", mid: "중기(2~7일)", long: "장기(7일+)" }[input.wearTime];
    const skinLabel = { normal: "일반 성인", sensitive: "민감성/노약자", neonatal: "신생아/영유아" }[input.skinType];

    const adhesiveHtml = adhesives
      .map((r, i) => {
        const reason = r.reasons.length ? r.reasons.join(", ") : "종합 조건 균형이 우수";
        return `
        <div class="rec-item ${i === 0 ? "rec-primary" : ""}">
          <div class="rec-rank">${i === 0 ? "1순위" : "대안"}</div>
          <div class="rec-body">
            <strong>${r.item.name}</strong>
            <p>${reason}</p>
          </div>
        </div>`;
      })
      .join("");

    const backingHtml = backings
      .map((r, i) => {
        const reason = r.reasons.length ? r.reasons.join(", ") : "범용 적합";
        return `
        <div class="rec-item ${i === 0 ? "rec-primary" : ""}">
          <div class="rec-rank">${i === 0 ? "1순위" : "대안"}</div>
          <div class="rec-body">
            <strong>${r.item.name}</strong>
            <p>${reason}</p>
          </div>
        </div>`;
      })
      .join("");

    out.innerHTML = `
      <div class="result-card">
        <h3>추천 결과</h3>
        <p class="result-cond">조건: ${wearLabel} · ${skinLabel} · 방수 ${input.moisture === "high" ? "높음" : "낮음"} · 활동 ${input.activity}${input.reposition ? " · 재부착" : ""}</p>

        <h4 class="rec-group">추천 접착제</h4>
        ${adhesiveHtml}

        <h4 class="rec-group">추천 원단</h4>
        ${backingHtml}

        <p class="result-disclaimer">⚠️ 위 추천은 초기 방향 설정용입니다. 최종 채택 전 반드시 생체적합성(ISO 10993) 시험과 실착용 테스트를 진행하세요.</p>
        <a href="#contact" class="btn btn-primary btn-sm">이 조건으로 상담 요청</a>
      </div>`;
  }

  function bindAdvisorForm() {
    const form = $("#advisor-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = {
        wearTime: form.wearTime.value,
        skinType: form.skinType.value,
        moisture: form.moisture.value,
        activity: form.activity.value,
        reposition: form.reposition.checked,
      };
      renderResult(input);
      $("#advisor-result").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function bindContactForm() {
    const form = $("#contact-form");
    const status = $("#contact-status");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const company = form.company.value.trim();
      // 데모 환경: 서버 전송 대신 확인 메시지 표시
      status.textContent = `${company ? company + " 님, " : ""}상담 요청이 접수되었습니다. 담당자가 이메일로 연락드리겠습니다. (데모)`;
      status.classList.add("ok");
      form.reset();
    });
  }

  // ---------- 초기화 ----------
  document.addEventListener("DOMContentLoaded", () => {
    renderServices();
    renderAdhesives();
    renderBackings();
    renderCompliance();
    bindAdvisorForm();
    bindContactForm();
  });
})();
