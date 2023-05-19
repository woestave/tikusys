import { Router } from 'express'
import { Role } from './data'

const router = Router()

// interface MenuItemProps {
//   id: string,
//   label: string,
//   icon: string | null,
//   routeName: string | null,
//   children?: MenuItemProps[],
// }
// function menuItem (props: MenuItemProps) {

//   return {
//     id: props.id,
//     label,
//     icon,
//     routeName,
//     children: children || [],
//   };
// }



router.get('/', (req, res) => {
  res.send([
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
          id: 'exampaper-create',
          label: '生成试卷',
          // icon: 'DocumentText',
          routeName: 'exampaper-create',
        },
        {
          id: 'teacher-grading',
          label: '老师阅卷',
          // icon: 'Pencil',
          routeName: 'teacher-grading',
        },
        {
          id: 'tiku-list',
          label: '题库管理',
          // icon: 'Library',
          routeName: 'tiku-list',
        },
        // req.can(Role.owner) && { id: '610159148224d543ae4e05c7', label: '生成试卷', },
      ].filter(Boolean),
    },
    {
      id: '610159148224d543ae4e05cc',
      label: '成绩管理',
      icon: 'PodiumSharp',
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
  ]);
  return;
  res.send([
    {
      id: '610159148224d543ae4e05c5',
      label: '试卷管理',
      icon: 'NewspaperOutline',
      // name: 'home',
      children: [
        { id: '610159148224d543ae4e05c9', label: '添加试题', routeName: 'tiku-create', },
        { id: 'exampaper-create', label: '生成试卷', routeName: 'exampaper-create', },
        { id: 'teacher-grading', label: '老师阅卷', routeName: 'exampaper-grading', },
        { id: 'tiku-list', label: '题库管理', routeName: 'tiku-list', },
        // req.can(Role.owner) && { id: '610159148224d543ae4e05c7', label: '生成试卷', },
      ].filter(Boolean)
    },
    req.can(Role.staff) && {
      id: '610159148224d543ae4e05c8',
      label: 'Posts',
      icon: 'posts',
      // name: 'posts',
      // params: { type: 'blog' },
      children: [
        { id: '610159148224d543ae4e05c9', label: 'All posts', name: 'posts', params: { type: 'blog' } },
        { id: '610159148224d543ae4e05ca', label: 'New post', name: 'new', params: { type: 'blog' } },
        { id: '610159148224d543ae4e05cb', label: 'Categories', name: 'terms', params: { type: 'category' } },
        { id: '610159148224d543ae4e05cc', label: 'Tags', name: 'terms', params: { type: 'tag' } }
      ].filter(Boolean)
    },
    req.can(Role.staff) && {
      id: '610159148224d543ae4e05cd',
      label: 'Pages',
      icon: 'pages',
      // name: 'posts',
      // params: { type: 'page' },
      children: [
        { id: '610159148224d543ae4e05ce', label: 'All pages', name: 'posts', params: { type: 'page' } },
        req.can(Role.admin) && { id: '610159148224d543ae4e05cf', label: 'New page', name: 'new', params: { type: 'page' } }
      ].filter(Boolean)
    },
    req.can(Role.staff) && {
      id: '610159148224d543ae4e05d0',
      label: 'Media',
      icon: 'media',
      // name: 'media',
      children: [
        { id: '610159148224d543ae4e05d1', label: 'Media library', name: 'media' },
        { id: '610159148224d543ae4e05d2', label: 'Upload', name: 'upload' }
      ].filter(Boolean)
    },
    req.can(Role.admin) && {
      id: '610159148224d543ae4e05d3',
      label: 'Users',
      icon: 'users',
      // name: 'users',
      children: [
        { id: '610159148224d543ae4e05d4', label: 'All users', name: 'users' },
        { id: '610159148224d543ae4e05d5', label: 'Roles', name: 'roles' },
        { id: '610159148224d543ae4e05d6', label: 'Permissions', name: 'permissions' }
      ].filter(Boolean)
    },
    req.can(Role.staff) && {
      id: '610159148224d543ae4e05d7',
      label: 'Comments',
      icon: 'comments',
      name: 'comments'
    },
    req.can(Role.admin) && {
      id: '610159148224d543ae4e05d8',
      label: 'Themes',
      icon: 'themes',
      // name: 'themes',
      children: [
        { id: '610159148224d543ae4e05d9', label: 'Themes', name: 'themes' },
        { id: '610159148224d543ae4e05da', label: 'Customization', name: 'customize' },
        { id: '610159148224d543ae4e05db', label: 'Widgets', name: 'widgets' },
        { id: '610159148224d543ae4e05dc', label: 'Navigation', name: 'navigation' }
      ].filter(Boolean)
    },
    req.can(Role.admin) && {
      id: '610159148224d543ae4e05dd',
      label: 'Plugins',
      icon: 'plugins',
      // name: 'plugins',
      children: [
        { id: '610159148224d543ae4e05de', label: 'Installed plugins', name: 'plugins' },
        { id: '610159148224d543ae4e05df', label: 'Install plugin', name: 'install', params: { type: 'plugin' } }
      ].filter(Boolean)
    },
    req.can(Role.owner) && {
      id: '610159148224d543ae4e05e0',
      label: 'Tools',
      icon: 'tools',
      // name: 'tools',
      children: [
        { id: '610159148224d543ae4e05e1', label: 'Available tools', name: 'tools' },
        { id: '610159148224d543ae4e05e2', label: 'Import', name: 'import' },
        { id: '610159148224d543ae4e05e3', label: 'Export', name: 'export' }
      ].filter(Boolean)
    },
    req.can(Role.staff) && {
      id: '610159148224d543ae4e05e4',
      label: 'Settings',
      icon: 'settings',
      // name: 'options',
      // params: { type: 'general' },
      children: [
        { id: '610159148224d543ae4e05e5', label: 'General', name: 'options', params: { type: 'general' } },
        { id: '610159148224d543ae4e05e6', label: 'Writing', name: 'options', params: { type: 'writing' } },
        { id: '610159148224d543ae4e05e7', label: 'Reading', name: 'options', params: { type: 'reading' } },
        { id: '610159148224d543ae4e05e8', label: 'Discussion', name: 'options', params: { type: 'discussion' } },
        { id: '610159148224d543ae4e05e9', label: 'Media', name: 'options', params: { type: 'media' } },
        req.can(Role.admin) && { id: '610159148224d543ae4e05ea', label: 'Permalink', name: 'options', params: { type: 'permalink' } }
      ].filter(Boolean)
    },
    // Labs Pages
    {
      id: '610159148224d543ae4e05b9',
      label: 'Labs',
      icon: 'flask',
      name: 'labs'
    }
  ].filter(Boolean))
})

export default router
