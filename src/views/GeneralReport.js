import React, {useEffect, useState, useReducer} from 'react'
import { connect } from 'react-redux'
import { AppBar, Toolbar, IconButton, Typography, Button, Drawer, Dialog, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Checkbox, FormLabel, CircularProgress, TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell, InputLabel, Select, MenuItem, Divider } from '@material-ui/core'
import { Menu, ExitToApp, Edit } from '@material-ui/icons'
import { setAdmin } from '../actions/admin'
import { useHistory } from 'react-router-dom'
import { lightBlue, lightOrange, lightGrey, errorRed} from '../colors'
import Axios from 'axios'
import Apis from '../Apis'


let GeneralReport = props => {

    let history =  useHistory()

    const [openDrawer, setOpenDrawer] = useState(false)


    const [loading, setLoading] = useState(false)
    const [fetchedData, setFetchedData] = useState([])

    const [blocks, setblocks] = useState([])
    const [containmentAreas, setContainmentAreas] = useState([])
    const [containmentSources, setContainmentSources] = useState([])
    const [quarantineCenters, setQuarantineCenters] = useState([])
    const [surveyOfficers, setSurveyOfficers] = useState([])

    const [openDialog, setOpenDialog] = useState(false)

    const [drawerAction, setDrawerAction] = useState('')


    let qreducer = (state, action) => {
        if(action.type == 'setName') {
            let currentQuery = {...state}
            currentQuery = {...currentQuery, name: {$regex: '\\b'+action.payload, $options: 'gi'}}
            state = currentQuery
        } else if (action.type == 'setMobileNumber') {
            let currentQuery = {...state}
            currentQuery = {...currentQuery, mobileNumber: {$regex: '\\b'+action.payload}}
            state = currentQuery
        } else if (action.type == 'setGovtIdNumber') {
            let currentQuery = {...state}
            currentQuery = {...currentQuery, govtIdNumber: {$regex: '\\b'+action.payload, $options: 'gi'}}
            state = currentQuery
        } else if (action.type == 'setContainmentArea') {
            let currentQuery = {...state}
            if(action.payload.length == 0) {
                delete currentQuery['containmentArea']
            } else {
                currentQuery = {...currentQuery, containmentArea: {$in: action.payload}}
            }
            state = currentQuery
        } else if (action.type == 'setZoneType') {
            let currentQuery = {...state}
            if(action.payload.length == 0) {
                delete currentQuery['zoneType']
            } else {
                currentQuery = {...currentQuery, zoneType: {$in: action.payload}}
            }
            state = currentQuery
        } else if (action.type == 'setQuarantinedType') {
            let currentQuery = {...state}
            if(action.payload == 'all') {
                delete currentQuery['releaseDate']
                currentQuery = {...currentQuery, quarantined: {$in: [true, false]}}
            } else if (action.payload == 'ever') {
                delete currentQuery['releaseDate']
                currentQuery = {...currentQuery, quarantined: true}
            } else if (action.payload == 'never') {
                delete currentQuery['releaseDate']
                currentQuery = {...currentQuery, quarantined: false}
            } else if (action.payload == 'currently') {
                currentQuery = {...currentQuery, quarantined: true, releaseDate: {$gte: (new Date()).toISOString()}}
            } else if (action.payload == 'released') {
                currentQuery = {...currentQuery, quarantined: true, releaseDate: {$lt: (new Date()).toISOString()}}
            }
            state = currentQuery
        } else if (action.type == 'setQuarantineCenter') {
            let currentQuery = {...state}
            if(action.payload.length == 0) {
                delete currentQuery['quarantineCenter']
            } else currentQuery = {...currentQuery, quarantineCenter: {$in: action.payload}}
            state = currentQuery
        } else if (action.type == 'reset') {
            state = {}
        } else if (action.type == 'setAge') {
            let currentQuery = {...state}
            if(action.payload.minAge == null || action.payload.maxAge == null) {
                delete currentQuery['age']
            } else {
                currentQuery = {...currentQuery, age: {$gte: action.payload.minAge, $lte: action.payload.maxAge}}
            }
            state = currentQuery
        } else if (action.type == 'setSurveyDate') {
            let currentQuery = {...state}
            if(action.payload.minSurveyDate == null || action.payload.maxSurveyDate == null) {
                delete currentQuery['surveyDate']
            } else {
                currentQuery = {...currentQuery, surveyDate: {$gte: (new Date(action.payload.minSurveyDate)).toISOString(), $lte: (new Date(action.payload.maxSurveyDate).toISOString())}}
            }
            state = currentQuery
        } else if (action.type == 'setRiskLevel') {
            let currentQuery = {...state}
            if(action.payload.length == 0) {
                delete currentQuery['riskLevel']
            } else currentQuery = {...currentQuery, riskLevel: {$in: action.payload}}
            state = currentQuery
        } else if (action.type == 'setQuarantineDate') {
            let currentQuery = {...state}
            if(action.payload.minQuarantineDate == null || action.payload.maxQuarantineDate == null) {
                delete currentQuery['quarantineDate']
            } else {
                currentQuery = {...currentQuery, quarantineDate: {$gte: (new Date(action.payload.minQuarantineDate)).toISOString(), $lte: (new Date(action.payload.maxQuarantineDate).toISOString())}}
            }
            state = currentQuery
        } 
        return state;
    }

    const [query, qdispatch] = useReducer(qreducer, {})

    let freducer = (state, action) => {
        
        if(action.type == 'toggle') {
            console.log(action)
            let payload = action.payload
            let val = {...state}
            val[payload] = !val[payload]
            state = val
        }

        return state
    }

    const [fieldsets, fdispatch] = useReducer(freducer, {
        name: true, age: true, sex: false, mobileNumber: true, govtIdType: false, 
        govtIdNumber: true, address: true, containmentArea: true, block: false,
        zoneType: true, surveyDate: true, headName: true, headMobileNumber: false,
        symptoms: true, deseases: false, pregnancy: false, traveledFrom: true, travelDate: false,
        sourceContacted: true, contactNature: false, contactRelation: false, riskLevel: true,
        quarantineStatus: true, quarantineDate: false, releaseDate: false, selectedForSample: true,
        quarantineCenter: false
    })




    let filterInit = {
        name: '', age: '', sex: '', mobileNumber: '', quarantineCenters: [],
        govtIdNumber: '', minAge: null, maxAge: null, minSurveyDate: null, maxSurveyDate: null,
        riskLevels: [], minQuarantineDate: null, maxQuarantineDate: null
    }

    let filterReducer = (state, action) => {
        if(action.type == 'setName') state = {...state, name: action.payload}
        else if (action.type == 'setAge') state = {...state, age: action.payload}
        else if (action.type == 'setSex') state = {...state, sex: action.payload}
        else if (action.type == 'setMobileNumber') state = {...state, mobileNumber: action.payload}
        else if (action.type == 'setGovtIdNumber') state = {...state, govtIdNumber: action.payload}
        else if (action.type == 'toggleQuarantineCenter') {
            let pstate = {...state}
            if(pstate.quarantineCenters.includes(action.payload)) {
                pstate.quarantineCenters.forEach((center, index) => {
                    if(center == action.payload) pstate.quarantineCenters.splice(index, 1)
                })
            } else pstate.quarantineCenters.push(action.payload)
            state = pstate
        } else if (action.type == 'reset') {
            state = filterInit
        } else if (action.type == 'setMinAge') {
            state = {...state, minAge: action.payload}
        } else if (action.type == 'setMaxAge') {
            state = {...state, maxAge: action.payload}
        } else if (action.type == 'setMinSurveyDate') {
            state = {...state, minSurveyDate: action.payload}
        } else if (action.type == 'setMaxSurveyDate') {
            state = {...state, maxSurveyDate: action.payload}
        } else if (action.type == 'setRiskLevel') {
            let pstate = {...state}
            if(pstate.riskLevels.includes(action.payload)) {
                pstate.riskLevels.forEach((level, index) => {
                    if(level == action.payload) pstate.riskLevels.splice(index, 1)
                })
                state = pstate;
            } else pstate.riskLevels.push(action.payload)

            state = pstate
        } else if (action.type == 'setMinQuarantineDate') {
            state = {...state, minQuarantineDate: action.payload}
        } else if (action.type == 'setMaxQuarantineDate') {
            state = {...state, maxQuarantineDate: action.payload}
        } 
        return state
    }

    const [filter, filterDispatch] = useReducer(filterReducer, filterInit)

    let resetFilter = () => {
        setSelectedContainmentArea([])
        setZoneTypes([])
        setQuarantineStatus('all')
        filterDispatch({type: 'reset'})
        qdispatch({type: 'reset'})
    }

    const [openQuarantineCenterSelection, setOpenQuarantineCenterSelection] = useState(false)

    const [openContainmentAreaSelection, setOpenContainmentAreaSelection] = useState(false)
    const [selectedContainmentArea, setSelectedContainmentArea] = useState([])

    const [zoneTypes, setZoneTypes] = useState([])
    const [quarantineStatus, setQuarantineStatus] = useState('all')

    const [openAgeFilter, setOpenAgeFilter] = useState(false)
    const [openSurveyDateFilter, setOpenSurveyDateFilter] = useState(false)
    const [openRiskLevelFilter, setOpenRiskLevelFilter] = useState(false)
    const [openQuarantineDateFilter, setOpenQuarantineDateFilter] = useState(false)

    const [openEditMember, setOpenEditMember] = useState(false)


    let memberToEditInit = {
        symptoms: [], deseases: [], quarantined: null, quarantineDate: null, quarantineCenter: null,
        releaseDate: null
    }

    let memberToEditReducer = (state, action) => {
        if(action.type == 'setMemberToEdit') {
            state = action.payload
        } else if (action.type == 'toggleSymptom') {
            let pstate = {...state}
            if(pstate.symptoms.includes(action.payload)) {
                pstate.symptoms.forEach((symptom, index) => {
                    if(symptom == action.payload) pstate.symptoms.splice(index, 1)
                })
            } else pstate.symptoms.push(action.payload)
            state = pstate
        } else if (action.type == 'toggleDesease') {
            let pstate = {...state}
            if(pstate.deseases.includes(action.payload)) {
                pstate.deseases.forEach((desease, index) => {
                    if(desease == action.payload) pstate.deseases.splice(index, 1)
                })
            } else pstate.deseases.push(action.payload)
            state = pstate
        } else if (action.type == 'toggleQuarantined') {
            state = {...state, quarantined: !state.quarantined}
        } else if (action.type == 'setQuarantineCenter') {
            if(action.payload == 'home') {
                state = {...state, homeQuarantined: true, quarantineCenter: null}
            } else state = {...state, quarantineCenter: action.payload, homeQuarantined: false}            
        } else if (action.type == 'setQuarantineDate') {
            state = {...state, quarantineDate: action.payload}
        } else if (action.type == 'setReleaseDate') {
            state = {...state, releaseDate: action.payload}
        }
        return state;
    }

    const [memberToEditIndex, setMemberToEditIndex] = useState(null)
    const [memberToEdit, memberToEditDispatch] = useReducer(memberToEditReducer, memberToEditInit)


    let toggleContainmentAreaSelection = cArea => {
        if(selectedContainmentArea.includes(cArea)) {
            let sca = [...selectedContainmentArea]
            sca.forEach((sc, index) => {
                if(sc == cArea) sca.splice(index, 1)
            })
            setSelectedContainmentArea(sca)
        } else setSelectedContainmentArea([...selectedContainmentArea, cArea])
    }

    let toggleZoneTypeSelection = zone => {
        if(zoneTypes.includes(zone)) {
            let zts = [...zoneTypes]
            zts.forEach((zt, index) => {
                if(zt == zone) zts.splice(index, 1)
            })
            setZoneTypes(zts)
        } else setZoneTypes([...zoneTypes, zone])
    }

    useEffect(() => {
        loadInitialData()
        return () => {
            
        }
    }, [])

    let loadInitialData = () => {
        loadBlocks()
        loadContainmentAreas()
        loadContainmentSources()
        loadQuarantineCenters()
        loadSurveyOfficers()
    }

    let loadBlocks = () => {
        setLoading(true)
        Axios.get(Apis.area_blocks).then(res => {
            if(res.status == '200') setblocks(res.data.blocks)
        }).catch(err => console.log(err))
        .finally(() => setLoading(false))
    }

    let loadContainmentAreas = () => {
        setLoading(true)
        Axios.get(Apis.containment_areas).then(res => {
            if(res.status == '200') setContainmentAreas(res.data.containment_areas)
        }).catch(err => console.log(err))
        .finally(() => setLoading(false))
    }

    let loadQuarantineCenters = () => {
        setLoading(true)
        Axios.get(Apis.quarantine_centers).then(res => {
            if(res.status == '200') setQuarantineCenters(res.data.quarantine_centers)
        }).catch(err => console.log(err))
        .finally(() => setLoading(false))
    }

    let loadContainmentSources = () => {
        setLoading(true)
        Axios.get(Apis.containment_sources).then(res => {
            if(res.status == '200') setContainmentSources(res.data.containment_sources)
        }).catch(err => console.log(err))
        .finally(() => setLoading(false))
    }

    let loadSurveyOfficers = () => {
        setLoading(true)
        Axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+props.admin.token
            },
            url: Apis.survey_officers,
            method: 'GET'
        }).then(res => {
            if(res.status == '200') {
                setSurveyOfficers(res.data.surveyOfficers)
            }
        }).catch(err => console.log(err))
        .finally(() => setLoading(false))
    }

    let sortByName = inputArray => {
        return inputArray.sort((aone, atwo) => {
            if(aone.name > atwo.name) return 1
            else if (aone.name < atwo.name) return -1
            else return 0
        })
    }


    let fetchGeneralReport = () => {
        setLoading(true)
        setOpenDrawer(false)
        Axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+props.admin.token
            },
            url: Apis.fetch_general_report,
            method: 'POST',
            data: {
                query
            }
        }).then(res => {
            if(res.status == '200') {
                setFetchedData(res.data.general_report)
            }
        }).catch(error => console.log(error))
        .finally(() => setLoading(false))
    }


    let getContainmentAreaName = areaId => {
        let area = containmentAreas.find(ar => {
            if(ar._id == areaId) return ar
        })

        return area.name
    }

    let getQuarantineStatus = member => {
        if(member.quarantined) {
            if((new Date(member.releaseDate) >= (new Date()))) {
                if(member.homeQuarantined) return 'Home Quarantined'
                else return 'Quarantined'
            } else return 'Released'
        } else return ''
    }

    let getSourceName = source => {
        console.log(source)
        let src = containmentSources.find(s => {
            if(s._id == source) return s
        })
        return src.name+" ("+src.age+")"
    }

    let getQuarantineCenterName = center => {
        let cntr = quarantineCenters.find(c => {
            if(c._id == center) return c
        })
        return cntr.name
    }


    let saveEditedMember = () => {
        let memberId = memberToEdit._id
        let updates = {...memberToEdit}
        delete updates['_id']
        Axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+props.admin.token
            },
            url: Apis.save_edited_member,
            method: 'POST',
            data: {
                memberId, 
                updates
            }
        }).then(res => {
            if(res.status == '200') {
                let oldData = [...fetchedData]
                oldData.forEach((mem, index) => {
                    if(mem._id == memberId) {
                        console.log("member need to be switched")
                        oldData.splice(index, 1, memberToEdit)
                    }
                    setFetchedData(oldData)
                })
                alert('Edited Successfully')
                
            }
        }).catch(err => {
            console.log('error while saving')
            console.log(err)
            alert('Failed To Edit Something went wrong')
        })
        .finally(() => setOpenEditMember(false))
    }

    return (
        <div style={{height: '100vh'}}>
            <div style={{position: 'fixed', top: 0, width: '100%'}}>
                <AppBar position="static">
                    <Toolbar style={{backgroundColor: 'green'}}>
                        <IconButton edge="start" aria-label="menu" onClick={() => setOpenDrawer(true)}>
                            <Menu style={{color: "white"}} />
                        </IconButton>

                        <Typography variant="h6" style={{flexGrow: 1, marginLeft: 15}}>
                            General Report
                        </Typography>

                    </Toolbar>
                </AppBar>
            </div>

            <div>
                <div style={{marginTop: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    {loading && 
                        <div style={{padding: 50, display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                            <CircularProgress />
                        </div>
                    }

                    {!loading &&
                        <div>
                            <div style={{padding: 10}} >
                                <Typography variant="h6" style={{color: lightGrey}} >Total {fetchedData.length} results</Typography>
                            </div>

                            <TableContainer component={Paper} style={{maxWidth: '150%'}} >
                                <Table>
                                    <TableHead style={{backgroundColor: 'yellow'}} >
                                        {fieldsets.name &&
                                            <TableCell component={"h6"} >Name</TableCell>
                                        }
                                        {fieldsets.age &&
                                            <TableCell onClick={() => setOpenAgeFilter(true)} component={"h6"}>Age</TableCell>
                                        }
                                        {fieldsets.sex &&
                                            <TableCell component={"h6"}>Sex</TableCell>
                                        }
                                        {fieldsets.mobileNumber &&
                                            <TableCell component={"h6"}>Mobile Number</TableCell>
                                        }
                                        {fieldsets.govtIdType &&
                                            <TableCell component={"h6"}>Government Id Type</TableCell>
                                        }
                                        {fieldsets.govtIdNumber &&
                                            <TableCell component={"h6"}>Government Id Number</TableCell>
                                        }
                                        {fieldsets.containmentArea &&
                                            <TableCell component={"h6"} onClick={() => setOpenContainmentAreaSelection(true)} >Containment Area</TableCell>
                                        }
                                        {fieldsets.surveyDate &&
                                            <TableCell onClick={() => setOpenSurveyDateFilter(true)} component={"h6"}>Survey Date</TableCell>
                                        }
                                        {fieldsets.symptoms &&
                                            <TableCell component={"h6"}>Symptoms</TableCell>
                                        }
                                        {fieldsets.deseases &&
                                            <TableCell component={"h6"}>Deseases</TableCell>
                                        }
                                        {fieldsets.pregnancy &&
                                            <TableCell component={"h6"}>Pregnancy</TableCell>
                                        }
                                        {fieldsets.traveledFrom &&
                                            <TableCell component={"h6"}>Traveled From</TableCell>
                                        }
                                        {fieldsets.travelDate &&
                                            <TableCell component={"h6"}>Travel Date</TableCell>
                                        }
                                        {fieldsets.sourceContacted &&
                                            <TableCell component={"h6"}>Source Contacted</TableCell>
                                        }
                                        {fieldsets.contactNature &&
                                            <TableCell component={"h6"}>Contact Nature</TableCell>
                                        }
                                        {fieldsets.contactRelation &&
                                            <TableCell component={"h6"}>Relation With Contact</TableCell>
                                        }
                                        {fieldsets.riskLevel &&
                                            <TableCell onClick={() => setOpenRiskLevelFilter(true)} component={"h6"}>Risk Level</TableCell>
                                        }
                                        {fieldsets.quarantineStatus &&
                                            <TableCell component={"h6"}>Quarantine Status</TableCell>
                                        }
                                        {fieldsets.quarantineDate &&
                                            <TableCell onClick={() => setOpenQuarantineDateFilter(true)} component={"h6"}>Quarantine Date</TableCell>
                                        }
                                        {fieldsets.quarantineCenter &&
                                            <TableCell onClick={() =>setOpenQuarantineCenterSelection(true)} >Quarantine Center</TableCell>
                                        }
                                        {fieldsets.releaseDate &&
                                            <TableCell component={"h6"}>Release Date</TableCell>
                                        }
                                        <TableCell>Edit</TableCell>
                                    </TableHead>

                                    <TableBody>
                                        {sortByName(fetchedData).map((member, index) => (
                                            <TableRow>
                                                {fieldsets.name &&
                                                    <TableCell>{member.name}</TableCell>
                                                }
                                                {fieldsets.age &&
                                                    <TableCell>{member.age}</TableCell>
                                                }
                                                {fieldsets.sex &&
                                                    <TableCell>{member.sex}</TableCell>
                                                }
                                                {fieldsets.mobileNumber &&
                                                    <TableCell>{member.mobileNumber}</TableCell>
                                                }
                                                {fieldsets.govtIdType &&
                                                    <TableCell>{member.govtIdType}</TableCell>
                                                }
                                                {fieldsets.govtIdNumber &&
                                                    <TableCell>{member.govtIdNumber}</TableCell>
                                                }
                                                {fieldsets.containmentArea &&
                                                    <TableCell>{getContainmentAreaName(member.containmentArea)}</TableCell>
                                                }
                                                {fieldsets.surveyDate &&
                                                    <TableCell>{(member.surveyDate != null) ? (new Date(member.surveyDate)).toDateString() : ''}</TableCell>
                                                }
                                                {fieldsets.symptoms &&
                                                    <TableCell>{member.symptoms.length > 0 ? 'Yes' : 'No'}</TableCell>
                                                }
                                                {fieldsets.deseases &&
                                                    <TableCell>{member.deseases.length > 0 ? 'Yes' : 'No'}</TableCell>
                                                }
                                                {fieldsets.pregnancy &&
                                                    <TableCell>{member.pregnancy ? 'Pregnant': ''}</TableCell>
                                                }
                                                {fieldsets.traveledFrom &&
                                                    <TableCell>{member.traveledFrom}</TableCell>
                                                }
                                                {fieldsets.travelDate &&
                                                    <TableCell>{member.travelDate != null ? (new Date(member.travelDate)).toLocaleDateString() : ''}</TableCell>
                                                }
                                                {fieldsets.sourceContacted &&
                                                    <TableCell>{member.sourceContacted != null ? getSourceName(member.sourceContacted) : ''}</TableCell>
                                                }
                                                {fieldsets.contactNature &&
                                                    <TableCell>Contact Nature</TableCell>
                                                }
                                                {fieldsets.contactRelation &&
                                                    <TableCell>Relation With Contact</TableCell>
                                                }
                                                {fieldsets.riskLevel &&
                                                    <TableCell>
                                                        {member.riskLevel == 'high' && 
                                                            <Typography>High</Typography>
                                                        }
                                                        {member.riskLevel == 'low' && 
                                                            <Typography>Low</Typography>
                                                        }
                                                        {member.riskLevel == 'none' && 
                                                            <Typography>None</Typography>
                                                        }
                                                    </TableCell>
                                                }
                                                {fieldsets.quarantineStatus &&
                                                    <TableCell>{getQuarantineStatus(member)}</TableCell>
                                                }
                                                {fieldsets.quarantineDate &&
                                                    <TableCell>{member.quarantineDate !== null ? (new Date(member.quarantineDate)).toDateString() : ''}</TableCell>
                                                }
                                                {fieldsets.quarantineCenter &&
                                                    <TableCell>{member.quarantineCenter !== null ? getQuarantineCenterName(member.quarantineCenter) : ''}</TableCell>
                                                }
                                                {fieldsets.releaseDate &&
                                                    <TableCell>{member.releaseDate !== null ? (new Date(member.releaseDate)).toDateString() : ''}</TableCell>
                                                }
                                                <TableCell>
                                                <IconButton edge="start" aria-label="edit" onClick={() => {
                                                    memberToEditDispatch({type: 'setMemberToEdit', payload: member})
                                                    setOpenEditMember(true)
                                                }} >
                                                    <Edit style={{color: lightOrange}} />
                                                </IconButton>
                                                </TableCell>
                                            </TableRow>   
                                        ))}
                                    </TableBody>

                                </Table>
                            </TableContainer>

                        </div>
                    }
                </div>
            </div>
            <Drawer anchor='top' open={openDrawer} onClose={() => setOpenDrawer(false)} >
                <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}} >
                    <div style={{width: '14%', display: 'flex', flexDirection: 'column', 
                    justifyContent: 'space-around', alignItems: 'center', borderRightStyle: 'solid',
                    borderRightWidth: 1, borderRightColor: lightGrey}} >
                        <Button variant="contained" style={{backgroundColor: lightBlue, color: '#fafafa', margin: 10}}
                        onClick={() => setDrawerAction('filters')} >
                            Filters
                        </Button>

                        <Button variant="contained" style={{backgroundColor: errorRed, color: '#fafafa', margin: 10}}
                        onClick={() => resetFilter()} >
                            Reset Filters
                        </Button>

                        <Button variant="contained" style={{backgroundColor: lightBlue, color: '#fafafa', margin: 10}}
                        onClick={() => setDrawerAction('fieldsets')} >
                            Fieldsets
                        </Button>

                        <Button variant="contained" style={{backgroundColor: lightOrange, 
                            color: '#fafafa', margin: 10}} onClick={() => fetchGeneralReport()}>
                            Apply
                        </Button>
                    </div>
                    <div style={{width: '85%'}} >
                        {(drawerAction == 'filters') &&
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20}}>
                                    <Typography variant='h6' style={{color: lightGrey}}>
                                        Basic Information Based
                                    </Typography>
                                    <TextField variant='outlined' label='Name' value={filter.name} style={{margin: 5}} onChange={event => {
                                            qdispatch({type: 'setName', payload: event.target.value});
                                            filterDispatch({type: 'setName', payload: event.target.value})
                                        }} />
                                    <TextField variant='outlined' label='Mobile Number' value={filter.mobileNumber} style={{margin: 5}} onChange={event => {
                                            qdispatch({type: 'setMobileNumber', payload: event.target.value})
                                            filterDispatch({type: 'setMobileNumber', payload: event.target.value})
                                        }} />
                                    <TextField variant='outlined' label='Government Id Number' value={filter.govtIdNumber} style={{margin: 5}} onChange={event => {
                                            qdispatch({type: 'setGovtIdNumber', payload: event.target.value})
                                            filterDispatch({type: 'setGovtIdNumber', payload: event.target.value})
                                        }} />
                                </div>
                                <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20}}>
                                    <Typography variant='h6' style={{color: lightGrey}}>
                                        Containment Area Based
                                    </Typography>
                                    <Button variant="contained" style={{backgroundColor: 
                                        lightGrey, color: '#fafafa', marginTop: 10}} onClick={() => setOpenContainmentAreaSelection(true)} >
                                        Select Containment Areas
                                    </Button>
                                    <FormControl style={{marginTop: 10}} > 
                                        <FormLabel>Select Zone Type</FormLabel>
                                        <FormControlLabel control={<Checkbox value="containment" checked={zoneTypes.includes('containment')} onChange={event => toggleZoneTypeSelection('containment')} />} label="Containment Zone" />
                                        <FormControlLabel control={<Checkbox value="buffer" checked={zoneTypes.includes('buffer')} onChange={event => toggleZoneTypeSelection('buffer')} />} label="Buffer Zone" />    
                                    </FormControl>
                                    <Button variant="contained" style={{backgroundColor: lightGrey, color: '#fafafa', marginTop: 10}}
                                    onClick={() => qdispatch({type: 'setZoneType', payload: zoneTypes})} >Set Zone</Button>
                                </div>
                                <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20}}>
                                    <Typography variant='h6' style={{color: lightGrey}}>
                                        Quarantine Status Based
                                    </Typography>
                                    <FormControl>
                                        <RadioGroup value={quarantineStatus} onChange={event => {
                                            setQuarantineStatus(event.target.value);
                                            qdispatch({type: 'setQuarantinedType', payload: event.target.value})
                                        }} >
                                            <FormControlLabel value='all' control={<Radio />} label="All"/>
                                            <FormControlLabel value='ever' control={<Radio />} label="Ever"/>
                                            <FormControlLabel value='never' control={<Radio />} label="Never"/>
                                            <FormControlLabel value='currently' control={<Radio />} label="Currently"/>
                                            <FormControlLabel value='released' control={<Radio />} label="Released"/>
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </div>
                        }
                        {(drawerAction == 'fieldsets') &&
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20}}>
                                <Typography variant='h6' style={{color: lightGrey}}>
                                    Basic Information
                                </Typography>
                                <FormControl style={{marginTop: 10}} > 
                                    <FormControlLabel control={<Checkbox value="name" checked={fieldsets.name} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Name" />
                                    <FormControlLabel control={<Checkbox value="age" checked={fieldsets.age} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Age" />
                                    <FormControlLabel control={<Checkbox value="sex" checked={fieldsets.sex} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Sex" />
                                    <FormControlLabel control={<Checkbox value="mobileNumber" checked={fieldsets.mobileNumber} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="MobileNumber" />
                                    <FormControlLabel control={<Checkbox value="govtIdType" checked={fieldsets.govtIdType} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Government Id Type" />
                                    <FormControlLabel control={<Checkbox value="govtIdNumber" checked={fieldsets.govtIdNumber} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Government Id Number" />
                                    <FormControlLabel control={<Checkbox value="containmentArea" checked={fieldsets.containmentArea} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Containment Area" />
                                    <FormControlLabel control={<Checkbox value="surveyDate" checked={fieldsets.surveyDate} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Survey Date" />
                                </FormControl>
                            </div>
                            <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20}}>
                                <Typography variant='h6' style={{color: lightGrey}}>
                                    Health And Travel
                                </Typography>
                                <FormControl style={{marginTop: 10}} > 
                                    <FormControlLabel control={<Checkbox value="symptoms" checked={fieldsets.symptoms} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Symptoms" />
                                    <FormControlLabel control={<Checkbox value="deseases" checked={fieldsets.deseases} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Deseases" />
                                    <FormControlLabel control={<Checkbox value="pregnancy" checked={fieldsets.pregnancy} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Pregnancy" />
                                    <FormControlLabel control={<Checkbox value="traveledFrom" checked={fieldsets.traveledFrom} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Traveled From" />
                                    <FormControlLabel control={<Checkbox value="travelDate" checked={fieldsets.travelDate} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Travel Date" />
                                    
                                </FormControl>
                            </div>
                            <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20}}>
                                <Typography variant='h6' style={{color: lightGrey}}>
                                    Corona specific
                                </Typography>
                                <FormControl style={{marginTop: 10}} > 
                                    <FormControlLabel control={<Checkbox value="sourceContacted" checked={fieldsets.sourceContacted} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Source Contacted" />
                                    <FormControlLabel control={<Checkbox value="contactNature" checked={fieldsets.contactNature} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Contact Nature" />
                                    <FormControlLabel control={<Checkbox value="contactRelaion" checked={fieldsets.contactRelation} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Relation With Contact" />
                                    <FormControlLabel control={<Checkbox value="riskLevel" checked={fieldsets.riskLevel} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Risk Level" />
                                    <FormControlLabel control={<Checkbox value="quarantineStatus" checked={fieldsets.quarantineStatus} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Quarantine Status" />
                                    <FormControlLabel control={<Checkbox value="quarantineDate" checked={fieldsets.quarantineDate} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Quarantine Date" />
                                    <FormControlLabel control={<Checkbox value="quarantineCenter" checked={fieldsets.quarantineCenter} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Quarantine Center" />
                                    <FormControlLabel control={<Checkbox value="releaseDate" checked={fieldsets.releaseDate} onChange={event => fdispatch({type: 'toggle', payload: event.target.value})} />} label="Release Date" />
                                </FormControl>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </Drawer>
            <Dialog open={openContainmentAreaSelection} onClose={() => setOpenContainmentAreaSelection(false)}>
                <div style={{padding: 20, display: 'flex', flexDirection: 'column'}}>
                    <FormControl>
                        {sortByName(containmentAreas).map(area => (
                            <FormControlLabel control={<Checkbox value={area._id} checked={selectedContainmentArea.includes(area._id)} onChange={event => toggleContainmentAreaSelection(event.target.value)} />} label={area.name} />
                        ))}
                    </FormControl>
                    <div>
                        <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa'}} onClick={() => 
                            {
                                qdispatch({type: 'setContainmentArea', payload: selectedContainmentArea});
                                setOpenContainmentAreaSelection(false)
                                }} >
                            Okay
                        </Button>
                        <Button variant="text" style={{color: lightBlue, marginLeft: 10}}
                        onClick={() => setOpenContainmentAreaSelection(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>

            <Dialog open={openQuarantineCenterSelection} onClose={() => setOpenQuarantineCenterSelection(false)} >
                <div style={{padding: 20, display: 'flex', flexDirection: 'column'}}>
                    <FormControl>
                        {sortByName(quarantineCenters).map(center => (
                            <FormControlLabel control={<Checkbox value={center._id} checked={filter.quarantineCenters.includes(center._id)} onChange={event => filterDispatch({type: 'toggleQuarantineCenter', payload: event.target.value})} />} label={center.name} />
                        ))}
                    </FormControl>
                    <div>
                        <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa'}} onClick={() => 
                            {
                                qdispatch({type: 'setQuarantineCenter', payload: filter.quarantineCenters});
                                setOpenQuarantineCenterSelection(false)
                                }} >
                            Okay
                        </Button>
                        <Button variant="text" style={{color: lightBlue, marginLeft: 10}}
                        onClick={() => setOpenQuarantineCenterSelection(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>

            <Dialog open={openAgeFilter} onClose={() => setOpenAgeFilter(false)} >
                <div style={{padding: 20, display: 'flex', flexDirection: 'column'}}>
                    <Typography style={{textAlign: 'center'}} >Age Filter</Typography>
                    <TextField type="number" style={{marginTop: 10}} variant='outlined' label="From" value={filter.minAge} onChange={event => filterDispatch({type: 'setMinAge', payload: event.target.value})} />
                    <TextField type="number" style={{marginTop: 10}} variant='outlined' label="To" value={filter.maxAge} onChange={event => filterDispatch({type: 'setMaxAge', payload: event.target.value})} />
                    <div style={{padding: 10, display: 'row'}}>
                        <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa'}} onClick={() => 
                            {
                                qdispatch({type: 'setAge', payload: {minAge: filter.minAge, maxAge: filter.maxAge}});
                                setOpenAgeFilter(false)
                                }} >
                            Okay
                        </Button>
                        <Button variant="text" style={{color: lightBlue, marginLeft: 10}}
                        onClick={() => setOpenAgeFilter(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>

            <Dialog open={openSurveyDateFilter} onClose={() => setOpenSurveyDateFilter(false)} >
                <div style={{padding: 20, display: 'flex', flexDirection: 'column'}}>
                    <Typography style={{textAlign: 'center'}} >Survey Date</Typography>
                    <TextField type="date" style={{marginTop: 10}} variant='outlined' label="From" value={filter.minSurveyDate} onChange={event => filterDispatch({type: 'setMinSurveyDate', payload: event.target.value})} />
                    <TextField type="date" style={{marginTop: 10}} variant='outlined' label="To" value={filter.maxSurveyDate} onChange={event => filterDispatch({type: 'setMaxSurveyDate', payload: event.target.value})} />
                    <div style={{padding: 10, display: 'row'}}>
                        <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa'}} onClick={() => 
                            {
                                qdispatch({type: 'setSurveyDate', payload: {minSurveyDate: filter.minSurveyDate, maxSurveyDate: filter.maxSurveyDate}});
                                setOpenSurveyDateFilter(false)
                                }} >
                            Okay
                        </Button>
                        <Button variant="text" style={{color: lightBlue, marginLeft: 10}}
                        onClick={() => setOpenSurveyDateFilter(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>

            <Dialog open={openRiskLevelFilter} onClose={() => setOpenRiskLevelFilter(false)}>
                <div style={{padding: 20, display: 'flex', flexDirection: 'column'}} >
                    <Typography style={{textAlign: 'center'}} >Risk Level</Typography>
                    <FormControl>
                        <FormControlLabel control={<Checkbox checked={filter.riskLevels.includes('low')} onChange={() => filterDispatch({type: 'setRiskLevel', payload: 'low'})} />} label="Low" />
                        <FormControlLabel control={<Checkbox checked={filter.riskLevels.includes('high')} onChange={() => filterDispatch({type: 'setRiskLevel', payload: 'high'})} />} label="High" />
                        <FormControlLabel control={<Checkbox checked={filter.riskLevels.includes('none')} onChange={() => filterDispatch({type: 'setRiskLevel', payload: 'none'})} />} label="None" />
                    </FormControl>
                    <div style={{padding: 10, display: 'row'}}>
                        <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa'}} onClick={() => 
                            {
                                qdispatch({type: 'setRiskLevel', payload: filter.riskLevels});
                                setOpenRiskLevelFilter(false)
                                }} >
                            Okay
                        </Button>
                        <Button variant="text" style={{color: lightBlue, marginLeft: 10}}
                        onClick={() => setOpenRiskLevelFilter(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>

            <Dialog open={openQuarantineDateFilter} onClose={() => setOpenQuarantineDateFilter(false)} >
                <div style={{padding: 20, display: 'flex', flexDirection: 'column'}}>
                    <Typography style={{textAlign: 'center'}} >Quarantine Date</Typography>
                    <TextField type="date" style={{marginTop: 10}} variant='outlined' label="From" value={filter.minQuarantineDate} onChange={event => filterDispatch({type: 'setMinQuarantineDate', payload: event.target.value})} />
                    <TextField type="date" style={{marginTop: 10}} variant='outlined' label="To" value={filter.maxQuarantineDate} onChange={event => filterDispatch({type: 'setMaxQuarantineDate', payload: event.target.value})} />
                    <div style={{padding: 10, display: 'row'}}>
                        <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa'}} onClick={() => 
                            {
                                qdispatch({type: 'setQuarantineDate', payload: {minQuarantineDate: filter.minQuarantineDate, maxQuarantineDate: filter.maxQuarantineDate}});
                                setOpenQuarantineDateFilter(false)
                                }} >
                            Okay
                        </Button>
                        <Button variant="text" style={{color: lightBlue, marginLeft: 10}}
                        onClick={() => setOpenQuarantineDateFilter(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>

            <Dialog open={openEditMember} onClose={() => setOpenEditMember(false)} >
                <div style={{padding: 10, display: 'flex', flexDirection: 'column'}}>
                    <Paper style={{maxHeight: 450, width: 500, overflow: 'auto'}} >
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <Typography>Symptoms</Typography>
                            <FormControl row>
                                <FormControlLabel control={<Checkbox checked={memberToEdit.symptoms.includes("cold")} value="cold" onChange={() => memberToEditDispatch({type: 'toggleSymptom', payload: 'cold'})} />} label="Cold" />
                                <FormControlLabel control={<Checkbox checked={memberToEdit.symptoms.includes("cough")} value="cough" onChange={() => memberToEditDispatch({type: 'toggleSymptom', payload: 'cough'})} />} label="Cough" />
                                <FormControlLabel control={<Checkbox checked={memberToEdit.symptoms.includes("fever")} value="fever" onChange={() => memberToEditDispatch({type: 'toggleSymptom', payload: 'fever'})} />} label="Fever" />
                                <FormControlLabel control={<Checkbox checked={memberToEdit.symptoms.includes("short_breating")} value="short_breathing" onChange={() => memberToEditDispatch({type: 'toggleSymptom', payload: 'short_breathing'})} />} label="Short Breating" />
                            </FormControl>
                            <Divider />
                            <Typography style={{marginTop: 10}} >Deseases</Typography>
                            <FormControl row>
                                <FormControlLabel control={<Checkbox checked={memberToEdit.deseases.includes("sugar")} value="sugar" onChange={() => memberToEditDispatch({type: 'toggleDesease', payload: 'sugar'})} />} label="Sugar" />
                                <FormControlLabel control={<Checkbox checked={memberToEdit.deseases.includes("blood_pressure")} value="blood_pressure" onChange={() => memberToEditDispatch({type: 'toggleDesease', payload: 'blood_pressure'})} />} label="Blood Pressure" />
                                <FormControlLabel control={<Checkbox checked={memberToEdit.deseases.includes("diabetes")} value="diabetes" onChange={() => memberToEditDispatch({type: 'toggleDesease', payload: 'diabetes'})} />} label="Diabetes" />
                                <FormControlLabel control={<Checkbox checked={memberToEdit.deseases.includes("cancer")} value="cancer" onChange={() => memberToEditDispatch({type: 'toggleDesease', payload: 'cancer'})} />} label="Cancer" />
                            </FormControl>
                            <Divider />
                            <FormControl style={{marginTop: 10}}>
                                <FormControlLabel control={<Checkbox checked={memberToEdit.quarantined} onChange={() => memberToEditDispatch({type: 'toggleQuarantined'})} />} label="Quarantined" />
                            </FormControl>
                            <Divider />
                            {memberToEdit.quarantined &&
                                <div>
                                    <FormControl variant="outlined" style={{marginTop: 10}} >
                                        <InputLabel id="qCenterId" >Quarantine Center</InputLabel>
                                        <Select labelId="qCenterId" label="Quarantine Center" value={(memberToEdit.homeQuarantined && memberToEdit.quarantined) ? 'home' : memberToEdit.quarantineCenter} onChange={event => memberToEdit({type: 'setQuarantineCenter', payload: event.target.value})} >
                                            <MenuItem value='home' >Home</MenuItem>
                                            {sortByName(quarantineCenters).map(center => (
                                                <MenuItem value={center._id}>{center.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <div style={{marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <Typography style={{marginRight: 10}} >Quarantine Date</Typography>
                                        <TextField type="date" value={memberToEdit.quarantineDate.split('T')[0]} onChange={event => memberToEditDispatch({type: 'setQuarantineDate', payload: event.target.value}) } />
                                    </div>
                                    <div style={{marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <Typography style={{marginRight: 10}} >Release Date</Typography>
                                        <TextField type="date" value={memberToEdit.releaseDate.split('T')[0]} onChange={event => memberToEditDispatch({type: 'setReleaseDate', payload: event.target.value})} />
                                    </div>
                                </div>
                            }
                        </div>
                    </Paper>
                    <div style={{padding: 10, display: 'flex', justifyContent: 'center'
                        , alignItems: 'center' }} >
                        <Button variant="contained" style={{backgroundColor: lightGrey, color: '#fafafa'}} 
                         onClick={() => saveEditedMember()} >
                            Save
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

let mapActionsToProps = dispatch => {
    return {
        setAdmin: admin => dispatch(setAdmin(admin))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(GeneralReport)