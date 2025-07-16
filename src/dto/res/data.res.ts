import { BaseResponse } from './base.res';

import {
    ApiExtraModels,
    ApiOkResponse,
    ApiProperty,
    getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators, NotFoundException, Type } from '@nestjs/common';

export class DataResponse<T> extends BaseResponse {
    @ApiProperty()
    data: T;

    constructor(data: T) {
        super();
        this.data = data;
    }
}
export type DataReply<T> = Promise<DataResponse<T>>;
export const ApiOkResponseData = <DataDto extends Type<unknown>>(
    dataDto: DataDto,
) =>
    applyDecorators(
        ApiExtraModels(DataResponse, dataDto),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(DataResponse) },
                    {
                        properties: {
                            data: {
                                type: 'object',
                                $ref: getSchemaPath(dataDto), // Define it as a single object (not array)
                            },
                        },
                    },
                ],
            },
        }),
    );
