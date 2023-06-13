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

  interface CreateOrUpdateReq extends Omit<TableStruct__Examination, 'createTime' | 'createBy'> {}
  interface CreateOrUpdateRes {
    succ: 1 | 0;
    type: 'create' | 'update';
  }

  interface CreateReq extends CreateOrUpdateReq {}
  interface CreateRes {}

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
    //
  }
  interface ListRes {
    list: TableStruct__Examination[];
    total: number;
  }
}
