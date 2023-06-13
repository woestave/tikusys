namespace API__Teacher {
  type TeacherRole = import('common-packages/constants/teacher-role').TeacherRole;
  interface TableStruct__Teacher {
    teacherId: number;
    teacherName: string;
    teacherPwd: string;
    teacherIdCard: string;
    teacherClass: null | number;
    teacherCreateTime: number;
    teacherStatus: 0 | 1 | 2 | 3;
    teacherRole: TeacherRole;
  }

  interface CreateOrUpdateReq extends Omit<TableStruct__Teacher, 'teacherPwd' | 'teacherCreateTime'> {}
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
    teacherName?: string | null;
    teacherClass?: number | null;
    teacherStatus?: number | null;
    teacherRole?: number | null;
  }
  interface ListRes {
    list: TableStruct__Teacher[];
    total: number;
  }


  interface ChangeClassReq {
    teacherId: number;
    targetClassId: number;
  }
  interface ChangeClassRes {
    succ: 1;
  }



  interface ChangeRoleReq {
    teacherId: number;
    targetRoleId: number;
  }
  interface ChangeRoleRes {
    succ: 1;
  }



  interface LoginReq {
    username: string;
    password: string;
  }
  interface LoginRes {
    succ: 1;
    token: string;
  }

  interface GetUserInfoRes {
    token: string;
    userInfo: {
      teacherId: TableStruct__Teacher['teacherId'];
      teacherClass: TableStruct__Teacher['teacherClass'];
      teacherCreateTime: TableStruct__Teacher['teacherCreateTime'];
      teacherName: TableStruct__Teacher['teacherName'];
      taecherRole: TableStruct__Teacher['teacherRole'];
      teacherStatus: TableStruct__Teacher['teacherStatus'];
    };
  }




  interface TeacherUpdatePasswordReq {
    oldPwd: string;
    newPwd: string;
  }
  interface TeacherUpdatePasswordRes {
    succ: 1;
  }
}
