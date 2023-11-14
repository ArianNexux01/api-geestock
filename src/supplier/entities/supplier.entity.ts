import { ApiProperty } from "@nestjs/swagger"

export class Supplier {

    @ApiProperty({
        example: 'Frank',
    })
    name: string

    @ApiProperty({
        example: '0001',
    })
    code: string

}
