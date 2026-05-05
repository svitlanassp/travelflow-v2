import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion'; // 👈 Додали це
import './TripChatWidget.css';

const windowVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.8, originX: 1, originY: 1 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { opacity: 0, y: 40, scale: 0.8 }
};

const buttonVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
};

function TripChatWidget() {
    const dragControls = useDragControls();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    
    const [username] = useState(() => localStorage.getItem('userName') || 'Anonymous');
    
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        ws.current = new WebSocket('ws://127.0.0.1:8000/ws/chat/');

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, data]);
        };

        ws.current.onclose = () => console.log("WebSocket disconnected");

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputValue.trim() === '') return;

        ws.current.send(JSON.stringify({
            message: inputValue,
            username: username
        }));
        
        setInputValue('');
    };

    return (
        <div className="chat-widget-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="chat-window"
                        variants={windowVariants}  
                        initial="hidden"            
                        animate="visible"           
                        exit="exit"
                        
                        drag 
                        dragControls={dragControls} 
                        dragListener={false} 
                        dragMomentum={false} 
                    >
                        <div 
                            className="chat-header" 
                            onPointerDown={(e) => dragControls.start(e)} 
                            style={{ cursor: 'grab' }}
                        >
                            <span>Live Chat</span>
                            <button 
                                className="chat-close-btn" 
                                onPointerDown={(e) => e.stopPropagation()} 
                                onClick={() => setIsOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`chat-message ${msg.username === username ? 'is-mine' : ''}`}>
                                    <span className="message-author">{msg.username}</span>
                                    {msg.message}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={sendMessage}>
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button type="submit" className="chat-send-btn">Send</button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isOpen && (
                    <motion.button 
                        className="chat-toggle-btn" 
                        onClick={() => setIsOpen(true)}
                        variants={buttonVariants}
                        initial="hidden" animate="visible" exit="exit"
                        whileHover="hover" whileTap="tap"
                    >
                        💬
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

export default TripChatWidget;