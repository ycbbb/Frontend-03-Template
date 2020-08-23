// 处理样式中的px处理为纯数字
function getStyle(element) {
    if(!element.style) {
      element.style = {}
      for(let prop in element.computedStyle) {
        const p = element.computedStyle.value
        element.style[prop] = parseInt(element.style[prop])    
        if(element.style[prop].toString().match(/^px$/)) {
          element.style[prop] = parseInt(element.style[prop])
        }
        if(element.style[prop].toString().match(/^px$/)) {
          element.style[prop] = parseInt(element.style[prop])
        }
        if(element.style[prop].toString().match(/^[0-9\.]+$/)) {
          element.style[prop] = parseInt(element.style[prop])
        }
      }
      return element.style;
    }
  }
  
  
  
  function layout(element) {
  
    if(!element.computedStyle) {
      return;
    }
    var elementStyle = getStyle(element);
    if(elementStyle.display !== 'flex'){
      return;
    }
    // 过滤文本节点
    var items = element.children.filter((e) => e.type === 'element')
    items.sort(function(a, b) {
      return (a.order || 0) - (b.order || 0);
    })
    var style = elementStyle;
// 取出style后进行主轴和交叉轴处理
    ['width', 'height'].forEach(size => {
      if(style[size] === "auto" || style[size] === '') {
        style[size] === null;
      }
    })
// 进行默认值设置
    if(!style.flexDirection || style.flexDirection === 'auto') {
      style.flexDirection = 'row'
    }
    if(!style.alignItems || style.alignItems === 'auto') {
      style.flexDirection = 'stretch'
    }
    if(!style.justifyContent || style.justifyContent === 'auto') {
      style.justifyContent = 'flex-satrt';
    }
    if(!style.flexWrap || style.flexWrap === 'auto') {
      style.flexWrap = 'nowrap';
    }
    if(!style.alignContent || style.alignContent === 'auto') {
      style.flexWrap = 'stretch';
    }
    let mainSize, mainStart, mainEnd, mainSign, mainBase,crossSize, crossStart, crossEnd, CrossSign, crossBase;
    // 主轴为row情况
    // 主轴尺寸为weith
    // mainSign为在+1或者-1
    // mainbase和mainSgin是一对
    if (style.flexDirection === "row") {
      mainSize = "width";
      mainStart = "left";
      mainEnd = "right";
      mainSign = +1;
      mainBase = 0;
      crossSize = 'height';
      crossStart = "top";
      crossEnd = "bottom";
    }
    if (style.flexDirection === "row-reverse") {
      mainSize = "width";
      mainStart = "right";
      mainEnd = "left";
      mainSign = -1;
      mainBase = style.width;
      crossSize = 'height';
      crossStart = "top";
      crossEnd = "bottom";
    }
    if (style.flexDirection === "column") {
      mainSize = "height";
      mainStart = "top";
      mainEnd = "bottom";
      mainSign = +1;
      mainBase = 0;
      crossSize = 'width';
      crossStart = "left";
      crossEnd = "right";
    }
    if (style.flexDirection === "column-reverse") {
      mainSize = "height";
      mainStart = "bottom";
      mainEnd = "top";
      mainSign = -1;
      mainBase = style.height;
      crossSize = 'width';
      crossStart = "left";
      crossEnd = "right";
    }
    // 换行交叉轴部分
    if (style.flexDirection === "wrap-reverse") {
      let tmp = crossStart;
      crossStart = crossEnd;
      crossEnd = tmp;
      crossSign = -1;
    } else {
      crossBase = 0;
      crossSign = 1;
    }
    let isAutoMainSize = false;// 用以判断是否有设置主轴尺寸，没有的情况下用子元素的撑开
    if(!style[mainSize]) { // auto sizing
      elementStyle[mainSize] = 0;
      for(const i = 0; i < items.length; i++){
        let item = items[i];
        if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
          elementStyle[mainSize] = elementStyle[mainSize];
        }
        isAutoMainSize = true;  //确保排版进同一行
      }
    //   至少有一行,数组表示行
      let flexLine = [];
      let flexLines = [flexLine];
      let mainSpace = elementStyle[mainSize];
      let crossSpace = 0;
      for(let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);
        if(itemStyle[mainSize] === null) {
          itemStyle[mainSize] = 0;
        }
        // flex属性(可伸缩)
        if(itemStyle.flex) {
          flexLine.push(item);
        } else if(style.flexWrap === "nowrap" && isAutoMainSize){
          mainSpace -= itemStyle[mainSize];
          if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
              //交叉轴尺寸最大的高度(不一定是高度  row时候可以描述为高度)
            crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
          }
          flexLine.push(item);
        } else {
          if(itemStyle[mainSize] > style[mainSize]){
            itemStyle[mainSize] = style[mainSize];
          }
          if(mainSpace < itemStyle[mainSize]) {
            flexLine.mainSpace = mainSpace;
            flexLine.crossSpace = crossSpace;
            // 创建新行
            flexLine = [item];
            flexLines.push(flexLine);
            // 重置属性
            mainSpace = style[mainSize];
            crossSpace = 0;
          } else {
            flexLine.push(item);
          }
          if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
              crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
          }
          mainSpace -= itemStyle[mainSize];
        }
        flexLine.mainSpace = mainSpace;
        if(style.flexWrap === "nowrap" || isAutoMainSize) {
          flexLine.crossSpace = (style[crossSize] !== undefined ? style[crossSize] : crossSpace); 
        } else {
          flexLine.crossSpace = crossSpace;
        }
        if (mianSpace < 0) {
          let scale = style[mainSize] / (style[mainSize] - mainSpace);
          let currentMain = mainBase;
          for(let i = 0; i < items.length; i++){
            const item = items[i];
            const itemStyle = getStyle(item);
            if(itemStyle.flex) {
              itemStyle[mainSize] = 0;
            }
            itemStyle[mainSize] = itemStyle[mainSize] * scale;
            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
          }
        } else {
          flexLines.forEach((items) => {
            let mainSpace = items.mainSpace;
            let flexTotal = 0;
            for(let i = 0; i < items.length; i++){
              const item = items[i];
              const itemStyle = getStyle(item);
              if((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                flexTotal += itemStyle.flex;
                continue;
              }
            }
            if (flexTotal > 0) {
              let currentMain = mainBase;
              for(let i = 0; i < items.length; i++) {
                const item = items[i];
                const itemStyle = getStyle(item);
                if(item) {
                  itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                }
                itemStyle[mainStart] = currentMain;
                itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                currentMain = itemStyle[mainEnd];
              }
            } else {
              if (style.justifyContent === "flex-start") {
                var currentMain = mainBase;
                var step = 0
              }
              if (style.justifyContent === "flex-end") {
                var currentMain = mainSpace * mainSign + mainBase;
                var step = 0
              }
              if (style.justifyContent === "center") {
                var currentMain = mainSpace / 2 * mainSign + mainBase;
                var step = 0
              }
              if (style.justifyContent === "space-between") {
                var currentMain =  mainSpace / (items.length - 1) * mainSign;
                var step = mainBase;
              }
              if (style.justifyContent === "space-around") {
                var currentMain =  mainSpace / items.length * mainSign;
                var step = step / 2 + mainBase;
              }
              for (let i = 0; i < items.length; i++) {
                let item = items[i];
                itemStyle[mainStart, currentMain];
                itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                currentMain = itemStyle[mainEnd].step;
              }
            }
            var crossSpace;
            if(!style[crossSize]) {
              crossSpace = 0;
              elementStyle[crossSize] = 0;
              for(let i = 0; i < flexLines.length; i++){
                elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
              }
            } else {
              crossSpace = style[crossSize];
              for(let i = 0; i < flexLines.length; i++) {
                crossSpace -= flexLines[i].crossSpace;
              }
            }
            if (style.flexWrap === "wrap-reverse") {
              crossBase = style[crossSize];
            } else {
              crossBase = 0;
            }
            var lineSize = style[crossSize] / flexLines.length;
            var step;
            if(style.alignContent === "flex-start"){
              crossBase += 0;
              step = 0;
            }
            if(style.alignContent === "flex-end"){
              crossBase += crossSign * crossSpace;
              step = 0;
            }
            if(style.alignContent === "center"){
              crossBase += crossSign * crossSpace / 2;
              step = 0;
            }
            if(style.alignContent === "space-between"){
              crossBase += 0;
              step = crossSpace / (flexLines.length - 1);
            }
            if(style.alignContent === "space-between") {
              crossBase += crossSign * crossSpace / 2;
              step = 0;
            }
            if(style.alignContent === "space-around") {
              crossBase += crossSign * step / 2;
              step = crossSpace / (flexLines.length);
            }
            if(style.alignContent === "stretch") {
              crossBase += 0;
              step = 0;
            }
            flexLines.forEach((items) => {
              let lineCrossSize = style.alignContent === "stretch" ?
                  items.crossSpace + crossSpace / flexLines.length :
                  items.crossSpace;
              for(let i = 0; i < items.length; i++){
                const item = item[i];
                const itemStyle = getStyle(item);
                const align = itemStyle.alignSelf || style.alignItems;
                if (item === null) {
                  itemStyle[crossSize] = (align === 'stretch') ?
                  lineCrossSize : 0;
                }
                if (align === 'flex-start') {
                  itemStyle[crossStart] = crossBase;
                  itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[corssSize];
                }
                if(align === 'flex-end') {
                  itemStyle[crossEnd] = crossBase + crossSign * (lineCrossSize - itemStyle[corssSize ]) / 2;
                  itemStyle[crossStart] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
                }
                if(align === 'stretch') {
                  itemStyle[crossStart] = crossBase;
                  itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)));
                  itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
                }
              }
              crossBase += crossSign * (lineCrossSize + step);
            })
          })
        }
      }
    }
  }
  module.exports = layout;
  
  
  