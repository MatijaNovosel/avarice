import { Appuser } from "src/entities/appuser";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Appuser)
    private appUserRepository: Repository<Appuser>
  ) {}

  async login(email: string, password: string): Promise<Appuser> {
    const repoUser: Appuser = await this.appUserRepository.findOne({
      where: { email }
    });
    if (!repoUser) {
      throw new HttpException("User was not found!", HttpStatus.NOT_FOUND);
    }
    bcrypt.compare(password, repoUser.password, function (err, result) {
      if (result == false) {
        throw new HttpException(
          "Passwords do not match!",
          HttpStatus.BAD_REQUEST
        );
      }
    });
    return repoUser;
  }

  async register(email: string, password: string): Promise<number> {
    let passwordHash: string;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (saltError, salt) => {
      bcrypt.hash(password, salt, (hashError, hash) => {
        passwordHash = hash;
      });
    });
    const user: Appuser = {
      email,
      password: passwordHash
    };
    this.appUserRepository.save(user);
    return user.id;
  }
}
