# 本轮交互、翻书与高清媒体迭代

本轮用户粘贴要求优先于旧 SPEC 中 -22px hover、C/D 不显示说明等旧参数。保留现有 Figma 纸张构图、路由与原始图像，不引入框架或大型动画库。

1. **Cover → Choose**：复用导航页的三个文件 wrapper；封面先以 1400px perspective、4° rotateX、-10° rotateY、-0.5° rotateZ 倾斜，叠加约 7px 纸板侧边阴影。导航素材从中间重叠位置平行展开，中段换入；标题在 600ms 后以 80ms 间隔显现，顶部提示最后显现。共 1020ms，结束才换路由，重复点击锁定。素材预加载在 Cover 内完成。
2. **Choose hover**：当前文件与标题作为整体上浮 42px、放大 1.015、提升层级；另两项 opacity 0.7；290ms 指定曲线，无模糊或弹跳。键盘 focus-visible 同样处理。
3. **书脊遮挡**：book-spine z-index 从 50 改成 2；监听 StPageFlip changeState，所有非 read 状态 opacity=0，回到 read 恢复。动态纸页和阴影继续由库渲染。录屏采集 59 帧，并逐帧采样书脊状态；翻页期间采样均为 0，回到静态为 1。检查了前段、中段和后段图像，没有中线穿页。
4. **实体承托层**：左右各凸出 9px、底部 10px；页堆厚度约 3–5px，底板采用更暖、更深的纸色；始终在书页下方，无独立封面页。
5. **Archive → Book**：选中意象提升至 950（仍低于前景遮罩），1.03 倍，向视口中心移动剩余距离的 8%；其他内容减淡。约 204ms 开始淡出，340ms 换场，Book 以 .97 / 10px / opacity 0 在 420ms 内进入。
6. **Other 自动定位**：双 requestAnimationFrame 后测量真实窗口，补偿尚未结束的文件夹位移动画，以内容中心对齐视口 48% 处。590ms 移动到轻微超调位置（最多 16px），160ms 落位，总计 750ms；用户滚轮或触摸可中断。切换重算目标，收起不主动滚回顶部（页面缩短时浏览器会自然限制滚动范围）。
7. **C/D 内容上移和文案**：作品窗口的内部 top 均设为 290（原为 360/418），保留四层文件夹排列。完整加入“泰和愈羽”和“自然 · 光影 · 鱼龙舞”项目名及用户指定说明，沿用 A/B 的无卡片版式。
8. **高清长图**：旧图均为 4096px 宽。本次直接导出整个 Figma strip 的 2× 原图并本地化，未拼接内部 item：A 11769×736，B 19642×736，C 19673×736，D 14720×736。CSS height:100%、width:auto、max-width:none。没有 CSS 锐化或 AI 放大。
9. **循环浏览**：根据实际渲染宽度取模，按阶段缩放换算 36 CSS px/s；高清替换不影响速度。悬停、拖拽暂停，释放后 800ms 恢复（鼠标仍悬停则保持暂停）；触屏不保留悬停状态；减少动态效果时手动浏览。
10. **返回与适配**：返回文字保持低权重，hover 左移 3px、轻微减淡/下划线。桌面、iPad 横屏、手机横屏及 DPR2 已检查；触控翻页、目录拖拽、返回、竖屏提示和 reduced-motion 回归通过。无 console/page error。

## 清晰度与限制

- Figma 只读尺寸检查见 figma-source-resolution.json：A 源图 4096×2304，B 3840×2160，C 4096×2154，D 可读图片节点 4096×2048；未发现这些源图是低清缩略图。D 的 API 遍历只暴露部分内部图片节点，不能据此宣称逐个检查了全部嵌套 item。
- 2× 长条图在 1568px 画布、DPR2 下有充足像素；更宽窗口和更高设备像素比仍可能放大。源设计中本身极小的文字仍受阅读字号限制，导出不会创造额外内容。
- 原有四个项目独立 MP4/GIF 仍未提供，不属于本轮高清 strip 替换；无法验收它们实际的清晰度和播放。
- 设备测试使用 Edge 视口与触控模拟，未在实体 iPad/iPhone Safari 上验收。

## 复查

启动预览后运行 `npm.cmd run verify`、`node tools/verify-touch.mjs`、`node tools/verify-iteration.mjs`。
`node tools/capture-motion.mjs` 采集翻页录屏帧，帧索引见 flip-recording-frames.json，图片位于本地 screenshots/iteration/flip-frames。
本轮机器检查结果：iteration-verification.json；书脊逐帧数据：spine-frames.json。
