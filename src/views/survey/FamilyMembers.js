import React, { useState, useReducer } from 'react'
import { connect } from 'react-redux'
import { AppBar, Toolbar, Typography, List, ListItem, Button, Dialog, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { Add, ArrowForward } from '@material-ui/icons'
import { setMembers, addMember } from '../../actions/members'
import { lightBlue, lightOrange, lightGrey } from '../../colors'
import { useHistory } from 'react-router-dom'


let FamilyMembers = props => {

    const [openAddMember, setOpenAddMember] = useState(false)
    let history = useHistory()

    let memberInit = { name: '', age: '', sex: '', mobileNumber: '', govtIdType: '',
     govtIdNumber: '', address: props.family.address, block: props.family.block, 
     containmentArea: props.family.containmentArea, zoneType: props.family.zoneType,
     surveyDate: props.family.dateOfSurvey, surveyOfficer: props.family.surveyOfficer,
     symptoms: [], deseases: [], pregnancy: false, traveledFrom: null, travelDate: null,
     sourceContacted: null, contactNature: null, contactRelation: null, riskLevel: 'none',
     selectedForSample: false, quarantined: false, quarantineDate: null, homeQuarantined: false, 
     quarantineCenter: null, releaseDate: null}

    let memberReducer = (state, action) => {
        if(action.type == 'setName') state = {...state, name: action.payload}
        else if (action.type == 'setAge') state = {...state, age: action.payload}
        else if (action.type == 'setSex') state = {...state, sex: action.payload}
        else if (action.type == 'setMobileNumber') state = {...state, mobileNumber: action.payload}
        else if (action.type == 'setGovtIdType') state = {...state, govtIdType: action.payload}
        else if (action.type == 'setGovtIdNumber') state = {...state, govtIdNumber: action.payload}
        else if (action.type == 'reset') state = memberInit
        return state;
    }

    const [member, mDispatch] = useReducer(memberReducer, memberInit)

    let addMember = () => {
        props.addMember(member)
        mDispatch({type: 'reset'})
        setOpenAddMember(false)
    }

    let goToFamilyHead = () => {
        history.push("/survey/family_head")
    }

    return (
        <div>
            <div style={{position: 'fixed', top: 0, width: '100%'}}>
                <AppBar position="static" >
                    <Toolbar style={{backgroundColor: 'green'}} >
                        <Typography variant="h6" style={{color: '#fafafa'}}>
                            Family Members
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>

            <div style={{marginTop: 70}} >
                <div style={{padding: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                    {(props.members.length == 0) &&
                        <Typography variant="h6" style={{color: lightOrange}} >
                            Add Members
                        </Typography>
                    }

                    {(props.members.length !== 0 && props.members.length < props.family.numberOfMembers) &&
                        <Typography variant="h6" style={{color: lightOrange}} >
                            Add {props.family.numberOfMembers - props.members.length} More Members
                        </Typography>
                    }
                </div>
                {(props.members.length > 0) &&
                    <List>
                        {props.members.map((member, index) => (
                            <div style={{padding: 5, margin: 5, display: 'flex', flexDirection: 'row', 
                            alignItems: 'center', justifyContent: 'space-around', borderWidth: 1,
                            borderColor: lightGrey, borderRadius: 5, borderStyle: 'solid' }} >
                                <Typography variant="subtitle2" >{index+1}</Typography>
                                <Typography variant="subtitle2" >{member.name}</Typography>
                                <Typography variant="subtitle2" >{member.age}</Typography>
                            </div>
                        ))}
                    </List>
                }
                <div style={{padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                    {(props.members.length == props.family.numberOfMembers)
                        ? <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa', marginLeft: 10}} 
                            endIcon={<ArrowForward />} onClick={() => goToFamilyHead()} >
                               Save and Go
                           </Button>
                        : <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa', marginLeft: 10}} 
                            startIcon={<Add />} onClick={() => setOpenAddMember(true)} >
                               Add Member
                           </Button>
                    }
                </div>
            </div>

            <Dialog open={openAddMember} onClose={() => setOpenAddMember(false)} >
                <div style={{padding: 10, display: 'flex', flexDirection: 'column'}} >
                    <TextField variant="outlined" label="Name" value={member.name} onChange={event => mDispatch({type: 'setName', payload: event.target.value})} />
                    <TextField variant="outlined" label="Age" value={member.age} onChange={event => mDispatch({type: 'setAge', payload: event.target.value})} style={{marginTop: 10}} />
                    <FormControl variant="outlined" style={{marginTop: 10}} >
                        <InputLabel id="sexId" >Sex</InputLabel>
                        <Select label="Sex" labelId="sexId" value={member.sex} onChange={event => mDispatch({type: 'setSex', payload: event.target.value})} >
                            <MenuItem value="male" >Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other" >Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField type='number' variant="outlined" label="Mobile Number" value={member.mobileNumber} onChange={event => mDispatch({type: 'setMobileNumber', payload: event.target.value})} style={{marginTop: 10}} />
                    <FormControl variant="outlined" style={{marginTop: 10}} >
                        <InputLabel id="govtIdTypeId" >Government ID Type</InputLabel>
                        <Select label="Government ID Type" labelId="govtIdTypeId" value={member.govtIdType} onChange={event => mDispatch({type: 'setGovtIdType', payload: event.target.value})} >
                            <MenuItem value="adhar" >Adhar Card</MenuItem>
                            <MenuItem value="voter">Voter Card</MenuItem>
                            <MenuItem value="pan" >Pan Card</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField variant="outlined" style={{marginTop: 10}} label="Government ID Number" value={member.govtIdNumber} onChange={event => mDispatch({type: 'setGovtIdNumber', payload: event.target.value})} />
                    <div style={{padding: 10}}>
                        <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa'}} onClick={() => addMember()} >
                            Save
                        </Button>
                        <Button variant="text" style={{color: lightBlue, marginLeft: 10}} onClick={() => setOpenAddMember(false)} >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>

        </div>
    )
}

let mapStateToProps = state => {
    return {
        family: state.family,
        members: state.members
    }
}

let mapActionsToProps = dispatch => {
    return {
        setMembers: members => dispatch(setMembers(members)),
        addMember: member => dispatch(addMember({...member}))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(FamilyMembers)