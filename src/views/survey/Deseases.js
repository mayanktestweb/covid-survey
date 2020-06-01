import React, { useState } from 'react'
import { connect } from  'react-redux'
import { AppBar, Toolbar, Typography, Button, Checkbox, FormControl, Dialog, FormControlLabel } from '@material-ui/core'
import { ArrowForward } from '@material-ui/icons'
import { lightBlue, lightOrange, lightGrey } from '../../colors'
import { updateMemberByIndex } from '../../actions/members'
import { useHistory } from 'react-router-dom'


let Deseases = props => {

    let history = useHistory()

    const [openDeseases, setOpenDeseases] = useState(false)
    const [deseases, setDeseases] = useState([])
    const [memberIndex, setMemberIndex] = useState(null)
    const [member, setmember] = useState(null)

    let startAddingDeseases = ({index, member}) => {
        setMemberIndex(index)
        setmember(member)
        setDeseases(member.deseases)
        setOpenDeseases(true)
    }

    let cancelDeseases = () => {
        setMemberIndex(null)
        setmember(null)
        setDeseases([])
        setOpenDeseases(false)
    }

    let toggleDesease = desease => {
        if(deseases.includes(desease)) {
            let ss = [...deseases]
            ss.forEach((item, index) => {
                if(item == desease) ss.splice(index, 1)
            })
            setDeseases(ss)
        } else setDeseases([...deseases, desease])
    }

    let addDeseases = () => {
        props.updateMemberByIndex({index: memberIndex, member: {...member, deseases: deseases}})
        setMemberIndex(null)
        setmember(null)
        setDeseases([])
        setOpenDeseases(false)
    }

    let saveAndGo = () => {
        history.push("/survey/pregnancy")
    }

    return (
        <div>
            <div style={{position: 'fixed', top: 0, width: '100%'}}>
                <AppBar position="static" >
                    <Toolbar style={{backgroundColor: 'green'}} >
                        <Typography variant="h6" style={{color: '#fafafa'}}>
                            Deseases
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>

            <div style={{marginTop: 70}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', padding: 20}}>
                    <Typography variant="h6" style={{color: lightOrange, textAlign: 'center'}} >
                        Does anyone has severe deseases
                    </Typography>
                    <Typography variant="h6" style={{color: lightOrange, marginTop: 10, textAlign: 'center'}} >
                        क्या किसी को गंभीर बीमारियाँ हैं
                    </Typography>
                </div>
                <div>
                    {props.members.map((member, index) => (
                        <div style={{margin: 5, borderStyle: 'solid', borderWidth: 1,
                         borderColor: lightGrey, borderRadius: 5, padding: 5, display: 'flex',
                         flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}} 
                         onClick={() => startAddingDeseases({index, member})} >
                             <Checkbox checked={member.deseases.length > 0}></Checkbox>
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

            <Dialog open={openDeseases} onClose={() => cancelDeseases()} >
                <div style={{padding: 10, display: 'flex', flexDirection: 'column'}}>
                    <FormControl component="fieldset">
                        <FormControlLabel control={<Checkbox checked={deseases.includes("sugar")} value="sugar" onChange={() => toggleDesease('sugar')} />} label="Sugar शुगर" />
                        <FormControlLabel control={<Checkbox checked={deseases.includes("blood_pressure")} value="blood_pressure" onChange={() => toggleDesease('blood_pressure')} />} label="Blood Pressure रक्तचाप" />
                        <FormControlLabel control={<Checkbox checked={deseases.includes("diabetes")} value="diabetes" onChange={() => toggleDesease('diabetes')} />} label="Diabetes मधुमेह" />
                        <FormControlLabel control={<Checkbox checked={deseases.includes("cancer")} value="cancer" onChange={() => toggleDesease('cancer')} />} label="Cancer कैंसर" />
                    </FormControl>
                    <div style={{padding: 10, display: 'flex', flexDirection: 'row'}} >
                        <Button variant="contained" style={{backgroundColor: lightBlue,
                             color: '#fafafa'}} onClick={() => addDeseases()} >
                            Save
                        </Button>
                        <Button variant="text" style={{color: lightBlue, marginLeft: 10}} onClick={() => cancelDeseases()} >
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

export default connect(mapStateToProps, mapActionsToProps)(Deseases)