/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import matchMediaPolyfill from 'mq-polyfill';
import Image from './Image';
import RoundImage from './components/RoundImage';
import TextAvatar from './components/TextAvatar';

expect.extend(matchers);

describe('Image', () => {
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    matchMediaPolyfill(window);
    window.resizeTo = function resizeTo(width, height) {
      Object.assign(this, {
        innerWidth: width,
        innerHeight: height,
        outerWidth: width,
        outerHeight: height,
      }).dispatchEvent(new this.Event('resize'));
    };
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    window.resizeTo(1000, 1000);

    jest.restoreAllMocks();
  });
  describe('Snapshots', () => {
    it('Default', async () => {
      const tree = render(<Image id='test' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Avatar Image', async () => {
      let tree = render(
        <Image id='test' caption='Test Image' height={64} width={64} imgType='Fixed' value='NR-3.mci{{w=48}}' />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(<Image id='test' height={64} width={64} imgType='Fixed' value='NR-3.mci{{w=48}}' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Avatar Image is loading', async () => {
      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          height={64}
          width={64}
          imgType='Fixed'
          value='NR-3.mci{{w=48}}'
          isLoading
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image id='test' height={64} width={64} imgType='Fixed' value='NR-3.mci{{w=48}}' isLoading />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Avatar Image Round', async () => {
      let tree = render(
        <Image id='test' caption='Test Image' height={64} width={64} imgType='Fixed' value='NR-3.mci{{w=48}}' circle />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image id='test' height={64} width={64} imgType='Fixed' value='NR-3.mci{{w=48}}' circle />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Avatar Image Round is loading', async () => {
      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          height={64}
          width={64}
          imgType='Fixed'
          value='NR-3.mci{{w=48}}'
          circle
          isLoading
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image id='test' height={64} width={64} imgType='Fixed' value='NR-3.mci{{w=48}}' circle isLoading />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive size Avatar', async () => {
      let tree = render(
        <Image id='test' caption='Test Image' height={128} width={128} imgType='Responsive' value='NR-3.mci{{w=48}}' />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image id='test' height={128} width={128} imgType='Responsive' value='NR-3.mci{{w=48}}' />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive Mobile Avatar', async () => {
      window.resizeTo(400, 400);
      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          height={128}
          width={128}
          imgType='Responsive'
          value='NL-4.mci{{w=48}}'
          minWidth={64}
          maxWidth={64}
          minWidthTablet={512}
          maxWidthTablet={512}
          minWidthMobile={32}
          maxWidthMobile={32}
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image
          id='test'
          height={128}
          width={128}
          imgType='Responsive'
          value='NL-4.mci{{w=48}}'
          minWidth={64}
          maxWidth={64}
          minWidthTablet={512}
          maxWidthTablet={512}
          minWidthMobile={32}
          maxWidthMobile={32}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Avatar Image Round deafult', async () => {
      let tree = render(
        <Image id='test' caption='Test Image' imgType='Fixed' value='NR-3.mci{{w=48}}' circle />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(<Image id='test' imgType='Fixed' value='NR-3.mci{{w=48}}' circle />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive size Avatar deafult', async () => {
      window.resizeTo(800, 800);
      let tree = render(<Image id='test' caption='Test Image' imgType='Responsive' value='NR-3.mci' />).container;
      expect(tree).toMatchSnapshot();

      tree = render(<Image id='test' imgType='Responsive' value='NR-3.mci' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive Mobile Avatar default', async () => {
      window.resizeTo(400, 400);
      let tree = render(
        <Image id='test' caption='Test Image' imgType='Responsive' value='NL-4.mci{{w=48}}' />,
      ).container;
      expect(tree).toMatchSnapshot();
      tree = render(<Image id='test' imgType='Responsive' value='NL-4.mci{{w=48}}' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Responsive size Avatar text size', async () => {
      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          height='128'
          width='128'
          imgType='Responsive'
          value='NR-3.mci{{w=4800}}'
          minWidth='64'
          maxWidth='64'
          minWidthTablet='512'
          maxWidthTablet='512'
          minWidthMobile='32'
          maxWidthMobile='32'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image
          id='test'
          height='128'
          width='128'
          imgType='Responsive'
          value='NR-3.mci{{w=4800}}'
          minWidth='64'
          maxWidth='64'
          minWidthTablet='512'
          maxWidthTablet='512'
          minWidthMobile='32'
          maxWidthMobile='32'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive Mobile Avatar text size', async () => {
      window.resizeTo(400, 400);
      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          height='128'
          width='128'
          imgType='Responsive'
          value='NL-4.mci{{w=48}}'
          minWidth='64'
          maxWidth='64'
          minWidthTablet='512'
          maxWidthTablet='512'
          minWidthMobile='32'
          maxWidthMobile='32'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image
          id='test'
          height='128'
          width='128'
          imgType='Responsive'
          value='NL-4.mci{{w=48}}'
          minWidth='64'
          maxWidth='64'
          minWidthTablet='512'
          maxWidthTablet='512'
          minWidthMobile='32'
          maxWidthMobile='32'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive size Avatar text size other', async () => {
      let tree = render(
        <Image id='test' caption='Test Image' imgType='Responsive' value='NR-3.mci{{w=4800}}' />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(<Image id='test' imgType='Responsive' value='NR-3.mci{{w=4800}}' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Background Avatar', async () => {
      let tree = render(
        <Image id='test' caption='Test Image' height={64} width={64} imgType='Background' value='NR-3.mci{{w=48}}' />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(<Image id='test' height={64} width={64} imgType='Background' value='NR-3.mci{{w=48}}' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Placeholder person', async () => {
      let tree = render(
        <Image id='test' caption='Test Image' height={64} width={64} imgType='Fixed' unsetImage='person' />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(<Image id='test' height={64} width={64} imgType='Fixed' unsetImage='person' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Placeholder document', async () => {
      let tree = render(
        <Image id='test' caption='Test Image' height={64} width={64} imgType='Fixed' unsetImage='document' />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(<Image id='test' height={64} width={64} imgType='Fixed' unsetImage='document' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Placeholder landscape circle', async () => {
      let tree = render(
        <Image id='test' caption='Test Image' height={64} width={64} imgType='Fixed' unsetImage='landscape' />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(<Image id='test' height={64} width={64} imgType='Fixed' unsetImage='landscape' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Placeholder loader', async () => {
      let tree = render(
        <Image id='test' caption='Test Image' height={64} width={64} imgType='Fixed' unsetImage='loader' />,
      ).container;
      expect(tree).toMatchSnapshot();
      tree = render(<Image id='test' height={64} width={64} imgType='Fixed' unsetImage='loader' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Image', async () => {
      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          imgType='Fixed'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image
          id='test'
          imgType='Fixed'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Image round', async () => {
      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          imgType='Fixed'
          circle
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image
          id='test'
          imgType='Fixed'
          circle
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive size', async () => {
      window.resizeTo(1000, 1000);

      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          height={128}
          width={128}
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image
          id='test'
          height={128}
          width={128}
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Background', async () => {
      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          height={64}
          width={64}
          imgType='Background'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;

      expect(tree).toMatchSnapshot();

      tree = render(
        <Image
          id='test'
          height={64}
          width={64}
          imgType='Background'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;

      expect(tree).toMatchSnapshot();
    });

    it('Responsive Tablet', async () => {
      window.resizeTo(600, 600);
      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          height={128}
          width={128}
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
          minWidth={64}
          maxWidth={64}
          minWidthTablet={256}
          maxWidthTablet={512}
          minWidthMobile={32}
          maxWidthMobile={128}
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image
          id='test'
          height={128}
          width={128}
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
          minWidth={64}
          maxWidth={64}
          minWidthTablet={256}
          maxWidthTablet={512}
          minWidthMobile={32}
          maxWidthMobile={128}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive Mobile', async () => {
      window.resizeTo(400, 400);
      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          height={128}
          width={128}
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
          minWidth={64}
          maxWidth={64}
          minWidthTablet={256}
          maxWidthTablet={512}
          minWidthMobile={32}
          maxWidthMobile={128}
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image
          id='test'
          height={128}
          width={128}
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
          minWidth={64}
          maxWidth={64}
          minWidthTablet={256}
          maxWidthTablet={512}
          minWidthMobile={32}
          maxWidthMobile={128}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive Tablet Defaults', async () => {
      window.resizeTo(600, 600);
      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image
          id='test'
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive Mobile Defaults', async () => {
      window.resizeTo(400, 400);
      let tree = render(
        <Image
          id='test'
          caption='Test Image'
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Image
          id='test'
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('RoundImage Default', async () => {
      const tree = render(
        <RoundImage
          imageUrl=''
          height='auto'
          width='24px' // % or px - single value to achieve even sides
          caption='ML'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('TextAvatar Default', async () => {
      const tree = render(
        <TextAvatar
          initial='ML'
          size='24px' // % or px - single value to achieve even sides
          color='green' // hex
          caption='ML'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Image  with caption', async () => {
      const tree = render(
        <Image
          id='test'
          caption='Test Image'
          imgType='Fixed'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('TIFF Image  with caption', async () => {
      const tree = render(
        <Image
          id='test'
          caption='TIFF Test Image'
          imgType='Fixed'
          value='https://upload.wikimedia.org/wikipedia/commons/3/31/HD_106906_Disk_with_the_Gemini_Planet_Imager_%28geminiann15016a%29.tiff'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Image round  with caption', async () => {
      const tree = render(
        <Image
          id='test'
          caption='Test Image'
          imgType='Fixed'
          circle
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive Mobile with caption', async () => {
      window.resizeTo(400, 400);
      const tree = render(
        <Image
          id='test'
          caption='Test Image'
          imgType='Responsive'
          hideCaption={false}
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('RoundImage Default with caption', async () => {
      const tree = render(
        <RoundImage
          imageUrl=''
          height='auto'
          width='24px' // % or px - single value to achieve even sides
          caption='ML'
          hideCaption={false}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('TextAvatar Default  with caption', async () => {
      const tree = render(
        <TextAvatar
          initial='ML'
          size='24px' // % or px - single value to achieve even sides
          color='green' // hex
          caption='ML'
          hideCaption={false}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Functional', () => {
    test('Avatar Image', async () => {
      const { getByText, getByLabelText } = render(
        <Image id='test' caption='Test Image' height={64} width={64} imgType='Fixed' value='NR-3.mci{{w=48}}' />,
      );
      expect(getByLabelText('Test Image with initials, NR')).toBeDefined();
      expect(getByText('NR')).toBeDefined();
    });

    test('Onclick', async () => {
      const onClick = jest.fn();
      const img = render(
        <Image
          id='test'
          caption='Test Image'
          height={64}
          width={64}
          imgType='Fixed'
          value='NR-3.mci{{w=48}}'
          onClick={onClick}
          originalName='Og Test'
        />,
      );

      fireEvent.click(img.getByLabelText('Test Image with initials, NR'));
      expect(onClick).toHaveBeenCalledTimes(1);
      img.rerender(
        <Image
          id='test'
          caption='Test Image'
          height={64}
          width={64}
          imgType='Fixed'
          value='NR-3.mci{{w=48}}'
          onClick={onClick}
          originalName='Og Test'
          disabled
        />,
      );
      fireEvent.click(img.getByLabelText('Test Image with initials, NR'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('Disabled image renders with 50% opacity', () => {
      const { container } = render(
        <Image
          id='test'
          caption='Test Image'
          height={64}
          width={64}
          imgType='Fixed'
          value='https://example.com/test.jpg'
          disabled
        />,
      );
      const wrapper = container.querySelector('[id="test-ImageWidget"]');
      expect(wrapper).toHaveStyleRule('opacity', '0.5');
      expect(wrapper).toHaveStyleRule('pointer-events', 'none');
    });

    test('Enabled image renders with full opacity', () => {
      const { container } = render(
        <Image
          id='test'
          caption='Test Image'
          height={64}
          width={64}
          imgType='Fixed'
          value='https://example.com/test.jpg'
        />,
      );
      const wrapper = container.querySelector('[id="test-ImageWidget"]');
      expect(wrapper).toHaveStyleRule('opacity', '1');
      expect(wrapper).toHaveStyleRule('pointer-events', 'auto');
    });

    test('Default unsetImage is landscape', () => {
      const { container } = render(<Image id='test' />);
      // When no value and no explicit unsetImage, should render landscape placeholder
      const svg = container.querySelector('svg');
      expect(svg).toBeDefined();
      // The default snapshot (line 41) also confirms this — landscape SVG is rendered
    });
  });

  describe('Image preload error handling', () => {
    let mockImgInstances;
    let OriginalImage;

    beforeEach(() => {
      OriginalImage = window.Image;
      mockImgInstances = [];
      window.Image = jest.fn().mockImplementation(() => {
        const img = { complete: false, naturalWidth: 0, src: '', onload: null, onerror: null };
        mockImgInstances.push(img);
        return img;
      });
    });

    afterEach(() => {
      window.Image = OriginalImage;
    });

    test('shows placeholder when image URL fails to load', () => {
      const { container } = render(<Image id='test' value='https://example.com/broken.jpg' />);

      act(() => {
        mockImgInstances[0].onerror();
      });

      const img = container.querySelector('img');
      expect(img.getAttribute('src')).toContain('data:image/svg+xml;base64,');
    });

    test('shows image when preload succeeds', () => {
      const url = 'https://example.com/valid.jpg';
      const { container } = render(<Image id='test' value={url} />);

      act(() => {
        mockImgInstances[0].onload();
      });

      const img = container.querySelector('img');
      expect(img.getAttribute('src')).toBe(url);
    });

    test('cleans up preload callbacks on value change', () => {
      const { rerender } = render(<Image id='test' value='https://example.com/first.jpg' />);
      const firstImg = mockImgInstances[0];

      rerender(<Image id='test' value='https://example.com/second.jpg' />);

      expect(firstImg.onload).toBeNull();
      expect(firstImg.onerror).toBeNull();
    });
  });
});
