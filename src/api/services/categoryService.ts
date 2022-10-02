import { CategoryModel, Client, CreateCategoryModel, ICreateCategoryModel } from "src/api/client";
import { api } from "src/boot/axios";
import CONSTANTS from "src/utils/constants";
import ICategoryService from "../interfaces/categoryService";

class CategoryService implements ICategoryService {
  async createCategory(payload: ICreateCategoryModel): Promise<void> {
    const client = new Client(CONSTANTS.API_URL, api);
    await client.category_Create(new CreateCategoryModel(payload));
  }

  async getUserCategories(): Promise<CategoryModel[]> {
    const client = new Client(CONSTANTS.API_URL, api);
    const data = await client.category_GetUserCategories();
    return data;
  }
}

export default CategoryService;
