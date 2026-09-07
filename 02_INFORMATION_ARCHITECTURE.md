# 02 INFORMATION ARCHITECTURE

## Routes

建议 Hash Router：

```text
/#/cover
/#/choose
/#/about
/#/archive
/#/project/pawtern
/#/project/woodlab
/#/project/nuofield
/#/project/beeflow
/#/other
```

浏览器 Back / Forward 必须可用。

## Scene 关系

### Cover
入口场景。

### Choose
三层 2.5D 文件导航。
- Home Page → Cover
- About Me → About
- Content → Archive

### About
个人档案 / 科研 / 论文 / 技能。

### Archive
项目选择与拖拽桌面。

### Project
Book + Info + Demo。

### Other Works
四层文件夹展开浏览。

## 通用返回

About / Archive / Other / Project 页面提供低权重文字返回入口：
- `← CHOOSE`：返回文件导航
- Project：`← 返回档案`
- Other Works：`← 返回档案`

这些文字按钮用 HTML 实现，不额外制作 Figma 图标。
