declare namespace API__LeftMenu {

  type Menu = {
    id: string;
    label: string;
    icon?: string;
    name?: string;
    routeName?: string;
    params?: { [key: string]: string; }
    disabled?: boolean;
    children?: Menu[];
  };

  interface Res {
    list: Menu[];
  }
}
