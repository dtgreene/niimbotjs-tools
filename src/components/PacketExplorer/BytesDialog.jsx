import { proxy, useSnapshot } from 'valtio';
import { nanoid } from 'nanoid';
import clsx from 'clsx';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';

const dialogState = proxy({
  activeByte: null,
  dialogData: null,
  dialogOpen: false,
});

export function setDialogData(bytes) {
  if (bytes.length > 0) {
    const data = new Uint8Array(
      bytes.map((byte) => parseInt(byte, 16)).concat(0)
    );
    const view = new DataView(data.buffer);
    const dialogData = bytes.map((value, index) => ({
      value,
      id: nanoid(),
      uint8BE: view.getUint8(index),
      uint8LE: view.getUint8(index, true),
      int8BE: view.getInt8(index),
      int8LE: view.getInt8(index, true),
      uint16BE: view.getUint16(index),
      uint16LE: view.getUint16(index, true),
      int16BE: view.getInt16(index),
      int16LE: view.getInt16(index, true),
    }));

    dialogState.dialogData = dialogData;
    dialogState.activeByte = dialogData[0];
  }

  dialogState.dialogOpen = true;
}

function handleDialogOpenChange(open) {
  dialogState.dialogOpen = open;
}

function handleByteClick(value) {
  dialogState.activeByte = value;
}

export const BytesDialog = () => {
  const snap = useSnapshot(dialogState);
  const activeByteId = snap.activeByte?.id;
  const dialogData = snap.dialogData;

  return (
    <Dialog open={snap.dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inspect Bytes</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-8 gap-2 border rounded-md p-2 max-h-64 overflow-auto">
          {dialogData?.map((byte) => {
            const isActive = activeByteId === byte.id;
            const className = clsx('rounded-md px-1 border font-mono', {
              'bg-background hover:bg-accent hover:text-accent-foreground':
                !isActive,
              'bg-primary': isActive,
            });

            return (
              <button
                key={byte.id}
                onClick={() => handleByteClick(byte)}
                className={className}
              >
                {byte.value}
              </button>
            );
          })}
        </div>
        {activeByteId && (
          <div className="flex gap-2 text-sm">
            <div className="flex-1">
              <div className="font-bold mb-2 text-center">Big Endian</div>
              <div className="border rounded-md p-2">
                <div className="grid grid-cols-3 items-center">
                  <span></span>
                  <span className="text-zinc-400">Signed</span>
                  <span className="text-zinc-400">Unsigned</span>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <span>8-bit</span>
                  <span className="font-mono">{snap.activeByte.int8BE}</span>
                  <span className="font-mono">{snap.activeByte.uint8BE}</span>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <span>16-bit</span>
                  <span className="font-mono">{snap.activeByte.int16BE}</span>
                  <span className="font-mono">{snap.activeByte.uint16BE}</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="font-bold mb-2 text-center">Little Endian</div>
              <div className="border rounded-md p-2">
                <div className="grid grid-cols-3 items-center">
                  <span></span>
                  <span className="text-zinc-400">Signed</span>
                  <span className="text-zinc-400">Unsigned</span>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <span>8-bit</span>
                  <span className="font-mono">{snap.activeByte.int8LE}</span>
                  <span className="font-mono">{snap.activeByte.uint8LE}</span>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <span>16-bit</span>
                  <span className="font-mono">{snap.activeByte.int16LE}</span>
                  <span className="font-mono">{snap.activeByte.uint16LE}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
