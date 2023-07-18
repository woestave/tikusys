import { Tables } from "#/mysql/tables";
import { routePOST } from "#/routes/route";
import { responseStructPresets } from "#/utils/response-struct";
import { ChoiceQuestionInfo, filterIsChoiceQuestion, filterMultiChoiceQuestion, filterSingleChoiceQuestion } from "common-packages/models/question-model-choice";
import { getTiListByPaperId } from "./get-ti-list-by-paper-id";
import { omit } from "ramda";
import { inExamTime } from "common-packages/helpers/exam-utils";

/**
 * 通过试卷id查询所有试卷所属的题列表，同时通过
 */
export default routePOST<API__Examsys__User.GetStudentExamTiListReq, API__Examsys__User.GetStudentExamTiListRes>((context) => {
  const userInfo = context.state.user as API__Examsys__User.GetUserInfoRes['userInfo'];
  const body = context.request.body;

  if (typeof body.exampaperId !== 'number' || typeof body.examinationId !== 'number') {
    return responseStructPresets.reqBodyError;
  }

  const examinationPromise = Tables
    .Examination
    .select()
    .where(Tables.Examination.getFieldName('id'), '=', body.examinationId)
    .exec();

  const myExamResultPromise = Tables
    .ExamResult
    .select()
    .where(Tables.ExamResult.getFieldName('examResultExaminationId'), '=', body.examinationId)
    .where(Tables.ExamResult.getFieldName('examResultStudentId'), '=', userInfo.studentId)
    .exec();

  return Promise.all([
    examinationPromise,
    myExamResultPromise,
    getTiListByPaperId(body.exampaperId),
  ]).then(([
    [examination],
    [myExamResult],
    { tiList },
  ]) => {
    return {
      tiList: tiList.map(x => ({
        ...x,
        /**
         * 如果是选择题并且没有作答记录 则把正确答案right字段去掉 避免学生通过控制台network查看接口数据作弊
         */
        ...(filterIsChoiceQuestion(x) && (!myExamResult && inExamTime(examination.examDate, examination.examDuration)) ? {
          customQuestionInfo: {
            ...x.customQuestionInfo,
            /**
             * 学生考试时，通过network查看tiList 可以看到选择题customQuestionInfo.choices[0].right是否正确来作弊
             * 这里通过判断学生是否交卷（是否存在考试记录）来控制right字段是否要提供给前端。
             * 如果学生没交卷，便不会提供给前端right字段，前端提交学生作答信息后从后端判卷。
             */
            choices: (x.customQuestionInfo as ChoiceQuestionInfo).choices.map(omit(['right'])),
            /**
             * 去掉了right后，前端无法判断这是多选题还是单选题，这里提供题的类型
             */
            isSingle: filterSingleChoiceQuestion(x),
            isMulti: filterMultiChoiceQuestion(x),
          },
        } : {}),
      })),
    };
  });
});
