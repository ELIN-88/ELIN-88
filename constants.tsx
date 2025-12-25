
import { SpotCategory, DayPlan, FoodItem, SupermarketItem } from './types';

export const FEATURED_FOOD: FoodItem[] = [
  {
    id: 'f1', day: 1, name: '那霸市區 & 國際通美食', type: '區域搜尋', time: '全天',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Naha+Food',
    tags: ['那霸', '國際通', 'IG熱門'], groupFriendly: true,
    description: '搜尋那霸市區最新的 IG 打卡店。', recommended: '暖暮拉麵 / 傑克牛排 / 幸福鬆餅'
  },
  {
    id: 'f2', day: 2, name: '名護 & 古宇利島美食', type: '區域搜尋', time: '全天',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nago+Kouri+Food',
    tags: ['名護', '古宇利', '海景'], groupFriendly: true,
    description: '北部廣域搜尋，海景餐車與阿古豬名店。', recommended: '蝦蝦飯 / 百年古家 / 岸本食堂'
  },
  {
    id: 'f3', day: 3, name: '北谷 & 美國村美食', type: '區域搜尋', time: '全天',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Chatan+American+Village+Food',
    tags: ['北谷', '美國村', '中部'], groupFriendly: true,
    description: '中部打卡餐廳與異國風情美食。', recommended: '飯糰 / 塔可飯 / 藍海咖啡'
  },
  {
    id: 'f4', day: 4, name: '糸滿 & 沖繩南部美食', type: '區域搜尋', time: '全天',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Itoman+Southern+Okinawa+Food',
    tags: ['糸滿', '南部', '鮮魚'], groupFriendly: true,
    description: '南部魚市場與隱藏海味。', recommended: '生魚片 / 焗烤龍蝦 / 洞穴咖啡'
  }
];

