import { ApiParam, PartialType } from '@nestjs/swagger';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { Exclude } from 'class-transformer';

export class UpdateSubcategoryDto extends CreateSubcategoryDto {

    @ApiProperty({
        example: 'Frank, LDA.',
    })
    id: string

    @Exclude()
    created_at: Date
    @Exclude()
    updated_at: Date
}
