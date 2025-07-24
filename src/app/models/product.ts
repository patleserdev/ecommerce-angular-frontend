import { BrandType } from "./brands";
import { CategoryType } from "./categorie";

export type ProductMediasType={
  altText:string,
  description:string,
  height:number,
  id:string,
  position:number
  role:string,
  title:string,
  url:string,
  width: number
}
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
  medias?:ProductMediasType[]
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
