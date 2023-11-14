import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class Order {

    @ApiProperty({
        example: 'Frank',
    })
    description: string


    @ApiProperty({
        example: '0100',
    })
    imbl_awb: string


    @ApiProperty({
        example: 10,
    })
    quantity: number


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
