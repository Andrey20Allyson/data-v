export class PageInfo {
  constructor(
    readonly pageIndex: number = 0,
    readonly pageSize: number = 20,
  ) { }

  take(size: number): PageInfo {
    return new PageInfo(
      this.pageIndex,
      size,
    );
  }

  page(index: number): PageInfo {
    return new PageInfo(
      index,
      this.pageSize,
    );
  }

  getOffset(): number {
    return this.pageIndex * this.pageSize;
  }
}
