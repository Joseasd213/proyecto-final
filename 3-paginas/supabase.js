const SUPABASE_URL = "https://suslmhxemfbouvepchza.supabase.co";
const SUPABASE_KEY = "sb_publishable_v3ugpHrykJPH0hC4BQ-0xA_nGl7YBuu";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("message");
  const userName = document.getElementById("userName");

  const registerBtn = document.getElementById("register");
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");

  const contactForm = document.getElementById("contactForm");
  const sendBtn = document.getElementById("sendMessage");

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

  const hasUserName = () => {
    return Boolean(userName?.textContent.trim());
  };

  const requireUserName = () => {
    if (hasUserName()) return true;

    alert("Debes iniciar sesion antes de enviar un mensaje");
    window.location.href = "iniciar-session.html";
    return false;
  };

  const getAuthValues = () => {
    return {
      email: emailInput?.value.trim() || "",
      password: passwordInput?.value.trim() || ""
    };
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

      setMessage("Usuario registrado");
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

      setMessage("Sesion cerrada");
      clearUser();
    });
  }

  const { data: sessionData } = await supabaseClient.auth.getSession();

  if (sessionData?.session?.user?.email) {
    showUser(sessionData.session.user.email);
    setMessage("Sesion activa");
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!requireUserName()) return;

      const {
        data: { user },
        error: userError
      } = await supabaseClient.auth.getUser();

      if (userError || !user) {
        alert("Debes iniciar sesion");
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
  } else if (sendBtn) {
    sendBtn.addEventListener("click", async (event) => {
      event.preventDefault();

      if (!requireUserName()) return;

      const nombreInput = document.getElementById("nombre");
      const contactEmailInput = document.getElementById("email");
      const asuntoInput = document.getElementById("asunto");
      const mensajeInput = document.getElementById("mensaje");

      const nombre = nombreInput?.value.trim() || "";
      const email = contactEmailInput?.value.trim() || "";
      const asunto = asuntoInput?.value.trim() || "";
      const mensaje = mensajeInput?.value.trim() || "";

      if (!nombre || !email || !mensaje) {
        alert("Completa nombre, email y mensaje");
        return;
      }

      sendBtn.disabled = true;
      sendBtn.textContent = "Enviando...";

      const { error } = await supabaseClient.from("contactos").insert([
        {
          nombre,
          email,
          asunto,
          mensaje
        }
      ]);

      sendBtn.disabled = false;
      sendBtn.textContent = "Enviar mensaje";

      if (error) {
        alert("Error: " + error.message);
        return;
      }

      alert("Mensaje enviado");

      if (nombreInput) nombreInput.value = "";
      if (contactEmailInput) contactEmailInput.value = "";
      if (asuntoInput) asuntoInput.value = "";
      if (mensajeInput) mensajeInput.value = "";
    });
  }
});
