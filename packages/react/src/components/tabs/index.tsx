import { FC, ReactElement, useEffect, useState } from 'react';

import { StyledTabItem, StyledTabWrapper } from './styles';

export interface Tab {
  title: string | ReactElement;
  id: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab?: Tab;
  onTabChange: (tab: Tab) => void;
}

const Tabs: FC<TabsProps> = ({ tabs, activeTab = tabs[0], onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    onTabChange(tab);
  };

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);
  return (
    <StyledTabWrapper>
      {tabs.map((tab) => (
        <StyledTabItem
          disabled={tab.disabled}
          key={tab.id}
          active={currentTab.id === tab.id}
          onClick={() => !tab.disabled && handleTabChange(tab)}
        >
          <span>{tab.title}</span>
        </StyledTabItem>
      ))}
    </StyledTabWrapper>
  );
};

export default Tabs;
