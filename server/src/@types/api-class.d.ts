namespace API__Class {
  interface TableStruct__Class {
    id: number;
    className: string;
    classMajor: number;
    classType: API__ClassType.TableStruct__ClassType['id'];
    createTime: number;
    classTeacher: number[];
  }

  interface ListReq {}
  interface ListRes {
    list: TableStruct__Class[];
  }

  interface CreateReq extends Omit<TableStruct__Class, 'createTime'> {}
  interface CreateRes {}
}

