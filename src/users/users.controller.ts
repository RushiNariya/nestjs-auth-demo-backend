import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @Auth()
  @SuccessMessage('users fetched successfully')
  async allUsers() {
    return this.userService.getAllUses();
  }

  @Get(':id')
  @Auth()
  @SuccessMessage('user by id fetched successfully')
  async userById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }
}
