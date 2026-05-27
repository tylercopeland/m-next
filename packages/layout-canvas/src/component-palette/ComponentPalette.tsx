import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore typescript error
import SearchInput from '@m-next/search-input';
import Container from '@m-next/container';
import SvgIcon from '@m-next/svg-icon';
import { Text, TextLine } from '@m-next/typeography';
import { colors, lightTheme } from '@m-next/styles';
import Button from '@m-next/button';
import ComponentCard from './ComponentCard';
import {
  getAllCategories,
  getComponentsByCategory,
  searchComponents,
  filterAvailableComponents,
  ComponentCategory,
  ComponentConfig,
} from './componentConfig';
import { selectBaseModel } from '../redux/selectors';
import {
  getPaletteContainerStyles,
  getSearchContainerStyles,
  categoryHeaderStyles,
  getCategoryContentStyles,
  componentGridStyles,
  emptyStateStyles,
  getHeaderContentStyle,
  headerTextStyle,
  getContentContainerStyle,
  CloseButton,
} from './ComponentPalette.styles';

// Types
interface ComponentPaletteProps {
  onComponentSelect?: (component: ComponentConfig) => void;
  onComponentDragStart?: (component: ComponentConfig, event: React.DragEvent) => void;
  selectedComponentId?: string;
  isOpen: boolean;
  onClose?: () => void;
  /** Array of widget types that are already on the screen (used to filter single-instance components) */
  existingControlTypes?: string[];
}

interface CategoryAccordionProps {
  name: string;
  description: string;
  components: ComponentConfig[];
  isOpen: boolean;
  onToggle: () => void;
  onComponentSelect?: (component: ComponentConfig) => void;
  onComponentDragStart?: (component: ComponentConfig, event: React.DragEvent) => void;
  onComponentDragEnd?: () => void;
  selectedComponentId?: string;
}

// Category Accordion Component
const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  name,
  components,
  isOpen,
  onToggle,
  onComponentSelect,
  onComponentDragStart,
  onComponentDragEnd,
}) => {
  const handleComponentClick = (component: ComponentConfig) => {
    onComponentSelect?.(component);
  };

  const handleComponentDragStart = (component: ComponentConfig, event: React.DragEvent) => {
    onComponentDragStart?.(component, event);
  };

  const handleComponentDragEnd = () => {
    onComponentDragEnd?.();
  };

  return (
    <div>
      <div style={categoryHeaderStyles} onClick={onToggle}>
        <Text bold fontSize='small'>
          {name}
        </Text>
        <SvgIcon name={isOpen ? 'chevron-up-V4' : 'chevron-down-V4'} size={12} color={lightTheme.content.subtle} />
      </div>
      <div style={getCategoryContentStyles(isOpen)}>
        <div style={componentGridStyles}>
          {components.map((component) => (
            <ComponentCard
              key={component.type}
              iconName={component.iconName}
              name={component.name}
              description={component.description}
              onClick={() => handleComponentClick(component)}
              onDragStart={(event) => handleComponentDragStart(component, event)}
              onDragEnd={handleComponentDragEnd}
              draggable
              componentType={component.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Component Palette
const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  onComponentSelect,
  onComponentDragStart,
  selectedComponentId,
  isOpen,
  onClose,
  existingControlTypes = [],
}) => {
  // Get baseModel from Redux state instead of prop drilling
  const baseModel = useSelector(selectBaseModel);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<Set<ComponentCategory>>(
    new Set([
      ComponentCategory.COMMONLY_USED,
      ComponentCategory.INPUTS,
      ComponentCategory.BUTTONS,
      ComponentCategory.DISPLAY,
      ComponentCategory.DATA_VIEWS,
      ComponentCategory.LAYOUT,
      ComponentCategory.SPECIALIZED,
      ComponentCategory.SELECTORS,
    ]), // Open "Commonly used" by default
  );

  // Track currently dragging component type to prevent premature filtering
  const [currentlyDraggingType, setCurrentlyDraggingType] = useState<string | null>(null);

  // Track scroll state for search container border
  const [isScrolled, setIsScrolled] = useState(false);

  // Get all categories from config
  const categories = getAllCategories();

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) {
      return null; // Show categories when no search
    }
    return searchComponents(searchQuery);
  }, [searchQuery]);

  const toggleCategory = (category: ComponentCategory) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Handle drag start
  const handleComponentDragStart = (component: ComponentConfig, event: React.DragEvent) => {
    // Track that we're dragging this component type
    setCurrentlyDraggingType(component.type);

    // Call parent handler
    onComponentDragStart?.(component, event);
  };

  // Handle drag end
  const handleComponentDragEnd = () => {
    // Clear the dragging type after a small delay to allow the component to complete rendering
    setTimeout(() => {
      setCurrentlyDraggingType(null);
    }, 100);
  };

  return (
    <div style={getPaletteContainerStyles(isOpen)} id='component-palette'>
      {/* Header */}
      <div style={getHeaderContentStyle()}>
        <Text style={headerTextStyle}>Components</Text>
        <CloseButton onClick={onClose}>
          <SvgIcon name='close-V4' color={colors.grey} />
        </CloseButton>
      </div>

      {/* Search */}
      <div style={getSearchContainerStyles(isScrolled)}>
        <SearchInput
          id='component-search'
          placeholder='Search components'
          value={searchQuery}
          onChange={handleSearchChange}
          suppressAutoFocus
          showClearButton
        />
      </div>

      {/* Content */}
      <Container
        scrollable
        borderless
        style={getContentContainerStyle(isOpen)}
        onScroll={(e: React.UIEvent<HTMLDivElement>) => {
          const target = e.target as HTMLDivElement;
          setIsScrolled(target.scrollTop > 0);
        }}
      >
        {/* Search Results */}
        {filteredComponents && filteredComponents.length === 0 && (
          <div style={emptyStateStyles}>
            <TextLine bold gutterBottom={8} fontSize='mediumLarge'>
              No results found
            </TextLine>
            <TextLine gutterBottom={24}>Try changing the search terms to get the results you're looking for.</TextLine>
            <Button
              id='clear-search'
              value='Clear search'
              onClick={() => setSearchQuery('')}
              isV4Design
              color={colors.blue}
              buttonStyle='ghost'
            />
          </div>
        )}

        {/* Categories */}
        {(!filteredComponents || filteredComponents.length > 0) &&
          categories.map((categoryConfig) => {
            const components = getComponentsByCategory(categoryConfig.category, filteredComponents || []);
            // Filter out single-instance components that already exist on the screen
            // BUT keep the currently dragging component visible until drag completes
            const typesToFilter = existingControlTypes.filter((type) => type !== currentlyDraggingType);
            const availableComponents = filterAvailableComponents(components, typesToFilter, baseModel ?? undefined);
            if (availableComponents.length === 0) return null;
            return (
              <CategoryAccordion
                key={categoryConfig.category}
                name={categoryConfig.name}
                description={categoryConfig.description}
                components={availableComponents}
                isOpen={openCategories.has(categoryConfig.category)}
                onToggle={() => toggleCategory(categoryConfig.category)}
                onComponentSelect={onComponentSelect}
                onComponentDragStart={handleComponentDragStart}
                onComponentDragEnd={handleComponentDragEnd}
                selectedComponentId={selectedComponentId}
              />
            );
          })}
      </Container>
    </div>
  );
};

export default ComponentPalette;
