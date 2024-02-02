import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class CreateWarehouseDto {


    @IsString()
    @IsNotEmpty()

    @ApiProperty({
        example: 'Frank',
    })
    name: string

    @IsString()
    @ApiProperty({
        example: 'Armazem de vendas',
    })
    description: string

    @ApiProperty({
        example: 'Angola',
    })
    country: string

    @ApiProperty({
        example: 'Luanda',
    })
    province: string

    @ApiProperty({
        example: 'Luanda, Angola, Rua da Mutamba',
    })
    address: string

    @IsNotEmpty()
    @ApiProperty({
        example: '0001',
    })
    code: string


    @ApiProperty({
        example: 'Neither',
    })
    embarcationType: string

    @ApiProperty({
        example: 'Angola',
    })
    flag: string

    @ApiProperty({
        example: 'Teste, LDA',
    })
    company: string

    @ApiProperty({
        example: 12,
    })
    capacity: number


    @IsEnum({
        armazem: "Armazém",
        embarcacao: "Embarcação"
    })
    @ApiProperty({
        example: "fixo",
    })
    type: string

}


