
/* ==========================================================
   SAARTHI PLAY PUBLIC SCHOOL
   Main JavaScript
   Version: 1.0
   School: Play to Class 5 | English Medium | CBSE
   ========================================================== */

"use strict";

/* ==========================================================
   1. SCHOOL CONFIGURATION
   ========================================================== */

const SCHOOL = {
    name: "Saarthi Play Public School",
    shortName: "Saarthi Play",
    address: "Kh.No-1893, Alipur Village, Delhi, 110036",
    phone: "9818408808",
    alternatePhone: "9205451438",
    email: "sumitbhardwaj755@gmail.com",
    instagram: "https://instagram.com/saarthiplaypublicschool25",
    classes: [
        "Playgroup",
        "Nursery",
        "LKG",
        "UKG",
        "Class 1",
        "Class 2",
        "Class 3",
        "Class 4",
        "Class 5"
    ],
    timings: "Monday–Saturday, 8:00 AM–1:00 PM"
};

const STORAGE_KEYS = {
    notices: "saarthi_notices_v1",
    homework: "saarthi_homework_v1",
    events: "saarthi_events_v1",
    students: "saarthi_students_v1",
    gallery: "saarthi_gallery_v1",
    preferences: "saarthi_preferences_v1",
    profile: "saarthi_profile_v1"
};


/* ==========================================================
   2. SAMPLE DATA
   Replace these examples with real school information.
   ========================================================== */

const DEFAULT_NOTICES = [
    {
        id: "notice-1",
        title: "Welcome to Saarthi Play Public School",
        message:
            "Welcome to our school community. Please check this app regularly for homework, notices, events and important updates.",
        date: "2026-10-20",
        category: "General",
        pinned: true
    },
    {
        id: "notice-2",
        title: "Check homework regularly",
        message:
            "Parents are requested to check the homework section regularly and help students complete their assigned work on time.",
        date: "2026-10-21",
        category: "Academic",
        pinned: true
    },
    {
        id: "notice-3",
        title: "School timings",
        message:
            "Regular school timings are 8:00 AM to 1:00 PM, Monday through Saturday. Please contact the school to confirm holiday changes.",
        date: "2026-10-22",
        category: "Important",
        pinned: false
    }
];

const DEFAULT_HOMEWORK = [
    {
        id: "homework-1",
        subject: "English",
        className: "Class 1",
        title: "Writing practice",
        description:
            "Practise writing the alphabet neatly in your English notebook.",
        dueDate: "2026-10-28",
        assignedDate: "2026-10-25",
        completed: false
    },
    {
        id: "homework-2",
        subject: "Mathematics",
        className: "Class 2",
        title: "Number practice",
        description:
            "Practise addition questions from your classwork notebook.",
        dueDate: "2026-10-28",
        assignedDate: "2026-10-25",
        completed: false
    },
    {
        id: "homework-3",
        subject: "EVS",
        className: "Class 3",
        title: "My surroundings",
        description:
            "Write five sentences about your surroundings in your notebook.",
        dueDate: "2026-10-29",
        assignedDate: "2026-10-25",
        completed: false
    }
];

const DEFAULT_EVENTS = [
    {
        id: "event-1",
        title: "School Activity Day",
        description:
            "A sample event entry. Confirm the actual date and details with the school before publishing.",
        date: "2026-11-05",
        type: "Event"
    },
    {
        id: "holiday-1",
        title: "Sample Holiday Entry",
        description:
            "This is sample content. Replace it with the official school holiday calendar.",
        date: "2026-11-14",
        type: "Holiday"
    }
];

const DEFAULT_GALLERY = [
    {
        id: "gallery-1",
        title: "School Activities",
        description: "School activity photographs will appear here.",
        image: "",
        category: "Activities"
    },
    {
        id: "gallery-2",
        title: "Classroom Moments",
        description: "Classroom photographs will appear here.",
        image: "",
        category: "Classroom"
    },
    {
        id: "gallery-3",
        title: "School Events",
        description: "Event photographs will appear here.",
        image: "",
        category: "Events"
    }
];


/* ==========================================================
   3. GENERAL HELPERS
   ========================================================== */

const $ = (selector, root = document) =>
    root.querySelector(selector);

const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

function createId(prefix = "item") {
    const randomPart =
        typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return `${prefix}-${randomPart}`;
}

function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function safeDate(dateString) {
    if (!dateString) return null;

    const date = new Date(`${dateString}T12:00:00`);

    return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(dateString, options = {}) {
    const date = safeDate(dateString);

    if (!date) return "Date not set";

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...options
    }).format(date);
}

function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);

        if (value === null) {
            return structuredCloneSafe(fallback);
        }

        return JSON.parse(value);
    } catch (error) {
        console.warn(`Could not read storage key "${key}".`, error);
        return structuredCloneSafe(fallback);
    }
}

