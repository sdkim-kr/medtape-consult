/**
 * 의료용 테이프 지식 베이스
 * -------------------------------------------------------------
 * 이 파일은 컨설팅 추천 엔진이 참조하는 핵심 데이터입니다.
 * 접착제(adhesive) 종류, 원단(backing) 종류, 그리고 대표 제품군을
 * 정리하여 고객사 요구사항에 맞는 조합을 추천하는 데 사용됩니다.
 *
 * ⚠️ 주의: 여기에 담긴 값은 산업 일반 지식에 기반한 "출발점"입니다.
 *          실제 제품 적용 전에는 반드시 임상/생체적합성(ISO 10993) 검증과
 *          현장 착용 테스트를 거쳐야 합니다.
 */

// 접착제(Adhesive) 유형 ----------------------------------------------------
const ADHESIVES = [
  {
    id: "acrylic",
    name: "아크릴 (Acrylic)",
    summary: "장기 착용에 강한 범용 접착제. 시간이 지날수록 접착력이 상승.",
    wearTime: ["mid", "long"], // 착용 기간 적합도
    adhesionStrength: 4, // 1(약) ~ 5(강)
    skinFriendliness: 3, // 1(자극큼) ~ 5(순함)
    moistureResistance: 4,
    repositionable: false,
    bestFor: ["장기 부착 센서", "고정용 웨어러블", "방수가 필요한 환경"],
    cautions: ["민감성 피부에서 장기 사용 시 각질 손상 위험", "탈착 시 통증 가능"],
  },
  {
    id: "silicone",
    name: "실리콘 (Silicone)",
    summary: "부드럽게 붙고 통증 없이 떼어짐. 반복 부착 및 민감성 피부에 최적.",
    wearTime: ["short", "mid"],
    adhesionStrength: 2,
    skinFriendliness: 5,
    moistureResistance: 3,
    repositionable: true,
    bestFor: ["신생아/노약자 피부", "반복 탈부착 디바이스", "연약 피부(상처 주변)"],
    cautions: ["강한 물리적 고정력 필요 시 부족", "상대적으로 단가 높음"],
  },
  {
    id: "hydrocolloid",
    name: "하이드로콜로이드 (Hydrocolloid)",
    summary: "수분을 흡수하며 피부를 보호. 습윤 환경 및 상처 부위에 적합.",
    wearTime: ["mid", "long"],
    adhesionStrength: 3,
    skinFriendliness: 4,
    moistureResistance: 5,
    repositionable: false,
    bestFor: ["CGM 등 습윤 접촉 부위", "삼출물 있는 상처", "장시간 방수 착용"],
    cautions: ["과도한 수분 노출 시 젤화로 탈락 가능", "두께로 인한 이물감"],
  },
  {
    id: "rubber",
    name: "고무계 (Rubber/Hot-melt)",
    summary: "초기 접착력(즉시 붙는 힘)이 강함. 단기 강고정에 유리.",
    wearTime: ["short"],
    adhesionStrength: 5,
    skinFriendliness: 2,
    moistureResistance: 2,
    repositionable: false,
    bestFor: ["단기 강력 고정", "저비용 대량 적용"],
    cautions: ["알레르기 반응 상대적으로 높음", "장기 착용 부적합"],
  },
  {
    id: "polyurethane_gel",
    name: "폴리우레탄 겔 (PU Gel)",
    summary: "쿠셔닝과 부드러운 접착을 동시에. 피부 압박을 분산.",
    wearTime: ["short", "mid"],
    adhesionStrength: 2,
    skinFriendliness: 5,
    moistureResistance: 3,
    repositionable: true,
    bestFor: ["압박 완화가 필요한 패치", "얼굴 등 곡면/민감 부위"],
    cautions: ["고정력이 약해 활동량 많은 부위 부적합"],
  },
];

// 원단/지지체(Backing) 유형 ------------------------------------------------
const BACKINGS = [
  {
    id: "pu_film",
    name: "PU 필름 (Polyurethane Film)",
    summary: "얇고 투명하며 방수. 신축성이 좋아 곡면과 관절부에 밀착.",
    breathability: 3,
    conformability: 5,
    waterproof: 5,
    bestFor: ["웨어러블 센서", "방수 필요 부위", "관절/곡면"],
  },
  {
    id: "nonwoven",
    name: "부직포 (Nonwoven)",
    summary: "통기성이 우수하고 부드러움. 장시간 착용 시 피부 스트레스 최소화.",
    breathability: 5,
    conformability: 4,
    waterproof: 1,
    bestFor: ["장기 착용 패치", "넓은 면적 고정", "통기성 우선"],
  },
  {
    id: "pe_foam",
    name: "PE 폼 (Polyethylene Foam)",
    summary: "쿠션감이 있어 충격/압박을 완충. 기기 무게 지지에 유리.",
    breathability: 2,
    conformability: 3,
    waterproof: 3,
    bestFor: ["무게 있는 디바이스 고정", "압박 완화"],
  },
  {
    id: "pet_film",
    name: "PET 필름 (Polyester Film)",
    summary: "치수 안정성이 높고 잘 늘어나지 않음. 전극/회로 캐리어에 적합.",
    breathability: 1,
    conformability: 2,
    waterproof: 4,
    bestFor: ["전극 캐리어", "정밀 부착 위치 고정", "인쇄 회로 지지"],
  },
  {
    id: "fabric",
    name: "직물/스판 (Fabric/Spandex)",
    summary: "신축성과 내구성이 뛰어남. 활동성이 큰 부위에 적합.",
    breathability: 4,
    conformability: 5,
    waterproof: 2,
    bestFor: ["활동량 많은 부위", "스포츠/재활 웨어러블"],
  },
];

