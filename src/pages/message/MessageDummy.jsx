import React, { useState } from "react";
import { Box, Paper, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField, Button, Container, styled } from "@mui/material";
import { IoMdSend } from "react-icons/io";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "20px",
  height: "calc(100vh - 40px)",
  display: "flex",
  flexDirection: "column"
}));

const MessageContainer = styled(Box)({
  flexGrow: 1,
  overflow: "auto",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
});

const MessageBubble = styled(Box)(({ isOwn }) => ({
  padding: "10px 15px",
  borderRadius: "15px",
  maxWidth: "70%",
  alignSelf: isOwn ? "flex-end" : "flex-start",
  backgroundColor: isOwn ? "#1976d2" : "#f5f5f5",
  color: isOwn ? "white" : "black"
}));

const MessageDummy = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState("");
  const [chats] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      messages: [
        { id: 1, text: "Hey, how are you?", isOwn: false, timestamp: "09:00 AM" },
        { id: 2, text: "I'm good, thanks! How about you?", isOwn: true, timestamp: "09:02 AM" }
      ]
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      messages: [
        { id: 1, text: "Did you check the latest updates?", isOwn: false, timestamp: "10:15 AM" },
        { id: 2, text: "Yes, they look great!", isOwn: true, timestamp: "10:17 AM" }
      ]
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedContact) return;

    const newMessage = {
      id: selectedContact.messages.length + 1,
      text: message,
      isOwn: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    selectedContact.messages.push(newMessage);
    setMessage("");
  };

  return (
    <Container maxWidth="lg" sx={{ height: "100vh", py: 2 }}>
      <Box display="flex" gap={2} height="100%">
        <Paper sx={{ width: 320, overflow: "hidden" }}>
          <List sx={{ height: "100%", overflow: "auto" }}>
            {chats.map((chat) => (
              <ListItem
                key={chat.id}
                button
                onClick={() => setSelectedContact(chat)}
                selected={selectedContact?.id === chat.id}
              >
                <ListItemAvatar>
                  <Avatar src={chat.avatar} alt={chat.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={chat.name}
                  secondary={chat.messages[chat.messages.length - 1].text}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {selectedContact ? (
          <StyledPaper elevation={3} sx={{ flex: 1 }}>
            <Box display="flex" alignItems="center" gap={2} pb={2}>
              <Avatar src={selectedContact.avatar} alt={selectedContact.name} />
              <Typography variant="h6">{selectedContact.name}</Typography>
            </Box>

            <MessageContainer>
              {selectedContact.messages.map((msg) => (
                <MessageBubble key={msg.id} isOwn={msg.isOwn}>
                  <Typography variant="body1">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {msg.timestamp}
                  </Typography>
                </MessageBubble>
              ))}
            </MessageContainer>

            <Box display="flex" gap={1} pt={2}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <IoMdSend size={20} />
              </Button>
            </Box>
          </StyledPaper>
        ) : (
          <Paper
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Typography variant="h6" color="textSecondary">
              Select a chat to start messaging a
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default MessageDummy;