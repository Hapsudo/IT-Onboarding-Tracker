
let requests = [];

function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelector(`[data-section="${id}"]`).classList.add('active');
    renderTables();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('requestForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const data = new FormData(this);
        const employee = data.get('employee');
        const department = data.get('department');
        const joinDate = data.get('joinDate');
        const email = data.get('email');
        const items = data.getAll('items');
        const request = { id: Date.now(), employee, department, joinDate, email, items, status: 'Awaiting Approval' };
        requests.push(request);
        this.reset();
        renderTables();
    });

    renderTables();
});

function renderTables() {
    const approvalBody = document.getElementById('approvalTableBody');
    const historyBody = document.getElementById('historyTableBody');
    const approvalBadge = document.getElementById('approvalBadge');

    const approvalRequests = requests.filter(r => r.status === 'Awaiting Approval');
    approvalBody.innerHTML = approvalRequests.map(r => `
        <tr>
            <td>${r.employee}</td>
            <td>${r.department}</td>
            <td>${r.items.join(', ')}</td>
            <td>${r.email}</td>
            <td>
                <button onclick="approveRequest(${r.id})">Approve</button>
                <button onclick="rejectRequest(${r.id})">Reject</button>
            </td>
        </tr>
    `).join('');

    const historyRequests = requests.filter(r => r.status !== 'Awaiting Approval');
    historyBody.innerHTML = historyRequests.map(r => `
        <tr>
            <td>${r.employee}</td>
            <td>${r.items.join(', ')}</td>
            <td>${r.status}</td>
            <td>${r.joinDate}</td>
            <td>
                ${r.status === 'Pending' ? `<button onclick="updateStatus(${r.id}, 'In Progress')">Start</button>` : ''}
                ${r.status === 'In Progress' ? `<button onclick="updateStatus(${r.id}, 'Completed')">Finish</button>` : ''}
            </td>
        </tr>
    `).join('');

    approvalBadge.textContent = approvalRequests.length > 0 ? approvalRequests.length : '';
}

function approveRequest(id) {
    const req = requests.find(r => r.id === id);
    if (req) {
        req.status = 'Pending';
        renderTables();
    }
}

function rejectRequest(id) {
    const req = requests.find(r => r.id === id);
    if (req) {
        req.status = 'Rejected';
        renderTables();
    }
}

function updateStatus(id, status) {
    const req = requests.find(r => r.id === id);
    if (req) {
        req.status = status;
        renderTables();
    }
}
