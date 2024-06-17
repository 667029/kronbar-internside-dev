import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

interface CreateUserHttpStatusAlertProps {
    httpCode: number;
    resetHttpCode: () => void;
}

export default function CreateUserHttpStatusAlert({ httpCode, resetHttpCode }: CreateUserHttpStatusAlertProps) {
    const useStyles = makeStyles((theme) => ({
        alert: {
            marginTop: 10,
            marginBottom: 20
        }
    }));

    const classes = useStyles();

    const HttpAlert = () => {
        if(httpCode === 201){
            return <Alert severity="success" onClose={resetHttpCode} className={classes.alert}>Legende opprettet.</Alert>
        } else if(httpCode === 401){
            return <Alert severity="error" onClose={resetHttpCode}className={classes.alert}>Du er ikke autorisert. Logg inn på nytt.</Alert>
        } else if(httpCode === 409){
            return <Alert severity="error" onClose={resetHttpCode}className={classes.alert}>Det finnes allerede en bruker med den e-posten.</Alert>
        } else if(httpCode === 400){
            return <Alert severity="warning" onClose={resetHttpCode}className={classes.alert}>Det oppstod en feil. Noe informasjon mangler/er feil.</Alert>
        } else {
            return <div ></div>
        }
    }
    
    return(<HttpAlert />);
}
