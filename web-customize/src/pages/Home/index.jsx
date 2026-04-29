/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useContext, useEffect, useMemo, useState, useRef } from 'react';
import { Button, Typography, Input } from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  IconGithubLogo,
  IconPlay,
  IconFile,
  IconCopy,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  Ai21,
  Ai360,
  AiHubMix,
  AiStudio,
  Automatic,
  AzureAI,
  Baichuan,
  BaiduCloud,
  ChatGLM,
  Claude,
  Cohere,
  ComfyUI,
  Coze,
  CrewAI,
  Dalle,
  DeepSeek,
  Dify,
  Doubao,
  Fal,
  FastGPT,
  Fireworks,
  Gemini,
  Grok,
  Groq,
  Hailuo,
  HuggingFace,
  Hunyuan,
  Ideogram,
  IFlyTekCloud,
  InternLM,
  Jimeng,
  Kera,
  Kimi,
  Kling,
  LangChain,
  Lightricks,
  Luma,
  MetaAI,
  Midjourney,
  Minimax,
  Mistral,
  ModelScope,
  Moonshot,
  NotebookLM,
  Nvidia,
  Ollama,
  OpenAI,
  Perplexity,
  Pika,
  Qingyan,
  Qwen,
  Replicate,
  Runway,
  SenseNova,
  SiliconCloud,
  Spark,
  Stability,
  Stepfun,
  Suno,
  TencentCloud,
  Tiangong,
  Together,
  Tripo,
  Vidu,
  Volcengine,
  Wenxin,
  XAI,
  Xinference,
  Zhipu,
} from '@lobehub/icons';
import './home-premium.css';

