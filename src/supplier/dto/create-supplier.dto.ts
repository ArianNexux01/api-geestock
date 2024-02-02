import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class CreateSupplierDto {


    @IsString()
    @IsNotEmpty()

    @ApiProperty({
        example: 'Frank',
    })
    name: string

    @IsNotEmpty()
    @ApiProperty({
        example: '0001',
    })
    code: string



}


