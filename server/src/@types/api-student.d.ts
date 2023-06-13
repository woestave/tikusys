namespace API__Student {
  interface TableStruct__Student {
    studentId: number;
    studentName: string;
    studentPwd: string;
    studentIdCard: string;
    studentClass: null | number;
    studentCreateTime: number;
    studentStatus: 0 | 1 | 2 | 3;
  }

  interface CreateOrUpdateReq extends Omit<TableStruct__Student, 'studentPwd' | 'studentCreateTime'> {}
  interface CreateOrUpdateRes {
    succ: 1 | 0;
    type: 'create' | 'update';
  }

  interface CreateReq extends CreateOrUpdateReq {}
  interface CreateRes {
    succ: 1;
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

  interface ListReq extends API__BaseTypes.Pagination {
    studentName?: string | null;
    studentClass?: number | null;
    studentStatus?: number | null;
  }
  interface ListRes {
    list: TableStruct__Student[];
    total: number;
  }


  interface ChangeClassReq {
    studentId: number;
    targetClassId: number;
  }
  interface ChangeClassRes {
    succ: 1;
  }
}
