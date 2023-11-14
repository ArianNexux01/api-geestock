import { ApiParam, PartialType } from '@nestjs/swagger';
import { CreateTransportDto } from './create-transport.dto';
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { Exclude } from 'class-transformer';

export class UpdateTransportDto extends CreateTransportDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(9)
    @MaxLength(15)
    @ApiProperty({
        example: 'Truck.',
    })
    id: string

    @Exclude()
    created_at: Date
    @Exclude()
    updated_at: Date
}
