import { BrandType } from "./brands";
import { CategoryType } from "./categorie";

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



export interface Child {
  id: number;
  name: string;
  parent_id: number;
  slug:string;
  products?: [];
}
