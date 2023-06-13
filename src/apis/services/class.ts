import { requestPostFactory } from '../request';


export const classServices = {
  list: requestPostFactory<API__Class.ListReq, API__Class.ListRes>('class/list'),
  /**
   * 如果参数中有id且不为0视为修改班级，否则视为新建
   */
  createOrUpdate: requestPostFactory<API__Class.CreateReq, API__Class.CreateRes>('class/create-or-update'),
  // update: requestPostFactory<API__Class.UpdateReq, API__Class.UpdateRes>('class/update'),
  remove: requestPostFactory<API__Class.RemoveReq, API__Class.RemoveRes>('class/remove'),
};