function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value));
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Could not save "${key}".`, error);

        showToast(
            "Unable to save data. Check browser storage space.",
            "error"
        );

        return false;
    }
}

function isValidHttpUrl(value) {
    try {
        const url = new URL(value);

        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function icon(name, className = "") {
    return `
        <i
            data-lucide="${escapeHTML(name)}"
            class="${escapeHTML(className)}"
            aria-hidden="true"
        ></i>
    `;
}

function refreshIcons(root = document) {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons({
            root,
            attrs: {
                "stroke-width": 1.8
            }
        });
    }
}


/* ==========================================================
   4. APP STATE
   ========================================================== */

const state = {
    currentPage: "home",
    searchQuery: "",
    homeworkFilter: "all",
    noticeFilter: "all",
    galleryFilter: "All",
    isAdminMode: false,

    notices: readStorage(
        STORAGE_KEYS.notices,
        DEFAULT_NOTICES
    ),

    homework: readStorage(
        STORAGE_KEYS.homework,
        DEFAULT_HOMEWORK
    ),

    events: readStorage(
        STORAGE_KEYS.events,
        DEFAULT_EVENTS
    ),

    students: readStorage(
        STORAGE_KEYS.students,
        []
    ),

    gallery: readStorage(
        STORAGE_KEYS.gallery,
        DEFAULT_GALLERY
    ),

    preferences: readStorage(
        STORAGE_KEYS.preferences,
        {
            announcements: true,
            homework: true,
            events: true
        }
    ),

    profile: readStorage(
        STORAGE_KEYS.profile,
        {
            studentName: "",
            admissionNumber: "",
            className: "",
            section: "",
            parentName: "",
            parentPhone: ""
        }
    )
};


/* ==========================================================
   5. TOAST MESSAGES
   ========================================================== */

function showToast(message, type = "success") {
    let container = $("#toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";
        container.setAttribute("aria-live", "polite");

        document.body.appendChild(container);
    }

    const toast = document.createElement("div");

    toast.className = `toast toast-${type}`;

    const iconName =
        type === "error"
            ? "circle-alert"
            : type === "info"
                ? "info"
                : "circle-check";

    toast.innerHTML = `
        ${icon(iconName)}
        <span>${escapeHTML(message)}</span>
        <button
            type="button"
            class="toast-close"
            aria-label="Dismiss notification"
        >
            ${icon("x")}
        </button>
    `;

    container.appendChild(toast);
    refreshIcons(toast);

    $(".toast-close", toast)?.addEventListener("click", () => {
        toast.remove();
    });

    window.setTimeout(() => {
        toast.remove();
    }, 4000);
}


/* ==========================================================
   6. PAGE NAVIGATION
   Supports links with data-page="home", "homework", etc.
   ========================================================== */

const PAGE_TITLES = {
    home: "Home",
    notices: "Notice Board",
    homework: "Homework",
    events: "Events & Holidays",
    profile: "Student Profile",
    gallery: "Photo Gallery",
    notifications: "Notifications",
    contact: "Contact School",
    admin: "Admin Dashboard"
};

function navigateTo(pageName) {
    const page = document.getElementById(`page-${pageName}`);

    if (!page) {
        showToast(`The "${pageName}" page is not present in the HTML.`, "error");
        return;
    }

    state.currentPage = pageName;

    $$(".app-page, [data-app-page]").forEach(section => {
        section.hidden = true;
        section.classList.remove("active");
    });

    page.hidden = false;
    page.classList.add("active");

    $$("[data-page]").forEach(link => {
        const isActive = link.dataset.page === pageName;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    const pageTitle = $("#page-title");

    if (pageTitle) {
        pageTitle.textContent = PAGE_TITLES[pageName] || "Saarthi Play";
    }

    closeMobileMenu();

    if (pageName === "home") renderHome();
    if (pageName === "notices") renderNotices();
    if (pageName === "homework") renderHomework();
    if (pageName === "events") renderEvents();
    if (pageName === "profile") renderProfile();
    if (pageName === "gallery") renderGallery();
    if (pageName === "notifications") renderPreferences();
    if (pageName === "admin") renderAdmin();

    refreshIcons(page);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function setupNavigation() {
    document.addEventListener("click", event => {
        const link = event.target.closest("[data-page]");

        if (!link) return;

        event.preventDefault();

        navigateTo(link.dataset.page);
    });

    $$("[data-go-page]").forEach(button => {
        button.addEventListener("click", () => {
            navigateTo(button.dataset.goPage);
        });
    });
}


/* ==========================================================
   7. MOBILE MENU
   ========================================================== */

function setupMobileMenu() {
    const menuButton = $(
        "#menu-toggle, [data-menu-toggle], .menu-toggle"
    );

    const sidebar = $(
        "#sidebar, .sidebar, [data-sidebar]"
    );

    const overlay = $(
        "#sidebar-overlay, .sidebar-overlay, [data-sidebar-overlay]"
    );

    if (!menuButton || !sidebar) return;

    menuButton.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", String(isOpen));

        if (overlay) {
            overlay.hidden = !isOpen;
            overlay.classList.toggle("visible", isOpen);
        }
    });

    overlay?.addEventListener("click", closeMobileMenu);
}

function closeMobileMenu() {
    const sidebar = $(
        "#sidebar, .sidebar, [data-sidebar]"
    );

    const menuButton = $(
        "#menu-toggle, [data-menu-toggle], .menu-toggle"
    );

    const overlay = $(
        "#sidebar-overlay, .sidebar-overlay, [data-sidebar-overlay]"
    );

    sidebar?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");

    if (overlay) {
        overlay.hidden = true;
        overlay.classList.remove("visible");
    }
}


/* ==========================================================
   8. HOME DASHBOARD
   ========================================================== */

function renderHome() {
    const noticesContainer = $(
        "#home-notices, #recent-notices, [data-home-notices]"
    );

    const homeworkContainer = $(
        "#home-homework, #upcoming-homework, [data-home-homework]"
    );

    const eventsContainer = $(
        "#home-events, #upcoming-events, [data-home-events]"
    );

    const pendingHomework = state.homework.filter(item => !item.completed);

    const upcomingEvents = state.events
        .filter(event => event.date >= getTodayString())
        .sort((a, b) => a.date.localeCompare(b.date));

    const pinnedNotices = [...state.notices]
        .sort((a, b) => Number(b.pinned) - Number(a.pinned))
        .slice(0, 3);

    if (noticesContainer) {
        noticesContainer.innerHTML = pinnedNotices.length
            ? pinnedNotices.map(notice => `
                <article class="notice-card">
                    <div class="notice-card-icon">
                        ${icon("megaphone")}
                    </div>

                    <div class="notice-card-content">
                        <div class="notice-card-meta">
                            <span>${escapeHTML(notice.category || "General")}</span>
                            ${notice.pinned ? `<span class="status-pill">Pinned</span>` : ""}
                        </div>

                        <h3>${escapeHTML(notice.title)}</h3>

                        <p>${escapeHTML(notice.message)}</p>

                        <small>${formatDate(notice.date)}</small>
                    </div>
                </article>
            `).join("")
            : emptyState("bell", "No notices yet", "New school notices will appear here.");
    }

    if (homeworkContainer) {
        homeworkContainer.innerHTML = pendingHomework.length
            ? pendingHomework.slice(0, 3).map(item => `
                <article class="homework-card">
                    <div class="homework-card-icon">
                        ${icon("book-open")}
                    </div>

                    <div class="homework-card-content">
                        <span class="muted-text">
                            ${escapeHTML(item.subject)} · ${escapeHTML(item.className)}
                        </span>

                        <h3>${escapeHTML(item.title)}</h3>

                        <p>${escapeHTML(item.description)}</p>

                        <small>
                            Due: ${formatDate(item.dueDate)}
                        </small>
                    </div>
                </article>
            `).join("")
            : emptyState("check-circle", "All caught up", "There is no pending sample homework.");
    }

    if (eventsContainer) {
        eventsContainer.innerHTML = upcomingEvents.length
            ? upcomingEvents.slice(0, 3).map(event => `
                <article class="event-card">
                    <div class="event-date">
                        <strong>${escapeHTML(
                            safeDate(event.date)?.getDate() ?? "--"
                        )}</strong>

                        <span>${escapeHTML(
                            safeDate(event.date)?.toLocaleDateString("en-IN", {
                                month: "short"
                            }) ?? ""
                        )}</span>
                    </div>

                    <div>
                        <span class="muted-text">${escapeHTML(event.type)}</span>
                        <h3>${escapeHTML(event.title)}</h3>
                        <p>${escapeHTML(event.description)}</p>
                    </div>
                </article>
            `).join("")
            : emptyState("calendar-days", "No upcoming events", "Check back for school updates.");
    }

    setText("#stat-notices, [data-stat-notices]", state.notices.length);
    setText("#stat-homework, [data-stat-homework]", pendingHomework.length);
    setText("#stat-events, [data-stat-events]", upcomingEvents.length);

    setText(
        "#welcome-student, [data-welcome-student]",
        state.profile.studentName
            ? `Welcome, ${state.profile.studentName}`
            : "Welcome to Saarthi Play"
    );

    setText(
        "#today-date, [data-today-date]",
        new Intl.DateTimeFormat("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date())
    );

    refreshIcons();
}

function setText(selector, value) {
    const element = $(selector);

    if (element) element.textContent = String(value);
}

function emptyState(iconName, title, message) {
    return `
        <div class="empty-state">
            <div class="empty-state-icon">${icon(iconName)}</div>
            <h3>${escapeHTML(title)}</h3>
            <p>${escapeHTML(message)}</p>
        </div>
    `;
}


/* ==========================================================
   9. NOTICE BOARD
   ========================================================== */

function renderNotices() {
    const container = $(
        "#notices-list, #notice-list, [data-notices-list]"
    );

    if (!container) return;

    const query = state.searchQuery.trim().toLowerCase();

    const filtered = [...state.notices]
        .filter(notice => {
            const matchesQuery = [
                notice.title,
                notice.message,
                notice.category
            ].join(" ").toLowerCase().includes(query);

            const matchesFilter =
                state.noticeFilter === "all" ||
                notice.category === state.noticeFilter;

            return matchesQuery && matchesFilter;
        })
        .sort((a, b) => {
            if (Boolean(a.pinned) !== Boolean(b.pinned)) {
                return Number(b.pinned) - Number(a.pinned);
            }

            return b.date.localeCompare(a.date);
        });

    container.innerHTML = filtered.length
        ? filtered.map(notice => `
            <article class="notice-card" data-notice-id="${escapeHTML(notice.id)}">
                <div class="notice-card-icon">
                    ${icon("megaphone")}
                </div>

                <div class="notice-card-content">
                    <div class="notice-card-meta">
                        <span>${escapeHTML(notice.category || "General")}</span>

                        ${notice.pinned
                            ? `<span class="status-pill">Pinned notice</span>`
                            : ""}
                    </div>

                    <h3>${escapeHTML(notice.title)}</h3>

                    <p>${escapeHTML(notice.message)}</p>

                    <div class="notice-footer">
                        <small>${formatDate(notice.date)}</small>

                        ${state.isAdminMode
                            ? `
                                <button
                                    type="button"
                                    class="icon-button"
                                    data-delete-notice="${escapeHTML(notice.id)}"
                                    aria-label="Delete notice"
                                >
                                    ${icon("trash-2")}
                                </button>
                            `
                            : ""}
                    </div>
                </div>
            </article>
        `).join("")
        : emptyState("search", "No notices found", "Try another search or category.");

    refreshIcons(container);
}

function addNotice({ title, message, category, date, pinned }) {
    if (!title.trim() || !message.trim()) {
        showToast("Enter both a notice title and message.", "error");
        return false;
    }

    state.notices.unshift({
        id: createId("notice"),
        title: title.trim(),
        message: message.trim(),
        category: category || "General",
        date: date || getTodayString(),
        pinned: Boolean(pinned)
    });

    if (!writeStorage(STORAGE_KEYS.notices, state.notices)) return false;

    renderNotices();
    renderHome();

    showToast("Notice added to this browser.");
    return true;
}

function deleteNotice(id) {
    if (!confirm("Delete this notice from this browser?")) return;

    state.notices = state.notices.filter(notice => notice.id !== id);

    writeStorage(STORAGE_KEYS.notices, state.notices);

    renderNotices();
    renderHome();

    showToast("Notice deleted.");
}


/* ==========================================================
   10. HOMEWORK
   ========================================================== */

function renderHomework() {
    const container = $(
        "#homework-list, #homework-container, [data-homework-list]"
    );

    if (!container) return;

    const query = state.searchQuery.trim().toLowerCase();

    const filtered = [...state.homework]
        .filter(item => {
            const matchesQuery = [
                item.title,
                item.subject,
                item.className,
                item.description
            ].join(" ").toLowerCase().includes(query);

            const matchesFilter =
                state.homeworkFilter === "all" ||
                (state.homeworkFilter === "pending" && !item.completed) ||
                (state.homeworkFilter === "completed" && item.completed);

            const selectedClass = $("#homework-class-filter")?.value || "all";

            const matchesClass =
                selectedClass === "all" || item.className === selectedClass;

            return matchesQuery && matchesFilter && matchesClass;
        })
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    container.innerHTML = filtered.length
        ? filtered.map(item => `
            <article
                class="homework-card ${item.completed ? "is-completed" : ""}"
                data-homework-id="${escapeHTML(item.id)}"
            >
                <div class="homework-card-icon">
                    ${icon(item.completed ? "check-circle" : "book-open")}
                </div>

                <div class="homework-card-content">
                    <div class="homework-card-meta">
                        <span>${escapeHTML(item.subject)}</span>
                        <span>${escapeHTML(item.className)}</span>
                    </div>

                    <h3>${escapeHTML(item.title)}</h3>

                    <p>${escapeHTML(item.description)}</p>

                    <div class="homework-footer">
                        <small>
                            Due: ${formatDate(item.dueDate)}
                        </small>

                        <button
                            type="button"
                            class="secondary-button"
                            data-toggle-homework="${escapeHTML(item.id)}"
                        >
                            ${item.completed ? "Mark pending" : "Mark completed"}
                        </button>
                    </div>
                </div>
            </article>
        `).join("")
        : emptyState("book-open", "No homework found", "Try changing your filters.");

    refreshIcons(container);
}

function toggleHomework(id) {
    const item = state.homework.find(homework => homework.id === id);

    if (!item) return;

    item.completed = !item.completed;

    writeStorage(STORAGE_KEYS.homework, state.homework);

    renderHomework();
    renderHome();

    showToast(
        item.completed
            ? "Homework marked as completed."
            : "Homework marked as pending."
    );
}

function addHomework({
    subject,
    className,
    title,
    description,
    dueDate
}) {
    if (!subject || !className || !title.trim() || !dueDate) {
        showToast("Please fill in all required homework fields.", "error");
        return false;
    }

    state.homework.unshift({
        id: createId("homework"),
        subject,
        className,
        title: title.trim(),
        description: description.trim(),
        dueDate,
        assignedDate: getTodayString(),
        completed: false
    });

    if (!writeStorage(STORAGE_KEYS.homework, state.homework)) return false;

    renderHomework();
    renderHome();

    showToast("Homework added to this browser.");
    return true;
}


/* ==========================================================
   11. EVENTS AND HOLIDAYS
   ========================================================== */

function renderEvents() {
    const container = $(
        "#events-list, #events-container, [data-events-list]"
    );

    if (!container) return;

    const sortedEvents = [...state.events]
        .sort((a, b) => a.date.localeCompare(b.date));

    container.innerHTML = sortedEvents.length
        ? sortedEvents.map(event => {
            const date = safeDate(event.date);
            const isPast = event.date < getTodayString();

            return `
                <article class="event-card ${isPast ? "event-past" : ""}">
                    <div class="event-date">
                        <strong>${date ? date.getDate() : "--"}</strong>
                        <span>${date
                            ? escapeHTML(date.toLocaleDateString("en-IN", {
                                month: "short"
                            }))
                            : ""}</span>
                    </div>

                    <div class="event-content">
                        <span class="event-type">
                            ${icon(event.type === "Holiday" ? "calendar-check" : "calendar-days")}
                            ${escapeHTML(event.type)}
                        </span>

                        <h3>${escapeHTML(event.title)}</h3>

                        <p>${escapeHTML(event.description)}</p>

                        <small>${formatDate(event.date, {
                            weekday: "long"
                        })}</small>

                        ${state.isAdminMode
                            ? `
                                <button
                                    type="button"
                                    class="secondary-button"
                                    data-delete-event="${escapeHTML(event.id)}"
                                >
                                    Delete entry
                                </button>
                            `
                            : ""}
                    </div>
                </article>
            `;
        }).join("")
        : emptyState("calendar-days", "No events available", "School events will appear here.");

    refreshIcons(container);
}

function addEvent({ title, description, date, type }) {
    if (!title.trim() || !date) {
        showToast("Enter an event title and date.", "error");
        return false;
    }

    state.events.push({
        id: createId("event"),
        title: title.trim(),
        description: description.trim(),
        date,
        type: type || "Event"
    });

    if (!writeStorage(STORAGE_KEYS.events, state.events)) return false;

    renderEvents();
    renderHome();

    showToast("Event added to this browser.");
    return true;
}

function deleteEvent(id) {
    if (!confirm("Delete this event from this browser?")) return;

    state.events = state.events.filter(event => event.id !== id);

    writeStorage(STORAGE_KEYS.events, state.events);

    renderEvents();
    renderHome();

    showToast("Event deleted.");
}


/* ==========================================================
   12. STUDENT PROFILE
   ========================================================== */

function renderProfile() {
    const form = $(
        "#profile-form, [data-profile-form]"
    );

    if (!form) return;

    const fields = {
        studentName: ["student-name", "studentName"],
        admissionNumber: ["admission-number", "admissionNumber"],
        className: ["student-class", "className"],
        section: ["student-section", "section"],
        parentName: ["parent-name", "parentName"],
        parentPhone: ["parent-phone", "parentPhone"]
    };

    Object.entries(fields).forEach(([key, ids]) => {
        const field = ids
            .map(id => $(`#${id}`, form))
            .find(Boolean);

        if (field && document.activeElement !== field) {
            field.value = state.profile[key] || "";
        }
    });

    const nameDisplay = $(
        "#profile-display-name, [data-profile-name]"
    );

    if (nameDisplay) {
        nameDisplay.textContent =
            state.profile.studentName || "Student Name";
    }

    const classDisplay = $(
        "#profile-display-class, [data-profile-class]"
    );

    if (classDisplay) {
        classDisplay.textContent =
            state.profile.className || "Class not selected";
    }

    const admissionDisplay = $(
        "#profile-display-admission, [data-profile-admission]"
    );

    if (admissionDisplay) {
        admissionDisplay.textContent =
            state.profile.admissionNumber || "Not added";
    }
}

