import { ApiParam, PartialType } from '@nestjs/swagger';
import { CreateSupplierDto } from './create-supplier.dto';
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { Exclude } from 'class-transformer';

export class UpdateSupplierDto extends CreateSupplierDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(9)
    @MaxLength(15)
    @ApiProperty({
        example: 'Frank, LDA.',
    })
    id: string

    @Exclude()
    created_at: Date
    @Exclude()
    updated_at: Date
}
