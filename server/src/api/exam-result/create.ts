import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { getResponseStruct } from '#/utils/response-struct';
import serverJsonFieldReplace from '#/utils/server-json-field-replace';
import querystring from 'node:querystring';

export default routePOST<API__ExamResult.CreateReq, API__ExamResult.CreateRes>((context) => {

  const body = context.request.body;
  const answerInfo = body.answerInfo;
  const examinationId = body.id;
  const choiceQuestionScore = body.choiceQuestionScore;

  const userInfo = context.state.user as API__Examsys__User.GetUserInfoRes['userInfo'];

  // for (let i in answerInfo) {
  //   const item = answerInfo[i];
  //   if (typeof item === 'string') {
  //     answerInfo[i] = (item);
  //   }
  // }
  // return getResponseStruct(333, 'ss', {
  //   sql: Tables
  //   .ExamResult
  //   .insert([
  //     {
  //       examResultId: 0,
  //       examResultAnswerInfo: querystring.stringify(answerInfo),
  //       examResultCreateTime: +new Date(),
  //       examResultExaminationId: examinationId,
  //       examResultStudentId: userInfo.studentId,
  //     },
  //   ]).sql(),
  // });

  return Tables
    .ExamResult
    .insert([
      {
        examResultId: 0,
        examResultAnswerInfo: querystring.escape(JSON.stringify(answerInfo)),
        examResultCreateTime: +new Date(),
        examResultExaminationId: examinationId,
        examResultStudentId: userInfo.studentId,
        examResultSQ_Marking: '',
        examResultChoiceQuestionScore: choiceQuestionScore,
      },
    ])
    .exec()
    .then((res) => {
      return { succ: 1, };
    });
});
