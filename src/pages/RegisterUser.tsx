import React, { FormEvent, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo_burgundy from '../images/logo/Kronbar_burgundy_no_name_150.png';
import logo_white from '../images/logo/Kronbar_white_no_name_150.png';
import axios from 'axios';
import CreateUserHttpStatusAlert from '../components/CreateUserHttpStatusAlert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { API_BASE_URL } from '../constants';

interface RegisterProps {
    darkMode: boolean;
}

export default function RegisterUser({ darkMode }: RegisterProps) {
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

    const classes = useStyles();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [emailErrorHelp, setEmailErrorHelp] = useState("");
    const [firstName, setFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState(false);
    const [firstNameErrorHelp, setFirstNameErrorHelp] = useState("");
    const [lastName, setLastName] = useState("");
    const [lastNameError, setLastNameError] = useState(false);
    const [lastNameErrorHelp, setLastNameErrorHelp] = useState("");
    const [pasword, setPassword] = useState("");
    const [paswordError, setPasswordError] = useState(false);
    const [paswordErrorHelp, setPasswordErrorHelp] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [phoneNumberErrorHelp, setPhoneNumberErrorHelp] = useState("");
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const [httpStatusCode, setHttpStatusCode] = useState(0);

    const validateEmail = () => {
        if (email.length < 1) {
            setEmailError(true);
            setEmailErrorHelp("Kan ikke være tom.");
            return false;
        } else if (!email.includes("@") || !email.split('@')[1].includes(".")) {
            setEmailError(true);
            setEmailErrorHelp("E-posten må være gyldig.");
            return false;
        } else {
            setEmailError(false);
            setEmailErrorHelp("");
            return true;
        }
    }

    const validateFirstName = () => {
        if (firstName.length < 1) {
            setFirstNameError(true);
            setFirstNameErrorHelp("Kan ikke være tom.");
            return false;
        } else if (firstName.length > 50) {
            setFirstNameError(true);
            setFirstNameErrorHelp("Navnet kan ikke være lengre enn 50 bokstaver langt.");
            return false;
        } else {
            setFirstNameError(false);
            setFirstNameErrorHelp("");
            return true;
        }
    }

    const validateLastName = () => {
        if (lastName.length < 1) {
            setLastNameError(true);
            setLastNameErrorHelp("Kan ikke være tom.");
            return false;
        } else if (lastName.length > 50) {
            setLastNameError(true);
            setLastNameErrorHelp("Navnet kan ikke være lengre enn 50 bokstaver langt.");
            return false;
        } else {
            setLastNameError(false);
            setLastNameErrorHelp("");
            return true;
        }
    }

    const validatePhoneNumber = () => {
        if (phoneNumber.length === 0) {
            setPhoneNumberError(true);
            setPhoneNumberErrorHelp("Kan ikke være tom.");
            return false;
        } else if (!Number(phoneNumber)) {
            setPhoneNumberError(true);
            setPhoneNumberErrorHelp("Kun tall.");
            return false;
        } else if (phoneNumber.length < 8 || phoneNumber.length > 8) {
            setPhoneNumberError(true);
            setPhoneNumberErrorHelp("Må være 8 tall.");
            return false;
        } else {
            setPhoneNumberError(false);
            setPhoneNumberErrorHelp("");
            return true;
        }
    }

    const valdidatePassword = () => {
        if (pasword.length === 0) {
            setPasswordError(true);
            setPasswordErrorHelp("Kan ikke være tom.");
            return false;
        } else if (pasword.length < 8) {
            setPasswordError(true);
            setPasswordErrorHelp("Må være minimum 8 tegn.");
            return false;
        } else {
            setPasswordError(false);
            setPasswordErrorHelp("");
            return true;
        }
    }

    const formIsValid = () => {
        var validForm: boolean = true;
        validForm = validateEmail() && validForm;
        validForm = validateFirstName() && validForm;
        validForm = validateLastName() && validForm;
        validForm = validatePhoneNumber() && validForm;
        validForm = valdidatePassword() && validForm;

        return validForm;
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        setPostingUser(true);
        event.preventDefault();
        setHttpStatusCode(0);

        if (formIsValid() === true) {
            setSubmitEnabled(false);

            const user = {
                "email": email,
                "firstname": firstName,
                "lastname": lastName,
                "password": pasword,
                "phoneNumber": phoneNumber
            }

            axios.put(`${API_BASE_URL}/api/users`, user)
                .then((res: any) => {
                    setEmail("");
                    setFirstName("");
                    setLastName("");
                    setPassword("");
                    setPhoneNumber("");
                    setHttpStatusCode(res.status)
                }).catch(function (error) {
                    setHttpStatusCode(error.response.status)
                    console.log(error)
                }).then(() => {
                    setSubmitEnabled(true);
                    setPostingUser(false);
                });
        } else {
            setPostingUser(false);
        }
    }

    const [postingUser, setPostingUser] = useState(false);
    const [loading, setLoading] = useState(<div />);
    useEffect(() => {
        if (postingUser) {
            setLoading(<CircularProgress />)
        } else {
            setLoading(<div />);
        }
    }, [postingUser])


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <img src={darkMode ? logo_white : logo_burgundy} height='70px' alt="" />
                <Typography component="h1" variant="h5" className={classes.typography}>
                    Registrer bruker
                </Typography>
                <CreateUserHttpStatusAlert httpCode={httpStatusCode} resetHttpCode={() => { setHttpStatusCode(0) }} />
                <form className={classes.form} onSubmit={handleSubmit} noValidate>
                    <FormControl>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="Fornavn"
                                    error={firstNameError}
                                    helperText={firstNameErrorHelp}
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Etternavn"
                                    name="lastName"
                                    autoComplete="lname"
                                    helperText={lastNameErrorHelp}
                                    error={lastNameError}
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="phone"
                                    label="Telefon"
                                    name="phone"
                                    autoComplete="tel-national"
                                    helperText={phoneNumberErrorHelp}
                                    error={phoneNumberError}
                                    value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="E-post"
                                    name="email"
                                    autoComplete="email"
                                    error={emailError}
                                    helperText={emailErrorHelp}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Passord"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    helperText={paswordErrorHelp}
                                    error={paswordError}
                                    value={pasword}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={!submitEnabled}
                        >
                            Registrer
                        </Button>
                    </FormControl>
                </form>
                    {loading}
            </div>
            <Box mt={5}>
            </Box>
        </Container>
    );
}