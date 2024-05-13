import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class Piece {

    name: string

    description: string

    price: number

    quantity: number

    series_number: string

    categoryId: string

    subcategoryId: string

    transportId: string
}
