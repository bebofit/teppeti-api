export interface IPaginationOptions {
  page: number;
  pageSize: number;
  sort: string; // space delimited list of field names, the sort order of each field is ascending unless the path name is prefixed with - which will be treated as descending, ex: name -price createdAt
  search: string;
}
