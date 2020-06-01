import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Typography } from '@material-ui/core'
import { lightOrange } from '../../colors'
import Axios from 'axios'
import Apis from '../../Apis'
import { useHistory } from 'react-router-dom'
import { setSurveyOfficer } from '../../actions/survey_officer'

let Login = props => {

    const [preOtp, setPreOtp] = useState(true)
    const [mobileNumber, setMobileNumber] = useState("")
    const [otp, setOtp] = useState("")
    
    let history = useHistory();

    let login = () => {
        if (validateMobileNumber()) {
            Axios.post(Apis.survey_officer_login , {
                mobileNumber: "+91"+mobileNumber
            }).then(res => {
                if (res.status == '200') {
                    setPreOtp(false)
                } else alert("Mobile Number is not registered")
            }).catch(err => {
                alert(JSON.stringify(err))
            })
        }
    }

    let confirmOtp = () => {
        if(otp !== "") {
            Axios.post(Apis.confirm_survey_otp, {
                mobileNumber: "+91"+mobileNumber,
                otp: otp
            }).then(res => {
                if(res.status == '200') {
                    localStorage.setItem('survey_officer_token', res.data.officer.token)
                    props.setSurveyOfficer(res.data.officer)
                    history.push("/survey/dashboard")
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
                        <Typography variant='h4'>Login</Typography>
                    </div>
                    <TextField label="Mobile Number" type="number" variant="outlined" value={mobileNumber} 
                    onChange={handleMobileNumber} />
                    <Button variant="contained" style={{background: lightOrange, 
                        color: 'white', marginTop: 10}} onClick={() => login()}>Login</Button>
                </div>
            }

            {!preOtp &&
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{padding: 10, textAlign: 'center'}}>
                        <Typography variant='h4'>Login</Typography>
                    </div>
                    <TextField label="Enter OTP" type="number" variant="outlined" value={otp} 
                    onChange={handleOtp} />
                    <Button variant="contained" style={{background: lightOrange, 
                        color: 'white', marginTop: 10}} onClick={() => confirmOtp()}>Confirm OTP</Button>
                </div>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        officer: state.survey_officer
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setSurveyOfficer: officer => dispatch(setSurveyOfficer(officer))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
