import React, { useState, useEffect } from 'react'

import Avatar from '@mui/material/Avatar';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import PushPinIcon from '@mui/icons-material/PushPin';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';

export const GroupSetting = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>

            <div onClick={handleClick} className='text-sm' >
                <MoreVertIcon />
            </div>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >

                <MenuItem onClick={handleClose}>

                    <ListItemIcon>
                        <PushPinIcon fontSize="small" />
                    </ListItemIcon>

                    <ListItemText>Pin Group</ListItemText>

                </MenuItem>


                <MenuItem onClick={handleClose}>

                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>

                    <ListItemText>Update Group</ListItemText>

                </MenuItem>


                <MenuItem onClick={handleClose}>

                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>

                    <ListItemText>Leave Group</ListItemText>

                </MenuItem>


                <MenuItem onClick={handleClose}>

                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>

                    <ListItemText>Delete Group</ListItemText>

                </MenuItem>

            </Menu>

        </div>
    )
}
