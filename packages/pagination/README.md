# @m-next/pagination

Page navigator for paged data views. Standard `« ‹ 1 … 4 [5] 6 … 10 › »` shape — first, prev, sliding page-number window, next, last.

## Quick start

```jsx
import { Pagination } from '@m-next/pagination';

function CustomersTable() {
  const [page, setPage] = useState(1);
  const { data, totalPages } = useCustomers({ page, perPage: 25 });

  return (
    <>
      <Table rows={data} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
```

Pages are **1-based** — `currentPage={1}` is the first page, and `onPageChange` is always called with a 1-based index.

See the Storybook MDX (`stories/pagination.mdx`) for the intent contract and design decisions.

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| `currentPage` | `number` | required | 1-based index of the displayed page. |
| `totalPages` | `number` | required | Total number of pages. |
| `onPageChange` | `(page: number) => void` | required | Called with the new 1-based page index. |
| `siblingCount` | `number` | `1` | Page buttons shown on each side of current. |
| `showFirstLast` | `boolean` | `true` | Render «« first / last »» in addition to ‹ prev / next ›. |
| `ariaLabel` | `string` | `'Pagination'` | Accessible label for the `<nav>` landmark. |
| `id` | `string` | auto | Auto-generated as `m-next-pagination-N` when omitted. |

## Intent contract

Pagination is a **stateless page navigator**, not a paged-data manager:

- Doesn't own the page state — it's controlled.
- Doesn't own page-size selection ("10 / 25 / 50 per page").
- Doesn't own record-count text ("12 to 24 of 156") — render that alongside.
- Doesn't fetch, sort, or filter data.
- Renders nothing when `totalPages <= 1` — no need to gate it yourself.

## Helper export

`getPageRange(currentPage, totalPages, siblingCount)` returns the sequence of numbers and `'ellipsis'` markers between Prev and Next. Useful for tests and consumers building their own page navigator on the same windowing logic.

## Roadmap

- v2: optional page-size selector slot.
- v2: optional record-count text built-in (`renderRecordCount` prop).
