import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class CreateOrderDto {


    @IsString()
    @ApiProperty({
        example: 'Armazem de vendas',
    })
    description: string


    @IsNotEmpty()
    @ApiProperty({
        example: 'Angola',
    })
    imbl_awb: string


    @IsNotEmpty()
    @ApiProperty({
        example: 'Luanda',
    })
    pieceId: string


    @IsNotEmpty()
    @ApiProperty({
        example: 10,
    })
    quantity: number


}


