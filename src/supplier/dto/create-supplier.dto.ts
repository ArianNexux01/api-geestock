import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class CreateSupplierDto {


    @IsString()
    @IsNotEmpty()

    @ApiProperty({
        example: 'Frank',
    })
    name: string

    @IsString()
    @ApiProperty({
        example: "001"
    })
    userId: string


    @IsNotEmpty()
    @ApiProperty({
        example: '0001',
    })
    code: string


}


