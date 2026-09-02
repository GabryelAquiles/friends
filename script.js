import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configurações do seu projeto "ultimo-ep"
const firebaseConfig = {
  apiKey: "AIzaSyDd7-_W6l2vSbzJ9lrQdeleBa7Np3or2qA",
  authDomain: "ultimo-ep.firebaseapp.com",
  projectId: "ultimo-ep",
  storageBucket: "ultimo-ep.firebasestorage.app",
  messagingSenderId: "338057476518",
  appId: "1:338057476518:web:eeec2cf826e24a7e633767",
  measurementId: "G-LZ66W1K761"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  const nomeAmigoEl = document.getElementById('nome-amigo');

  // LÓGICA DA TELA DE LOGIN (index.html)
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();

      const apelidoInput = document.getElementById('apelido').value.trim().toLowerCase();
      const senhaInput = document.getElementById('senha').value;
      const emailFormatado = `${apelidoInput}@despedida.com`;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, emailFormatado, senhaInput);
        const user = userCredential.user;

        // Busca os dados do Firestore
        const docRef = doc(db, "amigos", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Salva os dados na sessão e redireciona
          sessionStorage.setItem('dadosAmigo', JSON.stringify(docSnap.data()));
          window.location.href = "home.html";
        } else {
          alert("Nenhum registro encontrado para este usuário no banco de dados.");
        }
      } catch (error) {
        console.error("Erro na autenticação:", error);
        alert("Apelido ou senha incorretos. Tente novamente!");
      }
    });
  }

  // LÓGICA DA TELA DE HOMENAGEM (home.html)
  if (nomeAmigoEl) {
    const dadosSalvos = sessionStorage.getItem('dadosAmigo');

    // Se tentar acessar a home sem ter feito login, volta para o index
    if (!dadosSalvos) {
      window.location.href = "index.html";
      return;
    }

    const dados = JSON.parse(dadosSalvos);

    // Preenche os campos do HTML
    nomeAmigoEl.innerText = dados.nome;
    document.getElementById("texto-poema").innerText = dados.poema;
    document.getElementById("player-youtube").src = `https://www.youtube.com/embed/${dados.youtubeVideoId}?autoplay=1`;
    document.getElementById("player-musica").src = dados.musicaUrl;

    // Botão de Sair
    const btnSair = document.getElementById("btn-sair");
    if (btnSair) {
      btnSair.addEventListener("click", () => {
        sessionStorage.removeItem('dadosAmigo');
        window.location.href = "index.html";
      });
    }
  }
});
