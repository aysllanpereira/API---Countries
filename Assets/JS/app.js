async function fetchData() {
    const req = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,capital,region");
    const data = await req.json();
    
    return data;
}

async function displayData(countries) {
    
    const container = document.querySelector("#exibir");
    container.innerHTML = "";

    const favoritos = JSON.parse(localStorage.getItem("Pais") || "[]");

    console.log(favoritos);
    
    countries.forEach(element => {
        
        const div = document.createElement("div");
        const img = document.createElement("img");
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        const butt = document.createElement("button");
        // butt.classList.add("btn2");
        
        img.src = element.flags.png;
        p1.innerHTML = `<strong>País:</strong> ${element.name.common}`;
        p2.innerHTML = `<strong>Capital:</strong> ${element.capital ? element.capital : "Sem capital!"}`;
        // butt.innerHTML = `Favoritar ⭐`;

        // if(!favoritos) return [];

        const isFavorito = favoritos.includes(element.name.common);
        // console.log(btn);
        butt.textContent = isFavorito ? "Remover ❌" : "Favoritar ⭐";

        butt.addEventListener("click", () => {
          favorite(element.name.common);
      
          const select = document.querySelector("#select");
          const favoritosAtualizados = JSON.parse(localStorage.getItem("Pais") || "[]");
      
          if (select.value === "Favoritos") {
              const atualizados = countries.filter(item => favoritosAtualizados.includes(item.name.common));
              displayData(atualizados);
          } else {
              displayData(countries);
          }
      });
      
        
        div.append(img, p1, p2, butt);
        
        container.appendChild(div);
        
    });
    
}

function favorite(valor) {

  let fav = JSON.parse(localStorage.getItem("Pais") || "[]");
  // console.log(fav);

  const ind = fav.indexOf(valor);
  // console.log(ind);

  if(ind !== -1) {
    fav.splice(ind, 1);
    // fetchData(valor)
    // btn.textContent = "Favoritar ⭐";
    // alert("Removido com sucesso!");
  } else {
    fav.push(valor);
    // btn.textContent = "Remover ❌";
    // alert("Favoritado com sucesso!");
  }

  localStorage.setItem("Pais", JSON.stringify(fav));

}

async function main() {

  if(!localStorage.getItem("Pais")) {
    localStorage.setItem("Pais", JSON.stringify([]));
  }

  const dados = await fetchData();
  const select = document.querySelector("#select");
  const searchBtn = document.querySelector("#btn");
  const searchInput = document.querySelector("#inp");
  
  displayData(dados);

  
  select.addEventListener("change", () => {
    if(select.value === "Todos") {
      displayData(dados);
    } else if(select.value === "Favoritos") {
      const fav = JSON.parse(localStorage.getItem("Pais") || "[]");
      const filtrados = dados.filter(item => fav.includes(item.name.common));
      displayData(filtrados);
    } else {
      const filtrados = dados.filter(item => item.region === select.value);
      displayData(filtrados);
    }
  });
  
  searchBtn.addEventListener("click", () => {
    const inp = searchInput.value.trim();
    
    if(inp === "") return alert("Preencha o campo com o nome do Pais ou Capital");
    
    const result = dados.filter(item => item.name.common.includes(inp) || item.capital.includes(inp));
    
    displayData(result);

    setTimeout(() => {
        const inp = document.querySelector("#inp");
        inp.value = "";
        inp.focus();
    }, 25000);

  })
  
}

main();

const btn = document.getElementById("dark");

btn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  
  if(document.body.classList.contains("dark-mode")) {
    btn.textContent = "☀️ Modo Claro";
  } else {
    btn.textContent = "🌙 Modo Escuro";
  }
})