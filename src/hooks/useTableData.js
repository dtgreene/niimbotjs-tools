import highlightWords from 'highlight-words';

export const FilterType = {
  HIGHLIGHT: 0,
  FILTER: 1,
};

export function useTableData(
  data,
  filterField,
  filterValue,
  filterType,
  sortField,
  sortReverse,
  getSortFunction,
) {
  const result = {
    data,
    highlights: {},
    hidden: 0,
  };

  if (!data) {
    return result;
  }

  if (filterValue) {
    // Get highlights for each row
    data.forEach((packet) => {
      if (packet[filterField].includes(filterValue)) {
        result.highlights[packet.frame] = highlightWords({
          text: packet[filterField],
          query: filterValue,
        });
      }
    }, []);

    if (filterType === FilterType.FILTER) {
      result.data = data.filter((packet) =>
        packet[filterField].includes(filterValue),
      );
      result.hidden = data.length - result.data.length;
    }
  }

  if (sortField) {
    result.data = result.data.toSorted(getSortFunction(sortField));

    if (sortReverse) {
      result.data = result.data.toReversed();
    }
  }

  return result;
}
