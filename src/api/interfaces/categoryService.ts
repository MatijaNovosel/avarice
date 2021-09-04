import { CategoryModel, CreateCategoryModel } from "src/api/client";

export default interface ICategoryService {
  getUserCategories(): Promise<CategoryModel[]>;
  createCategory(payload: CreateCategoryModel): Promise<void>;
}
