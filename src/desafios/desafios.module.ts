import { DesafioSchema } from './interfaces/desafio.schema';
import { Module } from '@nestjs/common';
import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { JogadoresModule } from 'src/jogadores/jogadores.module';
import { PartidasModule } from 'src/partidas/partidas.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Desafio', schema: DesafioSchema }]),
    CategoriasModule,
    JogadoresModule,
    PartidasModule
    ],
  controllers: [DesafiosController],
  providers: [DesafiosService]
})
export class DesafiosModule { }
