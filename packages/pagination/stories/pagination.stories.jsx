import React, { useState } from 'react';
import Pagination from '../src';

export default {
  title: 'm-next/Components/Navigation/Pagination',
  component: Pagination,
  parameters: { layout: 'padded' },
};

const Frame = ({ children }) => (
  <div
    style={{
      fontFamily: "'Source Sans Pro', system-ui, -apple-system, sans-serif",
      padding: 24,
      background: '#FFFFFF',
      color: '#1F2A33',
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Basic — small page count, no ellipsis needed.
// ---------------------------------------------------------------------------
export const Basic = () => {
  const [page, setPage] = useState(2);
  return (
    <Frame>
      <p style={{ marginTop: 0, color: '#545F67' }}>
        Page <strong>{page}</strong> of 5
      </p>
      <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
    </Frame>
  );
};

// ---------------------------------------------------------------------------
// ManyPages — sliding window with both ellipsis showing.
// ---------------------------------------------------------------------------
export const ManyPages = () => {
  const [page, setPage] = useState(7);
  return (
    <Frame>
      <p style={{ marginTop: 0, color: '#545F67' }}>
        Page <strong>{page}</strong> of 20
      </p>
      <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />
      <p style={{ marginTop: 24, color: '#545F67' }}>
        siblingCount=2 widens the window:
      </p>
      <Pagination currentPage={page} totalPages={20} onPageChange={setPage} siblingCount={2} />
    </Frame>
  );
};

// ---------------------------------------------------------------------------
// FirstPage — Prev and First buttons disabled at the start of the range.
// ---------------------------------------------------------------------------
export const FirstPage = () => {
  const [page, setPage] = useState(1);
  return (
    <Frame>
      <p style={{ marginTop: 0, color: '#545F67' }}>
        At the start — Prev and First are disabled.
      </p>
      <Pagination currentPage={page} totalPages={15} onPageChange={setPage} />
    </Frame>
  );
};

// ---------------------------------------------------------------------------
// LastPage — Next and Last buttons disabled at the end of the range; also
// shows the showFirstLast={false} variant.
// ---------------------------------------------------------------------------
export const LastPage = () => {
  const [page, setPage] = useState(15);
  return (
    <Frame>
      <p style={{ marginTop: 0, color: '#545F67' }}>
        At the end — Next and Last are disabled.
      </p>
      <Pagination currentPage={page} totalPages={15} onPageChange={setPage} />
      <p style={{ marginTop: 24, color: '#545F67' }}>
        showFirstLast={'{false}'} drops the jump-to-edge buttons:
      </p>
      <Pagination
        currentPage={page}
        totalPages={15}
        onPageChange={setPage}
        showFirstLast={false}
      />
    </Frame>
  );
};
