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

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Input,
  ScrollList,
  ScrollItem,
} from '@douyinfe/semi-ui';
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
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  const isChinese = i18n.language.startsWith('zh');

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

      // 如果内容是 URL，则发送主题模式
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
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
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

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

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
    },
    {
      title: t('多供应商智能路由'),
      desc: t('按模型、地区、权重与健康度分发请求，自动切换可用通道。'),
    },
    {
      title: t('全链路可观测'),
      desc: t('提供请求、延迟、错误、消耗与配额视图，定位问题更高效。'),
    },
    {
      title: t('企业级安全控制'),
      desc: t('支持密钥隔离、角色权限、风控策略与审计日志，保障数据安全。'),
    },
    {
      title: t('计费与限流能力'),
      desc: t('内置额度、分组限流、模型倍率和账单能力，适配多租户运营。'),
    },
    {
      title: t('高可用与弹性扩展'),
      desc: t('支持缓存、重试和熔断策略，面对高峰流量依然稳定响应。'),
    },
  ];

  const scenarioItems = [
    {
      title: t('企业智能客服'),
      desc: t('统一管理多个模型，按成本与效果自动切换，持续优化服务质量。'),
    },
    {
      title: t('研发 Copilot 平台'),
      desc: t('为不同团队分配独立额度和密钥，实现可控、安全的 AI 开发体验。'),
    },
    {
      title: t('内容生产工作流'),
      desc: t('文本、图像与多模态统一接入，快速搭建稳定的内容生成能力。'),
    },
  ];

  return (
    <div className='w-full overflow-x-hidden home-premium-page'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className='w-full overflow-x-hidden story-home'>
          <div className='story-bg story-bg-a' />
          <div className='story-bg story-bg-b' />
          <div className='story-grid-mask' />

          <section className='story-panel story-panel-hero'>
            <div className='story-panel-container story-hero-layout'>
              <div className='story-hero-copy'>
                <div className='story-kicker'>{t('AI API GATEWAY')}</div>
                <h1 className={`story-hero-title ${isChinese ? 'story-hero-title-zh' : ''}`}>
                  {t('统一接入全球模型')}
                  <span>{t('滚动式构建你的 AI 基础设施')}</span>
                </h1>
                <p className='story-hero-desc'>
                  {t(
                    '从路由、稳定性到计费治理，统一在一个平台完成。面向企业生产环境，提供可扩展、可观测、可运营的 AI API 聚合能力。',
                  )}
                </p>

                <div className='story-endpoint-shell'>
                  <div className='story-endpoint-label'>{t('Base URL')}</div>
                  <Input
                    readonly
                    value={serverAddress}
                    className='story-endpoint-input'
                    size={isMobile ? 'default' : 'large'}
                    suffix={
                      <div className='story-endpoint-suffix'>
                        <div className='story-endpoint-path'>
                          <ScrollList
                            bodyHeight={28}
                            style={{ border: 'unset', boxShadow: 'unset' }}
                          >
                            <ScrollItem
                              mode='wheel'
                              cycled={true}
                              list={endpointItems}
                              selectedIndex={endpointIndex}
                              onSelect={({ index }) => setEndpointIndex(index)}
                            />
                          </ScrollList>
                        </div>
                        <Button
                          type='primary'
                          onClick={handleCopyBaseURL}
                          icon={<IconCopy />}
                          className='story-copy-btn'
                        />
                      </div>
                    }
                  />
                </div>

                <div className='story-action-row'>
                  <Link to='/console'>
                    <Button
                      theme='solid'
                      type='primary'
                      size={isMobile ? 'default' : 'large'}
                      className='story-btn story-btn-primary'
                      icon={<IconPlay />}
                    >
                      {t('立即接入')}
                    </Button>
                  </Link>
                  {isDemoSiteMode && statusState?.status?.version ? (
                    <Button
                      size={isMobile ? 'default' : 'large'}
                      className='story-btn story-btn-secondary'
                      icon={<IconGithubLogo />}
                      onClick={() =>
                        window.open(
                          'https://github.com/QuantumNous/new-api',
                          '_blank',
                        )
                      }
                    >
                      {statusState.status.version}
                    </Button>
                  ) : (
                    docsLink && (
                      <Button
                        size={isMobile ? 'default' : 'large'}
                        className='story-btn story-btn-secondary'
                        icon={<IconFile />}
                        onClick={() => window.open(docsLink, '_blank')}
                      >
                        {t('查看文档')}
                      </Button>
                    )
                  )}
                </div>

                <div className='story-metrics'>
                  <div className='story-metric-card'>
                    <strong>40+</strong>
                    <span>{t('模型供应商')}</span>
                  </div>
                  <div className='story-metric-card'>
                    <strong>99.9%</strong>
                    <span>{t('可用性')}</span>
                  </div>
                  <div className='story-metric-card'>
                    <strong>{'<120ms'}</strong>
                    <span>{t('网关开销')}</span>
                  </div>
                  <div className='story-metric-card'>
                    <strong>24/7</strong>
                    <span>{t('实时监控')}</span>
                  </div>
                </div>
              </div>

              <div className='story-hero-visual'>
                <div className='story-orbit-core'>
                  <span>API</span>
                </div>
                <div className='story-orbit-ring story-orbit-ring-1' />
                <div className='story-orbit-ring story-orbit-ring-2' />
                <div className='story-orbit-dot story-orbit-dot-1' />
                <div className='story-orbit-dot story-orbit-dot-2' />
                <div className='story-orbit-dot story-orbit-dot-3' />
                <div className='story-runtime-card'>
                  <h3>{t('实时运行态')}</h3>
                  <p>14,238,901 {t('总请求')}</p>
                  <p>2,864 req/min {t('吞吐')}</p>
                  <p>99.97% {t('成功率')}</p>
                  <p>186 ms {t('平均延迟')}</p>
                </div>
              </div>
            </div>
            <div className='story-scroll-tip'>{t('向下滚动，继续查看')}</div>
          </section>

          <section className='story-panel story-panel-capability'>
            <div className='story-panel-container story-capability-layout'>
              <div className='story-capability-intro'>
                <Text className='story-section-kicker'>{t('能力叙事')}</Text>
                <h2>{t('一条请求的全生命周期')}</h2>
                <p>
                  {t(
                    '从请求进入网关，到多模型智能路由，再到安全审计和成本回收，每一步都可以被追踪、优化和治理。',
                  )}
                </p>
              </div>
              <div className='story-capability-stack'>
                {featureItems.map((item, index) => (
                  <div className='story-capability-card' key={item.title}>
                    <div className='story-capability-index'>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className='story-panel story-panel-provider'>
            <div className='story-panel-container'>
              <Text className='story-section-kicker'>{t('生态覆盖')}</Text>
              <h2 className='story-section-title'>
                {t('兼容主流模型生态，持续高速扩展')}
              </h2>
              <div className='story-marquee'>
                <div className='story-marquee-track'>
                  {[...providerItems, ...providerItems].map((item, idx) => (
                    <div className='story-provider-pill' key={`${item.name}-${idx}`}>
                      <span className='story-provider-icon'>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className='story-marquee story-marquee-reverse'>
                <div className='story-marquee-track'>
                  {[...providerItems, ...providerItems].map((item, idx) => (
                    <div className='story-provider-pill' key={`${item.name}-rev-${idx}`}>
                      <span className='story-provider-icon'>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className='story-panel story-panel-scenario'>
            <div className='story-panel-container'>
              <Text className='story-section-kicker'>{t('业务场景')}</Text>
              <h2 className='story-section-title'>{t('让 AI 业务从试验走向规模化')}</h2>
              <div className='story-scenario-grid'>
                {scenarioItems.map((item) => (
                  <div className='story-scenario-card' key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className='story-panel story-panel-cta'>
            <div className='story-panel-container story-cta-wrap'>
              <h2>{t('把你的 AI 平台，搭在可持续的基础设施上')}</h2>
              <p>
                {t(
                  '统一 API 接入、智能调度、成本治理与可观测体系，让团队把精力聚焦在业务创新，而不是重复基础建设。',
                )}
              </p>
              <div className='story-action-row story-cta-actions'>
                <Link to='/console'>
                  <Button
                    type='primary'
                    size={isMobile ? 'default' : 'large'}
                    className='story-btn story-btn-primary'
                    icon={<IconPlay />}
                  >
                    {t('进入控制台')}
                  </Button>
                </Link>
                {docsLink && (
                  <Button
                    size={isMobile ? 'default' : 'large'}
                    className='story-btn story-btn-secondary'
                    icon={<IconFile />}
                    onClick={() => window.open(docsLink, '_blank')}
                  >
                    {t('阅读接入指南')}
                  </Button>
                )}
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

export default Home;
