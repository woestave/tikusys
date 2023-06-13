import { Tables } from "#/mysql/tables";
import { routePOST } from "#/routes/route";
import querystring from 'querystring';

export default routePOST<API__Tiku.GetByIdReq, API__Tiku.GetByIdRes>((context, next) => {

  return Tables
    .Tiku
    .where(Tables.Tiku.getFieldName('id'), '=', context.request.body.tId)
    .select()
    .exec()
    .then(([tiItem]) => ({
      tiItem: tiItem ? {
        ...tiItem,
        tName: querystring.unescape(tiItem.tName || ''),
        customQuestionInfo: JSON.parse(querystring.unescape(tiItem.customQuestionInfo as any as string)),
      } : null,
    }));
});
