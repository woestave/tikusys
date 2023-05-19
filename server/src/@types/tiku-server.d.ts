declare namespace TikuServer {
  declare interface ResponseType<D> {
    data: D;
    errMsg: string;
    errNo: number;
  }
}
