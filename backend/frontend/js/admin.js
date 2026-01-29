/**
 * Smart Hostel - Admin Dashboard Logic
 * Handles session security and dynamic stats calculation.
 */

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
  window.location.href = "../unauthorized.html";
}

<script src="../js/admin.js"></script>


document.addEventListener('DOMContentLoaded', () => {
    // 1. Admin Authentication Guard
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    // If not logged in or role is not admin, redirect back to login
    if (!isLoggedIn || userRole !== 'admin') {
        alert('Access Denied. Admin privileges required.');
        window.location.href = '../index.html';
        return;
    }

    // 2. Fetch and Calculate Statistics
    updateAdminStats();

    // 3. Logout Functionality
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear only the auth-related items or use clear() for fresh start
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            
            // Redirect to login page
            window.location.href = '../index.html';
        });
    }
});

/**
 * Function to read data from localStorage and update the UI counters
 */
function updateAdminStats() {
    // Get Issues (Student-generated data)
    const issues = JSON.parse(localStorage.getItem('hostelIssues')) || [];
    
    // Get Announcements (Admin-generated data)
    const announcements = JSON.parse(localStorage.getItem('hostelAnnouncements')) || [];

    // Filter issues based on their status
    const pendingCount = issues.filter(issue => 
        issue.status === 'Pending' || issue.status === 'In Progress'
    ).length;

    const resolvedCount = issues.filter(issue => 
        issue.status === 'Resolved' || issue.status === 'Closed'
    ).length;

    // Update the DOM elements
    document.getElementById('countTotal').innerText = issues.length;
    document.getElementById('countPending').innerText = pendingCount;
    document.getElementById('countResolved').innerText = resolvedCount;
    document.getElementById('countAnnounce').innerText = announcements.length;
}

/**
 * ADD TO js/admin.js
 * Logic for Managing Issues as Admin
 */

const adminTableBody = document.getElementById('adminIssuesTableBody');

if (adminTableBody) {
    loadAllIssues();
}

function loadAllIssues() {
    // 1. Fetch from localStorage
    const issues = JSON.parse(localStorage.getItem('hostelIssues')) || [];

    if (issues.length === 0) {
        adminTableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:40px;">No issues reported yet.</td></tr>';
        return;
    }

    // 2. Render rows (Newest first)
    adminTableBody.innerHTML = issues.map((issue, index) => {
        // Prepare dynamic status classes
        const statusClass = issue.status.replace(/\s+/g, '').toLowerCase();
        
        return `
            <tr>
                <td style="font-family: monospace; font-weight: 600;">${issue.id}</td>
                <td>
                    <div style="font-weight:600;">${issue.title}</div>
                    <div style="font-size:0.75rem; color:#64748b;">By: Student User</div>
                </td>
                <td>${issue.category}</td>
                <td><span class="priority-badge prio-${issue.priority}">${issue.priority}</span></td>
                <td>${issue.hostel} / ${issue.room}</td>
                <td>
                    <select class="status-select status-${statusClass}" 
                            onchange="updateIssueStatus('${issue.id}', this.value)">
                        <option value="Reported" ${issue.status === 'Reported' ? 'selected' : ''}>Reported</option>
                        <option value="Assigned" ${issue.status === 'Assigned' ? 'selected' : ''}>Assigned</option>
                        <option value="In Progress" ${issue.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Resolved" ${issue.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="Closed" ${issue.status === 'Closed' ? 'selected' : ''}>Closed</option>
                    </select>
                </td>
                <td>
                    <input type="text" class="assign-input" placeholder="Staff Name..." 
                           onchange="updateAssignment('${issue.id}', this.value)" 
                           value="${issue.assignedTo || ''}">
                </td>
                <td style="font-size: 0.8rem; color: #94a3b8;">${issue.lastUpdated || issue.dateReported}</td>
            </tr>
        `;
    }).reverse().join('');
}

// Global function to handle status change
window.updateIssueStatus = (issueId, newStatus) => {
    let issues = JSON.parse(localStorage.getItem('hostelIssues'));
    
    // Find issue and update
    const issueIndex = issues.findIndex(i => i.id === issueId);
    if (issueIndex !== -1) {
        issues[issueIndex].status = newStatus;
        issues[issueIndex].lastUpdated = new Date().toLocaleString(); // Add timestamp
        
        // Save back to storage
        localStorage.setItem('hostelIssues', JSON.stringify(issues));
        
        // Refresh UI to update colors/timestamps
        loadAllIssues();
    }
};

// Global function to handle staff assignment
window.updateAssignment = (issueId, staffName) => {
    let issues = JSON.parse(localStorage.getItem('hostelIssues'));
    const issueIndex = issues.findIndex(i => i.id === issueId);
    
    if (issueIndex !== -1) {
        issues[issueIndex].assignedTo = staffName;
        issues[issueIndex].lastUpdated = new Date().toLocaleString();
        localStorage.setItem('hostelIssues', JSON.stringify(issues));
    }
};

