/**
 * Smart Hostel - Student Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Guard
    // Check if user is logged in, otherwise kick them back to login page
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (!isLoggedIn || userRole !== 'student') {
        alert('Unauthorized access. Please login as a student.');
        window.location.href = '../index.html';
        return;
    }

    // 2. Load Mock Student Data
    // In a real app, you'd fetch this from an API using the user's ID
    const studentNameDisplay = document.getElementById('studentNameDisplay');
    const userAvatar = document.getElementById('userAvatar');
    
    // Check if we have a name in storage, otherwise default to "Resident"
    const storedName = localStorage.getItem('userName') || 'Resident';
    studentNameDisplay.innerText = storedName;

    // 3. Logout Functionality
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', () => {
        // Clear all session data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');

        // Optional: Clear everything if you don't need other settings
        // localStorage.clear();

        // Redirect to login page
        window.location.href = '../index.html';
    });

    // 4. (Optional) Active Link Highlighter
    // This helps the user know which page they are currently on
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href').includes(currentPath)) {
            link.classList.add('active');
        }
    });
});
/**
 * ADD THIS TO YOUR EXISTING student.js
 * Logic for Reporting Issues
 */

// We check if the form exists on the current page first
const issueForm = document.getElementById('issueForm');

if (issueForm) {
    // 1. Mock Data for Auto-fill
    // In a real project, these might come from your login session/API
    const mockHostelData = {
        name: "North Campus Residency",
        block: "B-Block",
        room: "402"
    };

    // Auto-fill the readonly fields
    document.getElementById('hostelName').value = mockHostelData.name;
    document.getElementById('roomInfo').value = `${mockHostelData.block} / ${mockHostelData.room}`;

    // 2. Handle Form Submission
    issueForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form data
        const newIssue = {
            id: 'ISS-' + Date.now(), // Unique ID based on timestamp
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            priority: document.getElementById('priority').value,
            description: document.getElementById('description').value,
            visibility: document.querySelector('input[name="visibility"]:checked').value,
            status: 'Pending',
            dateReported: new Date().toLocaleDateString(),
            hostel: mockHostelData.name,
            room: mockHostelData.room
        };

        // 3. Save to localStorage
        // Get existing issues or initialize empty array
        const existingIssues = JSON.parse(localStorage.getItem('hostelIssues')) || [];
        
        // Add new issue to the array
        existingIssues.push(newIssue);
        
        // Save back to localStorage
        localStorage.setItem('hostelIssues', JSON.stringify(existingIssues));

        // 4. Success Feedback & Redirect
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.innerText = "Submitting...";
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Issue reported successfully!');
            window.location.href = 'my-issues.html';
        }, 1000);
    });
}

/**
 * ADD THIS TO YOUR EXISTING student.js
 * Logic for Displaying Reported Issues
 */

const issuesListContainer = document.getElementById('issuesList');

if (issuesListContainer) {
    renderIssues();
}

