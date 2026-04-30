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
import { RefreshCw, Search } from 'lucide-react';
import './dashboard-premium.css';

const DashboardHeader = ({
  getGreeting,
  greetingVisible,
  showSearchModal,
  refresh,
  loading,
  t,
}) => {
  return (
    <div className='dash-header'>
      <h2
        style={{ opacity: greetingVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}
      >
        {getGreeting}
      </h2>
      <div className='dash-header-actions'>
        <Button
          theme='outline' type='tertiary'
          icon={<Search size={15} />}
          onClick={showSearchModal}
          className='dash-icon-btn'
        />
        <Button
          theme='outline' type='tertiary'
          icon={<RefreshCw size={15} />}
          onClick={refresh}
          loading={loading}
          className='dash-icon-btn'
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
