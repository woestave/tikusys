/**
 * 本周第一天跟静静交接了题库系统的前端代码以及题库系统的墨刀原型图，熟悉了一遍代码，跑了一遍功能。
 * 
 * 第二天构建了node后端代码，node环境部署完成，接口跑通了，
 * 
 * 第三天(今天)数据库mysql构建完成，遇到一些问题也基本都解决了。
 * 与静静老师又过了一遍原型图，少量修改和删减了一些试卷的字段(所属阶段,是否AB卷,试卷数量)。
 * 
 * todo: 学生在哪个系统考试 学生端\学生端和教师端是否分开\权限控制是否有需要 1\学生和老师的账号如何管理或注册 人工
 */

import chalk from 'chalk';
import { PoolConnection } from 'mysql2';
import { Connection } from 'mysql2';
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';

export type SQLTable = ReturnType<typeof getSQLTable>;

type SQLLimit = [number, number?];

type OrderByType = 'asc' | 'desc';
type OrderBy<T> = { [K in keyof T]?: OrderByType; };

/**
 * RC = select count(1)
 */
type SqlType = 'C' | 'U' | 'R' | 'D';

type WhereList = Array<
{
  key: string;
  op: string;
  value: string | number | Array<string | number>;
  type: 'normal' | 'string';
}
  | typeof groupStartSymbol
  | typeof groupEndSymbol
  | typeof orSymbol
  | typeof andSymbol
>;

type JoinType = 'left' | 'right' | 'inner';

const groupStartSymbol = Symbol('groupStart');
const groupEndSymbol = Symbol('groupEnd');
const orSymbol = Symbol('or');
const andSymbol = Symbol('and');

interface SQLTableValue<T extends object> {
  tableName: string;
  insertData?: Omit<{ [K in keyof T]: T[K] extends object ? string : T[K]; }, any>[];
  updateData?: Partial<T>;
  limit?: SQLLimit;
  selectFields?: string[];
  orderByFields?: string[];
  orderBy?: OrderBy<T>;
  sqlType?: SqlType;
  whereList?: WhereList;
  joinList?: Array<{ tableName: string; on: string; joinType: JoinType; }>;
}



