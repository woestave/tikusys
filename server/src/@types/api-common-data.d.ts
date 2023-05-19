declare namespace API__CommonData {
  interface Res {
    phases: Array<API__BaseTypes.LabelValue>;
    classes: Array<API__BaseTypes.LabelValue>;
    classTypes: Array<API__BaseTypes.LabelValue>;
    majors: Array<API__BaseTypes.LabelValue>;
    studentStatus: Array<API__BaseTypes.LabelValue>;
    teacherStatus: Array<API__BaseTypes.LabelValue>;
    teacherRoleMap: {
      [k in import('common-packages/constants/teacher-role').TeacherRole]: string;
    };
  }
}
