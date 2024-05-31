import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateLocationPieceDto {


    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'My location',
    })
    location: string

}


