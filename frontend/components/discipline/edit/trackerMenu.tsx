import TrackerMenuRow from './trackerMenuRow';

type ParentComponentProps = {
    items: { id: string; value: string }[];
    setItems: (items: { id: string; value: string }[]) => void;
    placeHolder: string;
}

function ParentComponent({ items, setItems, placeHolder}: ParentComponentProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        const newItems = [...items];
        newItems[index].value = value;
        setItems(newItems);
    };

    const handleDelete = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    return (
        <div>
            {items.map((item, index) => (
                <TrackerMenuRow
                    key={item.id}
                    id={item.id}
                    placeholder={placeHolder}
                    value={item.value}
                    onChange={(e) => handleInputChange(e, index)}
                    deleteHandler={() => handleDelete(index)}
                />
            ))}
        </div>
    );
}

export default ParentComponent;