/** 先解析路径 module-alias必须放到最上面 */
import 'module-alias/register';
import moduleAliasRegister from 'module-alias';
moduleAliasRegister(__dirname + '/../package.json');

import chalk from 'chalk';
import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
// import cors from 'koa-cors';
import { createRouter } from './routes/create-router';
import * as jwts from '#/utils/jwt';
import koaJwt from 'koa-jwt';



const app = new Koa();

app.use(bodyparser());
app.use(jwts.status401);
app.use(koaJwt({ secret: jwts.JWT_SECRETS, }).unless({ path: jwts.jwtUnless, }));
app.use(createRouter());
app.use(logger());
app.on('error', (err, ctx) => console.error(`ERR::`, err, ctx));

export default app;


const port = 4000;
app.listen(port);
console.log(chalk.green(`Server running on http://localhost:${port}`));
