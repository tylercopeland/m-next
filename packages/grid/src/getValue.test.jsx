import getValue from './getValue';

describe('getValue', () => {
  const data = [
    { id: 1, name: 'John', address: { city: 'New York' } },
    { id: 2, name: 'Jane', address: { city: 'Los Angeles' } },
    { id: 3, name: 'Doe', address: { city: 'Chicago' } },
  ];

  it('should return the value for a given key', () => {
    expect(getValue(data, 0, 'name')).toBe('John');
    expect(getValue(data, 1, 'name')).toBe('Jane');
    expect(getValue(data, 2, 'name')).toBe('Doe');
  });

  it('should return the value for a nested key', () => {
    expect(getValue(data, 0, 'address', 'city')).toBe('New York');
    expect(getValue(data, 1, 'address', 'city')).toBe('Los Angeles');
    expect(getValue(data, 2, 'address', 'city')).toBe('Chicago');
  });

  it('should return an empty string if the key does not exist', () => {
    expect(getValue(data, 0, 'age')).toBe('');
    expect(getValue(data, 1, 'age')).toBe('');
    expect(getValue(data, 2, 'age')).toBe('');
  });

  it('should return an empty string if the nested key does not exist', () => {
    expect(getValue(data, 0, 'address', 'street')).toBe('');
    expect(getValue(data, 1, 'address', 'street')).toBe('');
    expect(getValue(data, 2, 'address', 'street')).toBe('');
  });

  it('should return an empty string if the index is out of bounds', () => {
    expect(getValue(data, 3, 'name')).toBe('');
    expect(getValue(data, -1, 'name')).toBe('');
  });

  it('should return an empty string if the key is null', () => {
    expect(getValue(data, 0, null)).toBe('');
  });
});
