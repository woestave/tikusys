import { functionalComponent, useCallbackP } from '@/utils/functional-component';
import './List.less';
import { FormInst, FormRules, NDivider, NForm, NFormItemGi, NGrid, NIcon, NInput, NP, NPopconfirm, NPopover, NSelect, PaginationInfo, useMessage } from 'naive-ui';
import { PageTitle } from '@/components/PageTitle';
import { NButton } from 'naive-ui'
import { DataTableColumns, NDataTable } from 'naive-ui'
import { onMounted, reactive, ref } from 'vue';
import { Search } from '@vicons/ionicons5';
import { Edit, Trash, } from '@vicons/tabler';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import { getQuestionTypeText } from 'common-packages/helpers/get-question-type-text';
import { omit, prop } from 'ramda';
import ReferenceTag from '@/components/ReferenceTag';
import { tikuServices } from '@/apis/services/tiku';
import { withResponseType } from '@/apis/request';
import { ChoiceQuestionContent, QuestionContentBase } from '@/components/QuestionContentBase';
import { ChoiceQuestionModel, filterIsChoiceQuestion } from 'common-packages/models/question-model-choice';
import { globalTextHighlightProcessor } from '@/utils/create-text-highlight-processor';
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { RenderPrefix } from 'naive-ui/es/pagination/src/interface';
import { useRouter } from 'vue-router';
import { globalLoading } from '@/utils/create-loading';


// const data = getAllQuestions();


