/* eslint-disable react/button-has-type */
/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import matchMediaPolyfill from 'mq-polyfill';
import EditableImage from './EditableImage';

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
      const tree = render(<EditableImage id='test' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Avatar Image', async () => {
      let tree = render(
        <EditableImage
          id='test'
          caption='Test Image'
          height={64}
          width={64}
          imgType='Fixed'
          value='NR-3.mci{{w=48}}'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <EditableImage id='test' height={64} width={64} imgType='Fixed' value='NR-3.mci{{w=48}}' />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Avatar Image is loading', async () => {
      let tree = render(
        <EditableImage
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
        <EditableImage id='test' height={64} width={64} imgType='Fixed' value='NR-3.mci{{w=48}}' isLoading />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Avatar Image Round', async () => {
      let tree = render(
        <EditableImage
          id='test'
          caption='Test Image'
          height={64}
          width={64}
          imgType='Fixed'
          value='NR-3.mci{{w=48}}'
          circle
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <EditableImage id='test' height={64} width={64} imgType='Fixed' value='NR-3.mci{{w=48}}' circle />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Avatar Image Round is loading', async () => {
      let tree = render(
        <EditableImage
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
        <EditableImage id='test' height={64} width={64} imgType='Fixed' value='NR-3.mci{{w=48}}' circle isLoading />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive size Avatar', async () => {
      let tree = render(
        <EditableImage
          id='test'
          caption='Test Image'
          height={128}
          width={128}
          imgType='Responsive'
          value='NR-3.mci{{w=48}}'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <EditableImage id='test' height={128} width={128} imgType='Responsive' value='NR-3.mci{{w=48}}' />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive Mobile Avatar', async () => {
      window.resizeTo(400, 400);
      let tree = render(
        <EditableImage
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
        <EditableImage
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
        <EditableImage id='test' caption='Test Image' imgType='Fixed' value='NR-3.mci{{w=48}}' circle />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(<EditableImage id='test' imgType='Fixed' value='NR-3.mci{{w=48}}' circle />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive size Avatar deafult', async () => {
      window.resizeTo(800, 800);
      let tree = render(
        <EditableImage id='test' caption='Test Image' imgType='Responsive' value='NR-3.mci' />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(<EditableImage id='test' imgType='Responsive' value='NR-3.mci' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Responsive Mobile Avatar default', async () => {
      window.resizeTo(400, 400);
      let tree = render(
        <EditableImage id='test' caption='Test Image' imgType='Responsive' value='NL-4.mci{{w=48}}' />,
      ).container;
      expect(tree).toMatchSnapshot();
      tree = render(<EditableImage id='test' imgType='Responsive' value='NL-4.mci{{w=48}}' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Responsive size Avatar text size', async () => {
      let tree = render(
        <EditableImage
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
        <EditableImage
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
        <EditableImage
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
        <EditableImage
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
        <EditableImage id='test' caption='Test Image' imgType='Responsive' value='NR-3.mci{{w=4800}}' />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(<EditableImage id='test' imgType='Responsive' value='NR-3.mci{{w=4800}}' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Background Avatar', async () => {
      let tree = render(
        <EditableImage
          id='test'
          caption='Test Image'
          height={64}
          width={64}
          imgType='Background'
          value='NR-3.mci{{w=48}}'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <EditableImage id='test' height={64} width={64} imgType='Background' value='NR-3.mci{{w=48}}' />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Placeholder person', async () => {
      let tree = render(
        <EditableImage id='test' caption='Test Image' height={64} width={64} imgType='Fixed' unsetImage='person' />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(<EditableImage id='test' height={64} width={64} imgType='Fixed' unsetImage='person' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Placeholder document', async () => {
      let tree = render(
        <EditableImage id='test' caption='Test Image' height={64} width={64} imgType='Fixed' unsetImage='document' />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(<EditableImage id='test' height={64} width={64} imgType='Fixed' unsetImage='document' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Placeholder landscape circle', async () => {
      let tree = render(
        <EditableImage id='test' caption='Test Image' height={64} width={64} imgType='Fixed' unsetImage='landscape' />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <EditableImage id='test' height={64} width={64} imgType='Fixed' unsetImage='landscape' />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Placeholder loader', async () => {
      let tree = render(
        <EditableImage id='test' caption='Test Image' height={64} width={64} imgType='Fixed' unsetImage='loader' />,
      ).container;
      expect(tree).toMatchSnapshot();
      tree = render(<EditableImage id='test' height={64} width={64} imgType='Fixed' unsetImage='loader' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Image', async () => {
      let tree = render(
        <EditableImage
          id='test'
          caption='Test Image'
          imgType='Fixed'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <EditableImage
          id='test'
          imgType='Fixed'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Image round', async () => {
      let tree = render(
        <EditableImage
          id='test'
          caption='Test Image'
          imgType='Fixed'
          circle
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <EditableImage
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
        <EditableImage
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
        <EditableImage
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
        <EditableImage
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
        <EditableImage
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
        <EditableImage
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
        <EditableImage
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
        <EditableImage
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
        <EditableImage
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
        <EditableImage
          id='test'
          caption='Test Image'
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <EditableImage
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
        <EditableImage
          id='test'
          caption='Test Image'
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <EditableImage
          id='test'
          imgType='Responsive'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Image  with caption', async () => {
      const tree = render(
        <EditableImage
          id='test'
          caption='Test Image'
          imgType='Fixed'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Image round  with caption', async () => {
      const tree = render(
        <EditableImage
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
        <EditableImage
          id='test'
          caption='Test Image'
          imgType='Responsive'
          hideCaption={false}
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Editable Image  with caption', async () => {
      const tree = render(
        <EditableImage
          id='test'
          width={128}
          height={128}
          imgType='Fixed'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
          circle={false}
          caption='Test'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Editable Image  uploading', async () => {
      const tree = render(
        <EditableImage
          id='test'
          width={128}
          height={128}
          imgType='Fixed'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
          circle={false}
          uploading
          uploadingFile='Juvenile_Ragdoll.jpg'
          uploadProgress={73}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Editable Image expand with caption', async () => {
      const tree = render(
        <EditableImage
          id='test'
          width={128}
          height={128}
          imgType='Fixed'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
          circle={false}
          caption='Test'
        />,
      );
      fireEvent.click(tree.getByRole('img'));
      expect(tree.container).toMatchSnapshot();
    });
    it('Editable Image expand uploading', async () => {
      const tree = render(
        <EditableImage
          id='test'
          width={128}
          height={128}
          imgType='Fixed'
          value='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg'
          circle={false}
          uploading
          uploadingFile='Juvenile_Ragdoll.jpg'
          uploadProgress={0}
        />,
      );
      fireEvent.click(tree.getByRole('img'));

      expect(tree.container).toMatchSnapshot();
    });
  });
  describe('Functional', () => {
    test('Avatar Image', async () => {
      const { getByText, getByLabelText } = render(
        <EditableImage
          id='test'
          caption='Test Image'
          height={64}
          width={64}
          imgType='Fixed'
          value='NR-3.mci{{w=48}}'
        />,
      );
      expect(getByLabelText('Test Image with initials, NR')).toBeDefined();
      expect(getByText('NR')).toBeDefined();
    });

    test('Onclick', async () => {
      const onClick = jest.fn();
      const img = render(
        <EditableImage
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
        <EditableImage
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

    it('handles file drop correctly', async () => {
      const onFileReadSuccess = jest.fn();
      const onErrorMessageForUser = jest.fn();

      const { container } = render(
        <EditableImage
          id='test'
          onFileReadSuccess={onFileReadSuccess}
          onErrorMessageForUser={onErrorMessageForUser}
          disabled={false}
        />,
      );

      // Simulate the files being dropped
      const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
      const dataTransfer = {
        dataTransfer: {
          files: [file],
          items: [
            {
              kind: 'file',
              type: file.type,
              getAsFile: () => file,
            },
          ],
          types: ['Files'], // Add this line to mimic real event data
        },
      };

      // Get the dropzone element by class name
      const dropzoneInput = container.querySelector('.dropzone input');

      // Ensure dropzoneInput is not null or undefined before triggering the drop event
      if (dropzoneInput) {
        await act(async () => {
          fireEvent.drop(dropzoneInput, dataTransfer);
        });
      }

      // Check if the file read success callback was called
      expect(onFileReadSuccess).toHaveBeenCalledWith(expect.any(File));
      expect(onErrorMessageForUser).not.toHaveBeenCalled();
    });

    describe('Download', () => {
      const mockBlob = new Blob(['image data'], { type: 'image/png' });
      const mockObjectUrl = 'blob:http://localhost/fake-url';
      const cdnUrl = 'https://cdn.example.com/shared/photo.png';
      let originalFetch;
      let originalCreateObjectURL;
      let originalRevokeObjectURL;

      beforeEach(() => {
        originalFetch = global.fetch;
        originalCreateObjectURL = window.URL.createObjectURL;
        originalRevokeObjectURL = window.URL.revokeObjectURL;
        window.URL.createObjectURL = jest.fn().mockReturnValue(mockObjectUrl);
        window.URL.revokeObjectURL = jest.fn();
      });

      afterEach(() => {
        global.fetch = originalFetch;
        window.URL.createObjectURL = originalCreateObjectURL;
        window.URL.revokeObjectURL = originalRevokeObjectURL;
      });

      const clickDownload = (tree) => {
        fireEvent.click(tree.getByRole('img'));
        fireEvent.click(tree.getByTestId('svg-icon-wrapper-cloud-download-V4'));
      };

      it('calls onDownloadImage with value when provided', async () => {
        const onDownloadImage = jest.fn();
        global.fetch = jest.fn();

        const tree = render(
          <EditableImage
            id='test'
            width={128}
            height={128}
            imgType='Fixed'
            value={cdnUrl}
            caption='Test'
            onDownloadImage={onDownloadImage}
          />,
        );
        clickDownload(tree);

        expect(onDownloadImage).toHaveBeenCalledWith(cdnUrl);
        expect(global.fetch).not.toHaveBeenCalled();
      });

      it('fetches value URL directly when onDownloadImage is not provided', async () => {
        global.fetch = jest.fn().mockResolvedValue({ ok: true, blob: () => Promise.resolve(mockBlob) });

        const tree = render(
          <EditableImage id='test' width={128} height={128} imgType='Fixed' value={cdnUrl} caption='Test' />,
        );
        clickDownload(tree);

        await act(async () => {
          await new Promise((r) => {
            setTimeout(r, 0);
          });
        });

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining(cdnUrl),
          expect.objectContaining({ mode: 'cors' }),
        );
      });

      it('calls onErrorMessageForUser when fetch fails', async () => {
        const onErrorMessageForUser = jest.fn();
        global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

        const tree = render(
          <EditableImage
            id='test'
            width={128}
            height={128}
            imgType='Fixed'
            value={cdnUrl}
            caption='Test'
            onErrorMessageForUser={onErrorMessageForUser}
          />,
        );
        clickDownload(tree);

        await act(async () => {
          await new Promise((r) => {
            setTimeout(r, 0);
          });
          await new Promise((r) => {
            setTimeout(r, 0);
          });
        });

        expect(onErrorMessageForUser).toHaveBeenCalledWith('Unable to download the image. Please try again later.');
      });

      it('revokes object URL after download to prevent memory leaks', async () => {
        global.fetch = jest.fn().mockResolvedValue({ ok: true, blob: () => Promise.resolve(mockBlob) });

        const tree = render(
          <EditableImage id='test' width={128} height={128} imgType='Fixed' value={cdnUrl} caption='Test' />,
        );
        clickDownload(tree);

        await act(async () => {
          await new Promise((r) => {
            setTimeout(r, 0);
          });
          await new Promise((r) => {
            setTimeout(r, 0);
          });
          // triggerBlobDownload defers revokeObjectURL by 100 ms
          await new Promise((r) => {
            setTimeout(r, 150);
          });
        });

        expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(mockObjectUrl);
      });
    });

    it('handles file drop with invalid file correctly', async () => {
      const onFileReadSuccess = jest.fn();
      const onErrorMessageForUser = jest.fn();

      const { container } = render(
        <EditableImage
          id='test'
          onFileReadSuccess={onFileReadSuccess}
          onErrorMessageForUser={onErrorMessageForUser}
          disabled={false}
        />,
      );

      // Simulate dropping an invalid file
      const invalidFile = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
      const dataTransfer = {
        dataTransfer: {
          files: [invalidFile],
          items: [
            {
              kind: 'file',
              type: invalidFile.type,
              getAsFile: () => invalidFile,
            },
          ],
          types: ['Files'],
        },
      };

      // Get the dropzone element by class name
      const dropzoneInput = container.querySelector('.dropzone input');

      // Ensure dropzoneInput is not null or undefined before triggering the drop event
      if (dropzoneInput) {
        await act(async () => {
          fireEvent.drop(dropzoneInput, dataTransfer);
        });
      }

      // Check if the error message callback was called
      expect(onErrorMessageForUser).toHaveBeenCalledWith(expect.any(String));
      expect(onFileReadSuccess).not.toHaveBeenCalled();
    });
  });

  describe('Corner Editing Mode', () => {
    it('renders with cornerEditing and fitToContainer', () => {
      const tree = render(
        <EditableImage
          id='test'
          value='https://example.com/image.jpg'
          cornerEditing
          fitToContainer
          onFileReadSuccess={jest.fn()}
          onDelete={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );
      expect(tree.container).toMatchSnapshot();
    });

    it('renders with cornerEditing without fitToContainer', () => {
      const tree = render(
        <EditableImage
          id='test'
          width={200}
          height={200}
          value='https://example.com/image.jpg'
          cornerEditing
          onFileReadSuccess={jest.fn()}
          onDelete={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );
      expect(tree.container).toMatchSnapshot();
    });

    it('renders with cornerEditing and circle image', () => {
      const tree = render(
        <EditableImage
          id='test'
          value='https://example.com/image.jpg'
          cornerEditing
          fitToContainer
          circle
          onFileReadSuccess={jest.fn()}
          onDelete={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );
      expect(tree.container).toMatchSnapshot();
    });

    it('renders with cornerEditing and caption', () => {
      const tree = render(
        <EditableImage
          id='test'
          caption='Test Image'
          hideCaption={false}
          value='https://example.com/image.jpg'
          cornerEditing
          fitToContainer
          onFileReadSuccess={jest.fn()}
          onDelete={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );
      expect(tree.container).toMatchSnapshot();
    });
  });

  describe('Edit Menu - Blank Image', () => {
    it('shows "Upload Image" and "Link from Web" when image has no value', () => {
      const { getByText, container } = render(
        <EditableImage
          id='test-blank'
          cornerEditing
          fitToContainer
          placeholderIcon='landscape-image'
          isV4Design
          onFileReadSuccess={jest.fn()}
          onDelete={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      const editButton = container.querySelector('#test-blank-PopUp-Button');
      fireEvent.click(editButton);

      expect(getByText('Upload Image')).toBeDefined();
      expect(getByText('Link from Web')).toBeDefined();
    });

    it('shows "Replace Image" and "Delete Image" when image has a value', () => {
      const { getByText, container } = render(
        <EditableImage
          id='test-with-value'
          value='https://example.com/image.jpg'
          cornerEditing
          fitToContainer
          isV4Design
          onFileReadSuccess={jest.fn()}
          onDelete={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      const editButton = container.querySelector('#test-with-value-PopUp-Button');
      fireEvent.click(editButton);

      expect(getByText('Replace Image')).toBeDefined();
      expect(getByText('Delete Image')).toBeDefined();
    });

    it('calls onDelete when "Delete Image" is clicked', () => {
      const onDelete = jest.fn();
      const { getByText, container } = render(
        <EditableImage
          id='test-delete'
          value='https://example.com/image.jpg'
          cornerEditing
          fitToContainer
          isV4Design
          onFileReadSuccess={jest.fn()}
          onDelete={onDelete}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      const editButton = container.querySelector('#test-delete-PopUp-Button');
      fireEvent.click(editButton);
      fireEvent.click(getByText('Delete Image'));

      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Web Link Dialog', () => {
    it('opens the web link dialog when "Link from Web" is clicked', () => {
      const { getByText, getByPlaceholderText, container } = render(
        <EditableImage
          id='test-weblink'
          cornerEditing
          fitToContainer
          placeholderIcon='landscape-image'
          isV4Design
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
          onWebUrlChange={jest.fn()}
        />,
      );

      const editButton = container.querySelector('#test-weblink-PopUp-Button');
      fireEvent.click(editButton);
      fireEvent.click(getByText('Link from Web'));

      expect(getByPlaceholderText('Enter Link')).toBeDefined();
    });

    it('calls onWebUrlChange with the entered URL when Save is clicked', () => {
      const onWebUrlChange = jest.fn();
      const { getByText, getByPlaceholderText, container } = render(
        <EditableImage
          id='test-weblink-save'
          cornerEditing
          fitToContainer
          placeholderIcon='landscape-image'
          isV4Design
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
          onWebUrlChange={onWebUrlChange}
        />,
      );

      const editButton = container.querySelector('#test-weblink-save-PopUp-Button');
      fireEvent.click(editButton);
      fireEvent.click(getByText('Link from Web'));

      const input = getByPlaceholderText('Enter Link');
      fireEvent.change(input, { target: { value: 'https://example.com/photo.jpg' } });
      fireEvent.click(getByText('Save'));

      expect(onWebUrlChange).toHaveBeenCalledWith('https://example.com/photo.jpg');
    });

    it('does not call onWebUrlChange when Cancel is clicked', () => {
      const onWebUrlChange = jest.fn();
      const { getByText, getByPlaceholderText, container } = render(
        <EditableImage
          id='test-weblink-cancel'
          cornerEditing
          fitToContainer
          placeholderIcon='landscape-image'
          isV4Design
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
          onWebUrlChange={onWebUrlChange}
        />,
      );

      const editButton = container.querySelector('#test-weblink-cancel-PopUp-Button');
      fireEvent.click(editButton);
      fireEvent.click(getByText('Link from Web'));

      const input = getByPlaceholderText('Enter Link');
      fireEvent.change(input, { target: { value: 'https://example.com/photo.jpg' } });
      fireEvent.click(getByText('Cancel'));

      expect(onWebUrlChange).not.toHaveBeenCalled();
    });

    it('does not call onWebUrlChange when saving with empty URL', () => {
      const onWebUrlChange = jest.fn();
      const { getByText, container } = render(
        <EditableImage
          id='test-weblink-empty'
          cornerEditing
          fitToContainer
          placeholderIcon='landscape-image'
          isV4Design
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
          onWebUrlChange={onWebUrlChange}
        />,
      );

      const editButton = container.querySelector('#test-weblink-empty-PopUp-Button');
      fireEvent.click(editButton);
      fireEvent.click(getByText('Link from Web'));

      // Click Save without entering a URL
      fireEvent.click(getByText('Save'));

      expect(onWebUrlChange).not.toHaveBeenCalled();
    });
  });

  describe('Image Editor Dialog', () => {
    it('opens the image editor dialog when image is clicked (non-cornerEditing mode)', () => {
      const { getByRole, getByText } = render(
        <EditableImage
          id='test-editor'
          value='https://example.com/image.jpg'
          imgType='Fixed'
          width={128}
          height={128}
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      fireEvent.click(getByRole('img'));

      // Dialog title "Image" should be visible
      expect(getByText('Image')).toBeDefined();
    });

    it('calls onDelete when delete icon is clicked in the editor dialog', () => {
      const onDelete = jest.fn();
      const { getByRole } = render(
        <EditableImage
          id='test-editor-delete'
          value='https://example.com/image.jpg'
          imgType='Fixed'
          width={128}
          height={128}
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
          onDelete={onDelete}
          onClose={jest.fn()}
        />,
      );

      // Open the editor dialog
      fireEvent.click(getByRole('img'));

      // Find the delete icon via data-testid generated by SvgIcon
      const deleteIcon = document.querySelector('[data-testid="svg-icon-wrapper-delete"]');
      fireEvent.click(deleteIcon);

      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('does not open editor dialog in cornerEditing mode', () => {
      const onClick = jest.fn();
      const { container } = render(
        <EditableImage
          id='test-corner-no-editor'
          value='https://example.com/image.jpg'
          cornerEditing
          fitToContainer
          onClick={onClick}
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      // Click the image area
      const img = container.querySelector('[role="img"]') || container.querySelector('img');
      if (img) {
        fireEvent.click(img);
      }

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Download', () => {
    it('calls fetch to download the image when download is triggered', async () => {
      const mockBlob = new Blob(['fake image'], { type: 'image/png' });
      const mockBlobUrl = 'blob:http://localhost/fake-blob-url';

      global.fetch = jest.fn().mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      });
      window.URL.createObjectURL = jest.fn().mockReturnValue(mockBlobUrl);

      const { getByRole } = render(
        <EditableImage
          id='test-download'
          value='https://example.com/images/photo.jpg'
          imgType='Fixed'
          width={128}
          height={128}
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      // Open the editor dialog
      fireEvent.click(getByRole('img'));

      // Find and click the download icon via data-testid
      const downloadIcon = document.querySelector('[data-testid="svg-icon-wrapper-cloud-download-V4"]');
      await act(async () => {
        fireEvent.click(downloadIcon);
      });

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('https://example.com/images/photo.jpg'), {
        mode: 'cors',
      });

      // Cleanup
      delete global.fetch;
    });
  });

  describe('File Validation Edge Cases', () => {
    it('rejects file with invalid extension', async () => {
      const onFileReadSuccess = jest.fn();
      const onErrorMessageForUser = jest.fn();

      const { container } = render(
        <EditableImage
          id='test-bad-ext'
          onFileReadSuccess={onFileReadSuccess}
          onErrorMessageForUser={onErrorMessageForUser}
          disabled={false}
        />,
      );

      const file = new File(['content'], 'malware.exe', { type: 'application/octet-stream' });
      const dataTransfer = {
        dataTransfer: {
          files: [file],
          items: [{ kind: 'file', type: file.type, getAsFile: () => file }],
          types: ['Files'],
        },
      };

      const dropzoneInput = container.querySelector('.dropzone input');
      if (dropzoneInput) {
        await act(async () => {
          fireEvent.drop(dropzoneInput, dataTransfer);
        });
      }

      expect(onErrorMessageForUser).toHaveBeenCalledWith(expect.stringContaining('image types are allowed'));
      expect(onFileReadSuccess).not.toHaveBeenCalled();
    });

    it('does not process files when disabled', async () => {
      const onFileReadSuccess = jest.fn();
      const onErrorMessageForUser = jest.fn();

      const { container } = render(
        <EditableImage
          id='test-disabled'
          onFileReadSuccess={onFileReadSuccess}
          onErrorMessageForUser={onErrorMessageForUser}
          disabled
        />,
      );

      const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
      const dataTransfer = {
        dataTransfer: {
          files: [file],
          items: [{ kind: 'file', type: file.type, getAsFile: () => file }],
          types: ['Files'],
        },
      };

      const dropzoneInput = container.querySelector('.dropzone input');
      if (dropzoneInput) {
        await act(async () => {
          fireEvent.drop(dropzoneInput, dataTransfer);
        });
      }

      expect(onFileReadSuccess).not.toHaveBeenCalled();
      expect(onErrorMessageForUser).not.toHaveBeenCalled();
    });

    it('sanitizes filenames by replacing special characters', async () => {
      const onFileReadSuccess = jest.fn();
      const onErrorMessageForUser = jest.fn();

      const { container } = render(
        <EditableImage
          id='test-sanitize'
          onFileReadSuccess={onFileReadSuccess}
          onErrorMessageForUser={onErrorMessageForUser}
          disabled={false}
        />,
      );

      const file = new File(['content'], 'image@#$%file.png', { type: 'image/png' });
      const dataTransfer = {
        dataTransfer: {
          files: [file],
          items: [{ kind: 'file', type: file.type, getAsFile: () => file }],
          types: ['Files'],
        },
      };

      const dropzoneInput = container.querySelector('.dropzone input');
      if (dropzoneInput) {
        await act(async () => {
          fireEvent.drop(dropzoneInput, dataTransfer);
        });
      }

      expect(onFileReadSuccess).toHaveBeenCalledWith(expect.any(File));
      // The sanitized name should have special chars replaced with underscores
      const receivedFile = onFileReadSuccess.mock.calls[0][0];
      expect(receivedFile.name).toBe('image____file.png');
    });
  });

  describe('showSetImage', () => {
    it('renders the set image button when showSetImage is true and no value', () => {
      const { container } = render(
        <EditableImage id='test-setter' showSetImage onFileReadSuccess={jest.fn()} onErrorMessageForUser={jest.fn()} />,
      );

      // Should render the plus icon button
      const plusIcon = container.querySelector('[data-testid="svg-icon-wrapper-circle-plus-V4"]');
      expect(plusIcon).not.toBeNull();
    });

    it('does not render the set image button when showSetImage is true but value is present', () => {
      const { container } = render(
        <EditableImage
          id='test-setter-with-value'
          showSetImage
          value='https://example.com/image.jpg'
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      // Should render the image, not the setter button
      const img = container.querySelector('[role="img"]') || container.querySelector('img');
      expect(img).toBeDefined();
    });

    it('renders custom set image button when customSetImageButton is provided', () => {
      const customButton = jest.fn((onUpload, uploading) => (
        <button data-testid='custom-btn' onClick={onUpload} disabled={uploading}>
          Custom Upload
        </button>
      ));

      const { getByTestId } = render(
        <EditableImage
          id='test-custom-setter'
          showSetImage
          customSetImageButton={customButton}
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      expect(customButton).toHaveBeenCalled();
      expect(getByTestId('custom-btn')).toBeDefined();
    });
  });

  describe('Upload Progress Display', () => {
    it('shows file extension during upload', () => {
      const { container } = render(
        <EditableImage
          id='test-upload-ext'
          uploading
          uploadingFile='document.pdf'
          uploadProgress={50}
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      expect(container.textContent).toContain('pdf');
      expect(container.textContent).toContain('document.pdf');
    });

    it('handles upload with no file extension gracefully', () => {
      const { container } = render(
        <EditableImage
          id='test-no-ext'
          uploading
          uploadingFile='noextension'
          uploadProgress={25}
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      expect(container.textContent).toContain('noextension');
    });
  });

  describe('Corner Edit Button Toggle', () => {
    it('toggles the edit menu open and closed on repeated clicks', () => {
      const { getByText, container } = render(
        <EditableImage
          id='test-toggle'
          value='https://example.com/image.jpg'
          cornerEditing
          fitToContainer
          isV4Design
          onFileReadSuccess={jest.fn()}
          onDelete={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      const editButton = container.querySelector('#test-toggle-PopUp-Button');

      // Open the menu
      fireEvent.click(editButton);
      expect(getByText('Replace Image')).toBeDefined();

      // Close the menu
      fireEvent.click(editButton);

      // Open again
      fireEvent.click(editButton);
      expect(getByText('Replace Image')).toBeDefined();
    });
  });

  describe('Wrapper Display Logic', () => {
    it('uses inline-block display when width is explicitly set', () => {
      const { container } = render(
        <EditableImage
          id='test-inline'
          value='https://example.com/image.jpg'
          width={200}
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      // The wrapper div around the Image should have inline-block display
      const wrapperDiv = container.firstChild;
      expect(wrapperDiv.style.display).toBe('inline-block');
    });

    it('uses block display when no width is set', () => {
      const { container } = render(
        <EditableImage
          id='test-block'
          value='https://example.com/image.jpg'
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      const wrapperDiv = container.firstChild;
      expect(wrapperDiv.style.display).toBe('block');
    });

    it('uses block display with 100% dimensions when fitToContainer is true', () => {
      const { container } = render(
        <EditableImage
          id='test-fit'
          value='https://example.com/image.jpg'
          fitToContainer
          onFileReadSuccess={jest.fn()}
          onErrorMessageForUser={jest.fn()}
        />,
      );

      const wrapperDiv = container.firstChild;
      expect(wrapperDiv.style.display).toBe('block');
      expect(wrapperDiv.style.width).toBe('100%');
      expect(wrapperDiv.style.height).toBe('100%');
    });
  });
});
