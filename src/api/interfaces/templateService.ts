import { IAddTemplateDto } from "src/api/client";
import { TemplateModel } from "src/models/template";

export default interface ITemplateService {
  getAll(): Promise<TemplateModel[]>;
  create(payload: IAddTemplateDto): Promise<void>;
  delete(id: number): Promise<void>;
}
