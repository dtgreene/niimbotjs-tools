import { Fragment } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import clsx from 'clsx';

import { packetExplorerState } from './state';
import { setDialogData } from './BytesDialog';

function handleColumnClick(column) {
  if (packetExplorerState.sortField === column) {
    if (packetExplorerState.sortReverse) {
      packetExplorerState.sortField = null;
      packetExplorerState.sortReverse = false;
    } else {
      packetExplorerState.sortReverse = true;
    }
  } else {
    packetExplorerState.sortField = column;
    packetExplorerState.sortReverse = false;
  }
}

const HighlightChunk = ({ chunks }) => {
  return chunks.map((chunk) => (
    <span key={chunk.key} className={clsx({ 'bg-primary': chunk.match })}>
      {chunk.text}
    </span>
  ));
};

const PacketRows = ({ packets, highlights, expandRows, filterField }) => {
  const rowClass =
    'flex last-of-type:border-none border-b even:bg-accent font-mono';
  const columnClass = clsx('border-r last-of-type:border-none p-1', {
    'overflow-hidden text-ellipsis': !expandRows,
    'break-word': expandRows,
  });

  return packets.map((packet) => {
    const chunks = highlights[packet.frame];
    const handlePayloadClick = () => {
      setDialogData(packet.payloadBytes);
    };

    const columns = chunks ? (
      <Fragment>
        <div className={clsx(columnClass, 'w-[8%] text-right')}>
          {filterField === 'frame' ? (
            <HighlightChunk chunks={chunks} />
          ) : (
            packet.frame
          )}
        </div>
        <div className={clsx(columnClass, 'w-[8%]')}>
          {filterField === 'packetType' ? (
            <HighlightChunk chunks={chunks} />
          ) : (
            packet.packetType
          )}
        </div>
        <div className={clsx(columnClass, 'w-[20%]')}>
          {filterField === 'packetName' ? (
            <HighlightChunk chunks={chunks} />
          ) : (
            packet.packetName
          )}
        </div>
        <div className={clsx(columnClass, 'w-[10%]')}>
          {filterField === 'src' ? (
            <HighlightChunk chunks={chunks} />
          ) : (
            packet.src
          )}
        </div>
        <div
          className={clsx(columnClass, 'w-[27%]')}
          title={packet.payloadBytesDisplay}
        >
          <div
            className="inline-block cursor-pointer hover:underline"
            onClick={handlePayloadClick}
          >
            {filterField === 'payloadBytesDisplay' ? (
              <HighlightChunk chunks={chunks} />
            ) : (
              packet.payloadBytesDisplay
            )}
          </div>
        </div>
        <div
          className={clsx(columnClass, 'w-[27%]')}
          title={packet.payloadIntDisplay}
        >
          {filterField === 'payloadIntDisplay' ? (
            <HighlightChunk chunks={chunks} />
          ) : (
            packet.payloadIntDisplay
          )}
        </div>
      </Fragment>
    ) : (
      <Fragment>
        <div className={clsx(columnClass, 'w-[8%] text-right')}>
          {packet.frame}
        </div>
        <div className={clsx(columnClass, 'w-[8%]')}>{packet.packetType}</div>
        <div className={clsx(columnClass, 'w-[20%]')}>{packet.packetName}</div>
        <div className={clsx(columnClass, 'w-[10%]')}>{packet.src}</div>
        <div
          className={clsx(columnClass, 'w-[27%]')}
          title={packet.payloadBytesDisplay}
        >
          <div
            className="inline-block cursor-pointer hover:underline"
            onClick={handlePayloadClick}
          >
            {packet.payloadBytesDisplay}
          </div>
        </div>
        <div
          className={clsx(columnClass, 'w-[27%]')}
          title={packet.payloadIntDisplay}
        >
          {packet.payloadIntDisplay}
        </div>
      </Fragment>
    );

    return (
      <div key={packet.frame} className={rowClass}>
        {columns}
      </div>
    );
  });
};

export const PacketTable = ({ packets, highlights, snap }) => {
  const { filterField, sortField, sortReverse, expandRows } = snap;
  const sortIcon = (
    <span>
      {sortReverse ? (
        <ArrowDown width="18px" height="18px" />
      ) : (
        <ArrowUp width="18px" height="18px" />
      )}
    </span>
  );

  const rowClass = 'flex font-bold bg-background border-b sticky top-0';
  const columnClass =
    'border-r last-of-type:border-none p-1 flex items-center justify-between cursor-pointer hover:opacity-75 transition-opacity';

  return (
    <div className="text-sm">
      <div className={rowClass}>
        <div
          className={clsx(columnClass, 'w-[8%]')}
          onClick={() => handleColumnClick('frame')}
        >
          <span className="overflow-hidden text-ellipsis">frame</span>
          {sortField === 'frame' && sortIcon}
        </div>
        <div
          className={clsx(columnClass, 'w-[8%]')}
          onClick={() => handleColumnClick('packetType')}
        >
          <span className="overflow-hidden text-ellipsis">type</span>
          {sortField === 'packetType' && sortIcon}
        </div>
        <div
          className={clsx(columnClass, 'w-[20%]')}
          onClick={() => handleColumnClick('packetName')}
        >
          <span className="overflow-hidden text-ellipsis">name</span>
          {sortField === 'packetName' && sortIcon}
        </div>
        <div
          className={clsx(columnClass, 'w-[10%]')}
          onClick={() => handleColumnClick('src')}
        >
          <span className="overflow-hidden text-ellipsis">source</span>
          {sortField === 'src' && sortIcon}
        </div>
        <div
          className={clsx(columnClass, 'w-[27%]')}
          onClick={() => handleColumnClick('payloadBytes')}
        >
          <span className="overflow-hidden text-ellipsis">payload bytes</span>
          {sortField === 'payloadBytes' && sortIcon}
        </div>
        <div
          className={clsx(columnClass, 'w-[27%]')}
          onClick={() => handleColumnClick('payloadInt')}
        >
          <span className="overflow-hidden text-ellipsis">payload int</span>
          {sortField === 'payloadInt' && sortIcon}
        </div>
      </div>
      <PacketRows
        packets={packets}
        highlights={highlights}
        expandRows={expandRows}
        filterField={filterField}
      />
    </div>
  );
};
