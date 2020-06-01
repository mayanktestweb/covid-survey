import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { AppBar, Toolbar, Typography, Dialog, TextField, Button, Checkbox } from '@material-ui/core'
import { ArrowForward } from '@material-ui/icons'
import { updateMemberByIndex } from '../../actions/members'
import { useHistory } from 'react-router-dom'
import { lightBlue, lightGrey, lightOrange } from '../../colors'



let TravelDetails = props => {

    let history = useHistory()

    const [openTravel, setOpenTravel] = useState(false)

    const [memberIndex, setMemberIndex] = useState(null)
    const [member, setMember] = useState(null)

    const [traveledFrom, setTraveledFrom] = useState(null)
    const [travelDate, setTravelDate] = useState(null)

    let cancelTravel = () => {
        setMember(null)
        setMemberIndex(null)
        setTravelDate(null)
        setTraveledFrom(null)
        setOpenTravel(false)
    }

    let startTravelDetails = ({index, member}) => {
        setTraveledFrom(member.traveledFrom)
        setTravelDate(member.travelDate)
        setMemberIndex(index)
        setMember(member)
        setOpenTravel(true)
    }

    let setTravelDetails = () => {
        props.updateMemberByIndex({index: memberIndex, member: {...member, 
            traveledFrom: traveledFrom, travelDate: travelDate}})
        cancelTravel()
    }

    let validInputDate = () => {
        let minDate = new Date()
        minDate.setDate(minDate.getDate() - 28)
        if((new Date(travelDate)) >= minDate) return 'white'
        else return 'pink'
    }

    let saveAndGo = () => {
        history.push("/survey/contact_exposure")
    }

    return (
        <div>
            <div style={{position: 'fixed', top: 0, width: '100%'}}>
                <AppBar position="static" >
                    <Toolbar style={{backgroundColor: 'green'}} >
                        <Typography variant="h6" style={{color: '#fafafa'}}>
                            Travel Details
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>

            <div style={{marginTop: 70}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', padding: 20}}>
                    <Typography variant="h6" style={{color: lightOrange, textAlign: 'center'}} >
                        Has anyone traveled within 28 days
                    </Typography>
                    <Typography variant="h6" style={{color: lightOrange, marginTop: 10, textAlign: 'center'}} >
                        28 दिनों के भीतर किसी ने भी यात्रा की है
                    </Typography>
                </div>
                <div>
                    {props.members.map((member, index) => (
                        <div style={{margin: 5, borderStyle: 'solid', borderWidth: 1,
                         borderColor: lightGrey, borderRadius: 5, padding: 5, display: 'flex',
                         flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}} 
                         onClick={() => startTravelDetails({index, member})} >
                             <Checkbox checked={member.traveledFrom !== null}></Checkbox>
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

            <Dialog open={openTravel} onClose={() => cancelTravel()}>
                <div style={{padding: 10, display: 'flex', flexDirection: 'column'}} >
                    <TextField variant="outlined" label="Traveled From" value={traveledFrom} onChange={event => setTraveledFrom(event.target.value)} />
                    
                    <div style={{marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Typography variant="subtitle2" style={{marginLeft: 10,marginRight: 10}} >Travel Date</Typography>
                        <TextField variant="outlined" type="date" style={{backgroundColor: validInputDate()}}
                        value={travelDate} onChange={event => setTravelDate(event.target.value)} />
                    </div>
                    
                    <div style={{padding: 10}}>
                        <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa'}} onClick={() => setTravelDetails()} >
                            Save
                        </Button>
                        <Button variant="text" style={{color: lightBlue, marginLeft: 10}} onClick={() => cancelTravel()} >
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
        members: state.members
    }
}

let mapActionsToProps = dispatch => {
    return {
        updateMemberByIndex: ({index, member}) => dispatch(updateMemberByIndex({index, member}))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(TravelDetails)