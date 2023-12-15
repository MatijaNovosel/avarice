import { api } from "src/boot/axios";
import { CategoryModel, CreateCategoryModel } from "src/models/category";
import ICategoryService from "../interfaces/categoryService";

class CategoryService implements ICategoryService {
  async createCategory({ color, icon, name, parentId }: CreateCategoryModel): Promise<void> {
    const {
      data: {
        data: { createCategory }
      }
    } = await api.post("", {
      query: `mutation {
        createCategory(data: {
          color: "${color}",
          icon: "${icon}",
          name: "${name}",
          parentId: "${parentId}"
        }) {
          id 
        }
      }`
    });
    return createCategory.id;
  }

  async getUserCategories(): Promise<CategoryModel[]> {
    const {
      data: {
        data: { getUserCategories }
      }
    } = await api.post("", {
      query: `query {
        getUserCategories {
          id,
          color,
          name,
          system,
          icon,
          parent {
            id,
            name
          }
        }
      }`
    });
    return getUserCategories as CategoryModel[];
  }
}

export default CategoryService;
