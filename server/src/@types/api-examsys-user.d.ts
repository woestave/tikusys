// import { TeacherRole } from 'common-packages/constants/teacher-role';

namespace API__Examsys__User {
  interface GetUserInfoRes {
    token: string;
    userInfo: {
      studentId: number;
      studentClass: number | null;
      studentCreateTime: number;
      studentName: string;
      studentStatus: API__Student.TableStruct__Student['studentStatus'];
    };
  }


  interface LoginReq {
    username: string;
    password: string;
  }
  interface LoginRes {
    succ: 1;
    token: string;
  }


  interface LogoutRes {
    succ: 1;
  }





  interface UpdatePasswordReq {
    oldPwd: string;
    newPwd: string;
  }
  interface UpdatePasswordRes {
    succ: 1;
  }



  /** 获取`我的考试信息` */
  interface GetMyExamRes {
    list: Array<API__Examination.TableStruct__Examination & {
      /** 这次考试学生是否参与 */
      myExamResult: API__ExamResult.TableStruct__ExamResult | null;
    }>;
  }




  /**
   * 通过考试id获取考试信息详情
   */
  interface GetExamDetailReq {
    id: number;
  }
  interface GetExamDetailRes extends API__Examination.TableStruct__Examination {}


  /**
   * 通过试卷id查询该试卷所属的题列表
   */
  interface GetStudentExamTiListReq {
    exampaperId: number;
    examinationId: number;
  }
  interface GetStudentExamTiListRes {
    tiList: API__Tiku.TableStructWithExaming[];
  }



  interface GetMyExamResultReq {
    id: number;
  }
  type GetMyExamResultRes = (Omit<API__ExamResult.TableStruct__ExamResult, 'examResultAnswerInfo'> & {
    examResultAnswerInfo: API__ExamResult.ExamResultAnswerInfoParsed;
  }) | null;


  interface RemoveMyExamResultReq {
    /**
     * examinationId
     */
    id: number;
  }
  interface RemoveMyExamResultRes {
    succ: 1;
  }
}
