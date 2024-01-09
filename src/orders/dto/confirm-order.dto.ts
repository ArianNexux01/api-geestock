import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class ConfirmOrderDTO {

    @IsNotEmpty()
    @ApiProperty({
        example: 10,
    })
    pieceData: [{
        pieceId: string
        priceOfEachPiece: number,
        quantity: number
    }]


}


