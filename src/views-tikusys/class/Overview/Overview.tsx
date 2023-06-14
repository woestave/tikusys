// @ts-check
import { functionalComponent, useCallbackP } from '@/utils/functional-component';
import './Overview.less';
import { PageTitle } from '@/components/PageTitle';
import { PageSubTitle } from '@/components/PageSubTitle';
import { DataTableColumns, FormInst, FormRules, NButton, NDataTable, NDivider, NForm, NFormItem, NH3, NIcon, NInput, NP, NPopconfirm, NSelect, NText, PaginationInfo, useMessage } from 'naive-ui';
import { reactive, ref } from 'vue';
import { classServices } from '@/apis/services/class';
import { prop, tap } from 'ramda';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { sleepCurrying } from 'common-packages/utils/sleep';
import { globalLoading } from '@/utils/create-loading';
import { Edit } from '@vicons/tabler';
import { Trash } from '@vicons/ionicons5';
import { RenderPrefix } from 'naive-ui/es/pagination/src/interface';
import { TeacherRole } from 'common-packages/constants/teacher-role';
import { useRequest } from '@/hooks/use-request';
import { personnelServices } from '@/apis/services/personnel';

function getDefaultClassForm () {
  return {
    classType: null,
    className: '',
    id: 0,
    classMajor: null,
    classTeacher: [],
  };
}


interface CreateClassForm extends Omit<API__Class.CreateReq, 'classType' | 'classMajor'> {
  classType: null | number;
  classMajor: null | number;
}

