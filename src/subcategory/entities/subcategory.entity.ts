import { ApiProperty } from "@nestjs/swagger"

export class Subcategory {

    @ApiProperty({
        example: 'Frank',
    })
    name: string


    @ApiProperty({
        example: 'Armazem de vendas',
    })
    categoryId: string

    @ApiProperty({
        example: '0001',
    })
    code: string

}
