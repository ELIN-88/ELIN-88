
export enum TabType {
  OVERVIEW = 'overview',
  ITINERARY = 'itinerary',
  FOOD = 'food',
  SUPERMARKET = 'supermarket',
  MAP = 'map',
  GUIDE = 'guide',
  WEATHER = 'weather'
}

export enum SpotCategory {
  FOOD = '食物',
  ACTIVITY = '活動',
  SHOPPING = '購物',
  SIGHTS = '景點',
  HOTEL = '酒店',
  TRANSPORT = '交通'
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
  groupFriendly?: boolean; // 7-person friendly
  travelTime?: string;     // 到下一個點的車程時間 (例如: 15 min)
  travelDistance?: string; // 到下一個點的距離 (例如: 8.5 km)
}

export interface FoodItem {
  id: string;
  name: string;
  type: string; // 名店, 小吃, 點心, 必買
  time: string;
  mapUrl: string;
  tags: string[];
  groupFriendly: boolean;
  day: number; // 1, 2, 3, 4
  description: string;
}

export interface DayPlan {
  day: number;
  date: string;
  title: string;
  spots: Spot[];
  clothingTips: string;
  weatherTips: string;
}
