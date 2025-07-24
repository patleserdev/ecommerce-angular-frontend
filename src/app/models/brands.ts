export type BrandMediasType={
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

export interface BrandType {
  id?: number;
  name: string;
  slug?: string;
  medias?:BrandMediasType[]
}

export interface BrandToSelectType {
  label:string,
  value:number
}


