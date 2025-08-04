interface InputBoxProps {
    type: string;
    placeholder: string;
    value?: string; // Add value prop with optional modifier (?)
    onChange?: (e: { target: { value: any; }; }) => void; // Add onChange prop with optional modifier (?)
    className?: string;
    ref?:any
  }
  


export function InputBox({
    type,
    placeholder,
    value,
    onChange,
    className,
    ref
  }: InputBoxProps) {
    return <div>
      <input ref={ref} type={type} placeholder={placeholder} value={value} // Add value attribute
        onChange={onChange} className={`w-full p-2 border border-gray-400 hover:border-gray-600 focus:border-gray-600  rounded-md mb-2 ${className || ''} `} />
    </div>
  }