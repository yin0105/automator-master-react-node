import React from 'react';
import { CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        width: '100%',
        minHeight: 400,
        justifyContent: "center",
        alignItems: "center"
    }
}))

const CircleLoading = () => {
    const classes = useStyles();
    return <div className={classes.root}>
        <CircularProgress />
    </div>
}

export default CircleLoading;