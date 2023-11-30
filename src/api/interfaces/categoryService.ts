import { CategoryModel, CreateCategoryModel } from "src/models/category";

export default interface ICategoryService {
  getUserCategories(): Promise<CategoryModel[]>;
  createCategory(payload: CreateCategoryModel): Promise<void>;
}
