import { Tables } from "#/mysql/tables";
import { routePOST } from "#/routes/route";
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from "#/utils/response-struct";

export function examinationCreate (body: API__Examination.CreateReq, userInfo: API__Teacher.GetUserInfoRes['userInfo']) {
  if (
    !body.examExampaperId
    || !body.examName
    || !body.examDate
    || !body.examDuration
    || (!Array.isArray(body.examClassIds) || body.examClassIds.length === 0)
  ) {
    return Promise.reject(getResponseStruct(ERR_CODES.reqBodyError, ERR_MESSAGES.reqBodyError, null));
  }

  return Tables
    .Examination
    .insert([{
      ...body,
      examClassIds: JSON.stringify(body.examClassIds),
      createTime: +new Date(),
      createBy: userInfo.teacherId,
    }])
    .exec()
    .then((res) => ({ succ: 1 as const, res }));
}




export default routePOST<API__Examination.CreateReq, API__Examination.CreateRes>((cxt, next) => {
  const body = cxt.request.body;
  const userInfo = cxt.state.user as API__Teacher.GetUserInfoRes['userInfo'];

  return examinationCreate(body, userInfo);
});
