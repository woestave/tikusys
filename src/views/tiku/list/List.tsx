import { functionalComponent } from '@/utils/functional-component';
import './List.less';
import { FormInst, FormRules, NDivider, NForm, NFormItemGi, NGrid, NIcon, NInput, NSelect } from 'naive-ui';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PageTitle } from '@/components/PageTitle';
import { NButton } from 'naive-ui'
import { DataTableColumns, NDataTable, PaginationInfo } from 'naive-ui'
import { ref } from 'vue';
import { Search } from '@vicons/ionicons5';
import { getAllQuestions } from '@/mock-datas/all-questions';
// import { useCommonDataPinia } from '@/store/common-data.pinia';


const data = getAllQuestions();

type Item = typeof data[0];

export default functionalComponent(() => {

  const formRef = ref<FormInst | null>(null);

  // const commonDataPinia = useCommonDataPinia();

  const filterModel = ref<{
    id: string;
    tName: string;
    phase: number | null;
    major: number | null;
  }>({
    id: '',
    tName: '',
    phase: null,
    major: null,
  });

  const rules: FormRules = {};


  const createColumns = ({
    play
  }: {
    play: (row: Item) => void;
  }): DataTableColumns<Item> => {
    return [
      {
        title: '试题编号',
        key: 'id',
      },
      {
        title: '试题名称',
        key: 'tName'
      },
      {
        title: 'Length',
        key: 'length'
      },
      {
        title: 'Action',
        key: 'actions',
        render (row) {
          return (
            <NButton strong tertiary size="small" onClick={() => play(row)}>播放</NButton>
          );
        }
      }
    ]
  }


  const columns = createColumns({
    play (row: Item) {
      console.log(11);
    },
  });
  const pagination: Partial<PaginationInfo> = {
    pageSize: 10,
  };

  return () => (
    <div class="tiku-list">
      <PageTitle />
      <PageSubTitle>查阅所有题目</PageSubTitle>
      <NDivider />
      <NForm
        // key={props.id}
        class="tiku-list-filter-form"
        ref={formRef}
        model={filterModel}
        inline
        rules={rules}
        labelPlacement="left"
        labelWidth="auto"
        requireMarkPlacement="right-hanging"
        size="medium"
        style={{
          maxWidth: '100%'
        }}
      >
        <NGrid cols={24} xGap={24}>
          <NFormItemGi span={3} label="编号">
            <NInput placeholder="012" />
          </NFormItemGi>
          <NFormItemGi span={6} label="名称">
            <NInput placeholder="012" maxlength={30} showCount />
          </NFormItemGi>
          <NFormItemGi span={6} label="阶段">
            <NSelect
              v-model:value={filterModel.value.phase}
              options={[{label: 'xx', value: 'xx'}]}
              placeholder="请选择阶段"
            ></NSelect>
          </NFormItemGi>
          <NFormItemGi span={6} label="专业">
            <NSelect
              v-model:value={filterModel.value.major}
              options={[]}
              placeholder="请选择专业"
            ></NSelect>
          </NFormItemGi>
          <NFormItemGi span={3}>
            <NButton text>
              <NIcon size={22}>
                <Search />
              </NIcon>
            </NButton>
          </NFormItemGi>
        </NGrid>
      </NForm>
      <NDataTable
        columns={columns}
        data={data}
        pagination={pagination}
        bordered={false}
      />
    </div>
  );
});


