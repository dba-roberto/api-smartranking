import { IsDateString, IsNotEmpty } from "class-validator";

export class AtualizarDesafioDto {
    dataHoraSolicitacao: any;

    @IsNotEmpty()
    status: string;
};