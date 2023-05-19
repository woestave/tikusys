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

  interface CreateReq extends Omit<TableStruct__Student, 'studentPwd' | 'studentCreateTime'> {}
  interface CreateRes {
    succ: 1;
  }

  interface ListReq {}
  interface ListRes {
    list: TableStruct__Student[];
  }


  interface ChangeClassReq {
    studentId: number;
    targetClassId: number;
  }
  interface ChangeClassRes {
    succ: 1;
  }
}
