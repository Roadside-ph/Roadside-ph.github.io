# 小哈 · 线下门店智能导购机器人（LLM + RAG）

**2025.09 – 2026.10 · 独立设计开发**

面向线下鞋服门店（哈森 HARSON）的智能导购对话系统。顾客通过**语音**与"小哈"自然对话：唤醒词唤醒 → 免按钮语音问答 → 基于门店商品知识库（RAG）的专业导购回答 → 语音播报。完整覆盖**方案设计 → 编码实现 → 评测迭代**全流程，配套 6 份设计文档与自动化评测报告。

## 技术栈

<span class="skill-tag">FastAPI</span>
<span class="skill-tag">Vue 3 + Vite</span>
<span class="skill-tag">DeepSeek API</span>
<span class="skill-tag">RAG：BM25 + 向量混合检索</span>
<span class="skill-tag">FAISS</span>
<span class="skill-tag">bge-small-zh-v1.5</span>
<span class="skill-tag">SQLite FTS5 + jieba</span>
<span class="skill-tag">SenseVoice（ASR）</span>
<span class="skill-tag">CosyVoice / MeloTTS（TTS）</span>
<span class="skill-tag">WebSocket + SSE 流式</span>
<span class="skill-tag">pytest 回归</span>

---

## 总体架构

系统采用**后端中心式**语音架构：浏览器只负责音频采集与播放，唤醒词检测（KWS）、VAD 断句、ASR、对话、TTS 全部在后端完成——前端保持瘦，未来换 kiosk 硬件只需一个能开麦克风的浏览器。

整体链路：**浏览器采集 → KWS 唤醒 → VAD 断句 → ASR 识别 → 意图路由 →（闲聊走 LLM 生成 / 专业问题走 RAG 检索，命中注入门店资料、未命中走兜底话术）→ 句级流式 TTS 播报**，播报中支持 barge-in 打断。

## RAG 检索层设计

| 组件 | 选型 | 设计理由 |
|---|---|---|
| Embedding | bge-small-zh-v1.5（本地，CPU 毫秒级） | 230 条库规模下够用；千级升级 bge-m3，接口不变 |
| 向量索引 | FAISS IndexFlatIP | 小库精确检索，零近似损失 |
| 关键词通道 | SQLite FTS5 + jieba（领域词典） | 货号/专名（"HFA260106"）靠向量捞不准，必须关键词兜住 |
| 融合 | 0.5·BM25norm + 0.5·cos | 评测集上权重调优 |
| 门控 | 双通道均低于阈值 → 判定未命中 | 防编造的第一道闸 |

**关键设计决策——知识边界约束**：人设 Prompt + 检索门控双重约束，知识库未命中的商品/品牌事实问题，小哈礼貌转店员而非编造。线下导购场景中"说错商品信息"的代价远高于"不知道"，这是整个系统可信度的基石。

## 评测与迭代（数据来自 eval_reports）

| 评测项 | 指标 | 结果 |
|---|---|---|
| 检索层（standalone，n=129） | hit_rate / recall@1 / MRR | 全部 **1.0** |
| 检索层（session 内，n=463） | hit_rate / recall@1 / MRR | 全部 **1.0** |
| 负例（n=8，知识库外问题） | 误命中 | 仅 1 例，修复后归零 |
| 端到端（n=30） | 路由准确 / 检索准确 / 回答准确 | **全部 100%** |
| 全量测试集（n=311） | 综合通过率 | **311/311 = 100%**（三轮修复后） |

迭代过程举例：真实使用反馈暴露"主体混淆"与 TTS 顿号问题 → 当天定位修复 → 全量回归验证。**评测驱动**而非凭感觉调优。

## 本地化部署探索

额外完成一轮 **Ollama + Qwen3-4B 本地部署评测**（对比 DeepSeek 云端）：
延迟基准、意图路由准确率、知识问答 groundedness、检索层回归、**断网可用性**验证，产出《本地 LLM 评测报告》——为门店弱网/无网环境提供部署选项。

## 工程质量

- 模块化分层：`asr / voice / rag / llm / tts / prompts` 各层单一职责，LLM 封装为全项目唯一出口，换模型只改一个文件
- 语音会话状态机（IDLE/LISTENING/THINKING/REPLYING）为纯逻辑模块，可单测
- pytest 单测 + 评测脚本回归（`eval_reports/` 留存修复前后对比）
- 配套设计文档 6 份：RAG 知识库设计方案、语音交互计划书（含 barge-in 打断、连接策略两轮修订）、LLM 本地部署评测报告等
- 一键启停（`start.bat / stop.bat`），含 ASR 模型暖机检测

## 项目成果

- 端到端可运行的完整系统：唤醒 → 对话 → 检索 → 回答 → 播报，支持播报打断（barge-in）
- 语音识别本地化（SenseVoice CPU 推理 ~0.3s），暖机后交互无感延迟
- 检索与端到端评测全指标通过，311 条全量测试集满分

<!-- 截图位：建议运行项目后截 2~3 张（语音交互界面 / 文字对话 / 项目 Workflow 页）
     保存到 docs/public/images/ 后放开注释：

## 界面展示

![语音交互](/images/rag-voice.png)

![对话界面](/images/rag-chat.png)
-->
