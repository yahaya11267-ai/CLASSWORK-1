import { api } from './api.js';

const studentsDiv = document.getElementById("students");
const saveBtn = document.getElementById("saveBtn");

let localStudents = [];

saveBtn.addEventListener("click", saveStudent);

// LOAD STUDENTS FROM API
async function loadStudents() {
  // Just keep the API data as is to render nested structure
  localStudents = await api.getStudents();
  displayStudents();
}

// DISPLAY STUDENTS FULL NESTED STRUCTURE
function displayStudents() {
  studentsDiv.innerHTML = localStudents.map(user => `
    <div class="card">

      <strong>${user.id} - ${user.name}</strong><br>
      Username: ${user.username || "N/A"}<br>
      Email: ${user.email || "N/A"}<br>
      Phone: ${user.phone || "N/A"}<br>
      Website: ${user.website || "N/A"}<br><br>

      <strong>Address</strong><br>
      ${user.address?.street || ""}, ${user.address?.suite || ""}<br>
      ${user.address?.city || ""}, ${user.address?.zipcode || ""}<br>
      Geo: ${user.address?.geo?.lat || ""}, ${user.address?.geo?.lng || ""}<br><br>

      <strong>Company</strong><br>
      ${user.company?.name || ""}<br>
      "${user.company?.catchPhrase || ""}"<br>
      ${user.company?.bs || ""}<br><br>

      <button onclick="editStudent(${user.id})">Edit</button>
      <button onclick="deleteStudent(${user.id})">Delete</button>

    </div>
  `).join("");
}

// SAVE STUDENT (CREATE OR UPDATE)
async function saveStudent() {
  const id = document.getElementById("studentId").value;
  const name = document.getElementById("studentName").value;
  const department = document.getElementById("department").value;
  const email = document.getElementById("email").value;
  const phonenumber = document.getElementById("phonenumber").value;
  const address = document.getElementById("address")?.value || "";

  if (!id) {
    // CREATE
    const newStudent = await api.createStudent({
      name,
      username: department, // using department field as username for demo
      email,
      phone: phonenumber,
      address
    });

    // Push locally
    localStudents.push({
      ...newStudent,
      username: department,
      phone: phonenumber,
      address: { street: address, suite: "", city: "" },
      company: { name: department, catchPhrase: "", bs: "" }
    });

  } else {
    // UPDATE
    await api.updateStudent(id, {
      name,
      username: department,
      email,
      phone: phonenumber,
      address
    });

    const index = localStudents.findIndex(s => s.id == id);
    localStudents[index] = {
      ...localStudents[index],
      name,
      username: department,
      email,
      phone: phonenumber,
      address: { street: address, suite: "", city: "" },
      company: { ...localStudents[index].company, name: department }
    };
  }

  clearForm();
  displayStudents();
}

// EDIT STUDENT
window.editStudent = function(id) {
  const student = localStudents.find(s => s.id === id);

  document.getElementById("studentId").value = student.id;
  document.getElementById("studentName").value = student.name;
  document.getElementById("department").value = student.username || student.department || "";
  document.getElementById("email").value = student.email || "";
  document.getElementById("phonenumber").value = student.phone || "";
  document.getElementById("address").value = student.address?.street || "";
}

// DELETE STUDENT
window.deleteStudent = async function(id) {
  await api.deleteStudent(id);
  localStudents = localStudents.filter(s => s.id !== id);
  displayStudents();
}

// CLEAR FORM
function clearForm() {
  document.getElementById("studentId").value = "";
  document.getElementById("studentName").value = "";
  document.getElementById("department").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phonenumber").value = "";
  document.getElementById("address").value = "";
}

// INITIAL LOAD
loadStudents();
