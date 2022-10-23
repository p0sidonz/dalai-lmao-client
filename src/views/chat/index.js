/* eslint-disable */

import React, { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Box,
    CardContent,
    ClickAwayListener,
    Divider,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Popper,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import { io } from 'socket.io-client';
import ShowLoader from 'ui-component/custom/Loader';
import moment from 'moment/moment';

// project imports
import UserDetails from './UserDetails';
import ChartHistory from './ChartHistory';
import MainCard from 'ui-component/cards/MainCard';
import { appDrawerWidth as drawerWidth, gridSpacing } from 'store/constant';
import { useDispatch, useSelector } from 'store';
import { getUser, getUserChats, insertChat } from 'store/slices/chat';
import useAuth from 'hooks/useAuth';

// assets
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import MoodTwoToneIcon from '@mui/icons-material/MoodTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';

// drawer content element
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    paddingLeft: open ? theme.spacing(3) : 0,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter
    }),
    marginLeft: `-${drawerWidth}px`,
    [theme.breakpoints.down('lg')]: {
        paddingLeft: 0,
        marginLeft: 0
    },
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shorter
        }),
        marginLeft: 0
    })
}));

// ==============================|| APPLICATION CHAT ||============================== //

const ChatMainPage = () => {
    const userId = parseInt(window.localStorage.getItem('id'));
    const user = JSON.parse(window.localStorage.getItem('user'));
    const [lastIndexOf, setLastIndexOf] = useState(-1);
    const [isLoading, setIsLoading] = useState(Boolean(false));
    const socket = io('https://env-0216910.cloudjiffy.net');
    // const socket = io('http://localhost:3000/');

    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('lg'));

    const dispatch = useDispatch();

    // set chat details page open when user is selected from sidebar
    const [emailDetails, setEmailDetails] = React.useState(false);
    const handleUserChange = () => {
        setEmailDetails((prev) => !prev);
    };
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {
        setIsLoading(true);
        socket.emit('findAllMessages', {}, (response) => {
            setMessages(response);
            setIsLoading(false);
        });

        socket.on('message', (newMessage) => {
            if (newMessage.UserInfo.id === user.id) {
                return;
            } else {
                setMessages((old) => old.concat({ ...newMessage }));
            }
        });
    }, []);

    // handle new message form
    const [message, setMessage] = useState('');
    const handleOnSend = () => {
        if (message == '') {
            return;
        }
        setMessages((old) =>
            old.concat({
                id: user.id,
                text: message,
                created_at: moment(Date.now()).format('LLL'),
                UserInfo: { id: user.id, first_name: user.first_name, last_name: user.last_name }
            })
        );
        setMessage('');
        socket.emit('createMessage', { message, id: user.id }, (r) => {
            setMessage('');
        });
    };

    const handleEnter = (event) => {
        if (event?.key !== 'Enter') {
            return;
        }
        handleOnSend();
    };

    // handle emoji
    const onEmojiClick = (event, emojiObject) => {
        setMessage(message + emojiObject.emoji);
    };

    const [anchorElEmoji, setAnchorElEmoji] = React.useState(); /** No single type can cater for all elements */
    const handleOnEmojiButtonClick = (event) => {
        setAnchorElEmoji(anchorElEmoji ? null : event?.currentTarget);
    };

    const emojiOpen = Boolean(anchorElEmoji);
    const emojiId = emojiOpen ? 'simple-popper' : undefined;
    const handleCloseEmoji = () => {
        setAnchorElEmoji(null);
    };

    // if (!user) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ display: 'flex' }}>
            <ShowLoader isLoading={isLoading} />

            <Main theme={theme}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs zeroMinWidth sx={{ display: emailDetails ? { xs: 'none', sm: 'flex' } : 'flex' }}>
                        <MainCard
                            sx={{
                                bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50',
                                marginBottom: 5
                            }}
                        >
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <Grid container alignItems="center" spacing={0.5}>
                                        <Grid item>
                                            <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                                                <Grid item>
                                                    <Typography variant="h4">Chat Box</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item sm zeroMinWidth />
                                    </Grid>
                                    <Divider sx={{ mt: theme.spacing(2) }} />
                                </Grid>
                                <PerfectScrollbar
                                    style={{ width: '100%', height: 'calc(100vh - 400px)', overflowX: 'hidden', minHeight: 460 }}
                                >
                                    <CardContent>
                                        <ChartHistory theme={theme} data={messages} />
                                    </CardContent>
                                </PerfectScrollbar>
                                <Grid item xs={12}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <IconButton
                                                ref={anchorElEmoji}
                                                aria-describedby={emojiId}
                                                onClick={handleOnEmojiButtonClick}
                                                size="large"
                                            >
                                                <MoodTwoToneIcon />
                                            </IconButton>
                                            <Popper
                                                id={emojiId}
                                                open={emojiOpen}
                                                anchorEl={anchorElEmoji}
                                                disablePortal
                                                popperOptions={{
                                                    modifiers: [
                                                        {
                                                            name: 'offset',
                                                            options: {
                                                                offset: [-20, 20]
                                                            }
                                                        }
                                                    ]
                                                }}
                                            >
                                                <ClickAwayListener onClickAway={handleCloseEmoji}>
                                                    <>
                                                        {emojiOpen && (
                                                            <MainCard elevation={8} content={false}>
                                                                <Picker
                                                                    onEmojiClick={onEmojiClick}
                                                                    skinTone={SKIN_TONE_MEDIUM_DARK}
                                                                    disableAutoFocus
                                                                />
                                                            </MainCard>
                                                        )}
                                                    </>
                                                </ClickAwayListener>
                                            </Popper>
                                        </Grid>
                                        <Grid item xs zeroMinWidth>
                                            <TextField
                                                fullWidth
                                                label="Type a Message"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyPress={handleEnter}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <IconButton color="primary" onClick={handleOnSend} size="large">
                                                <SendTwoToneIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                </Grid>
            </Main>
        </Box>
    );
};

export default ChatMainPage;
