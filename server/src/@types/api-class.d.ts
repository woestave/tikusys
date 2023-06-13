namespace API__Class {
  interface TableStruct__Class {
    id: number;
    className: string;
    classMajor: number;
    classType: API__ClassType.TableStruct__ClassType['id'];
    createTime: number;
    classTeacher: number[];
  }

  interface ListReq extends API__BaseTypes.Pagination {}
  interface ListRes {
    list: Array<TableStruct__Class & {
      studentCount: number;
    }>;
    total: number;
  }

  interface CreateOrUpdateReq extends Omit<TableStruct__Class, 'createTime'> {}
  interface CreateOrUpdateRes {
    succ: 1 | 0;
    type: 'create' | 'update';
  }

  interface CreateReq extends CreateOrUpdateReq {}
  interface CreateRes {
    succ: 1 | 0;
  }


  interface UpdateReq extends CreateOrUpdateReq {}
  interface UpdateRes {
    succ: 1 | 0;
  }



  interface RemoveReq {
    id: number;
  }
  interface RemoveRes {
    succ: number;
  }
}

