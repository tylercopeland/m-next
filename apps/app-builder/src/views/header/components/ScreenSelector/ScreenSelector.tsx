import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectNocodeAssistantSessionId } from '../../../../common/services/sessionSlice';
import SearchInput from '@m-next/search-input';
import * as s from './ScreenSelector.styles';

interface Screen {
  id: string;
  name: string;
  versions?: Array<{
    versionId: string;
    versionState: string;
  }>;
  currentVersion?: string;
}

interface ScreenSelectorProps {
  appId: string;
  screens: Screen[];
  currentScreenName: string;
  wide?: boolean;
}

const ScreenSelector: React.FC<ScreenSelectorProps> = ({ appId, screens, currentScreenName, wide }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nocodeAssistantSessionId = useSelector(selectNocodeAssistantSessionId);

  const showSearch = screens && screens.length > 10;

  const filteredScreens = useMemo(() => {
    return searchQuery ? screens?.filter((screen) => screen.name.toLowerCase().includes(searchQuery.toLowerCase())): screens;
  }, [screens, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && screens) {
      const currentIndex = filteredScreens?.findIndex((s) => s.name === currentScreenName) ?? -1;
      setFocusedIndex(currentIndex);
      if (showSearch && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    } else {
      setFocusedIndex(-1);
      setSearchQuery('');
    }
  }, [isOpen, screens, currentScreenName, showSearch, filteredScreens]);

  const getVersionId = (screen: Screen): string | null => {
    if (screen.versions && screen.versions.length > 0) {
      let version = screen.versions.find((v) => v.versionState === 'TEST');
      if (!version) {
        version = screen.versions.find(v => v.versionId === screen.currentVersion);
      }
      return version ? version.versionId : null;
    }
    return null;
  };

  const handleScreenSelect = (screen: Screen) => {
    const versionId = getVersionId(screen);
    if (versionId) {
      // Preserve sessionId query param if it exists (from Redux or URL)
      const sessionId = nocodeAssistantSessionId || searchParams.get('sessionId');
      const url = sessionId 
        ? `/${appId}/layout/${screen.id}/${versionId}?sessionId=${sessionId}`
        : `/${appId}/layout/${screen.id}/${versionId}`;
      navigate(url, { replace: true });
    }
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!filteredScreens || filteredScreens.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => (prev < filteredScreens.length - 1 ? prev + 1 : 0));
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredScreens.length - 1));
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (isOpen && focusedIndex >= 0 && filteredScreens[focusedIndex]) {
          handleScreenSelect(filteredScreens[focusedIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
    }
  };

  const currentScreenId = screens?.find((s) => s.name === currentScreenName)?.id;

  return (
    <s.DropdownContainer ref={dropdownRef}>
      <s.DropdownButton 
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        <s.ScreenName wide={wide}>{currentScreenName}</s.ScreenName>
        <s.ChevronIcon isOpen={isOpen} viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </s.ChevronIcon>
      </s.DropdownButton>
      <s.DropdownMenu isOpen={isOpen}>
        {showSearch && (
          <s.SearchContainer>
            <SearchInput id="screen-search" placeholder="Search screens" onChange={(value: string) => setSearchQuery(value)} value={searchQuery} />
          </s.SearchContainer>
        )}
        <s.MenuItemsContainer hasSearch={showSearch}>
          {filteredScreens?.map((screen, index) => (
            <s.MenuItem
              key={screen.id}
              isSelected={screen.id === currentScreenId}
              isFocused={index === focusedIndex}
              onClick={() => handleScreenSelect(screen)}
              onMouseEnter={() => setFocusedIndex(index)}
              data-testid="screen-menu-item"
            >
              {screen.name}
            </s.MenuItem>
          ))}
          {filteredScreens?.length === 0 && (
            <s.NoResults>No screens found</s.NoResults>
          )}
        </s.MenuItemsContainer>
      </s.DropdownMenu>
    </s.DropdownContainer>
  );
};

export default ScreenSelector;
