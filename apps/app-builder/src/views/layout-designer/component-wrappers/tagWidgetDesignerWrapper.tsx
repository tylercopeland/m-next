import React, { Suspense, useState } from 'react';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { useSelector } from 'react-redux';
import { TagListControl } from '@m-next/runtime-interface';
import { selectControls } from '../../../common/services/screenLayoutSlice';
import { selectAccountName } from '../../../common/services/sessionSlice';
import { useGetTagSuggestionsQuery } from '../../../common/services/tagsApi';
import { RootState } from '../../../types/screenLayoutTypes';

interface TagList {
  others: { colour: string, name: string }[];
  suggestions: string[];
}

const TagWidget = React.lazy(() => import('@m-next/tag-widget'));
function TagWidgetDesignerWrapper({ id }: { id: string }) {
  const controlList = useSelector((state) => selectControls(state as RootState))
  const control = (controlList ? controlList[id] : null) as TagListControl | null;
  const accountName = useSelector(selectAccountName);
  const { data: tagList } = useGetTagSuggestionsQuery({ accountName: accountName || '' }) as { data: TagList };
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleChange = (value: string) => {
    // TagWidget onChange passes a comma-separated string, not an array
    // Split it into an array, filtering out empty strings
    const tagsArray = value ? value.split(',').filter(tag => tag.trim()) : [];
    setSelectedTags(tagsArray);
  }

  return (
    <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
      <TagWidget
        id={control?.id}
        tagsList={tagList ? tagList.others : []}
        caption={control?.hideCaption ? '' : control?.caption}
        disabled={control?.disabled}
        isEditable
        suggestions={tagList ? tagList.suggestions : []}
        showManageTags
        width='100%'
        onChange={handleChange}
        value={selectedTags.filter(tag => tag && tag.trim())}
      />
    </Suspense>
  );
}

export default TagWidgetDesignerWrapper;
