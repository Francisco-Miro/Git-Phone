const JSON_PATH = '/brandLookup';

class Phones {
  constructor() {
    this._onJsonReadySamsung = this._onJsonReadySamsung.bind(this);
    this._onJsonReadyXiaomi = this._onJsonReadyXiaomi.bind(this);
    this._onJsonReadyIphone = this._onJsonReadyIphone.bind(this);
    this._onResponse = this._onResponse.bind(this);
    this._renderPhones = this._renderPhones.bind(this);
    this._renderX = this._renderX.bind(this);
    this._renderIphone = this._renderIphone.bind(this);
    this._menorPrecio = this._menorPrecio.bind(this);
    this._mayorPrecio = this._mayorPrecio.bind(this);

    const menorBoton = document.querySelector("#MenorPrecio");
    menorBoton.addEventListener("click", this._menorPrecio);
    const mayorBoton = document.querySelector("#MayorPrecio");
    mayorBoton.addEventListener("click", this._mayorPrecio);
  }

  _renderPhones() {
    const phoneContainer = document.querySelector("#S-container");
    const template = document.querySelector("#S-template");

    phoneContainer.innerHTML = "";

    const phoneData = this.Galaxy;

    phoneData.forEach(phone => {
      const phoneCard = document.importNode(template.content, true);

      phoneCard.querySelector(".phone-image").src = phone.imagen;
      phoneCard.querySelector(".phone-model").textContent = phone.modelo;
      phoneCard.querySelector(".phone-price").textContent = `$${phone.precio}`;
      phoneCard.querySelector(".phone-processor").textContent = phone.potencia_procesador;
      phoneCard.querySelector(".phone-storage").textContent = phone.almacenamiento;
      phoneCard.querySelector(".phone-screen").textContent = phone.pantalla;
      phoneCard.querySelector(".phone-camera").textContent = phone.camara_principal;
      phoneCard.querySelector(".phone-battery").textContent = phone.bateria;

      phoneContainer.appendChild(phoneCard);
    });
  }

  _renderX() {
    const phoneContainer = document.querySelector("#X-container");
    const template = document.querySelector("#X-template");

    phoneContainer.innerHTML = "";

    const phoneData = this.Xiaomi;

    phoneData.forEach(phone => {
      const phoneCard = document.importNode(template.content, true);

      phoneCard.querySelector(".phone-image").src = phone.imagen;
      phoneCard.querySelector(".phone-model").textContent = phone.modelo;
      phoneCard.querySelector(".phone-price").textContent = `$${phone.precio}`;
      phoneCard.querySelector(".phone-processor").textContent = phone.potencia_procesador;
      phoneCard.querySelector(".phone-storage").textContent = phone.almacenamiento;
      phoneCard.querySelector(".phone-screen").textContent = phone.pantalla;
      phoneCard.querySelector(".phone-camera").textContent = phone.camara_principal;
      phoneCard.querySelector(".phone-battery").textContent = phone.bateria;

      phoneContainer.appendChild(phoneCard);
    });
  }

  _renderIphone() {
    const phoneContainer = document.querySelector("#A-container");
    const template = document.querySelector("#A-template");

    phoneContainer.innerHTML = "";

    const phoneData = this.iPhone;

    phoneData.forEach(phone => {
      const phoneCard = document.importNode(template.content, true);

      phoneCard.querySelector(".phone-image").src = phone.imagen;
      phoneCard.querySelector(".phone-model").textContent = phone.modelo;
      phoneCard.querySelector(".phone-price").textContent = `$${phone.precio}`;
      phoneCard.querySelector(".phone-processor").textContent = phone.potencia_procesador;
      phoneCard.querySelector(".phone-storage").textContent = phone.almacenamiento;
      phoneCard.querySelector(".phone-screen").textContent = phone.pantalla;
      phoneCard.querySelector(".phone-camera").textContent = phone.camara_principal;
      phoneCard.querySelector(".phone-battery").textContent = phone.bateria;

      phoneContainer.appendChild(phoneCard);
    });
  }

  _menorPrecio() {
    this.Galaxy.sort((a1, a2) => a1.precio - a2.precio);
    this.Xiaomi.sort((a1, a2) => a1.precio - a2.precio);
    this.iPhone.sort((a1, a2) => a1.precio - a2.precio);
    this._renderPhones();
    this._renderX();
    this._renderIphone();
  }

  _mayorPrecio() {
    this.Galaxy.sort((a1, a2) => a2.precio - a1.precio);
    this.Xiaomi.sort((a1, a2) => a2.precio - a1.precio);
    this.iPhone.sort((a1, a2) => a2.precio - a1.precio);
    this._renderPhones();
    this._renderX();
    this._renderIphone();
  }

  loadPhones() {
    fetch(JSON_PATH + '/Samsung')
      .then(this._onResponse)
      .then(this._onJsonReadySamsung);

    fetch(JSON_PATH + '/Xiaomi')
      .then(this._onResponse)
      .then(this._onJsonReadyXiaomi);

    fetch(JSON_PATH + '/iPhone')
      .then(this._onResponse)
      .then(this._onJsonReadyIphone);
  }

  _onJsonReadySamsung(json) {
    this.Galaxy = json.Samsung;
    this._renderPhones();
  }

  _onJsonReadyXiaomi(json) {
    this.Xiaomi = json.Xiaomi;
    this._renderX();
  }

  _onJsonReadyIphone(json) {
    this.iPhone = json.iPhone;
    this._renderIphone();
  }

  _onResponse(response) {
    return response.json();
  }
}

const app = new Phones();
app.loadPhones();
