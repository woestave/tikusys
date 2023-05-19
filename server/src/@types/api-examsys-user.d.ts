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

  /** 获取`我的考试信息` */
  interface GetMyExamRes {
    list: API__Examination.TableStruct__Examination[];
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
  interface GetTiListByPaperIdReq {
    id: number;
  }
  interface GetTiListByPaperIdRes {
    tiList: API__Tiku.TableStruct__Tiku[];
  }



  interface GetMyExamResultReq {
    id: number;
  }
  interface GetMyExamResultRes extends API__ExamResult.TableStruct__ExamResult {}


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