# 06 ARCHIVE / PROJECT SELECTION SPEC

## 1. 页面结构

以 `04_ARCHIVE_REFERENCE_DEFAULT_LAYOUT` 为准：

左侧：
项目目录纸。

右侧：
四个主项目意象 + Other 文件夹。

底部：
蓝色文件夹前景遮罩。

## 2. 项目列表文字

01 PAWTERN 爪织  
服务设计  
循环设计 / 用户体验 / 共创设计

02 WoodLab 木玩工坊  
智能产品设计（实验室项目）  
人机协同 / 交互设计 / AI工作流

03 NuoField 傩场  
Vibe Designing（阿里云D20峰会）  
交互设计 / 数字遗产 / 沉浸体验

04 追花为生  
中国流动养蜂人的迁徙、授粉与生计风险可视分析系统  
信息数据可视化  
信息设计 / 数字叙事 / 人与自然

05 其他

## 3. Drag

可拖拽物件：
- `04_ARCHIVE_OBJ_PAWTERN`
- `04_ARCHIVE_OBJ_WOODLAB`
- `04_ARCHIVE_OBJ_NUOFIELD`
- `04_ARCHIVE_OBJ_BEEFLOW`
- `04_ARCHIVE_FOLDER_OTHER`

任意点击 / 拖拽后，该物件成为最高层。

## 4. 前景遮罩

Figma 当前命名：
`底部文件夹遮罩`

在代码中可别名为：
`archive-folder-mask-front`

必须保持在部分项目物件上方，模拟物件插在文件夹里的效果。

## 5. 打开项目

双击主项目：
直接进入对应 Book。

点击 Other：
进入 Other Works。

## 6. 首次提示

首次进入可显示 4–6 秒：

Desktop：
**拖动 · 整理档案　双击 · 打开项目**

Touch：
**拖动 · 整理档案　点击 · 打开项目**

使用 localStorage 只显示一次。
