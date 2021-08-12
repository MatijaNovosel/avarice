import { Account } from "src/api/client";

export default interface IAccountService {
  getLatestValues(): Promise<Account[]>;
}
