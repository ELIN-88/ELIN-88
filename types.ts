
export enum TabType {
  OVERVIEW = 'overview',
  ITINERARY = 'itinerary',
  FOOD = 'food',
  SUPERMARKET = 'supermarket',
  GUIDE = 'guide',
  EXPENSES = 'expenses'
}

export enum SpotCategory {
  FOOD = '食物',
  ACTIVITY = '活動',
  SHOPPING = '購物',
  SIGHTS = '景點',
  HOTEL = '酒店',
  TRANSPORT = '交通'
}

export enum ExpenseCategory {
  BREAKFAST = '早餐',
  LUNCH = '午餐',
  DINNER = '晚餐',
  SNACK = '點心',
  LATE_NIGHT = '宵夜',
  DRINK = '飲品',
  TOY = '玩具',
  SOUVENIR = '伴手禮',
  OTHER = '其他'
}

export interface ExpenseItem {
  id: string;
  date: string;
  name: string;
  category: ExpenseCategory;
  amountJpy: number;
  amountTwd: number;
  taxIncluded: boolean;
  paymentMethod: '現金' | '信用卡';
  note: string;
  photo?: string;
  createdAt: number;
}

export interface Spot {
  id: string;
  time: string;
  category: SpotCategory;
  name: string;
  description: string;
  tags: string[];
  mapUrl: string;
  address: string;
  parkingInfo?: string;
  gasInfo?: string;
  photoTips?: string;
  groupFriendly?: boolean;
  isReserved?: boolean;
  showQRCode?: boolean;
  isPaid?: boolean;
  isPendingPayment?: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  type: string;
  time: string;
  mapUrl: string;
  tags: string[];
  groupFriendly: boolean;
  day: number;
  description: string;
  recommended: string; 
}

export interface SupermarketItem {
  id: string;
  name: string;
  type: '超市' | '便利商店' | '藥妝店';
  openingHours: string;
  paymentMethods: string[];
  description: string;
  mapUrl: string;
  day: number;
  travelTime?: string;
  travelDistance?: string;
}

export interface DayPlan {
  day: number;
  date: string;
  title: string;
  spots: Spot[];
  clothingTips: string;
  weatherTips: string;
}

export interface TimeWeather {
  temp: string;
  icon: string;
  desc: string;
}

export interface WeatherForecast {
  date: string;
  morning: TimeWeather;
  noon: TimeWeather;
  night: TimeWeather;
  clothingTip: string;
}
