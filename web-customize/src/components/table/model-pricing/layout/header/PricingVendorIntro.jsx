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

import React, { useMemo, useCallback, memo } from 'react';
import { getLobeHubIcon } from '../../../../../helpers';
import SearchActions from './SearchActions';

const PricingVendorIntro = memo(({
  filterVendor, models = [], allModels = [], t,
  selectedRowKeys, copyText, handleChange, handleCompositionStart,
  handleCompositionEnd, isMobile, searchValue,
  showWithRecharge, setShowWithRecharge, currency, setCurrency,
  showRatio, setShowRatio, viewMode, setViewMode,
  tokenUnit, setTokenUnit, setShowFilterModal,
}) => {
  const vendorInfo = useMemo(() => {
    const vendors = new Map();
    (allModels.length > 0 ? allModels : models).forEach((m) => {
      if (m.vendor_name) {
        const v = vendors.get(m.vendor_name);
        if (v) v.count++;
        else vendors.set(m.vendor_name, { name: m.vendor_name, icon: m.vendor_icon, count: 1 });
      }
    });
    return Array.from(vendors.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allModels, models]);

  const handleVendorClick = useCallback((name) => {
    setShowFilterModal?.(true);
  }, [setShowFilterModal]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div className='pricing-vendor-title-section'>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--story-text, #1a1a2e)', letterSpacing: '-0.01em' }}>
            {filterVendor === 'all' ? t('全部模型') : filterVendor}
          </span>
          <span className='pricing-vendor-count'>
            {models.length} {t('个模型')}
          </span>
        </div>
      </div>
      <div className='pricing-vendor-banner'>
        <span
          className={`pricing-vendor-chip ${filterVendor === 'all' ? 'is-active' : ''}`}
          onClick={() => setShowFilterModal?.(true)}
        >
          {t('全部')}
        </span>
        {vendorInfo.map((v) => (
          <span
            key={v.name}
            className={`pricing-vendor-chip ${filterVendor === v.name ? 'is-active' : ''}`}
            onClick={() => handleVendorClick(v.name)}
          >
            {v.icon && getLobeHubIcon(v.icon, 14)}
            {v.name}
          </span>
        ))}
      </div>
      <div className='pricing-top-row' style={{ marginTop: 10 }}>
        <SearchActions
          selectedRowKeys={selectedRowKeys} copyText={copyText}
          handleChange={handleChange} handleCompositionStart={handleCompositionStart}
          handleCompositionEnd={handleCompositionEnd} isMobile={isMobile}
          searchValue={searchValue} setShowFilterModal={setShowFilterModal}
          showWithRecharge={showWithRecharge} setShowWithRecharge={setShowWithRecharge}
          currency={currency} setCurrency={setCurrency} showRatio={showRatio}
          setShowRatio={setShowRatio} viewMode={viewMode} setViewMode={setViewMode}
          tokenUnit={tokenUnit} setTokenUnit={setTokenUnit} t={t}
        />
      </div>
    </div>
  );
});

PricingVendorIntro.displayName = 'PricingVendorIntro';
export default PricingVendorIntro;