export function getSQLTable (mysqlPool: import('mysql2').Pool) {
  // const connectionPromisify = connection;

  class SQLTable<T extends object, ST extends SqlType | void = void, Struct extends Record<string, any> = T> {
    public static of<T extends object> (tableName: string) {
      return new this<T>({ tableName, });
    }

    ['constructor']!: typeof SQLTable;

    /**
     * 出库类型
     */
    public StructOut!: T;
    /**
     * 入库类型
     * 将所有的object类型都转为了string，所以在执行增改操作时，要将object类型都通过JSON.stringify序列化为字符串再插入或修改
     */
    public StructIn!: { [K in keyof T]: T[K] extends object ? string : T[K]; };

    public get tableName () {
      return this.__value.tableName;
    }

    protected constructor (protected __value: SQLTableValue<T>) {}

    public of<A extends T, SUB_ST extends SqlType | void = void, __Struct extends Record<string, any> = Struct> (__newValue: Partial<SQLTableValue<T>>) {
      return new this.constructor<A, SUB_ST extends void ? ST : SUB_ST, __Struct>({
        ...this.__value as A,
        ...__newValue as A,
        tableName: __newValue.tableName || this.tableName,
      });
    }

    public getFieldName<K extends keyof T> (field: K) {
      return `\`${String(field)}\`` as typeof field;
    }
    public getTableFieldName<K extends keyof T> (field: K) {
      return `${this.tableName}.\`${String(field)}\`` as typeof field;
    }

    protected __validate (sqlType: SQLTableValue<T>['sqlType']) {
      if (this.__value.sqlType && this.__value.sqlType !== sqlType) {
        throw Error(chalk.bgRed(`SQLTable::sql类型以固定为\`${this.__value.sqlType}\`操作，无法在此次sql语句内再次执行\`${sqlType}\`操作。`));
      }
    }

    public insert<
      K extends keyof T | '' = '',
      // S extends { [K in keyof T]: T[K] extends object ? string : T[K] } = { [K in keyof T]: T[K] },
      S extends this['StructIn'] = this['StructIn'],
    > (data: Omit<S, K extends '' ? '' : K>[]) {
      return this.of<T, 'C'>({
        insertData: data,
        sqlType: 'C',
      });
    }

    public delete () {
      return this.of<T, 'D'>({
        sqlType: 'D',
      });
    }

    public update (newData: Partial<T>) {
      return this.of<T, 'U'>({
        updateData: newData,
        sqlType: 'U',
      });
    }

    public select<
      __Struct extends Ks[0] extends (void | '*')
        ? T
        : Ks extends FieldKs
          ? { [K in Ks[any]]: Struct[K] }
          : Partial<Record<string, number | string>>,
      FieldKs extends Array<keyof Struct> = Array<keyof Struct>,
      Ks extends string[] = [],
    > (...fields: Ks) {
      return this.of<T, 'R', __Struct>({
        sqlType: 'R',
        selectFields: fields,
      });
    }


    public join<S extends object> (joinType: JoinType, tableName: SQLTable<S>, on: string) {
      return this.of<S & T, ST, S & T>({
        joinList: [
          ...this.__value.joinList || [],
          {
            tableName: tableName instanceof SQLTable ? tableName.__value.tableName : tableName,
            joinType,
            on,
          },
        ],
      });
    }


    public limit (...limit: SQLLimit) {
      return this.of({ limit, });
    }

    public orderBy (orderBy: OrderBy<T>) {
      return this.of({ orderBy, });
    }

    // public where (key: string, value: string | number): void;
    // public where (record: ): void;
    private __checkWherePrevHasOp () {
      const whereList = (this.__value.whereList || []);
      const last = whereList[whereList.length - 1];
      return (typeof last === 'symbol' && [andSymbol, orSymbol, groupStartSymbol].includes(last)) || (whereList.length === 0);
    }
    public where<OP extends string> (
      key: string,
      op: OP,
      value: void | null | (OP extends 'in' ? Array<number | string> : string | number),
    ) {
      if ((value === void 0) || value === null || (Array.isArray(value) && value.length === 0)) {
        return this;
      }

      return this.of({
        whereList: [
          ...this.__value.whereList || [],
          ...this.__checkWherePrevHasOp() ? [] : [andSymbol] as const,
          { key, op, value, type: 'normal', },
        ],
      });
    }

    public whereStr (whereStr: string) {
      return this.of({
        whereList: [
          ...this.__value.whereList || [],
          ...this.__checkWherePrevHasOp() ? [] : [andSymbol] as const,
          { key: '', op: '', value: whereStr, type: 'string', },
        ],
      });
    }

    public or () {
      return this.of({
        whereList: [...this.__value.whereList || [], orSymbol],
      });
    }

    public and () {
      return this.of({
        whereList: [...this.__value.whereList || [], andSymbol],
      });
    }

    public groupStart () {
      return this.of({
        whereList: [
          ...this.__value.whereList || [],
          ...this.__checkWherePrevHasOp() ? [] : [andSymbol] as const,
          groupStartSymbol,
        ],
      });
    }
    public groupEnd () {
      return this.of({
        whereList: [
          ...this.__value.whereList || [],
          groupEndSymbol,
        ],
      });
    }

    public sql () {

      const sqls = [
        __getSqlBase(this.__value),
        __joinWhiteSpace(__getSqlWhere(this.__value.whereList || null)),
        __joinWhiteSpace(__getOrderBy(this.__value.orderBy || null)),
        __joinWhiteSpace(__getLimit(this.__value.limit || null)),
      ];

      return sqls.join('') + ';';
    }

    /**
     * 为了方便事务的封装 __exec接收一个连接池，一个事务中的操作都统一使用一个连接池
     */
    public execBy (connection: PoolConnection) {
      return new Promise<ST extends 'R'
        ? Struct[]
        : ResultSetHeader
      >((resolve, reject) => {
        connection.query(this.sql(), function (err2, result, fields) {
          err2 ? reject(err2) : resolve(result as any);
          connection.release();
        });
      });
    }

    /**
     * 事务的具名方法
     */
    public execWithTransaction (connection: PoolConnection) {
      return this.execBy(connection);
    }

    /**
     * 执行
     */
    public exec () {
      return new Promise<ST extends 'R'
        ? Struct[]
        : ResultSetHeader
      >((resolve, reject) => {
        mysqlPool.getConnection((err1, connection) => {
          if (err1) {
            return reject(err1);
          }
          connection.beginTransaction
          resolve(this.execBy(connection) as any);
        });
      });
      // const pro = mysqlPool.query(this.sql()).then((res) => res[0]) as Promise<
      //   ST extends 'R'
      //     ? Struct[]
      //     : ResultSetHeader
      // >;
      // return pro;
    }
  }

  return SQLTable;
}



