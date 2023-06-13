import { functionalComponent } from '@/utils/functional-component';
import './Create.less';
import { NDivider, NH1, NTabPane, NTabs, useMessage } from 'naive-ui';
import { ChoiceQuestion } from './forms/ChoiceQuestion';
import { ShortAnswerQuestion } from './forms/ShortAnswerQuestion';
import { PageSubTitle } from '@/components/PageSubTitle';
import { globalLoading } from '@/utils/create-loading';
import { tikuServices } from '@/apis/services/tiku';
import { DefaultQuestionModel } from 'common-packages/models/question-model-base';
import { useRoute, useRouter } from 'vue-router';
import { ChoiceQuestionModel } from 'common-packages/models/question-model-choice';
import { ShortQuestionModel } from 'common-packages/models/question-model-short';
import { ExposeType } from './forms/expose-type';
import { ref } from 'vue';
// import { useNotificationPreset1 } from '@/hooks/use-notification-with-duration';

export default functionalComponent(() => {

  // const showSuccessNotification = useNotificationPreset1('试题操作成功', '去试题列表看看吧');
  const message = useMessage();
  const router = useRouter();

  const tikuCreateLoading = globalLoading.useCreateLoadingKey({ name: '保存试题中...', });

  const choiceRef = ref<ExposeType>();
  const shortRef = ref<ExposeType>();

  function resetAll () {
    choiceRef.value?.resetAll();
    shortRef.value?.resetAll();
  }

  function onSubmitOrEdit (questionModel: DefaultQuestionModel) {
    tikuCreateLoading.show();
    tikuServices
      .createOrUpdate({ question: questionModel, })
      .then((res) => {
        console.log(editingTid ? '编辑试题成功' : '新建试题成功', res);
        resetAll();
        message.success(editingTid ? '编辑试题成功' : '新建试题成功');
        // showSuccessNotification(5000);
        if (editingTid) {
          router.back();
        }
      }).catch((err) => {
        console.log('添加失败', err);
      }).finally(tikuCreateLoading.hide);
  }


  const route = useRoute();

  const editingTid = route.params.tId;
  const editingLoading = globalLoading.useCreateLoadingKey({ name: '获取试题数据...' });
  const tiItem = ref<API__Tiku.GetByIdRes | null>(null);
  editingTid && editingLoading.show();
  editingTid && tikuServices.getById({ tId: +editingTid }).then((res) => {
    tiItem.value = res.data;
  }).finally(editingLoading.hide)




  return () => (
    <div class="tiku-create">
      <NH1>题库 - {editingTid ? '编辑' : '添加'}</NH1>
      <PageSubTitle>{editingTid ? '编辑' : '生成'}试题</PageSubTitle>
      <NDivider />
      <NTabs defaultValue="chap1" justifyContent="start" animated>
        <NTabPane name="chap1" tab="选择题" displayDirective="show:lazy">
          <ChoiceQuestion
            ref={choiceRef}
            editingTiItem={tiItem.value?.tiItem as ChoiceQuestionModel | undefined}
            onSubmit={onSubmitOrEdit}
          />
        </NTabPane>
        <NTabPane name="chap3" key={2} tab="简答题" displayDirective="show:lazy">
          <ShortAnswerQuestion
            ref={shortRef}
            editingTiItem={tiItem.value?.tiItem as ShortQuestionModel | undefined}
            onSubmit={onSubmitOrEdit}
          />
        </NTabPane>
      </NTabs>
    </div>
  );
});
