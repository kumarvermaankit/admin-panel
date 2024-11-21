export interface IParentCategory {
  id: number;
  title: string;
}

export interface ICategory {
  id: number;
  title: string;
  parent: IParentCategory | null;
}

export interface ICategoryVariables {
  id?: int;
  title: string;
  parent_id?: int;
}
