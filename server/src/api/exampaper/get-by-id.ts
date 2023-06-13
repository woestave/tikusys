import { Tables } from "#/mysql/tables";
import { routePOST } from "#/routes/route";
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from "#/utils/response-struct";
import querystring from 'querystring';

export default routePOST<API__Exampaper.GetByIdReq, API__Exampaper.GetByIdRes>((context, next) => {


  return Tables
    .Exampaper
    .where(Tables.Exampaper.getFieldName('paperId'), '=', context.request.body.id)
    .select()
    .exec()
    .then(([editingPaperItem]) => {
      if (!editingPaperItem) {
        return Promise.reject(getResponseStruct(ERR_CODES.reqBodyError, ERR_MESSAGES.reqBodyError, null));
      }

      return Tables
        .Relation__Exampaper__Tiku
        .join('left', Tables.Tiku, `${Tables.Relation__Exampaper__Tiku.getTableFieldName('tikuId')} = ${Tables.Tiku.getTableFieldName('id')}`)
        .select()
        .where(Tables.Relation__Exampaper__Tiku.getFieldName('paperId'), '=', editingPaperItem.paperId)
        .exec()
        .then((tiListOfThisPaper) => {
          return {
            paperItem: editingPaperItem ? {
              ...editingPaperItem,
            } : null,
            tiListOfThisPaper: tiListOfThisPaper.map((x) => ({
              ...x,
              tName: querystring.unescape(x.tName || ''),
              customQuestionInfo: JSON.parse(querystring.unescape(x.customQuestionInfo as any as string)),
            })),
          };
        });
    });
});
