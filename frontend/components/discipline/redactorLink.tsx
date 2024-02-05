"use client"
import { getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";

export default function RedactorLink({ disciplineId }: { disciplineId: string }) {
    return (
        <Link href={"/disciplines/" + disciplineId + "/redactor"} style={
            typeof getCookie("userType") === "string"
                ?
                getCookie("userType") == "Преподаватель"
                    ?
                    {}
                    :
                    { visibility: "hidden" }
                :
                {}
        }>
            <Image
                src="/open_link.svg"
                alt="Open link"
                width={24}
                height={24}
                priority={true}
                quality={100}
                className="p-0.5 bg-white rounded-full xl:-ml-5 xl:-mt-5"
            />
        </Link>
    );
}