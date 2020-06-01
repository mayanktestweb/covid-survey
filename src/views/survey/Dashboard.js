import React from 'react'
import { connect } from 'react-redux'
import { Typography, Button, AppBar, Toolbar, IconButton } from '@material-ui/core'
import { ExitToApp, Menu } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import { lightBlue } from '../../colors'


let Dashboard = props => {

    let history = useHistory()

    let logout = () => {
        localStorage.setItem('survey_officer_token', null)
        history.push("/survey/login")
    }

    let startNewSurvey = () => history.push("/survey/general_information")

    return (
        <div style={{height: '100vh'}}>
            <AppBar position="static">
                <Toolbar style={{backgroundColor: 'green'}}>
                    <IconButton edge="start" aria-label="menu">
                        <Menu style={{color: "white"}} />
                    </IconButton>

                    <div style={{flexGrow: 1, marginLeft: 15}}>
                        
                    </div>


                    <IconButton edge="end" aria-label="logout" onClick={() => logout()}>
                        <ExitToApp style={{color: "white"}} />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <div>
                <div style={{marginTop: 50, display: 'flex', flexDirection: 'column', 
                alignItems: 'center'}}>
                    <Button variant="contained" style={{backgroundColor: lightBlue, color: '#fafafa'}}
                     onClick={() => startNewSurvey()} >
                        Start New Survey
                    </Button>
                </div>
            </div>

        </div>
    )
}


let mapStateToProps = state => {
    return {
        officer: state.survey_officer
    }
}

export default connect(mapStateToProps)(Dashboard)