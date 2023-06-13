import { routePOST } from '#/routes/route';
import { classUpdate } from './update';
import { classCreate } from './create';

export default routePOST<API__Class.CreateOrUpdateReq, API__Class.CreateOrUpdateRes>((context) => {

  const body = context.request.body;

  if (typeof body.id === 'number' && body.id !== 0) {
    return classUpdate(body).then((res) => ({
      ...res,
      type: 'update',
    }));
  } else {
    return classCreate(body).then((res) => ({
      ...res,
      type: 'create',
    }));
  }
});
