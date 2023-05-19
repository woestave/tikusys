import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { responseStructPresets } from '#/utils/response-struct';

export default routePOST<API__Examsys__User.RemoveMyExamResultReq, API__Examsys__User.RemoveMyExamResultRes>((context) => {
  const userInfo = context.state.user as API__Examsys__User.GetUserInfoRes['userInfo'];
  const examinationId = context.request.body.id;

  if (typeof examinationId !== 'number') {
    return responseStructPresets.reqBodyError;
  }
  if (typeof userInfo?.studentId !== 'number') {
    return responseStructPresets.permissionDenied;
  }

  // select * from examination where JSON_CONTAINS(examClassIds, JSON_ARRAY(18)) // 18是班级id 这条sql可以查询班级id为18的
  const F = Tables
    .ExamResult
    .delete()
    .where(Tables.ExamResult.getFieldName('examResultExaminationId'), '=', examinationId)
    .where(Tables.ExamResult.getFieldName('examResultStudentId'), '=', userInfo.studentId);

  return F
    .exec()
    .then((res) => {
      return {
        succ: 1,
      };
    });
});
