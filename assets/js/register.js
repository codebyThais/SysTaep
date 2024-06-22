document.addEventListener('DOMContentLoaded', function() {
    $('#phone').mask('(00) 00000-0000');
    $('#birthday').mask('00/00/0000');
    $('#cpf').mask('000.000.000-00', {reverse: true});
    $('.cep').mask('00000-000');

    $('input[type=radio][name=typePhone]').change(function() {
        $('#phone').val('');
    
        if (this.value === 'landline') {
          $('#phone').mask('(00) 0000-0000');
          $('#phone').attr('placeholder', '(00) 0000-0000');
        } else if (this.value === 'cellPhone') {
          $('#phone').mask('(00) 00000-0000');
          $('#phone').attr('placeholder', '(00) 00000-0000');
        }
    });
});

// Full Name
document.getElementById('fullName').addEventListener('input', function() {
    var input = this;
    var sanitizedValue = input.value.toUpperCase();
    var maxLength = parseInt(input.getAttribute('maxlength'));

    sanitizedValue = sanitizedValue.replace(/[^A-Z\s]/g, '');
  
    sanitizedValue = sanitizedValue.replace(/\s+/g, ' ');

    input.value = sanitizedValue.slice(0, maxLength);
    document.getElementById('charLimitMessage').textContent = sanitizedValue.length === maxLength ? 'Limite de caracteres alcançado.' : '';
});  

// Function to clear fields in containerTYA-M
function clearManualFields() {
    document.getElementById("cep-m").value = "";
    document.getElementById("district-m").value = "";
    document.getElementById("address-lm").value = "";
    document.getElementById("number-m").value = "";
    document.getElementById("addressComplement-m").value = "";
}

// Function to clear fields in containerTYA-CEP
function clearCepFields() {
    document.getElementById("cep-s").value = "";
    document.getElementById("state").value = "";
    document.getElementById("city").value = "";
    document.getElementById("district").value = "";
    document.getElementById("address-l").value = "";
    document.getElementById("number").value = "";
    document.getElementById("addressComplement").value = "";
}

// Function to toggle container visibility
function toggleContainers() {
    var manualContainer = document.querySelector("containerTYA-M");
    var cepContainer = document.querySelector("containerTYA-CEP");

    var tyAMRadio = document.getElementById("tyA-M");
    var tyACepRadio = document.getElementById("tyA-Cep");

    // Check if "Manual" radio is selected
    if (tyAMRadio.checked) {
        manualContainer.style.display = "block";
        cepContainer.style.display = "none";
        clearCepFields();
    } else {
        manualContainer.style.display = "none";
        cepContainer.style.display = "block";   
        clearManualFields();
    }
}

// Add event listener to radio elements
document.getElementById("tyA-M").addEventListener("change", toggleContainers);
document.getElementById("tyA-Cep").addEventListener("change", toggleContainers);

toggleContainers();

// tyA-Cep search
function searchAddress() {
    var cep = document.getElementById('cep-s').value;
    var url = 'https://viacep.com.br/ws/' + cep + '/json/';

    $.getJSON(url, function (data) {
        if (!("erro" in data)) {
            document.getElementById('state').value = data.uf;
            document.getElementById('city').value = data.localidade;
            document.getElementById('district').value = data.bairro;
            document.getElementById('address-l').value = data.logradouro;
            
            document.getElementById('cepNotFound').textContent = "";
        } else {
            document.getElementById('cepNotFound').textContent = "CEP não encontrado.";
        }
    });
}

function clearErrorMessage() {
    document.getElementById('cepNotFound').textContent = "";
}

document.getElementById("number").addEventListener("input", function() {
    this.value = this.value.toUpperCase().slice(0, 6);
});

