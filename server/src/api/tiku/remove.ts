import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct, responseStructPresets } from '#/utils/response-struct';

export default routePOST<API__Tiku.RemoveReq, API__Tiku.RemoveRes>((context) => {
  const body = context.request.body;

  if (typeof body.id !== 'number' || body.id === 0) {
    return responseStructPresets.reqBodyError;
  }

  const condition = Tables
    .Relation__Exampaper__Tiku
    .select()
    .where(Tables.Relation__Exampaper__Tiku.getFieldName('tikuId'), '=', body.id)
    .exec()
    .then((items) => {
      if (items.length) {
        return Promise.reject(getResponseStruct(ERR_CODES.tikuReferencedRemoveError, ERR_MESSAGES.tikuReferencedRemoveError, null));
      }
    });

  return condition.then(() => Tables
    .Tiku
    .delete()
    .where(Tables.Examination.getFieldName('id'), '=', body.id)
    .exec()
    .then((res) => ({
      succ: res.affectedRows,
    }))
  );
});
