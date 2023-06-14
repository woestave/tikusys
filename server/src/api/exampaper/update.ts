import { beginTransaction } from '#/mysql';
import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from '#/utils/response-struct';
import { omit } from 'ramda';

export function exampaperUpdate (body: API__Exampaper.UpdateReq) {
  const idKey: keyof typeof body = 'paperId';

  if (!body.paperName || !body.paperTotalScore || (!Array.isArray(body.paperQuestionIds) || !body.paperQuestionIds.length)) {
    return Promise.reject(getResponseStruct(ERR_CODES.reqBodyError, ERR_MESSAGES.reqBodyError, null));
  }

  const tiIds = body.paperQuestionIds;

  /** 开启数据库事务 */
  return beginTransaction((connection) => {

    return Tables
      .Exampaper
      .update({
        ...omit([idKey, 'paperQuestionIds'], body),
      })
      .where(Tables.Exampaper.getFieldName('paperId'), '=', body.paperId)
      .execWithTransaction(connection)
      .then((res) => {
        return Tables
          .Relation__Exampaper__Tiku
          .delete()
          .where(Tables.Relation__Exampaper__Tiku.getFieldName('paperId'), '=', body[idKey])
          .execWithTransaction(connection);
      })
      .then(() => {
        return Tables
          .Relation__Exampaper__Tiku
          .insert(tiIds.map((tikuId) => ({
            relationId: 0,
            tikuId,
            paperId: body[idKey],
          })))
          .execWithTransaction(connection);
      })
      .then(() => {
        return ({ succ: 1 as const, });
      });
  });
}

export default routePOST<API__Exampaper.UpdateReq, API__Exampaper.UpdateRes>((context) => {
  return exampaperUpdate(context.request.body);
});
