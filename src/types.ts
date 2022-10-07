export type pageType = 'home' | 'entrance' | 'shopping'
export type userType = 'nokodaisei' | 'general' | ''

export type entranceProps = {
  reserved: boolean;
  dates: number[];
  accompaniers: number;
}

export type shoppingProps = {
  reserved: boolean;
  whenToBuy: string;
  items: {
    id: number;
    amount: number;
  }[];
}

export type productType = {
  id: number
  name: string
  description: string
  unit: string
  imageUrl: string
  price: number
  stock: number
  limit: number
}