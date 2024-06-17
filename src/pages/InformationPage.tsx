import React from "react";
import TopMenu from "../components/TopMenu";
import Calendar from "../components/Calendar";

interface InformationProps {
    darkMode: boolean;
}

export default function InformationPage({darkMode} : InformationProps) {
    return (
    <div>
        <TopMenu />
        <Calendar darkMode={darkMode} />
    </div>);
}