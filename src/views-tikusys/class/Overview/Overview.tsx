// @ts-check
import { functionalComponent, useCallbackP } from '@/utils/functional-component';
import './Overview.less';
import { PageTitle } from '@/components/PageTitle';
import { PageSubTitle } from '@/components/PageSubTitle';
import { DataTableColumns, FormInst, FormRules, NButton, NDataTable, NDivider, NForm, NFormItem, NH3, NInput, NSelect, PaginationInfo } from 'naive-ui';
import { reactive, ref } from 'vue';
import { classServices } from '@/apis/services/class';
import { prop, tap } from 'ramda';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { sleepCurrying } from 'common-packages/utils/sleep';
import { globalLoading } from '@/utils/create-loading';


interface CreateClassForm extends Omit<API__Class.CreateReq, 'classType' | 'classMajor'> {
  classType: null | number;
  classMajor: null | number;
}

export default functionalComponent(() => {

  const commonDataPinia = useCommonDataPinia();

  const [ classList, getClassList, getClassListStatus ] = useCallbackP(() => classServices.list({}).then(prop('data')));

  getClassList();

  const formRef = ref<FormInst | null>(null);

  const createClassForm = ref<CreateClassForm>({
    classType: null,
    className: '',
    id: 0,
    classMajor: null,
    classTeacher: [],
  });

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

  const pagination = reactive<Partial<PaginationInfo>>({
    pageSize: 10,
    page: 1,
    itemCount: 0,
  });

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
      // {
      //   title: '操作',
      //   key: 'actions',
      //   width: 160,
      //   align: 'center',
      //   render (row) {
      //     return (
      //       <>
      //         <NButton size="small" text onClick={() => onEdit(row)}>
      //           <NIcon size={22}>
      //             <Edit />
      //           </NIcon>
      //         </NButton>
      //         <NPopconfirm
      //           class="global--n-popconfirm"
      //           negativeText="取消"
      //           positiveText="确认"
      //           onPositiveClick={() => onRemove(row)}
      //           // onNegativeClick="handleNegativeClick"
      //         >
      //           {{
      //             trigger: () => (
      //               <NButton size="small" text style="margin-left: 16px;">
      //                 <NIcon size={22}>
      //                   <Trash />
      //                 </NIcon>
      //               </NButton>
      //             ),
      //             default: () => (
      //               <div>
      //                 <NP>
      //                   <p>删除后无法恢复。</p>
      //                   <p style="font-size: 12px; color: gray;">被引用的试题，请在取消被引用后再删除。</p>
      //                 </NP>
      //               </div>
      //             ),
      //           }}
      //         </NPopconfirm>
      //       </>
      //     );
      //   }
      // }
    ]
  }

  const columns = createColumns({});

  const createClassLoading = globalLoading.useCreateLoadingKey({ name: '新建班级...' });
  const getClassListLoading = globalLoading.useCreateLoadingKey({ name: '获取新的班级列表...' });


  function onUpdatePageNumber (newPageNumber: number) {
    pagination.page = newPageNumber;
    getClassList();
  }


  function onClear () {
    createClassForm.value.classMajor = null;
    createClassForm.value.className = '';
    createClassForm.value.classTeacher = [];
    createClassForm.value.classType = null;
    createClassForm.value.id = 0;
  }

  function onSubmit () {
    formRef.value?.validate().then(() => {
      createClassLoading.show();
      getClassListLoading.show();
      classServices
        .create({
          ...createClassForm.value,
          classType: createClassForm.value.classType!,
          classMajor: createClassForm.value.classMajor!,
        })
        .then(sleepCurrying(300))
        .then(tap(createClassLoading.hide))
        .then((res) => {
          console.log('成功', res);
          onClear();
          return getClassList().then(sleepCurrying(300)).finally(getClassListLoading.hide);
        }).finally(createClassLoading.hide);
    });
  }

  return () => (
    <div class="class-overview">
      <PageTitle />
      <PageSubTitle>班级管理大盘</PageSubTitle>
      <NDivider />
      <NH3>班级新建</NH3>
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
          <NButton class="clear-btn" ghost round type="error" onClick={onClear}>清空</NButton>
          <NButton type="primary" round onClick={onSubmit}>新建</NButton>
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
