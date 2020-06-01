import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core'
import { Menu, ExitToApp } from '@material-ui/icons'
import { setAdmin } from '../actions/admin'
import { useHistory } from 'react-router-dom'
import { lightBlue, lightOrange } from '../colors'


let AdminDashboard = props => {

    let history =  useHistory()

    useEffect(() => {
        if(!props.admin) {
            history.push("/");
        }
        return () => {
            
        }
    }, [])

    let logout = () => {
        localStorage.setItem('admin_token', null)
        setAdmin(null)
        history.push("/admin/login")
    }

    let surveyOfficers = () => {
        history.push("/admin/survey_officers")
    }

    let areaBlocks = () => {
        history.push("/admin/areablocks")
    }

    let containmentAreas = () => {
        history.push("/admin/containment_areas")
    }

    let quarantineCenters = () => {
        history.push("/admin/quarantine_centers")
    }

    let generalReport = () => {
        history.push("/admin/general_report")
    }

    return (
        <div style={{height: '100vh'}}>
            <AppBar position="static">
                <Toolbar style={{backgroundColor: 'green'}}>
                    <IconButton edge="start" aria-label="menu">
                        <Menu style={{color: "white"}} />
                    </IconButton>

                    <Typography variant="h6" style={{flexGrow: 1, marginLeft: 15}}>
                        Dashboard
                    </Typography>

                    <Typography variant="h6" style={{marginRight: 15}}>
                        {props.admin !== null ? props.admin.name : ''}
                    </Typography>

                    <IconButton edge="end" aria-label="logout" onClick={() => logout()}>
                        <ExitToApp style={{color: "white"}} />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <div>
                <div style={{marginTop: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    alignItems: 'center'}}>
                    <Button variant="contained" style={{backgroundColor: lightBlue, 
                        color: "#fafafa"}} onClick={() => surveyOfficers()}>
                            Survey Officers
                    </Button>

                    <Button variant="contained" style={{backgroundColor: lightBlue, 
                        color: "#fafafa", marginTop: 10}} onClick={() => areaBlocks()}>Area Blocks</Button>

                    <Button variant="contained" style={{backgroundColor: lightBlue, 
                        color: "#fafafa", marginTop: 10}} onClick={() => quarantineCenters()} >Quarantine Centers</Button>

                    <Button variant="contained" style={{backgroundColor: lightBlue, 
                        color: "#fafafa", marginTop: 10}} onClick={() => containmentAreas()} >Containment Areas</Button>

                    
                    <div style={{height: 50}}></div>



                    <Button variant="contained" style={{backgroundColor: lightOrange, 
                        color: "#fafafa"}} onClick={() => generalReport()} >General Report</Button>
                </div>
            </div>
        </div>
    )
}

let mapStateToProps = state => {
    return {
        admin: state.admin
    }
}

let mapActionsToProps = dispatch => {
    return {
        setAdmin: admin => dispatch(setAdmin(admin))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(AdminDashboard)