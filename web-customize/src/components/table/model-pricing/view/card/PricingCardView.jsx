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

import React from 'react';
import { Card, Checkbox, Empty, Pagination, Button, Avatar } from '@douyinfe/semi-ui';
import { Copy } from 'lucide-react';
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from '@douyinfe/semi-illustrations';
import {
  calculateModelPrice,
  formatPriceInfo,
  getLobeHubIcon,
} from '../../../../../helpers';
import PricingCardSkeleton from './PricingCardSkeleton';
import { useMinimumLoadingTime } from '../../../../../hooks/common/useMinimumLoadingTime';
import { useIsMobile } from '../../../../../hooks/common/useIsMobile';
import '../../pricing-premium.css';

const PricingCardView = ({
  filteredModels,
  loading,
  rowSelection,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  selectedGroup,
  groupRatio,
  copyText,
  setModalImageUrl,
  setIsModalOpenurl,
  currency,
  siteDisplayType,
  tokenUnit,
  displayPrice,
  showRatio,
  t,
  selectedRowKeys = [],
  setSelectedRowKeys,
  openModelDetail,
}) => {
  const showSkeleton = useMinimumLoadingTime(loading);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedModels = filteredModels.slice(
    startIndex,
    startIndex + pageSize,
  );
  const getModelKey = (model) => model.key ?? model.model_name ?? model.id;
  const isMobile = useIsMobile();

  const handleCheckboxChange = (model, checked) => {
    if (!setSelectedRowKeys) return;
    const modelKey = getModelKey(model);
    const newKeys = checked
      ? Array.from(new Set([...selectedRowKeys, modelKey]))
      : selectedRowKeys.filter((key) => key !== modelKey);
    setSelectedRowKeys(newKeys);
    rowSelection?.onChange?.(newKeys, null);
  };

  // 获取模型图标
  const getModelIcon = (model) => {
    if (model?.icon) {
      return (
        <div className='pricing-card-icon'>
          {getLobeHubIcon(model.icon, 32)}
        </div>
      );
    }
    if (model?.vendor_icon) {
      return (
        <div className='pricing-card-icon'>
          {getLobeHubIcon(model.vendor_icon, 32)}
        </div>
      );
    }
    const avatarText = (model?.model_name || '?').slice(0, 2).toUpperCase();
    return (
      <div className='pricing-card-icon'>
        <Avatar size='small' style={{ width: 32, height: 32, borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
          {avatarText}
        </Avatar>
      </div>
    );
  };

  // 显示骨架屏
  if (showSkeleton) {
    return (
      <PricingCardSkeleton
        rowSelection={!!rowSelection}
        showRatio={showRatio}
      />
    );
  }

  if (!filteredModels || filteredModels.length === 0) {
    return (
      <div className='flex justify-center items-center py-20'>
        <Empty
          image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
          darkModeImage={
            <IllustrationNoResultDark style={{ width: 150, height: 150 }} />
          }
          description={t('搜索无结果')}
        />
      </div>
    );
  }

  return (
    <div className='pricing-card-grid'>
      {paginatedModels.map((model, index) => {
        const modelKey = getModelKey(model);
        const isSelected = selectedRowKeys.includes(modelKey);
        const priceData = calculateModelPrice({
          record: model,
          selectedGroup,
          groupRatio,
          tokenUnit,
          displayPrice,
          currency,
          quotaDisplayType: siteDisplayType,
        });

        return (
          <Card
            key={modelKey || index}
            bordered={true} shadows=''
            className={`pricing-model-card ${isSelected ? 'pricing-model-card-selected' : ''}`}
            bodyStyle={{ padding: '16px' }}
            onClick={() => openModelDetail && openModelDetail(model)}
          >
            <div className='pricing-card-inner'>
              <div className='pricing-card-header'>
                <div className='pricing-card-header-left'>
                  {getModelIcon(model)}
                  <div className='pricing-card-title-wrap'>
                    <div className='pricing-card-name-row'>
                      <span className='pricing-card-name'>{model.model_name}</span>
                      <Button
                        size='small' theme='borderless' type='tertiary'
                        icon={<Copy size={14} />}
                        className='pricing-card-copy-btn'
                        onClick={(e) => { e.stopPropagation(); copyText(model.model_name); }}
                      />
                    </div>
                    <div className='pricing-card-meta'>
                      {formatPriceInfo(priceData, t, siteDisplayType)}
                    </div>
                  </div>
                </div>
                <div className='pricing-card-header-right'>
                  <span className='pricing-card-badge-new'>最新</span>
                  {rowSelection && (
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => { e.stopPropagation(); handleCheckboxChange(model, e.target.checked); }}
                      className='ml-2'
                    />
                  )}
                </div>
              </div>

              {model.description && (
                <div className='pricing-card-desc'>{model.description}</div>
              )}

              <div className='pricing-card-footer'>
                <div className='pricing-card-billing-type'>
                  {model.quota_type === 1 ? t('按次计费') : model.quota_type === 0 ? t('按 Tokens 计费') : '-'}
                </div>
                <div className='pricing-card-tags-right'>
                  {model.tags && model.tags.split(/[,;|]+/).filter(Boolean).slice(0, 3).map((tg, i) => {
                    const tagText = tg.trim();
                    // Assign different colors based on index or text length for visual variety
                    const colorClass = `pricing-tag-color-${(i % 3) + 1}`;
                    return (
                      <span key={i} className={`pricing-card-tag-custom ${colorClass}`}>{tagText}</span>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {filteredModels.length > 0 && (
        <div className='flex justify-center mt-6 py-4 border-t pricing-pagination-divider'>
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={filteredModels.length}
            showSizeChanger={true}
            pageSizeOptions={[10, 20, 50, 100]}
            size={isMobile ? 'small' : 'default'}
            showQuickJumper={isMobile}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PricingCardView;
