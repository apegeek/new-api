import React, { useEffect, useState } from 'react';
import { API, showError } from '../../helpers';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import './style.css';

const teamMembers = [
  { role: '首席架构师', count: 2, desc: '十年以上分布式系统经验，主导核心架构设计' },
  { role: '高级研发工程师', count: 8, desc: '精通 Go / Python / TypeScript，专注 AI 基础设施' },
  { role: '算法工程师', count: 4, desc: '深耕 NLP / CV / 多模态，模型微调与优化' },
  { role: 'DevOps 工程师', count: 3, desc: 'Kubernetes 集群运维，CI/CD 自动化流水线' },
  { role: '安全工程师', count: 2, desc: '渗透测试、安全审计、零信任架构落地' },
  { role: '产品与设计', count: 3, desc: '用户体验研究、交互设计、数据可视化' },
];

const capabilities = [
  {
    title: 'API 聚合网关',
    icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    desc: '统一接入 40+ AI 模型供应商，OpenAI / Claude / Gemini 协议全兼容，智能路由毫秒级分发',
    tags: ['RESTful', 'gRPC', 'WebSocket', 'Streaming'],
  },
  {
    title: '智能 Agent 开发',
    icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z',
    desc: '多 Agent 协作框架，工具链编排，RAG 知识库集成，自定义插件扩展',
    tags: ['LangChain', 'AutoGPT', 'RAG', 'Function Call'],
  },
  {
    title: '企业级运维支持',
    icon: 'M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4zm16 4H4V6h16v2z',
    desc: '7×24 监控告警，全链路追踪，自动扩缩容，多区域容灾部署',
    tags: ['Prometheus', 'Grafana', 'ELK', 'PagerDuty'],
  },
  {
    title: '模型微调与训练',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0',
    desc: 'LoRA / QLoRA 高效微调，私有化部署，领域知识注入，模型量化与推理加速',
    tags: ['LoRA', 'vLLM', 'Ollama', 'GGUF'],
  },
  {
    title: '安全合规审计',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    desc: '数据加密传输，角色权限控制，审计日志追踪，GDPR / SOC2 合规',
    tags: ['AES-256', 'RBAC', 'OAuth 2.0', 'Zero Trust'],
  },
  {
    title: '定制化开发',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    desc: '私有协议适配，定制 UI/UX，工作流引擎，企业内部系统深度集成',
    tags: ['API 定制', '白标部署', 'SSO 集成', '私有化'],
  },
];

