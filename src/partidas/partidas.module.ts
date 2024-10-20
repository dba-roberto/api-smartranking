import { PartidaSchema } from './interfaces/partida.schema';
import { Module } from '@nestjs/common';
import { PartidasController } from './partidas.controller';
import { PartidasService } from './partidas.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Partida', schema: PartidaSchema }]),
  ],
  controllers: [PartidasController],
  providers: [PartidasService],
  exports: [PartidasService]
})
export class PartidasModule { }