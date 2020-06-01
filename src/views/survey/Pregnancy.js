import React, { useState } from 'react'
import { connect } from  'react-redux'
import { AppBar, Toolbar, Typography, Button, Checkbox, FormControl, Dialog, FormControlLabel } from '@material-ui/core'
import { ArrowForward } from '@material-ui/icons'
import { lightBlue, lightOrange, lightGrey } from '../../colors'
import { updateMemberByIndex } from '../../actions/members'
import { useHistory } from 'react-router-dom'


let Pregnancy = props => {

    let history = useHistory()

    let togglePregnancy = ({index, member}) => {
        props.updateMemberByIndex({index: index, member: {...member, pregnancy: !member.pregnancy}})
    }

    let saveAndGo = () => {
        history.push("/survey/travel_details")
    }

    return (
        <div>
            <div style={{position: 'fixed', top: 0, width: '100%'}}>
                <AppBar position="static" >
                    <Toolbar style={{backgroundColor: 'green'}} >
                        <Typography variant="h6" style={{color: '#fafafa'}}>
                            Pregnancy Status
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>

            <div style={{marginTop: 70}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', padding: 20}}>
                    <Typography variant="h6" style={{color: lightOrange, textAlign: 'center'}} >
                        Is anyone pregnant
                    </Typography>
                    <Typography variant="h6" style={{color: lightOrange, marginTop: 10, textAlign: 'center'}} >
                        क्या कोई गर्भवती है
                    </Typography>
                </div>
                <div>
                    {props.members.map((member, index) => (
                        <div style={{margin: 5, borderStyle: 'solid', borderWidth: 1,
                         borderColor: lightGrey, borderRadius: 5, padding: 5, display: 'flex',
                         flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}} 
                         onClick={() => togglePregnancy({index, member})} >
                             <Checkbox checked={member.pregnancy}></Checkbox>
                             <Typography variant="subtitle2">{member.name + " ("+member.age+")"}</Typography>
                         </div>
                    ))}
                </div>
                <div style={{padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa', marginLeft: 10}} 
                            endIcon={<ArrowForward />} onClick={() => saveAndGo()} >
                               Save and Go
                        </Button>
                </div> 
            </div>
        </div>
    )
}

let mapStateToProps = state => {
    return {
        members: state.members
    }
}

let mapActionsToProps = dispatch => {
    return {
        updateMemberByIndex: ({index, member}) => dispatch(updateMemberByIndex({index, member}))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(Pregnancy)