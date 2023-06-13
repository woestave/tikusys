import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { ERR_CODES, ERR_MESSAGES, ResponseStruct, getResponseStruct } from '#/utils/response-struct';
import { selfFunction } from '../examsys/get-ti-list-by-paper-id';

export default routePOST<API__ExamResult.GetTeacherCorrectingReq, API__ExamResult.GetTeacherCorrectingRes>((context, next) => {

  const userInfo = context.state.user as API__Teacher.GetUserInfoRes['userInfo'];
  const body = context.request.body;


  const targetExamination = Tables
    .Examination
    .select()
    .whereStr(`JSON_CONTAINS(${Tables.Examination.getFieldName('examClassIds')}, JSON_ARRAY(${userInfo.teacherClass || 0}))`)
    .exec()
    .then((res) => {
      if (!res || res.length === 0) {
        return Promise.reject(getResponseStruct(ERR_CODES.permissionDenied, '权限不足', null));
      }

      const targetExamination = res.find(x => +x.id === +body.examinationId);
      if (!targetExamination) {
        return Promise.reject(getResponseStruct(ERR_CODES.notFound, '考试信息未找到。', null));
      }
      return targetExamination;
    });






  const targetExampaper = targetExamination.then(res => Tables
    .Exampaper
    .select()
    .where(Tables.Exampaper.getFieldName('paperId'), '=', res.examExampaperId)
    .exec()
    .then(([targetExampaper]) => {
      if (!targetExampaper) {
        return Promise.reject(getResponseStruct(ERR_CODES.exampaperNotExists, '试卷不存在！', null));
      }
      return targetExampaper;
    }));






  const targetExamResults = Tables
    .ExamResult
    .select()
    .where(Tables.ExamResult.getFieldName('examResultExaminationId'), '=', body.examinationId)
    .exec();

  // const tiList = Tables.Tiku.select().where(Tables.Tiku.getTableFieldName('id', 'in', ))

  const tiList = targetExampaper
    .then(res => selfFunction(res.paperId))
    .then((res) => {
    if (res instanceof ResponseStruct) {
      return Promise.reject(res);
    }
    return res.tiList;
  });


  const studentList = targetExamResults.then((res) => Tables
    .Student
    .select()
    .where(Tables.Student.getFieldName('studentId'), 'in', res.map(x => x.examResultStudentId))
    .where(Tables.Student.getFieldName('studentClass'), '=', userInfo.teacherClass) // 只要自己班的学生
    .exec()
  );



  return Promise.all([
    targetExamination,
    tiList,
    targetExampaper,
    targetExamResults,
    studentList,
  ]).then(([
    examination,
    tiList,
    exampaper,
    examResults,
    studentList,
  ]) => {
    const myStudentIds = studentList.map((x) => x.studentId);
    return {
      examination,
      exampaper,
      tiList,
      list: examResults.filter((x) => myStudentIds.includes(x.examResultStudentId)),
      studentList,
    };
  });
});
