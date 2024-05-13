import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class CreatePieceDto {


    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Frank',
    })
    name: string


    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Armazem de vendas',
    })
    description: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        example: 1000,
    })
    price: number

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 10,
    })
    target: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "10",
    })
    partNumber: string

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 10,
    })
    min: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '0001',
    })
    categoryId: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '001',
    })
    subCategoryId: string


    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Teste, LDA',
    })
    supplierId: string


    @IsEnum({
        encomendada: "Removido",
        disponivel: "Disponivel"
    })

    @IsNotEmpty()
    @ApiProperty({
        example: 'Teste, LDA',
    })
    state: string


    @IsString()
    @ApiProperty({
        example: '001',
    })
    userId: string


    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Teste, LDA',
    })
    brand_name: string


    @ApiProperty({
        example: 'Teste, LDA',
    })
    series_number: string


}


