import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class CreateSubcategoryDto {


    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(80)
    @ApiProperty({
        example: 'Frank',
    })
    name: string


    @IsString()
    @ApiProperty({
        example: "001"
    })
    userId: string


    @IsString()
    @ApiProperty({
        example: 'Armazem de vendas',
    })
    categoryId: string

    @IsNotEmpty()
    @ApiProperty({
        example: '0001',
    })
    code: string





}


