import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class CreateAlertDto {


    @IsString()
    @ApiProperty({
        example: 'A Peça x atingiu o seu limite minimo',
    })
    description: string


    @IsNotEmpty()
    @ApiProperty({
        example: '12',
    })
    warehouseId: string

    @IsNotEmpty()
    @ApiProperty({
        example: '12',
    })
    pieceId: string

}
