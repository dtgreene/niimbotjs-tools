import { Fragment, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { nanoid } from 'nanoid';

import { FileUploader } from './FileUploader';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { createStorageProxy } from 'src/lib/utils';

const imageViewerState = createStorageProxy('image-viewer', {
  file: null,
  images: [],
  width: '384',
  height: '240',
});

function handleFileUpload({ name, data }) {
  try {
    const json = JSON.parse(data);

    if (!Array.isArray(json)) {
      throw new Error('JSON root node must be an array');
    }

    const packets = json.reduce((result, row) => {
      const capData = row['_source']['layers']['usb.capdata'];

      if (
        capData &&
        capData.startsWith('55:55:85') &&
        capData.endsWith('aa:aa')
      ) {
        const frame = Number(row['_source']['layers']['frame']['frame.number']);
        const bytes = capData.split(':');
        const payloadInt = bytes
          .slice(4, bytes.length - 3)
          .map((byte) => parseInt(byte, 16));

        result.push({ frame, payloadInt });
      }

      return result;
    }, []);

    imageViewerState.file = {
      name,
      packets,
    };
  } catch (error) {
    console.error('File parse failed:', error);
  }
}

function handleWidthChange(event) {
  imageViewerState.width = event.target.value;
}

function handleHeightChange(event) {
  imageViewerState.height = event.target.value;
}

function getImageData(packets) {
  let lines = [];
  let minLeft = 255;
  let maxLeft = 0;
  let minRight = 255;
  let maxRight = 0;

  packets.forEach((packet) => {
    const data = new Uint8Array(packet.payloadInt);
    const counts = data.subarray(0, 6);

    const countView = new DataView(counts.buffer);
    const y = countView.getUint16(0);
    const count1 = countView.getUint8(2);
    const count2 = countView.getUint8(3);
    const repeat = countView.getUint16(4);

    const imageData = data.subarray(6);
    const binary = imageData
      .reduce((result, byte) => result + byte.toString(2).padStart(8, '0'), '')
      .split('');
    const midPoint = Math.floor(binary.length / 2);

    let left = 0;
    let right = 0;

    binary.forEach((char, index) => {
      if (char === '1') {
        if (index < midPoint) {
          left++;
        } else {
          right++;
        }
      }
    });

    minLeft = Math.min(left, minLeft);
    maxLeft = Math.max(left, maxLeft);
    minRight = Math.min(right, minRight);
    maxRight = Math.max(right, maxRight);

    const countLeft = midPoint - count1;
    const countRight = midPoint - count2;

    if (countLeft !== left || countRight !== right) {
      console.error(
        'Calculated counts mismatch:',
        countLeft,
        left,
        countRight,
        right
      );
    }

    lines.push({ y, line: binary.join(''), repeat });
  });

  return {
    lines,
    id: nanoid(),
    minLeft,
    maxLeft,
    minRight,
    maxRight,
  };
}

function handleGenerateClick() {
  const packets = imageViewerState.file?.packets;
  const width = Number(imageViewerState.width);
  const height = Number(imageViewerState.height);

  if (packets && width && height) {
    let imageGroups = [];
    let currentGroup = null;

    packets.forEach((packet) => {
      if (!currentGroup) {
        currentGroup = [packet];
      } else {
        const prevPacket = currentGroup[currentGroup.length - 1];

        if (Math.abs(prevPacket.frame - packet.frame) > 5) {
          imageGroups.push(currentGroup);
          currentGroup = [packet];
        } else {
          currentGroup.push(packet);
        }
      }
    });

    imageGroups.push(currentGroup);

    imageViewerState.images = imageGroups.map((packets) =>
      getImageData(packets)
    );
  }
}

const ImageView = ({ image }) => {
  const snap = useSnapshot(imageViewerState);
  const canvasRef = useRef();

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, snap.width, snap.height);

    image.lines.forEach(({ line, y, repeat }) => {
      const chars = line.split('');

      for (let i = 0; i < repeat; i++) {
        if (i > 0) {
          ctx.fillStyle = '#7f50b6';
        } else {
          ctx.fillStyle = '#fff';
        }

        chars.forEach((char, x) => {
          if (char === '1') {
            ctx.fillRect(x, y + i, 1, 1);
          }
        });
      }
    });
  }, [snap.width, snap.height, image]);

  return (
    <div className="flex justify-center">
      <div className="flex-1 max-w-[1000px]">
        <canvas
          className="w-full rounded-md border overflow-hidden pixelated mb-2"
          width={snap.width}
          height={snap.height}
          ref={canvasRef}
        />
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="bg-[#7f50b6] w-4 h-4"></div>
          <span>repeated rows</span>
        </div>
        <div>
          <div className="flex justify-center gap-2">
            <span className="flex-1 text-right">Total Lines:</span>
            <span className="flex-1">{image.lines.length}</span>
          </div>
          <div className="flex justify-center gap-2">
            <span className="flex-1 text-right">Min Left:</span>
            <span className="flex-1">{image.minLeft}</span>
          </div>
          <div className="flex justify-center gap-2">
            <span className="flex-1 text-right">Max Left:</span>
            <span className="flex-1">{image.maxLeft}</span>
          </div>
          <div className="flex justify-center gap-2">
            <span className="flex-1 text-right">Min Right:</span>
            <span className="flex-1">{image.minRight}</span>
          </div>
          <div className="flex justify-center gap-2">
            <span className="flex-1 text-right">Max Right:</span>
            <span className="flex-1">{image.maxRight}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ImageDataViewer = () => {
  const snap = useSnapshot(imageViewerState, { sync: true });
  const { file, width, height, images } = snap;

  return (
    <Fragment>
      <div className="text-2xl mb-4">Image Data Viewer</div>
      <div className="mb-8">
        <FileUploader
          onChange={handleFileUpload}
          fileName={file?.name}
          accept=".json"
        />
        <div>WireShark packet dissection file, in JSON format</div>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <Label className="flex items-center gap-2 w-32">
          <span>Width:</span>
          <Input value={width} onChange={handleWidthChange} />
        </Label>
        <Label className="flex items-center gap-2 w-32">
          <span>Height:</span>
          <Input value={height} onChange={handleHeightChange} />
        </Label>
        <Button onClick={handleGenerateClick} disabled={!file}>
          Generate
        </Button>
      </div>
      {images.map((image) => (
        <ImageView key={image.id} image={image} />
      ))}
    </Fragment>
  );
};
