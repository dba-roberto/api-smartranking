import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {

    //private jogadores: Jogador[] = [];

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) { }

    private readonly logger = new Logger(JogadoresService.name)

    async criarJogador(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {

        const { email } = criaJogadorDto;

        //const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email)

        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

        if (jogadorEncontrado) {
            throw new BadRequestException(`Jogador com e-mail ${email} já cadastrado`);
        }

        const jogadorCriado = new this.jogadorModel(criaJogadorDto)
        return await jogadorCriado.save();
    }

    async atualizarJogador(_id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {

        //const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email)

        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`)
        }
        await this.jogadorModel.findOneAndUpdate({ _id },
            { $set: atualizarJogadorDto }).exec();


    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        //return await this.jogadores;
        return await this.jogadorModel.find().exec();
    }

    async consultarJogadoresPeloId(_id: string): Promise<Jogador> {

        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`)
        }

        return jogadorEncontrado;
    }

    async deletarJogador(_id): Promise<any> {
        /*
        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email)
        this.jogadores = this.jogadores.filter(jogador => jogador.email !== jogadorEncontrado.email)
        */

        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com Id ${_id} não encontrado`)
        }
        return await this.jogadorModel.deleteOne({ _id }).exec();
    }

    //    private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {

    //        const jogadorCriado = new this.jogadorModel(criarJogadorDto)
    //        return await jogadorCriado.save()

    /*
    const { nome, telefoneCelular, email } = criarJogadorDto;
    const jogador: Jogador = {
        //_id: uuidv4(),
        nome,
        telefoneCelular,
        email,
        ranking: 'A',
        posicaoRanking: 1,
        urlFotoJogador: 'www.google.com.br/foto123.jpg'
    };

    this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`)
    this.jogadores.push(jogador);
    */
    //    }

    //    private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {

    //        return await this.jogadorModel.findOneAndUpdate({ email: criarJogadorDto.email }, { $set: criarJogadorDto }).exec();

    /*
    const { nome } = criarJogadorDto;
    jogadorEncontrado.nome = nome;
    */
    //    }
}
