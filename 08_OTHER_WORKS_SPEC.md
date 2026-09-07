# 08 OTHER WORKS SPEC

> 实现时同时遵守 `skills/portfolio-folder-stack/SKILL.md`。

## 1. 默认状态

严格参考：
`09_OTHER_REFERENCE_DEFAULT`

标题：
**Other Works**

四个文件夹固定对应：

A：品牌设计  
B：商业创新设计  
C：AIGC插画  
D：空间构成

### Critical

上述分类标签只在 Default Reference 中完整存在。
虽然 `ACTIVE_A/B/C/D` Reference 内没有重复标签，网页激活状态中**不得删除标签**；必须持续与正确文件夹绑定。

## 2. 点击展开

默认是一叠纵向错层文件夹。

点击某文件夹：
- 当前文件夹进入 active
- active 及其上方文件夹向上让位
- active 下方文件夹整体下移
- 在 active 文件夹内部露出滚动展示区
- 页面高度从 900 过渡到约 1510 的参考结构
- 允许页面纵向滚动

具体相对位置以对应：
`09_OTHER_REFERENCE_ACTIVE_A/B/C/D`
为视觉真值。

## 3. 横向作品组件

直接使用完整长 Frame：
- `09_OTHER_STRIP_A`
- `09_OTHER_STRIP_B`
- `09_OTHER_STRIP_C`
- `09_OTHER_STRIP_D`

不要重新读取并拼接内部 item。

Reference 展示窗：
约 `1310 × 305`。

目标：
**同一时间约看到两张作品**，然后继续横向滚动。

不得：
- 把整条 strip 缩成一次全部看完
- 把长图当静态 banner
- 改变 Figma 已排好的作品顺序和间距

## 4. Auto Scroll

默认：
- 从右向左
- 匀速
- 连续
- 约 32–40 CSS px/s
- strip 长度不同，按长度动态计算动画时长

为了无缝循环：
DOM 中可重复同一 strip 两次。

Hover / pointer down：
暂停自动滚动。

用户可横向拖拽查看。
松开后约 800ms 恢复自动滚动。

Reduced Motion：
关闭自动滚动，改为手动横向浏览。

## 5. A / B 项目文字

### A 品牌设计

项目：
**东一品牌焕新策略全案**

滚动组件下方显示项目名称与说明。

### B 商业创新设计

项目：
**香印香氛疗愈丝巾**

滚动组件下方显示项目名称与说明。

### C / D

当前只要求：
- 分类标签
- 横向作品展示

不强制添加单独项目说明。

## 6. 关闭 / 切换

再次点击 active 文件夹可收回 Default。
点击另一个文件夹：
直接从当前 active 过渡到新 active，不必先完整收回再展开。
