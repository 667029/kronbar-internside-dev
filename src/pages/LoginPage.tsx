import React, { FormEvent, useState } from "react";
import { Container, makeStyles, Typography, TextField, FormControlLabel, Checkbox, Button, Link, Box } from "@material-ui/core";
import logo_burgundy from '../images/logo/Kronbar_burgundy_no_name_150.png';
import logo_white from '../images/logo/Kronbar_white_no_name_150.png';
import axios from 'axios';
import { API_BASE_URL } from "../constants";
import Alert from '@material-ui/lab/Alert';
import { Redirect } from "react-router";
import { isExpired } from "react-jwt";
import { useHistory } from "react-router-dom";

interface LoginProps {
    darkMode: boolean;
}

const SignInStatus = (httpCode: number, resetHttpCode: () => void) => {
    const useStyles = makeStyles((theme) => ({
        alert: {
            marginTop: 10,
            marginBottom: 20
        }
    }));

    const classes = useStyles();

    const HttpAlert = () => {
        if (httpCode === 401) {
            return <Alert severity="error" onClose={resetHttpCode} className={classes.alert}>Feil brukernavn eller passord.</Alert>
        } else if (httpCode === 400) {
            return <Alert severity="warning" onClose={resetHttpCode} className={classes.alert}>Det oppstod en feil.</Alert>
        } else {
            return <div ></div>
        }
    }

    return (<HttpAlert />);
}
  

export default function LoginPage({ darkMode }: LoginProps) {
    let history = useHistory();

    const useStyles = makeStyles((theme) => ({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        form: {
            width: '100%',
            marginTop: theme.spacing(1),
            '& label.Mui-focused': {
                color: darkMode ? 'white' : theme.palette.primary.main,
            },
            '& .MuiInput-underline:after': {
                borderBottomColor: darkMode ? 'white' : theme.palette.primary.main,
            },
            '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                    borderColor: darkMode ? 'white' : theme.palette.primary.main,
                },
            },
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
        link: {
            color: darkMode ? theme.palette.secondary.main : theme.palette.primary.main,
        },
        typography: {
            marginTop: 25,
            marginBottom: 25
        }
    }));

    const RefreshToken = () => { 
        const jwtToken = localStorage.getItem("authorization");
        const refreshToken = localStorage.getItem("refresh-token");
        const isLoggedIn = jwtToken !== null && !isExpired(jwtToken);
        if(!isLoggedIn){
            localStorage.removeItem("authorization");
            if(refreshToken && !isExpired(refreshToken)){
                axios.post(`${API_BASE_URL}/api/authenticate/refresh`, refreshToken)
                    .then((res: any) => {
                        localStorage.setItem("authorization", res.data.jwt);
                        localStorage.setItem("refresh-token", res.data.refreshJwt);
                        history.goBack();
                });
          } else if (refreshToken){  
            localStorage.removeItem("refresh-token");
          }
        } else {    
            history.push("/")   
        }
    }

    const classes = useStyles();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [httpStatusCode, setHttpStatusCode] = useState(0);
    const [redirect, setRedirect] = useState(false);
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setHttpStatusCode(0);

        const user = {
            password: password,
            username: username
        }
        axios.post(`${API_BASE_URL}/api/authenticate`, user)
            .then((res: any) => {
                localStorage.setItem("authorization", res.data.jwt);
                localStorage.setItem("refresh-token", res.data.refreshJwt);
                setRedirect(true)
                history.push("/");
            }).catch(function (error) {
                if(error && error.response && error.response.status){
                    setHttpStatusCode(error.response.status)
                } else {
                    setHttpStatusCode(400);
                }
            });
    }

    const jwtToken = localStorage.getItem("authorization");

    RefreshToken();

    return (
        <Container maxWidth="xs">
            {(redirect || jwtToken !== null) && <Redirect to="/" />}
            <div className={classes.paper}>
                <img src={darkMode ? logo_white : logo_burgundy} height='70px' alt="" />
                <Box m={0.5} />
                <Typography component="h1" variant="h5" className={classes.typography}>
                    Logg inn
                </Typography>
                {SignInStatus(httpStatusCode, () => { setHttpStatusCode(0) })}
                <form className={classes.form} onSubmit={handleSubmit} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="phone"
                        label="Telefon"
                        name="phone"
                        autoComplete="tel-national"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Passord"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Logg inn
                    </Button>
                    <Box display="flex">
                        <Box width="100%" p={1}>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Husk meg"
                            />
                        </Box>
                        <Box alignSelf="flex-end" p={1}>
                            <Link href="#" variant="body2" className={classes.link}>
                                Glemt passord?
                            </Link>
                        </Box>
                    </Box>
                </form>
            </div>
        </Container>);
}