let projects = JSON.parse(
    localStorage.getItem("rwpm_projects") || "[]"
);

let currentEdit = null;

/* ===========================
STORAGE
=========================== */

function saveData() {
    localStorage.setItem(
        "rwpm_projects",
        JSON.stringify(projects)
    );
}

/* ===========================
TUTORIAL
=========================== */

function toggleTutorial() {
    const tutorial =
        document.getElementById("tutorial");

    if (!tutorial) return;

    tutorial.style.display =
        tutorial.style.display === "block"
            ? "none"
            : "block";
}

/* ===========================
CLEAR FORM
=========================== */

function clearForm() {

    const ids = [
        "controlNumber",
        "title",
        "authors",
        "location",
        "submittedTo",
        "doi",
        "publicationCode",
        "publicationURL",
        "lastEditorialEmail",
        "similarity1",
        "similarity2",
        "similarity3",
        "ai1",
        "ai2",
        "ai3",
        "wordLimit",
        "currentWords",
        "pending",
        "aiLog",
        "emailLog",
        "timeline"
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    const status =
        document.getElementById("status");

    if (status) {
        status.value = "Draft";
    }

    currentEdit = null;

    const notice =
        document.getElementById("editingNotice");

    if (notice) {
        notice.style.display = "none";
    }

    const btn =
        document.getElementById("saveButton");

    if (btn) {
        btn.innerText = "Add Project";
    }
}

/* ===========================
ADD PROJECT
=========================== */

function addProject() {

    const title =
        document.getElementById("title")?.value?.trim() || "";

    if (title === "") {
        alert("Project title is required.");
        return;
    }

    const project = {

        id:
            currentEdit || Date.now(),

        controlNumber:
            document.getElementById("controlNumber")?.value || "",

        title,

        authors:
            document.getElementById("authors")?.value || "",

        location:
            document.getElementById("location")?.value || "",

        submittedTo:
            document.getElementById("submittedTo")?.value || "",

        doi:
            document.getElementById("doi")?.value || "",

        publicationCode:
            document.getElementById("publicationCode")?.value || "",

        publicationURL:
            document.getElementById("publicationURL")?.value || "",

        lastEditorialEmail:
            document.getElementById("lastEditorialEmail")?.value || "",

       status:
    document.getElementById("status")?.value || "Draft",

similarity1:
    Number(
        document.getElementById("similarity1")?.value || 0
    ),

similarity2:
    Number(
        document.getElementById("similarity2")?.value || 0
    ),

similarity3:
    Number(
        document.getElementById("similarity3")?.value || 0
    ),

ai1:
    Number(
        document.getElementById("ai1")?.value || 0
    ),

ai2:
    Number(
        document.getElementById("ai2")?.value || 0
    ),

ai3:
    Number(
        document.getElementById("ai3")?.value || 0
    ),

wordLimit:
    Number(
        document.getElementById("wordLimit")?.value || 0
    ),

currentWords:
    Number(
        document.getElementById("currentWords")?.value || 0
    ),
        wordLimit:
            Number(
                document.getElementById("wordLimit")?.value || 0
            ),

        currentWords:
            Number(
                document.getElementById("currentWords")?.value || 0
            ),

        pending:
            document.getElementById("pending")?.value || "",

        aiLog:
            document.getElementById("aiLog")?.value || "",

        emailLog:
            document.getElementById("emailLog")?.value || "",

        timeline:
            document.getElementById("timeline")?.value || ""
    };

    if (currentEdit) {

        const index =
            projects.findIndex(
                p => p.id === currentEdit
            );

        if (index >= 0) {
            projects[index] = project;
        }

    } else {

        projects.push(project);

    }

    saveData();
    renderProjects();
    clearForm();

    alert("Project saved successfully.");
}

/* ===========================
EDIT
=========================== */

function editProject(id) {

    const p =
        projects.find(
            x => x.id === id
        );

    if (!p) return;

    currentEdit = p.id;

    Object.keys(p).forEach(key => {

        const el =
            document.getElementById(key);

        if (el && key !== "id") {
            el.value = p[key];
        }

    });

    const notice =
        document.getElementById("editingNotice");

    if (notice) {
        notice.style.display = "block";
    }

    const btn =
        document.getElementById("saveButton");

    if (btn) {
        btn.innerText = "Update Project";
    }
}

/* ===========================
DELETE
=========================== */

function del(id) {

    if (!confirm("Delete this project?")) {
        return;
    }

    projects =
        projects.filter(
            p => p.id !== id
        );

    saveData();
    renderProjects();
}

/* ===========================
TABLE
=========================== */

function renderProjects() {

    const table =
        document.getElementById("projectTable");

    if (!table) return;

    table.innerHTML = "";

    projects.forEach((p, index) => {

        const diff =
            (p.currentWords || 0) -
            (p.wordLimit || 0);

 const aiValues = [
    p.ai1,
    p.ai2,
    p.ai3
].filter(v =>
    v !== undefined &&
    v !== null &&
    v !== "" &&
    v > 0
);

const lastAI =
    aiValues.length > 0
        ? Math.min(...aiValues)
        : 0;

        table.innerHTML += `
        <tr>

            <td>${index + 1}</td>

            <td>${p.title || ""}</td>

            <td>${p.status || ""}</td>

            <td>
                ${p.currentWords || 0}/${p.wordLimit || 0}
            </td>

            <td>${diff}</td>

            <td>${lastAI}%</td>

            <td>

                <button
                    onclick="editProject(${p.id})">
                    Edit
                </button>

                <button
                    onclick="del(${p.id})">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

    updateDashboard();

}

/* ===========================
DASHBOARD
=========================== */

function updateDashboard(){

    document.getElementById(
        "totalProjects"
    ).innerText =
    projects.length;

    document.getElementById(
        "submittedCount"
    ).innerText =
    projects.filter(
        p => p.status === "Submitted"
    ).length;

    document.getElementById(
        "acceptedCount"
    ).innerText =
    projects.filter(
        p => p.status === "Accepted"
    ).length;

    document.getElementById(
        "publishedCount"
    ).innerText =
    projects.filter(
        p => p.status === "Published"
    ).length;

    let similaritySum = 0;
    let aiSum = 0;

    projects.forEach(p => {

        const avgSim =
        (
            (p.similarity1 || 0) +
            (p.similarity2 || 0) +
            (p.similarity3 || 0)
        ) / 3;

        const avgAI =
        (
            (p.ai1 || 0) +
            (p.ai2 || 0) +
            (p.ai3 || 0)
        ) / 3;

        similaritySum += avgSim;
        aiSum += avgAI;

    });

    const avgSimilarity =
    projects.length
    ? similaritySum / projects.length
    : 0;

    const avgAIDetection =
    projects.length
    ? aiSum / projects.length
    : 0;

    document.getElementById(
        "avgSimilarity"
    ).innerText =
    avgSimilarity.toFixed(1) + "%";

    document.getElementById(
        "avgAIDetection"
    ).innerText =
    avgAIDetection.toFixed(1) + "%";

}

/* ===========================
EXPORT JSON
=========================== */

function exportJSON() {

    const blob =
        new Blob(
            [
                JSON.stringify(
                    projects,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );

    const a =
        document.createElement("a");

    a.href =
        URL.createObjectURL(blob);

    a.download =
        "rwpm_projects.json";

    a.click();
}

/* ===========================
IMPORT JSON
=========================== */

function importFile(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload =
        function (e) {

            projects =
                JSON.parse(
                    e.target.result
                );

            saveData();
            renderProjects();
        };

    reader.readAsText(file);
}

/* ===========================
THEME
=========================== */

function toggleTheme() {
    document.body.classList.toggle("dark");
}

/* ===========================
START
=========================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        renderProjects();
    }
);