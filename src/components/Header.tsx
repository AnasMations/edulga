import React from "react";
import Image from "next/image";
import IconEdulga from "@/assets/IconEdulga";

interface Props {
    className?: string;
}

const Header = ({ className }: Props) => {

    // return <div className=" z-10 fixed h-[100px] top-0 w-screen bg-gray-300 backdrop-blur-lg shadow-lg">
    //     <IconEdulga className="h-[88px]" />
    // </div>;

    return (
        <div className="flex items-center justify-start p-4 w-full">
            <IconEdulga className="h-[88px]" />
            <b>BETA</b>
        </div>
    );
}

export default Header;