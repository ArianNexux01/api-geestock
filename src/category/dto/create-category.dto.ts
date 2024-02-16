import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class CreateCategoryDto {


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
    userId: string


    @IsNotEmpty()
    @ApiProperty({
        example: '0001',
    })
    code: string




}


