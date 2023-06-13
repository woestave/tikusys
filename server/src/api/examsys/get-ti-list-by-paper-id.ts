import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { responseStructPresets } from '#/utils/response-struct';
import querystring from 'querystring';

export function selfFunction (paperId: number) {
  const F = Tables
    .Relation__Exampaper__Tiku
    .select()
    .join('left', Tables.Tiku, `${Tables.Tiku.getTableFieldName('id')} = ${Tables.Relation__Exampaper__Tiku.getTableFieldName('tikuId')}`)
    .where(Tables.Relation__Exampaper__Tiku.getFieldName('paperId'), '=', paperId);

  return F
    .exec()
    .then((tiList) => {
      return {
        tiList: tiList.map((x) => ({
          ...x,
          tName: querystring.unescape(x.tName || ''),
          customQuestionInfo: JSON.parse(querystring.unescape(x.customQuestionInfo as any as string)),
        })),
      };
    });
}

/**
 * 通过试卷id查询所有试卷所属的题列表
 */
export default routePOST<API__Examsys__User.GetTiListByPaperIdReq, API__Examsys__User.GetTiListByPaperIdRes>((context) => {
  const userInfo = context.state.user as API__Examsys__User.GetUserInfoRes['userInfo'];
  const body = context.request.body;

  if (typeof body.id !== 'number') {
    return responseStructPresets.reqBodyError;
  }

  return selfFunction(body.id);
});
