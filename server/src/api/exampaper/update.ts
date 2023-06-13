import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { omit } from 'ramda';

export function exampaperUpdate (body: API__Exampaper.UpdateReq) {
  const idKey: keyof typeof body = 'paperId';

  return Tables
    .Exampaper
    .update({
      ...omit([idKey, 'paperQuestionIds'], body),
    })
    .where(Tables.Exampaper.getFieldName('paperId'), '=', body.paperId)
    .exec()
    .then((res) => ({ succ: res.affectedRows as 0 | 1, result: res, }));
}

export default routePOST<API__Exampaper.UpdateReq, API__Exampaper.UpdateRes>((context) => {
  return exampaperUpdate(context.request.body);
});