function saveProfile() {
    const getValue = (...selectors) => {
        for (const selector of selectors) {
            const element = $(selector);

            if (element) return element.value.trim();
        }

        return "";
    };

    const phone = getValue("#parent-phone", '[name="parentPhone"]');

    if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
        showToast("Please enter a valid parent phone number.", "error");
        return false;
    }

    state.profile = {
        studentName: getValue("#student-name", '[name="studentName"]'),
        admissionNumber: getValue(
            "#admission-number",
            '[name="admissionNumber"]'
        ),
        className: getValue("#student-class", '[name="className"]'),
        section: getValue("#student-section", '[name="section"]'),
        parentName: getValue("#parent-name", '[name="parentName"]'),
        parentPhone: phone
    };

    if (!writeStorage(STORAGE_KEYS.profile, state.profile)) return false;

    renderProfile();
    renderHome();

    showToast("Profile saved on this device.");
    return true;
}


/* ==========================================================
   13. PHOTO GALLERY
   ========================================================== */

function renderGallery() {
    const container = $(
        "#gallery-grid, #gallery-container, [data-gallery-grid]"
    );

    if (!container) return;

    const filtered = state.gallery.filter(item => {
        return (
            state.galleryFilter === "All" ||
            item.category === state.galleryFilter
        );
    });

    container.innerHTML = filtered.length
        ? filtered.map(item => {
            const validImage = item.image && isValidHttpUrl(item.image);

            return `
                <article class="gallery-card">
                    <div class="gallery-image">
                        ${validImage
                            ? `
                                <img
                                    src="${escapeHTML(item.image)}"
                                    alt="${escapeHTML(item.title)}"
                                    loading="lazy"
                                    referrerpolicy="no-referrer"
                                >
                            `
                            : `
                                <div class="gallery-placeholder">
                                    ${icon("image")}
                                    <span>Photo coming soon</span>
                                </div>
                            `}
                    </div>

                    <div class="gallery-card-content">
                        <span class="gallery-category">
                            ${escapeHTML(item.category || "School")}
                        </span>

                        <h3>${escapeHTML(item.title)}</h3>

                        <p>${escapeHTML(item.description || "")}</p>
                    </div>
                </article>
            `;
        }).join("")
        : emptyState("images", "No photos found", "Try another gallery category.");

    refreshIcons(container);
}

