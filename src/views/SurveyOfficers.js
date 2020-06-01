import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { CircularProgress, TextField, Button, IconButton, colors, Typography, Dialog } from '@material-ui/core'
import { Search, Add, Delete } from '@material-ui/icons'
import Axios from 'axios'
import Apis from '../Apis'
import { lightBlue, lightOrange, errorRed } from '../colors'

let SurveyOfficer = props => {

    const [surveyOfficers, setSurveyOfficers] = useState([])
    const [queryString, setQueryString] = useState("")
    const [loading, setLoading] = useState(false)

    const [openAddOfficer, setOpenAddOfficer] = useState(false)
    const [newOfficerName, setNewOfficerName] = useState('')
    const [newOfficerAge, setNewOfficerAge] = useState('')
    const [newOfficerMobileNumber, setNewOfficerMobileNumber] = useState('')
    const [newOfficerAdhar, setNewOfficerAdhar] = useState('')

    const [openDeleteOfficer, setOpenDeleteOfficer] = useState(false)
    const [officerToDelete, setOfficerToDelete] = useState(null)

    useEffect(() => {
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
        }).catch(error => {
            alert("something went wrong")
        }).finally(() => setLoading(false))
        return () => {
            
        }
    }, [])


    let SortedSurveyOfficers = props => {

        const [officersToShow, setOfficersToShow] = useState([])

        let sortedOfficers = officers => {
            return props.surveyOfficers.sort((oone, otwo) => {
                if(oone.name > otwo.name) return 1
                else if (oone.name < otwo.name) return -1
                else return 0
            })
        }


        useEffect(() => {
            
            if(props.query.trim() == "") {
                setOfficersToShow(props.surveyOfficers)
            }

            return () => {
                
            }
        }, [props.query, props.surveyOfficers])


        let showOfficers = sortedOfficers(officersToShow).map(officer => {
            return (
                <div style={{margin: 10, borderWidth: 1, borderColor: lightBlue, borderRadius: 10,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography style={{width: '20%'}} variant="subtitle2">{officer.name}</Typography>
                    <Typography style={{width: '20%'}} variant="subtitle2">{officer.mobileNumber.replace("+91", "")}</Typography>
                    <Typography style={{width: '20%'}} variant="subtitle2">{officer.age}</Typography>
                    <Typography style={{width: '20%'}} variant="subtitle2">{officer.adhar}</Typography>
                    <Button variant="contained" startIcon={<Delete />}
                     style={{backgroundColor: errorRed, color: '#fafafa'}} onClick={() => props.startOfficerDeletion(officer)} >
                         Delete
                     </Button>
                </div>
            )
        })

        return (
            <div style={{padding: 10}}>
                {showOfficers}
            </div>
        )
    }

    let handleQueryString = event => {
        setQueryString(event.target.value)
    }

    let addOfficer = () => {
        Axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+props.admin.token
            },
            url: Apis.add_survey_officer,
            method: 'POST',
            data: {
                name: newOfficerName,
                mobileNumber: "+91"+newOfficerMobileNumber,
                age: newOfficerAge,
                adhar: newOfficerAdhar
            }
        }).then(res => {
            if(res.status == '200') {
                setSurveyOfficers([...surveyOfficers, res.data.surveyOfficer])
                setNewOfficerName('')
                setNewOfficerMobileNumber('')
                setNewOfficerAge('')
                setNewOfficerAdhar('')
                
                alert("Officer Added Successfully")
            }
        }).catch(err => {
            alert("Something went wrong")
        }).finally(() => {
            setOpenAddOfficer(false)
        })
    }

    let startOfficerDeletion = officer => {
        setOfficerToDelete(officer)
        setOpenDeleteOfficer(true)
    }

    let deleteOfficer = () => {
        Axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+props.admin.token
            },
            url: Apis.delete_survey_officer,
            method: 'POST',
            data: {
                officerId: officerToDelete._id
            }
        }).then(res => {
            if(res.status == '200') {
                let officers = [...surveyOfficers]
                officers.forEach((item, index) => {
                    if(item._id == officerToDelete._id) {
                        officers.splice(index, 1)
                    }
                })
                setSurveyOfficers(officers)
                setOfficerToDelete(null)
            }
        }).catch(err => alert("Something went wrong"))
        .finally(() => setOpenDeleteOfficer(false))
    }

    return (
        <div style={{height: '100vh'}}>
            {loading &&
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress style={{marginTop: 50}} />
                </div>
            }

            {!loading && 
                <div>
                    <div style={{position: 'fixed', top: 0, width: '100%', padding: 5, display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                    backgroundColor: 'white'}}>
                        
                        <TextField variant="outlined" label="Search Query..." value={queryString} 
                        onChange={handleQueryString} />
                        
                        <Button variant="contained" startIcon={<Search />} 
                        style={{backgroundColor: lightBlue, color: '#fafafa', marginLeft: 10}}>Search</Button>
                        
                        <Button variant="contained" startIcon={<Add />} 
                        style={{backgroundColor: lightOrange, color: '#fafafa', marginLeft: 10}} 
                        onClick={() => setOpenAddOfficer(true)}>Add Survey Officer</Button>
                    
                    </div>
                    
                    <div style={{marginTop: 80}}>
                        <SortedSurveyOfficers surveyOfficers={surveyOfficers} query={queryString}
                         startOfficerDeletion={startOfficerDeletion} />
                    </div>
                
                    <Dialog open={openAddOfficer} onClose={() => setOpenAddOfficer(false)} >
                        <div style={{padding: 20}}>
                            <div style={{display: 'flex', flexDirection:"column"}}>
                                <TextField variant="outlined" label="Name" value={newOfficerName} onChange={event => setNewOfficerName(event.target.value)} />
                                <TextField variant="outlined" label="Mobile Number" value={newOfficerMobileNumber} onChange={event => setNewOfficerMobileNumber(event.target.value)} style={{marginTop: 10}} />
                                <TextField variant="outlined" label="Age" value={newOfficerAge} type="number" onChange={event => setNewOfficerAge(event.target.value)} style={{marginTop: 10}}/>
                                <TextField variant="outlined" label="Adhar Card Number" value={newOfficerAdhar} onChange={event => setNewOfficerAdhar(event.target.value)} style={{marginTop: 10}}/>
                                <div style={{marginTop: 20, display: 'flex', flexDirection: 'row', 
                                    justifyContent:"flex-end"}}>
                                        <Button variant="contained" style={{backgroundColor: lightBlue,
                                        color: '#fafafa'}} onClick={() => addOfficer()}>
                                            Add Officer
                                        </Button>

                                        <Button variant="text" style={{color: lightBlue}} 
                                        onClick={() => setOpenAddOfficer(false)}>
                                            Cancel
                                        </Button>
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog open={openDeleteOfficer} onClose={() => setOpenDeleteOfficer(false)} >
                        <div style={{padding: 20, display: 'flex', flexDirection: 'column'}} >
                            <Typography variant="subtitle2">
                                Are you sure to delete {(officerToDelete != null) ? officerToDelete.name : ''}
                            </Typography>
                            <div style={{padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                                <Button variant="contained" style={{backgroundColor: errorRed, 
                                    color: '#fafafa'}} onClick={() => deleteOfficer()} >
                                        Yes, Delete
                                </Button>
                                <Button variant="text" style={{color: errorRed, marginLeft: 10}}
                                 onClick={() => setOpenDeleteOfficer(false)} >
                                     Cancel
                                 </Button>
                            </div>
                        </div>
                    </Dialog>

                </div>
            }
           
        </div>
    )
}

let mapStateToProps = state => {
    return {
        admin: state.admin
    }
}

export default connect(mapStateToProps)(SurveyOfficer)