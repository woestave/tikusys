/**
 * 试卷模块
 */
namespace API__Exampaper {


  /**
   * exampaper的表结构
   */
  interface TableStruct__Exampaper {
    /**
     * 试卷id
     */
    paperId: number;
    /**
     * 试卷名称
     */
    paperName: string;
    /**
     * 试卷阶段
     */
    paperPhase: null | number;
    /**
     * 试卷描述
     */
    paperDesc: null | string;
    /**
     * 试卷总分
     */
    paperTotalScore: number;
    /**
     * 试卷所属专业
     */
    paperMajor: null | number;
    /**
     * 试卷内包含的各种题数据
     */
    // paperQuestionInfo: {
    //   singleChoiceQuestions: Array<API__Tiku.DefaultQuestionModel['id']>;
    //   multiChoiceQuestions: Array<API__Tiku.DefaultQuestionModel['id']>;
    //   shortAnswerQuestions: Array<API__Tiku.DefaultQuestionModel['id']>;
    // };
    // paperQuestionIds: number[];
  }

  interface CreateOrUpdateReq extends TableStruct__Exampaper {
    paperQuestionIds: number[];
  }
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


  interface ListReq {}
  interface ListRes {
    list: TableStruct__Exampaper[];
  }


  interface GetByIdReq {
    id: number;
  }
  interface GetByIdRes {
    paperItem: TableStruct__Exampaper | null;
    tiListOfThisPaper: API__Tiku.TableStruct__Tiku[];
  }
}
