import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { responseStructPresets } from '#/utils/response-struct';
import querystring from 'node:querystring';

export default routePOST<API__Examsys__User.GetMyExamResultReq, API__Examsys__User.GetMyExamResultRes>((context) => {
  const userInfo = context.state.user as API__Examsys__User.GetUserInfoRes['userInfo'];
  const examinationId = context.request.body.id;

  if (typeof examinationId !== 'number') {
    return responseStructPresets.reqBodyError;
  }

  // select * from examination where JSON_CONTAINS(examClassIds, JSON_ARRAY(18)) // 18是班级id 这条sql可以查询班级id为18的
  const F = Tables
    .ExamResult
    .select()
    .where(Tables.ExamResult.getFieldName('examResultExaminationId'), '=', examinationId)
    .where(Tables.ExamResult.getFieldName('examResultStudentId'), '=', userInfo.studentId);

  return F
    .exec()
    .then(([myExamResult]) => {
      return myExamResult ? {
        ...myExamResult,
        examResultAnswerInfo: JSON.parse(querystring.unescape(myExamResult.examResultAnswerInfo)) as API__ExamResult.ExamResultAnswerInfoParsed,
      } : null;
    });
});
