import { CreateTemplateModel, TemplateModel } from "src/models/template";

export default interface ITemplateService {
  getAll(): Promise<TemplateModel[]>;
  create(payload: CreateTemplateModel): Promise<void>;
  delete(id: number): Promise<void>;
}
