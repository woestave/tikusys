namespace API__ExamResult {

  type ExamResultAnswerInfoParsed = Record<API__Tiku.TableStruct__Tiku['id'], number | number[] | string>;

  type examResultSQ_MarkingParsed = Record<API__Tiku.TableStruct__Tiku['id'], number>;

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
    /**
     * 主观题的阅卷结果，题id对应分数的对象
     * Record<API__Tiku.TableStruct__Tiku['id'], number>;
     */
    examResultSQ_Marking: string;
    /**
     * 选择题(可以被电脑判卷的题)的分数
     */
    examResultChoiceQuestionScore: number;
  }
  //
  interface CreateReq {
    /** examinationId */
    id: number;
    choiceQuestionScore: number;
    // examResultUsedTime: number;
    answerInfo: ExamResultAnswerInfoParsed;// TableStruct__ExamResult['examResultAnswerInfo'];
  }
  interface CreateRes {
    succ: 1;
  }




  interface GetTeacherCorrectingReq {
    examinationId: number;
  }
  interface GetTeacherCorrectingRes {
    examination: API__Examination.TableStruct__Examination;
    tiList: API__Tiku.TableStruct__Tiku[];
    list: TableStruct__ExamResult[];
    exampaper: API__Exampaper.TableStruct__Exampaper;
    studentList: API__Student.TableStruct__Student[];
  }




  interface SaveStudentExamResultReq {
    examResultId: number;
    SQMarking: Record<API__Tiku.TableStruct__Tiku['id'], number>;
  }
  interface SaveStudentExamResultRes {
    succ: 1;
  }
}
