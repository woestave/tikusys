import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { responseStructPresets } from '#/utils/response-struct';

export default routePOST<API__Examsys__User.GetExamDetailReq, API__Examsys__User.GetExamDetailRes>((context) => {
  const userInfo = context.state.user as API__Examsys__User.GetUserInfoRes['userInfo'];
  const body = context.request.body;

  const F = Tables
    .Examination
    .select()
    .where(Tables.Examination.getFieldName('id'), '=', body.id)
    .whereStr(`JSON_CONTAINS(examClassIds, JSON_ARRAY(${userInfo.studentClass || 0}))`);

  return F
    .exec()
    .then(([detail]) => {
      if (!detail) {
        return null;
      }
      return {
        ...detail,
      };
    });
});
