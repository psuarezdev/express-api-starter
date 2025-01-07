import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class UtilsService {
  async mapToDto<T>(data: any, dtoClass: new () => T) {
    const dto = plainToClass(dtoClass, data, { excludeExtraneousValues: true });
    const validationErrors = await validate(dto as object);

    const errors: { [key: string]: string[] } = {};

    validationErrors.forEach(error => {
      if (!error.constraints) return;
      errors[error.property] = Object.values(error.constraints);
    });

    return { dto, errors };
  }
}