// tyA-M search
function searchAddressM() {
    var url = ("https://servicodados.ibge.gov.br/api/v1/localidades/estados", '.state-wrapper .options');
    
    // Make AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            fillAddressFields(response);
        } else {
            // Clear fields if no data is found
            clearAddressFields();
            alert("No address information found!");
        }
        }
    };
    xhr.send();
    } 
    
    const stateWrapper = document.querySelector(".state-wrapper"),
        stateSelectBtn = stateWrapper.querySelector(".select-btn"),
        stateSearchInp = stateWrapper.querySelector("input"),
        stateOptions = stateWrapper.querySelector(".options");
    
    const cityWrapper = document.querySelector(".city-wrapper"),
        citySelectBtn = cityWrapper.querySelector(".select-btn"),
        citySearchInp = cityWrapper.querySelector("input"),
        cityOptions = cityWrapper.querySelector(".options");
    
    let states = [];
    let selectedState = null;
    let cities = [];
    let selectedCity = null;
    
    async function fetchStates() {
        try {
            const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
            const data = await response.json();
            states = data.map(state => ({ id: state.id, nome: state.nome }));
            addState();
        } catch (error) {
            console.error('Erro ao buscar estados:', error);
        }
    }
    
    async function fetchCities(stateId) {
        try {
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`);
            const data = await response.json();
            cities = data.map(city => city.nome);
            addCity();
        } catch (error) {
            console.error('Erro ao buscar cidades:', error);
        }
    }
    
    function addState(selectedStateName) {
        stateOptions.innerHTML = "";
        states.forEach(state => {
            let isSelected = state.nome == selectedStateName ? "selected" : "";
            let li = `<li onclick="updateState(this, ${state.id})" class="${isSelected}">${state.nome}</li>`;
            stateOptions.insertAdjacentHTML("beforeend", li);
        });
    }
    
    function addCity(selectedCity) {
        cityOptions.innerHTML = "";
        cities.forEach(city => {
            let isSelected = city == selectedCity ? "selected" : "";
            let li = `<li onclick="updateCity(this)" class="${isSelected}">${city}</li>`;
            cityOptions.insertAdjacentHTML("beforeend", li);
        });
    }
    
    function updateState(selectedLi, stateId) {
        stateSearchInp.value = "";
        addState(selectedLi.innerText);
        stateWrapper.classList.remove("active");
        stateSelectBtn.firstElementChild.innerText = selectedLi.innerText;
        selectedState = stateId;
        citySelectBtn.firstElementChild.innerText = "Selecione uma cidade";
        citySearchInp.placeholder = "Pesquisar...";
        fetchCities(stateId);
    }
    
    function updateCity(selectedLi) {
        citySearchInp.value = "";
        addCity(selectedLi.innerText);
        cityWrapper.classList.remove("active");
        citySelectBtn.firstElementChild.innerText = selectedLi.innerText;
    }
    
    stateSearchInp.addEventListener("keyup", () => {
        let arr = [];
        let searchWord = stateSearchInp.value.toLowerCase();
        arr = states.filter(data => {
            return data.nome.toLowerCase().startsWith(searchWord);
        }).map(data => {
            let isSelected = data.nome == stateSelectBtn.firstElementChild.innerText ? "selected" : "";
            return `<li onclick="updateState(this, ${data.id})" class="${isSelected}">${data.nome}</li>`;
        }).join("");
        stateOptions.innerHTML = arr ? arr : `<p style="margin-top: 10px;">Oops! Estado não encontrado</p>`;
    });
    
    citySearchInp.addEventListener("keyup", () => {
        let arr = [];
        let searchWord = citySearchInp.value.toLowerCase();
        arr = cities.filter(data => {
            return data.toLowerCase().startsWith(searchWord);
        }).map(data => {
            let isSelected = data == citySelectBtn.firstElementChild.innerText ? "selected" : "";
            return `<li onclick="updateCity(this)" class="${isSelected}">${data}</li>`;
        }).join("");
        cityOptions.innerHTML = arr ? arr : `<p style="margin-top: 10px;">Oops! ${selectedState ? "Cidade não encontrada" : "Selecione o estado primeiro"}</p>`;
    });
    
    stateSelectBtn.addEventListener("click", () => stateWrapper.classList.toggle("active"));
    citySelectBtn.addEventListener("click", () => {
        if (!citySearchInp.disabled) {
            cityWrapper.classList.toggle("active");
        }
    });
    
fetchStates();

document.getElementById("district-m").addEventListener("input", function() {
    let sanitizedValue = this.value.toUpperCase();
    
    sanitizedValue = sanitizedValue.replace(/[^A-Z\s]/g, '');
    
    sanitizedValue = sanitizedValue.replace(/\s+/g, ' ');
    
    this.value = sanitizedValue.slice(0, 30);
});

document.getElementById("address-lm").addEventListener("input", function() {
    let sanitizedValue = this.value.toUpperCase();
    
    sanitizedValue = sanitizedValue.replace(/[^A-Z\s]/g, '');
    
    sanitizedValue = sanitizedValue.replace(/\s+/g, ' ');
        
    this.value = sanitizedValue.slice(0, 30);
});


document.getElementById("number-m").addEventListener("input", function() {
    this.value = this.value.toUpperCase().slice(0, 6);
});