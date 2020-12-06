import { Appuser } from './../entities/appuser';
import { UsersService } from './../providers/services/user.service';
import { Controller, Get, Param } from "@nestjs/common";

@Controller("user")
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  findAll(): Promise<Appuser[]> {
    return this.userService.findAll();
  }
}
