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
import { Card, Avatar, Skeleton } from '@douyinfe/semi-ui';
import { VChart } from '@visactor/react-vchart';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StatsCards = ({
  groupedStatsData,
  loading,
  getTrendSpec,
  CARD_PROPS,
  CHART_CONFIG,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className='dash-stats-grid'>
      {groupedStatsData.map((group, idx) => (
        <Card
          key={idx}
          bordered={true}
          shadows=''
          className='dash-stat-card'
          title={group.title}
        >
          <div>
            {group.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className='dash-stat-row'
                onClick={item.onClick}
              >
                <div className='dash-stat-left'>
                  <Avatar
                    className='dash-stat-avatar'
                    size='small'
                    color={item.avatarColor}
                  >
                    {item.icon}
                  </Avatar>
                  <div>
                    <div className='dash-stat-title'>{item.title}</div>
                    <div className='dash-stat-value'>
                      <Skeleton
                        loading={loading}
                        active
                        placeholder={
                          <Skeleton.Paragraph
                            active rows={1}
                            style={{ width: '65px', height: '24px', marginTop: '4px' }}
                          />
                        }
                      >
                        {item.value}
                      </Skeleton>
                    </div>
                  </div>
                </div>
                {item.title === t('当前余额') ? (
                  <span
                    className='dash-topup-tag'
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/console/topup');
                    }}
                  >
                    {t('充值')}
                  </span>
                ) : (
                  (loading || (item.trendData && item.trendData.length > 0)) && (
                    <div className='dash-stat-trend'>
                      <VChart
                        spec={getTrendSpec(item.trendData, item.trendColor)}
                        option={CHART_CONFIG}
                      />
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
