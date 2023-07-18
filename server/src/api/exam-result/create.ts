import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { getResponseStruct } from '#/utils/response-struct';
import serverJsonFieldReplace from '#/utils/server-json-field-replace';
import computeQuestionScores from 'common-packages/helpers/compute-question-scores';
import getClassifyQuestions from 'common-packages/helpers/get-classify-questions';
import querystring from 'node:querystring';
import { getTiListByPaperId } from '../examsys/get-ti-list-by-paper-id';

export default routePOST<API__ExamResult.CreateReq, API__ExamResult.CreateRes>((context) => {

  const body = context.request.body;
  const answerInfo = body.answerInfo;
  const examinationId = body.examinationId;
  // const choiceQuestionScore = body.choiceQuestionScore;

  const userInfo = context.state.user as API__Examsys__User.GetUserInfoRes['userInfo'];

  return getTiListByPaperId(body.exampaperId).then((res) => {
    const answerScores = computeQuestionScores(getClassifyQuestions(res.tiList || []), answerInfo);

    const choiceQuestionScore = answerScores.rightChoicesTotalScore;

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
});
