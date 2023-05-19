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

  interface CreateReq extends Omit<TableStruct__Teacher, 'teacherPwd' | 'teacherCreateTime'> {}
  interface CreateRes {
    succ: 1;
  }

  interface ListReq {}
  interface ListRes {
    list: TableStruct__Teacher[];
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
}
