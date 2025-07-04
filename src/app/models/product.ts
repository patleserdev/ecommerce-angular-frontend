import { CategoryType } from "./categorie.js";

export type ProductVariationsType = {
  id?: number;
  gender: string;
  size: string;
  color: string;
  stock: number;
  // quantity:Number
};

export interface ProductType {
  id?:number,
  description: string;
  name: string;
  slug?:string;
  price: number;
  // quantity: Number;
  sku: string;
  category?: CategoryType;
  brand?: BrandType;
  variations?: ProductVariationsType[];
}

export interface CreateProductType {
  description: string;
  name: string;
  price: number;
  // quantity: Number;
  sku: string;
  category?: CategoryType;
  brand?: BrandType;
  variations?: ProductVariationsType[];
}

export interface UpdateProductType {
  description: string;
  name: string;
  price: number;
  // quantity: Number;
  sku: string;
  category?: CategoryType;
  brand?: BrandType;
  variations?: ProductVariationsType[];
}

export interface BrandType {
  id?: number;
  name: string;
  slug?: string;

}

export interface Child {
  id: number;
  name: string;
  parent_id: number;
  slug:string;
  products?: [];
}