export default functionalComponent(() => {

  const commonDataPinia = useCommonDataPinia();


  const [ userInfo ] = useRequest(personnelServices.getUserInfo());


  const message = useMessage();

  const pagination = reactive<Partial<PaginationInfo & {
    prefix: RenderPrefix;
  }>>({
    pageSize: 10,
    page: 1,
    itemCount: 0,
    prefix: ({ itemCount }) => `${itemCount}条记录`,
  });

  const [ classList, getClassList, getClassListStatus ] = useCallbackP(() => classServices.list({
    pageNumber: pagination.page,
    pageSize: pagination.pageSize,
  }).then(prop('data')));

  function getClassListWithPage () {
    return getClassList().then((res) => {
      pagination.itemCount = res.total;
      return res;
    });
  }
  getClassListWithPage();

  const formRef = ref<FormInst | null>(null);

  const isEditing = ref(false);
  const createClassForm = ref<CreateClassForm>(getDefaultClassForm());

  const rules: FormRules = {
    className: {
      required: true,
      whitespace: true,
      trigger: ['input', 'blue'],
      min: 1,
      max: 30,
      message: '请输入班级名称',
    },
    classType: {
      required: true,
      trigger: ['input', 'blue'],
      type: 'number',
      message: '请选择班级类型',
    },
    classMajor: {
      required: true,
      trigger: ['input', 'blue'],
      type: 'number',
      message: '请选择所属专业',
    },
  };


  function onEdit (row: API__Class.TableStruct__Class) {
    isEditing.value = true;
    createClassForm.value = {...row};
    document.querySelector('.class-overview')?.scrollIntoView({ behavior: 'smooth', });
  }
  function onEditCancel () {
    isEditing.value = false;
    createClassForm.value = getDefaultClassForm();
  }

  const removeClassLoading = globalLoading.useCreateLoadingKey({ name: '删除班级...' });
  function onRemove (row: API__Class.TableStruct__Class) {
    removeClassLoading.show();
    classServices.remove({ id: row.id }).then((res) => {
      res.data.succ === 1 && message.success('删除班级成功');
      isEditing.value = false;
      onClear();
      getClassListWithPage();
    }).finally(removeClassLoading.hide);
  }


  const createColumns = ({}: {}): DataTableColumns<API__Class.TableStruct__Class> => {
    return [
      {
        title: '班级编号',
        key: 'id',
        width: 100,
      },
      {
        title: '班级名称',
        key: 'className',
        // width: 400,
        ellipsis: {
          tooltip: true,
        },
        render (row) {
          return (
            <span>{row.className}</span>
          );
        }
      },
      {
        title: '班级类型',
        key: 'classType',
        // width: 400,
        ellipsis: {
          tooltip: true,
        },
        render (row) {
          return (
            <span>{commonDataPinia.classTypes.find(x => x.value === row.classType)?.label}</span>
          );
        }
      },
      {
        title: '所属专业',
        key: 'classMajor',
        render (row) {
          return (
            <span>{commonDataPinia.majors.find(x => x.value === row.classMajor)?.label}</span>
          );
        }
      },
      {
        title: '学生数量',
        key: 'studentCount',
      },
      {
        title: '操作',
        key: 'actions',
        width: 160,
        align: 'center',
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
                        <p style="font-size: 12px; color: gray;">有学生的班级不能删除。</p>
                      </NP>
                    </div>
                  ),
                }}
              </NPopconfirm>
            </>
          );
        }
      }
    ]
  }

  const columns = createColumns({});

  const createClassLoading = globalLoading.useCreateLoadingKey({ name: '班级保存中...' });
  const getClassListLoading = globalLoading.useCreateLoadingKey({ name: '获取新的班级列表...' });


  function onUpdatePageNumber (newPageNumber: number) {
    pagination.page = newPageNumber;
    getClassListWithPage();
  }


  function onClear () {
    createClassForm.value.classMajor = null;
    createClassForm.value.className = '';
    createClassForm.value.classTeacher = [];
    createClassForm.value.classType = null;
    createClassForm.value.id = 0;
  }

  function onSubmitOrEdit () {
    formRef.value?.validate().then(() => {
      createClassLoading.show();
      getClassListLoading.show();
      classServices
        .createOrUpdate({
          ...createClassForm.value,
          classType: createClassForm.value.classType!,
          classMajor: createClassForm.value.classMajor!,
        })
        .then(sleepCurrying(300))
        .then(tap(createClassLoading.hide))
        .then((res) => {
          console.log('成功', res);
          message.success(isEditing.value ? '修改班级成功' : '新建班级成功');
          isEditing.value = false;
          onClear();
          return getClassListWithPage().then(sleepCurrying(300)).finally(getClassListLoading.hide);
        }).finally(createClassLoading.hide);
    });
  }

  return () => userInfo.value?.userInfo.taecherRole !== TeacherRole.super ? (
    <NText>权限不足。</NText>
  ) : (
    <div class="class-overview">
      <PageTitle />
      <PageSubTitle>班级管理大盘</PageSubTitle>
      <NDivider />
      <NH3>班级{isEditing.value ? '编辑' : '新建'}</NH3>
      <NForm
        class="class-overview-create-form"
        ref={formRef}
        model={createClassForm.value}
        rules={rules}
        labelPlacement="left"
        labelWidth="auto"
        requireMarkPlacement="right-hanging"
        size="medium"
        style={{
          maxWidth: '640px'
        }}
      >
        <NFormItem label="班级名称" path="className">
          <NInput
            v-model:value={createClassForm.value.className}
            maxlength={30}
            minlength={1}
            showCount
          />
        </NFormItem>
        <NFormItem label="班级类型" path="classType">
          <NSelect
            v-model:value={createClassForm.value.classType}
            options={commonDataPinia.classTypes as SelectMixedOption[]}
          />
        </NFormItem>
        <NFormItem label="所属专业" path="classMajor">
          <NSelect
            v-model:value={createClassForm.value.classMajor}
            options={commonDataPinia.majors as SelectMixedOption[]}
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
      <NH3>班级列表</NH3>
      <NDataTable
        columns={columns}
        rowKey={prop('id')}
        remote
        loading={getClassListStatus.value === 'pending'}
        data={classList.value?.list || []}
        pagination={pagination}
        onUpdatePage={onUpdatePageNumber}
        bordered={false}
      />
    </div>
  );
});
