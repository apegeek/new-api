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

import React, { useState, useMemo, memo } from 'react';
import { Input, Button, Select } from '@douyinfe/semi-ui';
import { IconSearch, IconChevronDown, IconChevronUp } from '@douyinfe/semi-icons';
import PricingFilterModal from '../../modal/PricingFilterModal';
import { getLobeHubIcon } from '../../../../../helpers';

const FilterRow = ({ label, options, activeValue, onChange, type, t }) => {
  const [expanded, setExpanded] = useState(false);
  
  // If options are too many, we might want to hide some when not expanded
  // But for now, we can just use CSS to limit height and show/hide
  
  return (
    <div className={`pricing-filter-row ${expanded ? 'is-expanded' : ''}`}>
      <div className='pricing-filter-label'>{label}</div>
      <div className='pricing-filter-options'>
        {options.map(opt => (
          <button
            key={opt.key}
            className={`pricing-filter-chip ${activeValue === opt.key ? 'is-active' : ''}`}
            onClick={() => onChange(opt.key)}
          >
            {opt.icon && (
              <span className='pricing-filter-chip-icon'>
                {getLobeHubIcon(opt.icon, 14)}
              </span>
            )}
            <span className='pricing-filter-chip-text'>{opt.label}</span>
          </button>
        ))}
      </div>
      {options.length > 8 && (
        <div className='pricing-filter-expand' onClick={() => setExpanded(!expanded)}>
          <span>{expanded ? t('收起') : t('展开')}</span>
          {expanded ? <IconChevronUp size="small" /> : <IconChevronDown size="small" />}
        </div>
      )}
    </div>
  );
};

const PricingTopSection = memo(({
  selectedRowKeys, copyText, handleChange, handleCompositionStart,
  handleCompositionEnd, isMobile, filterVendor, models, filteredModels,
  loading, searchValue, showWithRecharge, setShowWithRecharge, currency,
  setCurrency, siteDisplayType, showRatio, setShowRatio, viewMode,
  setViewMode, tokenUnit, setTokenUnit,
  filterGroup, setFilterGroup, filterQuotaType, setFilterQuotaType,
  filterEndpointType, setFilterEndpointType,
  filterTag, setFilterTag, setFilterVendor, currentPage, setCurrentPage,
  t,
}) => {
  const [showFilterModal, setShowFilterModal] = useState(false);

  const vendorOptions = useMemo(() => {
    const vendors = new Map();
    models.forEach((m) => {
      if (m.vendor_name) {
        const v = vendors.get(m.vendor_name);
        if (v) v.count++; else vendors.set(m.vendor_name, { name: m.vendor_name, icon: m.vendor_icon, count: 1 });
      }
    });
    const sorted = Array.from(vendors.values()).sort((a, b) => a.name.localeCompare(b.name));
    return [
      { key: 'all', label: t('全部供应商') },
      ...sorted.map(v => ({ key: v.name, label: v.name, icon: v.icon }))
    ];
  }, [models, t]);

  const tagOptions = useMemo(() => {
    const tabs = [{ key: 'all', label: t('全部标签') }];
    const seen = new Set();
    models.forEach(m => {
      if (m.tags) {
        m.tags.split(/[,;|]+/).forEach(tag => {
          const tStr = tag.trim();
          if (tStr && !seen.has(tStr)) {
            seen.add(tStr);
            tabs.push({ key: tStr, label: tStr });
          }
        });
      }
    });
    return tabs;
  }, [models, t]);

  const groupOptions = useMemo(() => {
    const tabs = [{ key: 'all', label: t('全部分组') }];
    const seen = new Set();
    models.forEach(m => {
      if (m.enable_groups) {
        m.enable_groups.forEach(g => {
          if (!seen.has(g)) { seen.add(g); tabs.push({ key: g, label: g }); }
        });
      }
    });
    return tabs;
  }, [models, t]);

  const quotaOptions = [
    { value: 'all', label: t('全部计费类型') },
    { value: '0', label: t('按量计费') },
    { value: '1', label: t('按次计费') },
  ];

  const handleReset = () => {
    setFilterVendor('all');
    setFilterTag('all');
    setFilterGroup('all');
    setFilterQuotaType('all');
    handleChange('');
  };

  return (
    <>
      <div className='pricing-unified-header'>
        <div className='pricing-unified-filters'>
          <FilterRow 
            label={t('供应商')} 
            options={vendorOptions} 
            activeValue={filterVendor} 
            onChange={setFilterVendor} 
            t={t} 
          />
          {tagOptions.length > 1 && (
            <FilterRow 
              label={t('特性标签')} 
              options={tagOptions} 
              activeValue={filterTag} 
              onChange={setFilterTag} 
              t={t} 
            />
          )}
          {groupOptions.length > 1 && (
            <FilterRow 
              label={t('令牌分组')} 
              options={groupOptions} 
              activeValue={filterGroup} 
              onChange={setFilterGroup} 
              t={t} 
            />
          )}
        </div>

        <div className='pricing-unified-toolbar'>
          <div className='pricing-toolbar-search'>
            <Input
              prefix={<IconSearch />}
              placeholder={t('搜索模型名称...')}
              value={searchValue}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              onChange={handleChange}
              showClear
              className='pricing-search-input-unified'
            />
          </div>
          <div className='pricing-toolbar-actions'>
            <Select 
              value={String(filterQuotaType ?? 'all')} 
              onChange={(v) => setFilterQuotaType(v === 'all' ? 'all' : Number(v))}
              optionList={quotaOptions}
              className='pricing-select-unified'
            />
            <Button onClick={handleReset} className='pricing-reset-btn'>{t('重置')}</Button>
          </div>
        </div>
      </div>

      <div className='pricing-summary-text'>
        {t('全部供应商')} {models.length} {t('个模型，当前筛选结果：')}{filteredModels.length} {t('个')}
      </div>

      {isMobile && (
        <PricingFilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          sidebarProps={{
            showWithRecharge, setShowWithRecharge, currency, setCurrency,
            showRatio, setShowRatio, viewMode, setViewMode,
            tokenUnit, setTokenUnit, filterGroup, setFilterGroup,
            handleGroupClick: setFilterGroup,
            filterQuotaType, setFilterQuotaType,
            filterEndpointType, setFilterEndpointType,
            filterVendor, setFilterVendor, filterTag, setFilterTag,
            currentPage, setCurrentPage, loading, t,
          }}
          t={t}
        />
      )}
    </>
  );
});

PricingTopSection.displayName = 'PricingTopSection';
export default PricingTopSection;