function addGalleryItem({ title, description, image, category }) {
    if (!title.trim()) {
        showToast("Please enter a photo title.", "error");
        return false;
    }

    if (image && !isValidHttpUrl(image)) {
        showToast("Please provide a valid HTTP or HTTPS image URL.", "error");
        return false;
    }

    state.gallery.unshift({
        id: createId("gallery"),
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        category: category || "Activities"
    });

    if (!writeStorage(STORAGE_KEYS.gallery, state.gallery)) return false;

    renderGallery();

    showToast("Gallery entry added.");
    return true;
}


/* ==========================================================
   14. NOTIFICATION PREFERENCES
   These settings control preferences only. Actual push
   notifications require a backend and push service.
   ========================================================== */

function renderPreferences() {
    const preferences = state.preferences;

    const mappings = {
        announcements: [
            "#pref-announcements",
            '[name="announcements"]'
        ],
        homework: [
            "#pref-homework",
            '[name="homework"]'
        ],
        events: [
            "#pref-events",
            '[name="events"]'
        ]
    };

    Object.entries(mappings).forEach(([key, selectors]) => {
        const input = selectors
            .map(selector => $(selector))
            .find(Boolean);

        if (input) input.checked = Boolean(preferences[key]);
    });
}

function savePreferences() {
    const readChecked = (...selectors) => {
        for (const selector of selectors) {
            const element = $(selector);

            if (element) return element.checked;
        }

        return false;
    };

    state.preferences = {
        announcements: readChecked(
            "#pref-announcements",
            '[name="announcements"]'
        ),
        homework: readChecked(
            "#pref-homework",
            '[name="homework"]'
        ),
        events: readChecked(
            "#pref-events",
            '[name="events"]'
        )
    };

    if (!writeStorage(STORAGE_KEYS.preferences, state.preferences)) return;

    showToast("Notification preferences saved.");
}


