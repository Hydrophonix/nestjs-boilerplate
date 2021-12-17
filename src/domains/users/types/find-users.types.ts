// Instruments
import { User } from "../user.schema";

export interface FindUsersResponse {
    count: number;
    results: User[];
}

export enum SortOrder {
    asc = "asc",
    desc = "desc",
}

export enum SortBy {
    username = "username",
    role = "role",
    id="_id",
    email="email",
}

export interface FindManyUsers {
    skip: number;
    limit: number;
    order: SortOrder;
    sort: SortBy;
}