export default functionalComponent(() => {

  const formRef = ref<FormInst | null>(null);

  const commonDataPinia = useCommonDataPinia();

  const router = useRouter();

  const message = useMessage();

  const filterForm = ref<Omit<API__Tiku.ListReq, keyof API__BaseTypes.Pagination>>({
    id: '',
    tName: '',
    phase: [],
    major: null,
  });

  const pagination = reactive<Partial<PaginationInfo & {
    prefix: RenderPrefix;
  }>>({
    pageSize: 10,
    page: 1,
    itemCount: 0,
    prefix: ({ itemCount }) => `${itemCount}条记录`,
  });

  const [tikuList, getTikuList, getTikuListStatus] = useCallbackP(
    () => tikuServices.list({...filterForm.value, pageSize: pagination.pageSize!, pageNumber: pagination.page!, }).then(withResponseType(
      prop('data'),
      (x) => Promise.reject(x))
    ).then((res) => {
      pagination.itemCount = res.total;
      return res;
    })
  );

  getTikuList();

  function onClickSearch () {
    pagination.page = 1;
    getTikuList();
  }

  function onUpdatePageNumber (newPageNumber: number) {
    pagination.page = newPageNumber;
    getTikuList();
  }


  const rules: FormRules = {};


  const createColumns = ({
    onRemove,
    onEdit,
  }: {
    onRemove: (row: API__Tiku.TikuStructWithPaperInfo) => void;
    onEdit: (row: API__Tiku.TikuStructWithPaperInfo) => void;
  }): DataTableColumns<API__Tiku.TikuStructWithPaperInfo & { customQuestionInfo: any; }> => {
    return [
      {
        type: 'expand',
        // key: 'id',
        renderExpand: (row) => (
          <>
            <If condition={filterIsChoiceQuestion(row)}>
              <ChoiceQuestionContent class={'xxx'} questionModel={row as ChoiceQuestionModel} highLightTName={filterForm.value.tName} />
            </If>
            <Else>
              <QuestionContentBase class="column" highLightTName={filterForm.value.tName} questionModel={row} />
            </Else>
          </>
        ),
      },
      {
        title: '试题编号',
        key: 'id',
        width: 100,
      },
      {
        title: '试题名称',
        key: 'tName',
        // width: 400,
        ellipsis: {
          tooltip: true,
        },
        render (row) {
          return (
            <span class="white-space-pre" innerHTML={globalTextHighlightProcessor(row.tName || '', filterForm.value.tName)}></span>
          );
        }
      },
      {
        title: '所属专业',
        key: 'major',
        render (row) {
          return commonDataPinia.majors.find((x) => x.value === row.major)?.label;
        },
      },
      {
        title: '类型',
        key: 'type',
        render (row) {
          return getQuestionTypeText(row);
        },
      },
      {
        title: '分值',
        key: 'scoreValue',
        // width: 80,
        render (row) {
          return row.scoreValue;
        },
      },
      {
        title: '所属阶段',
        key: 'phase',
        render (row) {
          return commonDataPinia.getPhaseName(row.phase) || '未知阶段';
        },
      },
      {
        title: '引用信息',
        key: '',
        align: 'left',
        width: 160,
        render (row) {
          // const list = range(0, Math.ceil(Math.random() * 30));
          const list = row.paperInfo || [];
          const tags = (
            <div class="reference-row">
              {list.map((x) => (
                <ReferenceTag
                  label={'试卷 - ' + x.paperName}
                  type="info"
                  onClickLink={() => router.replace({
                    query: { fromPage: pagination.page, },
                  }).then(() => router.push({
                    name: 'exampaper-create',
                    params: {
                      paperId: x.paperId,
                    },
                    query: {
                      fromTid: row.id,
                    },
                  }))}
                  referLink={'查看试卷'}
                />
              ))}
            </div>
          );
          return list.length === 0 ? <span style="color: #666;">无</span> : list.length <= 2 ? (tags) : (
            <NPopover
              class="select-ti-popover"
              delay={333}
              displayDirective="if"
              trigger="click"
              style={{ maxWidth: (window.innerWidth * 0.6) + 'px' }}
            >
              {{
                trigger: () => <NButton class="hover-type-info" text>...{list.length}</NButton>,
                default: () => (tags),
              }}
            </NPopover>
          );
        },
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
                <NIcon size={22} color={row.paperInfo.length ? '#333' : 'white'}>
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
                      <NIcon size={22} color={row.paperInfo.length ? '#333' : 'white'}>
                        <Trash />
                      </NIcon>
                    </NButton>
                  ),
                  default: () => (
                    <div>
                      <NP>
                        <p>删除后无法恢复。</p>
                        <p style="font-size: 12px; color: gray;">被引用的试题，请在取消被引用后再删除。</p>
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


  const removeTikuLoading = globalLoading.useCreateLoadingKey({ name: '移除试题...', });
  function onRemove (row: API__Tiku.TikuStructWithPaperInfo) {
    if (row.paperInfo.length) {
      return message.error(`已经被试卷引用过的试题暂时不可删除`);
    }
    removeTikuLoading.show();
    tikuServices.remove({id: row.id}).then((res) => {
      res.data.succ === 1 && message.success('删除试题成功');
      getTikuList();
    }).finally(removeTikuLoading.hide);
  }
  function onEdit (row: API__Tiku.TikuStructWithPaperInfo) {
    if (row.paperInfo.length) {
      return message.error(`已经被试卷引用过的试题暂时不可编辑`);
    }

    router.replace({
      // 方便回来时还保留在当前页数
      query: { fromPage: pagination.page, },
    }).then(() => {
      router.push({
        name: 'tiku-create',
        params: {
          tId: row.id,
        },
      });
    });
  }

  onMounted(() => {
    const fromPage = +(router.currentRoute.value.query.fromPage || 1);
    console.warn(fromPage);
    if (fromPage > 0 && !isNaN(fromPage)) {
      pagination.page = fromPage;
      router.replace({ query: omit(['fromPage'], router.currentRoute.value.query), });
      getTikuList();
    }
  });

  const columns = createColumns({
    onRemove,
    onEdit,
  });

  return () => (
    <div class="tiku-list">
      <PageTitle />
      {/* <PageSubTitle>查阅所有题目</PageSubTitle> */}
      <NDivider />
      <NForm
        // key={props.id}
        class="tiku-list-filter-form"
        ref={formRef}
        model={filterForm}
        inline
        rules={rules}
        labelPlacement="left"
        labelWidth="auto"
        requireMarkPlacement="right-hanging"
        size="medium"
        style={{
          maxWidth: '100%',
        }}
      >
        <NGrid cols={24} xGap={24}>
          <NFormItemGi span={3} label="编号">
            <NInput
              placeholder="012"
              v-model:value={filterForm.value.id}
              maxlength={10}
              clearable
              onClear={() => setTimeout(getTikuList)}
            />
          </NFormItemGi>
          <NFormItemGi span={6} label="名称">
            <NInput
              maxlength={30}
              v-model:value={filterForm.value.tName}
              showCount
              clearable
              onClear={() => setTimeout(getTikuList)}
            />
          </NFormItemGi>
          <NFormItemGi span={6} label="阶段">
            <NSelect
              v-model:value={filterForm.value.phase}
              multiple
              clearable
              onClear={() => setTimeout(onClickSearch)}
              options={commonDataPinia.commonData?.phases || []}
              placeholder="请选择阶段"
            ></NSelect>
          </NFormItemGi>
          <NFormItemGi span={6} label="专业">
            <NSelect
              v-model:value={filterForm.value.major}
              options={commonDataPinia.majors as SelectMixedOption[]}
              placeholder="请选择专业"
              clearable
              onClear={() => setTimeout(onClickSearch)}
            ></NSelect>
          </NFormItemGi>
          <NFormItemGi span={3}>
            <NButton text onClick={onClickSearch}>
              <NIcon size={22}>
                <Search />
              </NIcon>
            </NButton>
          </NFormItemGi>
        </NGrid>
      </NForm>
      <NDataTable
        columns={columns}
        rowKey={prop('id')}
        remote
        loading={getTikuListStatus.value === 'pending'}
        data={tikuList.value?.list || []}
        pagination={pagination}
        onUpdatePage={onUpdatePageNumber}
        bordered={false}
      />
    </div>
  );
});


