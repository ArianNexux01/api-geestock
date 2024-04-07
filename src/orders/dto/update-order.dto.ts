import { ApiParam, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { Exclude } from 'class-transformer';

export class UpdateOrderDto extends CreateOrderDto {
    @IsString()
    @IsNotEmpty()

    @ApiProperty({
        example: 'Frank, LDA.',
    })
    id: string


    @ApiProperty({
        example: 'Frank, LDA.',
    })
    userId: string

    @IsOptional()
    @IsString()
    @ApiProperty()
    isActive: boolean

    @Exclude()
    created_at: Date
    @Exclude()
    updated_at: Date
}
