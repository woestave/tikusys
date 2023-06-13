import { routePOST } from '#/routes/route';
import { tikuUpdate } from './update';
import { tikuCreate } from './create';

export default routePOST<API__Tiku.CreateOrUpdateReq, API__Tiku.CreateOrUpdateRes>((context) => {

  const body = context.request.body;

  if (typeof body.question.id === 'number' && body.question.id !== 0) {
    return tikuUpdate(body).then((res) => ({
      ...res,
      type: 'update',
    }));
  } else {
    return tikuCreate(body).then((res) => ({
      ...res,
      type: 'create',
    }));
  }
});
