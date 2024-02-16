import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class CreateLogsActivityDto {


    @IsString()
    @ApiProperty({
        example: 'Criou um armazem',
    })
    description: string


    @IsNotEmpty()
    @ApiProperty({
        example: '12',
    })
    userId: string


}
