import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { AtribuirDesafioPartidaDto } from 'src/partidas/dtos/atribuir-desafio-partida.dto';
import { Partida } from 'src/partidas/interfaces/partida.interface';

@Controller('api/v1/desafios')
export class DesafiosController {

    constructor(private readonly desafiosService: DesafiosService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async criarDesafio(
        @Body() criarDesafioDto: CriarDesafioDto): Promise<Desafio> {

        return await this.desafiosService.criarDesafio(criarDesafioDto);

    };

    @Post('/:_id/partida')
    @UsePipes(ValidationPipe)
    async atribuirPartidaDesafio(@Body() atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
        @Param('_id', ValidacaoParametrosPipe) _id: string
    ): Promise<Partida> {

        return await this.desafiosService.atribuirPartidaDesafio(_id, atribuirDesafioPartidaDto);
    };

    @Get()
    @UsePipes(ValidationPipe)
    async consultarTodosDesafios(): Promise<Desafio[]> {

        return this.desafiosService.consultarTodosDesafios();

    };

    @Get('jogador/:_id')
    @UsePipes(ValidationPipe)
    async consultarDesafiosDeUmJogador(
        @Param('_id', ValidacaoParametrosPipe) _id: string
    ): Promise<Desafio[]> {
        return this.desafiosService.consultarDesafiosDeUmJogador(_id);

    };

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarDesafios(
        @Body() atualizarDesafioDto: AtualizarDesafioDto,
        @Param('_id', ValidacaoParametrosPipe
        ) _id: string
    ): Promise<any> {
        await this.desafiosService.atualizarDesafios(_id, atualizarDesafioDto);
    };

    @Delete('/:_id')
    async deletarDesafios(
        @Param('_id', ValidacaoParametrosPipe) _id: string): Promise<void> {
        this.desafiosService.deletarDesafios(_id);
    };

}
