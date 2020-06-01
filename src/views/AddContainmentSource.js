import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { Typography, TextField, Select, MenuItem, Switch, Button, FormControlLabel, Paper, 
    FormControl, InputLabel, Dialog, Checkbox } from '@material-ui/core'
import { Save, Add } from '@material-ui/icons'
import { lightBlue, lightGrey } from '../colors'
import Axios from 'axios'
import Apis from '../Apis'
import { useLocation } from 'react-router-dom'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'


let AddContainmentSource = props => {

    const [containmentArea, setContainmentArea] = useState(null)
    const [containmentSources, setContainmentSources] = useState([])

    const [allContainmentSources, setAllContainmentSources] = useState([])

    const [query, setQuery] = useState('')
    const [queryCriteria, setQueryCriteria] = useState('')

    const [openAddNewSource, setOpenAddNewSource] = useState(false)
    const [blocks, setblocks] = useState([])
    const [block, setblock] = useState(null)
    const [quarantineCenters, setQuarantineCenters] = useState([])
    const [qCenter, setQCenter] = useState(null)

    let newSourceInit = {
        name: '', mobileNumber: '', age: null, address: '', block: '', blockName: '',
        adhar: '', familyHead: '', traveledFrom: '', arrivalDate: null, quarantineDate: null,
        releaseDate: null, quarantineCenter: '', quarantineCenterName: ''
    }

    let newSourceReducer = (state, action) => {
        let type = action.type;
        if(type == 'setName') state = {...state, name: action.payload}
        else if(type == 'setMobileNumber') state = {...state, mobileNumber: action.payload}
        else if(type == 'setAge') state = {...state, age: action.payload}
        else if(type == 'setAddress') state = {...state, address: action.payload}
        else if(type == 'setBlock') state = {...state, block: action.payload._id, blockName: action.payload.name}
        else if(type == 'setAdhar') state = {...state, adhar: action.payload}
        else if(type == 'setFamilyHead') state = {...state, familyHead: action.payload}
        else if(type == 'setTraveledFrom') state = {...state, traveledFrom: action.payload}
        else if(type == 'setArrivalDate') state = {...state, arrivalDate: action.payload}
        else if(type == 'setQuarantineDate') state = {...state, quarantineDate: action.payload}
        else if(type == 'setReleaseDate') state = {...state, releaseDate: action.payload}
        else if(type == 'setQuarantineCenter') state = {...state, quarantineCenter: action.payload._id, quarantineCenterName: action.payload.name}
        return state
    }

    const [newSource, newSourceDispatch] = useReducer(newSourceReducer, newSourceInit)


    let location = useLocation()

    useEffect(() => {
        setContainmentArea(location.state)
        loadAllContainmentSources()
        loadBlocks()
        loadQuarantineCenters()
        return () => {
            
        }
    }, [])

    useEffect(() => {
        if(containmentArea) {
            setContainmentSources(containmentArea.containmentSources)
        }
        return () => {
            
        }
    }, [containmentArea])


    let loadBlocks = () => {
        Axios.get(Apis.area_blocks).then(res => {
            if(res.status == '200') {
                setblocks(res.data.blocks)
            }
        }).catch(err => console.log(err))
    }

    let loadQuarantineCenters = () => {
        Axios.get(Apis.quarantine_centers).then(res => {
            if(res.status == '200') {
                setQuarantineCenters(res.data.quarantine_centers)
            }
        }).catch(err => console.log(err))
    }

    let loadAllContainmentSources = () => {
        Axios.get(Apis.containment_sources).then(res => {
            if(res.status == '200') {
                setAllContainmentSources(res.data.containment_sources)
            }
        }).catch(err => console.log(err))
    }

    let isSourceSelected = source => {
        let x = containmentSources.find(src => {
            if(src == source._id) return src
        })

        if(x) return true;
        else return false;
    }

    let toggleSourceSelection = source => {
        if(isSourceSelected(source)) {
            let sSrcs = [...containmentSources]
            sSrcs.forEach((src, index) => {
                if(src == source._id) sSrcs.splice(index, 1)
            })

            setContainmentSources(sSrcs)
        } else {
            setContainmentSources([...containmentSources, source._id])
        }
    }

    let sortByName = inputArray => {
        return inputArray.sort((aone, atwo) => {
            if(aone.name > atwo.name) return 1
            else if (aone.name < atwo.name) return -1
            else return 0
        })
    }


    let containmentSourcesQuried = (sources, query, criteria) => {
        return allContainmentSources;
    }


    let save = () => {
        Axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+props.admin.token
            },
            url: Apis.attach_containment_sources,
            method: 'POST',
            data: {
                areaId: containmentArea._id,
                containmentSources: containmentSources
            }
        }).then(res => {
            if(res.status == '200') {
                alert("Changes Saved")
            }
        }).catch(err => alert("Something went wrong"))
    }

    let createContainmentSource = () => {
        if(validInputForSource()) {
            Axios({
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+props.admin.token
                },
                url: Apis.add_containment_source,
                method: 'POST',
                data: {
                    ...newSource
                }
            }).then(res => {
                if(res.status == '200') {
                    setContainmentSources([...containmentSources, res.data.source._id])
                    setAllContainmentSources([...allContainmentSources, res.data.source])
                    alert("Containment Source Created")
                }
            }).catch(err => console.log(err))
            .finally(() => setOpenAddNewSource(false))
        }
    }

    let validInputForSource = () => {
        return true
    }

    return (
        <div style={{height: '100vh'}}>
            <div style={{position: 'fixed', top: 0, padding: 20, display: 'flex', alignItems: 'center', backgroundColor: 'white', zIndex: 10}}>
                <Typography variant="h4" style={{color: lightBlue}}>Add Containment Source Persons to {containmentArea !== null ? containmentArea.name : ''}</Typography>
            </div>

            <div style={{position: 'fixed', top: 80, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%'}}>
                <div style={{padding: 10, display: 'flex', flexDirection: 'row'}}>
                    <TextField variant="outlined" label="Search Query" />
                    <FormControl variant="outlined" style={{marginLeft: 10, width: 200}} >
                        <InputLabel id="selectCriteria" >Select Criteria</InputLabel>
                        <Select labelId="selectCriteria" label="Select Criteria" >
                            <MenuItem value="name" >Name</MenuItem>
                            <MenuItem value="mobile_number" >Mobile Number</MenuItem>
                            <MenuItem value="adhar" >Adhar Card Number</MenuItem>
                        </Select>
                    </FormControl>
                    <div style={{marginLeft: 10, display: 'flex', justifyContent: 'center'}}>
                        <Button variant="contained" startIcon={<Add/>} style={{backgroundColor: lightBlue, 
                            color: '#fafafa'}} onClick={() => setOpenAddNewSource(true)} >
                                Add New Containment Source Person
                        </Button>
                    </div>
                </div>
                <Paper style={{maxHeight: 450, overflow: 'auto', padding: 10}} >
                    {(allContainmentSources.length == 0) &&
                        <div style={{padding: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                            <Typography variant="h5" style={{color: lightGrey}} >Add Containment Source Persons</Typography>
                        </div>
                    } 
                    {(allContainmentSources.length != 0) &&
                        <div>
                            {sortByName(containmentSourcesQuried(containmentSources, query, queryCriteria)).map(source => (
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 10,
                                justifyContent: 'space-around'}} >
                                    <FormControl style={{width: '10%'}} >
                                        <Checkbox checked={isSourceSelected(source)} onChange={() => toggleSourceSelection(source)} />
                                    </FormControl>
                                    <Typography variant="subtitle2" style={{width: '18%'}}>{source.name}</Typography>
                                    <Typography variant="subtitle2" style={{width: '18%'}}>{source.mobileNumber}</Typography>
                                    <Typography variant="subtitle2" style={{width: '18%'}}>{source.age}</Typography>
                                    <Typography variant="subtitle2" style={{width: '18%'}}>{source.address}</Typography>
                                    <Typography variant="subtitle2" style={{width: '18%'}}>{source.familyHead}</Typography>
                                </div>
                            ))}
                        </div>
                    }
                </Paper>

                <div style={{padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Button variant="contained" style={{backgroundColor: lightGrey, color: '#fafafa'}}
                    startIcon={<Save />} onClick={() => save()} >
                        Save
                    </Button>
                </div>
            </div>

            <Dialog open={openAddNewSource} onClose={() => setOpenAddNewSource(false)} >
                <div style={{padding: 10}}>
                    <Paper style={{maxHeight: 450, width: 500, overflow: 'auto'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}} >
                            <TextField variant="outlined" label="Name" value={newSource.name}
                             onChange={event => newSourceDispatch({type: 'setName',
                              payload: event.target.value})} />

                            <TextField variant="outlined" label="Mobile Number" 
                            style={{marginTop: 10}} value={newSource.mobileNumber} onChange={event => 
                            newSourceDispatch({type: 'setMobileNumber', payload: event.target.value})} />
                            
                            <TextField variant="outlined" label="Age" type="number" style={{marginTop: 10}}
                            value={newSource.age} onChange={event => newSourceDispatch({type: 'setAge', payload: event.target.value})} />
                            
                            <TextField variant="outlined" label="Address" style={{marginTop: 10}}
                            value={newSource.address} onChange={event => newSourceDispatch({type: 'setAddress', payload: event.target.value})} />
                            
                            <FormControl variant="outlined" style={{marginTop: 10}} >
                                <InputLabel id="selectBlock" >Block</InputLabel>
                                <Select labelId="selectBlock" label="Block"
                                 value={block} onChange={event => {newSourceDispatch({type: 'setBlock', payload: event.target.value}); setblock(event.target.value)}} >
                                    {sortByName(blocks).map(blck => (
                                        <MenuItem value={blck} >{blck.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            <TextField variant="outlined" label="Adhar Card Number" style={{marginTop: 10}} 
                            value={newSource.adhar} onChange={event => newSourceDispatch({type: 'setAdhar', payload: event.target.value})} />
                            
                            <TextField variant="outlined" label="Family Head" style={{marginTop: 10}} 
                            value={newSource.familyHead} onChange={event => newSourceDispatch({type: 'setFamilyHead', payload: event.target.value})} />
                            
                            <TextField variant="outlined" label="Traveled From" style={{marginTop: 10}} 
                            value={newSource.traveledFrom} onChange={event => newSourceDispatch({type: 'setTraveledFrom', payload: event.target.value})} />
                            
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10}} >
                                <Typography variant="subtitle2" style={{marginLeft: 10, marginRight: 10}} >Arrival Date</Typography>
                                <TextField type="date" variant="outlined"  
                                value={newSource.arrivalDate} onChange={event => 
                                newSourceDispatch({type: 'setArrivalDate', payload: event.target.value})} />
                            </div>
                            
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10}} >
                                <Typography variant="subtitle2" style={{marginLeft: 10, marginRight: 10}} >Quarantine Date</Typography>
                                <TextField type="date" variant="outlined" 
                                value={newSource.quarantineDate} onChange={event => newSourceDispatch({type: 'setQuarantineDate', 
                                payload: event.target.value})} />
                            </div>
                            
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10}} >
                                <Typography variant="subtitle2" style={{marginLeft: 10, marginRight: 10}} >Release Date</Typography>
                                <TextField type="date" variant="outlined" 
                            value={newSource.releaseDate} onChange={event => newSourceDispatch({type: 'setReleaseDate', payload: event.target.value})} />
                            </div>
                            
                            <FormControl variant="outlined" style={{marginTop: 10}} >
                                <InputLabel id="selectQC" >Quarantine Center</InputLabel>
                                <Select labelId="selectQC" label="Quarantine Center"
                                 value={qCenter} onChange={event => 
                                 {
                                     newSourceDispatch({type: 'setQuarantineCenter', payload: event.target.value});
                                     setQCenter(event.target.value)
                                 }} >
                                    {sortByName(quarantineCenters).map(qc => (
                                        <MenuItem value={qc} >{qc.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </Paper>
                    <div style={{padding: 10, display: 'flex', justifyContent: 'center'
                        , alignItems: 'center' }} >
                        <Button variant="contained" style={{backgroundColor: lightGrey, color: '#fafafa'}} 
                         onClick={() => createContainmentSource()} >
                            Create Containment Source Person
                        </Button>
                    </div>
                </div>
            </Dialog>
            
        </div>
    )
}

let mapStateToProps = state => {
    return {
        admin: state.admin
    }
}

export default connect(mapStateToProps)(AddContainmentSource)