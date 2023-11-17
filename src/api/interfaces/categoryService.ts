import { ICreateCategoryModel } from "src/api/client";
import { CategoryModel } from "src/models/category";

export default interface ICategoryService {
  getUserCategories(): Promise<CategoryModel[]>;
  createCategory(payload: ICreateCategoryModel): Promise<void>;
}
