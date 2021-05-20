class JabroniDropdown {
    constructor(dropdown, input) {
        this.dropdown = dropdown;
        this.input = input;

        input.addEventListener("focus", (event) => {
            this.Focus(event)
        })

        input.addEventListener("focusout", (event) => {
            this.FocusOut(event)
        })

        input.addEventListener("keyup", (event) => {
            this.FilterOptions(event)
        })
    }

    Focus = () => {
        let dd = this.dropdown
        dd.style.display = "flex";  // Does it's job
    }
      
    FocusOut = () => {
        let dd = this.dropdown
        setTimeout(function() {
            dd.style.display = "none"  // Does it's job
        }, 200);
    }

    PopulateDiv = async function (data) {
        let dropdown = this.dropdown;
        let input = this.input;
        if (data.length >= 1) {
            data.forEach(await function (element, index){
                let name;
                let key;
                let option = document.createElement('div');
                if(typeof element === 'object' && element !== null) {
                    if("Name" in element) { name = element.Name } 
                    else if ("name" in element) { name = element.name } 
                    else if ("value" in element) { name = element.value }

                    if("Key" in element) { key = element.Key } 
                    else if ("id" in element) { key = element.id }
                    
                    option.innerHTML = name
                    option.setAttribute('data-key', key);
                    option.className = "option";
                    dropdown.append(option)
                    option.addEventListener("click", async function(e) {
                        e.preventDefault()
                        input.value = name
                        input.setAttribute('data-key', option.getAttribute('data-key'));
                    })
                } else {
                    option.innerHTML = element
                    option.className = "option";
                    dropdown.append(option)
                    option.addEventListener("click", async function(e) {
                        e.preventDefault()
                        input.value = element
                    })
                }
            })
        }
    }

    FilterOptions = function (event) {
        let dd = this.dropdown
        let options = dd.getElementsByClassName("option");
        event.preventDefault();
        if (event.keyCode !== 13) {
            let term = event.target.value.toLowerCase();
            Array.from(options).forEach(function(option){
                let val = option.innerText;
                if(val.toLowerCase().indexOf(term) != -1) {
                    option.style.display = "flex"
                } else {
                    option.style.display = "none"
                }
            })   
        }
    }
}
