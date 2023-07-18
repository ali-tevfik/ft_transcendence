import {Module} from '@nestjs/common';
import {GameService} from './game.service';
import {GameController} from './game.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GameEntity} from '../typeorm/game.entity';
import { GatewayModule } from '../gateway/gateway.module';


@Module({
    imports: [TypeOrmModule.forFeature([GameEntity]), GatewayModule],
    providers: [GameService],
    controllers: [GameController],
    exports: [GameService]
})
export class GameModule {

}
