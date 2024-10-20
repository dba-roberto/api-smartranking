import { Document } from "mongoose";
import { DesafioStatus } from "./desafio-status.enum";
import { Jogador } from "src/jogadores/interfaces/jogador.interface";
import { Partida } from "src/partidas/interfaces/partida.interface";

export interface Desafio extends Document {

    dataHoraDesafio: Date;
    status: DesafioStatus;
    dataHoraSolicitacao: Date;
    dataHoraResposta: Date;
    solicitante: Jogador;
    categoria: string;
    jogadores: Array<Jogador>;
    partida: Partida

}