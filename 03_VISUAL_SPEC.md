# 03 VISUAL SPEC

## 1. 视觉基调

使用 Figma 现有：
- 暖白纸纹背景
- 蓝色档案纸
- 米白纸
- 牛皮纸
- 深灰 / 黑文件夹
- 奶黄色文件夹
- 低对比阴影
- 纸张真实纹理

不要额外加入新的视觉体系。

## 2. 字体

优先匹配 Figma：

- 英文大标题：`GeoSlab703 Md BT Bold` 风格
- 中文 / 细字：`Glow Sans SC` 对应字重

若本地无法合法加载原字体：
使用视觉最接近的可部署替代字体，但不得改变整体排版气质。

## 3. HTML 文字

正常信息文字使用 HTML：
- “点击打开档案”
- CHOOSE ONE PAGE
- Home Page / About Me / Content
- About 文字
- Archive 左侧目录
- 项目说明
- Other Works 分类标签
- 返回入口

特殊纸张、图像、Logo 使用 Figma 资产。

## 4. 阴影

阴影低对比、短距离：

```css
box-shadow:
  0 8px 20px rgba(40,36,32,.10),
  0 2px 5px rgba(40,36,32,.10);
```

禁止 glow。

## 5. 纸张边界

所有纸张保持 Figma 自带：
- 纤维
- 撕边
- 打孔
- 老式档案质感

不要通过 CSS 再加重黄化 / 噪点。
