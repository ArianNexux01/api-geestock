import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class Warehouse {
   
    @ApiProperty({
        example: 'Frank',
    })
    name: string


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

    @ApiProperty({
        example: '0001',
    })
    code: string

}
