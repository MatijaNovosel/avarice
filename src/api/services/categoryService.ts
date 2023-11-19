import { Client, CreateCategoryModel, ICreateCategoryModel } from "src/api/client";
import { api } from "src/boot/axios";
import { CategoryModel } from "src/models/category";
import ICategoryService from "../interfaces/categoryService";

class CategoryService implements ICategoryService {
  async createCategory(payload: ICreateCategoryModel): Promise<void> {
    const client = new Client(process.env.API_URL, api);
    await client.category_Create(new CreateCategoryModel(payload));
  }

  async getUserCategories(): Promise<CategoryModel[]> {
    const {
      data: {
        data: { getUserCategories }
      }
    } = await api.post(`${process.env.API_URL}/graphql`, {
      query: `query {
        getUserCategories {
          id,
          color,
          name,
          system,
          icon
        }
      }`
    });

    return getUserCategories as CategoryModel[];
  }
}

export default CategoryService;
