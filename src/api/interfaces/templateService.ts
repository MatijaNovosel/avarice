import { IAddTemplateDto, PageableCollectionOfTemplateModel } from "src/api/client";

export default interface ITemplateService {
  getAll(): Promise<PageableCollectionOfTemplateModel>;
  create(payload: IAddTemplateDto): Promise<void>;
  delete(id: number): Promise<void>;
}
