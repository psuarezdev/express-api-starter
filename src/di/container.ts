import { Container } from 'inversify';

import { UserService } from '@/user/user.service';
import { UtilsService } from '@/shared/utils.service';
import { JwtService } from '@/shared/jwt.service';

import '@/auth/auth.controller';

const container = new Container();

container.bind('UtilsService').to(UtilsService).inSingletonScope();
container.bind('JwtService').to(JwtService).inSingletonScope();
container.bind('UserService').to(UserService).inSingletonScope();

export default container;