export const INITIAL_ITINERARY: DayPlan[] = [
  {
    day: 1, date: '2026/1/11 (日)', title: '抵達．安頓．那霸夜',
    clothingTips: '洋蔥式穿法，內層薄長袖。', weatherTips: '1月均溫 15-20°C。',
    spots: [
      { id: '1-1', time: '16:50', category: SpotCategory.TRANSPORT, name: 'OTS 租車接駁', description: '抵達機場後搭乘接駁車。', tags: ['OTS'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=OTS+Rent+a+Car+Toyosaki', address: '3-37 Toyosaki, Tomigusuku' },
      { id: '1-2', time: '17:40', category: SpotCategory.SHOPPING, name: 'iias 豐崎商場', description: '超市採買補給。', tags: ['超市'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=iias+Okinawa+Toyosaki', address: '3-35 Toyosaki, Tomigusuku' },
      { id: '1-3', time: '19:10', category: SpotCategory.HOTEL, name: '那霸逸之彩飯店', description: 'Check-in。20:30 宵夜。', tags: ['飯店'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Okinawa+Hinode+Hotel', address: '3-18-33 Makishi, Naha' }
    ]
  },
  {
    day: 2, date: '2026/1/12 (一)', title: '北部絕景 (國定假日)',
    clothingTips: '防風外套必備，海邊風強。', weatherTips: '海邊風強。',
    spots: [
      { id: '2-0', time: '08:00', category: SpotCategory.HOTEL, name: '飯店出發', description: '準時出發前往北部。', tags: ['準時'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Okinawa+Hinode+Hotel', address: '3-18-33 Makishi, Naha' },
      { id: '2-1', time: '09:30', category: SpotCategory.SIGHTS, name: '古宇利島', description: '跨海大橋。', tags: ['絕景'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kouri+Island', address: 'Kouri, Nakijin, Kunigami District' },
      { id: '2-1.5', time: '10:00', category: SpotCategory.FOOD, name: 'Shirasa 食堂', description: '名物海膽炒飯。', tags: ['海膽'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shirasa+Shokudo', address: '176 Kouri, Nakijin' },
      { id: '2-2', time: '11:00', category: SpotCategory.SIGHTS, name: '美麗海水族館', description: '黑潮之海。', tags: ['必訪'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Churaumi+Aquarium', address: '424 Ishikawa, Motobu' },
      { id: '2-3', time: '16:00', category: SpotCategory.SHOPPING, name: '永旺來客夢', description: 'Workman 購物。', tags: ['購物'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Aeon+Mall+Rycom', address: '1 Raikamu, Kitanakagusuku' }
    ]
  },
  {
    day: 3, date: '2026/1/13 (二)', title: '中部購物．表演秀',
    clothingTips: '輕鬆穿搭，可穿帽T。', weatherTips: '氣溫舒適。',
    spots: [
      { id: '3-1', time: '10:10', category: SpotCategory.SIGHTS, name: '萬座毛', description: '象鼻岩。', tags: ['景點'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Manzamo', address: 'Onna, Kunigami District' },
      { id: '3-2', time: '11:50', category: SpotCategory.SHOPPING, name: 'Makeman 浦添店', description: '專業工具店。', tags: ['職人'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Makeman+Urasoe', address: '2008 Gusukuma, Urasoe' },
      { id: '3-3', time: '14:00', category: SpotCategory.ACTIVITY, name: '美國村', description: '逛街日落。', tags: ['夕陽'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=American+Village', address: 'Mihama, Chatan, Nakagami District' },
      { id: '3-4', time: '22:00', category: SpotCategory.ACTIVITY, name: 'Churasun6 表演', description: '已預約。', tags: ['已預約'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Churasun6', address: '1-5-1 Matsuyama, Naha' }
    ]
  },
  {
    day: 4, date: '2026/1/14 (三)', title: '南部秘境．返台',
    clothingTips: '輕便保暖，方便返程。', weatherTips: '早晚涼。',
    spots: [
      { id: '4-1', time: '10:00', category: SpotCategory.SIGHTS, name: '波上宮', description: '懸崖神社。', tags: ['神社'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Naminoue+Shrine', address: '1-25-11 Wakasa, Naha' },
      { id: '4-1.5', time: '11:40', category: SpotCategory.FOOD, name: '糸滿魚市場', description: '海鮮午餐首選！推薦焗烤龍蝦與現切生魚片。', tags: ['海鮮', '午餐'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Itoman+Fish+Market', address: '4-20 Nishizakicho, Itoman' },
      { id: '4-2', time: '13:30', category: SpotCategory.SIGHTS, name: 'Gangala之谷', description: '洞穴咖啡與遠古森林，12:00 已預約。', tags: ['預約'], isReserved: true, mapUrl: 'https://www.google.com/maps/search/?api=1&query=Gangala+Valley', address: 'Maekawa-202, Tamagusuku, Nanjo' },
      { id: '4-2.5', time: '15:20', category: SpotCategory.SHOPPING, name: '工具店 コーナンPRO', description: '專業職人工具採買。', tags: ['工具'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Konan+PRO+Toyosaki', address: '1-420 Toyosaki, Tomigusuku' },
      { id: '4-3', time: '15:40', category: SpotCategory.SHOPPING, name: 'ASHIBINAA Outlet', description: '最後購物衝刺。', tags: ['購物'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=ASHIBINAA', address: '1-188 Toyosaki, Tomigusuku' },
      { id: '4-4', time: '17:00', category: SpotCategory.TRANSPORT, name: '還車 & 機場', description: '準備返台，提前還車。', tags: ['還車'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=OTS+Rent+a+Car+Toyosaki', address: '3-37 Toyosaki, Tomigusuku' }
    ]
  }
];

export const DEFAULT_SUPERMARKETS: SupermarketItem[] = [
  { id: 's3', day: 1, name: 'Union 牧志店 (飯店正對面)', type: '超市', openingHours: '24小時營業', paymentMethods: ['現金'], description: '飯店出門過馬路即達，24H 在地補給最強首選。', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Union+Makishi' },
  { id: 's-h1', day: 1, name: '大國藥妝 國際通店 (飯店旁)', type: '藥妝店', openingHours: '10:00-23:00', paymentMethods: ['信用卡', 'PayPay'], description: '飯店步行 5 分鐘，免稅藥妝一站購足。', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Daikoku+Drug+Makishi' },
  { id: 's1', day: 1, name: 'San-A iias 豐崎店', type: '超市', openingHours: '10:00-21:00', paymentMethods: ['信用卡', 'PayPay'], description: '第一天租完車首站，大型購物中心補給。', mapUrl: 'https://www.google.com/maps/search/?api=1&query=San-A+iias' },
  { id: 's2', day: 2, name: 'AEON 名護店', type: '超市', openingHours: '09:00-22:00', paymentMethods: ['信用卡'], description: '北部回程順路，超市大且品項豐富。', mapUrl: 'https://www.google.com/maps/search/?api=1&query=AEON+Nago' },
  { id: 's4', day: 4, name: 'MaxValu 那霸機場店', type: '超市', openingHours: '07:00-24:00', paymentMethods: ['信用卡'], description: '回國前最後一站，適合買零食伴手禮。', mapUrl: 'https://www.google.com/maps/search/?api=1&query=MaxValu+Airport' }
];
