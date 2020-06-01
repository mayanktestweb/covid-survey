import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { TextField, Button, CircularProgress, Dialog, Typography } from '@material-ui/core'
import { Add, Delete } from '@material-ui/icons'
import { lightBlue, errorRed } from '../colors'
import Axios from 'axios'
import Apis from '../Apis'


let AreaBlocks = props => {

    const [loading, setLoading] = useState(false)
    const [blocks, setBlocks] = useState([])

    const [newBlock, setNewBlock] = useState("")
    const [openDeleteBlock, setOpenDeleteBlock] = useState(false)
    const [blockToDelete, setBlockToDelete] = useState(null)

    useEffect(() => {
        loadBlocks()
        return () => {
            
        }
    }, [])

    let loadBlocks = () => {
        setLoading(true)
        Axios.get(Apis.area_blocks).then(res => {
            if(res.status == '200') {
                setBlocks(res.data.blocks)
            }
        }).catch(err => alert("Something went wrong"))
        .finally(() => setLoading(false))
    }

    let sortBlocks = blocks => {
        return blocks.sort((bone, btwo) => {
            if(bone.name > btwo.name) return 1
            else if (bone.name < btwo.name) return -1
            else return 0
        })
    }

    let addNewBlock = () => {
        if(newBlock.trim() == "") alert("Please Provide A Name")
        else Axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+props.admin.token
            },
            url: Apis.add_block,
            method: 'POST',
            data: {
                name: newBlock
            }
        }).then(res => {
            if(res.status == '200') {
                setBlocks([...blocks, res.data.block])
                setNewBlock("")
            }
        }).catch(err => alert("Something went wrong"))
    }

    let startBlockDeletion = block => {
        setBlockToDelete(block)
        setOpenDeleteBlock(true)
    }


    let deleteBlock = () => {
        Axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+props.admin.token
            },
            url: Apis.delete_block,
            method: 'POST',
            data: {
                blockId: blockToDelete._id
            }
        }).then(res => {
            if(res.status == '200') {
                let currentBlocks = [...blocks]
                currentBlocks.forEach((item, index) => {
                    if(item._id == blockToDelete._id) currentBlocks.splice(index, 1)
                })

                setBlocks(currentBlocks)
                setBlockToDelete(null)
            }
        }).catch(err => alert("Something went wrong"))
    }

    return (
        <div style={{height: '100vh'}}>
            {loading &&
                <div style={{height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress />
                </div>
            }

            {!loading &&
                <div>
                    <div style={{position: "fixed", top: 0, width: '100%', backgroundColor: 'white', 
                    display: 'flex', flexDirection: 'row', padding: 10, zIndex: 10}}>
                        <TextField variant="outlined" label="Enter Area Block" value={newBlock} onChange={event => setNewBlock(event.target.value)} />
                        <Button variant="contained" startIcon={<Add />} style={{backgroundColor: lightBlue, 
                            color: "#fafafa", marginLeft: 10}} onClick={() => addNewBlock()} >ADD AREA BLOCK</Button>
                    </div>
        
                    <div>
                        <div style={{marginTop: 80}}>
                            {sortBlocks(blocks).map(block => (
                                <div style={{padding: 10, display: 'flex', flexDirection: 'row'}} >
                                    <Typography variant="h6" >{block.name}</Typography>
                                    <Button variant="contained" startIcon={<Delete />} style={{
                                        backgroundColor: errorRed, color: "#fafafa", marginLeft: 10
                                    }} onClick={() => startBlockDeletion(block)} >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Dialog open={openDeleteBlock} onClick={() => setOpenDeleteBlock(false)} >
                        <div style={{padding: 20}}>
                            <Typography variant="subtitle2">
                                Are you sure to delete {(blockToDelete !== null) ? blockToDelete.name : ''}
                            </Typography>
                            <div style={{marginTop: 15, display: "flex", flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Button variant="contained" style={{backgroundColor: errorRed, color: "#fafafa"}} 
                                onClick={() => deleteBlock()}>
                                    Yes, Delete
                                </Button>
                                <Button variant="text" style={{color: errorRed}} onClick={() => setOpenDeleteBlock(false)} >Cancel</Button>
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

export default connect(mapStateToProps)(AreaBlocks)