import { Fragment, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';

import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { createStorageProxy } from 'src/lib/utils';

const labelState = createStorageProxy('calibrate-label', {
  width: '384',
  height: '240',
  text: '50x30',
});

function handleWidthChange(event) {
  labelState.width = event.target.value;
}

function handleHeightChange(event) {
  labelState.height = event.target.value;
}

function handleTextChange(event) {
  labelState.text = event.target.value;
}

export const CalibrateLabel = () => {
  const { width, height, text } = useSnapshot(labelState, { sync: true });
  const svgRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const data = new XMLSerializer().serializeToString(svgRef.current);
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, 0, 0, Number(width), Number(height));
    };
    image.src = `data:image/svg+xml;base64,${window.btoa(data)}`;
  }, [width, height, text]);

  return (
    <Fragment>
      <div className="text-2xl mb-4">Image Data Viewer</div>
      <div className="flex items-center gap-4 mb-8">
        <Label className="flex items-center gap-2 w-32">
          <span>Width:</span>
          <Input value={width} onChange={handleWidthChange} />
        </Label>
        <Label className="flex items-center gap-2 w-32">
          <span>Height:</span>
          <Input value={height} onChange={handleHeightChange} />
        </Label>
        <Label className="flex items-center gap-2 w-32">
          <span>Text:</span>
          <Input value={text} onChange={handleTextChange} />
        </Label>
      </div>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="hidden"
        ref={svgRef}
      >
        <style>
          {`text {
            font-family: monospace;
            text-align: center;
            text-anchor: middle;
            dominant-baseline: middle;
            font-size: 48px;
          `}
        </style>
        <rect x="0" y="0" width={width} height={height} fill="#fff" />
        <path
          d={`M0,0 L${width},${height} M0,${height} L${width},0`}
          stroke="#000"
          strokeWidth="4"
        />
        <rect
          x={16}
          y={16}
          width={width - 32}
          height={height - 32}
          stroke="#000"
          strokeWidth="4"
          fill="none"
          rx="16"
        />
        <rect
          x={56}
          y={56}
          width={width - 112}
          height={height - 112}
          stroke="#000"
          strokeWidth="4"
          fill="#fff"
          rx="16"
        />
        <text x={width * 0.5} y={height * 0.5}>
          {text}
        </text>
      </svg>
      <div className="flex justify-center">
        <canvas width={width} height={height} ref={canvasRef} />
      </div>
    </Fragment>
  );
};
