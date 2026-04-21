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

/**
 * 使用模式选择步骤组件
 * 提供系统使用模式的选择界面
 */
const UsageModeStep = ({
  formData,
  handleUsageModeChange,
  renderNavigationButtons,
  t,
}) => {
  const options = [
    {
      value: 'external',
      title: t('对外运营模式'),
      description: t('适用于为多个用户提供服务的场景'),
    },
    {
      value: 'self',
      title: t('自用模式'),
      description: t('适用于个人使用的场景，不需要设置模型价格'),
    },
    {
      value: 'demo',
      title: t('演示站点模式'),
      description: t('适用于展示系统功能的场景，提供基础功能演示'),
    },
  ];

  return (
    <>
      <div className='setup-step-note'>{t('请选择最符合当前业务目标的运行方式')}</div>
      <div className='setup-mode-grid'>
        {options.map((option) => (
          <button
            key={option.value}
            type='button'
            className={`setup-mode-card ${formData.usageMode === option.value ? 'active' : ''}`}
            onClick={() => handleUsageModeChange(option.value)}
          >
            <div className='setup-mode-title'>{option.title}</div>
            <div className='setup-mode-desc'>{option.description}</div>
          </button>
        ))}
      </div>
      {renderNavigationButtons && renderNavigationButtons()}
    </>
  );
};

export default UsageModeStep;
