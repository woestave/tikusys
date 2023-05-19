import { ref, computed } from 'vue';
import { useRoute, RouterLink, useLink, } from 'vue-router';
import { MenuOption, NA, NLayoutSider, NMenu } from 'naive-ui';
import { Icon } from '@/components';
import { functionalComponent, useState } from '@/utils/functional-component';
import './Sidebar.less';
// import { useRequest } from '@/hooks/use-request';
// import { getLeftMenuService } from '@/apis/services/left-menu';


type Menu = API__LeftMenu.Menu;


export default functionalComponent(() => {

  const [collapsed, setCollapsed] = useState(false);

  // TODO: loading state
  // const { data: menus } = useMenus();
  // const [ leftMenuService, leftMenuServicePromise, ] = useRequest(getLeftMenuService());
  const leftMenuService = ref<API__LeftMenu.Res>({
    list: [
      {
        id: '1',
        label: '考试查询',
        icon: 'Newspaper',
        routeName: 'exam',
      },
      {
        id: '2',
        label: '成绩查询',
        icon: 'PodiumSharp',
        routeName: 'query-results',
      },
      {
        id: '3',
        label: '修改密码',
        icon: 'PasswordFilled',
        routeName: 'update-password',
      },
    ],
  });

  const menus = computed(() => leftMenuService.value?.list);

  const mapping = (items: Menu[]): MenuOption[] => items.map(item => ({
    ...item,
    key: item.id,
    label: () => item.routeName ? <RouterLink to={{ name: item.routeName, }}>{item.label}</RouterLink> : item.label,
    icon: () => typeof item.icon === 'string' ? <Icon type={item.icon} /> : null,
    children: item.children && mapping(item.children)
  }))

  const options = computed(() => (menus.value ? mapping(menus.value) : []));


  const route = useRoute();
  const [currentKey, setCurrentKey] = useState('');
  const expandedKeys = ref<string[]>([]);

  const routeMatched = (menu: Menu): boolean => {
    // return route.name === menu.name && (menu.params == null || JSON.stringify(route.params) === JSON.stringify(menu.params))
    return menu.routeName === route.name;
  }

  function matchExpanded (items: Menu[]) {
    let matched = false;
    for (const item of items) {
      if (item.children != null) {
        matchExpanded(item.children) && expandedKeys.value.push(item.id);
      }
      if (routeMatched(item)) {
        currentKey.value = item.id;
        matched = true;
      }
    }
    return matched;
  }

  // watchEffect(() => menus.value && matchExpanded(menus.value))
  // leftMenuServicePromise.then((res) => matchExpanded(res.list));
  matchExpanded(leftMenuService.value.list);

  return () => (
    <NLayoutSider
      width={220}
      nativeScrollbar={false}
      collapsed={collapsed.value}
      collapseMode="width"
      showTrigger="bar"
      bordered
      onUpdateCollapsed={setCollapsed}
    >
      <RouterLink to="/" custom>
        {(slotProps: ReturnType<typeof useLink>) => (
          <NA class="logo" {...{href: slotProps.href, onClick: slotProps.navigate,}}>
            <svg viewBox="0 0 472 450">
              <defs>
                <mask id="mask" fill="#fff">
                  <path d="M472 114.26L203.029 335.74H407.1L472 449.48H64.9L0 335.74l268.971-221.48H64.9L0 .52h407.1z" />
                </mask>
                <filter id="shadow" x="-12.7%" y="-13.4%" width="125.4%" height="126.7%" filterUnits="objectBoundingBox">
                  <feOffset in="SourceAlpha" result="offset-outer" />
                  <feGaussianBlur stdDeviation="20" in="offset-outer" result="blue-outer" />
                  <feComposite in="blue-outer" in2="SourceAlpha" operator="out" result="blue-outer" />
                  <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" in="blue-outer" />
                </filter>
              </defs>
              <g mask="url(#mask)">
                <path fill="currentColor" d="M0 0h472v449H0z" />
                <path d="M0 335.74l64.9 113.74L472 114.26 407.1.52z" filter="url(#shadow)" />
              </g>
            </svg>
            <span>{ '考试系统' }</span>
          </NA>
        )}
      </RouterLink>
      <NMenu
        value={currentKey.value}
        defaultExpandedKeys={expandedKeys.value}
        options={options.value}
        rootIndent={18}
        onUpdateValue={setCurrentKey}
      />
    </NLayoutSider>
  );
});

