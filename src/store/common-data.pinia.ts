import { getCommonData } from '@/apis/services/common-data';
import { useRequest } from '@/hooks/use-request';
import { defineStore } from 'pinia';
import { computed } from 'vue';

export const useCommonDataPinia = defineStore('commonData', () => {
  const commonData = useRequest(getCommonData());
  // console.log('useCommonDataPinia', commonData);
  function getListCurried<K extends keyof API__CommonData.Res> (key: K) {
    return computed(() => commonData[0].value?.[key]! || []);
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
    return commonData[0].value?.phases.find(x => x.value === phaseId)?.label || null;
  }

  const result = {
    commonData: commonData[0],
    commonDataPromise: commonData[1],
    commonDataStatus: commonData[2],
    // actions
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
