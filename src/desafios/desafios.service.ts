import { AtribuirDesafioPartidaDto } from './../partidas/dtos/atribuir-desafio-partida.dto';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { PartidasService } from 'src/partidas/partidas.service';
import { InjectModel } from '@nestjs/mongoose';
import { Desafio } from './interfaces/desafio.interface';
import { Model } from 'mongoose';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { Partida } from 'src/partidas/interfaces/partida.interface';

@Injectable()
export class DesafiosService {

    constructor(
        @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
        private readonly jogadoresService: JogadoresService,
        private readonly categoriasService: CategoriasService,
        private readonly partidasService: PartidasService
    ) { }

    async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {

        const jogadores = criarDesafioDto.jogadores;

        const jogador1 = jogadores[0];
        const jogador2 = jogadores[1];

        if (jogador1) {

            await this.jogadoresService.consultarJogadoresPeloId(jogador1._id);
            await this.categoriasService.consultarCategoriaJogador(jogador1._id);

        };

        if (jogador2) {

            await this.jogadoresService.consultarJogadoresPeloId(jogador2._id);
            await this.categoriasService.consultarCategoriaJogador(jogador2._id);

        };

        const solicitante = criarDesafioDto.solicitante._id;

        const solicitanteEncontrado = jogadores.find(jogador => jogador._id == solicitante);

        if (!solicitanteEncontrado) {

            throw new BadRequestException(`Solicitante ${solicitante} não faz parte do Desafio!`);

        };

        const categoriaEncontrada = await this.categoriasService.consultarCategoriaJogador(solicitante);

        criarDesafioDto.dataHoraSolicitacao = new Date();
        criarDesafioDto.status = DesafioStatus.PENDENTE;
        criarDesafioDto.categoria = categoriaEncontrada[0].categoria;

        const desafioCriado = new this.desafioModel(criarDesafioDto);
        return await desafioCriado.save();

    };

    async consultarTodosDesafios(): Promise<Desafio[]> {
        return await this.desafioModel.find()
        .populate("solicitante")
        .populate("jogadores")
        .populate("partida")
        .exec();
    };

    async consultarDesafiosDeUmJogador(_id: any): Promise<Desafio[]> {

        const jogadorEncontrado = await this.desafioModel.find()
        .where('jogadores')
        .in(_id)
        .populate("solicitante")
        .populate("jogadores")
        .populate("partida")
        .exec();

        if (!jogadorEncontrado || jogadorEncontrado.length === 0) {

            throw new NotFoundException(`Jogador com id ${_id} não encontrado em nenhum Desafio.`);

        };

        return jogadorEncontrado;
    };

    async atualizarDesafios(_id: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<void> {

        const desafioEncontrado = await this.desafioModel.findOne({ _id }).exec();

        if (!desafioEncontrado) {

            throw new NotFoundException(`Desafio com o id: ${_id} não localizado.`);
        };

        const desafioStatus = DesafioStatus;
        const status = atualizarDesafioDto.status.toUpperCase();


        if (status !== desafioStatus.ACEITO && status !== desafioStatus.CANCELADO &&
            status !== desafioStatus.NEGADO) {

            throw new NotFoundException(`Status ${status} inválido.`);

        };

        atualizarDesafioDto.dataHoraSolicitacao = new Date();
        atualizarDesafioDto.status = status;


        await this.desafioModel.findByIdAndUpdate({ _id },
            { $set: atualizarDesafioDto }).exec();

    };

    async deletarDesafios(_id: string): Promise<void> {

        const desafioEncontrado = await this.desafioModel.findOne({ _id }).exec();

        if (!desafioEncontrado) {

            throw new NotFoundException(`Desafio com o id: ${_id} não localizado.`);
        };

        const status = DesafioStatus.CANCELADO;

        await this.desafioModel.findByIdAndUpdate({ _id },
            { $set: { status: status } }).exec();

    };

    async atribuirPartidaDesafio(_id: string, atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto): Promise<Partida> {

        const desafioEncontrado = await this.desafioModel.findOne({ _id }).exec();

        if (!desafioEncontrado) {

            throw new NotFoundException(`Desafio com o id: ${_id} não localizado.`);
        };

        const jogadores = desafioEncontrado.jogadores;

        const jogadorVencedor = atribuirDesafioPartidaDto.def._id;

        const jogadorEncontrado = jogadores.find(jogador => jogador._id == jogadorVencedor);

        if (!jogadorEncontrado) {

            throw new BadRequestException(`Jogador ${jogadorVencedor} não faz parte do Desafio!`);

        };

        atribuirDesafioPartidaDto.categoria = desafioEncontrado.categoria;
        atribuirDesafioPartidaDto.jogadores = desafioEncontrado.jogadores;

        const partida = await this.partidasService.atribuirPartida(atribuirDesafioPartidaDto);

        if (partida) {

            const desafioStatus = DesafioStatus;

            const atualizarDesafio = await this.desafioModel.findByIdAndUpdate({ _id },
                { $set: { partida: partida, status: desafioStatus.REALIZADO } }).exec();

            if (!atualizarDesafio) {
                throw new BadRequestException(`Desafio ${_id} não atualizado, Por favor, tente novamente.`)
            };

            return partida;

        };

    };

};

