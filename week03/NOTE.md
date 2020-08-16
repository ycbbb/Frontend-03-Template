#学号:G20200447030080
#姓名:严陈斌
#班级: 前端进阶训练营3期
#小组: 2组
#作业&总结连接 https://github.com/ycbbb/Frontend-03-Template/tree/master/week03
学习心得： 
html  parse=>dom
判断标签思路
获取<开头内容  通过/判断是否是结束标签   通过/后>判断是否是自封闭标签
css计算:
dom => css computing 
环境准备  npm install css(css parser)
将css解析成css规则数组  (大部分在startTag时调用)及创建元素时立即计算css
父元素匹配顺序需要reverse(获取时从内到外)
选择器列表(由parser) => 复杂选择器(通过空格拆分)
复杂选择器拆分成单个然后匹配
生成computed属性
选择器优先级(specificity(原意为专指程度))
inline      四位数(千位)
id          三位数(百位)
class       二位数(十位)
tag         一位数(个位)
通过构建dom树和带有css的dom树,相关的理解深入了很多,尤其是css相关内容.之前对于css的优先级关系的理解很模糊
通过这一次自己进行编写感觉真正理解了这一逻辑