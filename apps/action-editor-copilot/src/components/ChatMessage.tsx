import React from "react";
import "./ChatMessage.scss";
import { ChatMessageProps } from "./ChatMessage.types";

const ChatMessage: React.FC<ChatMessageProps> = ({ message, error = false }) => (
    <div
        role="listitem"
        aria-label={message.reply ? "Assistant replied" : "User said"}
        className={`message ${message.reply ? "reply" : "user"} ${error ? "error" : ""}`}
    >
        {message.text}
    </div>
);

export default ChatMessage;
