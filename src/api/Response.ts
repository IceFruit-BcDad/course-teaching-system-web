import {ResultCode} from "@/api/ResultCode";

export interface Response {
    code: ResultCode;
    message: string;
    success: boolean;
}

/**
 *
 */
export interface DataResponse<T> extends Response {
    data: T;
}

export interface DtoList<T> {
    limit: number;
    offset: number;
    total: number;
    totalPages: number;
    list: T[];
}

export interface ListResponse<T> extends Response {
    data: DtoList<T>;

}