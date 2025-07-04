export interface CategoryType {
  id: number;
  name: string;
  parent_id: number;
  slug: string;
  products: [];
}

export type CategoryWithChildren = CategoryType & { children?: CategoryType[] };