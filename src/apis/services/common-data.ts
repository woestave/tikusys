import { requestPostFactory } from '@/apis/request';

export const getCommonData = requestPostFactory<null, API__CommonData.Res>('common-data');
