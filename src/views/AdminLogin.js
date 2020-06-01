import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Typography } from '@material-ui/core'
import { lightOrange } from '../colors'
import Axios from 'axios'
import Apis from '../Apis'
import { setAdmin } from '../actions/admin'
import { useHistory } from 'react-router-dom'

export const AdminLogin = props => {

    const [preOtp, setPreOtp] = useState(true)
    const [mobileNumber, setMobileNumber] = useState("")
    const [otp, setOtp] = useState("")
    
    let history = useHistory();

    let login = () => {
        if (validateMobileNumber()) {
            Axios.post(Apis.admin_login, {
                mobileNumber: "+91"+mobileNumber
            }).then(res => {
                if (res.status == '200') {
                    setPreOtp(false)
                } else alert("Admin does not exist check mobile number")
            }).catch(err => {
                alert(JSON.stringify(err))
            })
        }
    }

    let confirmOtp = () => {
        if(otp !== "") {
            Axios.post(Apis.confirm_admin_otp, {
                mobileNumber: "+91"+mobileNumber,
                otp: otp
            }).then(res => {
                if(res.status == '200') {
                    localStorage.setItem('admin_token', res.data.token)
                    props.setAdmin({...res.data.admin, token: res.data.token})
                    history.push("/admin/dashboard")
                } else alert(res.data)
            }).catch(err => {
                alert("something went wrong")
            })
        }
    }

    let validateMobileNumber = () => {
        return true;
    }

    let handleMobileNumber = event => {
        setMobileNumber(event.target.value)
    }

    let handleOtp = event => {
        setOtp(event.target.value)
    }
    
    return (
        <div style={{height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {preOtp &&
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{padding: 10, textAlign: 'center'}}>
                        <Typography variant='h4'>Admin Login</Typography>
                    </div>
                    <TextField label="Mobile Number" variant="outlined" value={mobileNumber} 
                    onChange={handleMobileNumber} />
                    <Button variant="contained" style={{background: lightOrange, 
                        color: 'white', marginTop: 10}} onClick={() => login()}>Login</Button>
                </div>
            }

            {!preOtp &&
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{padding: 10, textAlign: 'center'}}>
                        <Typography variant='h4'>Admin Login</Typography>
                    </div>
                    <TextField label="Enter OTP" variant="outlined" value={otp} 
                    onChange={handleOtp} />
                    <Button variant="contained" style={{background: lightOrange, 
                        color: 'white', marginTop: 10}} onClick={() => confirmOtp()}>Confirm OTP</Button>
                </div>
            }
        </div>
    )
}

const mapStateToProps = state => {
    
}

const mapDispatchToProps = dispatch => {
    return {
        setAdmin: admin => dispatch(setAdmin(admin))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminLogin)
