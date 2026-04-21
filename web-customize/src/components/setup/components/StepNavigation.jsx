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
import { Button } from '@douyinfe/semi-ui';
import { IconCheckCircleStroked } from '@douyinfe/semi-icons';

/**
 * 步骤导航组件
 * 负责渲染上一步、下一步和完成按钮
 */
const StepNavigation = ({
  currentStep,
  steps,
  prev,
  next,
  onSubmit,
  loading,
  t,
}) => {
  return (
    <div className='setup-nav'>
      {/* 上一步按钮 */}
      {currentStep > 0 && (
        <Button onClick={prev} className='setup-nav-secondary'>
          {t('上一步')}
        </Button>
      )}

      <div className='flex-1' />

      {/* 下一步按钮 */}
      {currentStep < steps.length - 1 && (
        <Button type='primary' onClick={next} className='setup-nav-primary'>
          {t('下一步')}
        </Button>
      )}

      {/* 完成按钮 */}
      {currentStep === steps.length - 1 && (
        <Button
          type='primary'
          onClick={onSubmit}
          loading={loading}
          className='setup-nav-primary'
          icon={<IconCheckCircleStroked />}
        >
          {t('初始化系统')}
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
