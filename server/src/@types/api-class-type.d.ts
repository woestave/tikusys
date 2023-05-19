namespace API__ClassType {
  interface TableStruct__ClassType {
    id: number;
    classTypeName: string;
  }

  type ListReq = null;
  interface ListRes {
    list: TableStruct__ClassType[];
  }
}

