import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class CreateWarehouseDto {

    
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
    @MinLength(4)
    @ApiProperty({
        example: 'Armazem de vendas',
    })
    description: string
    
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(60)
    @ApiProperty({
        example: 'Angola',
    })
    country: string
    
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(15)
    @ApiProperty({
        example: 'Luanda',
    })
    province: string

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @ApiProperty({
        example: 'Luanda, Angola, Rua da Mutamba',
    })
    address: string
    
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(15)
    @ApiProperty({
        example: '0001',
    })
    code: string

}
