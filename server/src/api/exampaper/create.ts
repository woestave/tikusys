import { beginTransaction } from "#/mysql";
import { Tables } from "#/mysql/tables";
import { routeALL, routePOST } from "#/routes/route";
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from "#/utils/response-struct";
import { omit } from "ramda";

export default routePOST<API__Exampaper.CreateReq, API__Exampaper.CreateRes>((req, next) => {
  const body = req.request.body;
  if (!body.paperName || !body.paperTotalScore || (!Array.isArray(body.paperQuestionIds) || !body.paperQuestionIds.length)) {
    return getResponseStruct(ERR_CODES.reqBodyError, ERR_MESSAGES.reqBodyError, null);
  }

  const tiIds = body.paperQuestionIds;

  /**
   * 开启事务
   */
  return beginTransaction((connection) => {

    return Tables
      .Exampaper
      .insert([{
        ...omit(['paperQuestionIds'], body),
      }])
      .execWithTransaction(connection)
      .then((res) => {

        return Tables
          .Relation__Exampaper__Tiku
            .insert(tiIds.map((tikuId) => ({
              relationId: 0,
              tikuId,
              paperId: res.insertId,
            })))
            .execWithTransaction(connection)
            .then((res) => ({ succ: 1, }));
      });
  });
});
