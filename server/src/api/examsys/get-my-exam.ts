import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { responseStructPresets } from '#/utils/response-struct';
import { sum } from 'ramda';

export default routePOST<{}, API__Examsys__User.GetMyExamRes>((context) => {
  const userInfo = context.state.user as API__Examsys__User.GetUserInfoRes['userInfo'];
  // if (!userInfo || typeof userInfo.studentId !== 'number') {
  //   return responseStructPresets.permissionDenied;
  // }

  // select * from examination where JSON_CONTAINS(examClassIds, JSON_ARRAY(18)) // 18是班级id 这条sql可以查询班级id为18的
  const F = Tables
    .Examination
    .select()
    .whereStr(`JSON_CONTAINS(examClassIds, JSON_ARRAY(${userInfo.studentClass || 0}))`)
    .orderBy({
      examDate: 'desc',
    });

  return F
    .exec()
    .then((list) => {
      return Tables
        .ExamResult
        .select()
        .where(Tables.ExamResult.getFieldName('examResultExaminationId'), 'in', list.map(x => x.id))
        .exec()
        .then(examResultList => {
          return {
            // sql: F.sql(),
            list: list.map((x) => {
              const myExamResult = examResultList.find((examResult) => {
                return examResult.examResultExaminationId === x.id && examResult.examResultStudentId === userInfo.studentId
              });
              return {
                ...x,
                myExamResult: myExamResult || null,
              };
            }),
          };
        });
    });
});