/* ==========================================================
   15. CONTACT AND QUICK ACTIONS
   ========================================================== */

function setupContactLinks() {
    $$("[data-school-phone]").forEach(link => {
        link.href = `tel:${SCHOOL.phone}`;
    });

    $$("[data-school-email]").forEach(link => {
        link.href = `mailto:${SCHOOL.email}`;
    });

    $$("[data-school-instagram]").forEach(link => {
        link.href = SCHOOL.instagram;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });

    $$("[data-school-address]").forEach(element => {
        element.textContent = SCHOOL.address;
    });

    $$("[data-school-name]").forEach(element => {
        element.textContent = SCHOOL.name;
    });

    $$("[data-school-timings]").forEach(element => {
        element.textContent = SCHOOL.timings;
    });

    $$("[data-call-school]").forEach(button => {
        button.addEventListener("click", () => {
            window.location.href = `tel:${SCHOOL.phone}`;
        });
    });

    $$("[data-email-school]").forEach(button => {
        button.addEventListener("click", () => {
            window.location.href = `mailto:${SCHOOL.email}`;
        });
    });

    $$("[data-open-instagram]").forEach(button => {
        button.addEventListener("click", () => {
            window.open(
                SCHOOL.instagram,
                "_blank",
                "noopener,noreferrer"
            );
        });
    });
}


