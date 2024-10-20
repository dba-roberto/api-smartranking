import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { Partida } from './interfaces/partida.interface';

@Controller('api/v1/partidas')
export class PartidasController {

    constructor(private readonly partidasService: PartidasService) { }

    @Get()
    @UsePipes(ValidationPipe)
    async consultarTodasPartidas(): Promise<Partida[]> {
        return this.partidasService.consultarTodasPartidas();
    };

}
