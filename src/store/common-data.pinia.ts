import { getCommonData } from '@/apis/services/common-data';
import { globalLoading } from '@/utils/create-loading';
import { useCallbackP } from '@/utils/functional-component';
import { NButton, NRow, useMessage } from 'naive-ui';
// import { useRequest } from '@/hooks/use-request';
import { defineStore } from 'pinia';
import { computed, h } from 'vue';

export const useCommonDataPinia = defineStore('commonData', () => {
  const commonDataLoading = globalLoading.useCreateLoadingKey({ name: '获取公共数据..' });
  const message = useMessage();
  const [commonData, fetchCommonData, commonDataStatus] = useCallbackP(() => {
    commonDataLoading.show();
    return getCommonData()
      .then((res) => res.data)
      .catch((err) => {
        if (err?.errNo === 401) {
          // message.error('登录已过期');
        } else {
          message.error(() => h(NRow, { alignItems: 'center', justifyContent: 'space-between' }, [
            // 等同 <span>获取公共信息失败，网络或服务器错误</span>
            h('span', null, '获取公共信息失败，网络或服务器错误'),
            // 等同<NButton text type="primary" style="margin-left: 24px;" onClick={fetchCommonData}>重试</NButton>
            h(NButton, {text: true, type: 'primary', style: { marginLeft: '24px' }, onClick: fetchCommonData}, '重试'),
          ]));
        }
        return Promise.reject(err);
      })
      .finally(commonDataLoading.hide);
  });
  fetchCommonData();
  // console.log('useCommonDataPinia', commonData);
  function getListCurried<K extends keyof API__CommonData.Res> (key: K) {
    return computed(() => commonData.value?.[key]! || []);
  }
  const classes = getListCurried('classes');
  const phases = getListCurried('phases');
  const classTypes = getListCurried('classTypes');
  const majors = getListCurried('majors');
  const studentStatus = getListCurried('studentStatus');
  const teacherStatus = getListCurried('teacherStatus');
  const teacherRoleMap = getListCurried('teacherRoleMap');

  /**
   * 根据id获取phaseName
   */
  function getPhaseName (phaseId: null | number) {
    return commonData.value?.phases.find(x => x.value === phaseId)?.label || null;
  }

  const result = {
    commonData: commonData,
    commonDataStatus,
    // actions
    fetchCommonData,
    getPhaseName,
    classes,
    phases,
    classTypes,
    majors,
    studentStatus,
    teacherStatus,
    teacherRoleMap,
  };

  return result;
});