/* ==========================================================
   16. SEARCH
   ========================================================== */

function setupSearch() {
    const searchInputs = $$(
        "#global-search, #search-input, [data-global-search]"
    );

    searchInputs.forEach(input => {
        input.addEventListener("input", () => {
            state.searchQuery = input.value;

            if (state.currentPage === "notices") {
                renderNotices();
            }

            if (state.currentPage === "homework") {
                renderHomework();
            }
        });
    });
}


/* ==========================================================
   17. ADMIN DASHBOARD
   IMPORTANT:
   This is a local demonstration, not secure administrator
   authentication. Never put a real admin password in this
   front-end file.
   ========================================================== */

function renderAdmin() {
    const container = $(
        "#admin-content, #admin-dashboard, [data-admin-content]"
    );

    if (!container) return;

    if (!state.isAdminMode) {
        container.innerHTML = `
            <div class="admin-login-card">
                <div class="admin-login-icon">
                    ${icon("shield-check")}
                </div>

                <h2>School Admin Area</h2>

                <p>
                    This demonstration mode lets you test adding notices,
                    homework and events on this device.
                </p>

                <p class="muted-text">
                    It is not secure authentication and must not be used
                    to protect real student information.
                </p>

                <button
                    type="button"
                    class="primary-button"
                    id="enable-demo-admin"
                >
                    Open demo admin
                    ${icon("arrow-right")}
                </button>
            </div>
        `;

        $("#enable-demo-admin")?.addEventListener("click", () => {
            state.isAdminMode = true;
            renderAdmin();
            showToast("Demo admin mode enabled on this device.");
        });

        refreshIcons(container);
        return;
    }

    container.innerHTML = `
        <div class="admin-header">
            <div>
                <span class="eyebrow">LOCAL DEMO MODE</span>
                <h2>Admin Dashboard</h2>
                <p>Changes are stored only in this browser.</p>
            </div>

            <button
                type="button"
                class="secondary-button"
                id="disable-demo-admin"
            >
                Exit demo mode
            </button>
        </div>

        <div class="admin-stat-grid">
            <div class="admin-stat-card">
                ${icon("megaphone")}
                <span>Notices</span>
                <strong>${state.notices.length}</strong>
            </div>

            <div class="admin-stat-card">
                ${icon("book-open")}
                <span>Homework</span>
                <strong>${state.homework.length}</strong>
            </div>

            <div class="admin-stat-card">
                ${icon("calendar-days")}
                <span>Events</span>
                <strong>${state.events.length}</strong>
            </div>
        </div>

        <section class="admin-form-section">
            <h3>${icon("plus-circle")} Add Notice</h3>

            <form id="admin-notice-form" class="app-form">
                <label for="admin-notice-title">Notice title *</label>
                <input id="admin-notice-title" name="title" required maxlength="120">

                <label for="admin-notice-message">Message *</label>
                <textarea
                    id="admin-notice-message"
                    name="message"
                    rows="4"
                    required
                    maxlength="2000"
                ></textarea>

                <label for="admin-notice-category">Category</label>
                <select id="admin-notice-category" name="category">
                    <option>General</option>
                    <option>Academic</option>
                    <option>Important</option>
                    <option>Event</option>
                </select>

                <label for="admin-notice-date">Date</label>
                <input
                    id="admin-notice-date"
                    name="date"
                    type="date"
                    value="${getTodayString()}"
                    required
                >

                <label class="checkbox-row">
                    <input type="checkbox" name="pinned">
                    Pin this notice
                </label>

                <button type="submit" class="primary-button">
                    Publish notice ${icon("send")}
                </button>
            </form>
        </section>

        <section class="admin-form-section">
            <h3>${icon("plus-circle")} Add Homework</h3>

            <form id="admin-homework-form" class="app-form">
                <label for="admin-hw-title">Homework title *</label>
                <input id="admin-hw-title" name="title" required maxlength="120">

                <label for="admin-hw-subject">Subject *</label>
                <input id="admin-hw-subject" name="subject" required maxlength="60">

                <label for="admin-hw-class">Class *</label>
                <select id="admin-hw-class" name="className" required>
                    ${SCHOOL.classes.map(className => `
                        <option value="${escapeHTML(className)}">
                            ${escapeHTML(className)}
                        </option>
                    `).join("")}
                </select>

                <label for="admin-hw-description">Instructions</label>
                <textarea
                    id="admin-hw-description"
                    name="description"
                    rows="3"
                    maxlength="2000"
                ></textarea>

                <label for="admin-hw-due">Due date *</label>
                <input id="admin-hw-due" name="dueDate" type="date" required>

                <button type="submit" class="primary-button">
                    Add homework ${icon("plus")}
                </button>
            </form>
        </section>

        <section class="admin-form-section">
            <h3>${icon("plus-circle")} Add Event or Holiday</h3>

            <form id="admin-event-form" class="app-form">
                <label for="admin-event-title">Title *</label>
                <input id="admin-event-title" name="title" required maxlength="120">

                <label for="admin-event-description">Description</label>
                <textarea
                    id="admin-event-description"
                    name="description"
                    rows="3"
                    maxlength="2000"
                ></textarea>

                <label for="admin-event-date">Date *</label>
                <input id="admin-event-date" name="date" type="date" required>

                <label for="admin-event-type">Type</label>
                <select id="admin-event-type" name="type">
                    <option>Event</option>
                    <option>Holiday</option>
                </select>

                <button type="submit" class="primary-button">
                    Add to calendar ${icon("calendar-days")}
                </button>
            </form>
        </section>

        <section class="admin-form-section">
            <h3>${icon("database")} Demo Data Tools</h3>

            <p>
                Export a backup of the data stored in this browser or
                restore the original sample content.
            </p>

            <div class="button-row">
                <button type="button" class="secondary-button" id="export-school-data">
                    Export backup ${icon("download")}
                </button>

                <button type="button" class="secondary-button" id="reset-school-data">
                    Reset sample data ${icon("rotate-ccw")}
                </button>
            </div>

            <label for="import-school-data">Import JSON backup</label>
            <input id="import-school-data" type="file" accept=".json,application/json">
        </section>
    `;

    $("#disable-demo-admin")?.addEventListener("click", () => {
        state.isAdminMode = false;
        renderAdmin();
        showToast("Demo admin mode closed.");
    });

    $("#admin-notice-form")?.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const success = addNotice({
            title: String(formData.get("title") || ""),
            message: String(formData.get("message") || ""),
            category: String(formData.get("category") || "General"),
            date: String(formData.get("date") || getTodayString()),
            pinned: formData.get("pinned") === "on"
        });

        if (success) {
            event.currentTarget.reset();
            renderAdmin();
        }
    });

    $("#admin-homework-form")?.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const success = addHomework({
            title: String(formData.get("title") || ""),
            subject: String(formData.get("subject") || ""),
            className: String(formData.get("className") || ""),
            description: String(formData.get("description") || ""),
            dueDate: String(formData.get("dueDate") || "")
        });

        if (success) {
            event.currentTarget.reset();
            renderAdmin();
        }
    });

    $("#admin-event-form")?.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const success = addEvent({
            title: String(formData.get("title") || ""),
            description: String(formData.get("description") || ""),
            date: String(formData.get("date") || ""),
            type: String(formData.get("type") || "Event")
        });

        if (success) {
            event.currentTarget.reset();
            renderAdmin();
        }
    });

    $("#export-school-data")?.addEventListener("click", exportSchoolData);
    $("#reset-school-data")?.addEventListener("click", resetSampleData);

    $("#import-school-data")?.addEventListener("change", event => {
        importSchoolData(event.target.files?.[0]);
        event.target.value = "";
    });

    refreshIcons(container);
}


