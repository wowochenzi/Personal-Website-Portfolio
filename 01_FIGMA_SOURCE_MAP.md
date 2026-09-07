# 01 FIGMA SOURCE MAP

## 1. 设计基准

最终 Figma Reference：
**1568 × 900**

Other Works Active：
**1568 × 1510**

所有网页实现应以 Reference 的构图、位置关系、纸张比例和层级为视觉依据，但运行时响应式适配。

## 2. 全局视觉

Figma `00_GLOBAL` 已确认：

- Archive Blue：约 `#B8DBE3`
- Main Gray：约 `#4E4E4D`
- Kraft：约 `#D5B294`
- `00_GLOBAL_BG_PAPER`
- `00_GLOBAL_TEXTURE_PAPER`
- `00_GLOBAL_TEXTURE_CREAM_PAPER`
- `00_GLOBAL_TEXTURE_BLUE_PAPER`
- `00_GLOBAL_TEXTURE_KRAFT_PAPER`
- `00_GLOBAL_PAPERCLIP_01/02/03`
- `00_GLOBAL_LOGO_PORTFOLIO_SCRIPT`
- `00_GLOBAL_LOGO_PORTFOLIO_PRINT`
- `00_GLOBAL_DECOR_VIBECODING`

最终色彩以 Figma 实际资产为准。

## 3. Cover

`01_COVER_REFERENCE_FULL`：1568 × 900。

生产资产：
- `01_COVER_FOLDER_BACK`
- `01_COVER_FOLDER_LAYER_MIDDLE`
- `01_COVER_FOLDER_FRONT`
- `01_COVER_FOLDER_INNER_PAPER`

Reference 中还有回形针、Portfolio Print 和“点击打开档案”文字；开发时用 Figma 资产 + HTML 文本实现。

## 4. Folder Navigation

`02_FOLDER_NAV_REFERENCE_DEFAULT`：1568 × 900。

生产资产：
- `02_FOLDER_NAV_FOLDER_HOME`
- `02_FOLDER_NAV_FOLDER_ABOUT`
- `02_FOLDER_NAV_FOLDER_CONTENT`

Reference 另有：
- `02_FOLDER_NAV_REFERENCE_HOVER_HOME`
- `02_FOLDER_NAV_REFERENCE_HOVER_ABOUT`
- `02_FOLDER_NAV_REFERENCE_HOVER_CONTENT`

三个文件视觉采用相同 2.5D 透视，标题为：
- Home Page
- About Me
- Content

顶部文字：
**CHOOSE ONE PAGE ↓**

## 5. About

Reference：
`03_ABOUT_REFERENCE_FULL`

生产资产：
- `03_ABOUT_FOLDER_KRAFT_BACK`
- `03_ABOUT_BLUE_CARD_BG`
- `03_ABOUT_PROFILE_PHOTO`
- `03_ABOUT_BLUE_CARD_HOLE_EDGE`

注意：当前 `03_ABOUT_BLUE_CARD_HOLE_EDGE` 实际在 Reference 中承担**右侧整张米白履历纸**的视觉底图，不要只把它当孔边素材。

另有：
`aboutme-纸质作品集页面的内容`
仅作为原作品集内容参考。

## 6. Archive

Reference：
`04_ARCHIVE_REFERENCE_DEFAULT_LAYOUT`

生产资产：
- `04_ARCHIVE_INDEX_LINE_TEXTURE`
- `04_ARCHIVE_OBJ_PAWTERN`
- `04_ARCHIVE_OBJ_WOODLAB`
- `04_ARCHIVE_OBJ_NUOFIELD`
- `04_ARCHIVE_OBJ_BEEFLOW`
- `04_ARCHIVE_FOLDER_OTHER`
- `底部文件夹遮罩`

注意：
`底部文件夹遮罩` 为前景遮罩层，必须位于项目意象上方，制造“物件插入文件夹”的层次。

原作品集目录参考：
`原纸质作品集目录页面内容参考`

## 7. Project Pages

### PAWTERN
18 个子书页：
`05_PAWTERN_BOOK_PAGE_01` ～ `18`

另有：
`05_PAWTERN_PHONE_FRAME`

PAWTERN 页面顶层的 `Frame 1...9` 只是每个原始横向 spread 的组合容器；真正用于网站翻书的是内部已命名的 18 张半页。

### WoodLab
`06_WOODLAB_BOOK_PAGE_01` ～ `10`

### NuoFeild
`07_NUOFIELD_BOOK_PAGE_01` ～ `08`

### 追花为生
`08_BEEFLOW_BOOK_PAGE_01` ～ `08`

注意：
部分 WoodLab 原始半页宽度略有差异；网页不得拉伸文字，统一放入同一逻辑 page box，完整保留内容。

## 8. Other Works

Reference：
- `09_OTHER_REFERENCE_DEFAULT`
- `09_OTHER_REFERENCE_ACTIVE_A`
- `09_OTHER_REFERENCE_ACTIVE_B`
- `09_OTHER_REFERENCE_ACTIVE_C`
- `09_OTHER_REFERENCE_ACTIVE_D`

Default Frame 中固定分类标签：
- A：品牌设计
- B：商业创新设计
- C：AIGC插画
- D：空间构成

Active Reference 没有重复标签，但网页中**标签必须持续存在并始终绑定正确文件夹**。

生产文件夹：
- `09_OTHER_FOLDER_A`
- `09_OTHER_FOLDER_B`
- `09_OTHER_FOLDER_C`
- `09_OTHER_FOLDER_D`

横向长条：
- `09_OTHER_STRIP_A`：9 项
- `09_OTHER_STRIP_B`：15 项
- `09_OTHER_STRIP_C`：14 项
- `09_OTHER_STRIP_D`：11 项

滚动长条应当作为整体资产使用，不要在代码里重新拼内部 item。

Active Reference 的展示窗口约：
**1310 × 305**。
