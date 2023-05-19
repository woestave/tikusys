import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';

export default routePOST<API__ExamResult.CreateReq, API__ExamResult.CreateRes>((context) => {

  const body = context.request.body;
  const answerInfo = body.answerInfo;
  const examinationId = body.id;

  const userInfo = context.state.user as API__Examsys__User.GetUserInfoRes['userInfo'];

  for (let i in answerInfo) {
    const item = answerInfo[i];
    if (typeof item === 'string') {
      answerInfo[i] = item.replace(/\"/g, '\\\"');
    }
  }

  return Tables
    .ExamResult
    .insert([
      {
        examResultId: 0,
        examResultAnswerInfo: JSON.stringify(answerInfo),
        examResultCreateTime: +new Date(),
        examResultExaminationId: examinationId,
        examResultStudentId: userInfo.studentId,
      },
    ])
    .exec()
    .then((res) => {
      return { succ: 1, };
    });
});