/* ==========================================================
   18. EXPORT, IMPORT AND RESET
   ========================================================== */

function exportSchoolData() {
    const backup = {
        app: SCHOOL.name,
        exportedAt: new Date().toISOString(),
        notices: state.notices,
        homework: state.homework,
        events: state.events,
        students: state.students,
        gallery: state.gallery,
        preferences: state.preferences,
        profile: state.profile
    };

    const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "saarthi-school-backup.json";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    showToast("Backup export started.");
}

async function importSchoolData(file) {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        showToast("Backup file is too large. Maximum size is 2 MB.", "error");
        return;
    }

    try {
        const textContent = await file.text();
        const backup = JSON.parse(textContent);

        const validArrays = [
            "notices",
            "homework",
            "events",
            "students",
            "gallery"
        ];

        for (const key of validArrays) {
            if (backup[key] !== undefined && !Array.isArray(backup[key])) {
                throw new Error(`Invalid backup format for ${key}.`);
            }
        }

        if (!confirm("Import this backup and replace the current demo data?")) {
            return;
        }

        if (Array.isArray(backup.notices)) {
            state.notices = backup.notices;
        }

        if (Array.isArray(backup.homework)) {
            state.homework = backup.homework;
        }

        if (Array.isArray(backup.events)) {
            state.events = backup.events;
        }

        if (Array.isArray(backup.students)) {
            state.students = backup.students;
        }

        if (Array.isArray(backup.gallery)) {
            state.gallery = backup.gallery;
        }

        if (
            backup.preferences &&
            typeof backup.preferences === "object"
        ) {
            state.preferences = backup.preferences;
        }

        if (
            backup.profile &&
            typeof backup.profile === "object"
        ) {
            state.profile = backup.profile;
        }

        persistAllData();

        renderAdmin();
        renderHome();
        renderNotices();
        renderHomework();
        renderEvents();
        renderGallery();

        showToast("Backup imported successfully.");
    } catch (error) {
        console.error(error);

        showToast(
            "Could not import this file. Please select a valid school JSON backup.",
            "error"
        );
    }
}

