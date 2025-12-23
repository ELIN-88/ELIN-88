
import { SpotCategory, DayPlan } from './types';

export const INITIAL_ITINERARY: DayPlan[] = [
  {
    day: 1,
    date: '2026/1/11 (日)',
    title: '抵達．安頓．那霸夜',
    clothingTips: '1月均溫 15-20°C，建議洋蔥式穿法，晚上海風冷需薄外套。',
    weatherTips: '市區高樓風小，但海邊風力較強，體感溫度約低 2 度。',
    spots: [
      {
        id: '1-1',
        time: '16:50',
        category: SpotCategory.TRANSPORT,
        name: 'OTS 租車 (臨空豐崎店)',
        description: '抵達機場後搭乘接駁車前往租車處，辦理手續並確認保險。',
        tags: ['必拍租車合照', '核對護照'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=OTS+Rent+a+Car+Rinku+Toyosaki',
        address: '3-37 Toyosaki, Tomigusuku, Okinawa 901-0225日本',
        parkingInfo: '租車場內',
        gasInfo: 'OTS 隔壁有加油站',
        travelTime: '5 min',
        travelDistance: '1.5 km'
      },
      {
        id: '1-2',
        time: '18:00',
        category: SpotCategory.SHOPPING,
        name: 'iias 豐崎商場',
        description: '超市採買補給品：水、零食、酒精飲品。',
        tags: ['超市補給', '日系雜貨'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=iias+Okinawa+Toyosaki',
        address: '3-35 Toyosaki, Tomigusuku, Okinawa 901-0225日本',
        parkingInfo: '商場免費停車場',
        groupFriendly: true,
        travelTime: '25 min',
        travelDistance: '10.2 km'
      },
      {
        id: '1-3',
        time: '19:30',
        category: SpotCategory.HOTEL,
        name: '沖繩逸之彩飯店',
        description: '辦理 Check-in。晚上 20:30 有免費拉麵、啤酒無限暢飲。',
        tags: ['必喝啤酒', '拉麵宵夜'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Okinawa+Hinode+Hotel',
        address: '3 Chome-18-33 Makishi, Naha, Okinawa 900-0013日本',
        parkingInfo: '飯店停車場',
        photoTips: '大廳的和風燈籠背景很適合拍團體照'
      }
    ]
  },
  {
    day: 2,
    date: '2026/1/12 (一)',
    title: '北部．海洋與絕景',
    clothingTips: '北部海邊風大，建議穿著防風外套與好走運動鞋。',
    weatherTips: '注意古宇利島海風，建議戴帽子以免頭痛。',
    spots: [
      {
        id: '2-0',
        time: '08:30',
        category: SpotCategory.HOTEL,
        name: '沖繩逸之彩飯店 (出發)',
        description: '吃飽早餐，準備前往北部。',
        tags: ['元氣早餐'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Okinawa+Hinode+Hotel',
        address: '3 Chome-18-33 Makishi, Naha, Okinawa 900-0013日本',
        travelTime: '90 min',
        travelDistance: '82.5 km'
      },
      {
        id: '2-1',
        time: '10:30',
        category: SpotCategory.SIGHTS,
        name: '古宇利島南端觀景台',
        description: '欣賞跨海大橋最佳視角，感受沖繩藍。',
        tags: ['絕美海景', '大橋全景'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kouri+Island+Observatory',
        address: 'Kouri, 今歸仁村國頭郡沖繩縣 905-0406日本',
        travelTime: '5 min',
        travelDistance: '0.8 km'
      },
      {
        id: '2-2',
        time: '11:00',
        category: SpotCategory.FOOD,
        name: 'Shirasa 食堂',
        description: '名產海膽炒飯、海膽蓋飯，品嚐在地新鮮海味。',
        tags: ['海膽炒飯', '必吃午餐'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shirasa+Shokudo+Kouri',
        address: '176 Kouri, Nakijin, Kunigami District, Okinawa 905-0406日本',
        parkingInfo: '附設停車場',
        travelTime: '30 min',
        travelDistance: '20.5 km'
      },
      {
        id: '2-3',
        time: '12:30',
        category: SpotCategory.SIGHTS,
        name: '美麗海水族館',
        description: '巨大黑潮之海，鯨鯊震撼全場。',
        tags: ['必看鯨鯊', '海豚秀'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Okinawa+Churaumi+Aquarium',
        address: '424 Ishikawa, Motobu, Kunigami District, Okinawa 905-0206日本',
        parkingInfo: 'P7停車場',
        travelTime: '65 min',
        travelDistance: '51.5 km'
      },
      {
        id: '2-4',
        time: '16:00',
        category: SpotCategory.SHOPPING,
        name: '永旺來客夢 AEON Mall',
        description: '沖繩最大購物中心。',
        tags: ['購物衝刺', 'Workman'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=AEON+Mall+Okinawa+Rycom',
        address: '1番地 Raikamu, Kitanakagusuku, Nakagami District, Okinawa 901-2306日本',
        groupFriendly: true,
        travelTime: '35 min',
        travelDistance: '16.5 km'
      },
      {
        id: '2-5',
        time: '19:30',
        category: SpotCategory.HOTEL,
        name: '返回逸之彩飯店',
        description: '結束北部行程。',
        tags: ['辛苦了'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Okinawa+Hinode+Hotel',
        address: '3 Chome-18-33 Makishi, Naha, Okinawa 900-0013日本'
      }
    ]
  },
  {
    day: 3,
    date: '2026/1/13 (二)',
    title: '中部．懷舊美式風情',
    clothingTips: '今日穿著可以偏美式休閒。',
    weatherTips: '萬座毛斷崖邊風勢極大，拍照注意。',
    spots: [
      {
        id: '3-0',
        time: '09:00',
        category: SpotCategory.HOTEL,
        name: '沖繩逸之彩飯店 (出發)',
        description: '悠閒早餐後出發。',
        tags: ['充足睡眠'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Okinawa+Hinode+Hotel',
        address: '3 Chome-18-33 Makishi, Naha, Okinawa 900-0013日本',
        travelTime: '55 min',
        travelDistance: '44.2 km'
      },
      {
        id: '3-1',
        time: '10:30',
        category: SpotCategory.SIGHTS,
        name: '萬座毛 (Manzamo)',
        description: '著名的象鼻岩，一望無際的海景。',
        tags: ['必拍象鼻岩'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Manzamo',
        address: 'Onna, Kunigami District, Okinawa 904-0411日本',
        parkingInfo: '附設停車場',
        travelTime: '45 min',
        travelDistance: '32.5 km'
      },
      {
        id: '3-2',
        time: '11:50',
        category: SpotCategory.SHOPPING,
        name: 'Makeman Urasoe Main Branch',
        description: '大型連鎖工具店，愛好者必逛。',
        tags: ['工具店', '生活雜貨'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Makeman+Urasoe',
        address: '2008 Gusukuma, Urasoe, Okinawa 901-2133日本',
        parkingInfo: '大型免費停車場',
        travelTime: '20 min',
        travelDistance: '12.8 km'
      },
      {
        id: '3-3',
        time: '14:00',
        category: SpotCategory.ACTIVITY,
        name: '美國村 (American Village)',
        description: '異國風情街區，漫步夕陽海灘。',
        tags: ['美式風格', '大國藥妝'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mihama+American+Village',
        address: 'Mihama, Chatan, Nakagami District, Okinawa 904-0115日本',
        parkingInfo: '免費公共停車場',
        groupFriendly: true,
        travelTime: '30 min',
        travelDistance: '16.8 km'
      },
      {
        id: '3-4',
        time: '22:00',
        category: SpotCategory.ACTIVITY,
        name: 'Churasun6 秀',
        description: '在地特色表演，已預約附一杯飲品。',
        tags: ['精彩演出', '已預約'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Churasun6+Naha',
        address: 'Okinawa, Naha, Matsuyama, 1 Chome−5−1',
        groupFriendly: true
      }
    ]
  },
  {
    day: 4,
    date: '2026/1/14 (三)',
    title: '南部．秘境與回程',
    clothingTips: '穿著方便穿脫的鞋子。',
    weatherTips: '南部山谷內較涼。',
    spots: [
      {
        id: '4-0',
        time: '08:30',
        category: SpotCategory.HOTEL,
        name: '沖繩逸之彩飯店 (退房)',
        description: '辦理退房。',
        tags: ['退房'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Okinawa+Hinode+Hotel',
        address: '3 Chome-18-33 Makishi, Naha, Okinawa 900-0013日本',
        travelTime: '10 min',
        travelDistance: '3.2 km'
      },
      {
        id: '4-1',
        time: '09:00',
        category: SpotCategory.SIGHTS,
        name: '波上宮',
        description: '懸崖上的神社，祈求旅途平安。',
        tags: ['必買御守', '海上神社'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Naminoue+Shrine',
        address: '1 Chome-25-11 Wakasa, Naha, Okinawa 900-0031日本',
        parkingInfo: '神社旁停車場',
        travelTime: '35 min',
        travelDistance: '18.2 km'
      },
      {
        id: '4-2',
        time: '12:00',
        category: SpotCategory.ACTIVITY,
        name: 'Gangala 之谷',
        description: '鐘乳石山洞探索，洞穴咖啡必喝。',
        tags: ['巨大榕樹', '山洞咖啡'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Valley+of+Gangala',
        address: 'Maekawa-202 Tamagusuku, Nanjo, Okinawa 901-0616日本',
        parkingInfo: '園區停車場',
        travelTime: '15 min',
        travelDistance: '8.5 km'
      },
      {
        id: '4-3',
        time: '13:00',
        category: SpotCategory.FOOD,
        name: '系滿魚市場 (午餐)',
        description: '新鮮生魚片、烤海鮮。',
        tags: ['海鮮午餐', '魚市場'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Itoman+Fish+Market',
        address: '4 Chome-19 Nishizakicho, Itoman, Okinawa 901-0306日本',
        parkingInfo: '市場停車場',
        travelTime: '15 min',
        travelDistance: '5.2 km'
      },
      {
        id: '4-4',
        time: '14:10',
        category: SpotCategory.SHOPPING,
        name: 'コーナンPRO 豊見城豊崎店',
        description: '職人工具店，Outlet 對面。',
        tags: ['工具專門', '五金雜貨'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kohnan+PRO+Toyosaki',
        address: '1-420 Toyosaki, Tomigusuku, Okinawa 901-0225日本',
        parkingInfo: '附設停車場',
        travelTime: '5 min',
        travelDistance: '1.2 km'
      },
      {
        id: '4-5',
        time: '15:30',
        category: SpotCategory.SHOPPING,
        name: 'ASHIBINAA Outlet',
        description: '最後補貨採買。',
        tags: ['品牌特賣', 'Outlet'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=ASHIBINAA+Outlet',
        address: '1-188 Toyosaki, Tomigusuku, Okinawa 901-0225日本',
        travelTime: '15 min',
        travelDistance: '5.4 km'
      },
      {
        id: '4-6',
        time: '17:30',
        category: SpotCategory.TRANSPORT,
        name: 'OTS 還車 ＆ 機場',
        description: '完成還車，準備搭機。',
        tags: ['平安返家'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Naha+Airport',
        address: '150 Kagamizu, Naha, Okinawa 901-0142日本'
      }
    ]
  }
];
