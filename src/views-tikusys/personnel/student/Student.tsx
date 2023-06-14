import { personnelServices } from '@/apis/services/personnel';
import { PageTitle } from '@/components/PageTitle';
import { useRequest } from '@/hooks/use-request';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import { globalLoading } from '@/utils/create-loading';
import { functionalComponent, useCallbackP } from '@/utils/functional-component';
import { Trash } from '@vicons/ionicons5';
import { Edit } from '@vicons/tabler';
import { TeacherRole } from 'common-packages/constants/teacher-role';
import { sleepCurrying } from 'common-packages/utils/sleep';
import { DataTableColumns, FormInst, FormRules, NButton, NDataTable, NDivider, NForm, NFormItem, NFormItemGi, NGrid, NIcon, NInput, NP, NPopconfirm, NSelect, NText, PaginationInfo, useMessage, } from 'naive-ui';
import { RenderPrefix } from 'naive-ui/es/pagination/src/interface';
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { reactive, ref } from 'vue';

function getDefaultStudentForm (): API__Student.CreateReq {
  return {
    studentId: 0,
    studentName: '',
    studentIdCard: '',
    studentClass: null,
    studentStatus: 0,
  };
}

// const _IDRe18 =  /^([1-6][1-9]|50)\\d{4}(18|19|20)\\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$/;
// const _IDRe15 =  /^([1-6][1-9]|50)\\d{4}\\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\\d{3}$/;

function isIdCard (text: string) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/.test(text);
}

