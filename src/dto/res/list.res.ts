import {
    ApiProperty,
    ApiExtraModels,
    ApiOkResponse,
    getSchemaPath,
} from '@nestjs/swagger';
import { BaseResponse } from './base.res';
import { applyDecorators, Type } from '@nestjs/common';

export class ListResponseData<T> {
    @ApiProperty({ isArray: true })
    result: T[];

    @ApiProperty({ type: Number, example: 10 })
    total: number;
}

export class ListResponse<T> extends BaseResponse {
    @ApiProperty()
    data: ListResponseData<T>;

    constructor(result: T[], total: number) {
        super();
        this.data = {
            result: result?.length ? result : [],
            total: total ? total : 0,
        };
    }
}

export const ApiOkResponseList = <DataDto extends Type<unknown>>(
    dataDto: DataDto,
) =>
    applyDecorators(
        ApiExtraModels(ListResponse, dataDto),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ListResponse) },
                    {
                        properties: {
                            data: {
                                type: 'object',
                                properties: {
                                    result: {
                                        type: 'array',
                                        items: { $ref: getSchemaPath(dataDto) },
                                    },
                                    total: {
                                        type: 'number',
                                        example: 10,
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        }),
    );

export type ListReply<T> = Promise<ListResponse<T>>;
