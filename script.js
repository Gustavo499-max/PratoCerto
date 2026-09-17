const API_BASE = "";

const state = {
  token: localStorage.getItem("pratocerto_token") || null,
  user: JSON.parse(localStorage.getItem("pratocerto_user") || "null"),
};

// Elements
const sessionArea = document.getElementById("sessionArea");
const authPanel = document.getElementById("authPanel");
const authTitle = document.getElementById("authTitle");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginMsg = document.getElementById("loginMsg");
const registerMsg = document.getElementById("registerMsg");
const btnShowLogin = document.getElementById("btnShowLogin");
const btnShowRegister = document.getElementById("btnShowRegister");
const btnCloseAuth = document.getElementById("btnCloseAuth");
const createHint = document.getElementById("createHint");
const restaurantForm = document.getElementById("restaurantForm");
const btnCreateRestaurant = document.getElementById("btnCreateRestaurant");
const restaurantMsg = document.getElementById("restaurantMsg");
const restaurantList = document.getElementById("restaurantList");
const btnRefresh = document.getElementById("btnRefresh");

function setMsg(el, text, type) {
  el.textContent = text || "";
  el.className = "form-msg" + (type ? " " + type : "");
}

function renderSession() {
  if (state.user) {
    sessionArea.innerHTML = "";
    const label = document.createElement("span");
    label.textContent = `Olá, ${state.user.name}`;
    label.style.fontWeight = "500";
    label.style.marginRight = "8px";

    const btnLogout = document.createElement("button");
    btnLogout.className = "link-btn";
    btnLogout.textContent = "Sair";
    btnLogout.onclick = logout;

    sessionArea.appendChild(label);
    sessionArea.appendChild(btnLogout);

    createHint.hidden = true;
    btnCreateRestaurant.disabled = false;
  } else {
    sessionArea.innerHTML = "";
    sessionArea.appendChild(btnShowLogin);
    sessionArea.appendChild(btnShowRegister);

    createHint.hidden = false;
    btnCreateRestaurant.disabled = true;
  }
}

function openAuth(mode) {
  authPanel.hidden = false;
  if (mode === "register") {
    authTitle.textContent = "Criar conta";
    loginForm.hidden = true;
    registerForm.hidden = false;
  } else {
    authTitle.textContent = "Entrar";
    loginForm.hidden = false;
    registerForm.hidden = true;
  }
}

function closeAuth() {
  authPanel.hidden = true;
  setMsg(loginMsg, "");
  setMsg(registerMsg, "");
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem("pratocerto_token");
  localStorage.removeItem("pratocerto_user");
  renderSession();
}

async function apiFetch(path, options = {}) {
  const headers = options.headers || {};
  headers["Content-Type"] = "application/json";
  if (state.token) {
    headers["Authorization"] = `Bearer ${state.token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    /* sem corpo de resposta */
  }
  if (!res.ok) {
    const error = new Error((data && data.error) || "Erro na requisição");
    error.status = res.status;
    throw error;
  }
  return data;
}

async function loadRestaurants() {
  restaurantList.innerHTML = '<p class="hint">Carregando restaurantes…</p>';
  try {
    const restaurants = await apiFetch("/restaurants");
    if (!restaurants.length) {
      restaurantList.innerHTML = '<p class="hint">Nenhum restaurante cadastrado ainda.</p>';
      return;
    }
    restaurantList.innerHTML = "";
    restaurants.forEach((r) => {
      const card = document.createElement("article");
      card.className = "restaurant-card";
      card.innerHTML = `
        <h3>${escapeHtml(r.name)}</h3>
        <p class="category">${escapeHtml(r.category || "Sem categoria")}</p>
        <span class="rating">★ ${r.rating ?? "—"}</span>
      `;
      restaurantList.appendChild(card);
    });
  } catch (error) {
    restaurantList.innerHTML = `<p class="hint">Não foi possível carregar os restaurantes (${escapeHtml(error.message)}).</p>`;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Events
btnShowLogin.addEventListener("click", () => openAuth("login"));
btnShowRegister.addEventListener("click", () => openAuth("register"));
btnCloseAuth.addEventListener("click", closeAuth);
btnRefresh.addEventListener("click", loadRestaurants);

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg(loginMsg, "");
  const formData = new FormData(loginForm);
  try {
    const result = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    state.token = result.token;
    state.user = result.user;
    localStorage.setItem("pratocerto_token", state.token);
    localStorage.setItem("pratocerto_user", JSON.stringify(state.user));
    renderSession();
    closeAuth();
    loginForm.reset();
  } catch (error) {
    setMsg(loginMsg, error.message, "error");
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg(registerMsg, "");
  const formData = new FormData(registerForm);
  try {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    setMsg(registerMsg, "Conta criada! Agora faça login.", "success");
    registerForm.reset();
    setTimeout(() => openAuth("login"), 900);
  } catch (error) {
    setMsg(registerMsg, error.message, "error");
  }
});

restaurantForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg(restaurantMsg, "");
  const formData = new FormData(restaurantForm);
  try {
    await apiFetch("/restaurants", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        category: formData.get("category"),
        rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
      }),
    });
    setMsg(restaurantMsg, "Restaurante cadastrado com sucesso!", "success");
    restaurantForm.reset();
    loadRestaurants();
  } catch (error) {
    setMsg(restaurantMsg, error.message, "error");
  }
});

// Init
renderSession();
loadRestaurants();
