import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [name, setName] = useState('');
    const [assignment, setAssignment] = useState('');
    const [originalUser, setOriginalUser] = useState('');
    const [taker, setTaker] = useState('');
    const [assignmentTakeover, setAssignmentTakeover] = useState('');
    const [viewUser, setViewUser] = useState('');
    const [deleteUser, setDeleteUser] = useState('');
    const [deleteAssignment, setDeleteAssignment] = useState('');
    const [status, setStatus] = useState('');
    const [commitments, setCommitments] = useState([]);

    const addCommitment = () => {
        axios.post('http://localhost:3002/add_commitment', { user: name, subject: assignment })
            .then(response => {
                setStatus(`${name} has added a grading commitment for ${assignment}.`);
                setName('');
                setAssignment('');
                refreshCommitments();
            })
            .catch(error => {
                setStatus(error.response.data.message);
            });
    };

    const takeOverCommitment = () => {
        axios.post('http://localhost:3002/take_over_commitment', { user: originalUser, taker: taker, subject: assignmentTakeover })
            .then(response => {
                setStatus(`${taker} has taken over ${originalUser}'s grading commitment for ${assignmentTakeover}.`);
                setOriginalUser('');
                setTaker('');
                setAssignmentTakeover('');
                refreshCommitments();
            })
            .catch(error => {
                setStatus(error.response.data.message);
            });
    };

    const viewCommitments = () => {
        axios.get(`http://localhost:3002/view_commitments?user=${viewUser}`)
            .then(response => {
                setCommitments(response.data);
            })
            .catch(error => {
                setStatus(error.response.data.message);
            });
    };

    const deleteCommitment = () => {
        axios.post('http://localhost:3002/delete_commitment', { user: deleteUser, subject: deleteAssignment })
            .then(response => {
                setStatus(`${deleteUser}'s grading commitment for ${deleteAssignment} has been deleted.`);
                refreshCommitments();
            })
            .catch(error => {
                setStatus(error.response.data.message);
            });
    };

    const refreshCommitments = () => {
        axios.get(`/view_commitments?user=${viewUser}`)
            .then(response => {
                setCommitments(response.data);
            })
            .catch(error => {
                setStatus(error.response.data.message);
            });
    };

    useEffect(() => {
        refreshCommitments();
    }, []); // Call refreshCommitments on component mount

    return (
        <div>
            <div>
                <h2>Add Grading Commitment</h2>
                <label>User:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Assignment:</label>
                <input type="text" value={assignment} onChange={(e) => setAssignment(e.target.value)} />
                <button onClick={addCommitment}>Add Commitment</button>
            </div>

            <div>
                <h2>Take Over Commitment</h2>
                <label>Original User:</label>
                <input type="text" value={originalUser} onChange={(e) => setOriginalUser(e.target.value)} />
                <label>Taker:</label>
                <input type="text" value={taker} onChange={(e) => setTaker(e.target.value)} />
                <label>Assignment:</label>
                <input type="text" value={assignmentTakeover} onChange={(e) => setAssignmentTakeover(e.target.value)} />
                <button onClick={takeOverCommitment}>Take Over Commitment</button>
            </div>

            <div>
                <h2>View Commitments</h2>
                <label>User:</label>
                <input type="text" value={viewUser} onChange={(e) => setViewUser(e.target.value)} />
                <button onClick={viewCommitments}>View Commitments</button>
                {commitments && commitments.map((commitment, index) => (
                    <div key={index}>{commitment}</div>
                ))}
            </div>

            <div>
                <h2>Delete Commitment</h2>
                <label>User:</label>
                <input type="text" value={deleteUser} onChange={(e) => setDeleteUser(e.target.value)} />
                <label>Assignment:</label>
                <input type="text" value={deleteAssignment} onChange={(e) => setDeleteAssignment(e.target.value)} />
                <button onClick={deleteCommitment}>Delete Commitment</button>
            </div>

            {status && <div>{status}</div>}
        </div>
    );
}

export default App;
