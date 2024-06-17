import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { useHistory } from "react-router-dom";

function TopMenu(){
    let history = useHistory();

    const logOut = () => {
        localStorage.removeItem("authorization");
        localStorage.removeItem("refresh-token");
        history.push("/login")
    }

    return (
    <ButtonGroup id="top_menu" variant="contained" color="primary" aria-label="outlined primary button group">
        <Button>Arrangementer</Button>
        <Button>Informasjon</Button>
        <Button onClick={logOut}>Logg ut</Button>
    </ButtonGroup>);
}

export default TopMenu;