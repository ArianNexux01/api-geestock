import { ApiParam, PartialType } from '@nestjs/swagger';
import { CreateWarehouseDto } from './create-warehouse.dto';
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { Exclude } from 'class-transformer';

export class UpdateWarehouseDto extends CreateWarehouseDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Frank, LDA.',
    })
    id: string

    @IsOptional()
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
