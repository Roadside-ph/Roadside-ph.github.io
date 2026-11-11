# SO-ARM101 机械臂 VLA 抓取策略（Pi0）

**2026.08 – 2026.11 · 实习项目**

在 SO-ARM101 六轴机械臂上，基于 **Pi0 VLA 模型**（3.5B）完成"抓取白色药瓶放入黑色胶带圈"视觉操作任务的**全流程闭环**：数据采集 → 全量微调 → Jetson 实机部署 → 性能诊断与调参优化。

## 技术栈

<span class="skill-tag">Pi0（VLA / Flow Matching）</span>
<span class="skill-tag">LeRobot</span>
<span class="skill-tag">PaliGemma 3B</span>
<span class="skill-tag">模仿学习</span>
<span class="skill-tag">Jetson AGX Orin</span>
<span class="skill-tag">双相机视觉（top + gripper）</span>
<span class="skill-tag">gRPC（C/S 架构）</span>
<span class="skill-tag">HuggingFace Hub</span>

## 项目全貌

| 环节 | 内容 |
|---|---|
| **任务** | 抓取随机摆放的白色药瓶，放入黑色胶带圈（双相机视觉闭环） |
| **数据** | 遥操作采集 203 集 / 77,944 帧 / 约 43 分钟，AV1 编码，发布至 HuggingFace |
| **训练** | Pi0 全量微调 50,000 步（batch 8，冻结视觉编码器，bfloat16），4090 服务器 |
| **部署** | Jetson AGX Orin：policy_server（模型常驻）+ robot_client 双进程 gRPC 架构 |
| **验证** | 实机 20 轮测试 + 计划跟随率量化诊断 |

## 我的职责

- **数据工程**：设计采集流程（遥操作 leader 臂、双相机、目标位置随机化）；编写逐帧时间戳验证脚本，155,888 帧全部通过对齐校验（1e-4 容差）、无缺帧、无 NaN
- **模型训练**：完成 Pi0 3.5B 全量微调（`use_peft=False`），冻结策略为 SigLIP 视觉编码器冻结 + 主干/动作专家全量微调
- **实机部署**：在 Jetson AGX Orin（JetPack 6.2 / CUDA 12.6）上搭建推理服务，修复模型 tokenizer 路径，实现 server 端缓存优化
- **性能诊断**（核心贡献）：定位 50% 成功率的根因——**"计划跟随率"**（client 实际执行的动作块步数占比），而非模型本身

## 关键诊断：计划跟随率

部署初期成功率仅 50%。通过系统性归因实验发现：

| 配置 | 计划跟随率 | 结果 |
|---|---|---|
| fps=30（官方默认） | ~10-28% | ❌ 失败（动作幅度大） |
| fps=30 + 减推理步数 | ~28%（未提速） | ❌ 失败 |
| **fps=10** | **~70-84%** | ✅ **可靠成功**（代价：10Hz 台阶抖动） |
| fps=30 + rebasing 修复 | 100% | ⚠️ 部分成功（动作大、放置失败） |

**两个关键洞察**：

1. **推理瓶颈在 3B PaliGemma 视觉编码器**（480×640 图像前向），而非 flow matching 采样步数——减少 `num_inference_steps` 无法提速，需从图像分辨率/量化入手
2. **成败 = 动作块计划被实际执行的比例**：50 步动作块在 30fps 下覆盖 1.67s ≈ 推理耗时 1.3s，client 只来得及执行块尾部；降低 fps 提高跟随率，是当前硬件下唯一可靠配置

## 工程产出

- 数据集 [`franecki/pill_bottle_203`](https://huggingface.co/datasets/franecki/pill_bottle_203)（HF 发布）
- 微调模型 `pi0_soarm101_full_v203_50k`
- 完整开发日志（环境搭建 → 标定 → 采集 → 训练 → 部署 → 调参全记录）
- 自制可视化学习材料：flow matching 加噪动画、Pi0 网络结构图、推理流程双泳道图、fps 执行时间线等 7 份交互式 HTML

## 下一步（已知问题）

- fps=10 的台阶抖动 → 动作流插值 / 低通滤波平滑（代码级）
- 视觉推理提速 → 降低图像分辨率或模型量化（模型级）

<!-- 截图位：建议放 机械臂实拍 / 抓取任务演示 GIF，
     保存到 docs/public/images/ 后放开注释：

![机械臂](/images/so-arm101.jpg)
-->
