import { IPaginationOptions } from '../types';

function extractPaginationOptions(
  obj: Record<string, string>
): IPaginationOptions {
  const { page, pageSize, sort, search } = obj;
  return {
    page: (Number(page) || 1) - 1,
    pageSize: Math.min(Number(pageSize) || 25, 250),
    sort: sort || '_id',
    search: search || null
  };
}

export { extractPaginationOptions };
