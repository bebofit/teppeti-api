export interface IDBQueryOptions {
  pojo?: boolean;
  includeDeleted?: boolean;
  page?: number;
  pageSize?: number;
  sort?: string; // space delimited list of field names, the sort order of each field is ascending unless the path name is prefixed with - which will be treated as descending, ex: name -price createdAt
  search?: string;
  new?: boolean;
  trx?: any;
}
