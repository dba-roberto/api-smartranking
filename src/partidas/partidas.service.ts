import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Partida } from './interfaces/partida.interface';

@Injectable()
export class PartidasService {
    constructor(
        @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    ) { }

    async atribuirPartida(atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto): Promise<Partida> {

        const partidaCriada = new this.partidaModel(atribuirDesafioPartidaDto);
        return await partidaCriada.save();
    };

    async consultarTodasPartidas(): Promise<Partida[]> {
        return this.partidaModel.find().exec();
    };

}
