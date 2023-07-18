import { routePOST } from '#/routes/route';
import { Tables } from '#/mysql/tables';
import { TeacherRole } from 'common-packages/constants/teacher-role';
import { getValueLabelCurried, createValueLabelObj, } from 'common-packages/utils/value-label-utils';



export default routePOST<null, API__CommonData.Res>((context, next) => {
  return Promise.all([
    // Tables.ClassType.select().exec(),
    Tables.Class.select().exec(),
    // Tables.Major.select().exec(),
  ])
    .then(([
      // classTypes,
      classes,
      // majors,
    ]) => ({
      phases: [
        createValueLabelObj(1, '阶段1'),
        createValueLabelObj(2, '阶段2'),
        createValueLabelObj(3, '阶段3'),
        createValueLabelObj(4, '阶段4'),
        createValueLabelObj(5, '阶段5'),
        createValueLabelObj(6, '阶段6'),
      ],
      classes: classes.map(getValueLabelCurried('id', 'className')),
      // classTypes: classTypes.map(getValueLabelCurried('id', 'classTypeName')),
      /**
       * 有class-type表，但暂时没用上
       */
      classTypes: [
        createValueLabelObj(1, '威客学院（6个月）'),
        createValueLabelObj(2, '蓝英学院（10个月）'),
        createValueLabelObj(3, '立德学院（16个月）'),
        createValueLabelObj(4, '齐齐哈尔分校'),
        createValueLabelObj(5, '鸿蒙软件产业学院'),
      ],
      // majors表已存在，但没有做它的增删改查操作，这里选择不使用major表直接写死数据
      // majors: majors.map(getValueLabelCurried('majorId', 'majorName')),
      majors: [
        createValueLabelObj(1, '大数据'),
        createValueLabelObj(2, '大前端'),
        createValueLabelObj(3, '云计算'),
        createValueLabelObj(4, '影视制作'),
        createValueLabelObj(5, '鸿蒙开发'),
        createValueLabelObj(6, '软件测试'),
        createValueLabelObj(7, '网络运维'),
        createValueLabelObj(8, '专业基础'),
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
