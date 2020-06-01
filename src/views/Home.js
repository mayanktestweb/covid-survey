import React, {useState, useEffect} from 'react'
import {Button, Typography} from '@material-ui/core'
import { useLocation, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import Axios from 'axios'
import Apis from '../Apis'
import { setAdmin } from '../actions/admin'

let Home = props => {

    let location = useLocation()
    let history = useHistory()

    useEffect(() => {
        
        let token = localStorage.getItem('admin_token')

        if(token) {
            // validate token
            Axios({
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                },
                url: Apis.validate_admin_token,
                method: 'POST'
            }).then(res => {
                if(res.status == '200') {
                    if(res.data.status == 'valid') {

                        props.setAdmin({...res.data.admin, token: token})
                        history.push("/admin/dashboard")
                    } else goToLogin()
                }
            }).catch(err => {
                window.alert("Something went wrong")
            })
        } else goToLogin()

        return () => {
            
        }
    }, [])

    let goToLogin = () => {
        history.push('/admin/login')
    }

    return (
        <div style={{display: 'flex', height: '100vh', justifyContent:'center', alignItems: 'center'}}>
            <Typography variant="h2">Logo</Typography>
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

export default connect(mapStateToProps, mapActionsToProps)(Home);