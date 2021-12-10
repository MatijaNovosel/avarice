import {
  Client,
  PageableCollectionOfTemplateModel,
  IAddTemplateDto,
  AddTemplateDto
} from "src/api/client";
import { api } from "src/boot/axios";
import CONSTANTS from "src/utils/constants";
import ITemplateService from "../interfaces/templateService";

class TemplateService implements ITemplateService {
  async create(payload: IAddTemplateDto): Promise<void> {
    const client = new Client(CONSTANTS.API_URL, api);
    await client.template_Add(new AddTemplateDto(payload));
  }
  async delete(id: number): Promise<void> {
    const client = new Client(CONSTANTS.API_URL, api);
    await client.template_Delete(id);
  }
  async getAll(): Promise<PageableCollectionOfTemplateModel> {
    const client = new Client(CONSTANTS.API_URL, api);
    const data = await client.template_Get(0, 25);
    return data;
  }
}

export default TemplateService;
