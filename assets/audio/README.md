# 档案交互音效素材

当前未提供音频文件。网页已接入统一 AudioManager，缺音频时安静运行，不下载外部素材、不制造占位声音，也不影响动画。

请将有使用授权的 MP3 文件放入本目录，运行 `npm.cmd run audio:sync` 后刷新；`npm.cmd run dev` / `npm.cmd start` 也会自动更新清单。部署时提交生成的 manifest.json。只有清单中的文件会被预加载。

需要以下 16 个文件：

| 文件 | 用途 | 建议长度 |
| --- | --- | --- |
| paper_unroll.mp3 | 开场纸张展开 | 0.86 秒 |
| paper_settle.mp3 | 纸面落平 | 0.15–0.3 秒 |
| folder_slide.mp3 | 封面摩擦上移 | 1.05 秒 |
| folder_open.mp3 | 点击封面后打开档案 | 0.3–0.6 秒 |
| folder_split.mp3 | 拆成三个文件夹 | 0.6–0.9 秒 |
| paperclip_drop_01.mp3 | 第一枚回形针 | 0.12–0.22 秒 |
| paperclip_drop_02.mp3 | 第二枚回形针 | 0.12–0.22 秒 |
| paperclip_drop_03.mp3 | 第三枚回形针 | 0.12–0.22 秒 |
| paper_grab.mp3 | 抓起意象或目录 | 0.12–0.25 秒 |
| paper_drop.mp3 | 放下纸张 | 0.15–0.3 秒 |
| page_flip_01.mp3 | 翻页变体 1 | 0.4–0.65 秒 |
| page_flip_02.mp3 | 翻页变体 2 | 0.4–0.65 秒 |
| page_flip_03.mp3 | 翻页变体 3 | 0.4–0.65 秒 |
| ui_click_soft.mp3 | 轻触确认 | 0.06–0.15 秒 |
| other_folder_open.mp3 | 展开 Other 文件夹 | 0.3–0.6 秒 |
| other_folder_close.mp3 | 收起 Other 文件夹 | 0.3–0.6 秒 |

音色应干燥、近距离、轻柔，无背景音乐、提示音或过大的金属撞击。统一主音量为 0.54，各事件增益约 0.17–0.37，最多同时播放 3 声，片尾做短淡出。补齐后仍需戴耳机和使用笔记本扬声器试听实际素材响度。

右上角开关只控制交互音效。傩场视频的配乐保持独立，仍由视频播放器控制。
