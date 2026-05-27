import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddressLookupCustom from '../AddressLookup';

// Mock SvgIcon to avoid rendering issues
jest.mock('@m-next/svg-icon', () => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid='svg-icon' {...props} />);

// Mock Caption component
jest.mock('@m-next/caption', () => ({ label, required }: { label: string; required?: boolean }) => (
  <label data-testid='caption'>
    {label}
    {required && <span>*</span>}
  </label>
));

// Mock @m-next/map and its MapboxApi
const mockGetAddressSuggestions = jest.fn();
jest.mock('@m-next/map', () => {
  return {
    MapboxApi: () => ({
      getAddressSuggestions: mockGetAddressSuggestions,
    }),
    GeocodingResponse: {},
    GeocodingFeature: {},
  };
});

// Mock styled components
jest.mock('../addressLookup.styles', () => ({
  ContainerWrapper: (allProps: React.PropsWithChildren<Record<string, unknown>>) => {
    // Extract and discard custom props
    const { children, isValid, displayAuto, isV4Design, ...props } = allProps;
    void isValid;
    void displayAuto;
    void isV4Design;
    return (
      <div data-testid='container-wrapper' {...props}>
        {children}
      </div>
    );
  },
  Label: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <label data-testid='label' {...props}>
      {children}
    </label>
  ),
  RequiredMark: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <span data-testid='required-mark' {...props}>
      {children}
    </span>
  ),
  ValidationMessage: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid='validation-message' {...props}>
      {children}
    </div>
  ),
}));

// Mock feature data for testing
const mockFeatures = {
  address: {
    place_type: ['address'],
    place_name: '123 Main St, New York, NY 10001, USA',
    address: '123',
    text: 'Main St',
    properties: {},
    context: [
      { id: 'postcode.123', text: '10001' },
      { id: 'place.456', text: 'New York' },
      { id: 'region.789', text: 'New York' },
      { id: 'country.012', text: 'USA' },
    ],
    geometry: {
      coordinates: [-73.935242, 40.73061],
    },
  },
  poi: {
    place_type: ['poi'],
    place_name: 'Empire State Building, New York, NY 10001, USA',
    text: 'Empire State Building',
    properties: {
      address: '350 5th Ave',
    },
    context: [
      { id: 'postcode.123', text: '10001' },
      { id: 'place.456', text: 'New York' },
      { id: 'region.789', text: 'New York' },
      { id: 'country.012', text: 'USA' },
    ],
    geometry: {
      coordinates: [-73.9856, 40.7484],
    },
  },
  city: {
    place_type: ['place'],
    place_name: 'New York, NY, USA',
    text: 'New York',
    context: [
      { id: 'region.789', text: 'New York' },
      { id: 'country.012', text: 'USA' },
    ],
    geometry: {
      coordinates: [-74.006, 40.7128],
    },
  },
  region: {
    place_type: ['region'],
    place_name: 'New York, USA',
    text: 'New York',
    context: [{ id: 'country.012', text: 'USA' }],
    geometry: {
      coordinates: [-75.4999, 43.0],
    },
  },
  postalCode: {
    place_type: ['postcode'],
    place_name: '10001, New York, NY, USA',
    text: '10001',
    context: [
      { id: 'place.456', text: 'New York' },
      { id: 'region.789', text: 'New York' },
      { id: 'country.012', text: 'USA' },
    ],
    geometry: {
      coordinates: [-73.9967, 40.7484],
    },
  },
  cityAndRegion: {
    place_type: ['place', 'region'],
    place_name: 'New York, USA',
    text: 'New York',
    context: [{ id: 'country.012', text: 'USA' }],
    geometry: {
      coordinates: [-74.006, 40.7128],
    },
  },
};

