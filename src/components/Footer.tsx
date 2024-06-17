import React, { ChangeEvent } from 'react';
import Switch from "@material-ui/core/Switch";
import { Typography } from '@material-ui/core';

interface FooterProps {
    darkMode: boolean;
    handleThemeChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

function Footer({ darkMode, handleThemeChange }: FooterProps) {
    return(
        <div id="dark-mode-switch">
            <Typography>Dark Mode</Typography>
            <Switch checked={darkMode} onChange={handleThemeChange} />
          </div>);
}

export default Footer;