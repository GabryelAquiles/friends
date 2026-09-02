// Importações necessárias usando módulos CDN
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

// Inicializa o Firebase e os serviços
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Escuta o envio do formulário de login
document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();

  const apelidoInput = document.getElementById('apelido').value.trim().toLowerCase();
  const senhaInput = document.getElementById('senha').value;

  // Formata o apelido para o e-mail cadastrado no Firebase
  const emailFormatado = `${apelidoInput}@despedida.com`;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, emailFormatado, senhaInput);
    const user = userCredential.user;

    // Busca os dados do amigo logado
    await carregarDadosDoAmigo(user.uid);
  } catch (error) {
    console.error("Erro na autenticação:", error);
    alert("Apelido ou senha incorretos. Tente novamente!");
  }
});

// Função para carregar os dados do Firestore
async function carregarDadosDoAmigo(uid) {
  try {
    const docRef = doc(db, "amigos", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dados = docSnap.data();

      // Atualiza o HTML com os dados do amigo
      document.getElementById("nome-amigo").innerText = dados.nome;
      document.getElementById("texto-poema").innerText = dados.poema;

      // Seta o vídeo do YouTube
      document.getElementById("player-youtube").src = `https://www.youtube.com/embed/${dados.youtubeVideoId}?autoplay=1`;

      // Seta a música
      document.getElementById("player-musica").src = dados.musicaUrl;

      // Troca a tela de login pelo painel de homenagem
      document.getElementById("tela-login").style.display = "none";
      document.getElementById("conteudo-amigo").style.display = "block";
    } else {
      alert("Nenhum registro encontrado para este usuário no banco de dados.");
    }
  } catch (error) {
    console.error("Erro ao carregar dados do Firestore:", error);
    alert("Ocorreu um erro ao carregar as informações.");
  }
}