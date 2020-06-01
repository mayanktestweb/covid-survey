import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { AppBar, Toolbar, Typography, Button, Checkbox, Divider, TextField, FormControl, FormControlLabel, Dialog, Select, MenuItem, InputLabel, CircularProgress } from '@material-ui/core'
import { ArrowForward, Save } from '@material-ui/icons'
import Axios from 'axios'
import Apis from '../../Apis'
import { lightBlue, lightOrange, veryLightGrey, lightGrey } from '../../colors'
import { updateMemberByIndex, setMembers } from '../../actions/members'
import { setFamily } from '../../actions/family'
import { useHistory } from 'react-router-dom'


let ContactExposure = props => {

    let history = useHistory()

    const [quarantineCenters, setQuarantineCenters] = useState([])
    const [loading, setloading] = useState(false)

    const [openSaveToServer, setOpenSaveToServer] = useState(false)
    const [saving, setSaving] = useState(false)
    const [savingMsg, setSavingMsg] = useState('')

    useEffect(() => {
        loadQuarantineCenters()
        return () => {
            
        }
    }, [])

    let toggleQuarantine = ({index, member}) => {
        props.updateMemberByIndex({index, member: {...member, quarantined: !member.quarantined,
        homeQuarantined: false, quarantineCenter: null, quarantineDate: null, releaseDate: null }})
    }


    

    let loadQuarantineCenters = () => {
        setloading(true)
        Axios.get(Apis.quarantine_centers).then(res => {
            if(res.status == '200') {
                setQuarantineCenters(res.data.quarantine_centers)
            }
        }).catch(err => console.log(err))
        .finally(() => setloading(false))
    }

    let sortByName = inputArray => {
        return inputArray.sort((aone, atwo) => {
            if(aone.name > atwo.name) return 1
            else if (aone.name < atwo.name) return -1
            else return 0
        })
    }

    let setQuarantineCenter = ({index, member, center}) => {
        if(center == 'home') {
            props.updateMemberByIndex({index, member: {...member, homeQuarantined: true, quarantineCenter: null}})
        } else {
            props.updateMemberByIndex({index, member: {...member, homeQuarantined: false, quarantineCenter: center}})
        }
    }

    let setQuarantineDate = ({index, member, date}) => {
        let rDate = new Date(date)
        rDate.setDate(rDate.getDate() + 14)
        let rIso = rDate.toISOString().split('T')[0]
        props.updateMemberByIndex({index, member: {...member, quarantineDate: date, releaseDate: rIso}})
    }

    let setReleaseDate = ({index, member, date}) => {
        props.updateMemberByIndex({index, member: {...member, releaseDate: date}})
    }


    let getQuarantineCenter = (member) => {
        if(member.homeQuarantined) return "home"
        else if (!member.homeQuarantined && member.quarantineCenter !== null) return member.quarantineCenter
        else return member.quarantineCenter
    }

    let startSaveToServer = async () => {
        
        try {
            setOpenSaveToServer(true)
            setSaving(true)
            let familyId = await saveFamily()
            setSavingMsg("family saved now saving members")
            props.members.forEach(async member => {
                await saveMember(familyId, member)
            })
            setSavingMsg('Members saved successfully !!')
            setSaving(false)
            
            alert(' Success ! family saved successfully')

            props.setFamily(null)
            props.setMembers([])
        } catch (error) {
            console.log(error)
            alert(' Fail ! something went wrong')
        }

        history.push("/survey")
    }

    let saveFamily = () => {
        return new Promise((resolve, reject) => {
            Axios.post(Apis.save_family, {
                family: props.family
            }).then(res => {
                if(res.status == '200') {
                    resolve(res.data.family._id)
                }
            }).catch(err => reject(err))
        })
    }

    let saveMember = (familyId, member) => {
        return new Promise((resolve, reject) => {
            Axios.post(Apis.save_member, {
                member: {...member, family: familyId}
            }).then(res => {
                if(res.status == '200') resolve("ok")
            }).catch(err => reject(err))
        })
    }

    return (
        <div>
            <div style={{position: 'fixed', top: 0, width: '100%'}}>
                <AppBar position="static" >
                    <Toolbar style={{backgroundColor: 'green'}} >
                        <Typography variant="h6" style={{color: '#fafafa'}}>
                            Quarantine Status
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>

            <div style={{marginTop: 70}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', padding: 20}}>
                    <Typography variant="h6" style={{color: lightOrange, textAlign: 'center'}} >
                        Has anyone Quarantined or need to be quarantined
                    </Typography>
                    <Typography variant="h6" style={{color: lightOrange, textAlign: 'center'}} >
                    किसी को भी Quarantine किया गया है या Quarantine होने की आवश्यकता है
                    </Typography>
                </div>
                <div>
                    {loading &&
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10}} >
                            Wait while names are loading...
                        </div>
                    }
                </div>
                <Divider />
                <div style={{marginTop: 20}}>
                    {props.members.map((member, index) => (
                        <div style={{margin: 5,display: 'flex', 
                        flexDirection: 'column', borderTopLeftRadius: 5, borderTopRightRadius: 5,
                        borderStyle: 'solid', borderWidth: 1, borderColor: lightGrey}}
                         >
                            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', 
                            backgroundColor: veryLightGrey, borderTopLeftRadius: 5,
                             borderTopRightRadius: 5, alignItems: 'center'}}
                             onClick={() => toggleQuarantine({index, member})} >
                                <Checkbox checked={member.quarantined} />
                                <Typography variant="subtitle2" style={{marginLeft: 10}} >
                                    {member.name+" ("+member.age+")"}
                                </Typography>
                            </div>
                            <Divider />
                            {member.quarantined &&
                                <div style={{backgroundColor: 'white', padding: 5, display: 'flex',
                                flexDirection: 'column'}}>
                                    <FormControl variant="outlined" >
                                        <InputLabel id="natureId" >Quarantine Center</InputLabel>
                                        <Select label="Quarantine Center" labelId="natureId" value={getQuarantineCenter(member)} onChange={event => setQuarantineCenter({index, member, center: event.target.value})} >
                                            <MenuItem value="home" >Home Quarantined</MenuItem>
                                            {sortByName(quarantineCenters).map(center => (
                                                <MenuItem value={center._id} >{center.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField type="date" variant="outlined" label="Quarantine Date" value={member.quarantineDate} onChange={event => setQuarantineDate({index, member, date: event.target.value})} style={{marginTop: 10}} />
                                    <TextField type="date" variant="outlined" label="Release Date" value={member.releaseDate} onChange={event => setReleaseDate({index, member, date: event.target.value})} style={{marginTop: 10}} />
                                </div>
                            }
                        </div>
                    ))}
                </div>
                <div style={{padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa', marginLeft: 10}} 
                            startIcon={<Save />} onClick={() => startSaveToServer()} >
                               Save To Server
                        </Button>
                </div> 
            </div>
            <Dialog open={openSaveToServer} onClose={() => setOpenSaveToServer(false)} >
                <div style={{padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                    <Typography>{savingMsg}</Typography>
                    {saving &&
                        <CircularProgress />
                    }
                    {!saving &&
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button variant="contained" style={{backgroundColor: lightBlue, color: '#fafafa'}} onClick={() => setOpenSaveToServer(false)} >Okay</Button>
                        </div>
                    }
                    
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
        updateMemberByIndex: ({index, member}) => dispatch(updateMemberByIndex({index, member})),
        setFamily: family => dispatch(setFamily(family)),
        setMembers: members => dispatch(setMembers(members))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(ContactExposure)