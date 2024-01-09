import { ApiParam, PartialType } from '@nestjs/swagger';
import { CreateRequestDTO } from './create-request.dto';
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { Exclude } from 'class-transformer';

export class UpdateRequestDTO extends CreateRequestDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(9)
    @ApiProperty({
        example: 'Frank, LDA.',
    })
    id: string
    @IsNotEmpty()
    @ApiProperty({
        example: 'Frank, LDA.',
    })
    name: string


    @Exclude()
    created_at: Date
    @Exclude()
    updated_at: Date
}
