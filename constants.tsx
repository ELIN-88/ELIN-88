
import { SpotCategory, DayPlan, FoodItem, SupermarketItem } from './types';

export const FEATURED_FOOD: FoodItem[] = [
  {
    id: 'f-reg-1', day: 1, name: '那霸美食搜尋', type: '區域搜尋', time: '全天',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Naha+Food',
    tags: ['那霸'], groupFriendly: true,
    description: '搜尋那霸市區/國際通 IG 熱門餐廳。', recommended: '暖暮拉麵 / 傑克牛排 / 國際通屋台村'
  },
  {
    id: 'f-reg-2', day: 2, name: '北部名護搜尋', type: '區域搜尋', time: '全天',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nago+Food',
    tags: ['名護'], groupFriendly: true,
    description: '搜尋名護、古宇利島在地美食。', recommended: 'Shirasa食堂 / 蝦蝦飯 / 阿古豬'
  },
  {
    id: 'f-reg-3', day: 3, name: '中部北谷搜尋', type: '區域搜尋', time: '全天',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Chatan+Food',
    tags: ['北谷'], groupFriendly: true,
    description: '美國村與北谷異國美食搜尋。', recommended: '豬肉蛋飯糰 / 塔可飯 / 迴轉壽司'
  }
];

export const INITIAL_ITINERARY: DayPlan[] = [
  {
    day: 1, date: '1/11 (日)', title: '抵達．安頓',
    clothingTips: '洋蔥式穿法，內層薄長袖', weatherTips: '均溫 18°C',
    spots: [
      { id: '1-1', time: '16:50', category: SpotCategory.TRANSPORT, name: 'OTS 租車接駁', description: '抵達機場後搭乘接駁車前往領車。', tags: ['OTS'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=OTS+Rent+a+Car+Toyosaki', address: '3-37 Toyosaki, Tomigusuku' },
      { id: '1-2', time: '17:40', category: SpotCategory.SHOPPING, name: 'iias 豐崎商場', description: '購物與採買零食。', tags: ['購物'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=iias+Okinawa+Toyosaki', address: '3-35 Toyosaki, Tomigusuku' },
      { id: '1-3', time: '19:10', category: SpotCategory.HOTEL, name: '那霸逸之彩飯店', description: 'Check-in (Check-out 11:00)。10:00-22:00 啤酒/冰淇淋無限。20:30-21:30 免費拉麵。', tags: ['飯店'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Okinawa+Hinode+Hotel', address: '3-18-33 Makishi, Naha' },
      { id: '1-4', time: '19:30', category: SpotCategory.FOOD, name: 'Happy Hour / 國際通', description: '飯店免費暢飲或國際通自由覓食。', tags: ['啤酒'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kokusai+Dori', address: 'Naha, Okinawa' },
      { id: '1-5', time: '21:00', category: SpotCategory.FOOD, name: '宵夜：飯店拉麵', description: '飯店免費宵夜拉麵。', tags: ['宵夜'], mapUrl: '', address: '' }
    ]
  },
  {
    day: 2, date: '1/12 (一)', title: '北部絕景 ⚠️國定假日',
    clothingTips: '防風外套必備', weatherTips: '海邊風強',
    spots: [
      { id: '2-1', time: '08:00', category: SpotCategory.TRANSPORT, name: '飯店準時出發', description: '避開塞車。', tags: ['準時'], mapUrl: '', address: '3 Chome-18-33 Makishi, Naha' },
      { id: '2-2', time: '09:30', category: SpotCategory.SIGHTS, name: '古宇利島 (心形岩)', description: '看海/心形岩。', tags: ['絕景'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kouri+Island', address: 'Kouri, Nakijin' },
      { id: '2-3', time: '10:30', category: SpotCategory.FOOD, name: 'Shirasa 食堂', description: '海膽炒飯、海膽蓋飯。名護必吃。', tags: ['必吃'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shirasa+Shokudo', address: '176 Kouri, Nakijin' },
      { id: '2-4', time: '11:00', category: SpotCategory.SIGHTS, name: '美麗海水族館', description: '避開團客潮，建議先上網預約。', tags: ['必訪'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Churaumi+Aquarium', address: '424 Ishikawa, Motobu' },
      { id: '2-5', time: '15:40', category: SpotCategory.SHOPPING, name: '永旺來客夢 AEON Mall', description: 'Workman 購物 + 吃飯。', tags: ['購物'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Aeon+Mall+Rycom', address: '1 Raikamu, Kitanakagusuku' }
    ]
  },
  {
    day: 3, date: '1/13 (二)', title: '中部購物＋SHOW',
    clothingTips: '休閒放鬆', weatherTips: '氣溫舒適',
    spots: [
      { id: '3-1', time: '09:30', category: SpotCategory.TRANSPORT, name: '飯店出發', description: '開始中部行程。', tags: ['出發'], mapUrl: '', address: '3 Chome-18-33 Makishi, Naha' },
      { id: '3-2', time: '10:10', category: SpotCategory.SIGHTS, name: '萬座毛', description: '象鼻岩絕景拍照。', tags: ['景點'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Manzamo', address: 'Onna, Kunigami' },
      { id: '3-3', time: '11:50', category: SpotCategory.SHOPPING, name: 'Makeman 浦添店', description: '專業五金工具店。', tags: ['五金'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Makeman+Urasoe', address: '2008 Gusukuma, Urasoe' },
      { id: '3-4', time: '14:00', category: SpotCategory.ACTIVITY, name: '美國村 (16:50日落)', description: '逛街與欣賞日落。', tags: ['夕陽'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=American+Village', address: 'Mihama, Chatan' },
      { id: '3-5', time: '22:00', category: SpotCategory.ACTIVITY, name: 'Churasun6 表演', description: '已預約。22:30 開始含一杯飲品。那霸松山1-5-1', tags: ['已預約'], isReserved: true, mapUrl: 'https://www.google.com/maps/search/?api=1&query=Churasun6+Naha', address: '1-5-1 Matsuyama, Naha' }
    ]
  },
  {
    day: 4, date: '1/14 (三)', title: '南部觀光．返台',
    clothingTips: '保暖登機', weatherTips: '注意海風',
    spots: [
      { id: '4-1', time: '08:30', category: SpotCategory.HOTEL, name: '退房出發', description: '準備最後一天，退房手續。', tags: ['退房'], mapUrl: '', address: '' },
      { id: '4-2', time: '09:00', category: SpotCategory.SIGHTS, name: '波上宮', description: '市區海灘神社。', tags: ['神社'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Naminoue+Shrine', address: '1-25-11 Wakasa, Naha' },
      { id: '4-3', time: '10:00', category: SpotCategory.SIGHTS, name: '前海軍總部洞穴', description: '歷史遺跡。', tags: ['歷史'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Old+Navy+Headquarters', address: '236 Tomigusuku' },
      { id: '4-4', time: '11:40', category: SpotCategory.ACTIVITY, name: 'Gangala 之谷', description: '預約 12:00。需出示 QR。', tags: ['預約QR'], showQRCode: true, mapUrl: 'https://www.google.com/maps/search/?api=1&query=Valley+of+Gangala', address: 'Maekawa-202 Tamagusuku, Nanjo' },
      { id: '4-5', time: '13:00', category: SpotCategory.FOOD, name: '糸滿魚市場', description: '海鮮午餐。', tags: ['海鮮'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Itoman+Fish+Market', address: '4-19 Nishizakicho, Itoman' },
      { id: '4-6', time: '14:10', category: SpotCategory.SHOPPING, name: 'ASHIBINAA / Conan PRO', description: 'Outlet 或工具店擇一。', tags: ['購物'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=ASHIBINAA+Outlet', address: '1-188 Toyosaki, Tomigusuku' },
      { id: '4-7', time: '16:40', category: SpotCategory.TRANSPORT, name: 'OTS 還車', description: '加滿油還車。旁邊有加油站。', tags: ['還車'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=OTS+Rent+a+Car+Toyosaki', address: '3-37 Toyosaki, Tomigusuku' },
      { id: '4-8', time: '17:45', category: SpotCategory.TRANSPORT, name: '抵達機場', description: '逛免稅店。', tags: ['歸途'], mapUrl: '', address: '150 Kagamizu, Naha' }
    ]
  }
];

export const DEFAULT_SUPERMARKETS: SupermarketItem[] = [
  { 
    id: 's1', 
    day: 1, 
    name: 'Union 牧志店 (飯店對面)', 
    type: '超市', 
    openingHours: '24小時', 
    paymentMethods: ['現金', '信用卡', 'PayPay'], 
    description: '飯店正對面，24小時營業，補貨最方便。', 
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Union+Makishi' 
  },
  { 
    id: 's2', 
    day: 2, 
    name: 'San-A V21 安里店', 
    type: '超市', 
    openingHours: '09:00 - 23:00', 
    paymentMethods: ['現金', '信用卡', 'Edy', 'PayPay'], 
    description: '步行約 5-8 分鐘。熟食品項非常豐富。', 
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=San-A+V21+Asato' 
  },
  { 
    id: 's3', 
    day: 3, 
    name: 'MaxValu 牧志店', 
    type: '超市', 
    openingHours: '24小時', 
    paymentMethods: ['現金', '信用卡', 'WAON', 'AEON Pay'], 
    description: '步行約 10 分鐘。AEON 旗下超市，適合採買藥妝零食。', 
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=MaxValu+Makishi' 
  }
];
