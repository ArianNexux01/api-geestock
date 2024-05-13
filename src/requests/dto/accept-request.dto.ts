import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class AcceptRequestDTO {


    @IsArray()
    @IsNotEmpty()
    @ApiProperty({
        example: [
            {
                number_series: ["33", "30"],
                pieceId: "001",
                quantityGiven: 10

            }
        ],
    })
    pieceData: {
        number_series: string[]
        quantityGiven: number
        pieceWarehouseId: string
    }[]

    @IsString()
    @ApiProperty({
        example: "001"
    })
    userId: string


}


