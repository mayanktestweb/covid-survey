import React, {useState, useEffect} from 'react'
import {Button, Typography} from '@material-ui/core'
import { useLocation, useHistory } from 'react-router-dom'
import {connect} from 'react-redux'

let Koka = props => {

    let history = useHistory()
    let location = useLocation()

    let goToHome = () => {
        history.push("/")
    }

    return (
        <div>
            <Typography variant="h2">Koka </Typography>
            <Button color="primary" variant="contained" onClick={() => goToHome()}>Home</Button>
        </div>
    )
}

let mapStateToProps = state => {
    return {
        admin: state.admin
    }
}

export default connect(mapStateToProps)(Koka);