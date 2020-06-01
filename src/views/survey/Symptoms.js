import React, { useState } from 'react'
import { connect } from  'react-redux'
import { AppBar, Toolbar, Typography, Button, Checkbox, FormControl, Dialog, FormControlLabel } from '@material-ui/core'
import { ArrowForward } from '@material-ui/icons'
import { lightBlue, lightOrange, lightGrey } from '../../colors'
import { updateMemberByIndex } from '../../actions/members'
import { useHistory } from 'react-router-dom'


let Symptoms = props => {

    let history = useHistory()

    const [openSymptoms, setOpenSymptoms] = useState(false)
    const [symptoms, setSymptoms] = useState([])
    const [memberIndex, setMemberIndex] = useState(null)
    const [member, setmember] = useState(null)

    let startAddingSymptoms = ({index, member}) => {
        setMemberIndex(index)
        setmember(member)
        setSymptoms(member.symptoms)
        setOpenSymptoms(true)
    }

    let cancelSymptoms = () => {
        setMemberIndex(null)
        setmember(null)
        setSymptoms([])
        setOpenSymptoms(false)
    }

    let toggleSymptom = symptom => {
        if(symptoms.includes(symptom)) {
            let ss = [...symptoms]
            ss.forEach((item, index) => {
                if(item == symptom) ss.splice(index, 1)
            })
            setSymptoms(ss)
        } else setSymptoms([...symptoms, symptom])
    }

    let addSymptoms = () => {
        props.updateMemberByIndex({index: memberIndex, member: {...member, symptoms: symptoms}})
        setMemberIndex(null)
        setmember(null)
        setSymptoms([])
        setOpenSymptoms(false)
    }

    let saveAndGo = () => {
        history.push("/survey/deseases")
    }

    return (
        <div>
            <div style={{position: 'fixed', top: 0, width: '100%'}}>
                <AppBar position="static" >
                    <Toolbar style={{backgroundColor: 'green'}} >
                        <Typography variant="h6" style={{color: '#fafafa'}}>
                            Symptoms
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>

            <div style={{marginTop: 70}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', padding: 20}}>
                    <Typography variant="h6" style={{color: lightOrange, textAlign: 'center'}} >
                        Does anyone has symptoms of cold
                    </Typography>
                    <Typography variant="h6" style={{color: lightOrange, marginTop: 10, textAlign: 'center'}} >
                        क्या किसी को सर्दी के लक्षण हैं
                    </Typography>
                </div>
                <div>
                    {props.members.map((member, index) => (
                        <div style={{margin: 5, borderStyle: 'solid', borderWidth: 1,
                         borderColor: lightGrey, borderRadius: 5, padding: 5, display: 'flex',
                         flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}} 
                         onClick={() => startAddingSymptoms({index, member})} >
                             <Checkbox checked={member.symptoms.length > 0}></Checkbox>
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

            <Dialog open={openSymptoms} onClose={() => cancelSymptoms()} >
                <div style={{padding: 10, display: 'flex', flexDirection: 'column'}}>
                    <FormControl component="fieldset">
                        <FormControlLabel control={<Checkbox checked={symptoms.includes("cold")} value="cold" onChange={() => toggleSymptom('cold')} />} label="Cold जुकाम" />
                        <FormControlLabel control={<Checkbox checked={symptoms.includes("cough")} value="cough" onChange={() => toggleSymptom('cough')} />} label="Cough खांसी" />
                        <FormControlLabel control={<Checkbox checked={symptoms.includes("fever")} value="fever" onChange={() => toggleSymptom('fever')} />} label="Fever बुखार" />
                        <FormControlLabel control={<Checkbox checked={symptoms.includes("short_breating")} value="short_breathing" onChange={() => toggleSymptom('short_breathing')} />} label="Short Breating सांस लेने में तकलीफ" />
                    </FormControl>
                    <div style={{padding: 10, display: 'flex', flexDirection: 'row'}} >
                        <Button variant="contained" style={{backgroundColor: lightBlue,
                             color: '#fafafa'}} onClick={() => addSymptoms()} >
                            Save
                        </Button>
                        <Button variant="text" style={{color: lightBlue, marginLeft: 10}} onClick={() => cancelSymptoms()} >
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

export default connect(mapStateToProps, mapActionsToProps)(Symptoms)