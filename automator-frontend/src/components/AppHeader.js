import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    withStyles,
} from '@material-ui/core';

const styles = {
    flex: {
        flex:1,
    },
};

const AppHeader = ({ classes }) => (
    <AppBar position = "fixed" color="primary"  >
    <Toolbar >
        <Typography variant = "h6"
            color = "inherit" >
            CRIDB
        </Typography>
    </Toolbar>
</AppBar>
);

export default withStyles(styles)(AppHeader);