function persistAllData() {
    writeStorage(STORAGE_KEYS.notices, state.notices);
    writeStorage(STORAGE_KEYS.homework, state.homework);
    writeStorage(STORAGE_KEYS.events, state.events);
    writeStorage(STORAGE_KEYS.students, state.students);
    writeStorage(STORAGE_KEYS.gallery, state.gallery);
    writeStorage(STORAGE_KEYS.preferences, state.preferences);
    writeStorage(STORAGE_KEYS.profile, state.profile);
}

function resetSampleData() {
    const confirmed = confirm(
        "Reset notices, homework, events and gallery to the original sample data? Your student profile and preferences will remain."
    );

    if (!confirmed) return;

    state.notices = structuredCloneSafe(DEFAULT_NOTICES);
    state.homework = structuredCloneSafe(DEFAULT_HOMEWORK);
    state.events = structuredCloneSafe(DEFAULT_EVENTS);
    state.gallery = structuredCloneSafe(DEFAULT_GALLERY);

    writeStorage(STORAGE_KEYS.notices, state.notices);
    writeStorage(STORAGE_KEYS.homework, state.homework);
    writeStorage(STORAGE_KEYS.events, state.events);
    writeStorage(STORAGE_KEYS.gallery, state.gallery);

    renderAdmin();
    renderHome();
    renderNotices();
    renderHomework();
    renderEvents();
    renderGallery();

    showToast("Sample content has been restored.");
}


/* ==========================================================
   19. EVENT DELEGATION
   ========================================================== */

function setupDelegatedActions() {
    document.addEventListener("click", event => {
        const homeworkButton = event.target.closest("[data-toggle-homework]");

        if (homeworkButton) {
            toggleHomework(homeworkButton.dataset.toggleHomework);
            return;
        }

        const deleteNoticeButton = event.target.closest("[data-delete-notice]");

        if (deleteNoticeButton && state.isAdminMode) {
            deleteNotice(deleteNoticeButton.dataset.deleteNotice);
            return;
        }

        const deleteEventButton = event.target.closest("[data-delete-event]");

        if (deleteEventButton && state.isAdminMode) {
            deleteEvent(deleteEventButton.dataset.deleteEvent);
            return;
        }

        const filterButton = event.target.closest("[data-homework-filter]");

        if (filterButton) {
            state.homeworkFilter = filterButton.dataset.homeworkFilter;

            $$("[data-homework-filter]").forEach(button => {
                button.classList.toggle("active", button === filterButton);
            });

            renderHomework();
            return;
        }

        const galleryButton = event.target.closest("[data-gallery-filter]");

        if (galleryButton) {
            state.galleryFilter = galleryButton.dataset.galleryFilter;

            $$("[data-gallery-filter]").forEach(button => {
                button.classList.toggle("active", button === galleryButton);
            });

            renderGallery();
        }
    });
}


/* ==========================================================
   20. FORM SETUP
   ========================================================== */

function setupForms() {
    const profileForm = $("#profile-form, [data-profile-form]");

    profileForm?.addEventListener("submit", event => {
        event.preventDefault();
        saveProfile();
    });

    const preferencesForm = $(
        "#preferences-form, [data-preferences-form]"
    );

    preferencesForm?.addEventListener("submit", event => {
        event.preventDefault();
        savePreferences();
    });

    const homeworkClassFilter = $("#homework-class-filter");

    homeworkClassFilter?.addEventListener("change", renderHomework);
}


/* ==========================================================
   21. OPTIONAL SERVICE WORKER
   A service worker requires HTTPS or localhost. This does
   not by itself implement push notifications.
   ========================================================== */

function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;

    if (
        location.protocol !== "https:" &&
        location.hostname !== "localhost" &&
        location.hostname !== "127.0.0.1"
    ) {
        return;
    }

    // Register only after you create a real service-worker.js file.
    // navigator.serviceWorker.register("./service-worker.js")
    //     .catch(error => console.warn("Service worker failed:", error));
}


/* ==========================================================
   22. APP INITIALIZATION
   ========================================================== */

function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    setupSearch();
    setupForms();
    setupDelegatedActions();
    setupContactLinks();

    renderHome();
    renderNotices();
    renderHomework();
    renderEvents();
    renderProfile();
    renderGallery();
    renderPreferences();

    const initialPage = location.hash.replace("#", "");

    if (initialPage && document.getElementById(`page-${initialPage}`)) {
        navigateTo(initialPage);
    } else {
        navigateTo("home");
    }

    refreshIcons();
    registerServiceWorker();

    console.info(`${SCHOOL.name} app initialized.`);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
} else {
    initializeApp();
}


/* ==========================================================
   END OF SCRIPT
   ========================================================== */
