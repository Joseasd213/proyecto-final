  
    const SUPABASE_URL = "https://suslmhxemfbouvepchza.supabase.co";
    const SUPABASE_KEY = "sb_publishable_v3ugpHrykJPH0hC4BQ-0xA_nGl7YBuu";

    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("message");
    const userName = document.getElementById("userName");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");
    const logoutBtn = document.getElementById("logout");

    function showNameFromEmail(email) {
      const nombre = email.split("@")[0];
      userName.textContent = "Bienvenido, " + nombre;
    }

    function clearSessionUI() {
      userName.textContent = "";
    }

    registerBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        message.textContent = "Rellena todos los campos";
        return;
      }

      message.textContent = "Registrando...";

      const { error } = await supabaseClient.auth.signUp({
        email,
        password
      });

      if (error) {
        message.textContent = "Error: " + error.message;
        return;
      }

      message.textContent = "Usuario registrado ✔️";
    });

    loginBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        message.textContent = "Rellena todos los campos";
        return;
      }

      message.textContent = "Iniciando sesión...";

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        message.textContent = "Error: " + error.message;
        return;
      }

      message.textContent = "Login correcto ✅";

      if (data?.user?.email) {
        showNameFromEmail(data.user.email);
      }
    });

    logoutBtn.addEventListener("click", async () => {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        message.textContent = "Error al cerrar sesión: " + error.message;
        return;
      }

      message.textContent = "Sesión cerrada ❌";
      clearSessionUI();
    });

    supabaseClient.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) {
        showNameFromEmail(data.session.user.email);
        message.textContent = "Sesión activa ✅";
      }
    });
