import { FieldTypeNames } from '@m-next/types';
import fieldListActivities from '../../testing/data/fieldListActivities.json';
import filterFieldList, { filterAndSplitFieldList } from './filterFieldList';

describe('filterFieldList', () => {
  it('Return null when field list is null', () => {
    let result = filterFieldList(null, [FieldTypeNames.Text, FieldTypeNames.Date]);
    expect(result).toEqual(null);

    result = filterAndSplitFieldList(null, [FieldTypeNames.Text, FieldTypeNames.Date]);
    expect(result).toEqual(null);
  });

  it('Exclude nothing with excluded types is blank', () => {
    const result = filterFieldList(fieldListActivities, []);
    expect(result).toEqual(fieldListActivities);
  });

  it('Exclude nothing when bad data passed as type', () => {
    let result = filterFieldList(fieldListActivities, ['Frog']);
    expect(result).toEqual(fieldListActivities);

    result = filterAndSplitFieldList(fieldListActivities, ['Frog']);
    expect(result).toEqual(
      fieldListActivities.map((x) => {
        if (x.type === FieldTypeNames.DateTime) {
          return { ...x, type: FieldTypeNames.Date };
        }
        return x;
      }),
    );
  });

  it('Exclude Text and DateTimw Fields', () => {
    let result = filterFieldList(fieldListActivities, [FieldTypeNames.Text, FieldTypeNames.DateTime]);
    expect(result).toEqual(
      fieldListActivities
        .filter((x) => x.type !== FieldTypeNames.Text)
        .filter((x) => x.type !== FieldTypeNames.DateTime),
    );

    result = filterAndSplitFieldList(fieldListActivities, [FieldTypeNames.Text, FieldTypeNames.DateTime]);
    expect(result).toEqual(
      fieldListActivities
        .filter((x) => x.type !== FieldTypeNames.Text)
        .filter((x) => x.type !== FieldTypeNames.DateTime),
    );
  });

  it('Split and exclude Text Fields', () => {
    const result = filterAndSplitFieldList(fieldListActivities, [FieldTypeNames.Text]);
    expect(result).toEqual(
      fieldListActivities
        .filter((x) => x.type !== FieldTypeNames.Text)
        .map((x) => {
          if (x.type === FieldTypeNames.DateTime) {
            return { ...x, type: FieldTypeNames.Date };
          }
          return x;
        }),
    );
  });
});
