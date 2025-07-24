export type CategoryMediasType={
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
export interface CategoryType {
  id: number;
  name: string;
  parent_id: number;
  slug: string;
  products: [];
  medias?:CategoryMediasType[]
}

export interface CategoryToSelectType {
  label: string;
  value: number;
}

export type CategoryWithChildren = CategoryType & { children?: CategoryType[] };
