const SUPABASE_URL = "https://suslmhxemfbouvepchza.supabase.co";
const SUPABASE_KEY = "sb_publishable_v3ugpHrykJPH0hC4BQ-0xA_nGl7YBuu";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔥 IMPORTANTE: DOM listo
document.addEventListener("DOMContentLoaded", async () => {

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("message");
  const userName = document.getElementById("userName");

  const registerBtn = document.getElementById("register");
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");

  // ----------------------------
  // MOSTRAR USUARIO
  // ----------------------------
  function showNameFromEmail(email) {
    const nombre = email.split("@")[0];

    if (userName) {
      userName.textContent = "Bienvenido, " + nombre;
    }
  }

  function clearSessionUI() {
    if (userName) {
      userName.textContent = "";
    }
  }

  // ----------------------------
  // REGISTRO
  // ----------------------------
  if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
      const email = emailInput?.value.trim();
      const password = passwordInput?.value.trim();

      if (!email || !password) {
        if (message) message.textContent = "Rellena todos los campos";
        return;
      }

      const { error } = await supabaseClient.auth.signUp({
        email,
        password
      });

      if (error) {
        if (message) message.textContent = "Error: " + error.message;
        return;
      }

      if (message) message.textContent = "Usuario registrado ✔️";
    });
  }

  // ----------------------------
  // LOGIN
  // ----------------------------
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = emailInput?.value.trim();
      const password = passwordInput?.value.trim();

      if (!email || !password) {
        if (message) message.textContent = "Rellena todos los campos";
        return;
      }

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (message) message.textContent = "Error: " + error.message;
        return;
      }

      if (message) message.textContent = "Login correcto ✅";

      if (data?.user?.email) {
        showNameFromEmail(data.user.email);
      }
    });
  }

  // ----------------------------
  // LOGOUT
  // ----------------------------
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        if (message) message.textContent = "Error: " + error.message;
        return;
      }

      if (message) message.textContent = "Sesión cerrada ❌";
      clearSessionUI();
    });
  }

  // ----------------------------
  // SESIÓN AUTOMÁTICA (CLAVE)
  // ----------------------------
  const { data } = await supabaseClient.auth.getSession();

  if (data?.session?.user?.email) {
    showNameFromEmail(data.session.user.email);

    if (message) {
      message.textContent = "Sesión activa ✅";
    }
  }

});