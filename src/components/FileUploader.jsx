import { buttonVariants } from './ui/Button';
import { Label } from './ui/Label';

export const FileUploader = ({ onChange, fileName = '', accept }) => {
  const handleChange = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({ name: files[0].name, data: reader.result });
      };
      reader.readAsText(files[0]);
    }
  };

  return (
    <div className="inline-flex border rounded-md mb-2">
      <div className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap h-10 px-4 py-2 border-r">
        {fileName}
      </div>
      <Label
        htmlFor="file-upload"
        className={buttonVariants({
          variant: 'ghost',
          className: 'cursor-pointer',
        })}
      >
        Select File
      </Label>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleChange}
        accept={accept}
      />
    </div>
  );
};
