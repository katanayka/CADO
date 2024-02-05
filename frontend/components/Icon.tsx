import Image from 'next/image'

export default function Icon() {
    return (
        <div className="w-full h-48 flex justify-center items-center">
            <Image
            src={"https://placehold.co/150.png"}
            alt='Icon of site'
            width={140}
            height={140}
            hidden={true}
            />
        </div>
    )
}