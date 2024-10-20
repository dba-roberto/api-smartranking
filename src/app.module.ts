import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';
import { DesafiosModule } from './desafios/desafios.module';
import { PartidasModule } from './partidas/partidas.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://dbaroberto:Kj9JXndtdMKZd5tF@cluster0.tudhydf.mongodb.net/smartranking?retryWrites=true&w=majority&appName=Cluster0',
    ),
    JogadoresModule,
    CategoriasModule,
    DesafiosModule,
    PartidasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