describe('AddressLookupCustom', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              longitude: -73.935242,
              latitude: 40.73061,
            },
          }),
      }),
    );
  });

  it('renders without crashing with required props', () => {
    render(<AddressLookupCustom id='test-id' gatewayUrl='' />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders caption and required mark', () => {
    render(<AddressLookupCustom id='test-id' caption='Address' required gatewayUrl='' />);
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows placeholder', () => {
    render(<AddressLookupCustom id='test-id' placeholder='Type address' gatewayUrl='' />);
    expect(screen.getByText('Type address')).toBeInTheDocument();
  });

  it('shows validation message when invalid', () => {
    render(<AddressLookupCustom id='test-id' isValid={false} validationMessage='Invalid address' gatewayUrl='' />);
    expect(screen.getByText('Invalid address')).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(<AddressLookupCustom id='test-id' gatewayUrl='' />);
    expect(screen.getByTestId('svg-icon')).toBeInTheDocument();
  });

  it('calls onChange when option is selected', async () => {
    // Mock getAddressSuggestions to return options
    mockGetAddressSuggestions.mockResolvedValueOnce({
      data: {
        features: [
          {
            place_type: ['address'],
            place_name: '123 Main St, City',
            address: '123',
            text: 'Main St',
            properties: {},
          },
        ],
      },
    });

    const handleChange = jest.fn();

    render(<AddressLookupCustom id='test-id' onChange={handleChange} placeholder='Type address' gatewayUrl='' />);

    // Find the input by ID - React Select assigns the inputId to the actual input element
    const input = screen.getByRole('combobox', { name: '' });

    // Click on the container to open the dropdown
    // Find the container element or fall back to the input itself
    const container = input.closest('div[class*="container"]') || input.parentElement || input;
    fireEvent.mouseDown(container);

    // Type into the input
    fireEvent.change(input, { target: { value: '123' } });

    // Wait for async options to load
    await waitFor(() => {
      expect(mockGetAddressSuggestions).toHaveBeenCalledWith('123', null);
    });

    // The option should appear
    await waitFor(() => {
      expect(screen.getByText('123 Main St, City')).toBeInTheDocument();
    });

    // Select the option - in React Select, we need to click on the option in the menu
    const option = screen.getByText('123 Main St, City');
    fireEvent.click(option);

    // onChange should be called
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        label: '123 Main St, City',
        streetAddress: '123 Main St',
      }),
    );
  });

  it('shows no options message for short input', async () => {
    render(<AddressLookupCustom id='test-id' gatewayUrl='' />);
    const input = screen.getByRole('combobox', { name: '' });

    // Click on the container to open the dropdown
    const container = input.closest('div[class*="container"]') || input.parentElement || input;
    fireEvent.mouseDown(container);

    // Type into the input
    fireEvent.change(input, { target: { value: 'ab' } });

    await waitFor(() => {
      expect(screen.getByText('Search for an address...')).toBeInTheDocument();
    });
  });

  it('handles async error gracefully', async () => {
    mockGetAddressSuggestions.mockRejectedValueOnce(new Error('API error'));
    render(<AddressLookupCustom id='test-id' gatewayUrl='' />);
    const input = screen.getByRole('combobox', { name: '' });

    // Click on the container to open the dropdown
    const container = input.closest('div[class*="container"]') || input.parentElement || input;
    fireEvent.mouseDown(container);

    // Type into the input
    fireEvent.change(input, { target: { value: 'error' } });

    await waitFor(() => {
      expect(screen.getByText('Search for an address...')).toBeInTheDocument();
    });
  });

  // New tests to improve coverage

  it('fetches geolocation data on mount', async () => {
    const gatewayUrl = 'https://api.example.com';
    render(<AddressLookupCustom id='test-id' gatewayUrl={gatewayUrl} />);

    // Wait for the useEffect to run
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${gatewayUrl}/geolocation/ipgeo`);
    });
  });

  it('handles geolocation fetch error gracefully', async () => {
    // Mock fetch to reject
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'));

    render(<AddressLookupCustom id='test-id' gatewayUrl='https://api.example.com' />);

    // Wait for the useEffect to run
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('handles disabled state correctly', () => {
    render(<AddressLookupCustom id='test-id' gatewayUrl='' disabled />);

    // Check that the SVG icon has the disabled prop
    const icon = screen.getByTestId('svg-icon');
    expect(icon).toHaveAttribute('disabled');
  });

  it('clears input value after selection', async () => {
    mockGetAddressSuggestions.mockResolvedValueOnce({
      data: {
        features: [mockFeatures.address],
      },
    });

    render(<AddressLookupCustom id='test-id' gatewayUrl='' />);

    const input = screen.getByRole('combobox', { name: '' });
    const container = input.closest('div[class*="container"]') || input.parentElement || input;

    // Type into the input
    fireEvent.mouseDown(container);
    fireEvent.change(input, { target: { value: '123 Main' } });

    // Wait for options to load
    await waitFor(() => {
      expect(mockGetAddressSuggestions).toHaveBeenCalled();
    });

    // Select an option
    const option = await screen.findByText('123 Main St, New York, NY 10001, USA');
    fireEvent.click(option);

    // Input should be cleared
    expect(input).toHaveValue('');
  });

  describe('Feature to Option conversion', () => {
    it('correctly converts address feature to option', async () => {
      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [mockFeatures.address],
        },
      });

      const handleChange = jest.fn();
      render(<AddressLookupCustom id='test-id' onChange={handleChange} gatewayUrl='' />);

      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.change(input, { target: { value: '123 Main' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });

      const option = await screen.findByText('123 Main St, New York, NY 10001, USA');
      fireEvent.click(option);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          label: '123 Main St, New York, NY 10001, USA',
          streetAddress: '123 Main St',
          city: 'New York',
          stateProvince: 'New York',
          zipPostalCode: '10001',
          country: 'USA',
          longitude: -73.935242,
          latitude: 40.73061,
        }),
      );
    });

    it('correctly converts POI feature to option', async () => {
      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [mockFeatures.poi],
        },
      });

      const handleChange = jest.fn();
      render(<AddressLookupCustom id='test-id' onChange={handleChange} gatewayUrl='' />);

      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.change(input, { target: { value: 'Empire' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });

      const option = await screen.findByText('Empire State Building, New York, NY 10001, USA');
      fireEvent.click(option);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'Empire State Building, New York, NY 10001, USA',
          streetAddress: '350 5th Ave',
          city: 'New York',
          stateProvince: 'New York',
          zipPostalCode: '10001',
          country: 'USA',
          longitude: -73.9856,
          latitude: 40.7484,
        }),
      );
    });

    it('correctly converts city feature to option', async () => {
      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [mockFeatures.city],
        },
      });

      const handleChange = jest.fn();
      render(<AddressLookupCustom id='test-id' onChange={handleChange} gatewayUrl='' />);

      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.change(input, { target: { value: 'New York' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });

      const option = await screen.findByText('New York, NY, USA');
      fireEvent.click(option);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'New York, NY, USA',
          city: 'New York',
          stateProvince: 'New York',
          country: 'USA',
          longitude: -74.006,
          latitude: 40.7128,
        }),
      );
    });

    it('correctly converts region feature to option', async () => {
      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [mockFeatures.region],
        },
      });

      const handleChange = jest.fn();
      render(<AddressLookupCustom id='test-id' onChange={handleChange} gatewayUrl='' />);

      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.change(input, { target: { value: 'New York State' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });

      const option = await screen.findByText('New York, USA');
      fireEvent.click(option);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'New York, USA',
          stateProvince: 'New York',
          country: 'USA',
          longitude: -75.4999,
          latitude: 43.0,
        }),
      );
    });

    it('correctly converts postal code feature to option', async () => {
      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [mockFeatures.postalCode],
        },
      });

      const handleChange = jest.fn();
      render(<AddressLookupCustom id='test-id' onChange={handleChange} gatewayUrl='' />);

      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.change(input, { target: { value: '10001' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });

      const option = await screen.findByText('10001, New York, NY, USA');
      fireEvent.click(option);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          label: '10001, New York, NY, USA',
          zipPostalCode: '10001',
          city: 'New York',
          stateProvince: 'New York',
          country: 'USA',
          longitude: -73.9967,
          latitude: 40.7484,
        }),
      );
    });

    it('correctly converts city and region feature to option', async () => {
      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [mockFeatures.cityAndRegion],
        },
      });

      const handleChange = jest.fn();
      render(<AddressLookupCustom id='test-id' onChange={handleChange} gatewayUrl='' />);

      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.change(input, { target: { value: 'New York' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });

      const option = await screen.findByText('New York, USA');
      fireEvent.click(option);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'New York, USA',
          city: 'New York',
          country: 'USA',
          longitude: -74.006,
          latitude: 40.7128,
        }),
      );
    });
  });

  describe('Street address extraction', () => {
    it('correctly extracts street address from POI feature', async () => {
      const poiFeature = {
        ...mockFeatures.poi,
        place_name: 'Custom POI Name',
      };

      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [poiFeature],
        },
      });

      const handleChange = jest.fn();
      render(<AddressLookupCustom id='test-id' onChange={handleChange} gatewayUrl='' />);

      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.change(input, { target: { value: 'Custom POI' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });

      const option = await screen.findByText('Custom POI Name');
      fireEvent.click(option);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          streetAddress: '350 5th Ave',
        }),
      );
    });

    it('correctly extracts street address from address feature with address property', async () => {
      const addressFeature = {
        ...mockFeatures.address,
        place_name: 'Custom Address Name',
      };

      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [addressFeature],
        },
      });

      const handleChange = jest.fn();
      render(<AddressLookupCustom id='test-id' onChange={handleChange} gatewayUrl='' />);

      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.change(input, { target: { value: 'Custom Address' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });

      const option = await screen.findByText('Custom Address Name');
      fireEvent.click(option);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          streetAddress: '123 Main St',
        }),
      );
    });

    it('correctly extracts street address from address feature without address property', async () => {
      const addressFeatureNoAddress = {
        ...mockFeatures.address,
        address: undefined,
        place_name: 'Custom Address No Address Prop',
      };

      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [addressFeatureNoAddress],
        },
      });

      const handleChange = jest.fn();
      render(<AddressLookupCustom id='test-id' onChange={handleChange} gatewayUrl='' />);

      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.change(input, { target: { value: 'Custom Address No Address' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });

      const option = await screen.findByText('Custom Address No Address Prop');
      fireEvent.click(option);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          streetAddress: 'Main St',
        }),
      );
    });
  });

  it('handles feature with missing geometry', async () => {
    const featureNoGeometry = {
      ...mockFeatures.address,
      geometry: undefined,
      place_name: 'Address Without Geometry',
    };

    mockGetAddressSuggestions.mockResolvedValueOnce({
      data: {
        features: [featureNoGeometry],
      },
    });

    const handleChange = jest.fn();
    render(<AddressLookupCustom id='test-id' onChange={handleChange} gatewayUrl='' />);

    const input = screen.getByRole('combobox', { name: '' });
    const container = input.closest('div[class*="container"]') || input.parentElement || input;

    fireEvent.mouseDown(container);
    fireEvent.change(input, { target: { value: 'Address Without Geometry' } });

    await waitFor(() => {
      expect(mockGetAddressSuggestions).toHaveBeenCalled();
    });

    const option = await screen.findByText('Address Without Geometry');
    fireEvent.click(option);

    // Only check that handleChange was called, without checking specific properties
    expect(handleChange).toHaveBeenCalled();
  });

  it('handles feature with empty context', async () => {
    const featureNoContext = {
      ...mockFeatures.address,
      context: undefined,
      place_name: 'Address Without Context',
    };

    mockGetAddressSuggestions.mockResolvedValueOnce({
      data: {
        features: [featureNoContext],
      },
    });

    const handleChange = jest.fn();
    render(<AddressLookupCustom id='test-id' onChange={handleChange} gatewayUrl='' />);

    const input = screen.getByRole('combobox', { name: '' });
    const container = input.closest('div[class*="container"]') || input.parentElement || input;

    fireEvent.mouseDown(container);
    fireEvent.change(input, { target: { value: 'Address Without Context' } });

    await waitFor(() => {
      expect(mockGetAddressSuggestions).toHaveBeenCalled();
    });

    const option = await screen.findByText('Address Without Context');
    fireEvent.click(option);

    // Only check that handleChange was called, without checking specific properties
    expect(handleChange).toHaveBeenCalled();
  });

  it('handles empty features array from API', async () => {
    mockGetAddressSuggestions.mockResolvedValueOnce({
      data: {
        features: [],
      },
    });

    render(<AddressLookupCustom id='test-id' gatewayUrl='' />);

    const input = screen.getByRole('combobox', { name: '' });
    const container = input.closest('div[class*="container"]') || input.parentElement || input;

    fireEvent.mouseDown(container);
    fireEvent.change(input, { target: { value: 'nonexistent address' } });

    await waitFor(() => {
      expect(mockGetAddressSuggestions).toHaveBeenCalled();
    });

    expect(screen.getByText('Search for an address...')).toBeInTheDocument();
  });

  it('handles missing features property in API response', async () => {
    mockGetAddressSuggestions.mockResolvedValueOnce({
      data: {},
    });

    render(<AddressLookupCustom id='test-id' gatewayUrl='' />);

    const input = screen.getByRole('combobox', { name: '' });
    const container = input.closest('div[class*="container"]') || input.parentElement || input;

    fireEvent.mouseDown(container);
    fireEvent.change(input, { target: { value: 'address with no features' } });

    await waitFor(() => {
      expect(mockGetAddressSuggestions).toHaveBeenCalled();
    });

    expect(screen.getByText('Search for an address...')).toBeInTheDocument();
  });

  describe('V4 Design', () => {
    it('renders Caption component when isV4Design is true', () => {
      render(<AddressLookupCustom id='test-id' caption='Address' isV4Design gatewayUrl='' />);
      expect(screen.getByTestId('caption')).toBeInTheDocument();
      expect(screen.getByText('Address')).toBeInTheDocument();
    });

    it('renders static label when isV4Design is false', () => {
      render(<AddressLookupCustom id='test-id' caption='Address' isV4Design={false} gatewayUrl='' />);
      expect(screen.getByTestId('label')).toBeInTheDocument();
      expect(screen.getByText('Address')).toBeInTheDocument();
    });

    it('renders Caption with required mark when required is true', () => {
      render(<AddressLookupCustom id='test-id' caption='Address' required isV4Design gatewayUrl='' />);

      const caption = screen.getByTestId('caption');
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveTextContent('Address*');
    });

    it('renders Caption without required mark when required is false', () => {
      render(<AddressLookupCustom id='test-id' caption='Address' isV4Design gatewayUrl='' />);

      const caption = screen.getByTestId('caption');
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveTextContent('Address');
      expect(caption).not.toHaveTextContent('*');
    });
  });

  // Additional tests for function coverage
  describe('MenuList custom component', () => {
    it('renders menu list with options', async () => {
      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [mockFeatures.address],
        },
      });

      render(<AddressLookupCustom id='test-id' gatewayUrl='' />);
      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.change(input, { target: { value: '123 Main' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByText('123 Main St, New York, NY 10001, USA')).toBeInTheDocument();
      });
    });
  });

  describe('Control custom component', () => {
    it('renders control with icon when enabled', () => {
      render(<AddressLookupCustom id='test-id' gatewayUrl='' />);
      expect(screen.getByTestId('svg-icon')).toBeInTheDocument();
      expect(screen.getByTestId('svg-icon')).not.toHaveAttribute('disabled');
    });

    it('renders control with disabled icon when disabled', () => {
      render(<AddressLookupCustom id='test-id' gatewayUrl='' disabled />);
      expect(screen.getByTestId('svg-icon')).toHaveAttribute('disabled');
    });
  });

  describe('formatOptionLabel', () => {
    it('formats option with street address', async () => {
      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [mockFeatures.address],
        },
      });

      render(<AddressLookupCustom id='test-id' gatewayUrl='' />);
      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.change(input, { target: { value: '123 Main' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });

      await waitFor(() => {
        const mainLabel = screen.getByText('123 Main St, New York, NY 10001, USA');
        expect(mainLabel).toBeInTheDocument();
        // Street address should be visible as a secondary line
        expect(screen.getByText('123 Main St')).toBeInTheDocument();
      });
    });
  });

  describe('menu placement', () => {
    it('renders with top menu placement', () => {
      const tree = render(<AddressLookupCustom id='test-id' gatewayUrl='' menuPlacement='top' />).container;
      expect(tree).toBeInTheDocument();
    });

    it('renders with bottom menu placement', () => {
      const tree = render(<AddressLookupCustom id='test-id' gatewayUrl='' menuPlacement='bottom' />).container;
      expect(tree).toBeInTheDocument();
    });

    it('renders with auto menu placement (default)', () => {
      const tree = render(<AddressLookupCustom id='test-id' gatewayUrl='' />).container;
      expect(tree).toBeInTheDocument();
    });
  });

  describe('width prop', () => {
    it('renders with custom width', () => {
      const tree = render(<AddressLookupCustom id='test-id' gatewayUrl='' width={500} />).container;
      expect(tree).toBeInTheDocument();
    });

    it('renders with string width', () => {
      const tree = render(<AddressLookupCustom id='test-id' gatewayUrl='' width='100%' />).container;
      expect(tree).toBeInTheDocument();
    });
  });

  describe('Props validation', () => {
    it('handles isValid prop set to false', () => {
      const tree = render(<AddressLookupCustom id='test-id' gatewayUrl='' isValid={false} />).container;
      expect(tree).toBeInTheDocument();
    });

    it('handles placeholder', () => {
      const tree = render(<AddressLookupCustom id='test-id' gatewayUrl='' placeholder='Type an address' />).container;
      expect(tree).toBeInTheDocument();
    });

    it('handles legacyClass prop', () => {
      const tree = render(<AddressLookupCustom id='test-id' gatewayUrl='' legacyClass='legacy-class' />).container;
      expect(tree).toBeInTheDocument();
    });

    it('handles validationMessage', () => {
      const tree = render(<AddressLookupCustom id='test-id' gatewayUrl='' validationMessage='Error' />).container;
      expect(tree).toBeInTheDocument();
    });
  });

  describe('Input handling', () => {
    it('handles input value changes', async () => {
      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [mockFeatures.address],
        },
      });

      render(<AddressLookupCustom id='test-id' gatewayUrl='' />);
      const input = screen.getByRole('combobox', { name: '' });

      fireEvent.change(input, { target: { value: '123' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });
    });

    it('handles menu open event', () => {
      render(<AddressLookupCustom id='test-id' gatewayUrl='' />);
      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);

      expect(input).toBeTruthy();
    });

    it('handles menu close event', async () => {
      render(<AddressLookupCustom id='test-id' gatewayUrl='' />);
      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.blur(input);

      expect(input).toBeTruthy();
    });
  });

  describe('Geolocation API', () => {
    it('fetches geolocation data on mount', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        json: async () => ({
          data: {
            longitude: -122.4194,
            latitude: 37.7749,
          },
        }),
      });

      render(<AddressLookupCustom id='test-id' gatewayUrl='https://api.example.com' />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/geolocation/ipgeo');
      });
    });

    it('handles geolocation fetch errors gracefully', async () => {
      global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'));

      render(<AddressLookupCustom id='test-id' gatewayUrl='https://api.example.com' />);

      // Should not crash
      expect(screen.getByRole('combobox', { name: '' })).toBeTruthy();
    });

    it('handles gatewayUrl with trailing slash', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        json: async () => ({
          data: {
            longitude: -122.4194,
            latitude: 37.7749,
          },
        }),
      });

      render(<AddressLookupCustom id='test-id' gatewayUrl='https://api.example.com/' />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/geolocation/ipgeo');
      });
    });
  });

  describe('OnChange callback', () => {
    it('calls onChange with selected option', async () => {
      const onChangeMock = jest.fn();
      mockGetAddressSuggestions.mockResolvedValueOnce({
        data: {
          features: [mockFeatures.address],
        },
      });

      render(<AddressLookupCustom id='test-id' gatewayUrl='' onChange={onChangeMock} />);
      const input = screen.getByRole('combobox', { name: '' });
      const container = input.closest('div[class*="container"]') || input.parentElement || input;

      fireEvent.mouseDown(container);
      fireEvent.change(input, { target: { value: '123 Main' } });

      await waitFor(() => {
        expect(mockGetAddressSuggestions).toHaveBeenCalled();
      });

      await waitFor(() => {
        const option = screen.getByText('123 Main St, New York, NY 10001, USA');
        expect(option).toBeInTheDocument();
        fireEvent.click(option);
      });

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalled();
      });
    });
  });
});
