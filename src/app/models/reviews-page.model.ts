import { Review } from './review.model';

export default class ReviewsPage {
  public content: Review[];
  public pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageSize: number;
    pageNumber: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  public totalPages: number;
  public totalElements: number;
  public last: boolean;
  public first: boolean;
  public sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  public size: number;
  public number: number;
  public numberOfElements: number;
  public empty: boolean;
}
