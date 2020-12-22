import { Financialhistory } from "./../entities/financialhistory";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOperator, MoreThanOrEqual, Repository } from "typeorm";
import { format } from "date-fns";

interface FilterValues {
  appUserId: number;
  createdAt?: FindOperator<string>;
}

interface Filter {
  where: FilterValues;
}

@Injectable()
export class FinancialHistoryService {
  constructor(
    @InjectRepository(Financialhistory)
    private financialHistoryRepository: Repository<Financialhistory>
  ) {}

  async findByUserId(id: number, month?: number): Promise<Financialhistory[]> {
    const filterObject: Filter = {
      where: {
        appUserId: id
      }
    };
    if (month) {
      filterObject.where.createdAt = MoreThanOrEqual(
        `2020-${month}-00 00:00:00`
      );
    }

    const data = await this.financialHistoryRepository.find(filterObject);
    return data.map((fh) => {
      fh.total = fh.checking + fh.gyro + fh.pocket + fh.euroVal;
      fh.createdAt = format(new Date(fh.createdAt), "dd.MM.yyyy. HH:mm:ss");
      return fh;
    });
  }
}
