import { Tab } from '@krgaa/react-developer-burger-ui-components';

import type { TabItem } from '@/types/tabs.ts';

import styles from './tabs.module.css';

type TabsProps = {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
};

export const Tabs = ({
  tabs,
  onChange,
  activeTab,
  className,
}: TabsProps): React.JSX.Element => {
  return (
    <nav className={className}>
      <ul className={styles.menu}>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            value={tab.value}
            active={activeTab === tab.value}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </Tab>
        ))}
      </ul>
    </nav>
  );
};
