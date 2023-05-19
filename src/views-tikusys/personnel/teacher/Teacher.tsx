import { personnelServices } from '@/apis/services/personnel';
import { PageTitle } from '@/components/PageTitle';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import { globalLoading } from '@/utils/create-loading';
import { functionalComponent, useCallbackP } from '@/utils/functional-component';
// import getRoleColor from '@/utils/get-role-color';
import { TeacherRole } from 'common-packages/constants/teacher-role';
import { sleepCurrying } from 'common-packages/utils/sleep';
import { createValueLabelObj } from 'common-packages/utils/value-label-utils';
import { DataTableColumns, FormInst, FormRules, NButton, NDataTable, NDivider, NForm, NFormItem, NInput, NSelect, useNotification } from 'naive-ui';
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { computed, ref } from 'vue';
import md5 from 'blueimp-md5';
window.md5 = md5;
function getDefaultTeacherForm (): API__Teacher.CreateReq {
  return {
    teacherId: 0,
    teacherName: '',
    teacherIdCard: '',
    teacherClass: null,
    teacherStatus: 0,
    teacherRole: TeacherRole.teacher,
  };
}

// const _IDRe18 =  /^([1-6][1-9]|50)\\d{4}(18|19|20)\\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$/;
// const _IDRe15 =  /^([1-6][1-9]|50)\\d{4}\\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\\d{3}$/;

function isIdCard (text: string) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/.test(text);
}

