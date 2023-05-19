import { routePOST } from '#/routes/route';
import { Tables } from '#/mysql/tables';
import { TeacherRole } from 'common-packages/constants/teacher-role';
import { getValueLabelCurried, createValueLabelObj, } from 'common-packages/utils/value-label-utils';



export default routePOST<null, API__CommonData.Res>((context, next) => {
  return Promise.all([
    Tables.ClassType.select().exec(),
    Tables.Class.select().exec(),
  ])
    .then(([classTypes, classes]) => ({
      phases: [
        createValueLabelObj(1, '阶段1'),
        createValueLabelObj(2, '阶段2'),
        createValueLabelObj(3, '阶段3'),
        createValueLabelObj(4, '阶段4'),
        createValueLabelObj(5, '阶段5'),
        createValueLabelObj(6, '阶段6'),
      ],
      classes: classes.map(getValueLabelCurried('id', 'className')),
      classTypes: classTypes.map(getValueLabelCurried('id', 'classTypeName')),
      majors: [
        createValueLabelObj(1, '前端'),
        createValueLabelObj(2, 'JAVA'),
        createValueLabelObj(3, '基础课'),
      ],
      studentStatus: [
        createValueLabelObj(0, '正常'),
        createValueLabelObj(1, '就业'),
        createValueLabelObj(2, '休学'),
        createValueLabelObj(3, '退学'),
      ],
      teacherStatus: [
        createValueLabelObj(0, '正常'),
      ],
      teacherRoleMap: {
        [TeacherRole.super]: '超级管理员',
        [TeacherRole.teacher]: '讲师',
        [TeacherRole.eduAdmin]: '教务',
        [TeacherRole.visitor]: '游客',
      },
    }));
});
