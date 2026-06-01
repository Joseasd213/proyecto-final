// supabase
const SUPABASE_URL = "https://suslmhxemfbouvepchza.supabase.co";
const SUPABASE_KEY = "sb_publishable_v3ugpHrykJPH0hC4BQ-0xA_nGl7YBuu";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("message");
  const userName = document.getElementById("userName");

  const registerBtn = document.getElementById("register");
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");

  const contactForm = document.getElementById("contactForm");
  const sendBtn = document.getElementById("sendMessage");

  const change = document.querySelector("#otro");
  const socialLogin = document.querySelector("#social-login");

  const googleBtn = document.getElementById("googleBtn");
  const facebookBtn = document.getElementById("facebookBtn");

  const setMessage = (text) => {
    if (message) message.textContent = text;
  };

  const showUser = (email) => {
    if (!userName || !email) return;
    userName.textContent = "Bienvenido, " + email.split("@")[0];
  };

  const clearUser = () => {
    if (userName) userName.textContent = "";
  };

  const getAuthValues = () => {
    return {
      email: emailInput?.value.trim() || "",
      password: passwordInput?.value.trim() || ""
    };
  };

  const isLoggedIn = async () => {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) return false;
    return Boolean(data?.session?.user);
  };

  const requireLogin = async () => {
    const logged = await isLoggedIn();
    if (logged) return true;

    alert("Debes iniciar sesión antes de enviar un mensaje");
    window.location.href = "iniciar-session.html";
    return false;
  };

  if (registerBtn) {
    registerBtn.addEventListener("click", async (event) => {
      event.preventDefault();

      const { email, password } = getAuthValues();

      if (!email || !password) {
        setMessage("Rellena todos los campos");
        return;
      }

      const { error } = await supabaseClient.auth.signUp({
        email,
        password
      });

      if (error) {
        setMessage("Error: " + error.message);
        return;
      }

      setMessage("Usuario registrado. Revisa tu correo si tienes confirmación activada.");
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", async (event) => {
      event.preventDefault();

      const { email, password } = getAuthValues();

      if (!email || !password) {
        setMessage("Rellena todos los campos");
        return;
      }

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setMessage("Error: " + error.message);
        return;
      }

      setMessage("Login correcto");
      showUser(data?.user?.email);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (event) => {
      event.preventDefault();

      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        setMessage("Error: " + error.message);
        return;
      }

      setMessage("Sesión cerrada");
      clearUser();
      location.reload();
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:5500"
        }
      });

      if (error) {
        setMessage("Error Google: " + error.message);
      }
    });
  }

  if (facebookBtn) {
    facebookBtn.addEventListener("click", async () => {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: "http://127.0.0.1:5502/3-paginas/iniciar-session.html"
        }
      });

      if (error) {
        setMessage("Error Facebook: " + error.message);
      }
    });
  }

  if (change && socialLogin) {
    change.addEventListener("click", () => {
      socialLogin.classList.remove("hidden");
      change.classList.add("hidden");
    });
  }

  (async () => {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) return;

    const session = data?.session;
    if (session?.user?.email) {
      showUser(session.user.email);
      setMessage("Sesión activa");
    }
  })();

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const logged = await requireLogin();
      if (!logged) return;

      const {
        data: { user },
        error: userError
      } = await supabaseClient.auth.getUser();

      if (userError || !user) {
        alert("Debes iniciar sesión");
        window.location.href = "iniciar-session.html";
        return;
      }

      const nombreInput = contactForm.querySelector("#nombre");
      const contactEmailInput = contactForm.querySelector("#email");
      const asuntoInput = contactForm.querySelector("#asunto");
      const mensajeInput = contactForm.querySelector("#mensaje");

      const nombre = nombreInput?.value.trim() || "";
      const email = contactEmailInput?.value.trim() || "";
      const asunto = asuntoInput?.value.trim() || "";
      const mensaje = mensajeInput?.value.trim() || "";

      if (!nombre || !email || !mensaje) {
        alert("Completa nombre, email y mensaje");
        return;
      }

      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.textContent = "Enviando...";
      }

      const { error } = await supabaseClient.from("contactos").insert([
        {
          user_id: user.id,
          nombre,
          email,
          asunto,
          mensaje
        }
      ]);

      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.textContent = "Enviar mensaje";
      }

      if (error) {
        alert("Error: " + error.message);
        return;
      }

      alert("Mensaje enviado");
      contactForm.reset();
    });
  }
});