const About = () => {
  const { t } = useTranslation();
  const [about, setAbout] = useState('');
  const [aboutLoaded, setAboutLoaded] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const displayAbout = async () => {
      setAbout(localStorage.getItem('about') || '');
      const res = await API.get('/api/about');
      const { success, message, data } = res.data;
      if (success) {
        let aboutContent = data;
        if (!data.startsWith('https://')) {
          aboutContent = marked.parse(data);
        }
        setAbout(aboutContent);
        localStorage.setItem('about', aboutContent);
      } else {
        showError(message);
      }
      setAboutLoaded(true);
    };
    displayAbout();
  }, []);

  const scrollToTeam = () => {
    document.getElementById('about-team')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="about-page">

      <section className="about-hero">
        <div className="about-container">
          <div className="about-hero-badge">
            QuantumNous
          </div>
          <h1 className="about-hero-title">
            <span className="about-hero-title-main">构建 AI 基础设施的</span>
            <span className="about-hero-title-accent">下一代平台</span>
          </h1>
          <p className="about-hero-sub">
            我们是一支由架构师、算法专家和全栈工程师组成的精锐团队，
            致力于为企业提供高性能、高可用的 AI API 基础设施与定制化解决方案。
          </p>
          <div className="about-hero-stats">
            <div className="about-hero-stat">
              <span className="about-hero-stat-value">22<span className="about-hero-stat-suffix">+</span></span>
              <span className="about-hero-stat-label">核心团队成员</span>
            </div>
            <div className="about-hero-stat-divider" />
            <div className="about-hero-stat">
              <span className="about-hero-stat-value">5<span className="about-hero-stat-suffix">年</span></span>
              <span className="about-hero-stat-label">AI 基础设施深耕</span>
            </div>
            <div className="about-hero-stat-divider" />
            <div className="about-hero-stat">
              <span className="about-hero-stat-value">40<span className="about-hero-stat-suffix">+</span></span>
              <span className="about-hero-stat-label">模型供应商接入</span>
            </div>
            <div className="about-hero-stat-divider" />
            <div className="about-hero-stat">
              <span className="about-hero-stat-value">99.99<span className="about-hero-stat-suffix">%</span></span>
              <span className="about-hero-stat-label">平台可用性</span>
            </div>
          </div>
          <button type="button" className="about-hero-scroll" onClick={scrollToTeam}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
            了解我们的团队
          </button>
        </div>
      </section>

      <section className="about-team" id="about-team">
        <div className="about-container">
          <div className="about-section-header">
            <span className="about-section-kicker">核心团队</span>
            <h2 className="about-section-title">汇聚顶尖人才</h2>
            <p className="about-section-desc">
              从底层基础设施到上层应用，我们拥有完整的技术栈覆盖能力
            </p>
          </div>
          <div className="about-team-grid">
            {teamMembers.map((member) => (
              <div className="about-team-card" key={member.role}>
                <div className="about-team-card-top">
                  <span className="about-team-card-count">{member.count}</span>
                  <span className="about-team-card-unit">人</span>
                </div>
                <h3 className="about-team-card-role">{member.role}</h3>
                <p className="about-team-card-desc">{member.desc}</p>
              </div>
            ))}
          </div>
          <div className="about-team-chart">
            <div className="about-team-chart-bar">
              <div className="about-team-chart-label">研发</div>
              <div className="about-team-chart-track">
                <div className="about-team-chart-fill" style={{ width: '55%' }} />
              </div>
              <div className="about-team-chart-pct">55%</div>
            </div>
            <div className="about-team-chart-bar">
              <div className="about-team-chart-label">算法</div>
              <div className="about-team-chart-track">
                <div className="about-team-chart-fill" style={{ width: '18%' }} />
              </div>
              <div className="about-team-chart-pct">18%</div>
            </div>
            <div className="about-team-chart-bar">
              <div className="about-team-chart-label">运维</div>
              <div className="about-team-chart-track">
                <div className="about-team-chart-fill" style={{ width: '14%' }} />
              </div>
              <div className="about-team-chart-pct">14%</div>
            </div>
            <div className="about-team-chart-bar">
              <div className="about-team-chart-label">产品</div>
              <div className="about-team-chart-track">
                <div className="about-team-chart-fill" style={{ width: '13%' }} />
              </div>
              <div className="about-team-chart-pct">13%</div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-capabilities">
        <div className="about-container">
          <div className="about-section-header">
            <span className="about-section-kicker">AI 技术能力</span>
            <h2 className="about-section-title">全方位 AI 工程化服务</h2>
            <p className="about-section-desc">
              从模型接入到应用落地，覆盖 AI 基础设施全生命周期
            </p>
          </div>
          <div className="about-capabilities-grid">
            {capabilities.map((cap) => (
              <div className="about-cap-card" key={cap.title}>
                <div className="about-cap-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={cap.icon} />
                  </svg>
                </div>
                <h3 className="about-cap-card-title">{cap.title}</h3>
                <p className="about-cap-card-desc">{cap.desc}</p>
                <div className="about-cap-card-tags">
                  {cap.tags.map((tag) => (
                    <span className="about-cap-card-tag" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {aboutLoaded && about && (
        <section className="about-custom">
          <div className="about-container">
            {about.startsWith('https://') ? (
              <iframe src={about} title="about" style={{ width: '100%', height: '100vh', border: 'none' }} />
            ) : (
              <div className="about-custom-content" dangerouslySetInnerHTML={{ __html: about }} />
            )}
          </div>
        </section>
      )}

      
    </div>
  );
};

export default About;
