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
  },
  {
    code: "ISO 11607",
    title: "멸균 포장 (해당 시)",
    desc: "멸균 제품이라면 포장 시스템 검증이 필요합니다.",
  },
  {
    code: "MDR / K-MDR",
    title: "의료기기 등급 분류",
    desc: "부착 부위·기간에 따라 등급이 달라지며 인허가 경로가 결정됩니다.",
  },
  {
    code: "ASTM D3330",
    title: "박리 접착력 시험",
    desc: "180° 박리 강도로 접착력을 정량 비교합니다.",
  },
];

// 다른 파일에서 사용할 수 있도록 전역으로 노출
window.MEDTAPE_KB = { ADHESIVES, BACKINGS, COMPLIANCE_NOTES };
