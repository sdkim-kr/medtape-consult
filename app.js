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
      details: {
        intro:
          "제품의 사용 환경을 정밀하게 분석해 최적의 접착제·원단 조합을 좁혀드립니다.",
        points: [
          "착용 부위, 기간, 활동량, 대상 사용자(민감성 피부 여부)를 기준으로 요구사항을 정리합니다.",
          "접착제 계열(아크릴/실리콘/하이드로콜로이드 등)별 장단점을 비교해 후보를 압축합니다.",
          "원단(PU필름/부직포/PET 등)의 통기성·밀착성·방수성 균형을 맞춥니다.",
          "후보군에 대한 벤치마크 테스트 설계까지 지원합니다.",
        ],
        tip: "사이트의 '테이프 추천 진단'을 먼저 돌려보시면 상담이 훨씬 구체적으로 진행됩니다.",
      },
    },
    {
      icon: "🧪",
      title: "적용성 & 안전성 검토",
      desc: "피부 자극, 박리력, 통기성 관점에서 리스크를 사전 점검합니다.",
      details: {
        intro:
          "선정한 테이프가 실제 사용 상황에서 안전하고 안정적으로 붙어있는지 리스크를 사전 점검합니다.",
        points: [
          "피부 자극·홍반 가능성, 장기 착용 시 각질 손상 위험을 평가합니다.",
          "박리력(초기/시간경과)이 사용 시나리오에 적정한지 검토합니다.",
          "통기성 부족으로 인한 짓무름(침연) 리스크를 점검합니다.",
          "탈착 시 통증·잔사(접착제 남음) 여부를 확인합니다.",
        ],
        tip: "안전성은 '강한 접착'이 아니라 '적정 접착 + 낮은 자극'의 균형에서 나옵니다.",
      },
    },
    {
      icon: "📐",
      title: "다이컷 / 구조 설계",
      desc: "패치 형상, 라이너, 릴리스 구조 등 양산을 고려한 설계를 지원합니다.",
      details: {
        intro:
          "양산과 사용 편의를 모두 고려해 패치의 물리적 구조를 설계합니다.",
        points: [
          "부착 부위 곡면에 맞는 형상과 모서리 라운딩(들뜸 방지)을 설계합니다.",
          "릴리스 라이너 분할·탭 구조로 사용자가 쉽게 붙일 수 있게 합니다.",
          "디바이스 창(window), 센서 홀 등 기능부 정렬을 설계에 반영합니다.",
          "다이컷 공정성과 수율을 고려한 재단 레이아웃을 제안합니다.",
        ],
        tip: "붙이기 어려운 구조는 접착 성능이 좋아도 현장에서 들뜸·오적용을 유발합니다.",
      },
    },
    {
      icon: "📋",
      title: "규제 · 인허가 대응",
      desc: "생체적합성 시험 항목과 등급 분류, 문서화 방향을 안내합니다.",
      details: {
        intro:
          "제품 특성에 맞는 인허가 경로와 필요한 시험·문서를 정리해 드립니다.",
        points: [
          "사용 목적(intended use) 기준으로 의료기기 해당 여부와 등급을 판별합니다.",
          "필요한 생체적합성(ISO 10993) 시험 항목을 도출합니다.",
          "기술문서·성능시험 자료 구성 방향을 안내합니다.",
          "국내(K-MDR)와 해외(MDR/FDA) 경로 차이를 비교합니다.",
        ],
        tip: "규제 항목은 오른쪽 '규제·품질 체크리스트' 섹션에서 개별 항목도 확인할 수 있습니다.",
      },
    },
  ];

  // ---------- 렌더러 ----------
  function renderServices() {
    const wrap = $("#service-cards");
    if (!wrap) return;
    SERVICES.forEach((s, idx) => {
      const card = el("article", "card card-clickable");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", s.title + " 상세 보기");
      card.innerHTML = `
        <div class="card-icon" aria-hidden="true">${s.icon}</div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <span class="card-more">자세히 보기 →</span>`;
      const open = () => openServiceModal(idx);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
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
        <p class="kb-caution"><strong>주의:</strong> ${a.cautions.join(" · ")}</p>
        ${(a.vendors && a.vendors.length) ? `<p class="kb-vendor"><strong>제조사 계열:</strong> ${a.vendors.map((v) => v.brand).join(" · ")}</p>` : ""}`;
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
    KB.COMPLIANCE_NOTES.forEach((c, idx) => {
      const item = el("div", "compliance-item compliance-clickable");
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", c.title + " 상세 보기");
      item.innerHTML = `
        <span class="badge">${c.code}</span>
        <div>
          <h4>${c.title}</h4>
          <p>${c.desc}</p>
          <span class="card-more">자세히 보기 →</span>
        </div>`;
      const open = () => openComplianceModal(idx);
      item.addEventListener("click", open);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
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

    // 착용 기간 적합도 (extended = 연장 착용)
    if (a.wearTime.includes(input.wearTime)) {
      score += 3;
      reasons.push("목표 착용 기간에 적합");
    } else {
      score -= 2;
    }
    // 연장 착용은 장기 특성을 더 강하게 요구
    if (input.wearTime === "extended") {
      score += (a.moistureResistance - 3);
      if (a.wearTime && a.wearTime.includes("extended")) reasons.push("연장 착용(다일) 대응");
    }

    // 피부 특성 (MARSI 저감 관점)
    if (input.skinType === "neonatal") {
      score += (a.skinFriendliness - 3) * 2; // 순할수록 크게 가점
      if (a.skinFriendliness >= 5) reasons.push("신생아 피부에 안전 (MARSI 저감)");
    } else if (input.skinType === "sensitive") {
      score += (a.skinFriendliness - 3);
      if (a.skinFriendliness >= 4) reasons.push("민감성 피부에 순함 (저자극)");
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
      score += (a.skinFriendliness - 3) * 0.5; // 저활동엔 순한 접착제 선호
    }

    // 디바이스 무게 (무거운 하우징은 강접착 요구)
    if (input.deviceWeight === "heavy") {
      score += (a.adhesionStrength - 3);
      if (a.adhesionStrength >= 4) reasons.push("무거운 디바이스 지지");
    }

    // 적용 분야별 가중
    if (input.application === "cgm" || input.application === "diagnostic") {
      score += (a.moistureResistance - 3) * 0.8; // 습윤·검체 접촉
      if (a.id === "hydrocolloid" || a.id === "acrylic") reasons.push("연속모니터링·진단 용도 적합");
    } else if (input.application === "wound") {
      score += (a.skinFriendliness - 3);
      if (a.id === "silicone" || a.id === "hydrocolloid") reasons.push("상처 주변 피부 보호");
    } else if (input.application === "ecg") {
      if (a.id === "hydrocolloid" || a.id === "acrylic") { score += 1.5; reasons.push("전극 접촉 안정성"); }
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

    if (input.wearTime === "long" || input.wearTime === "extended") {
      score += (b.breathability - 3);
      if (b.breathability >= 4) reasons.push("장기·연장 착용 통기성");
    }

    if (input.deviceWeight === "heavy") {
      // 무게 지지엔 폼/쿠셔닝·치수안정 원단 선호
      if (b.id === "pe_foam" || b.id === "pet_film") { score += 1.5; reasons.push("디바이스 무게 지지"); }
    }

    if (input.application === "ecg" || input.application === "diagnostic") {
      if (b.id === "pet_film") { score += 1.5; reasons.push("전극·회로 캐리어 안정성"); }
    }

    return { item: b, score, reasons };
  }

  function topN(list, n) {
    return list.slice().sort((x, y) => y.score - x.score).slice(0, n);
  }

  // 솔벤텀(3M) 제품 매칭: 입력 조건과 추천 접착제에 맞춰 구체 제품 점수화
  function scoreSolventum(p, input, topAdhesiveId) {
    let score = 0;
    const m = p.match || {};
    if (m.wearTime && m.wearTime.includes(input.wearTime)) score += 3;
    if (m.adhesive && m.adhesive === topAdhesiveId) score += 3;
    if (m.activity && m.activity === input.activity) score += 2;
    if (m.deviceWeight && m.deviceWeight === input.deviceWeight) score += 2;
    if (m.reposition && input.reposition) score += 2;
    if (m.application && m.application.includes(input.application)) score += 2;
    // 재부착이 필요한데 재부착 매치가 없는 제품은 감점
    if (input.reposition && !m.reposition) score -= 1;
    return { item: p, score };
  }

  // Adhesives Research 제품 매칭 (match 필드가 배열/문자열 혼용 지원)
  function inMatch(field, value) {
    if (field == null) return false;
    return Array.isArray(field) ? field.includes(value) : field === value;
  }
  function scoreAR(p, input, topAdhesiveId) {
    let score = 0;
    const m = p.match || {};
    if (inMatch(m.application, input.application)) score += 4;
    if (inMatch(m.adhesive, topAdhesiveId)) score += 2;
    if (inMatch(m.skinType, input.skinType)) score += 2;
    if (inMatch(m.deviceWeight, input.deviceWeight)) score += 2;
    return { item: p, score };
  }

  function renderResult(input) {
    const out = $("#advisor-result");
    if (!out) return;

    const adhesives = topN(KB.ADHESIVES.map((a) => scoreAdhesive(a, input)), 2);
    const backings = topN(KB.BACKINGS.map((b) => scoreBacking(b, input)), 2);
    const topAdhesiveId = adhesives[0] ? adhesives[0].item.id : null;

    const solventum = topN(
      (KB.SOLVENTUM_PRODUCTS || []).map((p) => scoreSolventum(p, input, topAdhesiveId)),
      2
    ).filter((r) => r.score > 0);

    const arProducts = topN(
      (KB.AR_PRODUCTS || []).map((p) => scoreAR(p, input, topAdhesiveId)),
      2
    ).filter((r) => r.score > 0);

    const wearLabel = { short: "단기(~1일)", mid: "중기(2~6일)", long: "장기(7일)", extended: "연장(7~14일+)" }[input.wearTime];
    const skinLabel = { normal: "일반 성인", sensitive: "민감성/노약자", neonatal: "신생아/영유아" }[input.skinType];
    const appLabel = { general: "일반 고정/패치", cgm: "CGM·바이오센서", ecg: "ECG·전극", wound: "상처 드레싱", diagnostic: "진단 디바이스" }[input.application];

    const adhesiveHtml = adhesives
      .map((r, i) => {
        const reason = r.reasons.length ? r.reasons.join(", ") : "종합 조건 균형이 우수";
        const vendors = (r.item.vendors || [])
          .map((v) => `<span class="vendor-chip">${v.brand}<em>${v.line}</em></span>`)
          .join("");
        const vendorBlock = vendors
          ? `<div class="rec-vendors"><span class="rec-vendors-label">참고 제조사 계열</span>${vendors}</div>`
          : "";
        return `
        <div class="rec-item ${i === 0 ? "rec-primary" : ""}">
          <div class="rec-rank">${i === 0 ? "1순위" : "대안"}</div>
          <div class="rec-body">
            <strong>${r.item.name}</strong>
            <p>${reason}</p>
            ${vendorBlock}
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

    const productCards = (list) =>
      list.length
        ? list
            .map((r, i) => {
              const p = r.item;
              const hi = (p.highlights || []).map((h) => `<li>${h}</li>`).join("");
              return `
        <div class="prod-item ${i === 0 ? "prod-primary" : ""}">
          <div class="prod-head">
            <span class="prod-code">${p.code}</span>
            <div>
              <strong>${p.name}</strong>
              <span class="prod-wear">${p.wearTime}</span>
            </div>
          </div>
          <p class="prod-constr">${p.construction}</p>
          <ul class="prod-hi">${hi}</ul>
        </div>`;
            })
            .join("")
        : `<p class="prod-empty">이 조건에 딱 맞는 대표 제품이 좁혀지지 않았습니다. 상담을 통해 맞춤 검토를 제안드립니다.</p>`;

    const solventumHtml = productCards(solventum);
    const arHtml = productCards(arProducts);

    out.innerHTML = `
      <div class="result-card">
        <h3>추천 결과</h3>
        <p class="result-cond">${appLabel} · ${wearLabel} · ${skinLabel} · 방수 ${input.moisture === "high" ? "높음" : "낮음"} · 활동 ${input.activity}${input.deviceWeight === "heavy" ? " · 중량기기" : ""}${input.reposition ? " · 재부착" : ""}</p>

        <h4 class="rec-group">추천 접착제 (Adhesive)</h4>
        ${adhesiveHtml}

        <h4 class="rec-group">추천 원단 (Backing)</h4>
        ${backingHtml}

        <h4 class="rec-group rec-group-solventum">솔벤텀(3M) 대표 제품 매칭 <span class="solventum-badge">Solventum</span></h4>
        <div class="prod-list">${solventumHtml}</div>

        <h4 class="rec-group rec-group-solventum">Adhesives Research 대표 제품 매칭 <span class="ar-badge">AR</span></h4>
        <div class="prod-list">${arHtml}</div>

        <p class="result-vendor-note">※ 솔벤텀(3M) 및 Adhesives Research의 공개 제품 자료를 참고한 예시 매칭입니다. 스펙 수치는 대표값이며, 특정 제품 지정·보증이 아닙니다. 정확한 사양은 각 사의 최신 기술자료(TIS/TDS)를 확인하세요.</p>
        <p class="result-disclaimer">⚠️ 위 추천은 초기 방향 설정용입니다. 최종 채택 전 반드시 생체적합성(ISO 10993) 시험, MARSI 리스크 평가, 실착용 테스트를 진행하세요.</p>
        <a href="#contact" class="btn btn-primary btn-sm">이 조건으로 상담 요청</a>
      </div>`;
  }

  function bindAdvisorForm() {
    const form = $("#advisor-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = {
        application: form.application.value,
        wearTime: form.wearTime.value,
        skinType: form.skinType.value,
        moisture: form.moisture.value,
        activity: form.activity.value,
        deviceWeight: form.deviceWeight.value,
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

    const RECIPIENT = "jeminni@daum.net"; // 상담 요청 수신 메일 주소

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const company = form.company.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      // 메일 제목·본문 조립
      const subject = `[상담요청] ${company || "회사명 미기재"}`;
      const bodyLines = [
        "의료용테이프컨설팅 상담 요청",
        "----------------------------------------",
        `회사명: ${company || "(미기재)"}`,
        `회신 이메일: ${email || "(미기재)"}`,
        "",
        "문의 내용:",
        message || "(내용 없음)",
        "",
        "----------------------------------------",
        "본 메일은 웹사이트 상담 폼에서 생성되었습니다.",
      ];
      const body = bodyLines.join("\r\n");

      // mailto 링크 생성 후 메일 앱 실행
      const mailto =
        `mailto:${RECIPIENT}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;

      // 안내 메시지
      status.textContent =
        "메일 작성 창을 열었습니다. 내용을 확인하고 '보내기'를 누르면 상담 요청이 전달됩니다.";
      status.classList.add("ok");
    });
  }

  // ---------- 모달 ----------
  let lastFocused = null;

  function ensureModal() {
    let overlay = $("#modal-overlay");
    if (overlay) return overlay;
    overlay = el("div", "modal-overlay");
    overlay.id = "modal-overlay";
    overlay.setAttribute("hidden", "");
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button class="modal-close" type="button" aria-label="닫기">×</button>
        <div class="modal-content"></div>
      </div>`;
    document.body.appendChild(overlay);

    const close = () => closeModal();
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    overlay.querySelector(".modal-close").addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.hasAttribute("hidden")) close();
    });
    return overlay;
  }

  function buildDetailHtml(icon, label, title, d) {
    const points = (d.points || []).map((p) => `<li>${p}</li>`).join("");
    const tip = d.tip
      ? `<p class="modal-tip"><strong>💡 참고</strong> ${d.tip}</p>`
      : "";
    return `
      <div class="modal-head">
        ${icon ? `<span class="modal-icon" aria-hidden="true">${icon}</span>` : ""}
        <div>
          ${label ? `<span class="modal-eyebrow">${label}</span>` : ""}
          <h3 id="modal-title">${title}</h3>
        </div>
      </div>
      <p class="modal-intro">${d.intro || ""}</p>
      ${points ? `<ul class="modal-points">${points}</ul>` : ""}
      ${tip}`;
  }

  function openModal(html) {
    const overlay = ensureModal();
    overlay.querySelector(".modal-content").innerHTML = html;
    overlay.removeAttribute("hidden");
    document.body.classList.add("modal-open");
    lastFocused = document.activeElement;
    overlay.querySelector(".modal-close").focus();
  }

  function closeModal() {
    const overlay = $("#modal-overlay");
    if (!overlay) return;
    overlay.setAttribute("hidden", "");
    document.body.classList.remove("modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function openServiceModal(idx) {
    const s = SERVICES[idx];
    if (!s || !s.details) return;
    openModal(buildDetailHtml(s.icon, "컨설팅 서비스", s.title, s.details));
  }

  function openComplianceModal(idx) {
    const c = KB.COMPLIANCE_NOTES[idx];
    if (!c || !c.details) return;
    openModal(buildDetailHtml("📋", c.code, c.title, c.details));
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
