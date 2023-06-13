import mysql from 'mysql2';
import { getSQLTable } from './SQL';
import { PoolConnection } from 'mysql2';
import { tap } from 'ramda';

const mysql_CONFIG = {
  host: 'localhost',
  /** 线上线下数据库用户保持一致 */
  user: 'tiku_server',
  password: '123456',
  database: 'tiku_server',
} as const;
// 创建一个数据库连接
export const mysqlPool = mysql.createPool(mysql_CONFIG);

// console.log('数据库连接信息：', JSON.stringify(mysql_CONFIG, null, 2));


export const SQL_CURD = getSQLTable(mysqlPool);

export function createConnectionPromiseByPool () {
  return new Promise<PoolConnection>((resolve, reject) => {
    mysqlPool.getConnection((err, connection) => {
      err ? reject(err) : resolve(connection);
    });
  });
}

export function beginTransaction<R> (fn: (connection: mysql.PoolConnection) => Promise<R>) {

  return new Promise<R>((resolve, reject) => {
    createConnectionPromiseByPool()
      .then((connection) => {
        const release = () => connection.release();
        const rollback = () => connection.rollback((err) => {
          if (err) {
            console.error('事务回滚失败。');
          }
        });
        connection.beginTransaction((err) => {
          err
            ? [reject(err), release()]
            : fn(connection)
              .then((res) => {
                connection.commit((err) => {
                  if (err) {
                    reject(err);
                    rollback();
                  } else {
                    resolve(res);
                  }
                });
              })
              .catch((err) => {
                reject(err);
                rollback();
              })
              .finally(release);
        });
      })
      .catch(reject);
  });
}

