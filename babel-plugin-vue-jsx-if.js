/* eslint-disable */
/**
 * Copyright (c) 2014-2020 Zuoyebang, All rights reserved.
 * @fileoverview 编译<If condition={xxx}>...</If>
 * @author jiangyantao | jiangyantao@zuoyebang.com
 * @version 1.0 | 2020-07-10 | jiangyantao  // 初始版本。
 * 
 * 
 * 效果示例
 * ```tsx
 *  const nodes = (
 *    <>
 *        <If condition={xxx}>
 *              <span>222</span>
 *              pathNode
 *              <If condition={aaa}>aa</If>
 *              <ElseIf condition={bbb}>bb</ElseIf>
 *              <ElseIf condition={ccc}>
 *                    <If condition={222}></If>
 *                    <Else>else2</Else>
 *              </ElseIf>
 *              <Else>Else111</Else>
 *        </If>
 * 
 *        <ElseIf condition={yyy}>yy</ElseIf>
 *        <ElseIf condition={zzz}>zz</ElseIf>
 *        <Else>
 *              <If>ddd</If>
 *              <ElseIf>fff</ElseIf>
 *              <Else>elseggg</Else>
 *        </Else>
 *    </>
 *  );
 * ```
 * 编译------------>>>>>>>
 * ```tsx
 * const nodes = (
 *  <>
 *    {xxx ? [<span>222</span>, "pathNode", aaa ? ["aa"] : bbb ? ["bb"] : ccc ? [222 ? [] : ["else2"]] : ["Else111"]] : yyy ? ["yy"] : zzz ? ["zz"] : [false ? ["ddd"] : false ? ["fff"] : ["elseggg"]]}
 *  </>
 * );
 * ```
 */

 /**
  * 通过一个JSXAttributes获取一个格式化的JSXAttributes
  */
 function getJSXAttributePattern (JSXAttributes) {
  return JSXAttributes.reduce((pattern, node) => {
  	pattern[node.name.name] = node.value.expression;
    return pattern;
  }, {});
}



module.exports = babel => {
  const t = babel.types;
  
  // var num = 0;


  return {
    visitor: {
      Program(path) {
        traverse(t, path);
      },
    },
  }
}

function traverse (t, programPath) {
	programPath.traverse({
    JSXElement (path) {
      const IF_TAG_NAME = 'If';
      const ELSE_TAG_NAME = 'Else';
      const ELSE_IF_TAG_NAME = 'ElseIf';
      
      //console.log(path.node.openingElement.name);

      switch(path.node.openingElement.name.name) {
        /** <If>...</If> */
        case IF_TAG_NAME: If(t, path); break;
        /**
         * <If condition={xxx}>...</If>
         * <ElseIf condition={yyy}>...</ElseIf>
         * <ElseIf condition={zzz}>...</ElseIf>
         */
        case ELSE_IF_TAG_NAME: ElseIf(t, path); break;
        /**
          * <If condition={xxx}>....</If>
          * <Else>...else...</Else>
          * 
          * <If condition={xxx}></If>
          * <ElseIf></ElseIf>
          * <Else></Else>
          */
        case ELSE_TAG_NAME: Else(t, path); break;
        default: return;
      }
    }
  });
}


/**
 * 处理<If></If>
 * 
 * <If />                                    ->   { false ? [] : null }
 * <If condition={xxx}></If>   ->   { xxx ? [] : null }
 * <If></If>                              ->  { false ? [] : null }
 */
function If (t, path) {

  const JSXAttrObj = getJSXAttributePattern(path.node.openingElement.attributes);

  const userCondition = JSXAttrObj.condition ? JSXAttrObj.condition : t.BooleanLiteral(false);

  var r = t.ConditionalExpression(
    userCondition,
    t.ArrayExpression(t.react.buildChildren(path.node)), t.NullLiteral()
  );

  /**
             * 当<If>外层为JSX时， 给运算符一个花括号 {  } 包裹 （JSXExpressionContainer）
             */
  if (t.isJSX(path.parent) && path.parent.type.toLowerCase() !== 'JSXExpressionContainer'.toLowerCase()) {
    var inner = r;
    r = t.JSXExpressionContainer(inner);
  }

  path.replaceWith(r);

  return r;
}


/**
 * 处理<ElseIf>...</ElseIf>
 * <If condition={xxxxxxx}></If>
 * <ElseIf condition={yyy}></ElseIf>
 * <ElseIf condition={zzz}></ElseIf>
 * <ElseIf></ElseIf>
 * ..........
 */
