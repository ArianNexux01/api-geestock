import { ApiParam, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { Exclude } from 'class-transformer';

export class UpdateCategoryDto extends CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Frank, LDA.',
    })
    id: string

    @IsOptional()
    @IsString()
    @ApiProperty()
    isActive: boolean

    @Exclude()
    created_at: Date
    @Exclude()
    updated_at: Date
}
