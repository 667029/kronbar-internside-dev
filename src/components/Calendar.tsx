import React, { useState } from "react";
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import format from "date-fns/format";
import addMonths from "date-fns/addMonths";
import subMonths from "date-fns/subMonths";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import isSameMonth from "date-fns/isSameMonth";
import isToday from "date-fns/isToday";

const day_names = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
const month_names = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];

const DateTableCell = withStyles((theme) => ({
    body: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderStyle: 'solid',
        textAlign: 'left',
        paddingLeft: '1em',
        paddingRight: '1em',
        paddingTop: '0.5em',
        paddingBottom: '0.5em',
        height: 100,
        verticalAlign: 'top'
    },
}))(TableCell);

const NameTableCell = withStyles((theme) => ({
    body: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: 'lightgray',
        borderStyle: 'solid'
    },
}))(TableCell);

interface CalendarProps {
    darkMode: boolean;
}

export default function Calendar({ darkMode }: CalendarProps) {
    const theme = useTheme();
    const useStyles = makeStyles({
        disabled: {
            color: darkMode ? 'gray' : 'lightgray',
        },
        today: {
            backgroundColor: theme.palette.primary.light,
        },
        todayDisabled: {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.secondary.dark
        }

    });

    const classes = useStyles();

    const [currentDate, setCurrentDate] = useState<Date>(new Date())

    const calendarHeader = () => {
        const dateFormat = " yyyy";
        return (
            <TableRow className="header">
                <TableCell align="left" colSpan={2}>
                    <div className="icon" onClick={prevMonth}>
                        chevron_left
                    </div>
                </TableCell>
                <TableCell align="center" colSpan={3}>
                    <span>{month_names[currentDate.getMonth()] + format(currentDate, dateFormat)}</span>
                </TableCell>
                <TableCell align="right" colSpan={2}>
                    <div className="icon" onClick={nextMonth}>
                        chevron_right
                 </div>
                </TableCell>
            </TableRow>
        );
    };

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    }
    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    }

    const dayNames = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(
                <NameTableCell align="center" className="days">
                    {day_names[i]}
                </NameTableCell>
            );
        }
        return <TableRow>{days}</TableRow>;
    };

    const dates = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";
        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                days.push(
                    <DateTableCell className={`calendarDay ${!isSameMonth(day, monthStart) && isToday(day) ? classes.todayDisabled : !isSameMonth(day, monthStart) ? classes.disabled : isToday(day) ? classes.today : ""}`}>
                        <span className="number">{formattedDate}</span>
                    </DateTableCell>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <TableRow>
                    {days}
                </TableRow>
            );
            days = [];
        }
        return rows;
    }

    return (
        <div className="calendar">
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        {calendarHeader()}
                    </TableHead>
                    <TableBody>
                        {dayNames()}
                        {dates()}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}