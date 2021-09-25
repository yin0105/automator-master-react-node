import React, { Fragment, useState } from 'react';
import { Route } from 'react-router-dom';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  makeStyles,
  Snackbar,
} from '@material-ui/core';
import { Alert } from "@material-ui/lab";
import { blue } from '@material-ui/core/colors';
import Home from './pages/Home';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[600]
    },
    secondary: {
      main: blue[300]
    }
  }
});

const useStyles = makeStyles(theme => ({
  main: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  }
}))


const App = () => {
  const classes = useStyles();    
  const [openNotify, setOpenNotify] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyDuration, setNotifyDuration] = useState(3000);


  const handleCloseNotify = () => {
    setNotifyMessage("");
    setOpenNotify(false)
  }

  const openSnackBar = (title = "", message = "", duration = 3000) => {
    setOpenNotify(true);
    setNotifyMessage(title === "" ? message : `${title},  ${message}`);
    setNotifyDuration(duration)
  }

  return (
    <Fragment>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          {/* <AppHeader/> */}
          <main className={classes.main}>
              <Route exact path="/" > 
                <Home openSnackBar={openSnackBar} />
              </Route>
          </main>
          <Snackbar open={openNotify} autoHideDuration={notifyDuration} onClose={handleCloseNotify}>
              <Alert elevation={6} variant="filled" onClose={handleCloseNotify} severity="info">{notifyMessage}</Alert>
          </Snackbar>
        </ThemeProvider>
    </Fragment>
)};

export default App;

