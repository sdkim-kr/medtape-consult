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
    name: "아크릴 PSA (Acrylate)",
    summary: "연장 착용에 강한 범용 감압 접착제(PSA). 시간이 지날수록 접착력이 상승.",
    wearTime: ["mid", "long", "extended"], // 착용 기간 적합도
    adhesionStrength: 4, // 1(약) ~ 5(강)
    skinFriendliness: 3, // 1(자극큼) ~ 5(순함)
    moistureResistance: 4,
    repositionable: false,
    bestFor: ["장기 부착 센서", "고정용 웨어러블", "방수가 필요한 환경"],
    cautions: ["민감성 피부에서 장기 사용 시 각질 손상(MARSI) 위험", "탈착 시 통증 가능"],
    // 대표 제조사 계열 (공개 제품 자료 기반 요약)
    vendors: [
      { brand: "Solventum(3M)", line: "Medical Tape 4578·4076·4077 (Extended Wear)" },
      { brand: "Henkel", line: "DURO-TAK·GELVA 경피급 아크릴 PSA" },
      { brand: "Berry(Polyken)", line: "3621A·3570A 부직포 (10~14일)" },
      { brand: "Avery Dennison", line: "MED 시리즈·28일 아크릴 시스템" },
    ],
  },
  {
    id: "silicone",
    name: "실리콘 PSA (Silicone)",
    summary: "부드럽게 붙고 통증 없이 떼어짐. 반복 부착 및 민감성 피부에 최적. MARSI 저감.",
    wearTime: ["short", "mid"],
    adhesionStrength: 2,
    skinFriendliness: 5,
    moistureResistance: 3,
    repositionable: true,
    bestFor: ["신생아/노약자 피부", "반복 탈부착 디바이스", "연약 피부(상처 주변)"],
    cautions: ["강한 물리적 고정력 필요 시 부족", "상대적으로 단가 높음"],
    vendors: [
      { brand: "Solventum(3M)", line: "Medical Silicone Tape 2480·2487" },
      { brand: "Nitto Denko", line: "XTRATA·STRATAGEL 저자극 계열" },
      { brand: "Avery Dennison", line: "MED 6001SI 양면 실리콘" },
      { brand: "Adhesives Research", line: "ARcare Skin Friendly" },
    ],
  },
  {
    id: "hydrocolloid",
    name: "하이드로콜로이드 (Hydrocolloid)",
    summary: "수분을 흡수하며 피부를 보호. 습윤 환경 및 상처 부위에 적합.",
    wearTime: ["mid", "long", "extended"],
    adhesionStrength: 3,
    skinFriendliness: 4,
    moistureResistance: 5,
    repositionable: false,
    bestFor: ["CGM 등 습윤 접촉 부위", "삼출물 있는 상처", "장시간 방수 착용"],
    cautions: ["과도한 수분 노출 시 젤화로 탈락 가능", "두께로 인한 이물감"],
    vendors: [
      { brand: "Scapa Healthcare", line: "Soft-Pro Hydrocolloid (Gen II) 고흡수" },
      { brand: "Avery Dennison", line: "TASA 박형 흡수성 스킨 접착" },
      { brand: "Adhesives Research", line: "ARflow·ARcare 92205 친수성(진단)" },
    ],
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
    cautions: ["알레르기 반응(감작) 상대적으로 높음", "장기 착용 부적합"],
    vendors: [
      { brand: "Henkel", line: "TECHNOMELT 핫멜트 (단기 고정)" },
      { brand: "Nitto Denko", line: "수술용 종이·부직포 테이프" },
    ],
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
    vendors: [
      { brand: "Scapa Healthcare", line: "Soft-Pro Hydrogel (쿨링·수분)" },
      { brand: "Nitto Denko", line: "STRATAGEL 겔 (ST-249)" },
    ],
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

// 제조사별 의료용 테이프 카탈로그 (통합 구조) ------------------------------
// 국내 진출한 외국계 의료용 테이프 제조사의 공개 제품 자료를 기준으로 정리.
// 각 제조사는 { id, name, badge, note, products[] } 구조를 가지며,
// 각 product의 match 조건이 진단 입력과 매칭됩니다.
// ⚠️ 스펙/제품명은 대표 예시이며 사양 목적으로 사용할 수 없습니다.
//    실제 채택 전 각 사의 최신 기술자료(TIS/TDS)를 확인하세요.
const VENDORS = [
  {
    id: "solventum",
    name: "Solventum (3M)",
    badge: "3M",
    note: "연장착용 아크릴레이트·실리콘 스킨 접착 포트폴리오의 대표 기업.",
    products: [
      {
        code: "4578",
        name: "Medical Tape 4578",
        construction: "폴리에스터 스펀레이스 부직포 + 연장착용 아크릴레이트",
        wearTime: "최대 28일 (초장기)",
        match: { wearTime: ["extended", "long"], adhesive: "acrylic" },
        highlights: ["라이너 없이 패키징 가능", "EtO 멸균 호환", "곡면 순응성 우수"],
      },
      {
        code: "4076",
        name: "Medical Tape 4076",
        construction: "화이트 스펀레이스 부직포 + 연장착용 아크릴레이트",
        wearTime: "연장 착용",
        match: { wearTime: ["extended", "long"], adhesive: "acrylic" },
        highlights: ["부직포 통기성", "인쇄 가능한 백킹"],
      },
      {
        code: "4077",
        name: "Medical Tape 4077",
        construction: "신축성(PU/합성고무) 부직포 + 연장착용 아크릴레이트",
        wearTime: "연장 착용",
        match: { wearTime: ["extended", "long"], adhesive: "acrylic", activity: "high" },
        highlights: ["높은 통기성", "신축성으로 관절·곡면 순응"],
      },
      {
        code: "2480",
        name: "Medical Silicone Tape 2480",
        construction: "폴리에스터 스펀레이스 부직포 + hi-tack 실리콘",
        wearTime: "재부착 가능(단·중기)",
        match: { wearTime: ["short", "mid"], adhesive: "silicone", reposition: true },
        highlights: ["부드러운 피부 접촉(MARSI 저감)", "재부착 가능"],
      },
      {
        code: "1577",
        name: "Medical Tape 1577",
        construction: "폴리에스터 필름 + HT 아크릴",
        wearTime: "필름 캐리어",
        match: { application: ["ecg", "diagnostic"] },
        highlights: ["치수 안정 필름", "전극·회로 캐리어"],
      },
    ],
  },
  {
    id: "ar",
    name: "Adhesives Research",
    badge: "AR",
    note: "스킨프렌들리 테이프와 함께 체외진단(IVD)·미세유체 조립에 강점.",
    products: [
      {
        code: "Skin Friendly",
        name: "ARcare® Skin Friendly Tapes",
        construction: "피부 순응(skin-friendly) 감압 접착 테이프 계열",
        wearTime: "단·중기 피부 접촉",
        match: { adhesive: ["silicone", "acrylic"], skinType: ["sensitive", "neonatal"], application: ["general", "cgm", "ecg", "wound"] },
        highlights: ["저자극·순응 설계", "다양한 백킹/접착 조합"],
      },
      {
        code: "ARcare 92205",
        name: "ARcare® 92205 친수성 다공 PSA",
        construction: "친수성 다공성 접착 전사 필름 (Z축 채널)",
        wearTime: "진단 카트리지용",
        match: { application: ["diagnostic", "cgm"] },
        highlights: ["수성 유체 층간 균일 유도", "안정적 기공 구조", "IVD 조립"],
      },
      {
        code: "ARflow",
        name: "ARflow® 친수성 테이프",
        construction: "친수성/히트씰 기능성 테이프",
        wearTime: "진단 디바이스용",
        match: { application: ["diagnostic"] },
        highlights: ["유체 흐름 제어", "검체 주입부→반응부 이송"],
      },
      {
        code: "Device Bonding",
        name: "ARclad®/ARseal® Device Bonding",
        construction: "디바이스 층간 접합용 양면 테이프",
        wearTime: "구조 접합용",
        match: { deviceWeight: "heavy", application: ["diagnostic", "ecg", "general"] },
        highlights: ["층간 강한 접합", "바이오칩 본딩 응용"],
      },
    ],
  },
  {
    id: "nitto",
    name: "Nitto Denko",
    badge: "Nitto",
    note: "저자극 피부 접착(XTRATA·STRATAGEL 겔)과 수술용 테이프에 강점.",
    products: [
      {
        code: "ST-249",
        name: "ST-249 (STRATAGEL™ 겔)",
        construction: "폴리에스터 부직포 + 겔(STRATAGEL) 접착제",
        wearTime: "단·중기 저자극",
        match: { adhesive: ["silicone", "polyurethane_gel"], skinType: ["sensitive", "neonatal"] },
        highlights: ["겔 접착으로 저자극", "각질 손상 최소화(재부착)"],
      },
      {
        code: "ST-245",
        name: "ST-245",
        construction: "폴리에스터 부직포 + 아크릴",
        wearTime: "중기",
        match: { adhesive: ["acrylic"], application: ["general", "ecg"] },
        highlights: ["부드러운 부직포", "전극·바늘 고정 응용"],
      },
      {
        code: "XTRATA",
        name: "XTRATA (저자극 스킨 테이프)",
        construction: "저자극 실리콘계 스킨 접착",
        wearTime: "재부착 가능",
        match: { skinType: ["sensitive", "neonatal"], reposition: true, adhesive: "silicone" },
        highlights: ["통증 없는 탈착", "연약 피부 각질 보호"],
      },
      {
        code: "Surgical",
        name: "ST-316 등 수술용 테이프",
        construction: "종이/부직포 백킹 + 아크릴",
        wearTime: "단기",
        match: { wearTime: ["short"], application: ["general", "wound"] },
        highlights: ["강한 종이 지지체", "수술 현장 고정"],
      },
    ],
  },
  {
    id: "henkel",
    name: "Henkel",
    badge: "Henkel",
    note: "DURO-TAK·GELVA 경피(transdermal)급 아크릴 PSA와 웨어러블 접착에 강점.",
    products: [
      {
        code: "DURO-TAK",
        name: "DURO-TAK® 아크릴 PSA",
        construction: "경피급 아크릴 감압 접착제 계열",
        wearTime: "중·장기",
        match: { adhesive: ["acrylic"], wearTime: ["mid", "long", "extended"] },
        highlights: ["경피(transdermal)급 검증", "약물전달 패치 응용"],
      },
      {
        code: "GELVA",
        name: "GELVA® 아크릴 PSA",
        construction: "약물전달용 아크릴 PSA",
        wearTime: "장기",
        match: { adhesive: ["acrylic"], application: ["general"], wearTime: ["long", "extended"] },
        highlights: ["약물전달 적합", "안정적 접착"],
      },
      {
        code: "LOCTITE",
        name: "LOCTITE® 웨어러블 접착(광경화)",
        construction: "의료기기·웨어러블용 광경화 접착",
        wearTime: "디바이스 접합",
        match: { deviceWeight: "heavy", application: ["general", "ecg", "diagnostic"] },
        highlights: ["ISO 10993 시험 완료", "하우징 실링·본딩"],
      },
      {
        code: "TECHNOMELT",
        name: "TECHNOMELT® 핫멜트",
        construction: "핫멜트 접착 (단기 고정)",
        wearTime: "단기",
        match: { adhesive: ["rubber"], wearTime: ["short"] },
        highlights: ["강한 초기 접착", "저비용 고정"],
      },
    ],
  },
  {
    id: "lohmann",
    name: "Lohmann",
    badge: "Lohmann",
    note: "DuploMED 시리즈와 28일+ Longwear 스킨 접착으로 웨어러블·상처케어 대응.",
    products: [
      {
        code: "Longwear 28+",
        name: "Longwear Skin Adhesive (28일+)",
        construction: "28일+ 착용 스킨 접착 테이프",
        wearTime: "28일+ (초장기)",
        match: { wearTime: ["extended", "long"], adhesive: ["acrylic"], skinType: ["sensitive", "normal"] },
        highlights: ["민감 피부·연장착용 겸용", "비용·지속가능성 이점"],
      },
      {
        code: "DuploMED 22791",
        name: "DuploMED® 22791",
        construction: "양면 스킨 접착 테이프",
        wearTime: "웨어러블/상처 드레싱",
        match: { application: ["general", "wound", "cgm"] },
        highlights: ["웨어러블·상처 드레싱 범용", "양면 접합"],
      },
      {
        code: "DuploMED 85300",
        name: "DuploMED® 85300",
        construction: "장기 착용 스킨 양면 테이프",
        wearTime: "장기 착용",
        match: { wearTime: ["long", "extended"], application: ["general", "cgm"] },
        highlights: ["장기 피부 착용", "웨어러블 고정"],
      },
      {
        code: "DuploMED SUR 62410",
        name: "DuploMED® SUR 62410",
        construction: "절개필름·상처케어용 양면 테이프",
        wearTime: "상처케어",
        match: { application: ["wound"] },
        highlights: ["절개(incision) 필름", "상처케어 응용"],
      },
    ],
  },
  {
    id: "tesa",
    name: "tesa",
    badge: "tesa",
    note: "612xx 웨어러블 테이프와 ISO 10993 인증 피부접촉 양면 테이프.",
    products: [
      {
        code: "612xx",
        name: "tesa® 612xx 웨어러블 테이프",
        construction: "웨어러블 디바이스용 고성능 테이프 계열",
        wearTime: "웨어러블 착용",
        match: { application: ["cgm", "ecg", "general"], adhesive: ["acrylic"] },
        highlights: ["웨어러블 디바이스 특화", "고성능 접착"],
      },
      {
        code: "4965 PV8",
        name: "tesa® 4965 PV8",
        construction: "PET 백킹 + 아크릴 양면 (피부접촉 인증)",
        wearTime: "피부 접촉",
        match: { application: ["general"], skinType: ["normal", "sensitive"] },
        highlights: ["ISO 10993 피부접촉 인증", "얇고 강한 양면 접착"],
      },
      {
        code: "Double Coated",
        name: "tesa® 양면 티슈/필름 테이프",
        construction: "티슈/필름 백킹 + 아크릴 양면",
        wearTime: "디바이스 접합",
        match: { deviceWeight: "heavy", application: ["general", "diagnostic"] },
        highlights: ["곡면 순응", "부품 접합·마운팅"],
      },
    ],
  },
  {
    id: "avery",
    name: "Avery Dennison Medical",
    badge: "AveryD",
    note: "MED 시리즈와 TASA(박형 흡수성 스킨 접착)로 다일~수주 착용 대응.",
    products: [
      {
        code: "TASA",
        name: "TASA™ 박형 흡수성 스킨 접착",
        construction: "아크릴 + 하이드로콜로이드 블렌드 (통기·흡수)",
        wearTime: "다일 착용 + 흡수",
        match: { adhesive: ["hydrocolloid", "acrylic"], moisture: "high", application: ["cgm", "wound"] },
        highlights: ["공기·수분 투과", "습윤 환경 흡수성", "상처 관찰 투명형(옵션)"],
      },
      {
        code: "MED 5719P",
        name: "MED 5719P / 5725P (단기 단면)",
        construction: "단면 스킨 접착 테이프",
        wearTime: "단기(~7일)",
        match: { wearTime: ["short", "mid"], application: ["general", "ecg"] },
        highlights: ["단기 피부 접촉", "securement(전극·센서 고정)"],
      },
      {
        code: "MED 6001SI",
        name: "MED 6001SI (양면 실리콘)",
        construction: "양면 실리콘 스킨 접착",
        wearTime: "단·중기 저자극",
        match: { adhesive: ["silicone"], skinType: ["sensitive", "neonatal"] },
        highlights: ["저자극 실리콘", "민감 피부 양면 접합"],
      },
      {
        code: "28-day system",
        name: "연장착용 아크릴 시스템 (최대 28일)",
        construction: "장기 착용 아크릴 스킨 접착",
        wearTime: "최대 28일",
        match: { wearTime: ["extended", "long"], adhesive: ["acrylic"] },
        highlights: ["다일(수주) 착용", "스커트형 디바이스 구성 검증"],
      },
    ],
  },
  {
    id: "berry",
    name: "Berry Global (Polyken)",
    badge: "Berry",
    note: "Polyken 부직포/폼 기반 장기착용(10~14일) 스킨 접착 테이프에 강점.",
    products: [
      {
        code: "Polyken 3621A",
        name: "Polyken™ 3621A",
        construction: "PU 부직포 + 의료급 아크릴",
        wearTime: "장기 (10~14일)",
        match: { wearTime: ["long", "extended"], adhesive: ["acrylic"], moisture: "high" },
        highlights: ["통기·순응 PU 부직포", "땀 수분 저항", "장기 착용"],
      },
      {
        code: "Polyken 3570A",
        name: "Polyken™ 3570A",
        construction: "PET 부직포 + 의료급 아크릴",
        wearTime: "장기 (10~14일)",
        match: { wearTime: ["long", "extended"], adhesive: ["acrylic"] },
        highlights: ["통기 PET 부직포", "땀 수분 저항"],
      },
      {
        code: "Polyken 3355H",
        name: "Polyken™ 3355H (PE 폼)",
        construction: "PE 폼 + 고접착 아크릴",
        wearTime: "연장 착용",
        match: { deviceWeight: "heavy", wearTime: ["long", "extended"] },
        highlights: ["폼 쿠셔닝", "디바이스 무게 지지", "부드러운 탈착"],
      },
      {
        code: "Polyken 3428M",
        name: "Polyken™ 3428M (PU 양면)",
        construction: "PU 필름 + hi-tack 아크릴 양면",
        wearTime: "장기 착용",
        match: { wearTime: ["long", "extended"], application: ["cgm", "general"] },
        highlights: ["고통기 PU 필름", "빠른 초기 접착", "양면 구성"],
      },
    ],
  },
  {
    id: "scapa",
    name: "Scapa Healthcare",
    badge: "Scapa",
    note: "Soft-Pro(하이드로콜로이드·하이드로겔·아크릴)와 Bioflex 소재로 상처케어·디바이스 고정.",
    products: [
      {
        code: "Soft-Pro HC",
        name: "Soft-Pro® Hydrocolloid (Gen II)",
        construction: "겔 형성 하이드로콜로이드 (아크릴 화학)",
        wearTime: "다일 착용 + 흡수",
        match: { adhesive: ["hydrocolloid"], moisture: "high", application: ["wound", "cgm"] },
        highlights: ["고통기·고흡수", "오스토미·상처케어", "디바이스 고정"],
      },
      {
        code: "Soft-Pro Hydrogel",
        name: "Soft-Pro® Hydrogel",
        construction: "고형 폴리머 겔 (수분 함량 조절)",
        wearTime: "저자극 접촉",
        match: { skinType: ["sensitive", "neonatal"], adhesive: ["polyurethane_gel", "hydrocolloid"] },
        highlights: ["쿨링·수분 흡수", "접착강도 조절 가능"],
      },
      {
        code: "Soft-Pro Acrylic",
        name: "Soft-Pro® Acrylic",
        construction: "풀 스펙트럼 통기·접착 아크릴",
        wearTime: "단기~장기 선택",
        match: { adhesive: ["acrylic"], wearTime: ["mid", "long", "extended"] },
        highlights: ["감마·E-beam·EtO 멸균 호환", "통기·접착 범위 선택"],
      },
      {
        code: "Bioflex",
        name: "Bioflex® 소재 (폼·필름·부직포)",
        construction: "웨어러블/상처케어용 지지체 소재",
        wearTime: "구조 소재",
        match: { application: ["wound", "general"], deviceWeight: "heavy" },
        highlights: ["폼·필름·부직포 다양", "웨어러블·오스토미 응용"],
      },
    ],
  },
];

// 다른 파일에서 사용할 수 있도록 전역으로 노출
window.MEDTAPE_KB = { ADHESIVES, BACKINGS, COMPLIANCE_NOTES, VENDORS };
