import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class CreateRequestDTO {


    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Armazem de vendas',
    })
    name: string


    //Incomming é o armazem que tem a peça
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Armazem de vendas',
    })
    warehouseIdIncomming: string

    //Outcomming é o armazem que pede a peça
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 1000,
    })
    warehouseIdOutcomming: string

    @IsNotEmpty()
    @ApiProperty({
        example: [{
            pieceId: "0001",
            quantity: 10
        },
        {
            pieceId: "0002",
            quantity: 5
        }
        ],
    })
    request: {
        pieceId: string
        quantity: number
    }

    @IsString()
    @ApiProperty({
        example: "10",
        default: "Disponivel"
    })
    state: string

    @IsNotEmpty()
    @ApiProperty({
        example: '001',
    })
    numberPr: string


    @IsString()
    @ApiProperty({
        example: "001"
    })
    userId: string

}


