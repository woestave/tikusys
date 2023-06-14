import { routePOST } from "#/routes/route";
import { TeacherRole } from "common-packages/constants/teacher-role";

export default routePOST<null, API__LeftMenu.Res>((context) => {
  const userInfo = context.state.user as API__Teacher.GetUserInfoRes['userInfo'];

  return {
    list: [
      {
        id: '610159148224d543ae4e05c5',
        label: '试题管理',
        icon: 'Newspaper',
        // name: 'home',
        children: [
          {
            id: 'tiku-create',
            label: '添加试题',
            // icon: 'AddCircle',
            routeName: 'tiku-create',
          },
          {
            id: 'tiku-list',
            label: '题库管理',
            // icon: 'Library',
            routeName: 'tiku-list',
          },
          {
            id: 'exampaper-create',
            label: '生成试卷',
            // icon: 'DocumentText',
            routeName: 'exampaper-create',
          },
          // {
          //   id: 'examination-correcting',
          //   label: '老师阅卷',
          //   // icon: 'Pencil',
          //   routeName: 'examination-correcting',
          // },
          {
            id: 'examination-schedule',
            label: '考试规划',
            // icon: 'Pencil',
            routeName: 'examination-schedule',
          },
          // req.can(Role.owner) && { id: '610159148224d543ae4e05c7', label: '生成试卷', },
        ].filter(Boolean),
      },
      {
        id: '610159148224d543ae4e05cc',
        label: '成绩管理',
        icon: 'PodiumSharp',
        disabled: true,
        children: [
          {
            id: 'examscore-list',
            label: '班级考试成绩',
            // icon: 'ListSharp',
            routeName: 'examscore-list',
          },
          {
            id: 'examscore-list',
            label: '成绩分析统计',
            // icon: 'PieChartSharp',
            routeName: 'examscore-analysis',
          },
        ],
      },
      /**
       * 超管拥有管理班级和人员的权限
       * 其他角色只能查看试题管理面板
       */
      ...userInfo.taecherRole === TeacherRole.super ? [
        {
          id: '810159148224d543ae4e05cc',
          label: '班级管理',
          icon: 'ClassFilled',
          children: [
            {
              id: 'class-overview',
              label: '班级大盘',
              // icon: 'ListSharp',
              routeName: 'class-overview',
            },
            // {
            //   id: 'class-types',
            //   label: '班级类型',
            //   // icon: 'ListSharp',
            //   routeName: 'class-types',
            // },
          ],
        },
        {
          id: '710159148224d543ae4e05cc',
          label: '人员管理',
          icon: 'PeopleSharp',
          children: [
            {
              id: 'personnel-student',
              label: '学生管理',
              // icon: 'ListSharp',
              routeName: 'personnel-student',
            },
            {
              id: 'personnel-teacher',
              label: '教师管理',
              // icon: 'PieChartSharp',
              routeName: 'personnel-teacher',
            },
          ],
        },
      ] : [],
    ],
  };
});