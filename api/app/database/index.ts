import {ITableList} from '../services/database';
import * as UsersTable from './users-table.json';
import * as BooksTable from './books-table.json';

export const Tables: ITableList = {
    "users": JSON.parse(JSON.stringify(UsersTable)),
    "books": JSON.parse(JSON.stringify(BooksTable))
};