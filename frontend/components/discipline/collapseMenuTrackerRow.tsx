import React from 'react'
import { Checkbox } from 'react-daisyui'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { usePathname } from 'next/navigation'

type trackerMenuProps = {
    item: string;
    ndt: string;
    checkedValue: boolean;
}

function CollapseMenuTrackerRow({ item, ndt, checkedValue, onCheckboxChange }: trackerMenuProps & { onCheckboxChange: (checked: boolean) => void }) {
    const [checked, setChecked] = React.useState(checkedValue)
    const router = usePathname()
    const disciplineId = decodeURI(router.split('/')[2])
    const userId = getCookie('userId')
    const handleCheckboxChange = () => {
        console.log(item)
        setChecked(!checked)
        onCheckboxChange(!checked) // Call the callback with the new checkbox value
        // axios.post('/api/discipline/progress/save', {
        //     discipline_id: disciplineId,
        //     node_id: ndt,
        //     questionText: item,
        //     user_id: userId,
        //     checked: !checked
        // })
        //     .then((response) => {
        //         console.log(response)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
    }
    return (
        <div className='p-1 flex gap-2'>
            <Checkbox size='sm' checked={checked} onChange={handleCheckboxChange} />
            {item}
        </div>
    )
}

export default CollapseMenuTrackerRow
