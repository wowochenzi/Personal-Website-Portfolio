# 07 PROJECT BOOK SPEC

> 具体组件实现必须同时遵守 `skills/portfolio-book-viewer/SKILL.md`。

## 1. Figma 书页

PAWTERN：
`05_PAWTERN_BOOK_PAGE_01` ～ `18`

WoodLab：
`06_WOODLAB_BOOK_PAGE_01` ～ `10`

NuoFeild：
`07_NUOFIELD_BOOK_PAGE_01` ～ `08`

追花为生：
`08_BEEFLOW_BOOK_PAGE_01` ～ `08`

相邻两页共同还原一张原作品集横向 spread。

## 2. 初始状态

进入项目后直接显示**摊开的书**。

不出现独立封面页。

首屏：
```text
[ PAGE 01 ][ PAGE 02 ]
```

翻页后：
```text
[ PAGE 03 ][ PAGE 04 ]
```

## 3. 必须看起来是一“本书”

不能只是两张图片。

需要：
- 中央书脊 / gutter
- 左右纸页
- 页堆厚度
- 外侧纸页层
- 翻页阴影
- 桌面投影
- 底部隐约凸出的封面 / 封底承托层

### 封面封底的特殊要求

虽然网站不展示独立封面和封底内容，但书摊开时，纸页下方必须能看到一层略大于内页的“底板”：

- 左右各自向外侧凸出约 5–10px
- 底部凸出约 6–12px
- 比内页稍深或稍暖
- 有极轻微圆角
- 位于所有纸页下方

这层视觉用于明确“这是一本书”，不能省略。

## 4. 页堆

左右外缘可见 3–8px 多层纸边。
建议用 pseudo elements / multiple shadow 模拟，不需要真实创建几十层。

## 5. Spine

中央不留大空隙。
使用很窄的阴影 / 凹槽叠加在两页交界处，不遮挡原作品集内容。

## 6. Source Page 尺寸差异

不得拉伸 Figma 书页文字。

统一放入逻辑 page box：
- `object-fit: contain`
- page box 背景取页面边缘近似纸色
- 不裁切正文

## 7. 翻页方式

Desktop：
- 点击右页 → 下一页
- 点击左页 → 上一页
- 拖页角
- ArrowLeft / ArrowRight

Touch：
- swipe
- 点页边

## 8. 项目下方内容

Book 下方依次：
1. 项目名称
2. 分类 / 角色 / 关键词
3. 短说明
4. Demo
5. 外链（如有）

PAWTERN：
手机样机 + Demo 左右布局。

其余三项：
说明在上，16:9 视频在下。

## 9. PAWTERN Phone

使用 Figma：
`05_PAWTERN_PHONE_FRAME`

手机 Demo 为独立 GIF / MP4。
在网页中把媒体定位到样机屏幕区域内，使用 CSS clipping。
样机资产作为顶层视觉外框。

## 10. 外链

如 URL 为空，不显示入口。
如有：

- `打开线上项目 ↗`
- `进入线上体验 ↗`
- `查看交互数据系统 ↗`

使用新标签打开。
