import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class ConfirmOrderDTO {

    @IsNotEmpty()
    @ApiProperty({
        example: 10,
    })
    pieceData: [{
        pieceId: string
        quantity: number,
        locationInWarehouse: string
        price: number

    }]

    @IsBoolean()
    @ApiProperty({
        example: "id"
    })
    isPartial: boolean

    @IsString()
    @ApiProperty({
        example: "id"
    })
    warehouseId: string

    @IsString()
    @ApiProperty({
        example: "id"
    })
    userId: string

}


