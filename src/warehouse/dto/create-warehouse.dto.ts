import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

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


    @IsString()
    @ApiProperty({
        example: 'Armazem de vendas',
    })
    userId: string

    @IsOptional()
    @ApiProperty({
        example: 'Angola',
    })
    country: string

    @IsOptional()
    @ApiProperty({
        example: 'Luanda',
    })
    province: string

    @IsOptional()
    @ApiProperty({
        example: 'Luanda, Angola, Rua da Mutamba',
    })
    address: string

    @IsNotEmpty()
    @ApiProperty({
        example: '0001',
    })
    code: string

    @IsOptional()
    @ApiProperty({
        example: 'Neither',
    })
    embarcationType: string

    @IsOptional()
    @ApiProperty({
        example: 'Angola',
    })
    flag: string

    @IsOptional()
    @ApiProperty({
        example: 'Teste, LDA',
    })
    company: string

    @IsOptional()
    @ApiProperty({
        example: 12,
    })
    capacity: number

    @IsEnum({
        armazem: "Armazém",
        embarcacao: "Embarcação"
    })
    @IsOptional()
    @ApiProperty({
        example: "fixo",
    })
    type: string

}