export default functionalComponent(() => {

  const formRef = ref<FormInst>();

  const message = useMessage();

  const rules: FormRules = {
    studentName: {
      required: true,
      whitespace: true,
      trigger: ['input', 'blur'],
      message: '请输入学生名称',
    },
    studentClass: {
      required: false,
      type: 'number',
      trigger: ['input', 'blur'],
      message: '请选择学生所属班级',
    },
    studentIdCard: {
      required: true,
      whitespace: true,
      min: 15,
      max: 18,
      validator (rule, value) {
        return isIdCard(String(value || ''));
      },
      trigger: ['input', 'blur'],
      message: '请输入合法的学生身份证号',
    },
  }


  const filterForm = ref({
    studentName: '',
    studentClass: null,
    studentStatus: null,
  });

  const commonDataPinia = useCommonDataPinia();

  const [ userInfo ] = useRequest(personnelServices.getUserInfo());

  const pagination = reactive<Partial<PaginationInfo & {
    prefix: RenderPrefix;
  }>>({
    pageSize: 10,
    page: 1,
    itemCount: 0,
    prefix: ({ itemCount }) => `${itemCount}条记录`,
  });

  const [ studentList, getStudentList, getStudentListStatus ] = useCallbackP(() => personnelServices.studentList({
    pageNumber: pagination.page,
    pageSize: pagination.pageSize,
    ...filterForm.value,
  }).then(x => {
    pagination.itemCount = x.data.total;
    return x.data.list || [];
  }));
  getStudentList();

  function onUpdatePageNumber (newPageNumber: number) {
    pagination.page = newPageNumber;
    getStudentList();
  }

  const studentForm = ref<API__Student.CreateReq>(getDefaultStudentForm());


  const studentCreateOrEditLoading = globalLoading.useCreateLoadingKey({ name: '新建学生信息...' });
  const studentChangeClassLoading = globalLoading.useCreateLoadingKey({ name: '修改学生班级...' });

  function onClear () {
    studentForm.value = getDefaultStudentForm();
  }
  function onSubmitOrEdit () {
    formRef.value?.validate().then(() => {
      studentCreateOrEditLoading.show();
      personnelServices.studentCreateOrUpdate({...studentForm.value}).then((res) => {
        message.success(isEditing.value ? '修改成功' : '新建成功');
        isEditing.value = false;
        onClear();
      }).then(sleepCurrying(350)).then(getStudentList).finally(studentCreateOrEditLoading.hide);
    });
  }

  function onChangeStudentClass (student: API__Student.TableStruct__Student, targetClassId: number) {
    console.log('换班', student.studentName, student.studentClass, targetClassId);
    studentChangeClassLoading.show();
    personnelServices.changeStudentClass({ studentId: student.studentId, targetClassId, }).then((res) => {
      console.log('修改班级成功');
    }).finally(studentChangeClassLoading.hide);
  }



  const isEditing = ref(false);
  function onEdit (row: API__Student.TableStruct__Student) {
    isEditing.value = true;
    studentForm.value = {...row};
    document.querySelector('.personnel-student')?.scrollIntoView({ behavior: 'smooth', });
  }
  function onEditCancel () {
    isEditing.value = false;
    studentForm.value = getDefaultStudentForm();
  }

  const removeStudentLoading = globalLoading.useCreateLoadingKey({ name: '删除学生信息...' });
  function onRemove (row: API__Student.TableStruct__Student) {
    removeStudentLoading.show();
    personnelServices.studentRemove({ id: row.studentId }).then((res) => {
      res.data.succ === 1 && message.success('删除学生信息成功');
      onClear();
      isEditing.value = false;
      getStudentList();
    }).finally(removeStudentLoading.hide);
  }




  return () => userInfo.value?.userInfo.taecherRole !== TeacherRole.super ? (
    <NText>权限不足。</NText>
  ) : (
    <div class="personnel-student">
      <PageTitle />
      <NDivider />
      <NForm
        class="student-create-form"
        ref={formRef}
        model={studentForm.value}
        rules={rules}
        labelPlacement="left"
        labelWidth="auto"
        requireMarkPlacement="right-hanging"
        size="medium"
        style={{
          maxWidth: '640px'
        }}
      >
        <NFormItem label="学生名称" path="studentName">
          <NInput
            v-model:value={studentForm.value.studentName}
            minlength={1}
            maxlength={10}
            showCount
            placeholder="学生名称"
          />
        </NFormItem>
        <NFormItem label="所属班级" path="studentClass">
          <NSelect
            v-model:value={studentForm.value.studentClass}
            options={[{
              value: null,
              label: '无',
            }, ...commonDataPinia.classes] as SelectMixedOption[]}
            filterable
            placeholder="所属班级"
          ></NSelect>
        </NFormItem>
        <NFormItem label="身份证号" path="studentIdCard">
          <NInput
            v-model:value={studentForm.value.studentIdCard}
            minlength={15}
            maxlength={18}
            showCount
            placeholder="身份证号"
          />
        </NFormItem>
        <div class="form-actions">
          {
            isEditing.value
              ? (
                <>
                  <NButton class="clear-btn" ghost round type="error" onClick={onEditCancel}>取消编辑</NButton>
                  <NButton type="primary" round onClick={onSubmitOrEdit}>确认修改</NButton>
                </>
              )
              : (
                <>
                  <NButton class="clear-btn" ghost round type="error" onClick={onClear}>清空</NButton>
                  <NButton type="primary" round onClick={onSubmitOrEdit}>新建</NButton>
                </>
              )
          }
        </div>
      </NForm>
      <NDivider />
      <NForm labelAlign="left">
        <NGrid xGap={12}>
          <NFormItemGi span={6} label="学生名称|证件号">
            <NInput
              type="text"
              maxlength={20}
              showCount
              v-model:value={filterForm.value.studentName}
              clearable
              onClear={() => setTimeout(getStudentList)}
            />
          </NFormItemGi>
          <NFormItemGi span={6} label="所属班级">
            <NSelect
              v-model:value={filterForm.value.studentClass}
              options={commonDataPinia.classes as SelectMixedOption[]}
              placeholder="所属班级"
              filterable
              clearable
              onClear={() => setTimeout(getStudentList)}
            />
          </NFormItemGi>
          <NFormItemGi span={3} label="学生状态">
            <NSelect
              v-model:value={filterForm.value.studentStatus}
              options={commonDataPinia.studentStatus as SelectMixedOption[]}
              clearable
              onClear={() => setTimeout(getStudentList)}
              placeholder="学生状态"
            />
          </NFormItemGi>
          <NFormItemGi span={3}>
            <NButton type="primary" onClick={getStudentList}>查询</NButton>
          </NFormItemGi>
        </NGrid>
      </NForm>
      <NDataTable
        data={studentList.value || []}
        remote
        pagination={pagination}
        onUpdatePage={onUpdatePageNumber}
        columns={[
          {
            title: '学生编号',
            key: 'studentId',
          },
          {
            title: '学生名称',
            key: 'studentName',
            ellipsis: {
              tooltip: true,
            },
          },
          {
            title: '所属班级',
            key: 'studentClass',
            // ellipsis: {
              // tooltip: true,
            // },
            render (row) {
              // return commonDataPinia.classes.find(x => x.value === row.studentClass)?.label || '无';
              return (
                <NSelect
                  v-model:value={row.studentClass}
                  options={commonDataPinia.classes as SelectMixedOption[]}
                  placeholder="所属班级"
                  filterable
                  onUpdateValue={(classId: number) => onChangeStudentClass(row, classId)}
                ></NSelect>
              );
            },
          },
          {
            title: '学生状态',
            key: 'studentStatus',
            align: 'center',
            render (row) {
              return commonDataPinia.studentStatus.find(x => x.value === row.studentStatus)?.label;
            },
          },
          {
            title: '操作',
            key: '',
            render (row) {
              return (
                <>
                  <NButton size="small" text onClick={() => onEdit(row)}>
                    <NIcon size={22}>
                      <Edit />
                    </NIcon>
                  </NButton>
                  <NPopconfirm
                    class="global--n-popconfirm"
                    negativeText="取消"
                    positiveText="确认"
                    onPositiveClick={() => onRemove(row)}
                    // onNegativeClick="handleNegativeClick"
                  >
                    {{
                      trigger: () => (
                        <NButton size="small" text style="margin-left: 16px;">
                          <NIcon size={22}>
                            <Trash />
                          </NIcon>
                        </NButton>
                      ),
                      default: () => (
                        <div>
                          <NP>
                            <p>删除后无法恢复。</p>
                            <p style="font-size: 12px; color: gray;"></p>
                          </NP>
                        </div>
                      ),
                    }}
                  </NPopconfirm>
                </>
              );
            },
          },
        ] as DataTableColumns<API__Student.TableStruct__Student>}
        loading={getStudentListStatus.value === 'pending'}
      >
      </NDataTable>
    </div>
  );
});
