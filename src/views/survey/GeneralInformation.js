import React, {useState, useEffect, useReducer} from 'react'
import { connect } from 'react-redux'
import { Button, AppBar, Toolbar, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { ArrowForward } from '@material-ui/icons'
import { setFamily } from '../../actions/family'
import Axios from 'axios'
import Apis from '../../Apis'
import { lightBlue, lightOrange, lightGrey, errorRed } from '../../colors'
import { useHistory } from 'react-router-dom'


let GeneralInformation = props => {

    let history = useHistory()

    let familyReducer = (state, action) => {
        if(action.type == 'setFamilyId') {
            state = {...state, familyId: Date.now().toString()}
        } else if (action.type == 'setAddress') {
            state = { ...state, address: action.payload}
        } else if (action.type == 'setContainmentArea') {
            state = { ...state, containmentArea: action.payload._id, block: action.payload.block }
        } else if (action.type == 'setZoneType') {
            state = { ...state, zoneType: action.payload}
        } else if (action.type == 'setDateOfSurvey') {
            state = { ...state, dateOfSurvey: action.payload }
        } else if (action.type == 'setSurveyOfficer') {
            state = {...state, surveyOfficer: action.payload}
        } else if (action.type == 'setNumberOfMembers') {
            state = { ...state, numberOfMembers: action.payload }
        }
        return state
    }

    let familyInit = { familyId: null, headName: '', headMobileNumber: '', headGovtIdType:  '', 
     headGovtIdNumber: '', address: '', block: null, containmentArea: null, zoneType: '',
     dateOfSurvey: new Date(), numberOfMembers: null, riskLevel: '', surveyOfficer: null }

    const [family, familyDispatch] = useReducer(familyReducer, familyInit)

    const [containmentAreas, setContainmentAreas] = useState([])
    const [containmentArea, setContainmentArea] = useState(null)


    useEffect(() => {
        familyDispatch({type: 'setSurveyOfficer', payload: props.officer._id})
        familyDispatch({type: 'setFamilyId', payload: Date.now().toString()})
        loadContainmentAreas()
        return () => {
            
        }
    }, [])

    let loadContainmentAreas = () => {
        Axios.get(Apis.containment_areas).then(res => {
            if(res.status == '200') setContainmentAreas(res.data.containment_areas)
        }).catch(err => console.log(err))
    }

    let sortByName = inputArray => {
        return inputArray.sort((aone, atwo) => {
            if(aone.name > atwo.name) return 1
            else if (aone.name < atwo.name) return -1
            else return 0
        })
    }

    let saveFamily = () => {
        if(validateInputs()){ 
            props.setFamily(family)
            history.push("/survey/family_members")
        }
    }

    let validateInputs = () => {
        
        return true;
    }

    return (
        <div>
            <div style={{position: 'fixed', top: 0, width: '100%', zIndex: 10}} >
                <AppBar position="static" >
                    <Toolbar style={{backgroundColor: 'green'}} >
                        <Typography variant="h6" style={{color: '#fafafa'}} >
                            General Information
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
            <div style={{marginTop: 70, display: 'flex', flexDirection: 'column', padding: 10}}>
                <FormControl variant="outlined" >
                    <InputLabel id="areaId" >Containment Area</InputLabel>
                    <Select label="Containment Area" labelId="areaId" value={containmentArea}
                     onChange={event => {familyDispatch({type: 'setContainmentArea', 
                     payload: event.target.value}); setContainmentArea(event.target.value) }} >
                         {sortByName(containmentAreas).map(area => (
                             <MenuItem value={area} >{area.name}</MenuItem>
                         ))}
                     </Select>
                </FormControl>
                <FormControl variant="outlined" style={{marginTop: 10}} >
                    <InputLabel id="zoneId" >Zone Type</InputLabel>
                    <Select label="Zone Type" labelId="zoneId" value={family.zoneType}
                     onChange={event => familyDispatch({type: 'setZoneType', 
                     payload: event.target.value})} >
                         
                        <MenuItem value="buffer" >Buffer Zone</MenuItem>
                        <MenuItem value="containment" >Containment Zone</MenuItem>
                         
                     </Select>
                </FormControl>
                
                <TextField variant="outlined" label="House Address" style={{marginTop: 10}} value={family.address} onChange={event => familyDispatch({type: 'setAddress', payload: event.target.value})} />

                <div style={{marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Typography variant="subtitle2" style={{marginLeft: 10,marginRight: 10}} >Survey Date</Typography>
                    <TextField variant="outlined" type="date"
                    value={family.dateOfSurvey} onChange={event => familyDispatch({
                        type: 'setDateOfSurvey', payload: event.target.value
                    })} />
                </div>
                <TextField variant="outlined" label="Number Of Family Members" type="number"
                style={{marginTop: 10}} value={family.numberOfMembers} onChange={event => familyDispatch(
                    {type: 'setNumberOfMembers', payload: event.target.value}
                )} />

                <div style={{marginTop: 50, marginBottom: 50, display: 'flex', flexDirection: 'row',
                   justifyContent: 'center', alignItems: 'center' }} >
                       <Button variant="contained" style={{backgroundColor: errorRed, color: '#fafafa'}} >Cancel</Button>
                
                       <Button variant="contained" style={{backgroundColor: lightBlue, 
                        color: '#fafafa', marginLeft: 10}} 
                        endIcon={<ArrowForward />} onClick={() => saveFamily()} >
                           Save and Go
                       </Button>
                </div>
            </div>
        </div>
    )
}

let mapStateToProps = state => {
    return {
        officer: state.survey_officer,
        family: state.family,
        members: state.members
    }
}

let mapActionsToProps = dispatch => {
    return {
        setFamily: family => dispatch(setFamily(family))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(GeneralInformation)