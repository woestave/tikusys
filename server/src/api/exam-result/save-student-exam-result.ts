import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { ERR_CODES, ERR_MESSAGES, ResponseStruct, getResponseStruct, responseStructPresets } from '#/utils/response-struct';
import { selfFunction } from '../examsys/get-ti-list-by-paper-id';

export default routePOST<API__ExamResult.SaveStudentExamResultReq, API__ExamResult.SaveStudentExamResultRes>((context, next) => {

  // const userInfo = context.state.user as API__Teacher.GetUserInfoRes['userInfo'];
  const body = context.request.body;

  if (!body.examResultId) {
    return responseStructPresets.reqBodyError;
  }

  return Tables
    .ExamResult
    .update({
      examResultSQ_Marking: encodeURIComponent(JSON.stringify(body.SQMarking)),
    })
    .where(Tables.ExamResult.getFieldName('examResultId'), '=', body.examResultId)
    .exec()
    .then((res) => {
      return {succ: res.affectedRows as 1};
    });
});
