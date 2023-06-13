import { routePOST } from '#/routes/route';
import { exampaperUpdate } from './update';
import { exampaperCreate } from './create';

export default routePOST<API__Exampaper.CreateOrUpdateReq, API__Exampaper.CreateOrUpdateRes>((context) => {

  const body = context.request.body;

  if (typeof body.paperId === 'number' && body.paperId !== 0) {
    return exampaperUpdate(body).then((res) => ({
      ...res,
      type: 'update',
    }));
  } else {
    return exampaperCreate(body).then((res) => ({
      ...res,
      type: 'create',
    }));
  }
});
