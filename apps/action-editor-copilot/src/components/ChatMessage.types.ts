export interface Message {
    text: string;
    reply?: boolean;
}

export interface ChatMessageProps {
    message: Message;
    error?: boolean;
}
