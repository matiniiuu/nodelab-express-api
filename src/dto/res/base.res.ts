import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
    @ApiProperty({ example: 'Success' })
    message: string = 'Success';
}
