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
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Cohere,
  Claude,
  Gemini,
  Suno,
  Minimax,
  Wenxin,
  Spark,
  Qingyan,
  DeepSeek,
  Qwen,
  Midjourney,
  Grok,
  AzureAI,
  Hunyuan,
  Xinference,
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
    { name: 'OpenAI', icon: <OpenAI size={30} /> },
    { name: 'xAI', icon: <XAI size={30} /> },
    { name: 'Claude', icon: <Claude.Color size={30} /> },
    { name: 'Gemini', icon: <Gemini.Color size={30} /> },
    { name: 'Cohere', icon: <Cohere.Color size={30} /> },
    { name: 'DeepSeek', icon: <DeepSeek.Color size={30} /> },
    { name: 'Qwen', icon: <Qwen.Color size={30} /> },
    { name: 'Zhipu', icon: <Zhipu.Color size={30} /> },
    { name: 'Moonshot', icon: <Moonshot size={30} /> },
    { name: 'Volcengine', icon: <Volcengine.Color size={30} /> },
    { name: 'Suno', icon: <Suno size={30} /> },
    { name: 'Minimax', icon: <Minimax.Color size={30} /> },
    { name: 'Wenxin', icon: <Wenxin.Color size={30} /> },
    { name: 'Spark', icon: <Spark.Color size={30} /> },
    { name: 'Qingyan', icon: <Qingyan.Color size={30} /> },
    { name: 'Midjourney', icon: <Midjourney size={30} /> },
    { name: 'Azure AI', icon: <AzureAI.Color size={30} /> },
    { name: 'Grok', icon: <Grok size={30} /> },
    { name: 'Hunyuan', icon: <Hunyuan.Color size={30} /> },
    { name: 'Xinference', icon: <Xinference.Color size={30} /> },
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
                        <span className='headline-main'>AI Gateway</span>
                        <span className='headline-sub'>统一 AI 能力入口</span>
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


          {/* AI Gateway Orchestration Center - 科幻版智能调度中心 */}
          <section className='story-panel story-panel-orchestration'>
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
                <svg
                  className='story-router-svg'
                  viewBox='0 0 800 500'
                  preserveAspectRatio='xMidYMid meet'
                >
                  <defs>
                    <filter id='routerGlow' x='-60%' y='-60%' width='220%' height='220%'>
                      <feGaussianBlur stdDeviation='3' result='blur' />
                      <feMerge><feMergeNode in='blur' /><feMergeNode in='SourceGraphic' /></feMerge>
                    </filter>
                    <filter id='routerGlowStrong' x='-80%' y='-80%' width='260%' height='260%'>
                      <feGaussianBlur stdDeviation='6' result='blur' />
                      <feMerge><feMergeNode in='blur' /><feMergeNode in='SourceGraphic' /></feMerge>
                    </filter>
                    <filter id='routerNeon' x='-100%' y='-100%' width='300%' height='300%'>
                      <feGaussianBlur stdDeviation='4' result='blur' />
                      <feMerge><feMergeNode in='blur' /><feMergeNode in='SourceGraphic' /></feMerge>
                    </filter>
                  </defs>

                  <rect x='0' y='0' width='800' height='500' fill='none' />

                  <g className='router-grid-bg' opacity={actualTheme === 'dark' ? '0.06' : '0.04'}>
                    {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(i => (
                      <line key={`rg${i}`} x1={i*50} y1='0' x2={i*50} y2='500' stroke={actualTheme === 'dark' ? '#fff' : '#000'} strokeWidth='0.3' />
                    ))}
                    {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
                      <line key={`rh${i}`} x1='0' y1={i*50} x2='800' y2={i*50} stroke={actualTheme === 'dark' ? '#fff' : '#000'} strokeWidth='0.3' />
                    ))}
                  </g>

                  <g className='router-orbital-rings'>
                    <ellipse cx='400' cy='250' rx='310' ry='130' fill='none' stroke='rgba(139,92,246,0.08)' strokeWidth='1' strokeDasharray='4 8'>
                      <animateTransform attributeName='transform' type='rotate' from='0 400 250' to='360 400 250' dur='40s' repeatCount='indefinite' />
                    </ellipse>
                    <ellipse cx='400' cy='250' rx='220' ry='95' fill='none' stroke='rgba(245,158,11,0.08)' strokeWidth='1' strokeDasharray='6 10'>
                      <animateTransform attributeName='transform' type='rotate' from='0 400 250' to='-360 400 250' dur='30s' repeatCount='indefinite' />
                    </ellipse>
                    <circle cx='400' cy='250' r='145' fill='none' stroke='rgba(16,185,129,0.06)' strokeWidth='0.8' strokeDasharray='3 7'>
                      <animateTransform attributeName='transform' type='rotate' from='0 400 250' to='360 400 250' dur='25s' repeatCount='indefinite' />
                    </circle>
                  </g>
                  
                  <g className='router-arcs' opacity='0.35'>
                    <path d='M400,250 Q430,130 520,95' fill='none' stroke='#8b5cf6' strokeWidth='1.2' strokeDasharray='5 4'>
                      <animate attributeName='stroke-dashoffset' from='0' to='-18' dur='1.6s' repeatCount='indefinite' />
                    </path>
                    <path d='M400,250 Q370,130 280,95' fill='none' stroke='#8b5cf6' strokeWidth='1.2' strokeDasharray='5 4'>
                      <animate attributeName='stroke-dashoffset' from='0' to='-18' dur='1.8s' repeatCount='indefinite' />
                    </path>
                    <path d='M400,250 Q530,210 610,200' fill='none' stroke='#f59e0b' strokeWidth='1.2' strokeDasharray='5 4'>
                      <animate attributeName='stroke-dashoffset' from='0' to='-18' dur='1.5s' repeatCount='indefinite' />
                    </path>
                    <path d='M400,250 Q270,210 190,200' fill='none' stroke='#ec4899' strokeWidth='1.2' strokeDasharray='5 4'>
                      <animate attributeName='stroke-dashoffset' from='0' to='-18' dur='1.9s' repeatCount='indefinite' />
                    </path>
                    <path d='M400,250 Q470,340 540,370' fill='none' stroke='#14b8a6' strokeWidth='1.2' strokeDasharray='5 4'>
                      <animate attributeName='stroke-dashoffset' from='0' to='-18' dur='2s' repeatCount='indefinite' />
                    </path>
                    <path d='M400,250 Q330,340 260,370' fill='none' stroke='#f43f5e' strokeWidth='1.2' strokeDasharray='5 4'>
                      <animate attributeName='stroke-dashoffset' from='0' to='-18' dur='1.7s' repeatCount='indefinite' />
                    </path>
                    <path d='M400,250 Q520,130 610,110' fill='none' stroke='#a78bfa' strokeWidth='1.0' strokeDasharray='4 5'>
                      <animate attributeName='stroke-dashoffset' from='0' to='-17' dur='2.1s' repeatCount='indefinite' />
                    </path>
                    <path d='M400,250 Q280,130 190,110' fill='none' stroke='#06b6d4' strokeWidth='1.0' strokeDasharray='4 5'>
                      <animate attributeName='stroke-dashoffset' from='0' to='-17' dur='2.2s' repeatCount='indefinite' />
                    </path>
                  </g>

                  <g className='router-particles' filter='url(#routerGlow)'>
                    {[
                      ['M400,250 Q430,130 520,95','#8b5cf6','1.6s','0s'],
                      ['M400,250 Q370,130 280,95','#8b5cf6','1.8s','0.3s'],
                      ['M400,250 Q530,210 610,200','#f59e0b','1.5s','0.6s'],
                      ['M400,250 Q270,210 190,200','#ec4899','1.9s','0.4s'],
                      ['M400,250 Q470,340 540,370','#14b8a6','2s','0.7s'],
                      ['M400,250 Q330,340 260,370','#f43f5e','1.7s','0.2s'],
                      ['M400,250 Q520,130 610,110','#a78bfa','2.1s','0.5s'],
                      ['M400,250 Q280,130 190,110','#06b6d4','2.2s','0.8s'],
                    ].map(([path, color, dur, begin], i) => (
                      <circle key={`rp${i}`} r='3' fill={color}>
                        <animateMotion dur={dur} begin={begin} repeatCount='indefinite' path={path} />
                        <animate attributeName='opacity' values='1;0.2;1' dur={dur} begin={begin} repeatCount='indefinite' />
                      </circle>
                    ))}
                  </g>

                  <g className='router-hub'>
                    <circle cx='400' cy='250' r='55' fill='none' stroke='rgba(245,158,11,0.15)' strokeWidth='1.5'>
                      <animate attributeName='r' values='55;70;55' dur='2s' repeatCount='indefinite' />
                      <animate attributeName='opacity' values='0.15;0.02;0.15' dur='2s' repeatCount='indefinite' />
                    </circle>
                    <circle cx='400' cy='250' r='40' fill='none' stroke='rgba(245,158,11,0.25)' strokeWidth='1'>
                      <animate attributeName='r' values='40;48;40' dur='2s' begin='0.4s' repeatCount='indefinite' />
                      <animate attributeName='opacity' values='0.25;0.05;0.25' dur='2s' begin='0.4s' repeatCount='indefinite' />
                    </circle>
                    <circle cx='400' cy='250' r='24' fill='none' stroke='rgba(139,92,246,0.3)' strokeWidth='2' filter='url(#routerNeon)'>
                      <animate attributeName='r' values='24;28;24' dur='1.5s' repeatCount='indefinite' />
                    </circle>
                    <circle cx='400' cy='250' r='8' fill='#f59e0b' filter='url(#routerGlowStrong)'>
                      <animate attributeName='opacity' values='1;0.5;1' dur='1.2s' repeatCount='indefinite' />
                    </circle>
                  </g>

                  <g className='router-hub-label' fill={actualTheme === 'dark' ? '#f8fafc' : '#1e293b'} textAnchor='middle' fontFamily='system-ui'>
                    <text x='400' y='242' fontSize='11' fontWeight='700' letterSpacing='0.12em' fill={actualTheme === 'dark' ? '#a78bfa' : '#8b5cf6'}>MoAPI</text>
                    <text x='400' y='257' fontSize='9' fontWeight='500' fill={actualTheme === 'dark' ? 'rgba(248,250,252,0.5)' : 'rgba(30,41,59,0.5)'}>Router</text>
                  </g>

                  <g className='router-model-nodes' filter='url(#routerGlow)'>
                    <g className='router-node' transform='translate(520,95)'>
                      <rect x='-42' y='-16' width='84' height='32' rx='6' fill={actualTheme === 'dark' ? 'rgba(26,26,26,0.9)' : 'rgba(255,255,255,0.9)'} stroke='#8b5cf6' strokeWidth='1.2' />
                      <text x='0' y='4' textAnchor='middle' fontSize='12' fontWeight='700' fill={actualTheme === 'dark' ? '#a78bfa' : '#7c3aed'} fontFamily='system-ui'>OpenAI</text>
                    </g>
                    <g className='router-node' transform='translate(280,95)'>
                      <rect x='-42' y='-16' width='84' height='32' rx='6' fill={actualTheme === 'dark' ? 'rgba(26,26,26,0.9)' : 'rgba(255,255,255,0.9)'} stroke='#8b5cf6' strokeWidth='1.2' />
                      <text x='0' y='4' textAnchor='middle' fontSize='12' fontWeight='700' fill={actualTheme === 'dark' ? '#a78bfa' : '#7c3aed'} fontFamily='system-ui'>Claude</text>
                    </g>
                    <g className='router-node' transform='translate(610,200)'>
                      <rect x='-42' y='-16' width='84' height='32' rx='6' fill={actualTheme === 'dark' ? 'rgba(26,26,26,0.9)' : 'rgba(255,255,255,0.9)'} stroke='#f59e0b' strokeWidth='1.2' />
                      <text x='0' y='4' textAnchor='middle' fontSize='12' fontWeight='700' fill={actualTheme === 'dark' ? '#fbbf24' : '#d97706'} fontFamily='system-ui'>Gemini</text>
                    </g>
                    <g className='router-node' transform='translate(190,200)'>
                      <rect x='-50' y='-16' width='100' height='32' rx='6' fill={actualTheme === 'dark' ? 'rgba(26,26,26,0.9)' : 'rgba(255,255,255,0.9)'} stroke='#ec4899' strokeWidth='1.2' />
                      <text x='0' y='4' textAnchor='middle' fontSize='12' fontWeight='700' fill={actualTheme === 'dark' ? '#f472b6' : '#db2777'} fontFamily='system-ui'>DeepSeek</text>
                    </g>
                    <g className='router-node' transform='translate(540,370)'>
                      <rect x='-40' y='-16' width='80' height='32' rx='6' fill={actualTheme === 'dark' ? 'rgba(26,26,26,0.9)' : 'rgba(255,255,255,0.9)'} stroke='#14b8a6' strokeWidth='1.2' />
                      <text x='0' y='4' textAnchor='middle' fontSize='12' fontWeight='700' fill={actualTheme === 'dark' ? '#2dd4bf' : '#0d9488'} fontFamily='system-ui'>Qwen</text>
                    </g>
                    <g className='router-node' transform='translate(260,370)'>
                      <rect x='-44' y='-16' width='88' height='32' rx='6' fill={actualTheme === 'dark' ? 'rgba(26,26,26,0.9)' : 'rgba(255,255,255,0.9)'} stroke='#f43f5e' strokeWidth='1.2' />
                      <text x='0' y='4' textAnchor='middle' fontSize='12' fontWeight='700' fill={actualTheme === 'dark' ? '#fb7185' : '#e11d48'} fontFamily='system-ui'>Mistral</text>
                    </g>
                    <g className='router-node' transform='translate(610,110)'>
                      <rect x='-42' y='-16' width='84' height='32' rx='6' fill={actualTheme === 'dark' ? 'rgba(26,26,26,0.9)' : 'rgba(255,255,255,0.9)'} stroke='#a78bfa' strokeWidth='1.2' />
                      <text x='0' y='4' textAnchor='middle' fontSize='12' fontWeight='700' fill={actualTheme === 'dark' ? '#c4b5fd' : '#7c3aed'} fontFamily='system-ui'>Cohere</text>
                    </g>
                    <g className='router-node' transform='translate(190,110)'>
                      <rect x='-38' y='-16' width='76' height='32' rx='6' fill={actualTheme === 'dark' ? 'rgba(26,26,26,0.9)' : 'rgba(255,255,255,0.9)'} stroke='#06b6d4' strokeWidth='1.2' />
                      <text x='0' y='4' textAnchor='middle' fontSize='12' fontWeight='700' fill={actualTheme === 'dark' ? '#22d3ee' : '#0891b2'} fontFamily='system-ui'>Grok</text>
                    </g>
                  </g>

                  <g className='router-stats' opacity='0.8'>
                    <g transform='translate(680,45)'>
                      <rect x='0' y='0' width='105' height='42' rx='6' fill={actualTheme === 'dark' ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.8)'} stroke='rgba(139,92,246,0.2)' strokeWidth='0.8' />
                      <text x='52' y='16' textAnchor='middle' fontSize='15' fontWeight='800' fill={actualTheme === 'dark' ? '#a78bfa' : '#8b5cf6'} fontFamily='system-ui'>40+</text>
                      <text x='52' y='33' textAnchor='middle' fontSize='9' fill={actualTheme === 'dark' ? 'rgba(248,250,252,0.5)' : 'rgba(30,41,59,0.5)'} fontFamily='system-ui'>Models Connected</text>
                    </g>
                    <g transform='translate(680,100)'>
                      <rect x='0' y='0' width='105' height='42' rx='6' fill={actualTheme === 'dark' ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.8)'} stroke='rgba(16,185,129,0.2)' strokeWidth='0.8' />
                      <text x='52' y='16' textAnchor='middle' fontSize='15' fontWeight='800' fill={actualTheme === 'dark' ? '#a78bfa' : '#8b5cf6'} fontFamily='system-ui'>99.97%</text>
                      <text x='52' y='33' textAnchor='middle' fontSize='9' fill={actualTheme === 'dark' ? 'rgba(248,250,252,0.5)' : 'rgba(30,41,59,0.5)'} fontFamily='system-ui'>Route Accuracy</text>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </section>

          <section className='story-panel story-panel-runtime'>
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
                  {t('聚合 40+ AI 供应商，统一接口兼容所有主流模型')}
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

    { text: '// 初始化 AI 网关', type: 'comment' },
    { text: 'const gateway = new AIGateway({', type: 'code' },
    { text: '  apiKey: process.env.API_KEY,', type: 'property' },
    { text: '  models: ["gpt-4", "claude-3", "gemini-pro"],', type: 'property' },
    { text: '  routing: "smart",', type: 'property' },
    { text: '  fallback: true', type: 'property' },
    { text: '});', type: 'code' },
    { text: '', type: 'empty' },
    { text: '// 智能路由请求', type: 'comment' },
    { text: 'const response = await gateway.chat({', type: 'code' },
    { text: '  messages: [{ role: "user", content: "Hello AI" }],', type: 'property' },
    { text: '  temperature: 0.7,', type: 'property' },
    { text: '  maxTokens: 2000', type: 'property' },
    { text: '});', type: 'code' },
    { text: 'console.log("✓ 请求成功");', type: 'success' },
    { text: 'console.log(`延迟: ${response.latency}ms`);', type: 'log' },
    { text: 'console.log(`模型: ${response.model}`);', type: 'log' },
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