// const ReservedWord = Object.freeze(['count(*)', 'count(1)']);
function joinSign (v: string) {
  // if (ReservedWord.includes(v)) {
  //   return v;
  // }
  return `\`${v}\``;
}

function __getSqlBase<T extends object> (__value: SQLTableValue<T>) {
  const tn = __value.tableName;

  switch (__value.sqlType) {
    case 'C':
      return `insert into ${tn} (${Object.keys(__value.insertData?.[0] || {}).map(joinSign).join(', ')}) values ${__value.insertData?.map((x) => {
        return `(${Object.values<any>(x).map(__stringOrNumber).join(', ')})`;
      }).join(', ')}`;
    case 'U':
      return `update ${tn} set ${Object.keys(__value.updateData || {}).map((currKey) => {
        const updateData = __value.updateData!;
        return `\`${currKey}\` = ${__stringOrNumber(updateData[currKey as keyof typeof updateData] as string)}`;
      }).join(', ')}`;
    case 'R':
      const joinspace = (__value.joinList?.length ? ' ' : '');
      const joinstr = joinspace + (__value.joinList || []).map((x) => x.joinType + ' join ' + x.tableName + ' on ' + x.on).join(' ') + joinspace;
      return `select ${__value.selectFields?.join(', ') || '*'} from ${tn}${joinstr}`;
    case 'D':
      return `delete from ${tn}`;
    default: Error(chalk.bgRed(`__getPrefix::sql语句未指定CURD操作`));
  }
}

function __getSqlWhere (whereList: WhereList | null) {
  const whereStrList = (whereList || []).map((curr) => {
    let res = '';
    if (curr === groupStartSymbol) {
      res = `(`;
    } else if (curr === groupEndSymbol) {
      res = `)`;
    } else if (curr === orSymbol) {
      res = `OR`;
    } else if (curr === andSymbol) {
      res = 'AND';
    } else if ('key' in curr && 'value' in curr) {
      switch (curr.type) {
        case 'normal':
          res = `${curr.key} ${curr.op} ${Array.isArray(curr.value) ? `(${curr.value.map(__stringOrNumber).join(',')})` : __stringOrNumber(curr.value)}`;
          break;
        case 'string':
          res = curr.value as string;
          break;
      }
    }
    return res;
  });

  return whereStrList.length ? 'where ' + whereStrList.join(' ') : '';
}


function __getOrderBy<T> (orderBy: OrderBy<T> | null) {
  const str = Object.keys(orderBy || {}).map((currKey) => {
    return currKey + ' ' + orderBy![currKey as keyof typeof orderBy];
  });

  return str.length ? 'order by ' + str.join(', ') : '';
}


function __getLimit (limit: SQLLimit | null) {
  return limit?.length! > 0 ? 'limit ' + limit?.join(', ') || '' : '';
}

function __joinWhiteSpace (str: string) {
  return str ? ' ' + str : str;
}

function __stringOrNumber (v: string | number) {
  return typeof v === 'number' ? v : v === null ? 'NULL' : `'${(v || '').replace(/\'/g, `''`)}'`;
}

// function __getSqlLimit (sqlLimit?: SQLLimit) {
//   switch (sqlType) {
//     case 'C':
//     case 'U':
//     case 'D':
//       return '';
//     case 'R':
//       return fields?.join(',') || '';
//     default: Error(chalk.bgRed(`__getPrefix::sql语句未指定CURD操作`));
//   }
// }

