import './KanbanBoard.css';
import React, { useState, useEffect } from 'react';

const KanbanBoard = () => {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [groupBy, setGroupBy] = useState('status'); // Default grouping
    const [sortBy, setSortBy] = useState('priority'); // Default sorting
    const [showDropdowns, setShowDropdowns] = useState(false); // State to toggle dropdown visibility

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
            const data = await response.json();
            setTickets(data.tickets);
            setUsers(data.users);
        };

        fetchData();
    }, []);

    const getUserName = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.name : 'Unknown';
    };

    const groupTickets = (tickets, groupBy) => {
        return tickets.reduce((acc, ticket) => {
            const key = groupBy === 'userId' ? getUserName(ticket.userId) : ticket[groupBy];
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(ticket);
            return acc;
        }, {});
    };

    const sortTickets = (tickets, sortBy) => {
        return [...tickets].sort((a, b) => {
            if (sortBy === 'priority') {
                return b.priority - a.priority; // Descending order
            } else if (sortBy === 'title') {
                return a.title.localeCompare(b.title); // Ascending order
            }
            return 0;
        });
    };

    const groupedTickets = groupTickets(tickets, groupBy);
    const sortedGroupedTickets = Object.entries(groupedTickets).map(([key, group]) => ({
        key,
        tickets: sortTickets(group, sortBy),
    }));

    return (
        <div className="kanban-board-container">
            <div className="kanban-header">
                <button className="display-button" onClick={() => setShowDropdowns(!showDropdowns)}>
                    Display
                </button>

                {showDropdowns && (
                    <div className="dropdown-container">
                        <div className="dropdown">
                            <label>Ordering</label>
                            <select onChange={e => setGroupBy(e.target.value)} value={groupBy}>
                                <option value="status">By Status</option>
                                <option value="userId">By User</option>
                                <option value="priority">By Priority</option>
                            </select>
                        </div>
                        <div className="dropdown">
                            <label>Sorting</label>
                            <select onChange={e => setSortBy(e.target.value)} value={sortBy}>
                                <option value="priority">By Priority</option>
                                <option value="title">By Title</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            <div className="kanban-board">
                {sortedGroupedTickets.map(group => (
                    <div key={group.key} className="kanban-column">
                        <h2>{group.key}</h2>
                        <div className="kanban-column-tickets">
                            {group.tickets.map(ticket => (
                                <div key={ticket.id} className={`kanban-ticket priority-${ticket.priority}`}>
                                    <h3>{ticket.title}</h3>
                                    <p><strong>Status:</strong> {ticket.status}</p>
                                    <p><strong>Priority:</strong> {ticket.priority}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;