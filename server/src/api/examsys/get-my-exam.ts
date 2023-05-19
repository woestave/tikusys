import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { responseStructPresets } from '#/utils/response-struct';

export default routePOST<{}, API__Examsys__User.GetMyExamRes>((context) => {
  const userInfo = context.state.user as API__Examsys__User.GetUserInfoRes['userInfo'];
  // if (!userInfo || typeof userInfo.studentId !== 'number') {
  //   return responseStructPresets.permissionDenied;
  // }

  // select * from examination where JSON_CONTAINS(examClassIds, JSON_ARRAY(18)) // 18是班级id 这条sql可以查询班级id为18的
  const F = Tables
    .Examination
    .select()
    .whereStr(`JSON_CONTAINS(examClassIds, JSON_ARRAY(${userInfo.studentClass || 0}))`);

  return F
    .exec()
    .then((list) => {
      return {
        // sql: F.sql(),
        list,
      };
    });
});