export default functionalComponent(() => {

  const formRef = ref<FormInst>();

  const rules: FormRules = {
    teacherName: {
      required: true,
      whitespace: true,
      trigger: ['input', 'blur'],
      message: '请输入教师名称',
    },
    teacherClass: {
      required: true,
      type: 'number',
      trigger: ['input', 'blur'],
      validator (rule, value) {
        if (!value && teacherForm.value.teacherRole === TeacherRole.teacher) {
          return false;
        }
        return true;
      },
      message: '请选择教师所属班级',
    },
    teacherIdCard: {
      required: true,
      whitespace: true,
      min: 15,
      max: 18,
      validator (rule, value) {
        return isIdCard(String(value || ''));
      },
      trigger: ['input', 'blur'],
      message: '请输入合法的教师身份证号',
    },
    teacherRole: {
      required: true,
      type: 'number',
      trigger: ['input', 'blur'],
      message: '请选择教师的职能',
    },
  }

  const commonDataPinia = useCommonDataPinia();

  const teacherRoles = computed(() => {
    return Object.keys(commonDataPinia.teacherRoleMap).map((roleId) => {
      return createValueLabelObj(+roleId, commonDataPinia.teacherRoleMap[+roleId as TeacherRole]);
    });
  });

  const [ teacherList, getTeacherList, getTeacherListStatus ] = useCallbackP(() => personnelServices.teacherList().then(x => x.data.list || []));
  getTeacherList();

  const teacherForm = ref<API__Teacher.CreateReq>(getDefaultTeacherForm());

  const notification = useNotification();

  const teacherCreateLoading = globalLoading.useCreateLoadingKey({ name: '创建教师信息...' });
  const teacherChangeClassLoading = globalLoading.useCreateLoadingKey({ name: '修改教师班级...' });
  const teacherChangeRoleLoading = globalLoading.useCreateLoadingKey({ name: '修改教师权限...' });

  function onClear () {
    teacherForm.value = getDefaultTeacherForm();
  }
  function onSubmit () {
    formRef.value?.validate().then(() => {
      teacherCreateLoading.show();
      personnelServices.teacherCreate({...teacherForm.value}).then((res) => {
        notification.success({ title: '新建成功', duration: 0, });
      }).then(sleepCurrying(350)).then(getTeacherList).finally(teacherCreateLoading.hide);
    });
  }

  function onChangeTeacherClass (teacher: API__Teacher.TableStruct__Teacher, targetClassId: number) {
    console.log('换班', teacher.teacherName, teacher.teacherClass, targetClassId);
    teacherChangeClassLoading.show();
    personnelServices.changeTeacherClass({ teacherId: teacher.teacherId, targetClassId, }).then((res) => {
      console.log('修改班级成功');
    }).finally(teacherChangeClassLoading.hide);
  }
  function onChangeTeacherRole (teacher: API__Teacher.TableStruct__Teacher, targetRoleId: number) {
    console.log('职能', teacher.teacherName, teacher.teacherClass, targetRoleId);
    teacherChangeRoleLoading.show();
    personnelServices.changeTeacherRole({ teacherId: teacher.teacherId, targetRoleId, }).then((res) => {
      console.log('修改职能成功');
    }).finally(teacherChangeRoleLoading.hide);
  }

  function onIfNotTeacher (role: TeacherRole) {
    if (role !== TeacherRole.teacher) {
      // 只有讲师才需要选择班级 没选择讲师要将选择的班级id设置为null
      teacherForm.value.teacherClass = null;
    }
  }


  return () => (
    <div class="personnel-teacher">
      <PageTitle />
      <NDivider />
      <NForm
        class="teacher-create-form"
        ref={formRef}
        model={teacherForm.value}
        rules={rules}
        labelPlacement="left"
        labelWidth="auto"
        requireMarkPlacement="right-hanging"
        size="medium"
        style={{
          maxWidth: '640px'
        }}
      >
        <NFormItem label="教师名称" path="teacherName">
          <NInput
            v-model:value={teacherForm.value.teacherName}
            minlength={1}
            maxlength={10}
            showCount
            placeholder="教师名称"
          />
        </NFormItem>
        <NFormItem label="所属班级" path="teacherClass">
          <NSelect
            v-model:value={teacherForm.value.teacherClass}
            options={commonDataPinia.classes as SelectMixedOption[]}
            filterable
            placeholder="所属班级"
            disabled={teacherForm.value.teacherRole !== TeacherRole.teacher}
          ></NSelect>
        </NFormItem>
        <NFormItem label="身份证号" path="teacherIdCard">
          <NInput
            v-model:value={teacherForm.value.teacherIdCard}
            minlength={15}
            maxlength={18}
            showCount
            placeholder="身份证号"
          />
        </NFormItem>
        <NFormItem label="职能" path="teacherRole">
        <NSelect
            v-model:value={teacherForm.value.teacherRole}
            options={teacherRoles.value as SelectMixedOption[]}
            filterable
            placeholder="教师职能"
            onUpdateValue={onIfNotTeacher}
          ></NSelect>
        </NFormItem>
        <div class="form-actions">
          <NButton class="clear-btn" ghost round type="error" onClick={onClear}>清空</NButton>
          <NButton round type="primary" onClick={onSubmit}>提交</NButton>
        </div>
      </NForm>
      <NDivider />
      <NDataTable
        data={teacherList.value || []}
        columns={[
          {
            title: '教师编号',
            key: 'teacherId',
          },
          {
            title: '教师名称',
            key: 'teacherName',
            ellipsis: {
              tooltip: true,
            },
          },
          {
            title: '所属班级',
            key: 'teacherClass',
            // ellipsis: {
              // tooltip: true,
            // },
            render (row) {
              return row.teacherRole === TeacherRole.teacher && (
                <NSelect
                  v-model:value={row.teacherClass}
                  options={commonDataPinia.classes as SelectMixedOption[]}
                  placeholder="所属班级"
                  filterable
                  onUpdateValue={(classId: number) => onChangeTeacherClass(row, classId)}
                ></NSelect>
              );
            },
          },
          {
            title: '教师状态',
            key: 'teacherStatus',
            align: 'center',
            render (row) {
              return commonDataPinia.studentStatus.find(x => x.value === row.teacherStatus)?.label;
            },
          },
          {
            title: '职能',
            key: 'teacherRole',
            align: 'center',
            render (row) {
              // return <span style={{ color: getRoleColor(row.teacherRole) }}>{commonDataPinia.teacherRoleMap[row.teacherRole]}</span>;
              return (
                <NSelect
                  v-model:value={row.teacherRole}
                  options={teacherRoles.value}
                  placeholder="职能"
                  filterable
                  onUpdateValue={(classId: number) => onChangeTeacherRole(row, classId)}
                ></NSelect>
              );
            },
          },
          {
            title: '操作',
            key: '',
            render () {
              return null;
            },
          },
        ] as DataTableColumns<API__Teacher.TableStruct__Teacher>}
        loading={getTeacherListStatus.value === 'pending'}
      >
      </NDataTable>
    </div>
  );
});