/**
 * ADD TO js/admin.js
 * Logic for Admin Announcements Management
 */

const announceForm = document.getElementById('announceForm');
const adminAnnounceList = document.getElementById('adminAnnounceList');

if (announceForm && adminAnnounceList) {
    renderAdminAnnouncements();

    announceForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Create Data Object
        const newAnnouncement = {
            id: 'ANN-' + Date.now(),
            title: document.getElementById('annTitle').value,
            category: document.getElementById('annCat').value,
            target: document.getElementById('annTarget').value,
            description: document.getElementById('annDesc').value,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        // 2. Save to LocalStorage
        const existingAnn = JSON.parse(localStorage.getItem('hostelAnnouncements')) || [];
        existingAnn.unshift(newAnnouncement); // Add new to top
        localStorage.setItem('hostelAnnouncements', JSON.stringify(existingAnn));

        // 3. UI Update
        announceForm.reset();
        renderAdminAnnouncements();
        alert('Announcement published successfully!');
    });
}

function renderAdminAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('hostelAnnouncements')) || [];

    if (announcements.length === 0) {
        adminAnnounceList.innerHTML = `
            <div style="text-align:center; padding:50px; background:white; border-radius:20px;">
                <p style="color:#64748b;">No announcements published yet.</p>
            </div>`;
        return;
    }

    adminAnnounceList.innerHTML = announcements.map(item => `
        <div class="announcement-item" style="border-left-color: ${getCategoryColor(item.category)}">
            <div class="item-info">
                <span class="cat-badge cat-${item.category}">${item.category}</span>
                <h3 style="margin-top:8px;">${item.title}</h3>
                <p>${item.description}</p>
                <div class="item-footer">
                    <span><i class="fas fa-map-marker-alt"></i> ${item.target}</span>
                    <span><i class="far fa-calendar-alt"></i> ${item.date}</span>
                </div>
            </div>
            <button class="delete-btn" onclick="deleteAnnouncement('${item.id}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `).join('');
}

// Helper to get hex colors for dynamic border-left
function getCategoryColor(cat) {
    const colors = {
        'Water': '#3b82f6',
        'Electricity': '#ef4444',
        'Cleaning': '#10b981',
        'Maintenance': '#f59e0b',
        'General': '#8b5cf6'
    };
    return colors[cat] || '#e2e8f0';
}

// Global function to delete announcements
window.deleteAnnouncement = (id) => {
    if (confirm('Are you sure you want to remove this announcement?')) {
        let announcements = JSON.parse(localStorage.getItem('hostelAnnouncements')) || [];
        announcements = announcements.filter(a => a.id !== id);
        localStorage.setItem('hostelAnnouncements', JSON.stringify(announcements));
        renderAdminAnnouncements();
    }
};

/**
 * ADD TO js/admin.js
 * Logic for Analytics and Data Visualization
 */

if (document.getElementById('categoryChart')) {
    renderAnalytics();
}

function renderAnalytics() {
    const issues = JSON.parse(localStorage.getItem('hostelIssues')) || [];
    const total = issues.length;

    // 1. Basic Stats
    const resolved = issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    document.getElementById('anaTotal').innerText = total;
    document.getElementById('anaRate').innerText = rate + '%';

    // 2. Process Categories
    const categories = ['Plumbing', 'Electrical', 'Cleanliness', 'Internet', 'Furniture', 'Other'];
    const catData = {};
    categories.forEach(cat => {
        catData[cat] = issues.filter(i => i.category === cat).length;
    });

    const categoryChart = document.getElementById('categoryChart');
    categoryChart.innerHTML = categories.map(cat => {
        const count = catData[cat];
        const percent = total > 0 ? (count / total) * 100 : 0;
        return `
            <div class="bar-row">
                <div class="bar-label-group">
                    <span>${cat}</span>
                    <span>${count}</span>
                </div>
                <div class="bar-bg">
                    <div class="bar-fill" style="width: ${percent}%"></div>
                </div>
            </div>
        `;
    }).join('');

    // 3. Process Status Distribution
    const statusTypes = [
        { label: 'Reported', color: '#64748b' },
        { label: 'In Progress', color: '#f59e0b' },
        { label: 'Resolved', color: '#10b981' }
    ];

    const statusContainer = document.getElementById('statusContainer');
    statusContainer.innerHTML = statusTypes.map(s => {
        const count = issues.filter(i => i.status === s.label).length;
        return `
            <div class="circle-stat">
                <span class="value" style="color: ${s.color}">${count}</span>
                <span class="label">${s.label}</span>
            </div>
        `;
    }).join('');
}