const { Text } = Typography;

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const [endpointIndex, setEndpointIndex] = useState(0);
  const [activeEndpointGroup, setActiveEndpointGroup] = useState(0);
  const isChinese = i18n.language.startsWith('zh');

  const groupedEndpoints = [
    {
      title: t('对话类'),
      items: [
        '/v1/chat/completions',
        '/v1/responses',
        '/v1/responses/compact',
        '/v1/messages',
      ],
      color: 'chat',
    },
    {
      title: t('理解类'),
      items: ['/v1/embeddings', '/v1/rerank', '/v1beta/models'],
      color: 'embed',
    },
    {
      title: t('图像类'),
      items: [
        '/v1/images/generations',
        '/v1/images/edits',
        '/v1/images/variations',
      ],
      color: 'image',
    },
    {
      title: t('音频类'),
      items: [
        '/v1/audio/speech',
        '/v1/audio/transcriptions',
        '/v1/audio/translations',
      ],
      color: 'audio',
    },
  ];

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const selectedEndpoint = API_ENDPOINTS[endpointIndex];
    const fullUrl = `${serverAddress}${selectedEndpoint}`;
    const ok = await copy(fullUrl);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  const handleSelectEndpoint = (index) => {
    setEndpointIndex(index);
  };

  const handleSelectGroup = (groupIndex) => {
    setActiveEndpointGroup(groupIndex);
    const firstEndpointOfGroup = groupedEndpoints[groupIndex].items[0];
    const idx = API_ENDPOINTS.indexOf(firstEndpointOfGroup);
    setEndpointIndex(idx);
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  const providerItems = [
    { name: 'OpenAI', icon: <OpenAI size={24} /> },
    { name: 'Claude', icon: <Claude.Color size={24} /> },
    { name: 'Gemini', icon: <Gemini.Color size={24} /> },
    { name: 'DeepSeek', icon: <DeepSeek.Color size={24} /> },
    { name: 'Qwen', icon: <Qwen.Color size={24} /> },
    { name: 'Zhipu', icon: <Zhipu.Color size={24} /> },
    { name: 'Kimi', icon: <Kimi size={24} /> },
    { name: 'Doubao', icon: <Doubao size={24} /> },
    { name: 'Baichuan', icon: <Baichuan size={24} /> },
    { name: 'ChatGLM', icon: <ChatGLM size={24} /> },
    { name: 'Hunyuan', icon: <Hunyuan.Color size={24} /> },
    { name: 'Wenxin', icon: <Wenxin.Color size={24} /> },
    { name: 'Spark', icon: <Spark.Color size={24} /> },
    { name: 'Moonshot', icon: <Moonshot size={24} /> },
    { name: 'Minimax', icon: <Minimax.Color size={24} /> },
    { name: 'Stepfun', icon: <Stepfun size={24} /> },
    { name: 'Tiangong', icon: <Tiangong size={24} /> },
    { name: 'SenseNova', icon: <SenseNova size={24} /> },
    { name: 'InternLM', icon: <InternLM size={24} /> },
    { name: 'ModelScope', icon: <ModelScope size={24} /> },
    { name: 'SiliconCloud', icon: <SiliconCloud size={24} /> },
    { name: 'Kling', icon: <Kling size={24} /> },
    { name: 'Vidu', icon: <Vidu size={24} /> },
    { name: 'Jimeng', icon: <Jimeng size={24} /> },
    { name: 'Hailuo', icon: <Hailuo size={24} /> },
    { name: 'IFlyTekCloud', icon: <IFlyTekCloud size={24} /> },
    { name: 'TencentCloud', icon: <TencentCloud size={24} /> },
    { name: 'BaiduCloud', icon: <BaiduCloud size={24} /> },
    { name: 'Volcengine', icon: <Volcengine.Color size={24} /> },
    { name: 'xAI', icon: <XAI size={24} /> },
    { name: 'Grok', icon: <Grok size={24} /> },
    { name: 'Mistral', icon: <Mistral size={24} /> },
    { name: 'Cohere', icon: <Cohere.Color size={24} /> },
    { name: 'Together', icon: <Together size={24} /> },
    { name: 'Groq', icon: <Groq size={24} /> },
    { name: 'Perplexity', icon: <Perplexity size={24} /> },
    { name: 'Ollama', icon: <Ollama size={24} /> },
    { name: 'Nvidia', icon: <Nvidia size={24} /> },
    { name: 'Stability', icon: <Stability size={24} /> },
    { name: 'Midjourney', icon: <Midjourney size={24} /> },
    { name: 'Suno', icon: <Suno size={24} /> },
    { name: 'Runway', icon: <Runway size={24} /> },
    { name: 'HuggingFace', icon: <HuggingFace size={24} /> },
    { name: 'Replicate', icon: <Replicate size={24} /> },
    { name: 'ComfyUI', icon: <ComfyUI size={24} /> },
    { name: 'LangChain', icon: <LangChain size={24} /> },
    { name: 'Dify', icon: <Dify size={24} /> },
    { name: 'Coze', icon: <Coze size={24} /> },
    { name: 'FastGPT', icon: <FastGPT size={24} /> },
    { name: 'MetaAI', icon: <MetaAI size={24} /> },
    { name: 'DALL·E', icon: <Dalle size={24} /> },
    { name: 'Ideogram', icon: <Ideogram size={24} /> },
    { name: 'Pika', icon: <Pika size={24} /> },
    { name: 'Luma', icon: <Luma size={24} /> },
    { name: 'Tripo', icon: <Tripo size={24} /> },
    { name: 'Kera', icon: <Kera size={24} /> },
    { name: 'Qingyan', icon: <Qingyan.Color size={24} /> },
    { name: 'Xinference', icon: <Xinference.Color size={24} /> },
    { name: 'Ai360', icon: <Ai360 size={24} /> },
    { name: 'AiHubMix', icon: <AiHubMix size={24} /> },
    { name: 'Fireworks', icon: <Fireworks size={24} /> },
    { name: 'Azure AI', icon: <AzureAI.Color size={24} /> },
    { name: 'NotebookLM', icon: <NotebookLM size={24} /> },
    { name: 'CrewAI', icon: <CrewAI size={24} /> },
    { name: 'AiStudio', icon: <AiStudio size={24} /> },
    { name: 'Automatic', icon: <Automatic size={24} /> },
    { name: 'Fal', icon: <Fal size={24} /> },
    { name: 'Ai21', icon: <Ai21 size={24} /> },
    { name: 'Lightricks', icon: <Lightricks size={24} /> },
  ];

  const featureItems = [
    {
      title: t('统一 OpenAI 协议'),
      desc: t('一次接入，快速兼容主流 SDK 与应用框架，减少迁移与改造成本。'),
      meta: t('兼容层'),
      style: 'wide',
      icon: '🔗',
      stats: { value: '100+', label: t('SDK兼容') },
      tags: [t('RESTful'), t('Streaming'), t('Batch')],
      theme: 'violet',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)',
    },
    {
      title: t('多供应商智能路由'),
      desc: t('按模型、地区、权重与健康度分发请求，自动切换可用通道。'),
      meta: t('调度层'),
      style: 'tall',
      icon: '🎯',
      stats: { value: '40+', label: t('供应商') },
      tags: [t('智能调度'), t('故障转移'), t('负载均衡')],
      theme: 'violet',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #ddd6fe 100%)',
    },
    {
      title: t('全链路可观测'),
      desc: t('提供请求、延迟、错误、消耗与配额视图，定位问题更高效。'),
      meta: t('观测层'),
      style: 'normal',
      icon: '📊',
      stats: { value: '50ms', label: t('采集延迟') },
      tags: [t('实时监控'), t('告警通知'), t('日志追踪')],
      theme: 'amber',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)',
    },
    {
      title: t('企业级安全控制'),
      desc: t('支持密钥隔离、角色权限、风控策略与审计日志，保障数据安全。'),
      meta: t('安全层'),
      style: 'normal',
      icon: '🔒',
      stats: { value: 'AES-256', label: t('加密标准') },
      tags: [t('RBAC'), t('审计日志'), t('风控')],
      theme: 'rose',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #fda4af 100%)',
    },
    {
      title: t('计费与限流能力'),
      desc: t('内置额度、分组限流、模型倍率和账单能力，适配多租户运营。'),
      meta: t('治理层'),
      style: 'wide',
      icon: '💳',
      stats: { value: '99.9%', label: t('计费精度') },
      tags: [t('多租户'), t('配额管理'), t('账单')],
      theme: 'cyan',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 50%, #67e8f9 100%)',
    },
    {
      title: t('高可用与弹性扩展'),
      desc: t('支持缓存、重试和熔断策略，面对高峰流量依然稳定响应。'),
      meta: t('稳定层'),
      style: 'normal',
      icon: '⚡',
      stats: { value: '99.99%', label: t('可用性') },
      tags: [t('自动扩容'), t('熔断降级'), t('缓存')],
      theme: 'indigo',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a5b4fc 100%)',
    },
  ];

  const scenarioItems = [
    {
      title: t('企业智能客服'),
      desc: t('统一管理多个模型，按成本与效果自动切换，持续优化服务质量。'),
      tag: t('服务体验'),
    },
    {
      title: t('研发 Copilot 平台'),
      desc: t('为不同团队分配独立额度和密钥，实现可控、安全的 AI 开发体验。'),
      tag: t('研发效率'),
    },
    {
      title: t('内容生产工作流'),
      desc: t('文本、图像与多模态统一接入，快速搭建稳定的内容生成能力。'),
      tag: t('多模态生产'),
    },
  ];

  const dynamicFeedItems = [
    {
      title: t('多模型智能路由'),
      desc: t('按可用性和成本自动切换，保障业务连续性'),
      icon: '🎯',
      theme: 'violet',
    },
    {
      title: t('统一 OpenAI 接口'),
      desc: t('一次接入，兼容主流 SDK 与应用框架'),
      icon: '🔗',
      theme: 'violet',
    },
    {
      title: t('企业级计费治理'),
      desc: t('额度、限流、倍率与账单一体化管理'),
      icon: '💳',
      theme: 'cyan',
    },
    {
      title: t('全链路观测中心'),
      desc: t('请求、错误、延迟、消耗实时可见'),
      icon: '📊',
      theme: 'amber',
    },
    {
      title: t('安全合规审计'),
      desc: t('密钥隔离、操作审计、权限分层控制'),
      icon: '🔒',
      theme: 'rose',
    },
    {
      title: t('高可用故障切换'),
      desc: t('区域级容灾与自动回退策略，保障核心请求连续稳定'),
      icon: '⚡',
      theme: 'indigo',
    },
  ];

  const heroSignalItems = useMemo(
    () => [
      { label: t('在线供应商'), value: '40+', tone: 'blue' },
      { label: t('成功率'), value: '99.97%', tone: 'cyan' },
      { label: t('平均延迟'), value: '186ms', tone: 'violet' },
      { label: t('峰值吞吐'), value: '2.8k/min', tone: 'emerald' },
    ],
    [t],
  );

  const orchestrationSteps = useMemo(
    () => [
      t('接入请求'),
      t('策略路由'),
      t('供应商选择'),
      t('计费审计'),
    ],
    [t],
  );

  const layerItems = useMemo(
    () => [
      {
        title: t('接入层'),
        value: t('统一协议 / SDK 兼容 / 多端接入'),
      },
      {
        title: t('调度层'),
        value: t('权重路由 / 健康检查 / 故障回退'),
      },
      {
        title: t('治理层'),
        value: t('审计 / 计费 / 权限 / 限流'),
      },
    ],
    [t],
  );

  return (
    <div className='w-full overflow-x-hidden home-premium-page'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className='w-full overflow-x-hidden story-home story-home-next'>
          <div className='story-bg story-bg-a' />
          <div className='story-bg story-bg-b' />
          <div className='story-grid-mask' />
          <div className='story-noise-mask' />
          <div className='story-orb story-orb-a' />
          <div className='story-orb story-orb-b' />
          <div className='story-orb story-orb-c' />

          <section className='story-panel'>
            <div className='story-panel-container story-panel-container-hero'>
              <div className='story-banner-shell story-hero-shell'>
                <div className='story-banner-main story-banner-main-next'>
                  <div className='story-banner-left story-banner-left-next'>
                    {/* 主标题 - 错落排版 */}
                    <div className='story-hero-brand'>
                      <span className='story-hero-badge'>AI Infrastructure</span>
                      <h1 className='story-hero-headline'>
                        <span className='headline-main'>AI Gateway <span className='headline-sub'>统一 AI 能力入口</span></span>
                        
                      </h1>
                      <p className='story-hero-lead'>
                        智能路由、多模型调度、企业级治理，一站式 AI 基础设施平台
                      </p>
                    </div>

                    <div className='story-hero-metrics-strip'>
                      <div className='story-hero-metric-item'>
                        <span className='story-hero-metric-value'>99.97<span className='story-hero-metric-suffix'>%</span></span>
                        <span className='story-hero-metric-label'>系统可用性</span>
                      </div>
                      <div className='story-hero-metric-divider' />
                      <div className='story-hero-metric-item'>
                        <span className='story-hero-metric-value'>40<span className='story-hero-metric-suffix'>+</span></span>
                        <span className='story-hero-metric-label'>AI 模型接入</span>
                      </div>
                      <div className='story-hero-metric-divider' />
                      <div className='story-hero-metric-item'>
                        <span className='story-hero-metric-value'>186<span className='story-hero-metric-suffix'>ms</span></span>
                        <span className='story-hero-metric-label'>平均响应延迟</span>
                      </div>
                    </div>

                    <div className='story-hero-capability-tags'>
                      <span className='story-hero-cap-tag'>
                        <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M22 11.08V12a10 10 0 11-5.93-9.14'/><polyline points='22 4 12 14.01 9 11.01'/></svg>
                        智能路由
                      </span>
                      <span className='story-hero-cap-tag'>
                        <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M2 9V6a2 2 0 012-2h16a2 2 0 012 2v3M2 9v6a2 2 0 002 2h16a2 2 0 002-2V9M2 9h20M8 13h.01M12 13h.01M16 13h.01'/></svg>
                        多模型调度
                      </span>
                      <span className='story-hero-cap-tag'>
                        <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>
                        毫秒级分发
                      </span>
                      <span className='story-hero-cap-tag'>
                        <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><rect x='3' y='11' width='18' height='11' rx='2'/><path d='M7 11V7a5 5 0 0110 0v4'/></svg>
                        企业级治理
                      </span>
                    </div>

                    {/* CTA 按钮 */}
                    <div className='story-hero-cta-row-clean'>
                      <Link to='/console'>
                        <Button
                          theme='solid'
                          type='primary'
                          size='large'
                          className='story-btn story-btn-primary'
                          icon={<IconPlay />}
                        >
                          {t('立即接入')}
                        </Button>
                      </Link>
                      {docsLink && (
                        <Button
                          size='large'
                          className='story-btn story-btn-secondary'
                          icon={<IconFile />}
                          onClick={() => window.open(docsLink, '_blank')}
                        >
                          {t('在线文档')}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className='story-banner-right story-banner-right-next'>
                    <CodeTerminal />
                  </div>
                </div>

                
              </div>
            </div>
          </section>

          <section className='story-panel story-panel-onboard'>
            <div className='story-panel-container story-onboard-layout'>
              <div className='story-onboard-content'>
                <div className='story-onboard-left'>
                  <Text className='story-section-kicker'>{t('快速接入')}</Text>
                  <h2 className='story-section-title'>
                    {t('标准化统一接入，链接全球多元 AI 能力')}
                  </h2>
                  <p className='story-section-desc'>
                    {t(
                      '统一 Base URL 与协议映射，让 SDK、应用、工作流和内部平台都能用一套接入方式联通多家模型供应商。',
                    )}
                  </p>
                </div>
                <div className='story-onboard-right'>
                  {/* 分类页签 */}
                  <div className='story-endpoint-tabs'>
                    {groupedEndpoints.map((group, idx) => (
                      <button
                        key={group.title}
                        type='button'
                        className={`story-endpoint-tab ${activeEndpointGroup === idx ? 'active' : ''}`}
                        data-color={group.color}
                        onClick={() => handleSelectGroup(idx)}
                      >
                        <span className='story-endpoint-tab-dot' />
                        {group.title}
                      </button>
                    ))}
                  </div>
                  
                  {/* 横向接口列表 */}
                  <div className='story-endpoint-paths'>
                    {groupedEndpoints[activeEndpointGroup].items.map((path) => {
                      const idx = API_ENDPOINTS.indexOf(path);
                      const isSelected = idx === endpointIndex;
                      return (
                        <button
                          key={path}
                          type='button'
                          className={`story-endpoint-path-item ${isSelected ? 'active' : ''}`}
                          onClick={() => handleSelectEndpoint(idx)}
                        >
                          {path}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* URL 展示区域 */}
                  <div className='story-endpoint-url-bar'>
                    <div className='story-endpoint-url-label'>Base URL</div>
                    <div className='story-endpoint-url-input-wrapper'>
                      <div className='story-endpoint-url-rainbow'>
                        <div className='story-endpoint-url-inner'>
                          <Input
                            readonly
                            value={`${serverAddress}${API_ENDPOINTS[endpointIndex]}`}
                            className='story-endpoint-url-input'
                          />
                          <Button
                            type='primary'
                            onClick={handleCopyBaseURL}
                            icon={<IconCopy />}
                            className='story-endpoint-url-copy'
                          >
                            {t('复制')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Platform Advantages - 平台优势 */}
          <section className='story-panel story-panel-advantages'>
            <div className='story-panel-container'>
              <div className='story-advantages-header'>
                <Text className='story-section-kicker'>{t('平台优势')}</Text>
                <h2 className='story-section-title'>
                  {t('为规模化 AI 业务打造的基础设施')}
                </h2>
                <p className='story-section-desc'>
                  {t('从响应速度到服务可靠性，每个环节都经过精心优化')}
                </p>
              </div>

              <div className='story-advantages-grid'>
                <div className='story-advantage-card story-advantage-card-uptime'>
                  <div className='story-advantage-card-icon'>
                    <svg viewBox='0 0 32 32' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
                      <circle cx='16' cy='16' r='14' />
                      <path d='M16 8v8l5 4' />
                    </svg>
                  </div>
                  <div className='story-advantage-card-stat'>
                    <span className='story-advantage-card-value'>
                      99.97<span className='story-advantage-card-unit'>%</span>
                    </span>
                    <span className='story-advantage-card-trend'>↑ 0.02%</span>
                  </div>
                  <h3 className='story-advantage-card-title'>{t('高可用架构')}</h3>
                  <p className='story-advantage-card-desc'>
                    {t('多区域容灾与自动故障切换，保障核心业务持续在线')}
                  </p>
                  <div className='story-advantage-card-bar'>
                    <div className='story-advantage-card-bar-fill' style={{ width: '99.97%' }} />
                  </div>
                </div>

                <div className='story-advantage-card story-advantage-card-vendors'>
                  <div className='story-advantage-card-icon'>
                    <svg viewBox='0 0 32 32' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
                      <rect x='2' y='4' width='28' height='24' rx='3' />
                      <path d='M7 12h18M7 18h18' />
                      <circle cx='10' cy='8' r='1.5' fill='currentColor' stroke='none' />
                      <circle cx='15' cy='8' r='1.5' fill='currentColor' stroke='none' />
                    </svg>
                  </div>
                  <div className='story-advantage-card-stat'>
                    <span className='story-advantage-card-value'>
                      40<span className='story-advantage-card-unit'>+</span>
                    </span>
                  </div>
                  <h3 className='story-advantage-card-title'>{t('顶级模型聚合')}</h3>
                  <p className='story-advantage-card-desc'>
                    {t('聚合全球顶尖大模型供应商，一次接入即可调用所有主流 AI 能力')}
                  </p>
                  <div className='story-advantage-card-tags'>
                    <span>OpenAI</span>
                    <span>Claude</span>
                    <span>Gemini</span>
                    <span className='story-advantage-card-tag-more'>+37</span>
                  </div>
                </div>

                <div className='story-advantage-card story-advantage-card-latency'>
                  <div className='story-advantage-card-icon'>
                    <svg viewBox='0 0 32 32' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
                      <path d='M2 16h4M26 16h4M6 8l2.8 2.8M23.2 21.2L26 24M6 24l2.8-2.8M23.2 10.8L26 8' />
                      <circle cx='16' cy='16' r='5' />
                      <circle cx='16' cy='16' r='2' fill='currentColor' stroke='none' />
                    </svg>
                  </div>
                  <div className='story-advantage-card-stat'>
                    <span className='story-advantage-card-value'>
                      186<span className='story-advantage-card-unit'>ms</span>
                    </span>
                  </div>
                  <h3 className='story-advantage-card-title'>{t('超低延迟分发')}</h3>
                  <p className='story-advantage-card-desc'>
                    {t('全球边缘节点加速，端到端响应时间稳定控制在 200ms 以内')}
                  </p>
                  <div className='story-advantage-card-sparkline'>
                    {[0.6, 0.3, 0.8, 0.4, 0.5, 0.7, 0.2, 0.9, 0.4, 0.3, 0.6, 0.5].map((v, i) => (
                      <span key={i} className='story-advantage-spark-dot' style={{ opacity: v }} />
                    ))}
                  </div>
                </div>

                <div className='story-advantage-card story-advantage-card-throughput'>
                  <div className='story-advantage-card-icon'>
                    <svg viewBox='0 0 32 32' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
                      <path d='M4 24l6-8 5 5 8-12' />
                      <path d='M19 9h5v5' />
                    </svg>
                  </div>
                  <div className='story-advantage-card-stat'>
                    <span className='story-advantage-card-value'>
                      2.8<span className='story-advantage-card-unit'>k/min</span>
                    </span>
                  </div>
                  <h3 className='story-advantage-card-title'>{t('弹性吞吐扩展')}</h3>
                  <p className='story-advantage-card-desc'>
                    {t('自适应负载均衡，从容应对从原型到规模化生产的流量增长')}
                  </p>
                </div>
              </div>
            </div>
          </section>




          {/* AI Gateway Orchestration Center - 科幻版智能调度中心 */}
          <section className='story-panel story-panel-orchestration' style={{ padding: '0 0 0 0 !important' }}>
            <div className='story-panel-container story-panel-container-orchestration'>
              <div className='story-orchestration-header'>
                <Text className='story-section-kicker'>{t('智能调度')}</Text>
                <h2 className='story-section-title'>
                  {t('智能路由中枢 — 连接全球顶尖模型')}
                </h2>
                <p className='story-section-desc'>
                  {t('一次接入 MoAPI，智能路由自动选择最优模型，数据高速互传，毫秒级响应')}
                </p>
              </div>

              <div className='story-router-visual'>
                <img
                  src='/framework.png'
                  alt='MoAPI Framework'
                  className='story-router-img'
                />
              </div>
            </div>
          </section>

          <section className='story-panel story-panel-runtime' style={{ padding: '0 0 0 0 !important' }}>
            <div className='story-panel-container'>
              <div className='story-runtime-premium'>
                {/* 头部区域 */}
                <div className='story-runtime-header'>
                  <div className='story-runtime-header-left'>
                    <div className='story-runtime-live-badge'>
                      <span className='story-runtime-live-dot' />
                      <span className='story-runtime-live-text'>LIVE</span>
                    </div>
                    <h2 className='story-runtime-title'>{t('实时运行监控')}</h2>
                    <p className='story-runtime-subtitle'>{t('全链路性能指标实时追踪')}</p>
                  </div>
                  <div className='story-runtime-header-right'>
                    <div className='story-runtime-uptime'>
                      <span className='story-runtime-uptime-label'>{t('系统可用性')}</span>
                      <span className='story-runtime-uptime-value'>99.99%</span>
                    </div>
                  </div>
                </div>

                {/* 主数据网格 */}
                <div className='story-runtime-metrics-grid'>
                  {/* 总请求数 - 主卡片 */}
                  <div className='story-runtime-metric-card story-runtime-metric-primary'>
                    <div className='story-runtime-metric-glow' />
                    <div className='story-runtime-metric-content'>
                      <div className='story-runtime-metric-icon'>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                      </div>
                      <div className='story-runtime-metric-data'>
                        <span className='story-runtime-metric-value'>14,238,901</span>
                        <span className='story-runtime-metric-label'>{t('总请求数')}</span>
                      </div>
                      <div className='story-runtime-metric-trend story-runtime-trend-up'>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17l5-5 5 5M12 12V3"/>
                        </svg>
                        <span>+23.5%</span>
                      </div>
                    </div>
                    <div className='story-runtime-metric-chart'>
                      <svg viewBox="0 0 200 60" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)"/>
                            <stop offset="100%" stopColor="rgba(56, 189, 248, 0)"/>
                          </linearGradient>
                        </defs>
                        <path d="M0,50 Q20,45 40,35 T80,30 T120,25 T160,20 T200,15 L200,60 L0,60 Z" fill="url(#chartGradient)"/>
                        <path d="M0,50 Q20,45 40,35 T80,30 T120,25 T160,20 T200,15" fill="none" stroke="rgba(56, 189, 248, 0.8)" strokeWidth="2"/>
                      </svg>
                    </div>
                  </div>

                  {/* 吞吐量 */}
                  <div className='story-runtime-metric-card story-runtime-metric-secondary'>
                    <div className='story-runtime-metric-content'>
                      <div className='story-runtime-metric-icon story-runtime-icon-cyan'>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v20M2 12h20"/>
                        </svg>
                      </div>
                      <div className='story-runtime-metric-data'>
                        <span className='story-runtime-metric-value'>2,864</span>
                        <span className='story-runtime-metric-unit'>req/min</span>
                        <span className='story-runtime-metric-label'>{t('吞吐量')}</span>
                      </div>
                    </div>
                    <div className='story-runtime-metric-bar'>
                      <div className='story-runtime-metric-bar-fill' style={{width: '78%'}} />
                    </div>
                  </div>

                  {/* 成功率 */}
                  <div className='story-runtime-metric-card story-runtime-metric-secondary'>
                    <div className='story-runtime-metric-content'>
                      <div className='story-runtime-metric-icon story-runtime-icon-emerald'>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </div>
                      <div className='story-runtime-metric-data'>
                        <span className='story-runtime-metric-value'>99.97</span>
                        <span className='story-runtime-metric-unit'>%</span>
                        <span className='story-runtime-metric-label'>{t('成功率')}</span>
                      </div>
                    </div>
                    <div className='story-runtime-metric-ring'>
                      <svg viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"/>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="99.97, 100" className="story-runtime-ring-progress"/>
                      </svg>
                    </div>
                  </div>

                  {/* 平均延迟 */}
                  <div className='story-runtime-metric-card story-runtime-metric-secondary'>
                    <div className='story-runtime-metric-content'>
                      <div className='story-runtime-metric-icon story-runtime-icon-violet'>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                      </div>
                      <div className='story-runtime-metric-data'>
                        <span className='story-runtime-metric-value'>186</span>
                        <span className='story-runtime-metric-unit'>ms</span>
                        <span className='story-runtime-metric-label'>{t('平均延迟')}</span>
                      </div>
                    </div>
                    <div className='story-runtime-metric-sparkline'>
                      {[40, 35, 45, 30, 50, 35, 40, 30, 25, 35, 30, 20].map((h, i) => (
                        <div key={i} className='story-runtime-spark-bar' style={{height: `${h}%`}} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 架构层级 */}
                <div className='story-runtime-layers'>
                  <div className='story-runtime-layers-header'>
                    <span>{t('系统架构层级')}</span>
                  </div>
                  <div className='story-runtime-layers-grid'>
                    {layerItems.map((item, index) => (
                      <div key={item.title} className={`story-runtime-layer-card story-runtime-layer-${index}`}>
                        <div className='story-runtime-layer-indicator'>
                          <span className='story-runtime-layer-dot' />
                          <span className='story-runtime-layer-line' />
                        </div>
                        <div className='story-runtime-layer-content'>
                          <span className='story-runtime-layer-title'>{item.title}</span>
                          <span className='story-runtime-layer-value'>{item.value}</span>
                        </div>
                        <div className='story-runtime-layer-status'>
                          <span className='story-runtime-status-badge'>{t('正常')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          
          

          <section className='story-panel story-panel-provider'>
            <div className='story-panel-container'>
              <div className='story-provider-header'>
                <Text className='story-section-kicker'>{t('生态覆盖')}</Text>
                <h2 className='story-section-title'>
                  {t('兼容主流模型生态，持续高速扩展')}
                </h2>
                <p className='story-section-desc'>
                  {t('聚合 65+ AI 模型与平台，统一接口兼容所有主流模型')}
                </p>
              </div>
              <div className='story-provider-flow'>
                <div className='story-provider-flow-track'>
                  {[...providerItems, ...providerItems].map((item, idx) => (
                    <div className='story-provider-flow-pill' key={`${item.name}-a-${idx}`}>
                      <span className='story-provider-flow-icon'>{item.icon}</span>
                      <span className='story-provider-flow-name'>{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className='story-provider-flow-track story-provider-flow-track-reverse'>
                  {[...providerItems, ...providerItems].map((item, idx) => (
                    <div className='story-provider-flow-pill' key={`${item.name}-b-${idx}`}>
                      <span className='story-provider-flow-icon'>{item.icon}</span>
                      <span className='story-provider-flow-name'>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className='story-panel story-panel-scenario'>
            <div className='story-panel-container'>
              <div className='story-scenario-lead'>
                <Text className='story-section-kicker'>{t('业务场景')}</Text>
                <h2 className='story-section-title'>
                  {t('让 AI 业务从试验走向规模化')}
                </h2>
              </div>
              <div className='story-scenario-grid'>
                {scenarioItems.map((item) => (
                  <div className='story-scenario-card' key={item.title}>
                    <span className='story-scenario-tag'>{item.tag}</span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className='overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-screen border-none'
            />
          ) : (
            <div
              className='mt-[60px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      )}
    </div>
  );
};

// CodeTerminal 组件 - AI 编码效果
const CodeTerminal = () => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const codeRef = useRef(null);

  const codeLines = [
    { text: 'import { AIGateway } from "@ai-gateway/core";', type: 'import' },

    { text: '// Initialize AI Gateway', type: 'comment' },
    { text: 'const gateway = new AIGateway({', type: 'code' },
    { text: '  apiKey: process.env.API_KEY,', type: 'property' },
    { text: '  models: ["gpt-4", "claude-3", "gemini-pro"],', type: 'property' },
    { text: '  routing: "smart",', type: 'property' },
    { text: '  fallback: true', type: 'property' },
    { text: '});', type: 'code' },
    { text: '', type: 'empty' },
    { text: '// Intelligent routing request', type: 'comment' },
    { text: 'const response = await gateway.chat({', type: 'code' },
    { text: '  messages: [{ role: "user", content: "Hello AI" }],', type: 'property' },
    { text: '  temperature: 0.7,', type: 'property' },
    { text: '  maxTokens: 2000', type: 'property' },
    { text: '});', type: 'code' },
    { text: 'console.log("✓ Request succeeded");', type: 'success' },
    { text: 'console.log(`Latency: ${response.latency}ms`);', type: 'log' },
    { text: 'console.log(`Model: ${response.model}`);', type: 'log' },
  ];

  useEffect(() => {
    if (currentLine >= codeLines.length) {
      setIsTyping(false);
      setTimeout(() => {
        setDisplayedCode('');
        setCurrentLine(0);
        setIsTyping(true);
      }, 3000);
      return;
    }

    const line = codeLines[currentLine];
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex <= line.text.length) {
        setDisplayedCode(prev => {
          const lines = prev.split('\n');
          lines[currentLine] = line.text.slice(0, charIndex);
          return lines.join('\n');
        });
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentLine(prev => prev + 1);
        }, line.type === 'empty' ? 100 : 300);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [currentLine]);

  useEffect(() => {
    const el = codeRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [displayedCode]);

  const getLineClass = (line, index) => {
    if (line.type === 'import') return 'code-line-import';
    if (line.type === 'comment') return 'code-line-comment';
    if (line.type === 'property') return 'code-line-property';
    if (line.type === 'success') return 'code-line-success';
    if (line.type === 'log') return 'code-line-log';
    return 'code-line-code';
  };

  const renderCode = () => {
    const lines = displayedCode.split('\n');
    return lines.map((line, index) => (
      <div key={index} className="code-line">
        <span className="code-line-number">{String(index + 1).padStart(2, '0')}</span>
        <span className={`code-line-content ${getLineClass(codeLines[index], index)}`}>
          {line}
          {index === currentLine && isTyping && (
            <span className="code-cursor">|</span>
          )}
        </span>
      </div>
    ));
  };

  return (
    <div className="code-terminal">
      <div className="code-terminal-header">
        <div className="code-terminal-dots">
          <span className="code-terminal-dot red" />
          <span className="code-terminal-dot yellow" />
          <span className="code-terminal-dot green" />
        </div>
        <div className="code-terminal-title">AI Gateway CLI</div>
        <div className="code-terminal-status">
          <span className="code-terminal-pulse" />
          <span>Running</span>
        </div>
      </div>
      <div className="code-terminal-body" ref={codeRef}>
        <pre className="code-terminal-content">
          <code>{renderCode()}</code>
        </pre>
      </div>
    </div>
  );
};

// AnimatedCounter 组件 - 数字滚动效果
const AnimatedCounter = ({ value, suffix, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(value, increment * step);
      setDisplayValue(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  const formatValue = (val) => {
    if (value < 10) return val.toFixed(1);
    if (value < 100) return val.toFixed(2);
    return Math.round(val).toString();
  };

  return (
    <span ref={ref} className="animated-counter">
      {formatValue(displayValue)}{suffix}
    </span>
  );
};

export default Home;
