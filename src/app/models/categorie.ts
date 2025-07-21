export interface CategoryType {
  id: number;
  name: string;
  parent_id: number;
  slug: string;
  products: [];
}

export interface CategoryToSelectType {
  label: string;
  value: number;
}

export type CategoryWithChildren = CategoryType & { children?: CategoryType[] };
