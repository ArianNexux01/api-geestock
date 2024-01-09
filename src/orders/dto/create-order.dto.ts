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

    @ApiProperty({
        example: '0010LA011',
    })
    reference: string

    @IsString()
    @ApiProperty({
        example: '0010LA011',
    })
    number_order: string

    @IsNotEmpty()
    @ApiProperty({
        example: [{
            pieceId: "0001",
            quantity: 10,
            price: 19
        }],
    })
    request: {
        pieceId: string,
        quantity: number,
        price: number
    }



    @ApiProperty({
        example: 'Finalizada',
    })
    state: string


}