function ElseIf (t, path) {
  //If(t, path);
  const targetIfExpression = getConditionalNullLiteral(t, path, 'ElseIf');
  //console.log(pathNode);
  //path.remove();
  //path.remove();

  if (targetIfExpression) {
    const r = If(t, path);
  	targetIfExpression.alternate = r.expression || r;
    traverse(t, path);
    path.remove();
  }
}


/**
 * 处理<Else>...</Else>
 * <If condition={xxx}>...</If>
 * <Else>...else...</Else>
 * 
 * <If></If>
 * <ElseIf></ElseIf>
 * <ElseIf><ElseIf>
 * <Else></Else>
 */
function Else (t, path) {
  
  const targetIfExpression = getConditionalNullLiteral(t, path);
  
  const pathNode = path.node;
  //path.remove();

  if (targetIfExpression) {
    traverse(t, path);
  	targetIfExpression.alternate = t.ArrayExpression(t.react.buildChildren(pathNode));
    path.remove();
  }
}


function getConditionalNullLiteral (t, path, type) {
  // 去除换行符、 制表符、 空格等的正则表达式
  const spaceRegexp = /\s*/g;
  const children = path.parent.children ? path.parent.children.slice() : path.parent.elements ? path.parent.elements.slice() : [];

  // console.log(children);
  const selfIndex = children.findIndex((x) => x === path.node);
  const previous = children.slice(0, selfIndex);

  const previousCopy = [...previous];
  let next = previousCopy.pop();
  
  //console.log(type, next);

  while(next) {
    /**
     * 编译非嵌套的正常的<If />、 <ElseIf />、 <Else />
     */
    if (next.type.toLowerCase() === 'JSXExpressionContainer'.toLowerCase()) {
      const targetExpression = findNullLiteralByConditional(next.expression);
      if (targetExpression) {
      	return targetExpression;
      }
    } else if (next.type.toLowerCase() === 'ConditionalExpression'.toLowerCase()) {
      /**
       * 编译<ElseIf>、 <Else>时， 不只有上面一种情况， 还有第二种情况， 即编译嵌套在<If>、 <ElseIf>、 <Else />内的If、 ElseIf、 Else时，
       * 由于是处于父级If、 ElseIf或Else标签的内部， 而父级会先被编译为ConditionalExpression类型的三目运算符， 如下
       * <If condition={xxx}>xxx</If>
       * <ElseIf condition={yyy}>
       *     yyy
       *    <If condition={aaa}>aaa</If>
       *    <ElseIf condition={bbb}>bbb</ElseIf>
       *    <Else>ccc</Else>
       * </ElseIf>
       * 编译第一次后得到 { xxx ? ['xxx'] : yyy ? ['yyy', aaa ? ['aaa'] : null, <ElseIf condition={bbb}>bbb</ElseIf>, <Else>ccc</Else>] : null }
       * 因为无论是否嵌套， If标签都是会被直接编译的， 所以被嵌套的If被编译成了aaa ? ['aaa'] : null, 剩下的ElseIf、 Else不会被编译。 此时进行第二轮编译， 需要将ElseIf替换到
       * 上一个null的位置。 但是由于当前位于嵌套中， 所以next.type不会是JSXExpressionContainer， 而是ConditionalExpression（aaa ? ['aaa'] : null）。
       */
      const targetExpression = findNullLiteralByConditional(next);
      if (targetExpression) {
      	return targetExpression;
      }
    } else if (next.type !== 'JSXText' || !!next.value.replace(spaceRegexp, '')) {
      /**
       * 当上方遇到遮挡（不为JSXText或内容为空的JSXText，换行、 缩进等不算）时， 不编译被遮挡后的部分
       * <If>xxx</If>
       * <span />
       * <ElseIf>yyy</ElseIf>
       * ElseIf被span遮挡了， 这部分不会被编译。
      */
      return null;
    }
  	next = previousCopy.pop();
  }

  return null;
}




function findNullLiteralByConditional (expression) {
  //console.log(expression);
  if (!expression.alternate) {
  	return expression;
  }
  if (expression.alternate.type.toLowerCase() === 'ConditionalExpression'.toLowerCase()) {
    return findNullLiteralByConditional(expression.alternate);
  }
  if (expression.alternate.type.toLowerCase() === 'NullLiteral'.toLowerCase()) {
    return expression;
  }
  return null;
}
