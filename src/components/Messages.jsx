import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [token, setToken] = useState(null);
  const url = "http://localhost:8000";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (storedToken) fetchMessages(storedToken);
  }, []);

  const fetchMessages = async (authToken) => {
    try {
      const response = await axios.get(`${url}/posts`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error.response?.status, error.response?.data || error.message);
    }
  };

  const sendMessage = async () => {
    if (title.trim() === '' || newMessage.trim() === '') {
      alert("Título e mensagem são obrigatórios.");
      return;
    }

    const postData = {
      title,
      text: newMessage,
      date: new Date().toISOString()
    };

    try {
      const response = await axios.post(`${url}/posts`, postData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Post criado:", response.data);
      setTitle('');
      setNewMessage('');
      fetchMessages(token);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error.response?.status, error.response?.data || error.message);
      alert("Erro ao enviar. Verifique se está logado.");
    }
  };

  return (
    <div>
      <h2>Nova Mensagem</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
      />
      <br />
      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Mensagem"
      />
      <br />
      <button onClick={sendMessage}>Enviar</button>

      <h2>Mensagens</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.title}</strong> — {msg.text} <br />
            <small>{new Date(msg.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
