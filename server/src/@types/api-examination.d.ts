/**
 * 考试模块
 */
namespace API__Examination {


  /**
   * examination的表结构
   */
  interface TableStruct__Examination {
    id: number;
    examName: string;
    examDesc: null | string;
    examClassIds: number[];
    examExampaperId: number;
    examDate: number;
    examDuration: number;
    createTime: number;
    createBy: number;
    examIsRepeatable?: 0 | 1;
    examApproveStatus?: 0 | 1 | 2;
    examApprovedBy?: API__Teacher.TableStruct__Teacher['teacherId'];
  }


  interface CreateReq extends Omit<TableStruct__Examination, 'createTime' | 'createBy'> {}
  interface CreateRes {}


  interface ListReq {}
  interface ListRes {
    list: TableStruct__Examination[];
  }
}
