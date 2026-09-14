import { Pageable } from "./pageable";
import { Sort } from "./sort";

export interface Page<T> {
  content: T[];

  pageable: Pageable;

  totalPages: number;
  totalElements: number;

  last: boolean;
  first: boolean;

  size: number;
  number: number;

  sort: Sort;

  numberOfElements: number;
  empty: boolean;
}
