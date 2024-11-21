import { FormInstance } from "antd";
import { ICategory } from "../../categories/types";
import { IMedia } from "../../media/types/mediaInterfaces";

export interface IProduct {
  id: int;
  category_id: int;
  categories: ICategory;
  media: IMedia;
  variants: IVariant[];
}

export interface IProductVariables {
  id?: number;
  price?: number;
  category_id: number;
  media: IMedia;
  variants: IVariantVariables[];
  productIds?: number[];
}

export interface IVariant {
  id?: number;
  title?: string;
  price: number;
  sku: string;
  product?: IProduct;
  media?: IMedia;
}

export interface IVariantVariables {
  id?: number;
  media: Imedia | null;
  price: number;
  product_id: number;
  sku: string;
}

export interface IProductOptionsVariable {
  name: string;
  values: string[];
}

export interface ProductOptionsContextProps {
  options: IProductOptionsVariable[];
  variants: IVariantVariables[];
  optionForm: FormInstance;
  variantForm: FormInstance;
  addOption: () => void;
  deleteOption: (index: number) => void;
  updateOption: (index: number, option: IProductOptionsVariable) => void;
  handleSkuChange: (index: number, value: string) => void;
  handlePriceChange: (index: number, value: number) => void;
  handleImageChange: (index: number, value: IMedia) => void;
}
