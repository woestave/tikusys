import { requestPostFactory } from '@/apis/request';

export const getLeftMenuService = requestPostFactory<null, API__LeftMenu.Res>('left-menu');
