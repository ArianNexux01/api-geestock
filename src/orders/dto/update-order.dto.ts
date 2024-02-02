import { ApiParam, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { Exclude } from 'class-transformer';

export class UpdateOrderDto extends CreateOrderDto {
    @IsString()
    @IsNotEmpty()

    @ApiProperty({
        example: 'Frank, LDA.',
    })
    id: string

    @Exclude()
    created_at: Date
    @Exclude()
    updated_at: Date
}
