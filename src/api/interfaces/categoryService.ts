import { CategoryModel, ICreateCategoryModel } from "src/api/client";

export default interface ICategoryService {
  getUserCategories(): Promise<CategoryModel[]>;
  createCategory(payload: ICreateCategoryModel): Promise<void>;
}
