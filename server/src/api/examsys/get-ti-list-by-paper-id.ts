import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { responseStructPresets } from '#/utils/response-struct';

/**
 * 通过试卷id查询所有试卷所属的题列表
 */
export default routePOST<API__Examsys__User.GetTiListByPaperIdReq, API__Examsys__User.GetTiListByPaperIdRes>((context) => {
  const userInfo = context.state.user as API__Examsys__User.GetUserInfoRes['userInfo'];
  const body = context.request.body;

  if (typeof body.id !== 'number') {
    return responseStructPresets.reqBodyError;
  }

  const F = Tables
    .Relation__Exampaper__Tiku
    .select()
    .join('left', Tables.Tiku, `${Tables.Tiku.getTableFieldName('id')} = ${Tables.Relation__Exampaper__Tiku.getTableFieldName('tikuId')}`)
    .where(Tables.Relation__Exampaper__Tiku.getFieldName('paperId'), '=', body.id);

  return F
    .exec()
    .then((tiList) => {
      return {
        tiList,
      };
    });
});