function renderIssues() {
    // 1. Fetch issues from localStorage
    const savedIssues = JSON.parse(localStorage.getItem('hostelIssues')) || [];
    const issueCountBadge = document.getElementById('issueCount');
    
    issueCountBadge.innerText = `${savedIssues.length} Issues Total`;

    // 2. Check if there are no issues
    if (savedIssues.length === 0) {
        issuesListContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>No issues found</h3>
                <p>You haven't reported any problems yet. Use the "Report Issue" page to get started.</p>
                <br>
                <a href="report-issue.html" class="action-btn primary" style="text-decoration:none">Report New Issue</a>
            </div>
        `;
        return;
    }

    // 3. Create Table Structure
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Issue Detail</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Visibility</th>
                </tr>
            </thead>
            <tbody>
    `;

    // 4. Map through issues and create rows
    // We reverse the array to show the newest issues first
    savedIssues.reverse().forEach(issue => {
        // Clean up status for CSS class naming (remove spaces)
        const statusClass = issue.status.replace(/\s+/g, '').toLowerCase();
        
        tableHTML += `
            <tr>
                <td>
                    <div style="font-weight: 600;">${issue.title}</div>
                    <div style="font-size: 0.8rem; color: #64748b;">ID: ${issue.id}</div>
                </td>
                <td>${issue.category}</td>
                <td>
                    <span class="priority-dot prio-${issue.priority}"></span>
                    ${issue.priority}
                </td>
                <td>
                    <span class="badge status-${statusClass}">${issue.status}</span>
                </td>
                <td>${issue.dateReported}</td>
                <td>
                    <i class="fas ${issue.visibility === 'Public' ? 'fa-users' : 'fa-lock'}" 
                       style="margin-right: 5px; color: #94a3b8;"></i>
                    ${issue.visibility}
                </td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    
    // Inject the table into the container
    issuesListContainer.innerHTML = tableHTML;
}

/**
 * ADD THIS TO YOUR EXISTING student.js
 * Logic for Displaying Announcements
 */

const announceContainer = document.getElementById('announcementsContainer');

if (announceContainer) {
    initAnnouncements();
}

function initAnnouncements() {
    // 1. Mock Data for initial load (simulating admin posts)
    const defaultAnnouncements = [
        {
            id: 1,
            title: "Scheduled Maintenance: Water Supply",
            description: "Please note that the water supply will be suspended for Block B and C on Sunday between 10:00 AM and 02:00 PM due to tank cleaning.",
            category: "Water",
            target: "Blocks B & C",
            date: "Oct 24, 2023"
        },
        {
            id: 2,
            title: "New High-Speed Wi-Fi Routers Installed",
            description: "We have upgraded the routers in the common room. Please use the new credentials provided on the notice board to connect.",
            category: "General",
            target: "All Blocks",
            date: "Oct 22, 2023"
        },
        {
            id: 3,
            title: "Electricity Audit",
            description: "The maintenance team will be checking room wiring. Please ensure someone is available or leave your keys with the warden.",
            category: "Electricity",
            target: "Block A",
            date: "Oct 20, 2023"
        }
    ];

    // 2. Fetch from localStorage or use defaults
    let announcements = JSON.parse(localStorage.getItem('hostelAnnouncements'));
    
    if (!announcements) {
        localStorage.setItem('hostelAnnouncements', JSON.stringify(defaultAnnouncements));
        announcements = defaultAnnouncements;
    }

    // 3. Check for empty state
    if (announcements.length === 0) {
        announceContainer.innerHTML = `
            <div class="empty-announcements">
                <i class="fas fa-comment-slash fa-3x"></i>
                <p style="margin-top:15px">No announcements posted yet.</p>
            </div>`;
        return;
    }

    // 4. Render Cards
    announceContainer.innerHTML = announcements.map(item => `
        <div class="announcement-card border-${item.category}">
            <div class="announcement-header">
                <h3 class="announcement-title">${item.title}</h3>
                <span class="meta-item"><i class="far fa-calendar-alt"></i> ${item.date}</span>
            </div>
            <div class="announcement-meta">
                <span class="meta-item"><i class="fas fa-tag"></i> ${item.category}</span>
                <span class="meta-item"><i class="fas fa-map-marker-alt"></i> ${item.target}</span>
            </div>
            <div class="announcement-body">
                ${item.description}
            </div>
        </div>
    `).join('');
}

/**
 * ADD THIS TO YOUR EXISTING student.js
 * Logic for Lost & Found Section
 */

const lfForm = document.getElementById('lfForm');
const lfContainer = document.getElementById('lfItemsContainer');

if (lfForm && lfContainer) {
    renderLFItems();

    lfForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Collect Data
        const newItem = {
            id: 'LF-' + Date.now(),
            name: document.getElementById('itemName').value,
            type: document.querySelector('input[name="itemType"]:checked').value,
            location: document.getElementById('itemLoc').value,
            description: document.getElementById('itemDesc').value,
            date: document.getElementById('itemDate').value,
            status: 'Open',
            // Using a high-quality placeholder image for hackathon looks
            image: `https://picsum.photos/seed/${Math.random()}/400/300` 
        };

        // 2. Save to LocalStorage
        const existingItems = JSON.parse(localStorage.getItem('hostelLF')) || [];
        existingItems.unshift(newItem); // Add to beginning of array
        localStorage.setItem('hostelLF', JSON.stringify(existingItems));

        // 3. Reset and Refresh
        lfForm.reset();
        renderLFItems();
        alert('Item posted successfully!');
    });
}

function renderLFItems() {
    const items = JSON.parse(localStorage.getItem('hostelLF')) || [];

    if (items.length === 0) {
        lfContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-search fa-3x" style="color: #cbd5e1;"></i>
                <p style="margin-top: 15px; color: #64748b;">No records found. Be the first to post!</p>
            </div>`;
        return;
    }

    lfContainer.innerHTML = items.map(item => `
        <div class="item-card">
            <img src="${item.image}" class="item-img" alt="${item.name}">
            <div class="item-details">
                <span class="item-badge badge-${item.type.toLowerCase()}">${item.type}</span>
                <span class="item-name">${item.name}</span>
                <p class="item-loc"><i class="fas fa-map-marker-alt"></i> ${item.location}</p>
                <p style="font-size: 0.85rem; color: #475569; margin-bottom: 15px;">${item.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; pt: 10px; margin-top: 10px;">
                    <span style="font-size: 0.75rem; color: #94a3b8;">${item.date}</span>
                    <span style="font-size: 0.75rem; font-weight: 700; color: #1e293b;">${item.status}</span>
                </div>
            </div>
        </div>
    `).join('');
}