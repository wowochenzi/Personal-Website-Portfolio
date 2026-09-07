# 05 RESPONSIVE SPEC

## 1. Source Canvas

最终 Figma Reference：
**1568 × 900**

不是旧版 1440 × 900。

Cover / Choose / About / Archive 默认以该画布为逻辑基准。

## 2. Desktop

根据 viewport 缩放，不针对具体电脑型号。

参考：
- Large Desktop：≥1600
- Standard Desktop / Laptop：1280–1599
- Compact Laptop / iPad Landscape：1024–1279
- Phone Landscape：<1024

## 3. Stage Fit

Cover / Choose / About / Archive 采用：

```text
scale = availableViewportWidth / 1568
```

根据用户最新截图反馈更新：场景铺满可用窗口宽度，不再受窗口高度限制而缩小居中、产生左右空白。图片与文字等比例缩放；内容高度超过视口时允许纵向滚动。可用宽度不包含浏览器滚动条，避免横向溢出。

不得为了填满屏幕裁掉文件夹或文字。

## 4. Portrait

Phone / iPad 竖屏时：
显示全屏提示：

**请旋转至横屏查看作品集**

主交互暂停。

## 5. Touch Safe Area

支持：
```css
env(safe-area-inset-left)
env(safe-area-inset-right)
env(safe-area-inset-top)
env(safe-area-inset-bottom)
```

触控目标最小 44×44 CSS px。

## 6. Project Book

Desktop / Laptop / iPad 横屏：
- 双页 spread

Phone 横屏：
- 默认单页
- 仍保留页厚 / 底部封面凸边 / 阴影
- swipe 翻页

## 7. Other Works

Default Reference：1568 × 900。

Active Reference：1568 × 1510。
激活后页面允许纵向变高并滚动，**不能把 1510 高的内容强行压缩回 900**。

横向作品窗口按 Reference 比例自适应，桌面端约等于一次看到两张作品。
