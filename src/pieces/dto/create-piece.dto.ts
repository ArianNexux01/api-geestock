import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class CreatePieceDto {


    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(80)
    @ApiProperty({
        example: 'Frank',
    })
    name: string

    @IsString()
    @IsNotEmpty()
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
    @IsNotEmpty()
    @ApiProperty({
        example: 10,
    })
    quantity: number


    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '0001',
    })
    warehouseId: string

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
    @IsNotEmpty()
    @ApiProperty({
        example: 'Teste, LDA',
    })
    transportId: string


    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Teste, LDA',
    })
    supplierId: string


    @IsEnum({
        encomendada: "Encomendada",
        disponivel: "Disponivel"
    })
    @IsNotEmpty()
    @ApiProperty({
        example: 'Teste, LDA',
    })
    state: string


    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Teste, LDA',
    })
    brand_name: string


    @ApiProperty({
        example: 'Teste, LDA',
    })
    series_number: string

}


