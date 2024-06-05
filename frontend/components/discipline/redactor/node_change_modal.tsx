import React, { useEffect, useState } from 'react'

type NodeChangeModalProps = {
    selectedNode: {
        id: string;
        parentId: string;
        text: string;
        inside: string;
        books: { id: string; name: string; link: string }[];
    }
    saveSelectedNode: (data: {
      books: any; id: string; parentId: string; text: string; inside: string 
}) => void
    closeModal: () => void
}

type BookModalProps = {
    saveBook: (book: { id: string, name: string, link: string }) => void;
    closeModal: () => void;
};

const BookModal: React.FC<BookModalProps> = ({ saveBook, closeModal }) => {
    const [book, setBook] = useState({ id: '', name: '', link: '' });

    const changeBookName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBook({ ...book, name: e.currentTarget.value });
    };

    const changeBookLink = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBook({ ...book, link: e.currentTarget.value });
    };

    const saveSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (book.name && book.link) {
            saveBook({ ...book, id: Date.now().toString() });
        }
        closeModal();
    };

    return (
        <div className='fixed z-10 overflow-y-auto w-96 h-auto bg-slate-400 p-4 rounded-lg shadow-lg top-0 right-[25%] mt-[1.25%] backdrop-filter backdrop-blur-sm bg-opacity-60'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold text-white'>Добавить книгу</h1>
                <button className='text-white font-bold' onClick={closeModal}>
                    &times;
                </button>
            </div>
            <form className='flex flex-col gap-4 mt-4' onSubmit={saveSubmit}>
                <div className='flex flex-col gap-2'>
                    <p className='text-white'>Название книги</p>
                    <input type='text' className='p-2 bg-slate-500 text-white rounded-lg' value={book.name} onChange={changeBookName} />
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='text-white'>Ссылка на книгу</p>
                    <input type='text' className='p-2 bg-slate-500 text-white rounded-lg' value={book.link} onChange={changeBookLink} />
                </div>
                <button type="submit" className='bg-slate-500 text-white p-2 rounded-lg mt-4'>
                    Save
                </button>
            </form>
        </div>
    );
};

const NodeChangeModal: React.FC<NodeChangeModalProps> = ({ selectedNode, saveSelectedNode, closeModal }) => {
    const [node, setNode] = React.useState(selectedNode);
    const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [books, setBooks] = useState<{ id: string; name: string; link: string }[]>([]);
    useEffect(() => {
        setNode(selectedNode)
    }, [selectedNode])
    const changeNodeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNode({ ...node, text: e.currentTarget.value })
    }
    const changeNodeInside = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNode({ ...node, inside: e.currentTarget.value })
    }

    const addBook = (book: { id: string; name: string; link: string }) => {
        setBooks([...books, book]);
    };

    const deleteBook = (id: string) => {
        setBooks(books.filter(book => book.id !== id));
    };

    const saveSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let data = { ...selectedNode }
        data.text = (e.currentTarget[0] as HTMLInputElement).value;
        data.inside = (e.currentTarget[1] as HTMLTextAreaElement).value;
        data.books = books;
        saveSelectedNode(data);
    }
    return (
        <>
            {isBookModalOpen && (
                <BookModal
                    saveBook={addBook}
                    closeModal={() => setIsBookModalOpen(false)}
                />
            )}
            <div className='fixed z-10 overflow-y-auto w-96 h-[95%] bg-slate-400 p-4 rounded-lg shadow-lg top-0 right-[1%] mt-[1.25%] backdrop-filter backdrop-blur-sm bg-opacity-60'>

                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-bold text-white'>Изменить узел</h1>
                    <button className='text-white font-bold'
                        onClick={() => closeModal()}>
                        &times;
                    </button>
                </div>
                <div className='flex flex-col gap-4 mt-4' onSubmit={saveSubmit}>
                    <div className='flex flex-col gap-2'>
                        <p className='text-white'>
                            Название
                        </p>
                        <input type='text' className='p-2 bg-slate-500 text-white rounded-lg'
                            value={node.text}
                            onChange={changeNodeText} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-white'>
                            Содержание
                        </p>
                        <textarea className='p-2 bg-slate-500 text-white rounded-lg h-96'
                            value={node.inside}
                            onChange={changeNodeInside} />
                    </div>
                    <div className='flex flex-wrap gap-2 mt-4'>
                        {books.map(book => (
                            <div key={book.id} className='flex items-center bg-slate-400 rounded-xl p-2 overflow-auto'>
                                <span className='text-white text-clip '>{book.name}</span>
                                <button onClick={() => deleteBook(book.id)} className='ml-2 text-red-500'>
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button onClick={() => setIsBookModalOpen(true)} className='w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded'>
                            +
                        </button>
                    </div>
                    <button type="submit" className='bg-slate-500 text-white p-2 rounded-lg mt-4'>
                        Save
                    </button>
                </div>
            </div>
        </>
    )
}

export default NodeChangeModal
