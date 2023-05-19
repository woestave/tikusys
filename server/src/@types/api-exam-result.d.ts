namespace API__ExamResult {

  type ExamResultAnswerInfoParsed = Record<API__Tiku.TableStruct__Tiku['id'], number | number[] | string>;

  interface TableStruct__ExamResult {
    examResultId: number;
    examResultExaminationId: number;
    examResultStudentId: number;
    /**
     * 题id对应选项index或选项index组(多选)或者简答题内容
     */
    examResultAnswerInfo: string;
    examResultCreateTime: number;
    /**
     * 考试用时（毫秒）
     */
    // examResultUsedTime: number;
  }
  //
  interface CreateReq {
    /** examinationId */
    id: number;
    // examResultUsedTime: number;
    answerInfo: ExamResultAnswerInfoParsed;// TableStruct__ExamResult['examResultAnswerInfo'];
  }
  interface CreateRes {
    succ: 1;
  }
}