// 규제/품질 참고 체크리스트 -------------------------------------------------
const COMPLIANCE_NOTES = [
  {
    code: "ISO 10993",
    title: "생체적합성 평가",
    desc: "피부 접촉 의료기기는 세포독성·감작성·자극성 시험이 필수입니다.",
    details: {
      intro:
        "피부에 직접 닿는 의료기기는 인체에 유해하지 않음을 시험으로 증명해야 합니다. ISO 10993 시리즈가 그 평가 체계입니다.",
      points: [
        "접촉 유형(피부/점막/손상 조직)과 접촉 기간(24시간 이내 / 30일 이내 / 장기)에 따라 요구 시험이 달라집니다.",
        "피부부착 테이프는 통상 세포독성(Part 5), 감작성(Part 10), 피부 자극성(Part 23) 시험이 기본입니다.",
        "완제품이 아니라 실제 사용 상태의 재료 조합으로 시험해야 신뢰도가 높습니다.",
        "화학적 특성분석(Part 18)으로 시험 항목을 줄이는 전략도 검토할 수 있습니다.",
      ],
      tip: "접착제·원단·라이너를 바꾸면 재시험이 필요할 수 있으니, 설계 초기에 재료를 확정하는 것이 비용 절감에 유리합니다.",
    },
  },
  {
    code: "ISO 11607",
    title: "멸균 포장 (해당 시)",
    desc: "멸균 제품이라면 포장 시스템 검증이 필요합니다.",
    details: {
      intro:
        "멸균 상태로 공급되는 제품은 포장이 멸균 배리어 역할을 하며, 그 성능을 검증해야 합니다.",
      points: [
        "Part 1은 재료·멸균 배리어 시스템 요구사항, Part 2는 포장 공정(실링 등)의 밸리데이션을 다룹니다.",
        "유통·보관 중 멸균 상태가 유지되는지 무결성 시험과 유효기간(가속·실시간) 시험이 필요합니다.",
        "실링 강도, 기밀성, 개봉성(무균 개봉 가능 여부)을 평가합니다.",
      ],
      tip: "비멸균 제품이라면 이 항목은 해당되지 않습니다. 다만 사용 부위가 손상 피부라면 멸균 요구가 생길 수 있습니다.",
    },
  },
  {
    code: "MDR / K-MDR",
    title: "의료기기 등급 분류",
    desc: "부착 부위·기간에 따라 등급이 달라지며 인허가 경로가 결정됩니다.",
    details: {
      intro:
        "피부부착 테이프·패치는 접촉 부위와 기간에 따라 위험 등급이 결정되고, 등급이 곧 인허가 경로를 좌우합니다.",
      points: [
        "국내(K-MDR)는 1~4등급, 유럽 MDR은 Class I~III로 분류합니다.",
        "온전한 피부에 단기 접촉하는 고정용 테이프는 대체로 낮은 등급입니다.",
        "손상 피부 접촉, 약물 전달, 장기 침습적 사용은 등급이 올라갑니다.",
        "등급이 높을수록 임상 근거·기술문서·인증기관 심사 요구가 커집니다.",
      ],
      tip: "'의료기기'가 아니라 화장품·공산품으로 분류되는 경우도 있으니, 사용 목적(intended use) 정의가 출발점입니다.",
    },
  },
  {
    code: "ASTM D3330",
    title: "박리 접착력 시험",
    desc: "180° 박리 강도로 접착력을 정량 비교합니다.",
    details: {
      intro:
        "테이프가 표면에서 떨어지는 데 필요한 힘을 정량화하여 접착 성능을 비교·관리하는 시험 표준입니다.",
      points: [
        "180° 또는 90° 박리 각도로 단위 폭당 힘(N/25mm 등)을 측정합니다.",
        "스테인리스 표준판 시험값은 제품 간 비교에, 실제 피부 유사 기재 시험은 사용감 예측에 유용합니다.",
        "부착 직후 값과 일정 시간 경과 후 값을 함께 봐야 시간 의존적 접착 특성을 파악할 수 있습니다.",
        "관련 시험으로 초기 점착(택, ASTM D2979)과 유지력(홀딩파워)도 함께 검토합니다.",
      ],
      tip: "접착력은 강할수록 좋은 게 아니라 '적정 범위'가 핵심입니다. 너무 강하면 탈착 시 피부 손상을 유발합니다.",
    },
  },
];

// 다른 파일에서 사용할 수 있도록 전역으로 노출
window.MEDTAPE_KB = { ADHESIVES, BACKINGS, COMPLIANCE_NOTES };
