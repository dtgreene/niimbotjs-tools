import { Fragment } from 'react';
import { useSnapshot } from 'valtio';

import { PacketTable } from './PacketTable';
import { ScrollButton } from '../ScrollButton';
import { FileUploader } from '../FileUploader';
import { packetExplorerState } from './state';
import { useTableData, FilterType } from 'src/hooks/useTableData';
import { PacketCode } from 'src/lib/packets';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { Input } from '../ui/Input';
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';
import { Label } from '../ui/Label';
import { Checkbox } from '../ui/Checkbox';
import { BytesDialog } from './BytesDialog';

function getSortFunction(sortField) {
  switch (sortField) {
    case 'frame': {
      return (a, b) => Number(a.frame) - Number(b.frame);
    }
    case 'packetType': {
      return (a, b) => Number(a.packetType) - Number(b.packetType);
    }
    case 'packetName': {
      return (a, b) => a.packetName.localeCompare(b.packetName);
    }
    case 'src': {
      return (a, b) => a.src.localeCompare(b.src);
    }
    case 'payloadBytes': {
      return (a, b) => a.payloadBytes.length - b.payloadBytes.length;
    }
    case 'payloadInt': {
      return (a, b) => a.payloadInt.length - b.payloadInt.length;
    }
  }
}

function handleExpandChange(value) {
  packetExplorerState.expandRows = value;
}

function handleFileUpload({ name, data }) {
  try {
    const json = JSON.parse(data);

    if (!Array.isArray(json)) {
      throw new Error('JSON root node must be an array');
    }

    const packets = json.reduce((result, row) => {
      const capData = row['_source']['layers']['usb.capdata'];

      if (capData && capData.startsWith('55:55') && capData.endsWith('aa:aa')) {
        const frame = row['_source']['layers']['frame']['frame.number'];
        const bytes = capData.split(':');
        const packetType = String(parseInt(bytes[2], 16));
        const packetName = PacketCode[packetType] ?? '???';
        const payloadBytes = bytes.slice(4, bytes.length - 3);
        const payloadInt = payloadBytes.map((byte) => parseInt(byte, 16));
        const src = row['_source']['layers']['usb']['usb.src'];
        const dst = row['_source']['layers']['usb']['usb.dst'];

        result.push({
          frame,
          bytes,
          packetType,
          packetName,
          payloadBytes,
          payloadInt,
          payloadBytesDisplay: payloadBytes.join(':'),
          payloadIntDisplay: payloadInt.join(':'),
          src,
          dst,
        });
      }

      return result;
    }, []);

    packetExplorerState.file = {
      name,
      packets,
    };
  } catch (error) {
    console.error('File parse failed:', error);
  }
}

function handleFilterTypeChange(value) {
  packetExplorerState.filterType = value;
}

function handleFilterFieldChange(value) {
  packetExplorerState.filterField = value;
}

function handleFilterValueChange(event) {
  packetExplorerState.filterValue = event.target.value;
}

export const PacketExplorer = () => {
  const snap = useSnapshot(packetExplorerState, { sync: true });
  const {
    file,
    filterField,
    filterValue,
    filterType,
    sortField,
    sortReverse,
    expandRows,
  } = snap;
  const { data, highlights, hidden } = useTableData(
    file?.packets,
    filterField,
    filterValue,
    filterType,
    sortField,
    sortReverse,
    getSortFunction,
  );

  return (
    <Fragment>
      <div className="text-2xl mb-4">Packet Explorer</div>
      <div className="mb-8">
        <FileUploader
          onChange={handleFileUpload}
          fileName={file?.name}
          accept=".json"
        />
        <div>WireShark packet dissection file, in JSON format</div>
      </div>
      {data && (
        <Fragment>
          <div className="flex flex-col gap-2 mb-8">
            <div className="flex items-center gap-4">
              <Select
                value={filterField}
                onValueChange={handleFilterFieldChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Column</SelectLabel>
                    <SelectItem value="frame">frame</SelectItem>
                    <SelectItem value="packetType">type</SelectItem>
                    <SelectItem value="packetName">name</SelectItem>
                    <SelectItem value="src">source</SelectItem>
                    <SelectItem value="payloadBytesDisplay">
                      payload bytes
                    </SelectItem>
                    <SelectItem value="payloadIntDisplay">
                      payload int
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                value={filterValue}
                onChange={handleFilterValueChange}
                className="w-48"
              />
              <div className="flex items-start gap-4">
                <RadioGroup
                  defaultValue={filterType}
                  value={filterType}
                  onValueChange={handleFilterTypeChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={FilterType.HIGHLIGHT}
                      id="f-highlight"
                    />
                    <Label htmlFor="f-highlight">Highlight</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={FilterType.FILTER} id="f-filter" />
                    <Label htmlFor="f-filter">Filter</Label>
                  </div>
                </RadioGroup>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="expand"
                    checked={expandRows}
                    onCheckedChange={handleExpandChange}
                  />
                  <label
                    htmlFor="expand"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Expand rows
                  </label>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="font-bold">Total:</Label>
              <span>{data.length}</span>
              {hidden > 0 && <span>({hidden} hidden)</span>}
            </div>
          </div>
          <div className="border">
            <ScrollButton />
            {data.length === 0 ? (
              <div className="p-4">No packets match the search criteria</div>
            ) : (
              <PacketTable packets={data} highlights={highlights} snap={snap} />
            )}
          </div>
        </Fragment>
      )}
      <BytesDialog />
    </Fragment>
  );
};
