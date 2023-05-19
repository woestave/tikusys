namespace API__Tiku {

  interface BaseCustomQuestionInfo {
    questionType: import('common-packages/constants/question').QuestionType;
  }
  interface QuestionModel<CQI extends BaseCustomQuestionInfo> {
    id: number;
    tName: null | string;
    scoreValue: number;
    phase: null | number;
    major: null | number;
    customQuestionInfo: CQI;
  }

  type DefaultQuestionModel = QuestionModel<BaseCustomQuestionInfo>;



  interface TableOtherData {
    createTime: number;
    createBy: number;
  }
  interface TableStruct__Tiku extends TableOtherData, DefaultQuestionModel {}

  interface TikuStructWithPaperInfo extends TableStruct__Tiku {
    paperInfo: Array<{
      paperId: number;
      paperName: string;
    }>;
  }



  export interface CreateReq {
    question: DefaultQuestionModel;
  }

  export interface CreateRes {
    succ: 1;
  }



  export interface ListReq extends API__BaseTypes.Pagination {
    /** 编号 */
    id?: string;
    /** 名称 */
    tName?: string;
    /** 阶段 */
    phase?: number[];
    /** 专业 */
    major?: number | null;
  }
  export interface ListRes {
    list: Array<TikuStructWithPaperInfo>;
    /**
     * 总条数
     */
    total: number;
  }
}
