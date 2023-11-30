import React from 'react';
import cx from 'classnames';
import { Tab } from '@writerai/ui-atoms';

import styles from './TabList.module.css';

interface TabProps {
  id: string;
  disabled?: boolean;
  label: string;
  content: React.ReactNode;
}

interface ITabList {
  tabs: TabProps[];
  className?: string;
  activeTab: string;
  onChange?: (tabId: string) => void;
}

export const TabList: React.FC<ITabList> = ({ tabs, activeTab, className, onChange }) => {
  const _activeTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.heading}>
        {tabs.map(({ id, label, disabled }) => (
          <Tab
            key={id}
            className={styles.tab}
            value={id}
            label={label}
            onClick={value => onChange?.(value)}
            active={id === activeTab}
            disabled={disabled}
          />
        ))}
      </div>

      <div className={styles.content}>{_activeTab?.content}</div>
    </div>
  );
};
