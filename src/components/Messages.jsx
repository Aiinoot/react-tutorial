import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [titulo, setTitulo] = useState('');
  const token = localStorage.getItem('token');
  const url = "http://localhost:8000";

  const fetchMessages = async () => {
    const response = await axios.get(`${url}/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(response.data);
  };

  const sendMessage = async () => {
    if (newMessage.trim() !== '' && titulo.trim() !== '') {
      await axios.post(`${url}/posts`, {
        title: titulo,
        text: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage('');
      setTitulo('');
      fetchMessages();
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título da mensagem"
      />
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Digite sua mensagem"
      />
      <button onClick={sendMessage}>Enviar</button>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.title}</strong><br />
            {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
