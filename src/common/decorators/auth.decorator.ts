import { applyDecorators, UseGuards } from '@nestjs/common';
import { AtGuard } from '../guards/At.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Auth(): MethodDecorator {
  return applyDecorators(UseGuards(AtGuard), ApiBearerAuth());
}
