import { createStorageProxy } from 'src/lib/utils';
import { FilterType } from 'src/hooks/useTableData';

export const packetExplorerState = createStorageProxy('packet-explorer', {
  file: null,
  filterField: 'frame',
  filterValue: '',
  filterType: FilterType.HIGHLIGHT,
  sortField: null,
  sortReverse: false,
  expandRows: false,
});
