// Utilidades de LocalStorage
const storage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

window.addEventListener("DOMContentLoaded", () => {
  // Estado
  let user = storage.get("user", null);
  let categories = storage.get("categories", ["Cardio", "Força", "Flexibilidade"]);
  let exercises = storage.get("exercises", []); // aceita strings (novo modelo) ou objetos {name, category, difficulty}
  let records = storage.get("records", []);
  let isRegister = false;

  // Helpers
  const getExerciseName = (ex) => (typeof ex === "string" ? ex : (ex?.name || ""));
  const exerciseExists = (name) =>
    exercises.some((ex) => getExerciseName(ex).toLowerCase() === name.toLowerCase());

  // Elementos
  const authContainer = document.getElementById("auth-container");
  const mainContainer = document.getElementById("main-container");
  const authForm = document.getElementById("auth-form");
  const authTitle = document.getElementById("auth-title");
  const authBtn = document.getElementById("auth-btn");
  const toggleAuth = document.getElementById("toggle-auth");
  const authError = document.getElementById("auth-error");
  const logoutBtn = document.getElementById("logout-btn");
  const userEmailSpan = document.getElementById("user-email");
  const progressPercent = document.getElementById("progress-percent");
  const totalExercises = document.getElementById("total-exercises");
  const totalTime = document.getElementById("total-time");
  const recentList = document.getElementById("recent-list");
  const categoryForm = document.getElementById("category-form");
  const categoryName = document.getElementById("category-name");
  const categoryList = document.getElementById("category-list");
  const exerciseManageForm = document.getElementById("exercise-manage-form");
  const manageExerciseName = document.getElementById("manage-exercise-name");
  const exerciseList = document.getElementById("exercise-list");
  const exerciseForm = document.getElementById("exercise-form");
  const exerciseSelect = document.getElementById("exercise-select");
  const exerciseName = document.getElementById("exercise-name");
  const categorySelect = document.getElementById("category-select");
  const difficultySelect = document.getElementById("difficulty-select");
  const daySelect = document.getElementById("day-select");
  const durationInput = document.getElementById("duration");

  function showMain() {
    authContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
    if (userEmailSpan) userEmailSpan.textContent = user?.email || "";
    renderAll();
  }

  function showAuth() {
    mainContainer.classList.add("hidden");
    authContainer.classList.remove("hidden");
  }

  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email.match(/^\S+@\S+\.\S+$/)) {
        authError.textContent = "E-mail inválido.";
        return;
      }
      if (password.length !== 6) {
        authError.textContent = "A senha deve ter 6 dígitos.";
        return;
      }

      if (isRegister) {
        if (storage.get("user", null)) {
          authError.textContent = "Já existe um usuário cadastrado.";
          return;
        }
        user = { email, password };
        storage.set("user", user);
        showMain();
      } else {
        const saved = storage.get("user", null);
        if (!saved || saved.email !== email || saved.password !== password) {
          authError.textContent = "Credenciais inválidas.";
          return;
        }
        user = saved;
        showMain();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      user = null;
      showAuth();
    });
  }

  // Delegação de evento para alternar Login <-> Cadastro
  if (toggleAuth) {
    toggleAuth.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        e.preventDefault();
        if (e.target.id === "show-register") {
          isRegister = true;
          authTitle.textContent = "Cadastro";
          authBtn.textContent = "Cadastrar";
          toggleAuth.innerHTML = `Já tem conta? <a href="#" id="show-login">Entrar</a>`;
        } else if (e.target.id === "show-login") {
          isRegister = false;
          authTitle.textContent = "Login";
          authBtn.textContent = "Entrar";
          toggleAuth.innerHTML = `Não tem conta? <a href="#" id="show-register">Cadastre-se</a>`;
        }
        authError.textContent = "";
      }
    });
  }

  // -------------------- RENDERIZAÇÃO --------------------
  let progressChart = null;
  function renderProgress() {
    totalExercises.textContent = records.length;
    const totalMin = records.reduce((acc, r) => acc + r.duration, 0);
    totalTime.textContent = totalMin + " min";
    const percent = Math.round((totalMin / 300) * 100);
    if (progressPercent)
      progressPercent.textContent = (percent > 100 ? 100 : percent) + "%";

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const weekData = [0, 0, 0, 0, 0, 0, 0];

    records.forEach(r => {
      const idx = weekDays.indexOf(r.day);
      if (idx !== -1) weekData[idx] += r.duration;
    });

    const ctx = document.getElementById("progress-chart").getContext("2d");
    if (progressChart) {
      progressChart.data.datasets[0].data = weekData;
      progressChart.update();
    } else {
      progressChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: weekDays,
          datasets: [{
            label: "Duração (min)",
            data: weekData,
            backgroundColor: "#3b82f6"
          }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });
    }
  }

  function renderCategories() {
    categoryList.innerHTML = "";
    categories.forEach((cat, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div><b>${cat}</b></div>
        <div style="display:flex; gap:10px;">
          <button class='edit-cat' data-idx='${idx}' title='Editar'>✏️</button>
          <button class='del-cat' data-idx='${idx}' title='Excluir'>🗑️</button>
        </div>
      `;
      categoryList.appendChild(li);
    });

    categoryList.querySelectorAll(".edit-cat").forEach((btn) => {
      btn.onclick = function () {
        const idx = +this.dataset.idx;
        const novoNome = prompt("Editar categoria:", categories[idx]);
        if (novoNome && novoNome.trim()) {
          categories[idx] = novoNome.trim();
          storage.set("categories", categories);
          renderCategories();
          renderCategorySelect();
        }
      };
    });

    categoryList.querySelectorAll(".del-cat").forEach((btn) => {
      btn.onclick = function () {
        const idx = +this.dataset.idx;
        if (confirm("Excluir categoria?")) {
          categories.splice(idx, 1);
          storage.set("categories", categories);
          renderCategories();
          renderCategorySelect();
        }
      };
    });
  }

  function renderExercises() {
    exerciseList.innerHTML = "";
    exercises.forEach((ex, idx) => {
      const name = getExerciseName(ex);
      const li = document.createElement("li");
      li.innerHTML = `
        <div><b>${name}</b></div>
        <div style="display:flex; gap:10px;">
          <button class='edit-ex' data-idx='${idx}' title='Editar'>✏️</button>
          <button class='del-ex' data-idx='${idx}' title='Excluir'>🗑️</button>
        </div>
      `;
      exerciseList.appendChild(li);
    });

    exerciseList.querySelectorAll(".edit-ex").forEach((btn) => {
      btn.onclick = function () {
        const idx = +this.dataset.idx;
        const atual = getExerciseName(exercises[idx]);
        const novoNome = prompt("Editar exercício:", atual);
        if (novoNome && novoNome.trim()) {
          if (typeof exercises[idx] === "string") {
            exercises[idx] = novoNome.trim();
          } else {
            exercises[idx].name = novoNome.trim();
          }
          storage.set("exercises", exercises);
          renderExercises();
          renderExerciseSelect();
        }
      };
    });

    exerciseList.querySelectorAll(".del-ex").forEach((btn) => {
      btn.onclick = function () {
        const idx = +this.dataset.idx;
        if (confirm("Excluir exercício?")) {
          exercises.splice(idx, 1);
          storage.set("exercises", exercises);
          renderExercises();
          renderExerciseSelect();
        }
      };
    });
  }

  function renderExerciseSelect() {
    exerciseSelect.innerHTML = "<option value=\"\">-- Selecione --</option>";
    exercises.forEach((ex) => {
      const name = getExerciseName(ex);
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      exerciseSelect.appendChild(opt);
    });
  }

  function renderCategorySelect() {
    categorySelect.innerHTML = "<option value=\"\">-- Categoria --</option>";
    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });
  }

  function renderRecent() {
    recentList.innerHTML = "";
    records.slice(-5).reverse().forEach(r => {
      const li = document.createElement("li");
      li.textContent = `${r.name} - ${r.duration}min (${r.day})`;
      recentList.appendChild(li);
    });
  }

  function renderAll() {
    renderCategories();
    renderExercises();
    renderExerciseSelect();
    renderCategorySelect();
    renderProgress();
    renderRecent();
  }

  // -------------------- EVENTOS DE FORM --------------------
  if (categoryForm) {
    categoryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = categoryName.value.trim();
      if (value) {
        categories.push(value);
        storage.set("categories", categories);
        categoryName.value = "";
        renderCategories();
        renderCategorySelect();
      }
    });
  }

  // Adicionar exercício (apenas nome)
  if (exerciseManageForm) {
    exerciseManageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = manageExerciseName.value.trim();
      if (!name) return;
      if (exerciseExists(name)) {
        alert("Esse exercício já existe na lista.");
        return;
      }
      exercises.push(name);
      storage.set("exercises", exercises);
      manageExerciseName.value = "";
      renderExercises();
      renderExerciseSelect();
    });
  }

  // Registrar Exercício Realizado
  if (exerciseForm) {
    exerciseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const exName = exerciseName.value.trim() || exerciseSelect.value;
      if (!exName || !categorySelect.value || !durationInput.value) return;

      const record = {
        name: exName,
        category: categorySelect.value,
        difficulty: difficultySelect.value,
        day: daySelect.value,
        duration: +durationInput.value
      };
      records.push(record);
      storage.set("records", records);
      renderProgress();
      renderRecent();
      exerciseForm.reset();
    });
  }

  // -------------------- INICIALIZAÇÃO --------------------
  if (user) showMain();
  else showAuth();
});
