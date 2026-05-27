// Base paging interface
export interface BasePaging {
  pageNumber: number;
  pageSize: number;
}

// Input data interface - all properties are optional
export interface BasePagingInput {
  pageNumber?: number;
  pageSize?: number;
}

// Factory function with proper typing
export const createBasePaging = (data: BasePagingInput = {}): BasePaging => ({
  pageNumber: data.pageNumber || 1,
  pageSize: data.pageSize || 10,
});

export default createBasePaging;
