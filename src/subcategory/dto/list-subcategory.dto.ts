import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class ListSubcategoryDto {

    id: string
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
        example: 'Armazem de vendas',
    })
    category: {
        id: string
        name: string
        code: string
    }

    @IsNotEmpty()
    @ApiProperty({
        example: '0001',
    })
    code: string
    created_at: Date
    updated_at: Date

    @IsOptional()
    isActive?: boolean
}


