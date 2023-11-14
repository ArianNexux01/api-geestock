import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class Transport {

    @ApiProperty({
        example: 'Frank',
    })
    name: string


    @ApiProperty({
        example: '0001',
    })
    code: string

}
