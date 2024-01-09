import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class Request {

    name: string

    description: string

    price: number

    quantity: number

    series_number: string

    warehouseId: string

    categoryId: string

    subcategoryId: string

    transportId: string

    request: {
        pieceId: string
        quantity: number
    }
}
