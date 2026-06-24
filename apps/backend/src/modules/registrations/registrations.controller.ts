import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { ResponseTransformInterceptor } from '../../common/interceptors/response-transform.interceptor';

@ApiTags('Registrations')
@Controller('registrations')
@UseInterceptors(ResponseTransformInterceptor)
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Dang ky khoa hoc (khong can login)' })
  create(@Body() dto: CreateRegistrationDto) {
    return this.registrationsService.create(dto);
  }
}
