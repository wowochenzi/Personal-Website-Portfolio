# 11 QA / ACCEPTANCE SPEC

## Cover
- [ ] 与 `01_COVER_REFERENCE_FULL` 构图一致
- [ ] 点击打开档案进入 Choose，不直接进 About
- [ ] 三个回形针 / Portfolio / 纸张层次正确
- [ ] 无 SaaS 风新增 UI

## Choose
- [ ] 默认 2.5D 构图匹配 Figma
- [ ] Home / About / Content 标题绑定正确
- [ ] Hover 文件与标题一起上浮
- [ ] 三个点击目标跳转正确
- [ ] 不把 2.5D 文件改成普通卡片

## About
- [ ] 蓝卡 / 牛皮纸 / 米白履历纸层次正确
- [ ] 文案不溢出
- [ ] 右侧大纸正确使用当前 `03_ABOUT_BLUE_CARD_HOLE_EDGE`
- [ ] 个人照片比例正确

## Archive
- [ ] 四个主项目 + Other 位置正确
- [ ] 可自由拖拽
- [ ] 点击提升层级
- [ ] 底部文件夹遮罩正确压住部分物件
- [ ] 返回后拖拽位置不丢失
- [ ] 主项目双击直接打开书

## Book
- [ ] 不是轮播
- [ ] 两页能组成原 spread
- [ ] 有页堆厚度
- [ ] 有书脊
- [ ] 有翻页弯曲与动态阴影
- [ ] 纸页底部能看到略凸出的封面 / 封底承托层
- [ ] 不显示独立封面页
- [ ] 不拉伸书页文字
- [ ] Desktop / iPad 双页
- [ ] Phone 横屏单页
- [ ] 键盘 / Touch 可翻页

## PAWTERN Demo
- [ ] 使用 `05_PAWTERN_PHONE_FRAME`
- [ ] GIF / 视频准确裁入手机屏幕
- [ ] 左手机、右说明的桌面布局成立

## Other Works
- [ ] Default 与 `09_OTHER_REFERENCE_DEFAULT` 一致
- [ ] 品牌设计 / 商业创新设计 / AIGC插画 / 空间构成标签始终存在
- [ ] 点击文件夹切换至对应 Active Reference 布局
- [ ] Active 页面允许纵向高度变为约 1510 reference
- [ ] 作品窗口一次约展示两张图
- [ ] 使用完整 `09_OTHER_STRIP_A/B/C/D`
- [ ] 自动匀速横向滚动
- [ ] Hover / Drag 可暂停
- [ ] A/B 下方显示正确项目名与说明
- [ ] C/D 不强行添加说明

## Responsive
- [ ] 1568×900 为设计源基准
- [ ] 1920×1080 无裁切
- [ ] 1440×900 无裁切
- [ ] 常见 Laptop 可用
- [ ] iPad 横屏可用
- [ ] Phone 横屏可用
- [ ] Phone / iPad 竖屏只显示旋转提示
- [ ] Safe Area 正确

## Performance
- [ ] 首屏不加载全部书页
- [ ] 视频懒加载
- [ ] Figma 资产已本地化
- [ ] 无控制台严重错误
