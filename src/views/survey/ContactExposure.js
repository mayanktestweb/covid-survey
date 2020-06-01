import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { AppBar, Toolbar, Typography, Button, Checkbox, Divider, Dialog, FormControl, FormControlLabel, Radio, RadioGroup, Select, MenuItem, InputLabel } from '@material-ui/core'
import { ArrowForward } from '@material-ui/icons'
import Axios from 'axios'
import Apis from '../../Apis'
import { lightBlue, lightOrange, veryLightGrey, lightGrey } from '../../colors'
import { updateMemberByIndex } from '../../actions/members'
import { useHistory } from 'react-router-dom'


let ContactExposure = props => {

    let history = useHistory()

    const [containmentSources, setContainmentSources] = useState([])
    const [loading, setloading] = useState(false)

    const [openContactedSource, setOpenContactedSource] = useState(false)
    const [member, setmember] = useState(null)
    const [memberIndex, setMemberIndex] = useState(null)
    const [selectedSource, setSelectedSource] = useState(null)

    useEffect(() => {
        loadContainmentSources()
        return () => {
            
        }
    }, [])

    let startContactedSource = ({index, member}) => {
        setMemberIndex(index)
        setmember(member)
        setOpenContactedSource(true)
    }

    let cancelContactedSource = () => {
        setmember(null)
        setMemberIndex(null)
        setSelectedSource(null)
        setOpenContactedSource(false)
    }

    let setSource = () => {
        if(selectedSource != 'none') {
            props.updateMemberByIndex({index: memberIndex, member: {...member, sourceContacted: selectedSource}})
        } else props.updateMemberByIndex({index: memberIndex, member: {...member, sourceContacted: null}})
        cancelContactedSource()
    }

    let loadContainmentSources = () => {
        setloading(true)
        Axios.post(Apis.containment_area_sources, {
            areaId: props.family.containmentArea
        }).then(res => {
            if(res.status == '200') {
                setContainmentSources(res.data.sources)
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

    let setNature = ({index, member, nature}) => {
        props.updateMemberByIndex({index, member: {...member, contactNature: nature}})
    }

    let setRelation = ({index, member, relation}) => {
        props.updateMemberByIndex({index, member: {...member, contactRelation: relation}})
    }

    let setRisk = ({index, member, risk}) => {
        props.updateMemberByIndex({index, member: {...member, riskLevel: risk}})
    }

    let saveAndGo = () => {
        history.push("/survey/select_for_sample")
    }

    return (
        <div>
            <div style={{position: 'fixed', top: 0, width: '100%'}}>
                <AppBar position="static" >
                    <Toolbar style={{backgroundColor: 'green'}} >
                        <Typography variant="h6" style={{color: '#fafafa'}}>
                            Contact Exposure
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>

            <div style={{marginTop: 70}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', padding: 20}}>
                    <Typography variant="h6" style={{color: lightOrange, textAlign: 'center'}} >
                        Has anyone came in contact with following persons
                    </Typography>
                    <Typography variant="h6" style={{color: lightOrange, marginTop: 10, textAlign: 'center'}} >
                        क्या कोई निम्नलिखित व्यक्तियों के संपर्क में आया है
                    </Typography>
                </div>
                <div>
                    {loading &&
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10}} >
                            Wait while names are loading...
                        </div>
                    }
                    {sortByName(containmentSources).map(source => (
                        <div style={{padding: 5, display: 'flex', flexDirection: 'row', 
                        alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-around'}} >
                            <Typography variant="subtitle2" >{source.name+" ("+source.age+")"}</Typography>
                            <Typography variant="subtitle2" >{source.address}</Typography>
                        </div>
                    ))}
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
                             onClick={() => startContactedSource({index, member})} >
                                <Checkbox checked={member.sourceContacted !== null} />
                                <Typography variant="subtitle2" style={{marginLeft: 10}} >
                                    {member.name+" ("+member.age+")"}
                                </Typography>
                            </div>
                            <Divider />
                            {(member.sourceContacted !== null) &&
                                <div style={{backgroundColor: 'white', padding: 5, display: 'flex',
                                flexDirection: 'column'}}>
                                    <FormControl variant="outlined" >
                                        <InputLabel id="natureId" >Contact Nature संपर्क का प्रकार</InputLabel>
                                        <Select label="Contact Nature संपर्क का प्रकार" labelId="natureId" value={member.contactNature} onChange={event => setNature({index, member, nature: event.target.value})} >
                                            <MenuItem value="social_meetup" >Social Meetup सामाजिक मुलाकात</MenuItem>
                                            <MenuItem value="travel_together">Traveled Together एक साथ यात्रा की</MenuItem>
                                            <MenuItem value="party" >Party पार्टी</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="outlined" style={{marginTop: 10}} >
                                        <InputLabel id="relationId" >Relation With Contact Hindi व्यक्ति के साथ संबंध</InputLabel>
                                        <Select label="Relation With Contact Hindi व्यक्ति के साथ संबंध" labelId="relationId" value={member.contactRelation} onChange={event => setRelation({index, member, relation: event.target.value})} >
                                            <MenuItem value="relative" >Relative रिश्तेदार</MenuItem>
                                            <MenuItem value="friend">Friend मित्र</MenuItem>
                                            <MenuItem value="general" >General Relation सामान्य संबंध</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="outlined" style={{marginTop: 10}} >
                                        <InputLabel id="riskId">Risk Level जोखिम का स्तर</InputLabel>
                                        <Select label="Risk Level जोखिम का स्तर" labelId="riskId" value={member.riskLevel} onChange={event => setRisk({index, member, risk: event.target.value})} >
                                            <MenuItem value="low">Low कम</MenuItem>
                                            <MenuItem value="high">High ज्यादा</MenuItem>
                                            <MenuItem value="none">None बिल्कुल नहीं</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            }
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

            <Dialog open={openContactedSource} onClose={() => cancelContactedSource()} >
                <div style={{padding: 10}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <FormControl component="fieldset">
                            <RadioGroup value={selectedSource} onChange={event => setSelectedSource(event.target.value)}>
                                {sortByName(containmentSources).map(source => (
                                    <FormControlLabel control={<Radio />} label={source.name+" ("+source.age+")"} value={source._id} />
                                ))}
                                <FormControlLabel control={<Radio />} label="None" value='none' />
                            </RadioGroup>
                        </FormControl>
                        <div style={{padding: 10, display: 'flex', flexDirection: 'row'}} >
                            <Button variant="contained" style={{backgroundColor: lightBlue,
                                color: '#fafafa'}} onClick={() => setSource()} >
                                Save
                            </Button>
                            <Button variant="text" style={{color: lightBlue, marginLeft: 10}} onClick={() => cancelContactedSource()} >
                                Cancel
                            </Button>
                        </div>
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
        updateMemberByIndex: ({index, member}) => dispatch(updateMemberByIndex({index, member}))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(ContactExposure)