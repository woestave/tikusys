import { Tables } from "#/mysql/tables";
import { routePOST } from "#/routes/route";
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from "#/utils/response-struct";

export default routePOST<API__Examination.CreateReq, API__Examination.CreateRes>((req, next) => {
  const body = req.request.body;
  if (
    !body.examExampaperId
    || !body.examName
    || !body.examDate
    || !body.examDuration
    || (!Array.isArray(body.examClassIds) || body.examClassIds.length === 0)
  ) {
    return getResponseStruct(ERR_CODES.reqBodyError, ERR_MESSAGES.reqBodyError, null);
  }

  return Tables
    .Examination
    .insert([{
      ...body,
      examClassIds: JSON.stringify(body.examClassIds),
      createTime: +new Date(),
      createBy: 1,
    }])
    .exec()
    .then((res) => ({ succ: 1, res }));
});
