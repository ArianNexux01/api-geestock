import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class CreateTransportDto {


    @IsString()
    @ApiProperty({
        example: 'Truck',
    })
    name: string

    @IsNotEmpty()
    @ApiProperty({
        example: '0001',
    })
    code: string


}


