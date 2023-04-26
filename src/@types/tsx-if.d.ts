/**
 * babel-plugin 检查所有名为 `If` 的JSXElement
 * 编译为三目运算符
 * ```tsx
 * <If condition={this.xxx}>
 *    {this.xxx}
 * </If>
 * ```
 * ->
 * ```tsx
 * this.xxx ? [ this.xxx ] : null
 * ```
 *
 * ```tsx
 * <If condition={this.xxx}>
 *    {this.xxx}
 * </If>
 * <ElseIf condition={this.yyy}>{this.yyy}</ElseIf>
 * <ElseIf condition={this.zzz}>
 *    <span>{this.zzz}</span>
 * </ElseIf>
 * <Else>None</Else>
 * ```
 * ```tsx
 * this.xxx ? [this.xxx] : this.yyy ? [this.yyy] : this.zzz ? [<span>{this.zzz}</span>] : ['None']
 * ```
 */






import { FunctionalComponent } from 'vue';

interface IfProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: any;
}

declare global {
  const If: FunctionalComponent<IfProps>;
  const ElseIf: FunctionalComponent<IfProps>;
  const Else: FunctionalComponent<{}>;
}
