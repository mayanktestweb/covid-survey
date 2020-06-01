import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'
import Apis from '../../Apis'
import { setSurveyOfficer } from '../../actions/survey_officer'


let Main = props => {

    let history = useHistory()

    useEffect(() => {
        let token = localStorage.getItem('survey_officer_token')

        if(token) {
            Axios({
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                },
                url: Apis.validate_survey_token,
                method: 'POST'
            }).then(res => {
                if(res.status == '200') {
                    props.setSurveyOfficer(res.data.officer)
                    history.push("/survey/dashboard")
                } else history.push("/survey/login")
            }).catch(err => {
                console.log(err)
                history.push("/survey/login")
            })
        } else {
            history.push("/survey/login")
        }

        return () => {
            
        }
    }, [])

    return (
        <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
            <Typography variant="h4" >LOGO</Typography>
        </div>
    )
}


let mapStateToProps = state => {
    return {
        officer: state.survey_officer
    }
}

let mapActionsToProps = dispatch=> {
    return {
        setSurveyOfficer: officer => dispatch(setSurveyOfficer(officer))
    }
}


export default connect(mapStateToProps, mapActionsToProps)(Main)