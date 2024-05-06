import Discipline from "../data/Disciplines";
import Icon from "@/components/Icon";
import dynamic from 'next/dynamic';
import discipline_card from "@/components/discipline_card";

const DropdownType = dynamic(() => import('@/components/dropdown-user-type'), { ssr: false });
const UserIdShowcase = dynamic(() => import('@/components/userIdShowcase'), { ssr: false });
const Header = dynamic(() => import('@/components/header'), { ssr: false });
const Login = dynamic(() => import('@/components/login'), { ssr: false });

export default function Home() {
    return (
        <div>
			<Header />
            <div className="content flex h-full min-h-screen">
                <div className="bg-blue-500 flex-1">
                    <Icon/>
                    <DropdownType />
                    {/* <UserIdShowcase /> */}
                    <Login />
                </div>
                <div className="about bg-orange-700 h-full w-5/6 px-6 py-2 min-h-screen">
                    <h1> Предметные дисциплины </h1>
                    <div className="flex flex-wrap">
                        {Object.keys(Discipline).map((key) => (
                            discipline_card({ key, Discipline: Discipline[key] })
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
