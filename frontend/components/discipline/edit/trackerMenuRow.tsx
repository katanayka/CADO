import React from 'react'
import { Checkbox } from 'react-daisyui';
import { HiXMark } from 'react-icons/hi2';

type trackerMenuProps = {
    id: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    deleteHandler: () => void;
}

export default function TrackerMenuRow(props: trackerMenuProps) {
    const [hasValue, setHasValue] = React.useState(false);
    React.useEffect(() => {
        if (props.value.length > 0) {
            setHasValue(true);
        } else {
            setHasValue(false);
        }
    }, [props.value]);
    return (
        <div className="flex space-x-2 flex-col gap-2" key={props.id}>
            <div className='flex flex-row gap-4 items-center'>
                <Checkbox disabled={true} checked={hasValue} />
                <input
                    type="text"
                    className="input input-primary w-full"
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                />
                <button className=" bg-red-500 btn-ghost transition-colors duration-300 w-6 h-6 rounded-full flex items-center justify-center"
                    onClick={() => { props.deleteHandler() }}
                >
                    <HiXMark />
                </button>
            </div>
            <hr className='w-full' />
        </div>
    )
}
