import { CategoryModel } from "src/api/client";

export default interface ICategoryService {
  getUserCategories(): Promise<CategoryModel[]>;
}
