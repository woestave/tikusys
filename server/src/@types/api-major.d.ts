namespace API__Major {
  interface TableStruct__Major {
    majorId: number;
    majorName: string;
  }

  type ListReq = null;
  interface ListRes {
    list: TableStruct__Major[];
  }
}

