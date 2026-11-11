# 个人学习项目

## SO-ARM101 机械臂 VLA 抓取策略（Pi0）

**技术栈：** Pi0 VLA · LeRobot · PaliGemma 3B · Jetson AGX Orin · 双相机视觉 · gRPC

基于 Pi0（3.5B）的机械臂视觉抓取全流程：数据采集（203 集）→ 全量微调（50K 步）→ Jetson 实机部署。核心贡献：定位"计划跟随率"为成败根因，通过系统性调参实验将可靠成功率提升至可用水准。

[查看详情 →](./so-arm101-vla.md)

## 小哈 · 线下门店智能导购机器人（LLM + RAG）

**技术栈：** FastAPI · Vue 3 · DeepSeek · BM25+向量混合检索 · SenseVoice/CosyVoice · WebSocket

语音唤醒的多轮导购对话系统：意图路由 + RAG 知识库检索 + 知识边界约束（未命中不编造），311 条全量测试集 100% 通过，含完整架构图与评测数据。

[查看详情 →](./rag-store-assistant.md)
