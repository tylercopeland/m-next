/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { AiChatBox } from '@m-next/ai-prompt/src/AIChatBot';
import { createHumanMessage, createAssistantMessage, createTextContent } from '@m-next/api-interface';
import { toPascalCase } from '@m-next/utilities';

const INITIAL_MESSAGE = createAssistantMessage([
    createTextContent(
        `Hi there! I'm your AI Copilot. I can explain your action sets, including details on specific fields and how action results are used. How can I help you today?`
    )
]);

const normalizeWhereClauseItem = (item) => ({
    Operation: item.Operation ?? null,
    DateField: item.DateField ?? null,
    Source: item.Source ?? null,
});

const normalizeBindingItem = (item) => ({
    FieldName: item.FieldName ?? null,
    UpdateControl: item.UpdateControl ?? false,
    ControlToUpdate: item.ControlToUpdate ?? null,
    ResultToSet: item.ResultToSet ?? null,
    ...item,
});

const normalizeActions = (actions) => {
    if (!Array.isArray(actions)) return actions;
    actions.forEach(action => {
        if (action.WhereClause) {
            action.WhereClause = action.WhereClause.map(normalizeWhereClauseItem);
        }
        if (action.ExpressionList) {
            action.ExpressionList = action.ExpressionList.map(normalizeWhereClauseItem);
        }
        if (action.Bindings) {
            action.Bindings = action.Bindings.map(normalizeBindingItem);
        }
        // toPascalCase converts 'cc' -> 'Cc' and 'bcc' -> 'Bcc', but models expect 'CC'/'BCC'
        if ('Cc' in action) { action.CC = action.Cc; delete action.Cc; }
        if ('Bcc' in action) { action.BCC = action.Bcc; delete action.Bcc; }
        // Ensure ControlToUpdate is null (not undefined) for models that check !== null
        if (!('ControlToUpdate' in action)) {
            action.ControlToUpdate = null;
        }
        if (!('SecondControlToUpdate' in action)) {
            action.SecondControlToUpdate = null;
        }
        if (action.LoopActionSet?.Actions) {
            normalizeActions(action.LoopActionSet.Actions);
        }
        if (action.ActionSetOnTrue?.Actions) {
            normalizeActions(action.ActionSetOnTrue.Actions);
        }
        if (action.ActionSetOnFalse?.Actions) {
            normalizeActions(action.ActionSetOnFalse.Actions);
        }
    });
    return actions;
};

const getBaseUrl = () => {
    const { hostname } = window.location;
    const parts = hostname.split('.');
    const domain = parts.slice(-2).join('.');
    return domain === 'methodlocal.com' ? 'http://localhost:3100' : `https://nca.${domain}`;
};

const FriendlyPrompt = ({
    open = false,
    authToken = '',
    authTokenV2 = '',
    screenId = '',
    versionId = '',
    eventId = '',
    accountName = '',
    onActionSetReplace
}) => {
    const [isWaiting, setIsWaiting] = useState(false);
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [sessionId, setSessionId] = useState(null);
    const hasStartedSession = useRef(false);

    useEffect(() => {
        if (!open || !accountName || !authToken || !authTokenV2 || hasStartedSession.current) return;
        hasStartedSession.current = true;

        const startSession = async () => {
            try {
                const res = await fetch(`${getBaseUrl()}/session/start`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        accountName,
                        v2Token: authTokenV2,
                        rtcToken: authToken,
                    }),
                });
                if (!res.ok) throw new Error(`Session start failed: ${res.status}`);
                const data = await res.json();
                setSessionId(data.sessionId);
            } catch (err) {
                console.error('Failed to start NCA session:', err);
                const errorMessage = createAssistantMessage([
                    createTextContent('Failed to initialize AI assistant. Please try again.')
                ]);
                setMessages(prev => [...prev, errorMessage]);
                hasStartedSession.current = false;
            }
        };
        startSession();
    }, [open, accountName, authToken, authTokenV2]);

    const handleSendMessage = async (text) => {
        console.log('User message:', text, sessionId);
        if (!text.trim() || !sessionId) return;

        const userMessage = createHumanMessage([createTextContent(text)]);
        setMessages(prev => [...prev, userMessage]);
        setIsWaiting(true);

        try {
            const res = await fetch(`${getBaseUrl()}/build-action-set`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    intent: text.trim(),
                    screenId,
                    versionId,
                    eventId,
                    session: { sessionId, accountName },
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data?.error?.message) {
                    let errorText = data.error.message;
                    if (data.error.suggestedActions?.length > 0) {
                        errorText += `\n\nYou could try:\n${data.error.suggestedActions.map(s => `• ${s}`).join('\n')}`;
                    }
                    const aiMessage = createAssistantMessage([createTextContent(errorText)]);
                    setMessages(prev => [...prev, aiMessage]);
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            if (data.status === 'failed' && data.error) {
                const { message, suggestedActions } = data.error;
                let errorText = message || 'Something went wrong.';
                if (suggestedActions && suggestedActions.length > 0) {
                    errorText += `\n\nYou could try:\n${  suggestedActions.map(s => `• ${s}`).join('\n')}`;
                }
                const aiMessage = createAssistantMessage([createTextContent(errorText)]);
                setMessages(prev => [...prev, aiMessage]);
            } else if (data.status === 'success' && data.result?.data?.actionSet) {
                const { summary, warnings } = data.result.data;
                const convertedActionSet = toPascalCase(data.result.data.actionSet);
                const actions = convertedActionSet.Actions;

                let responseText = summary || 'Action set generated successfully.';
                if (warnings && warnings.length > 0) {
                    responseText += `\n\nWarnings:\n${  warnings.map(w => `⚠ ${w}`).join('\n')}`;
                }

                const aiMessage = createAssistantMessage([createTextContent(responseText)]);
                setMessages(prev => [...prev, aiMessage]);

                if (onActionSetReplace && actions) {
                    normalizeActions(actions);
                    onActionSetReplace(actions);
                }
            } else {
                const responseText = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
                const aiMessage = createAssistantMessage([createTextContent(responseText)]);
                setMessages(prev => [...prev, aiMessage]);
            }
        } catch (error) {
            const errorMessage = createAssistantMessage([
                createTextContent(`Error: ${error.message || 'An error occurred'}`)
            ]);
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsWaiting(false);
        }
    };

    if (!open) return null;

    return (
        <AiChatBox
            messages={messages}
            isLoading={isWaiting}
            onSendMessage={handleSendMessage}
            placeholder="What do you want to do?"
            assistantName="AI Copilot"
        />
    );
};

export default FriendlyPrompt;
